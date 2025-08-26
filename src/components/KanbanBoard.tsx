import React, { useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';

import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { SearchFilter } from './SearchFilter';
import { TaskHistory } from './TaskHistory';
import { useKanban } from '../hooks/useKanban';
import { Task, TaskStatus } from '../types';

export function KanbanBoard() {
  const { state, dispatch } = useKanban();
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredColumns = useMemo(() => {
    if (!state.filter.trim()) {
      return state.columns;
    }

    const filterLower = state.filter.toLowerCase();
    return state.columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task =>
        task.title.toLowerCase().includes(filterLower) ||
        (task.description && task.description.toLowerCase().includes(filterLower))
      ),
    }));
  }, [state.columns, state.filter]);

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.status === 'done').length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = state.tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = state.tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overColumn = state.columns.find(col => col.id === over.id);
    if (overColumn && activeTask.status !== overColumn.id) {
      dispatch({
        type: 'MOVE_TASK',
        payload: {
          id: activeTask.id,
          status: overColumn.id as TaskStatus,
        },
      });
      return;
    }

    const overTask = state.tasks.find(t => t.id === over.id);
    if (overTask && activeTask.status === overTask.status) {
      const column = state.columns.find(col => col.id === activeTask.status);
      if (!column) return;

      const oldIndex = column.tasks.findIndex(t => t.id === active.id);
      const newIndex = column.tasks.findIndex(t => t.id === over.id);

      if (oldIndex !== newIndex) {
        dispatch({
          type: 'UPDATE_TASK',
          payload: {
            id: activeTask.id,
            updates: { updatedAt: new Date() },
          },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>Personal Workspace</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {completedTasks}/{totalTasks} tasks
                  </span>
                </div>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Workspace</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-blue-600">{state.tasks.filter(t => t.status === 'todo').length}</div>
                  <div className="text-xs text-blue-600">To Do</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-yellow-600">{state.tasks.filter(t => t.status === 'in-progress').length}</div>
                  <div className="text-xs text-yellow-600">In Progress</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-green-600">{state.tasks.filter(t => t.status === 'done').length}</div>
                  <div className="text-xs text-green-600">Done</div>
                </div>
              </div>

              <SearchFilter />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <AddTaskForm />
                <TaskHistory />
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-h-screen">
          <div className="p-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filteredColumns.map((column) => (
                  <Column key={column.id} column={column} />
                ))}
              </div>

              <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} /> : null}
              </DragOverlay>
            </DndContext>

            {state.filter.trim() && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                  <span className="text-sm text-gray-600">
                    Showing {filteredColumns.reduce((acc, col) => acc + col.tasks.length, 0)} tasks matching "{state.filter}"
                  </span>
                  <button
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: { filter: '' } })}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
