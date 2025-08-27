import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (data: { title: string; description: string }) => Promise<boolean>;
  loading?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('请输入待办事项标题');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onSubmit({
        title: title.trim(),
        description: description.trim()
      });
      
      if (success) {
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || loading;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-blue-600" />
        添加新的待办事项
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：学习 React 开发"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            disabled={isDisabled}
            maxLength={200}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            描述 <span className="text-gray-400">(可选)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="详细描述这个待办事项..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
            disabled={isDisabled}
          />
        </div>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 w-full flex items-center justify-center gap-2 ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在添加...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              添加待办事项
            </>
          )}
        </button>
      </div>
      
      {title.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">预览</h3>
          <p className="text-blue-700 font-medium">{title}</p>
          {description && (
            <p className="text-blue-600 text-sm mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoForm;