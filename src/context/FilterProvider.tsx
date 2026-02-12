import { useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import type { CharacterFilters, SortOrder } from '../types/character';
import { FilterContext } from './useFilterContext';

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);

  // Read search value directly from URL
  const searchValue = searchParams.get('name') || '';

  // Function to update search param in URL
  const updateSearchParam = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);

          if (value) {
            newParams.set('name', value);
          } else {
            newParams.delete('name');
          }

          return newParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setFilters = useCallback(
    (newFilters: CharacterFilters, prevURLSearchParams?: URLSearchParams) => {
      setSearchParams(
        (prev) => {
          const newParams = prevURLSearchParams || prev;
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

  // Derive filters from URL
  const filters: CharacterFilters = useMemo(
    () => ({
      name: searchValue,
      status: searchParams.get('status') || undefined,
      species: searchParams.get('species') || undefined,
      type: searchParams.get('type') || undefined,
      gender: searchParams.get('gender') || undefined,
    }),
    [searchValue, searchParams]
  );

  const value = useMemo(
    () => ({
      searchValue,
      updateSearchParam,
      filters,
      sortOrder,
      setSortOrder,
      setSearchParams,
      setFilters,
    }),
    [
      searchValue,
      updateSearchParam,
      filters,
      sortOrder,
      setSortOrder,
      setSearchParams,
      setFilters,
    ]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}
