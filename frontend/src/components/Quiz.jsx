import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI } from '../api';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Home,
  Flag,
  BookOpen,
  Target
} from 'lucide-react';

const Quiz = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mode === 'exam' ? 1800 : null); // 30 minutos para examen
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  // Inicializar quiz al cargar el componente
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const quizData = {
          mode: mode,
          question_count: mode === 'exam' ? 20 : null
        };

        const quizResponse = await quizAPI.startQuiz(quizData, token);
        setQuestions(quizResponse.questions);
        setCurrentQuiz(quizResponse);
        setLoading(false);
      } catch (error) {
        console.error('Error starting quiz:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el quiz. Inténtalo de nuevo.",
          duration: 3000,
        });
        navigate('/');
      }
    };

    if (token) {
      initializeQuiz();
    }
  }, [mode, token, navigate, toast]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Timer para modo examen
  useEffect(() => {
    if (mode === 'exam' && timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (mode === 'exam' && timeLeft === 0) {
      handleFinishQuiz();
    }
  }, [timeLeft, mode, isFinished]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = async (answer) => {
    setSelectedAnswer(answer);
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: answer });
    
    try {
      const answerResponse = await quizAPI.submitAnswer(
        currentQuiz.quiz_id,
        {
          question_id: currentQuestion.id,
          user_answer: answer
        },
        token
      );

      if (mode === 'practice') {
        setShowExplanation(true);
        toast({
          title: answerResponse.correct ? "¡Correcto!" : "Incorrecto",
          description: answerResponse.explanation,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Error",
        description: "Error al enviar la respuesta. Inténtalo de nuevo.",
        duration: 3000,
      });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleFinishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
      setSelectedAnswer(userAnswers[questions[currentQuestionIndex + 1]?.id] || null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
      setSelectedAnswer(userAnswers[questions[currentQuestionIndex - 1]?.id] || null);
    }
  };

  const handleFinishQuiz = () => {
    setIsFinished(true);
    // Calcular resultados
    let correctCount = 0;
    questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (question.type === 'boolean') {
        if (userAnswer === question.correctAnswer) correctCount++;
      } else if (question.type === 'multiple') {
        if (userAnswer === question.correctAnswer) correctCount++;
      }
      // Para essays no contamos automáticamente como correcto
    });
    
    navigate('/results', { 
      state: { 
        score: correctCount, 
        total: questions.length, 
        mode,
        answers: userAnswers,
        questions 
      } 
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'personajes': return Target;
      case 'temas': return BookOpen;
      case 'simbolismo': return Flag;
      default: return BookOpen;
    }
  };

  if (!currentQuestion) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Inicio
          </Button>
          
          {mode === 'exam' && timeLeft !== null && (
            <div className="flex items-center bg-red-50 text-red-700 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(timeLeft)}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress 
            value={((currentQuestionIndex + 1) / questions.length) * 100} 
            className="h-3"
          />
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                {(() => {
                  const IconComponent = getCategoryIcon(currentQuestion.category);
                  return <IconComponent className="w-5 h-5 text-gray-600" />;
                })()}
                <Badge variant="outline" className="capitalize">
                  {currentQuestion.category}
                </Badge>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty === 'easy' ? 'Fácil' :
                   currentQuestion.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </Badge>
              </div>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Multiple Choice Questions */}
            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full text-left justify-start p-4 h-auto transition-all duration-200 ${
                      selectedAnswer === index 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleAnswer(index)}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)})</span>
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* Boolean Questions */}
            {currentQuestion.type === 'boolean' && (
              <div className="flex space-x-4">
                <Button
                  variant={selectedAnswer === true ? "default" : "outline"}
                  className={`flex-1 p-4 transition-all duration-200 ${
                    selectedAnswer === true 
                      ? 'bg-green-600 text-white border-green-600' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswer(true)}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verdadero
                </Button>
                <Button
                  variant={selectedAnswer === false ? "default" : "outline"}
                  className={`flex-1 p-4 transition-all duration-200 ${
                    selectedAnswer === false 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswer(false)}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Falso
                </Button>
              </div>
            )}

            {/* Essay Questions */}
            {currentQuestion.type === 'essay' && (
              <div>
                <Textarea
                  placeholder="Escribe tu respuesta aquí..."
                  rows={6}
                  className="w-full"
                  value={selectedAnswer || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  onBlur={() => handleAnswer(selectedAnswer)}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Máximo 150 palabras recomendadas
                </div>
              </div>
            )}

            {/* Explanation (solo en modo práctica) */}
            {showExplanation && mode === 'practice' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-900 mb-2">Explicación:</h4>
                <p className="text-blue-800">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="flex space-x-4">
            {mode === 'exam' && (
              <Button variant="outline" onClick={handleFinishQuiz}>
                Finalizar Examen
              </Button>
            )}
            
            <Button 
              onClick={handleNext}
              disabled={selectedAnswer === null && currentQuestion.type !== 'essay'}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isLastQuestion ? 'Finalizar' : 'Siguiente'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;