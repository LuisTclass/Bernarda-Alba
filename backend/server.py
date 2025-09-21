from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Optional

# Import our models and modules
from models import *
from database import Database
from auth import authenticate_user, create_access_token, get_current_user, get_password_hash
from quiz_logic import QuizLogic
from seed_data import seed_database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="La Casa de Bernarda Alba - Quiz API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Startup event to seed database
@app.on_event("startup")
async def startup_event():
    await seed_database()

# Auth endpoints
@api_router.post("/users/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await Database.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password
    )
    
    created_user = await Database.create_user(user)
    return UserResponse(**created_user.dict())

@api_router.post("/users/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30 * 24)  # 30 days
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token)

@api_router.get("/users/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

# Question endpoints
@api_router.get("/questions", response_model=List[QuestionResponse])
async def get_questions(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: Optional[int] = None
):
    questions = await Database.get_questions(category, difficulty, limit)
    return [
        QuestionResponse(
            id=q.id,
            type=q.type.value,
            category=q.category.value,
            question=q.question,
            options=q.options,
            difficulty=q.difficulty.value
        ) for q in questions
    ]

@api_router.get("/questions/{question_id}")
async def get_question(question_id: str):
    question = await Database.get_question_by_id(question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Don't include correct answer in response for security
    return QuestionResponse(
        id=question.id,
        type=question.type.value,
        category=question.category.value,
        question=question.question,
        options=question.options,
        difficulty=question.difficulty.value
    )

# Quiz endpoints
@api_router.post("/quiz/start", response_model=QuizStartResponse)
async def start_quiz(
    quiz_data: QuizStart,
    current_user: User = Depends(get_current_user)
):
    questions = await QuizLogic.generate_quiz_questions(
        mode=quiz_data.mode,
        user_id=current_user.id,
        category=quiz_data.category,
        difficulty=quiz_data.difficulty,
        question_count=quiz_data.question_count
    )
    
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for the specified criteria")
    
    quiz = Quiz(
        user_id=current_user.id,
        mode=quiz_data.mode,
        questions=[q.id for q in questions]
    )
    
    created_quiz = await Database.create_quiz(quiz)
    
    question_responses = [
        QuestionResponse(
            id=q.id,
            type=q.type.value,
            category=q.category.value,
            question=q.question,
            options=q.options,
            difficulty=q.difficulty.value
        ) for q in questions
    ]
    
    return QuizStartResponse(
        quiz_id=created_quiz.id,
        questions=question_responses,
        start_time=created_quiz.start_time
    )

@api_router.post("/quiz/{quiz_id}/answer", response_model=AnswerResponse)
async def submit_answer(
    quiz_id: str,
    answer_data: AnswerSubmit,
    current_user: User = Depends(get_current_user)
):
    quiz = await Database.get_quiz_by_id(quiz_id)
    if not quiz or quiz.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    question = await Database.get_question_by_id(answer_data.question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = QuizLogic.check_answer(question, answer_data.user_answer)
    
    # Create quiz answer
    quiz_answer = QuizAnswer(
        question_id=answer_data.question_id,
        user_answer=answer_data.user_answer,
        is_correct=is_correct,
        time_spent=answer_data.time_spent
    )
    
    # Update quiz with answer
    quiz.answers.append(quiz_answer)
    await Database.update_quiz(quiz_id, {"answers": [a.dict() for a in quiz.answers]})
    
    # Update user progress
    progress = UserProgress(
        user_id=current_user.id,
        question_id=answer_data.question_id,
        is_correct=is_correct,
        time_spent=answer_data.time_spent
    )
    await Database.create_or_update_progress(progress)
    
    # For practice mode, return explanation
    explanation = question.explanation if quiz.mode == QuizMode.practice else None
    
    return AnswerResponse(
        correct=is_correct,
        explanation=explanation
    )

@api_router.post("/quiz/{quiz_id}/finish", response_model=QuizResults)
async def finish_quiz(
    quiz_id: str,
    finish_data: QuizFinish,
    current_user: User = Depends(get_current_user)
):
    quiz = await Database.get_quiz_by_id(quiz_id)
    if not quiz or quiz.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Update quiz status
    quiz.end_time = finish_data.end_time
    quiz.status = QuizStatus.completed
    
    # Calculate results
    results = await QuizLogic.calculate_quiz_results(quiz)
    
    # Update quiz with final score
    await Database.update_quiz(quiz_id, {
        "end_time": quiz.end_time,
        "status": quiz.status.value,
        "score": results.score,
        "percentage": results.percentage
    })
    
    # Update user statistics
    updated_stats, updated_progress = await QuizLogic.update_user_progress(current_user, results)
    await Database.update_user_stats(current_user.id, updated_stats, updated_progress)
    
    return results

@api_router.get("/quiz/{quiz_id}/results", response_model=QuizResults)
async def get_quiz_results(
    quiz_id: str,
    current_user: User = Depends(get_current_user)
):
    quiz = await Database.get_quiz_by_id(quiz_id)
    if not quiz or quiz.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    return await QuizLogic.calculate_quiz_results(quiz)

# Stats and Progress endpoints
@api_router.get("/users/stats")
async def get_user_stats(current_user: User = Depends(get_current_user)):
    category_stats = await Database.get_user_category_stats(current_user.id)
    
    return {
        "total_questions": current_user.stats.total_questions,
        "correct_answers": current_user.stats.correct_answers,
        "streak": current_user.stats.streak,
        "average_time": 45,  # This would need to be calculated from actual data
        "category_stats": category_stats
    }

@api_router.get("/users/progress", response_model=ProgressResponse)
async def get_user_progress(current_user: User = Depends(get_current_user)):
    category_stats = await Database.get_user_category_stats(current_user.id)
    
    # Generate topic progress
    topics = []
    for category, stats in category_stats.items():
        if stats["total"] > 0:
            progress_pct = (stats["correct"] / stats["total"]) * 100
            if progress_pct >= 90:
                status = "completed"
            elif progress_pct >= 50:
                status = "in_progress"
            else:
                status = "pending"
            
            topics.append(TopicProgress(
                name=category.title(),
                status=status,
                progress=int(progress_pct),
                questions_total=stats["total"],
                questions_correct=stats["correct"]
            ))
    
    next_level_xp = QuizLogic.get_next_level_xp(current_user.stats.level)
    
    return ProgressResponse(
        level=current_user.stats.level,
        xp=current_user.stats.xp,
        next_level_xp=next_level_xp,
        topics=topics,
        category_stats=category_stats
    )

@api_router.get("/users/wrong-questions", response_model=List[str])
async def get_wrong_questions(current_user: User = Depends(get_current_user)):
    return await Database.get_user_wrong_questions(current_user.id)

# Legacy endpoint for compatibility
@api_router.get("/")
async def root():
    return {"message": "La Casa de Bernarda Alba Quiz API - Ready!"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
