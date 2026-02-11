import type { Character, ApiResponse, CharacterFilters } from '../types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Fetch characters with pagination and filters
 */
export const fetchCharacters = async (
  page: number = 1,
  filters: CharacterFilters = {}
): Promise<ApiResponse<Character>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());

  // Add filters to params if they have values
  // it also looks for substring matches, so it can be used for partial name search
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.append(key, value);
    }
  });

  const response = await fetch(`${BASE_URL}/character?${params}`);

  if (!response.ok) {
    if (response.status === 404) {
      // API returns 404 when no results found
      return {
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      };
    }
    throw new Error(`Failed to fetch characters: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch a single character by ID
 */
export const fetchCharacterById = async (id: number): Promise<Character> => {
  const response = await fetch(`${BASE_URL}/character/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Character not found');
    }
    throw new Error(`Failed to fetch character: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch multiple episodes by URLs
 * Used to get episode names for character detail page
 */
export const fetchEpisodesByUrls = async (
  urls: string[]
): Promise<{ id: number; name: string; episode: string }[]> => {
  // Extract IDs from URLs and fetch in batch
  const ids = urls.map((url) => url.split('/').pop()).join(',');
  
  const response = await fetch(`${BASE_URL}/episode/${ids}`);

  if (!response.ok) {
    throw new Error('Failed to fetch episodes');
  }

  const data = await response.json();
  
  // API returns single object if only one ID, array if multiple
  return Array.isArray(data) ? data : [data];
};