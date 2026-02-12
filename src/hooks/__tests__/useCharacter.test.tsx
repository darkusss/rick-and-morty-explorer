import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, expect, beforeEach, it } from 'vitest';
import { useCharacter } from '../useCharacter';
import { fetchCharacterById, fetchEpisodesByUrls } from '../../services/api';
import type { Character } from '../../types/character';

vi.mock('../../services/api', () => ({
  fetchCharacterById: vi.fn(),
  fetchEpisodesByUrls: vi.fn(),
}));

const createCharacter = (): Character => ({
  id: 1,
  name: 'Rick Sanchez',
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
  image: 'https://example.com/rick.png',
  episode: ['https://example.com/episode/1'],
  url: 'https://example.com/character/1',
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

describe('useCharacter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns character and episodes', async () => {
    const character = createCharacter();
    const episodes = [{ id: 1, name: 'Pilot', episode: 'S01E01' }];

    vi.mocked(fetchCharacterById).mockResolvedValue(character);
    vi.mocked(fetchEpisodesByUrls).mockResolvedValue(episodes);

    const { result } = renderHook(() => useCharacter(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.character).toEqual(character);
    expect(result.current.episodes).toEqual(episodes);
    expect(fetchCharacterById).toHaveBeenCalledWith(1, expect.any(AbortSignal));
    expect(fetchEpisodesByUrls).toHaveBeenCalledWith(
      character.episode,
      expect.any(AbortSignal)
    );
  });

  it('returns error when character fetch fails', async () => {
    vi.mocked(fetchCharacterById).mockRejectedValue(
      new Error('Character not found')
    );

    const { result } = renderHook(() => useCharacter(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.character).toBeNull();
    expect(result.current.error).toBe('Character not found');
  });

  it('aborts the request on unmount', async () => {
    let capturedSignal: AbortSignal | undefined;

    vi.mocked(fetchCharacterById).mockImplementation((_id, signal) => {
      capturedSignal = signal;
      return new Promise(() => {
        // Never resolves; we only care about abort behavior.
      });
    });

    const { unmount } = renderHook(() => useCharacter(1), {
      wrapper: createWrapper(),
    });

    expect(capturedSignal).toBeDefined();
    unmount();

    await waitFor(() => {
      expect(capturedSignal?.aborted).toBe(true);
    });
  });
});
