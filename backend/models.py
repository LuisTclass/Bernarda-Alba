from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum
import uuid

# Enums
class QuestionType(str, Enum):
    multiple = "multiple"
    boolean = "boolean"
    essay = "essay"

class Category(str, Enum):
    personajes = "personajes"
    temas = "temas"
    simbolismo = "simbolismo"

class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class QuizMode(str, Enum):
    practice = "practice"
    exam = "exam"
    review = "review"

class QuizStatus(str, Enum):
    in_progress = "in_progress"
    completed = "completed"
    abandoned = "abandoned"

# User Models
class UserStats(BaseModel):
    total_questions: int = 0
    correct_answers: int = 0
    streak: int = 0
    best_streak: int = 0
    level: str = "Principiante"
    xp: int = 0

class CategoryStats(BaseModel):
    correct: int = 0
    total: int = 0

class CategoryProgress(BaseModel):
    personajes: CategoryStats = CategoryStats()
    temas: CategoryStats = CategoryStats()
    simbolismo: CategoryStats = CategoryStats()

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    stats: UserStats = UserStats()
    category_progress: CategoryProgress = CategoryProgress()

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime
    stats: UserStats
    category_progress: CategoryProgress

# Question Models
class Question(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: QuestionType
    category: Category
    question: str
    options: Optional[List[str]] = None
    correct_answer: Union[int, bool, str]
    explanation: str
    difficulty: Difficulty
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None

class QuestionCreate(BaseModel):
    type: QuestionType
    category: Category
    question: str
    options: Optional[List[str]] = None
    correct_answer: Union[int, bool, str]
    explanation: str
    difficulty: Difficulty

class QuestionResponse(BaseModel):
    id: str
    type: str
    category: str
    question: str
    options: Optional[List[str]]
    difficulty: str

# Quiz Models
class QuizAnswer(BaseModel):
    question_id: str
    user_answer: Union[int, bool, str]
    is_correct: Optional[bool] = None
    time_spent: Optional[int] = None

class Quiz(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    mode: QuizMode
    questions: List[str]  # Question IDs
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    status: QuizStatus = QuizStatus.in_progress
    answers: List[QuizAnswer] = []
    score: Optional[int] = None
    percentage: Optional[float] = None

class QuizStart(BaseModel):
    mode: QuizMode
    category: Optional[Category] = None
    difficulty: Optional[Difficulty] = None
    question_count: Optional[int] = None

class QuizStartResponse(BaseModel):
    quiz_id: str
    questions: List[QuestionResponse]
    start_time: datetime

class AnswerSubmit(BaseModel):
    question_id: str
    user_answer: Union[int, bool, str]
    time_spent: Optional[int] = None

class AnswerResponse(BaseModel):
    correct: bool
    explanation: Optional[str] = None
    next_question_id: Optional[str] = None

class QuizFinish(BaseModel):
    end_time: datetime
    answers: List[QuizAnswer]

class QuizResults(BaseModel):
    quiz_id: str
    mode: str
    score: int
    total: int
    percentage: float
    time_taken: Optional[int] = None
    category_breakdown: Dict[str, Dict[str, int]]
    incorrect_questions: List[str]

# Progress Models
class UserProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    question_id: str
    is_correct: bool
    attempts: int = 1
    last_answered: datetime = Field(default_factory=datetime.utcnow)
    time_spent: Optional[int] = None

class TopicProgress(BaseModel):
    name: str
    status: str  # 'completed', 'in_progress', 'pending'
    progress: int  # percentage
    questions_total: int
    questions_correct: int

class ProgressResponse(BaseModel):
    level: str
    xp: int
    next_level_xp: int
    topics: List[TopicProgress]
    category_stats: Dict[str, Dict[str, Union[int, float]]]

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None