import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { Character } from '../../../../types/character';
import { CharacterCard } from '../CharacterCard';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(() => {
  // Ensure cleanup between tests.
  document.body.innerHTML = '';
});

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

describe('CharacterCard', () => {
  it('renders character details and link', () => {
    const character = createCharacter();

    render(
      <MemoryRouter>
        <CharacterCard character={character} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /rick sanchez/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/character/${character.id}`);
    expect(screen.getByAltText(character.name)).toHaveAttribute(
      'src',
      character.image
    );
    expect(screen.getByText(character.species)).toBeInTheDocument();
    expect(screen.getByText('Last known location:')).toBeInTheDocument();
    expect(screen.getByText(character.location.name)).toBeInTheDocument();
  });
});
