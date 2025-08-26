import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Task } from '../types';
import { useKanban } from '../hooks/useKanban';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { dispatch } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          id: task.id,
          updates: { title: editTitle.trim() },
        },
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: { id: task.id } });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'todo':
        return 'border-l-blue-400';
      case 'in-progress':
        return 'border-l-yellow-400';
      case 'done':
        return 'border-l-green-400';
      default:
        return 'border-l-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${getStatusColor()} p-4 group hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-3 shadow-xl' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyPress}
                className="w-full font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-gray-900 break-words leading-snug mb-1">
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 break-words leading-relaxed mb-3">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {formatDate(task.createdAt)}
                  </span>
                </div>
                
                <div
                  {...attributes}
                  {...listeners}
                  className="p-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors"
                  title="Drag to move"
                >
                  <GripVertical size={16} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit task"
          >
            <Edit2 size={12} />
            Edit
          </button>
          
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete task"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
