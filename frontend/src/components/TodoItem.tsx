import React, { useState } from 'react';
import { Check, X, Edit2, Trash2, Calendar } from 'lucide-react';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onUpdate: (id: number, data: { title: string; description: string }) => Promise<boolean>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    await onToggle(todo.id);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个待办事项吗？')) {
      setIsLoading(true);
      await onDelete(todo.id);
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      alert('标题不能为空');
      return;
    }

    setIsLoading(true);
    const success = await onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim()
    });
    
    if (success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const cancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md ${
      todo.completed ? 'opacity-75' : ''
    } animate-slide-up`}>
      {isEditing ? (
        // 编辑模式
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
            placeholder="待办事项标题"
            disabled={isLoading}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={2}
            placeholder="描述（可选）"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              保存
            </button>
            <button
              onClick={cancelEdit}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              取消
            </button>
          </div>
        </div>
      ) : (
        // 显示模式
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold transition-all duration-200 ${
                todo.completed 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-800'
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`mt-2 text-sm transition-all duration-200 ${
                  todo.completed 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {formatDate(todo.created_at)}
              </div>
            </div>
            
            {/* 状态指示器 */}
            <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-2 ${
              todo.completed ? 'bg-green-500' : 'bg-gray-300'
            } transition-colors duration-200`} />
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 text-sm ${
                  todo.completed
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500'
                    : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Check className="w-4 h-4" />
                {todo.completed ? '标记未完成' : '标记完成'}
              </button>
              
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 flex items-center gap-2 text-sm ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Edit2 className="w-4 h-4" />
                编辑
              </button>
            </div>
            
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center gap-2 text-sm ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;