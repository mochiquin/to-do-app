import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoData, UpdateTodoData } from '../types/todo';
import { todoApi } from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取所有待办事项
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAllTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('获取待办事项失败');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建待办事项
  const createTodo = async (data: CreateTodoData): Promise<boolean> => {
    try {
      const newTodo = await todoApi.createTodo(data);
      setTodos(prev => [newTodo, ...prev]);
      return true;
    } catch (err) {
      setError('创建待办事项失败');
      console.error('Error creating todo:', err);
      return false;
    }
  };

  // 更新待办事项
  const updateTodo = async (id: number, data: UpdateTodoData): Promise<boolean> => {
    try {
      const updatedTodo = await todoApi.updateTodo(id, data);
      setTodos(prev => 
        prev.map(todo => todo.id === id ? updatedTodo : todo)
      );
      return true;
    } catch (err) {
      setError('更新待办事项失败');
      console.error('Error updating todo:', err);
      return false;
    }
  };

  // 删除待办事项
  const deleteTodo = async (id: number): Promise<boolean> => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      return true;
    } catch (err) {
      setError('删除待办事项失败');
      console.error('Error deleting todo:', err);
      return false;
    }
  };

  // 切换完成状态
  const toggleTodo = async (id: number): Promise<boolean> => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return false;
    
    return updateTodo(id, { completed: !todo.completed });
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch: fetchTodos,
  };
};