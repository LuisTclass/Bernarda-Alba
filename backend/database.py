from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
import os
from models import *
import logging

logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
users_collection = db.users
questions_collection = db.questions
quizzes_collection = db.quizzes
progress_collection = db.user_progress

class Database:
    @staticmethod
    async def create_user(user: User) -> User:
        """Create a new user"""
        user_dict = user.dict()
        result = await users_collection.insert_one(user_dict)
        user_dict['_id'] = result.inserted_id
        return User(**user_dict)
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        """Get user by email"""
        user_dict = await users_collection.find_one({"email": email})
        if user_dict:
            return User(**user_dict)
        return None
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[User]:
        """Get user by ID"""
        user_dict = await users_collection.find_one({"id": user_id})
        if user_dict:
            return User(**user_dict)
        return None
    
    @staticmethod
    async def update_user_stats(user_id: str, stats: UserStats, category_progress: CategoryProgress):
        """Update user statistics and category progress"""
        await users_collection.update_one(
            {"id": user_id},
            {"$set": {"stats": stats.dict(), "category_progress": category_progress.dict()}}
        )
    
    @staticmethod
    async def create_question(question: Question) -> Question:
        """Create a new question"""
        question_dict = question.dict()
        result = await questions_collection.insert_one(question_dict)
        question_dict['_id'] = result.inserted_id
        return Question(**question_dict)
    
    @staticmethod
    async def get_questions(
        category: Optional[str] = None,
        difficulty: Optional[str] = None,
        limit: Optional[int] = None
    ) -> List[Question]:
        """Get questions with filters"""
        filter_dict = {}
        if category:
            filter_dict["category"] = category
        if difficulty:
            filter_dict["difficulty"] = difficulty
        
        cursor = questions_collection.find(filter_dict)
        if limit:
            cursor = cursor.limit(limit)
        
        questions = []
        async for question_dict in cursor:
            questions.append(Question(**question_dict))
        return questions
    
    @staticmethod
    async def get_question_by_id(question_id: str) -> Optional[Question]:
        """Get question by ID"""
        question_dict = await questions_collection.find_one({"id": question_id})
        if question_dict:
            return Question(**question_dict)
        return None
    
    @staticmethod
    async def create_quiz(quiz: Quiz) -> Quiz:
        """Create a new quiz"""
        quiz_dict = quiz.dict()
        result = await quizzes_collection.insert_one(quiz_dict)
        quiz_dict['_id'] = result.inserted_id
        return Quiz(**quiz_dict)
    
    @staticmethod
    async def get_quiz_by_id(quiz_id: str) -> Optional[Quiz]:
        """Get quiz by ID"""
        quiz_dict = await quizzes_collection.find_one({"id": quiz_id})
        if quiz_dict:
            return Quiz(**quiz_dict)
        return None
    
    @staticmethod
    async def update_quiz(quiz_id: str, update_data: Dict[str, Any]):
        """Update quiz data"""
        await quizzes_collection.update_one(
            {"id": quiz_id},
            {"$set": update_data}
        )
    
    @staticmethod
    async def get_user_wrong_questions(user_id: str, limit: Optional[int] = None) -> List[str]:
        """Get question IDs that user answered incorrectly"""
        pipeline = [
            {"$match": {"user_id": user_id, "is_correct": False}},
            {"$group": {"_id": "$question_id"}},
        ]
        if limit:
            pipeline.append({"$limit": limit})
        
        cursor = progress_collection.aggregate(pipeline)
        wrong_questions = []
        async for result in cursor:
            wrong_questions.append(result["_id"])
        return wrong_questions
    
    @staticmethod
    async def create_or_update_progress(progress: UserProgress):
        """Create or update user progress for a question"""
        existing = await progress_collection.find_one({
            "user_id": progress.user_id,
            "question_id": progress.question_id
        })
        
        if existing:
            await progress_collection.update_one(
                {"user_id": progress.user_id, "question_id": progress.question_id},
                {
                    "$set": {
                        "is_correct": progress.is_correct,
                        "last_answered": progress.last_answered,
                        "time_spent": progress.time_spent
                    },
                    "$inc": {"attempts": 1}
                }
            )
        else:
            await progress_collection.insert_one(progress.dict())
    
    @staticmethod
    async def get_user_category_stats(user_id: str) -> Dict[str, Dict[str, int]]:
        """Get user statistics by category"""
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$lookup": {
                "from": "questions",
                "localField": "question_id",
                "foreignField": "id",
                "as": "question"
            }},
            {"$unwind": "$question"},
            {"$group": {
                "_id": "$question.category",
                "total": {"$sum": 1},
                "correct": {"$sum": {"$cond": [{"$eq": ["$is_correct", True]}, 1, 0]}}
            }}
        ]
        
        stats = {}
        async for result in progress_collection.aggregate(pipeline):
            category = result["_id"]
            stats[category] = {
                "correct": result["correct"],
                "total": result["total"],
                "percentage": round((result["correct"] / result["total"]) * 100) if result["total"] > 0 else 0
            }
        
        return stats