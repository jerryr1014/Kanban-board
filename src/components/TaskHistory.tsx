import { useState } from 'react';
import { History, ChevronDown, ChevronUp, Plus, Edit3, Trash2, ArrowRightLeft, FileText } from 'lucide-react';
import { useKanban } from '../hooks/useKanban';

export function TaskHistory() {
  const { state } = useKanban();
  const [isExpanded, setIsExpanded] = useState(false);

  const getActionIcon = (action: string) => {
    if (action.includes('Created')) return <Plus size={12} />;
    if (action.includes('Updated')) return <Edit3 size={12} />;
    if (action.includes('Deleted')) return <Trash2 size={12} />;
    if (action.includes('Moved')) return <ArrowRightLeft size={12} />;
    return <FileText size={12} />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('Created')) return 'text-green-600 bg-green-100';
    if (action.includes('Updated')) return 'text-blue-600 bg-blue-100';
    if (action.includes('Deleted')) return 'text-red-600 bg-red-100';
    if (action.includes('Moved')) return 'text-purple-600 bg-purple-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (state.history.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900">Activity</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <History size={20} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No recent activity</p>
          <p className="text-xs text-gray-400 mt-1">Task actions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isExpanded ? 'Collapse' : 'View all'}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className={`transition-all duration-200 ${isExpanded ? 'max-h-80' : 'max-h-32'} overflow-y-auto`}>
          <div className="p-4 space-y-3">
            {state.history.slice(0, isExpanded ? undefined : 3).map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 group">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${getActionColor(entry.action)}`}>
                  {getActionIcon(entry.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-medium">{entry.action}</span>
                      <br />
                      <span className="text-gray-600">"{entry.taskTitle}"</span>
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {!isExpanded && state.history.length > 3 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full text-xs text-gray-500 hover:text-gray-700 py-2 text-center border-t border-gray-100 transition-colors"
              >
                View {state.history.length - 3} more activities
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
