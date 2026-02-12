import type {
  Character,
  ApiResponse,
  CharacterFilters,
} from '../types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Fetch characters with pagination and filters
 */
export async function fetchCharacters({
  pageParam = 1,
  filters = {},
}: {
  pageParam?: number;
  filters?: CharacterFilters;
}): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams();
  params.append('page', pageParam.toString());

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.append(key, value);
    }
  });

  const response = await fetch(`${BASE_URL}/character?${params}`);

  if (response.status === 404) {
    return {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    };
  }

  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch characters: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch a single character by ID
 */
export async function fetchCharacterById(id: number): Promise<Character> {
  const response = await fetch(`${BASE_URL}/character/${id}`);

  if (response.status === 404) {
    throw new Error('Character not found');
  }

  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch character: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch multiple episodes by URLs
 */
export async function fetchEpisodesByUrls(
  urls: string[]
): Promise<{ id: number; name: string; episode: string }[]> {
  const ids = urls.map((url) => url.split('/').pop()).join(',');
  const response = await fetch(`${BASE_URL}/episode/${ids}`);

  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch episodes');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}
