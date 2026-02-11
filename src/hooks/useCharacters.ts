import { useState, useEffect, useCallback } from 'react';
import type {
  Character,
  CharacterFilters,
  SortOrder,
} from '../types/character';
import { fetchCharacters } from '../services/api';

interface UseCharactersReturn {
  characters: Character[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  loadMore: () => void;
  sortOrder: SortOrder | null;
  setSortOrder: (order: SortOrder | null) => void;
}

/**
 * Hook to fetch and manage characters list
 * Supports filtering, pagination (load more), and sorting
 */
export function useCharacters(filters: CharacterFilters): UseCharactersReturn {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);

  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [filters.name, filters.status, filters.species, filters.gender]);

  // Fetch characters
  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchCharacters(page, filters);

        setCharacters((prev) => {
          // If page is 1, replace all characters (new filter applied)
          if (page === 1) {
            return response.results;
          }
          // Otherwise append to existing list
          return [...prev, ...response.results];
        });

        setTotalCount(response.info.count);
        setHasMore(response.info.next !== null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch characters'
        );
        if (page === 1) {
          setCharacters([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [page, filters.name, filters.status, filters.species, filters.gender]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  // Sort characters (client-side)
  const sortedCharacters = useCallback(() => {
    if (!sortOrder) {
      return characters;
    }

    return [...characters].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }, [characters, sortOrder]);

  return {
    characters: sortedCharacters(),
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    sortOrder,
    setSortOrder,
  };
}
