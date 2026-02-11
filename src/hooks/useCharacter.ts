import { useState, useEffect } from 'react';
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
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch character data
        const characterData = await fetchCharacterById(id);
        setCharacter(characterData);

        // Fetch episodes data
        if (characterData.episode.length > 0) {
          const episodesData = await fetchEpisodesByUrls(characterData.episode);
          setEpisodes(episodesData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch character'
        );
        setCharacter(null);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [id]);

  return {
    character,
    episodes,
    loading,
    error,
  };
}
