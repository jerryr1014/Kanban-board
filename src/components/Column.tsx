import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Column as ColumnType } from '../types';

interface ColumnProps {
  column: ColumnType;
}

export function Column({ column }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const getColumnStyles = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return {
          header: 'bg-gradient-to-r from-blue-500 to-blue-600',
          background: 'bg-blue-50/50',
          border: 'border-blue-200',
          accent: 'text-blue-600'
        };
      case 'in-progress':
        return {
          header: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          background: 'bg-yellow-50/50',
          border: 'border-yellow-200',
          accent: 'text-yellow-600'
        };
      case 'done':
        return {
          header: 'bg-gradient-to-r from-green-500 to-emerald-500',
          background: 'bg-green-50/50',
          border: 'border-green-200',
          accent: 'text-green-600'
        };
      default:
        return {
          header: 'bg-gradient-to-r from-gray-500 to-gray-600',
          background: 'bg-gray-50',
          border: 'border-gray-200',
          accent: 'text-gray-600'
        };
    }
  };

  const styles = getColumnStyles(column.id);

  return (
    <div className={`rounded-xl ${styles.background} ${styles.border} border backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className={`${styles.header} rounded-t-xl p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-lg">{column.title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
              {column.tasks.length}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div ref={setNodeRef} className="min-h-[500px] space-y-3">
          <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
          
          {column.tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 font-medium">No tasks yet</p>
              {column.id === 'todo' && (
                <p className="text-sm text-gray-400 mt-1">
                  Drag tasks here or create new ones
                </p>
              )}
              {column.id === 'in-progress' && (
                <p className="text-sm text-gray-400 mt-1">
                  Drag tasks from "To Do" to start working or from "Done" to re-start working
                </p>
              )}
              {column.id === 'done' && (
                <p className="text-sm text-gray-400 mt-1">
                  Completed tasks will appear here
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
