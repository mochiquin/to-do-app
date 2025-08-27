import axios from 'axios';
import { Todo, CreateTodoData, UpdateTodoData } from '../types/todo';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 调用函数
export const todoApi = {
  // 获取所有待办事项
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  // 创建新待办事项
  createTodo: async (data: CreateTodoData): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },

  // 更新待办事项
  updateTodo: async (id: number, data: UpdateTodoData): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  // 删除待办事项
  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};

export default api;