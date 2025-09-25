import random
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from models import *
from database import Database

class QuizLogic:
    @staticmethod
    async def generate_quiz_questions(
        mode: QuizMode,
        user_id: str,
        category: Optional[Category] = None,
        difficulty: Optional[Difficulty] = None,
        question_count: Optional[int] = None
    ) -> List[Question]:
        """Generate questions for a quiz based on mode and filters"""
        
        if mode == QuizMode.exam:
            # For exam mode, select 20 random questions
            question_count = 20
            questions = await Database.get_questions()
            return random.sample(questions, min(question_count, len(questions)))
        
        elif mode == QuizMode.review:
            # For review mode, get questions user answered incorrectly
            wrong_question_ids = await Database.get_user_wrong_questions(user_id, limit=15)
            questions = []
            for q_id in wrong_question_ids:
                question = await Database.get_question_by_id(q_id)
                if question:
                    questions.append(question)
            return questions
        
        else:  # practice mode
            # For practice mode, use filters if provided
            questions = await Database.get_questions(
                category=category.value if category else None,
                difficulty=difficulty.value if difficulty else None,
                limit=question_count
            )
            return questions
    
    @staticmethod
    def check_answer(question: Question, user_answer: Union[int, bool, str]) -> bool:
        """Check if user answer is correct"""
        if question.type == QuestionType.boolean:
            return bool(user_answer) == question.correct_answer
        elif question.type == QuestionType.multiple:
            return int(user_answer) == question.correct_answer
        else:  # essay type
            # For essays, we can't automatically check correctness
            # Return True for now, manual grading would be needed
            return True
    
    @staticmethod
    async def calculate_quiz_results(quiz: Quiz) -> QuizResults:
        """Calculate comprehensive quiz results"""
        total_questions = len(quiz.questions)
        correct_answers = sum(1 for answer in quiz.answers if answer.is_correct)
        percentage = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        
        # Calculate time taken
        time_taken = None
        if quiz.end_time and quiz.start_time:
            time_taken = int((quiz.end_time - quiz.start_time).total_seconds())
        
        # Calculate category breakdown
        category_breakdown = {}
        incorrect_questions = []
        
        for answer in quiz.answers:
            question = await Database.get_question_by_id(answer.question_id)
            if question:
                category = question.category.value
                if category not in category_breakdown:
                    category_breakdown[category] = {"correct": 0, "total": 0}
                
                category_breakdown[category]["total"] += 1
                if answer.is_correct:
                    category_breakdown[category]["correct"] += 1
                else:
                    incorrect_questions.append(answer.question_id)
        
        return QuizResults(
            quiz_id=quiz.id,
            mode=quiz.mode.value,
            score=correct_answers,
            total=total_questions,
            percentage=round(percentage, 1),
            time_taken=time_taken,
            category_breakdown=category_breakdown,
            incorrect_questions=incorrect_questions
        )
    
    @staticmethod
    async def update_user_progress(user: User, quiz_results: QuizResults) -> Tuple[UserStats, CategoryProgress]:
        """Update user statistics and progress based on quiz results"""
        stats = user.stats
        category_progress = user.category_progress
        
        # Update general stats
        stats.total_questions += quiz_results.total
        stats.correct_answers += quiz_results.score
        
        # Update streak
        if quiz_results.percentage >= 80:  # Consider 80%+ as good performance
            stats.streak += 1
            stats.best_streak = max(stats.best_streak, stats.streak)
        else:
            stats.streak = 0
        
        # Update XP and level
        xp_gained = quiz_results.score * 10  # 10 XP per correct answer
        if quiz_results.mode == "exam":
            xp_gained *= 2  # Double XP for exam mode
        
        stats.xp += xp_gained
        
        # Update level based on XP
        if stats.xp >= 2000:
            stats.level = "Experto"
        elif stats.xp >= 1500:
            stats.level = "Avanzado"
        elif stats.xp >= 800:
            stats.level = "Intermedio"
        else:
            stats.level = "Principiante"
        
        # Update category progress
        for category, breakdown in quiz_results.category_breakdown.items():
            if category == "personajes":
                category_progress.personajes.correct += breakdown["correct"]
                category_progress.personajes.total += breakdown["total"]
            elif category == "temas":
                category_progress.temas.correct += breakdown["correct"]
                category_progress.temas.total += breakdown["total"]
            elif category == "simbolismo":
                category_progress.simbolismo.correct += breakdown["correct"]
                category_progress.simbolismo.total += breakdown["total"]
        
        return stats, category_progress
    
    @staticmethod
    def get_next_level_xp(current_level: str) -> int:
        """Get XP required for next level"""
        level_thresholds = {
            "Principiante": 800,
            "Intermedio": 1500,
            "Avanzado": 2000,
            "Experto": 3000
        }
        return level_thresholds.get(current_level, 3000)