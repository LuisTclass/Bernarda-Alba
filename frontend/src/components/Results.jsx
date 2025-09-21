import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Home,
  RotateCcw,
  BookOpen,
  TrendingUp
} from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getUserStats } = useAuth();
  const [userStats, setUserStats] = useState(null);
  
  const { results, mode, quizId } = location.state || {
    results: { score: 0, total: 0, percentage: 0, category_breakdown: {} },
    mode: 'practice'
  };

  useEffect(() => {
    // Refresh user stats after quiz completion
    const refreshStats = async () => {
      const stats = await getUserStats();
      setUserStats(stats);
    };
    refreshStats();
  }, [getUserStats]);

  if (!results) {
    navigate('/');
    return null;
  }

  const { score, total, percentage, category_breakdown, incorrect_questions } = results;
  
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'Excelente', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 75) return { grade: 'Muy Bien', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 60) return { grade: 'Bien', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (percentage >= 50) return { grade: 'Aprobado', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { grade: 'Necesita Mejorar', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const gradeInfo = getGrade(percentage);

  const getModeTitle = (mode) => {
    switch (mode) {
      case 'practice': return 'Modo Práctica';
      case 'exam': return 'Simulacro Selectividad';
      case 'review': return 'Repaso de Errores';
      default: return 'Quiz';
    }
  };

  const getRecommendation = (percentage) => {
    if (percentage >= 85) {
      return "¡Excelente trabajo! Estás muy bien preparado para la selectividad. Continúa repasando los temas más complejos.";
    } else if (percentage >= 70) {
      return "Buen nivel de comprensión. Te recomendamos repasar el simbolismo y profundizar en el análisis de personajes.";
    } else if (percentage >= 50) {
      return "Vas por buen camino. Enfócate en los temas principales y practica más las preguntas de análisis literario.";
    } else {
      return "Necesitas reforzar tus conocimientos. Te recomendamos releer la obra y practicar más con el modo de estudio.";
    }
  };

  // Calcular estadísticas por categoría
  const categoryStats = category_breakdown || {};

  const incorrectCount = (incorrect_questions && incorrect_questions.length) || (total - score);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-blue-600">{getModeTitle(mode)}</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resultados del Quiz</h1>
          <p className="text-gray-600">La Casa de Bernarda Alba - Selectividad</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Card */}
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${gradeInfo.bg}`}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{score}</div>
                    <div className="text-sm text-gray-600">de {total}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{percentage}%</div>
                  <Badge className={`${gradeInfo.color} ${gradeInfo.bg} border-0 text-lg px-4 py-2`}>
                    {gradeInfo.grade}
                  </Badge>
                </div>
                
                <Progress value={percentage} className="h-3 mb-4" />
                
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-lg font-semibold text-green-600">{score}</div>
                    <div className="text-sm text-gray-600">Correctas</div>
                  </div>
                  <div className="text-center">
                    <XCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <div className="text-lg font-semibold text-red-600">{total - score}</div>
                    <div className="text-sm text-gray-600">Incorrectas</div>
                  </div>
                  <div className="text-center">
                    <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-semibold text-blue-600">{total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Rendimiento por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([category, stats]) => {
                    const categoryPercentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                    return (
                      <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize text-gray-900">{category}</span>
                            <span className="text-sm text-gray-600">{stats.correct}/{stats.total}</span>
                          </div>
                          <Progress value={categoryPercentage} className="h-2" />
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-lg font-semibold text-gray-900">{categoryPercentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card className="shadow-lg border-l-4 border-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-900">Recomendación Personalizada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 leading-relaxed">{getRecommendation(percentage)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>¿Qué hacer ahora?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
                
                {incorrectCount > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/quiz/review')}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Repasar Errores ({incorrectCount})
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/quiz/practice')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Seguir Practicando
                </Button>
                
                {mode !== 'exam' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/quiz/exam')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Simulacro Selectividad
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-amber-800">Consejos de Estudio</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-amber-700">
                  <li>• Repasa los símbolos principales: agua, caballo, bastón</li>
                  <li>• Analiza las relaciones entre personajes</li>
                  <li>• Estudia el contexto histórico de Lorca</li>
                  <li>• Practica el análisis de fragmentos</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;