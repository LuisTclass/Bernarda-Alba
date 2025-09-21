# Contratos API y Plan de Backend - La Casa de Bernarda Alba

## API Endpoints Requeridos

### 1. Gestión de Preguntas
```
GET /api/questions?category={category}&difficulty={difficulty}&limit={limit}
- Obtener preguntas filtradas por categoría y dificultad
- Respuesta: Array de preguntas con opciones y respuestas correctas

GET /api/questions/{question_id}
- Obtener una pregunta específica
- Respuesta: Pregunta completa con metadata

POST /api/questions
- Crear nueva pregunta (admin)
- Body: Pregunta completa con opciones y explicación
```

### 2. Gestión de Usuarios y Sesiones
```
POST /api/users/register
- Registrar nuevo usuario
- Body: { name, email, password }

POST /api/users/login
- Autenticar usuario
- Body: { email, password }
- Respuesta: JWT token

GET /api/users/profile
- Obtener perfil del usuario autenticado
- Headers: Authorization Bearer token
```

### 3. Gestión de Quiz y Resultados
```
POST /api/quiz/start
- Iniciar nuevo quiz
- Body: { mode, category?, difficulty?, question_count? }
- Respuesta: { quiz_id, questions[], start_time }

POST /api/quiz/{quiz_id}/answer
- Responder pregunta
- Body: { question_id, user_answer, time_spent }
- Respuesta: { correct, explanation?, next_question_id? }

POST /api/quiz/{quiz_id}/finish
- Finalizar quiz
- Body: { end_time, answers[] }
- Respuesta: { score, percentage, detailed_results }

GET /api/quiz/{quiz_id}/results
- Obtener resultados de quiz específico
```

### 4. Estadísticas y Progreso
```
GET /api/users/stats
- Obtener estadísticas generales del usuario
- Respuesta: { total_questions, correct_answers, streak, category_stats }

GET /api/users/progress
- Obtener progreso por temas
- Respuesta: { topics[], level, xp, completed_topics[] }

GET /api/users/wrong-questions
- Obtener preguntas respondidas incorrectamente
- Para modo de repaso
```

## Modelos de Base de Datos MongoDB

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  created_at: Date,
  stats: {
    total_questions: Number,
    correct_answers: Number,
    streak: Number,
    best_streak: Number,
    level: String,
    xp: Number
  },
  category_progress: {
    personajes: { correct: Number, total: Number },
    temas: { correct: Number, total: Number },
    simbolismo: { correct: Number, total: Number }
  }
}
```

### Question
```javascript
{
  _id: ObjectId,
  type: String, // 'multiple', 'boolean', 'essay'
  category: String, // 'personajes', 'temas', 'simbolismo'
  question: String,
  options: [String], // Solo para multiple choice
  correct_answer: Mixed, // Number para multiple, Boolean para boolean, String para essay
  explanation: String,
  difficulty: String, // 'easy', 'medium', 'hard'
  created_at: Date,
  created_by: ObjectId
}
```

### Quiz
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  mode: String, // 'practice', 'exam', 'review'
  questions: [ObjectId],
  start_time: Date,
  end_time: Date,
  status: String, // 'in_progress', 'completed', 'abandoned'
  answers: [{
    question_id: ObjectId,
    user_answer: Mixed,
    is_correct: Boolean,
    time_spent: Number
  }],
  score: Number,
  percentage: Number
}
```

### UserProgress
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  question_id: ObjectId,
  is_correct: Boolean,
  attempts: Number,
  last_answered: Date,
  time_spent: Number
}
```

## Datos Mock a Reemplazar

### En mock.js - Datos que serán reemplazados:
1. **mockQuestions** → GET /api/questions
2. **mockStats** → GET /api/users/stats  
3. **mockProgress** → GET /api/users/progress

### Integración Frontend-Backend:

1. **Home.jsx**: 
   - Reemplazar datos estáticos con llamadas a /api/users/stats
   - Obtener progreso real de /api/users/progress

2. **Quiz.jsx**:
   - Iniciar quiz con POST /api/quiz/start
   - Enviar respuestas con POST /api/quiz/{id}/answer
   - Finalizar con POST /api/quiz/{id}/finish

3. **Results.jsx**:
   - Obtener resultados de /api/quiz/{id}/results
   - Mostrar estadísticas actualizadas

4. **Progress.jsx**:
   - Cargar progreso real de /api/users/progress
   - Mostrar estadísticas de categorías

## Funcionalidades Backend a Implementar

1. **Autenticación JWT** - Sistema de login/registro
2. **CRUD Preguntas** - Gestión de base de preguntas
3. **Lógica de Quiz** - Manejo de sesiones de quiz
4. **Cálculo de Estadísticas** - Progreso y rendimiento del usuario
5. **Validación de Respuestas** - Verificación automática de respuestas
6. **Sistema de Puntuación** - XP, niveles, rachas

## Plan de Integración

1. Crear modelos y endpoints básicos
2. Implementar autenticación
3. Migrar datos mock a MongoDB
4. Reemplazar llamadas mock en frontend con APIs reales
5. Implementar persistencia de progreso
6. Testing de integración completa

## Consideraciones de Seguridad

- Hash de contraseñas con bcrypt
- JWT tokens con expiración
- Validación de entrada en todos los endpoints
- Rate limiting para prevenir spam
- CORS configurado correctamente