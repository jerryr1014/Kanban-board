import { Task } from '../types';

export const filterTasks = (tasks: Task[], filter: string): Task[] => {
  if (!filter.trim()) return tasks;
  
  const searchTerm = filter.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm) ||
    (task.description && task.description.toLowerCase().includes(searchTerm))
  );
};

export const groupTasksByStatus = (tasks: Task[]) => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
};

export const validateTaskTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title.trim()) {
    return { isValid: false, error: 'Title is required' };
  }
  
  if (title.length > 100) {
    return { isValid: false, error: 'Title must be 100 characters or less' };
  }
  
  return { isValid: true };
};

export const formatTaskDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const daysDiff = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    return 'Today';
  }
  
  if (daysDiff === -1) {
    return 'Yesterday';
  }
  
  return taskDate.toLocaleDateString();
};
