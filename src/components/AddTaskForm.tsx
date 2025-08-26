import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useKanban } from '../hooks/useKanban';

export function AddTaskForm() {
  const { dispatch } = useKanban();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      dispatch({
        type: 'ADD_TASK',
        payload: {
          title: title.trim(),
          description: description.trim() || undefined,
        },
      });
      
      setTitle('');
      setDescription('');
      setIsOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
            <Plus size={18} className="text-blue-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Create new task</div>
            <div className="text-xs text-gray-500">Add a task to your board</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Create New Task</h3>
        <button
          onClick={handleCancel}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
        >
          <X size={16} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              maxLength={100}
            />
            <div className="mt-1 text-xs text-gray-500">
              {title.length}/100 characters
            </div>
          </div>
          
          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="task-description"
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              rows={3}
              maxLength={500}
            />
            <div className="mt-1 text-xs text-gray-500">
              {description.length}/500 characters
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </div>
            ) : (
              'Create Task'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg focus:outline-none transition-all font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
