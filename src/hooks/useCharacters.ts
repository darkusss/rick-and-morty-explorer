import { useMemo } from 'react';
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
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
}

export function useCharacters(
  filters: CharacterFilters,
  sortOrder: SortOrder | null
): UseCharactersReturn {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['characters', filters],
    queryFn: ({ pageParam }) => fetchCharacters({ pageParam, filters }),
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => {
      // The API returns next URL or null. We parse the page number from it.
      if (!lastPage.info.next) return undefined;
      const url = new URL(lastPage.info.next);
      return Number(url.searchParams.get('page'));
    },
  });

  const characters = useMemo(() => {
    if (!data) return [];
    const allCharacters = data.pages.flatMap((page) => page.results);

    if (!sortOrder) return allCharacters;

    return [...allCharacters].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [data, sortOrder]);

  const totalCount = data?.pages[0]?.info?.count || 0;

  return {
    characters,
    loading: isLoading || isFetchingNextPage,
    error: error instanceof Error ? error.message : null,
    hasMore: !!hasNextPage,
    totalCount,
    loadMore: () => fetchNextPage(),
  };
}
