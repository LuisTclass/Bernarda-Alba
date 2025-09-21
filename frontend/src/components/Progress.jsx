import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Home, 
  Users, 
  Heart, 
  Eye, 
  BookOpen, 
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Star,
  CheckCircle,
  Circle
} from 'lucide-react';
import { mockProgress, mockStats } from '../mock';

const ProgressPage = () => {
  const navigate = useNavigate();

  const topics = [
    { 
      name: 'Personajes principales', 
      status: 'completed', 
      progress: 100, 
      icon: Users,
      description: 'Bernarda, Adela, Angustias, Martirio, La Poncia',
      questions: 15
    },
    { 
      name: 'Estructura de la obra', 
      status: 'completed', 
      progress: 100, 
      icon: BookOpen,
      description: 'Tres actos, unidades dramáticas, tiempo y espacio',
      questions: 8
    },
    { 
      name: 'Simbolismo', 
      status: 'in-progress', 
      progress: 65, 
      icon: Eye,
      description: 'Color, agua, bastón, caballo garañón',
      questions: 22
    },
    { 
      name: 'Temas principales', 
      status: 'in-progress', 
      progress: 67, 
      icon: Heart,
      description: 'Represión, honor, libertad, autoridad',
      questions: 18
    },
    { 
      name: 'Recursos literarios', 
      status: 'pending', 
      progress: 30, 
      icon: Star,
      description: 'Metáforas, símiles, ironía dramática',
      questions: 12
    },
    { 
      name: 'Contexto histórico', 
      status: 'pending', 
      progress: 10, 
      icon: Clock,
      description: 'España de 1936, Guerra Civil, biografía de Lorca',
      questions: 10
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'pending': return Circle;
      default: return Circle;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tu Progreso</h1>
            <p className="text-gray-600">Seguimiento detallado de tu preparación para selectividad</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Inicio
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Estadísticas Generales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">{mockStats.correctAnswers}</div>
                    <div className="text-sm text-green-700">Respuestas Correctas</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">{Math.round((mockStats.correctAnswers / mockStats.totalQuestions) * 100)}%</div>
                    <div className="text-sm text-blue-700">Precisión Global</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <Star className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                    <div className="text-2xl font-bold text-amber-600">{mockStats.streak}</div>
                    <div className="text-sm text-amber-700">Racha Actual</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topics Progress */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Progreso por Temas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {topics.map((topic, index) => {
                    const IconComponent = topic.icon;
                    const StatusIcon = getStatusIcon(topic.status);
                    
                    return (
                      <div key={index} className="border-l-4 border-gray-200 pl-6 relative">
                        <div className="absolute -left-3 top-0 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                          <StatusIcon className={`w-3 h-3 ${topic.status === 'completed' ? 'text-green-600' : topic.status === 'in-progress' ? 'text-blue-600' : 'text-gray-400'}`} />
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <IconComponent className="w-5 h-5 mr-3 text-gray-600" />
                              <div>
                                <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(topic.status)}>
                              {getStatusText(topic.status)}
                            </Badge>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Progreso</span>
                              <span>{topic.questions} preguntas</span>
                            </div>
                            <Progress value={topic.progress} className="h-2" />
                            <div className="text-right text-sm text-gray-600 mt-1">
                              {topic.progress}% completado
                            </div>
                          </div>
                          
                          {topic.status !== 'completed' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate('/quiz/practice')}
                              className="hover:bg-gray-50"
                            >
                              {topic.status === 'pending' ? 'Comenzar' : 'Continuar'}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Card */}
            <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-900">Nivel de Conocimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-purple-900 mb-2">{mockProgress.level}</div>
                  <div className="text-sm text-purple-700">
                    {mockProgress.xp} / {mockProgress.nextLevelXp} XP
                  </div>
                </div>
                <Progress 
                  value={(mockProgress.xp / mockProgress.nextLevelXp) * 100} 
                  className="h-3 mb-2" 
                />
                <div className="text-center text-sm text-purple-700">
                  {mockProgress.nextLevelXp - mockProgress.xp} XP para siguiente nivel
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Rendimiento por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockStats.categoryStats).map(([category, stats]) => (
                    <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize text-gray-900">{category}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{stats.percentage}%</div>
                        <div className="text-xs text-gray-600">{stats.correct}/{stats.total}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                  onClick={() => navigate('/quiz/practice')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Modo Práctica
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/quiz/exam')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Simulacro Examen
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/quiz/review')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Repasar Errores
                </Button>
              </CardContent>
            </Card>

            {/* Study Tip */}
            <Card className="shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800">Consejo del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700 mb-3">
                  El simbolismo del agua representa la vida y la fertilidad. Su ausencia en la casa refleja la sequedad emocional de las mujeres reprimidas.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full border-amber-300 text-amber-800 hover:bg-amber-100"
                  onClick={() => navigate('/quiz/practice')}
                >
                  Practicar Simbolismo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;