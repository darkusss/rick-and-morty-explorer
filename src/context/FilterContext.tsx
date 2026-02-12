import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { useDebounce } from '../hooks';
import type { CharacterFilters, SortOrder } from '../types/character';

interface FilterContextValue {
  searchValue: string;
  setSearchValue: (value: string) => void;
  filters: CharacterFilters;
  setFilters: (filters: CharacterFilters) => void;
  sortOrder: SortOrder | null;
  setSortOrder: (order: SortOrder | null) => void;
  clearAll: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);

  // Search state
  const [searchValue, setSearchValue] = useState(
    searchParams.get('name') || ''
  );
  const debouncedSearch = useDebounce(searchValue, 500);

  // Sync debounced search to URL
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        if (debouncedSearch) {
          newParams.set('name', debouncedSearch);
        } else {
          newParams.delete('name');
        }
        return newParams;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  // Derive filters from URL
  const filters: CharacterFilters = useMemo(
    () => ({
      name: debouncedSearch,
      status: searchParams.get('status') || undefined,
      species: searchParams.get('species') || undefined,
      type: searchParams.get('type') || undefined,
      gender: searchParams.get('gender') || undefined,
    }),
    [debouncedSearch, searchParams]
  );

  const setFilters = useCallback(
    (newFilters: CharacterFilters) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          if (newFilters.status) newParams.set('status', newFilters.status);
          else newParams.delete('status');

          if (newFilters.species) newParams.set('species', newFilters.species);
          else newParams.delete('species');

          if (newFilters.type) newParams.set('type', newFilters.type);
          else newParams.delete('type');

          if (newFilters.gender) newParams.set('gender', newFilters.gender);
          else newParams.delete('gender');

          return newParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearAll = useCallback(() => {
    setSearchValue('');
    setSortOrder(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const value = useMemo(
    () => ({
      searchValue,
      setSearchValue,
      filters,
      setFilters,
      sortOrder,
      setSortOrder,
      clearAll,
    }),
    [searchValue, filters, setFilters, sortOrder, clearAll]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}
