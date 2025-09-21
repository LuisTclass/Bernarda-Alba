// Mock data para La Casa de Bernarda Alba - Selectividad
export const mockQuestions = [
  {
    id: 1,
    type: 'multiple',
    category: 'personajes',
    question: '¿Cuántas hijas tiene Bernarda Alba?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 1,
    explanation: 'Bernarda Alba tiene cinco hijas: Angustias, Magdalena, Amelia, Martirio y Adela.',
    difficulty: 'easy'
  },
  {
    id: 2,
    type: 'multiple',
    category: 'temas',
    question: '¿Qué simboliza el color blanco en la obra?',
    options: ['La pureza y la virginidad', 'La muerte', 'La represión', 'La libertad'],
    correctAnswer: 0,
    explanation: 'El blanco simboliza la pureza y la virginidad, especialmente asociado con Adela.',
    difficulty: 'medium'
  },
  {
    id: 3,
    type: 'boolean',
    category: 'personajes',
    question: 'Adela es la hija mayor de Bernarda Alba',
    correctAnswer: false,
    explanation: 'Adela es la hija menor de Bernarda. La mayor es Angustias.',
    difficulty: 'easy'
  },
  {
    id: 4,
    type: 'multiple',
    category: 'simbolismo',
    question: '¿Qué representa el bastón de Bernarda?',
    options: ['Su vejez', 'El poder patriarcal', 'Su enfermedad', 'La tradición'],
    correctAnswer: 1,
    explanation: 'El bastón de Bernarda representa el poder patriarcal y la autoridad represiva.',
    difficulty: 'hard'
  },
  {
    id: 5,
    type: 'essay',
    category: 'temas',
    question: 'Explica el tema de la represión femenina en La Casa de Bernarda Alba (máximo 150 palabras)',
    correctAnswer: '',
    explanation: 'Respuesta sugerida: La represión femenina es el tema central de la obra. Bernarda impone un luto riguroso de ocho años tras la muerte de su marido, encerrando a sus hijas y negándoles cualquier libertad. Esta represión se manifiesta en la prohibición de salir, relacionarse con hombres o expresar sus deseos. Las hijas representan diferentes reacciones: sumisión (Angustias, Magdalena), resignación (Amelia), rebeldía contenida (Martirio) y rebeldía abierta (Adela). La casa se convierte en una cárcel donde la tradición y el "qué dirán" priman sobre la felicidad individual.',
    difficulty: 'hard'
  },
  {
    id: 6,
    type: 'boolean',
    category: 'simbolismo',
    question: 'El caballo garañón simboliza la pasión y la sexualidad masculina',
    correctAnswer: true,
    explanation: 'El caballo garañón efectivamente simboliza la fuerza sexual masculina y la pasión reprimida.',
    difficulty: 'medium'
  },
  {
    id: 7,
    type: 'multiple',
    category: 'personajes',
    question: '¿Quién es Pepe el Romano?',
    options: ['El pretendiente de Adela', 'El novio de Angustias', 'Ambas respuestas son correctas', 'El marido fallecido de Bernarda'],
    correctAnswer: 2,
    explanation: 'Pepe el Romano está comprometido oficialmente con Angustias por su dinero, pero mantiene una relación secreta con Adela.',
    difficulty: 'medium'
  },
  {
    id: 8,
    type: 'essay',
    category: 'simbolismo',
    question: 'Analiza el simbolismo del agua en la obra (máximo 100 palabras)',
    correctAnswer: '',
    explanation: 'Respuesta sugerida: El agua simboliza la vida, la fertilidad y la purificación. Su ausencia representa la sequedad emocional y sexual de la casa. Las referencias al pozo, la sed y el calor refuerzan la sensación de ahogo y represión. El agua también se asocia con lo femenino y lo maternal, elementos negados en este hogar donde prevalece la rigidez.',
    difficulty: 'hard'
  },
  {
    id: 9,
    type: 'boolean',
    category: 'temas',
    question: 'La obra pertenece al género de la tragedia rural',
    correctAnswer: true,
    explanation: 'Lorca definió la obra como "drama de mujeres en los pueblos de España", siendo considerada una tragedia rural.',
    difficulty: 'easy'
  },
  {
    id: 10,
    type: 'multiple',
    category: 'personajes',
    question: '¿Qué personaje representa la voz del pueblo?',
    options: ['La Poncia', 'María Josefa', 'Prudencia', 'La criada'],
    correctAnswer: 0,
    explanation: 'La Poncia actúa como confidente y representa la sabiduría popular y la voz del pueblo.',
    difficulty: 'medium'
  }
];

export const mockStats = {
  totalQuestions: 50,
  correctAnswers: 35,
  incorrectAnswers: 15,
  streak: 7,
  averageTime: 45,
  categoryStats: {
    personajes: { correct: 12, total: 15, percentage: 80 },
    temas: { correct: 10, total: 15, percentage: 67 },
    simbolismo: { correct: 13, total: 20, percentage: 65 }
  }
};

export const mockProgress = {
  level: 'Intermedio',
  xp: 1250,
  nextLevelXp: 1500,
  completedTopics: ['Personajes principales', 'Estructura de la obra'],
  inProgressTopics: ['Simbolismo', 'Recursos literarios'],
  pendingTopics: ['Contexto histórico', 'Análisis métrico']
};