from database import Database
from models import Question, QuestionType, Category, Difficulty

# Seed data - Las mismas preguntas del mock pero en el formato de la base de datos
SEED_QUESTIONS = [
    {
        "type": QuestionType.multiple,
        "category": Category.personajes,
        "question": "¿Cuántas hijas tiene Bernarda Alba?",
        "options": ["4", "5", "6", "7"],
        "correct_answer": 1,
        "explanation": "Bernarda Alba tiene cinco hijas: Angustias, Magdalena, Amelia, Martirio y Adela.",
        "difficulty": Difficulty.easy
    },
    {
        "type": QuestionType.multiple,
        "category": Category.temas,
        "question": "¿Qué simboliza el color blanco en la obra?",
        "options": ["La pureza y la virginidad", "La muerte", "La represión", "La libertad"],
        "correct_answer": 0,
        "explanation": "El blanco simboliza la pureza y la virginidad, especialmente asociado con Adela.",
        "difficulty": Difficulty.medium
    },
    {
        "type": QuestionType.boolean,
        "category": Category.personajes,
        "question": "Adela es la hija mayor de Bernarda Alba",
        "correct_answer": False,
        "explanation": "Adela es la hija menor de Bernarda. La mayor es Angustias.",
        "difficulty": Difficulty.easy
    },
    {
        "type": QuestionType.multiple,
        "category": Category.simbolismo,
        "question": "¿Qué representa el bastón de Bernarda?",
        "options": ["Su vejez", "El poder patriarcal", "Su enfermedad", "La tradición"],
        "correct_answer": 1,
        "explanation": "El bastón de Bernarda representa el poder patriarcal y la autoridad represiva.",
        "difficulty": Difficulty.hard
    },
    {
        "type": QuestionType.essay,
        "category": Category.temas,
        "question": "Explica el tema de la represión femenina en La Casa de Bernarda Alba (máximo 150 palabras)",
        "correct_answer": "",
        "explanation": "La represión femenina es el tema central de la obra. Bernarda impone un luto riguroso de ocho años tras la muerte de su marido, encerrando a sus hijas y negándoles cualquier libertad. Esta represión se manifiesta en la prohibición de salir, relacionarse con hombres o expresar sus deseos. Las hijas representan diferentes reacciones: sumisión (Angustias, Magdalena), resignación (Amelia), rebeldía contenida (Martirio) y rebeldía abierta (Adela). La casa se convierte en una cárcel donde la tradición y el qué dirán priman sobre la felicidad individual.",
        "difficulty": Difficulty.hard
    },
    {
        "type": QuestionType.boolean,
        "category": Category.simbolismo,
        "question": "El caballo garañón simboliza la pasión y la sexualidad masculina",
        "correct_answer": True,
        "explanation": "El caballo garañón efectivamente simboliza la fuerza sexual masculina y la pasión reprimida.",
        "difficulty": Difficulty.medium
    },
    {
        "type": QuestionType.multiple,
        "category": Category.personajes,
        "question": "¿Quién es Pepe el Romano?",
        "options": ["El pretendiente de Adela", "El novio de Angustias", "Ambas respuestas son correctas", "El marido fallecido de Bernarda"],
        "correct_answer": 2,
        "explanation": "Pepe el Romano está comprometido oficialmente con Angustias por su dinero, pero mantiene una relación secreta con Adela.",
        "difficulty": Difficulty.medium
    },
    {
        "type": QuestionType.essay,
        "category": Category.simbolismo,
        "question": "Analiza el simbolismo del agua en la obra (máximo 100 palabras)",
        "correct_answer": "",
        "explanation": "El agua simboliza la vida, la fertilidad y la purificación. Su ausencia representa la sequedad emocional y sexual de la casa. Las referencias al pozo, la sed y el calor refuerzan la sensación de ahogo y represión. El agua también se asocia con lo femenino y lo maternal, elementos negados en este hogar donde prevalece la rigidez.",
        "difficulty": Difficulty.hard
    },
    {
        "type": QuestionType.boolean,
        "category": Category.temas,
        "question": "La obra pertenece al género de la tragedia rural",
        "correct_answer": True,
        "explanation": "Lorca definió la obra como drama de mujeres en los pueblos de España, siendo considerada una tragedia rural.",
        "difficulty": Difficulty.easy
    },
    {
        "type": QuestionType.multiple,
        "category": Category.personajes,
        "question": "¿Qué personaje representa la voz del pueblo?",
        "options": ["La Poncia", "María Josefa", "Prudencia", "La criada"],
        "correct_answer": 0,
        "explanation": "La Poncia actúa como confidente y representa la sabiduría popular y la voz del pueblo.",
        "difficulty": Difficulty.medium
    },
    # Agregar más preguntas para tener un banco más amplio
    {
        "type": QuestionType.multiple,
        "category": Category.simbolismo,
        "question": "¿Qué simboliza el color negro en la obra?",
        "options": ["La noche", "El luto y la muerte", "La elegancia", "El misterio"],
        "correct_answer": 1,
        "explanation": "El color negro simboliza principalmente el luto riguroso y la muerte que domina la casa.",
        "difficulty": Difficulty.easy
    },
    {
        "type": QuestionType.boolean,
        "category": Category.personajes,
        "question": "Martirio está enamorada en secreto de Pepe el Romano",
        "correct_answer": True,
        "explanation": "Martirio siente una pasión no correspondida por Pepe el Romano, lo que genera su amargura.",
        "difficulty": Difficulty.medium
    },
    {
        "type": QuestionType.multiple,
        "category": Category.temas,
        "question": "¿Cuál es el tema principal de la obra?",
        "options": ["El amor", "La represión y la autoridad", "La pobreza", "La educación"],
        "correct_answer": 1,
        "explanation": "El tema central es la represión ejercida por la autoridad patriarcal sobre las mujeres.",
        "difficulty": Difficulty.easy
    },
    {
        "type": QuestionType.essay,
        "category": Category.personajes,
        "question": "Describe la personalidad y función dramática de La Poncia",
        "correct_answer": "",
        "explanation": "La Poncia es la criada más antigua y confidente de Bernarda. Representa la voz del pueblo y la sabiduría popular. Su función dramática es servir como contrapunto a la rigidez de Bernarda, advirtiendo sobre los peligros de tanta represión. Es observadora, práctica y conoce los secretos de la familia.",
        "difficulty": Difficulty.medium
    },
    {
        "type": QuestionType.boolean,
        "category": Category.simbolismo,
        "question": "Las paredes gruesas de la casa simbolizan el aislamiento social",
        "correct_answer": True,
        "explanation": "Las paredes gruesas representan tanto el aislamiento físico como social impuesto por Bernarda.",
        "difficulty": Difficulty.medium
    }
]

async def seed_database():
    """Populate database with initial questions"""
    try:
        # Check if questions already exist
        existing_questions = await Database.get_questions(limit=1)
        if existing_questions:
            print("Database already has questions, skipping seed...")
            return
        
        # Create questions
        for q_data in SEED_QUESTIONS:
            question = Question(**q_data)
            await Database.create_question(question)
        
        print(f"Successfully seeded {len(SEED_QUESTIONS)} questions to database")
        
    except Exception as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_database())