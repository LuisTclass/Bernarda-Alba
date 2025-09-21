import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import Progress from "./components/Progress";
import Login from "./components/Login";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-gray-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};

// Main App component
const AppContent = () => {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-stone-100 via-gray-50 to-slate-100">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/quiz/:mode" element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;