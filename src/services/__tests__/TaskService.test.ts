import { TaskService } from '../TaskService';
import { Task } from '../../types';

describe('TaskService', () => {
  describe('createTask', () => {
    test('should create task with required fields', () => {
      const task = TaskService.createTask('Test Task');
      
      expect(task.title).toBe('Test Task');
      expect(task.status).toBe('todo');
      expect(task.description).toBeUndefined();
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    test('should create task with description', () => {
      const task = TaskService.createTask('Test Task', 'Test Description');
      
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
    });

    test('should trim whitespace from title and description', () => {
      const task = TaskService.createTask('  Test Task  ', '  Test Description  ');
      
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
    });

    test('should handle empty description', () => {
      const task = TaskService.createTask('Test Task', '');
      
      expect(task.description).toBeUndefined();
    });
  });

  describe('updateTaskStatus', () => {
    const mockTask: Task = {
      id: '1',
      title: 'Test Task',
      status: 'todo',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    test('should update task status', () => {
      const updatedTask = TaskService.updateTaskStatus(mockTask, 'in-progress');
      
      expect(updatedTask.status).toBe('in-progress');
      expect(updatedTask.updatedAt).not.toEqual(mockTask.updatedAt);
      expect(updatedTask.id).toBe(mockTask.id);
      expect(updatedTask.title).toBe(mockTask.title);
    });

    test('should not mutate original task', () => {
      const originalStatus = mockTask.status;
      TaskService.updateTaskStatus(mockTask, 'done');
      
      expect(mockTask.status).toBe(originalStatus);
    });
  });

  describe('searchTasks', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Learn React',
        description: 'Study React fundamentals',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Build App',
        description: 'Create a kanban application',
        status: 'in-progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    test('should return all tasks for empty query', () => {
      const result = TaskService.searchTasks(mockTasks, '');
      expect(result).toEqual(mockTasks);
    });

    test('should search by title', () => {
      const result = TaskService.searchTasks(mockTasks, 'React');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Learn React');
    });

    test('should search by description', () => {
      const result = TaskService.searchTasks(mockTasks, 'kanban');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Build App');
    });

    test('should be case insensitive', () => {
      const result = TaskService.searchTasks(mockTasks, 'REACT');
      expect(result).toHaveLength(1);
    });
  });

  describe('sortTasksByDate', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Old Task',
        status: 'todo',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        title: 'New Task',
        status: 'todo',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];

    test('should sort tasks by date descending by default', () => {
      const result = TaskService.sortTasksByDate(mockTasks);
      expect(result[0].title).toBe('New Task');
      expect(result[1].title).toBe('Old Task');
    });

    test('should sort tasks by date ascending when specified', () => {
      const result = TaskService.sortTasksByDate(mockTasks, true);
      expect(result[0].title).toBe('Old Task');
      expect(result[1].title).toBe('New Task');
    });

    test('should not mutate original array', () => {
      const originalFirst = mockTasks[0].title;
      TaskService.sortTasksByDate(mockTasks);
      expect(mockTasks[0].title).toBe(originalFirst);
    });
  });

  describe('getTasksByStatus', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Todo Task',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Done Task',
        status: 'done',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    test('should filter tasks by status', () => {
      const todoTasks = TaskService.getTasksByStatus(mockTasks, 'todo');
      const doneTasks = TaskService.getTasksByStatus(mockTasks, 'done');
      
      expect(todoTasks).toHaveLength(1);
      expect(todoTasks[0].title).toBe('Todo Task');
      expect(doneTasks).toHaveLength(1);
      expect(doneTasks[0].title).toBe('Done Task');
    });

    test('should return empty array for status with no tasks', () => {
      const inProgressTasks = TaskService.getTasksByStatus(mockTasks, 'in-progress');
      expect(inProgressTasks).toHaveLength(0);
    });
  });

  describe('calculateTaskAge', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T10:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should calculate task age in days', () => {
      const task: Task = {
        id: '1',
        title: 'Old Task',
        status: 'todo',
        createdAt: new Date('2024-01-10T10:00:00Z'),
        updatedAt: new Date('2024-01-10T10:00:00Z'),
      };

      const age = TaskService.calculateTaskAge(task);
      expect(age).toBe(5);
    });

    test('should return 0 for task created today', () => {
      const task: Task = {
        id: '1',
        title: 'New Task',
        status: 'todo',
        createdAt: new Date('2024-01-15T08:00:00Z'),
        updatedAt: new Date('2024-01-15T08:00:00Z'),
      };

      const age = TaskService.calculateTaskAge(task);
      expect(age).toBe(0);
    });
  });
});
