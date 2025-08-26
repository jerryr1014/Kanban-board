import { filterTasks, groupTasksByStatus, validateTaskTitle, formatTaskDate } from '../taskUtils';
import { Task } from '../../types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Learn React',
    description: 'Study React fundamentals',
    status: 'todo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Build App',
    description: 'Create a kanban application',
    status: 'in-progress',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'Deploy Project',
    status: 'done',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

describe('taskUtils', () => {
  describe('filterTasks', () => {
    test('should return all tasks when filter is empty', () => {
      const result = filterTasks(mockTasks, '');
      expect(result).toEqual(mockTasks);
    });

    test('should filter tasks by title', () => {
      const result = filterTasks(mockTasks, 'React');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Learn React');
    });

    test('should filter tasks by description', () => {
      const result = filterTasks(mockTasks, 'kanban');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Build App');
    });

    test('should be case insensitive', () => {
      const result = filterTasks(mockTasks, 'REACT');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Learn React');
    });

    test('should return empty array when no matches', () => {
      const result = filterTasks(mockTasks, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('groupTasksByStatus', () => {
    test('should group tasks by status', () => {
      const result = groupTasksByStatus(mockTasks);
      
      expect(result.todo).toHaveLength(1);
      expect(result['in-progress']).toHaveLength(1);
      expect(result.done).toHaveLength(1);
    });

    test('should handle empty array', () => {
      const result = groupTasksByStatus([]);
      expect(result).toEqual({});
    });
  });

  describe('validateTaskTitle', () => {
    test('should validate correct title', () => {
      const result = validateTaskTitle('Valid Title');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should reject empty title', () => {
      const result = validateTaskTitle('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Title is required');
    });

    test('should reject whitespace-only title', () => {
      const result = validateTaskTitle('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Title is required');
    });

    test('should reject title that is too long', () => {
      const longTitle = 'a'.repeat(101);
      const result = validateTaskTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Title must be 100 characters or less');
    });

    test('should accept title with exactly 100 characters', () => {
      const exactTitle = 'a'.repeat(100);
      const result = validateTaskTitle(exactTitle);
      expect(result.isValid).toBe(true);
    });
  });

  describe('formatTaskDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 0, 15, 10, 0, 0));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should return "Today" for today\'s date', () => {
      const today = new Date(2024, 0, 15);
      const result = formatTaskDate(today);
      expect(result).toBe('Today');
    });

    test('should return "Yesterday" for yesterday\'s date', () => {
      const yesterday = new Date(2024, 0, 14);
      const result = formatTaskDate(yesterday);
      expect(result).toBe('Yesterday');
    });

    test('should return formatted date for other dates', () => {
      const otherDate = new Date(2024, 0, 10);
      const result = formatTaskDate(otherDate);
      expect(result).toBe(otherDate.toLocaleDateString());
    });
  });
});
