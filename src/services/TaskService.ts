import { Task, TaskStatus } from '../types';

export class TaskService {
  static createTask(title: string, description?: string): Omit<Task, 'id'> {
    return {
      title: title.trim(),
      description: description?.trim() || undefined,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static updateTaskStatus(task: Task, newStatus: TaskStatus): Task {
    return {
      ...task,
      status: newStatus,
      updatedAt: new Date(),
    };
  }

  static searchTasks(tasks: Task[], query: string): Task[] {
    if (!query.trim()) return tasks;
    
    const searchTerm = query.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description && task.description.toLowerCase().includes(searchTerm))
    );
  }

  static sortTasksByDate(tasks: Task[], ascending = false): Task[] {
    return [...tasks].sort((a, b) => {
      const dateA = a.createdAt.getTime();
      const dateB = b.createdAt.getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  static getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
    return tasks.filter(task => task.status === status);
  }

  static calculateTaskAge(task: Task): number {
    const now = new Date();
    const created = task.createdAt;
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }
}
