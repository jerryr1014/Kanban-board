import { render, screen, fireEvent } from '@testing-library/react';
import { SearchFilter } from '../SearchFilter';
import { KanbanProvider } from '../../context/KanbanContext';

const renderWithProvider = () => {
  return render(
    <KanbanProvider>
      <SearchFilter />
    </KanbanProvider>
  );
};

describe('SearchFilter', () => {
  test('renders search input', () => {
    renderWithProvider();
    
    const searchInput = screen.getByLabelText(/search tasks/i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search by title or description...');
  });

  test('updates filter value when typing', () => {
    renderWithProvider();
    
    const searchInput = screen.getByLabelText(/search tasks/i);
    
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput).toHaveValue('test search');
  });

  test('shows clear button when filter has value', () => {
    renderWithProvider();
    
    const searchInput = screen.getByLabelText(/search tasks/i);
    

    fireEvent.change(searchInput, { target: { value: 'test' } });
    

    expect(screen.getByTitle('Clear search')).toBeInTheDocument();
  });

  test('clears filter when clear button is clicked', () => {
    renderWithProvider();
    
    const searchInput = screen.getByLabelText(/search tasks/i);
    

    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput).toHaveValue('test');
    

    const clearButton = screen.getByTitle('Clear search');
    fireEvent.click(clearButton);
    
    expect(searchInput).toHaveValue('');
  });

  test('shows filter description when filter is active', () => {
    renderWithProvider();
    
    const searchInput = screen.getByLabelText(/search tasks/i);
    

    expect(screen.queryByText(/filtering tasks containing/i)).not.toBeInTheDocument();
    

    fireEvent.change(searchInput, { target: { value: 'test filter' } });
    

    expect(screen.getByText('Filtering tasks containing "test filter"')).toBeInTheDocument();
  });
});
