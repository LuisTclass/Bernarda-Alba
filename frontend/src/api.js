import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await axios.post(`${API}/users/register`, userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await axios.post(`${API}/users/login`, credentials);
    return response.data;
  },
  
  getProfile: async (token) => {
    const response = await axios.get(`${API}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// Questions API calls
export const questionsAPI = {
  getQuestions: async (filters = {}, token = null) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.limit) params.append('limit', filters.limit);
    
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` }
    } : {};
    
    const response = await axios.get(`${API}/questions?${params}`, config);
    return response.data;
  },
  
  getQuestion: async (questionId, token = null) => {
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` }
    } : {};
    
    const response = await axios.get(`${API}/questions/${questionId}`, config);
    return response.data;
  }
};

// Quiz API calls
export const quizAPI = {
  startQuiz: async (quizData, token) => {
    const response = await axios.post(`${API}/quiz/start`, quizData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  submitAnswer: async (quizId, answerData, token) => {
    const response = await axios.post(`${API}/quiz/${quizId}/answer`, answerData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  finishQuiz: async (quizId, finishData, token) => {
    const response = await axios.post(`${API}/quiz/${quizId}/finish`, finishData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getResults: async (quizId, token) => {
    const response = await axios.get(`${API}/quiz/${quizId}/results`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// User stats and progress API calls
export const userAPI = {
  getStats: async (token) => {
    const response = await axios.get(`${API}/users/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getProgress: async (token) => {
    const response = await axios.get(`${API}/users/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getWrongQuestions: async (token) => {
    const response = await axios.get(`${API}/users/wrong-questions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};