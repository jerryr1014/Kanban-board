import { Search } from 'lucide-react';
import { useKanban } from '../hooks/useKanban';

export function SearchFilter() {
  const { state, dispatch } = useKanban();

  const clearFilter = () => {
    dispatch({ type: 'SET_FILTER', payload: { filter: '' } });
  };

  return (
    <div className="space-y-2">
      <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700">
        Search Tasks
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          id="search-filter"
          type="text"
          placeholder="Search by title or description..."
          value={state.filter}
          onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { filter: e.target.value } })}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
        />
        {state.filter && (
          <button
            onClick={clearFilter}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {state.filter && (
        <div className="text-xs text-gray-500">
          Filtering tasks containing "{state.filter}"
        </div>
      )}
    </div>
  );
}
