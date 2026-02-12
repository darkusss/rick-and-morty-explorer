import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Character } from '../../types/character';
import { fetchCharacters } from '../../services/api';
import { useCharacters } from '../useCharacters';

vi.mock('../../services/api', () => ({
  fetchCharacters: vi.fn(),
}));

const createCharacter = (id: number, name: string): Character => ({
  id,
  name,
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'Earth',
    url: 'https://example.com/origin',
  },
  location: {
    name: 'Earth',
    url: 'https://example.com/location',
  },
  image: `https://example.com/character-${id}.png`,
  episode: ['https://example.com/episode/1'],
  url: `https://example.com/character/${id}`,
  created: '2017-11-04T18:48:46.250Z',
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCharacters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns sorted characters and total count', async () => {
    const page1 = {
      info: {
        count: 2,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [createCharacter(2, 'Morty'), createCharacter(1, 'Rick')],
    };

    vi.mocked(fetchCharacters).mockResolvedValue(page1);

    const { result } = renderHook(() => useCharacters({}, 'asc'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.characters.map((item) => item.name)).toEqual([
      'Morty',
      'Rick',
    ]);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.hasMore).toBe(false);
    expect(fetchCharacters).toHaveBeenCalledWith({
      pageParam: 1,
      filters: {},
      signal: expect.any(AbortSignal),
    });
  });

  it('loads more pages and appends results', async () => {
    const page1 = {
      info: {
        count: 3,
        pages: 2,
        next: 'https://rickandmortyapi.com/api/character?page=2',
        prev: null,
      },
      results: [createCharacter(1, 'Rick')],
    };

    const page2 = {
      info: {
        count: 3,
        pages: 2,
        next: null,
        prev: 'https://rickandmortyapi.com/api/character?page=1',
      },
      results: [createCharacter(2, 'Morty'), createCharacter(3, 'Summer')],
    };

    vi.mocked(fetchCharacters).mockImplementation(({ pageParam }) => {
      if (pageParam === 1) return Promise.resolve(page1);
      return Promise.resolve(page2);
    });

    const { result } = renderHook(() => useCharacters({}, null), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.loadMore();

    await waitFor(() => {
      expect(result.current.characters).toHaveLength(3);
    });

    expect(result.current.characters.map((item) => item.name)).toEqual([
      'Rick',
      'Morty',
      'Summer',
    ]);
    expect(result.current.hasMore).toBe(false);
  });
});
