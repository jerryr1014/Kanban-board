import { AppState, AppAction } from '../../types';
import { kanbanReducer, initialState } from '../KanbanContext';

describe('kanbanReducer', () => {
  test('should add a task', () => {
    const action: AppAction = {
      type: 'ADD_TASK',
      payload: { title: 'Test Task', description: 'Test Description' }
    };

    const newState = kanbanReducer(initialState, action);

    expect(newState.tasks).toHaveLength(1);
    expect(newState.tasks[0].title).toBe('Test Task');
    expect(newState.tasks[0].description).toBe('Test Description');
    expect(newState.tasks[0].status).toBe('todo');
  });

  test('should set filter', () => {
    const action: AppAction = {
      type: 'SET_FILTER',
      payload: { filter: 'test filter' }
    };

    const newState = kanbanReducer(initialState, action);

    expect(newState.filter).toBe('test filter');
    expect(newState.tasks).toEqual(initialState.tasks);
  });

  test('should delete a task', () => {
    const stateWithTask: AppState = {
      ...initialState,
      tasks: [{
        id: 'task-1',
        title: 'Task to delete',
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]
    };

    const action: AppAction = {
      type: 'DELETE_TASK',
      payload: { id: 'task-1' }
    };

    const newState = kanbanReducer(stateWithTask, action);

    expect(newState.tasks).toHaveLength(0);
  });

  test('should return unchanged state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
    
    const newState = kanbanReducer(initialState, unknownAction);

    expect(newState).toBe(initialState);
  });
});
