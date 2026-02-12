import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchCharacterById,
  fetchCharacters,
  fetchEpisodesByUrls,
} from '../api';

const createResponse = (status: number, body: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  }) as unknown as Response;

describe('api', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetchCharacters returns results for successful response', async () => {
    const payload = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{ id: 1, name: 'Rick' }],
    };

    fetchMock.mockResolvedValue(createResponse(200, payload));

    const result = await fetchCharacters({
      pageParam: 2,
      filters: { name: 'rick', status: 'alive' },
    });

    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?page=2&name=rick&status=alive',
      { signal: undefined }
    );
  });

  it('fetchCharacters returns empty results on 404', async () => {
    fetchMock.mockResolvedValue(createResponse(404, {}));

    const result = await fetchCharacters({ pageParam: 1, filters: {} });

    expect(result.results).toEqual([]);
    expect(result.info.count).toBe(0);
  });

  it('fetchCharacters throws on rate limit', async () => {
    fetchMock.mockResolvedValue(createResponse(429, {}));

    await expect(
      fetchCharacters({ pageParam: 1, filters: {} })
    ).rejects.toThrow('Too many requests. Please wait a moment and try again.');
  });

  it('fetchCharacterById returns data when successful', async () => {
    const payload = { id: 1, name: 'Morty' };
    fetchMock.mockResolvedValue(createResponse(200, payload));

    const result = await fetchCharacterById(1);

    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/1',
      { signal: undefined }
    );
  });

  it('fetchCharacterById throws on 404', async () => {
    fetchMock.mockResolvedValue(createResponse(404, {}));

    await expect(fetchCharacterById(999)).rejects.toThrow(
      'Character not found'
    );
  });

  it('fetchEpisodesByUrls normalizes single response', async () => {
    const payload = { id: 1, name: 'Pilot', episode: 'S01E01' };
    fetchMock.mockResolvedValue(createResponse(200, payload));

    const result = await fetchEpisodesByUrls([
      'https://rickandmortyapi.com/api/episode/1',
    ]);

    expect(result).toEqual([payload]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/episode/1',
      { signal: undefined }
    );
  });

  it('fetchEpisodesByUrls fetches multiple ids', async () => {
    const payload = [
      { id: 1, name: 'Pilot', episode: 'S01E01' },
      { id: 2, name: 'Lawnmower Dog', episode: 'S01E02' },
    ];

    fetchMock.mockResolvedValue(createResponse(200, payload));

    const result = await fetchEpisodesByUrls([
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/2',
    ]);

    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/episode/1,2',
      { signal: undefined }
    );
  });
});
