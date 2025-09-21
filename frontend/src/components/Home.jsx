import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BookOpen, 
  Clock, 
  Target, 
  RotateCcw, 
  Trophy, 
  Users, 
  Heart, 
  Eye,
  TrendingUp,
  Star
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const studyModes = [
    {
      id: 'practice',
      title: 'Modo Práctica',
      description: 'Estudia sin presión con retroalimentación inmediata',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-slate-600 to-slate-700',
      hoverColor: 'from-slate-700 to-slate-800',
      questions: '∞ preguntas',
      time: 'Sin límite'
    },
    {
      id: 'exam',
      title: 'Simulacro Selectividad',
      description: 'Examen cronometrado como el real de selectividad',
      icon: Clock,
      color: 'bg-gradient-to-br from-red-700 to-red-800',
      hoverColor: 'from-red-800 to-red-900',
      questions: '20 preguntas',
      time: '30 minutos'
    },
    {
      id: 'review',
      title: 'Repasar Errores',
      description: 'Practica las preguntas que has fallado anteriormente',
      icon: RotateCcw,
      color: 'bg-gradient-to-br from-stone-600 to-stone-700',
      hoverColor: 'from-stone-700 to-stone-800',
      questions: '15 pendientes',
      time: 'Tu ritmo'
    }
  ];

  const quickStats = [
    { label: 'Preguntas correctas', value: '35/50', icon: Target, color: 'text-emerald-600' },
    { label: 'Racha actual', value: '7 seguidas', icon: Trophy, color: 'text-amber-600' },
    { label: 'Tiempo promedio', value: '45 seg', icon: TrendingUp, color: 'text-blue-600' }
  ];

  const themes = [
    { name: 'Personajes', progress: 80, icon: Users, questions: 15 },
    { name: 'Temas principales', progress: 67, icon: Heart, questions: 18 },
    { name: 'Simbolismo', progress: 65, icon: Eye, questions: 22 }
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-stone-700 bg-clip-text text-transparent mb-4">
            La Casa de Bernarda Alba
          </h1>
          <p className="text-xl text-stone-600 mb-2">Prepárate para la Selectividad Española</p>
          <Badge variant="outline" className="text-sm px-3 py-1 border-stone-300 text-stone-700">
            <Star className="w-4 h-4 mr-1 fill-amber-400 text-amber-500" />
            Federico García Lorca
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Study Modes */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Modos de Estudio</h2>
            <div className="space-y-4">
              {studyModes.map((mode, index) => (
                <Card 
                  key={mode.id}
                  className={`transition-all duration-300 cursor-pointer border-0 shadow-lg ${
                    hoveredCard === mode.id ? 'scale-105 shadow-xl' : ''
                  }`}
                  onMouseEnter={() => setHoveredCard(mode.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(`/quiz/${mode.id}`)}
                >
                  <div className="flex items-center">
                    <div className={`w-16 h-16 rounded-l-lg flex items-center justify-center transition-all duration-300 ${
                      hoveredCard === mode.id ? mode.hoverColor : mode.color
                    } bg-gradient-to-br`}>
                      <mode.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{mode.title}</h3>
                        <div className="text-right text-sm text-gray-500">
                          <div>{mode.questions}</div>
                          <div>{mode.time}</div>
                        </div>
                      </div>
                      <p className="text-gray-600">{mode.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tu Progreso</h2>
              <Button 
                variant="outline" 
                onClick={() => navigate('/progress')}
                className="hover:bg-gray-50"
              >
                Ver todo
              </Button>
            </div>

            <div className="space-y-4">
              {themes.map((theme, index) => (
                <Card key={index} className="transition-all duration-300 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <theme.icon className="w-5 h-5 mr-2 text-gray-600" />
                        <span className="font-medium text-gray-900">{theme.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{theme.questions} preguntas</span>
                    </div>
                    <div className="mb-2">
                      <Progress value={theme.progress} className="h-2" />
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {theme.progress}% completado
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="mt-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-900">Consejo de Estudio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-800 mb-4">
                  La represión y el luto dominan la casa. Analiza cómo estos temas se reflejan en cada personaje.
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900"
                  onClick={() => navigate('/quiz/practice')}
                >
                  Empezar a Practicar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;