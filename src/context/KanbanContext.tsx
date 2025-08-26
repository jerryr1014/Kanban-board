import { createContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, AppAction, Task, TaskStatus, HistoryEntry } from '../types';

export const initialState: AppState = {
  tasks: [],
  columns: [
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'in-progress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ],
  filter: '',
  history: [],
};

export const KanbanContext = createContext<{
  state: AppState;
  dispatch: (action: AppAction) => void;
} | null>(null);

export function kanbanReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description,
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newTasks = [...state.tasks, newTask];
      const newHistory = addHistoryEntry(state.history, 'Created task', newTask.title);

      return {
        ...state,
        tasks: newTasks,
        columns: updateColumnsWithTasks(state.columns, newTasks),
        history: newHistory,
      };
    }

    case 'UPDATE_TASK': {
      const newTasks = state.tasks.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates, updatedAt: new Date() }
          : task
      );

      const updatedTask = newTasks.find(task => task.id === action.payload.id);
      const newHistory = addHistoryEntry(
        state.history,
        'Updated task',
        updatedTask?.title || 'Unknown task'
      );

      return {
        ...state,
        tasks: newTasks,
        columns: updateColumnsWithTasks(state.columns, newTasks),
        history: newHistory,
      };
    }

    case 'DELETE_TASK': {
      const taskToDelete = state.tasks.find(task => task.id === action.payload.id);
      const newTasks = state.tasks.filter(task => task.id !== action.payload.id);
      const newHistory = addHistoryEntry(
        state.history,
        'Deleted task',
        taskToDelete?.title || 'Unknown task'
      );

      return {
        ...state,
        tasks: newTasks,
        columns: updateColumnsWithTasks(state.columns, newTasks),
        history: newHistory,
      };
    }

    case 'MOVE_TASK': {
      const newTasks = state.tasks.map(task =>
        task.id === action.payload.id
          ? { ...task, status: action.payload.status as TaskStatus, updatedAt: new Date() }
          : task
      );

      const movedTask = newTasks.find(task => task.id === action.payload.id);
      const newHistory = addHistoryEntry(
        state.history,
        `Moved task to ${action.payload.status}`,
        movedTask?.title || 'Unknown task'
      );

      return {
        ...state,
        tasks: newTasks,
        columns: updateColumnsWithTasks(state.columns, newTasks),
        history: newHistory,
      };
    }

    case 'SET_FILTER': {
      return {
        ...state,
        filter: action.payload.filter,
      };
    }

    case 'LOAD_STATE': {
      return {
        ...action.payload.state,
        columns: updateColumnsWithTasks(state.columns, action.payload.state.tasks),
      };
    }

    case 'ADD_HISTORY_ENTRY': {
      const newHistory = addHistoryEntry(state.history, action.payload.action, action.payload.taskTitle);
      return {
        ...state,
        history: newHistory,
      };
    }

    default:
      return state;
  }
}

function updateColumnsWithTasks(columns: AppState['columns'], tasks: Task[]) {
  return columns.map(column => ({
    ...column,
    tasks: tasks.filter(task => task.status === column.id),
  }));
}

function addHistoryEntry(history: HistoryEntry[], action: string, taskTitle: string): HistoryEntry[] {
  const newEntry: HistoryEntry = {
    id: uuidv4(),
    action,
    taskTitle,
    timestamp: new Date(),
  };

  return [newEntry, ...history].slice(0, 5);
}

interface KanbanProviderProps {
  children: ReactNode;
}

export function KanbanProvider({ children }: KanbanProviderProps) {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('kanban-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        const stateWithDates = {
          ...parsedState,
          tasks: parsedState.tasks.map((task: Task & { createdAt: string; updatedAt: string }) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
          })),
          history: parsedState.history.map((entry: HistoryEntry & { timestamp: string }) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })),
        };
        dispatch({ type: 'LOAD_STATE', payload: { state: stateWithDates } });
      } catch (error) {
        console.error('Failed to load state from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('kanban-state', JSON.stringify(state));
    }
  }, [state, isInitialized]);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}


