import { renderHook } from '@testing-library/react';
import { useKanban } from '../useKanban';
import { KanbanProvider } from '../../context/KanbanContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <KanbanProvider>{children}</KanbanProvider>
);

describe('useKanban', () => {
  test('returns context values', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    
    expect(result.current.state).toBeDefined();
    expect(result.current.dispatch).toBeDefined();
    expect(typeof result.current.dispatch).toBe('function');
  });

  test('throws error when used outside provider', () => {

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useKanban());
    }).toThrow('useKanban must be used within a KanbanProvider');
    
    consoleSpy.mockRestore();
  });

  test('provides initial state structure', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    
    const { state } = result.current;
    
    expect(state.tasks).toEqual([]);
    expect(state.filter).toBe('');
    expect(state.history).toEqual([]);
    expect(state.columns).toHaveLength(3);
    expect(state.columns[0].id).toBe('todo');
    expect(state.columns[1].id).toBe('in-progress');
    expect(state.columns[2].id).toBe('done');
  });
});
