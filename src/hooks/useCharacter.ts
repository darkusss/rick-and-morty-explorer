import { useQuery } from '@tanstack/react-query';
import type { Character } from '../types/character';
import { fetchCharacterById, fetchEpisodesByUrls } from '../services/api';

interface Episode {
  id: number;
  name: string;
  episode: string;
}

interface UseCharacterReturn {
  character: Character | null;
  episodes: Episode[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch a single character by ID with their episodes
 */
export function useCharacter(id: number): UseCharacterReturn {
  const {
    data: character,
    isLoading: loadingCharacter,
    error: characterError,
  } = useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacterById(id),
  });

  const {
    data: episodes,
    isLoading: loadingEpisodes,
    error: episodesError,
  } = useQuery({
    queryKey: ['character', id, 'episodes'],
    queryFn: () => {
      if (!character?.episode) return [];
      return fetchEpisodesByUrls(character.episode);
    },
    enabled: !!character?.episode,
  });

  const error = characterError || episodesError;

  return {
    character: character || null,
    episodes: episodes || [],
    loading: loadingCharacter || loadingEpisodes,
    error: error instanceof Error ? error.message : null,
  };
}
