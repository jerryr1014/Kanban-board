import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddTaskForm } from '../AddTaskForm';
import { KanbanProvider } from '../../context/KanbanContext';

const renderWithProvider = () => {
  return render(
    <KanbanProvider>
      <AddTaskForm />
    </KanbanProvider>
  );
};

describe('AddTaskForm', () => {
  test('renders add task button initially', () => {
    renderWithProvider();
    
    expect(screen.getByRole('button', { name: /create new task/i })).toBeInTheDocument();
    expect(screen.getByText('Add a task to your board')).toBeInTheDocument();
  });

  test('shows form when add task button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    const addButton = screen.getByRole('button', { name: /create new task/i });
    await user.click(addButton);
    
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  test('can input task title and description', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    

    await user.click(screen.getByRole('button', { name: /create new task/i }));
    
    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    
    expect(titleInput).toHaveValue('Test Task');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  test('shows character counters', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    

    await user.click(screen.getByRole('button', { name: /create new task/i }));
    
    expect(screen.getByText('0/100 characters')).toBeInTheDocument();
    expect(screen.getByText('0/500 characters')).toBeInTheDocument();
    
    const titleInput = screen.getByLabelText(/task title/i);
    await user.type(titleInput, 'Test');
    
    expect(screen.getByText('4/100 characters')).toBeInTheDocument();
  });

  test('disables submit button when title is empty', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    

    await user.click(screen.getByRole('button', { name: /create new task/i }));
    
    const submitButton = screen.getByRole('button', { name: /create task/i });
    expect(submitButton).toBeDisabled();
    
    const titleInput = screen.getByLabelText(/task title/i);
    await user.type(titleInput, 'Test Task');
    
    expect(submitButton).toBeEnabled();
  });

  test('can cancel form', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    await user.click(screen.getByRole('button', { name: /create new task/i }));

    await user.type(screen.getByLabelText(/task title/i), 'Test Task');

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.getByRole('button', { name: /create new task/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/task title/i)).not.toBeInTheDocument();
  });

  test('shows loading state when submitting', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    await user.click(screen.getByRole('button', { name: /create new task/i }));

    await user.type(screen.getByLabelText(/task title/i), 'Test Task');

    const submitButton = screen.getByRole('button', { name: /create task/i });

    const submitPromise = user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument();
    }, { timeout: 100 });

    await submitPromise;
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create new task/i })).toBeInTheDocument();
    });
  });
});
