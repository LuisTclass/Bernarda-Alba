import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, BookOpen } from 'lucide-react';

const Login = () => {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLoginMode) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-stone-100 via-gray-50 to-slate-100">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-stone-700 bg-clip-text text-transparent">
            La Casa de Bernarda Alba
          </CardTitle>
          <CardDescription className="text-stone-600">
            {isLoginMode ? 'Inicia sesión para continuar estudiando' : 'Crea tu cuenta para comenzar'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-slate-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="estudiante@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-slate-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800"
              disabled={loading}
            >
              {loading ? 'Procesando...' : (isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-sm text-stone-600 hover:text-slate-800 transition-colors"
            >
              {isLoginMode 
                ? '¿No tienes cuenta? Regístrate aquí' 
                : '¿Ya tienes cuenta? Inicia sesión'
              }
            </button>
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">Datos de prueba:</h4>
            <p className="text-sm text-red-800">
              <strong>Email:</strong> test@example.com<br />
              <strong>Contraseña:</strong> testpass123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;