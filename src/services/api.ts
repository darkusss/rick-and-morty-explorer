import type {
  Character,
  ApiResponse,
  CharacterFilters,
} from '../types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';
const CACHE_PREFIX = 'rm_cache_';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Get cached data from localStorage
 */
function getFromCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const cached: CacheEntry<T> = JSON.parse(item);

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
}

/**
 * Save data to localStorage cache
 */
function saveToCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (error) {
    // localStorage might be full or disabled
    console.warn('Failed to save to cache:', error);
  }
}

/**
 * Fetch characters with pagination and filters
 */
export async function fetchCharacters(
  page: number = 1,
  filters: CharacterFilters = {}
): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.append(key, value);
    }
  });

  const cacheKey = `characters_${params.toString()}`;

  // Check cache first
  const cached = getFromCache<ApiResponse<Character>>(cacheKey);
  if (cached) {
    return cached;
  }

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

  const data = await response.json();
  saveToCache(cacheKey, data);

  return data;
}

/**
 * Fetch a single character by ID
 */
export async function fetchCharacterById(id: number): Promise<Character> {
  const cacheKey = `character_${id}`;

  // Check cache first
  const cached = getFromCache<Character>(cacheKey);
  if (cached) {
    return cached;
  }

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

  const data = await response.json();
  saveToCache(cacheKey, data);

  return data;
}

/**
 * Fetch multiple episodes by URLs
 */
export async function fetchEpisodesByUrls(
  urls: string[]
): Promise<{ id: number; name: string; episode: string }[]> {
  const ids = urls.map((url) => url.split('/').pop()).join(',');
  const cacheKey = `episodes_${ids}`;

  // Check cache first
  const cached =
    getFromCache<{ id: number; name: string; episode: string }[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(`${BASE_URL}/episode/${ids}`);

  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch episodes');
  }

  const data = await response.json();
  const result = Array.isArray(data) ? data : [data];
  saveToCache(cacheKey, result);

  return result;
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
