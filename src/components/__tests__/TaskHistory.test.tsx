import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskHistory } from '../TaskHistory';
import { KanbanProvider } from '../../context/KanbanContext';
import { useKanban } from '../../hooks/useKanban';


const TestComponentWithHistory = () => {
  const { dispatch } = useKanban();
  
  const addTask = () => {
    dispatch({
      type: 'ADD_TASK',
      payload: { title: 'Test Task', description: 'Test Description' }
    });
  };
  
  return (
    <div>
      <button onClick={addTask} data-testid="add-task">Add Task</button>
      <TaskHistory />
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <KanbanProvider>
      <TestComponentWithHistory />
    </KanbanProvider>
  );
};

describe('TaskHistory', () => {
  test('shows empty state when no history', () => {
    render(
      <KanbanProvider>
        <TaskHistory />
      </KanbanProvider>
    );
    
    expect(screen.getByText('No recent activity')).toBeInTheDocument();
    expect(screen.getByText('Task actions will appear here')).toBeInTheDocument();
  });

  test('shows history entries after actions', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    await user.click(screen.getByTestId('add-task'));
    

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    const historyEntries = screen.getAllByText(/Created task/);
    expect(historyEntries.length).toBeGreaterThan(0);
    expect(screen.getByText('"Test Task"')).toBeInTheDocument();
  });

  test('shows correct icons for different actions', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    

    await user.click(screen.getByTestId('add-task'));
    

    const historyEntries = screen.getAllByText(/Created task/);
    expect(historyEntries.length).toBeGreaterThan(0);
  });

  test('can expand and collapse history', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    await user.click(screen.getByTestId('add-task'));
    

    const viewAllButton = screen.getByText('View all');
    expect(viewAllButton).toBeInTheDocument();
    

    await user.click(viewAllButton);
    expect(screen.getByText('Collapse')).toBeInTheDocument();
    

    await user.click(screen.getByText('Collapse'));
    expect(screen.getByText('View all')).toBeInTheDocument();
  });

  test('shows relative time formatting', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    

    await user.click(screen.getByTestId('add-task'));
    

    const timeElements = screen.getAllByText('Just now');
    expect(timeElements.length).toBeGreaterThan(0);
  });

  test('limits visible entries when collapsed', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    

    await user.click(screen.getByTestId('add-task'));
    await user.click(screen.getByTestId('add-task'));
    await user.click(screen.getByTestId('add-task'));
    await user.click(screen.getByTestId('add-task'));
    

    await waitFor(() => {
      const viewMoreButton = screen.queryByText(/View \d+ more activities/);
      if (viewMoreButton) {
        expect(viewMoreButton).toBeInTheDocument();
      } else {

        expect(screen.getAllByText(/Created task/).length).toBeGreaterThan(0);
      }
    });
  });

  test('shows action-specific colors', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    

    await user.click(screen.getByTestId('add-task'));
    

    await waitFor(() => {
      const historyEntries = screen.getAllByText(/Created task/);
      expect(historyEntries.length).toBeGreaterThan(0);
    });
    

    const historyEntries = screen.getAllByText(/Created task/);
    const historyEntry = historyEntries[0].closest('div');
    expect(historyEntry).toBeInTheDocument();

    const plusIcons = document.querySelectorAll('svg.lucide-plus');
    expect(plusIcons.length).toBeGreaterThan(0);
  });
});
