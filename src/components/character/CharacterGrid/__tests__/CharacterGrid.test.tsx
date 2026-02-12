import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import type { Character } from '../../../../types/character';
import { CharacterGrid } from '../CharacterGrid';

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

describe('CharacterGrid', () => {
  it('renders empty state when there are no characters', () => {
    render(
      <MemoryRouter>
        <CharacterGrid characters={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText('No characters found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('renders a card for each character', () => {
    const characters = [
      createCharacter(1, 'Rick Sanchez'),
      createCharacter(2, 'Morty Smith'),
    ];

    render(
      <MemoryRouter>
        <CharacterGrid characters={characters} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: /rick sanchez/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /morty smith/i })
    ).toBeInTheDocument();
  });
});
