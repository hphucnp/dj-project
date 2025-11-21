import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoService = {
  getAllTodos: () => api.get('/todos/'),

  getTodoById: (id) => api.get(`/todos/${id}/`),

  createTodo: (todoData) => api.post('/todos/', todoData),

  updateTodo: (id, todoData) => api.patch(`/todos/${id}/`, todoData),

  deleteTodo: (id) => api.delete(`/todos/${id}/`),

  completeTodo: (id) => api.post(`/todos/${id}/complete/`),

  getTodosByStatus: (status) => api.get(`/todos/by_status/?status=${status}`),
};

export default api;
