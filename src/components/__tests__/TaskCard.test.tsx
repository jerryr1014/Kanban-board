import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '../TaskCard';
import { KanbanProvider } from '../../context/KanbanContext';
import { Task } from '../../types';


jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

const renderWithProvider = (task: Task = mockTask) => {
  return render(
    <KanbanProvider>
      <TaskCard task={task} />
    </KanbanProvider>
  );
};


const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

describe('TaskCard', () => {
  beforeEach(() => {
    mockConfirm.mockClear();
  });

  test('renders task information', () => {
    renderWithProvider();
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    expect(screen.getByText(/\d+\/\d+\/\d+/)).toBeInTheDocument();
  });

  test('shows task with correct status color', () => {
    renderWithProvider();
    

    const taskCard = screen.getByText('Test Task').closest('[class*="border-l"]');
    expect(taskCard).toBeInTheDocument();
  });

  test('shows different color for different status', () => {
    const inProgressTask = { ...mockTask, status: 'in-progress' as const };
    renderWithProvider(inProgressTask);
    

    const taskCard = screen.getByText('Test Task').closest('[class*="border-l"]');
    expect(taskCard).toBeInTheDocument();
  });

  test('shows edit and delete buttons on hover', () => {
    renderWithProvider();
    

    const editButton = screen.getByText('Edit');
    const deleteButton = screen.getByText('Delete');
    
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test('can enter edit mode', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    const editButton = screen.getByText('Edit');
    await user.click(editButton);
    

    const titleInput = screen.getByDisplayValue('Test Task');
    expect(titleInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('can cancel edit mode', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    

    await user.click(screen.getByText('Edit'));
    

    const titleInput = screen.getByDisplayValue('Test Task');
    await user.clear(titleInput);
    await user.type(titleInput, 'Modified Task');
    

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    expect(screen.queryByDisplayValue('Modified Task')).not.toBeInTheDocument();
  });

  test('shows confirmation dialog when deleting', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);
    
    renderWithProvider();
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
  });

  test('does not delete when confirmation is cancelled', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false);
    
    renderWithProvider();
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(mockConfirm).toHaveBeenCalled();

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('formats date correctly for recent tasks', () => {
    const todayTask = { ...mockTask, createdAt: new Date() };
    renderWithProvider(todayTask);
    
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  test('renders task without description', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    renderWithProvider(taskWithoutDescription);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });
});
