export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface HistoryEntry {
  id: string;
  action: string;
  taskTitle: string;
  timestamp: Date;
}

export interface AppState {
  tasks: Task[];
  columns: Column[];
  filter: string;
  history: HistoryEntry[];
}

export type AppAction =
  | { type: 'ADD_TASK'; payload: { title: string; description?: string } }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'MOVE_TASK'; payload: { id: string; status: TaskStatus } }
  | { type: 'SET_FILTER'; payload: { filter: string } }
  | { type: 'LOAD_STATE'; payload: { state: AppState } }
  | { type: 'ADD_HISTORY_ENTRY'; payload: { action: string; taskTitle: string } };
