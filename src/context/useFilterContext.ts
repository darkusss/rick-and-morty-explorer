import { createContext, useContext } from 'react';
import type { CharacterFilters, SortOrder } from '../types/character';
import type { SetURLSearchParams } from 'react-router';

interface FilterContextValue {
  searchValue: string;
  updateSearchParam: (value: string) => void;
  filters: CharacterFilters;
  sortOrder: SortOrder | null;
  setSortOrder: (order: SortOrder | null) => void;
  setSearchParams: SetURLSearchParams;
  setFilters: (
    filters: CharacterFilters,
    prevURLSearchParams?: URLSearchParams
  ) => void;
}

export const FilterContext = createContext<FilterContextValue | null>(null);

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}
