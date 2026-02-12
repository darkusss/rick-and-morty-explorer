import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../Home';
import type {
  Character,
  CharacterFilters,
  SortOrder,
} from '../../../types/character';

// Mock hooks and context
vi.mock('../../../hooks', () => ({
  useCharacters: vi.fn(),
}));

vi.mock('../../../context', () => ({
  useFilterContext: vi.fn(),
}));

// Mock child components
vi.mock('../../../components/layout', () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
}));

vi.mock('../../../components/character', () => ({
  CharacterGrid: ({ characters }: { characters: Character[] }) => (
    <div data-testid="character-grid">
      {characters.map((char) => (
        <div key={char.id} data-testid={`character-${char.id}`}>
          {char.name}
        </div>
      ))}
    </div>
  ),
  Filters: ({
    totalCount,
    showingCount,
  }: {
    totalCount: number;
    showingCount: number;
  }) => (
    <div data-testid="filters">
      Showing {showingCount} of {totalCount}
    </div>
  ),
}));

vi.mock('../../../components/common', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: string;
    size?: string;
  }) => (
    <button
      onClick={onClick}
      data-testid="button"
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

// Import mocked functions to access them
import { useCharacters } from '../../../hooks';
import { useFilterContext } from '../../../context';

const mockUseCharacters = useCharacters as ReturnType<typeof vi.fn>;
const mockUseFilterContext = useFilterContext as ReturnType<typeof vi.fn>;

// Test data
const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [],
    url: '',
    created: '2017-11-04T18:48:46.250Z',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'unknown', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: [],
    url: '',
    created: '2017-11-04T18:50:21.651Z',
  },
];

const createFilterContextValue = (overrides = {}) => ({
  searchValue: '',
  updateSearchParam: vi.fn(),
  filters: {},
  sortOrder: null as SortOrder | null,
  setSortOrder: vi.fn(),
  setSearchParams: vi.fn(),
  setFilters: vi.fn(),
  ...overrides,
});

const createUseCharactersReturn = (overrides = {}) => ({
  characters: [],
  loading: false,
  error: null,
  hasMore: false,
  totalCount: 0,
  loadMore: vi.fn(),
  ...overrides,
});

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFilterContext.mockReturnValue(createFilterContextValue());
    mockUseCharacters.mockReturnValue(createUseCharactersReturn());
  });

  describe('Basic Rendering', () => {
    it('renders the header and subtitle', () => {
      render(<Home />);

      expect(
        screen.getByRole('heading', { name: /characters/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /explore all characters from the rick and morty universe/i
        )
      ).toBeInTheDocument();
    });

    it('renders the Container component', () => {
      render(<Home />);

      expect(screen.getByTestId('container')).toBeInTheDocument();
    });

    it('renders the Filters component with correct props', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: mockCharacters,
          totalCount: 826,
        })
      );

      render(<Home />);

      const filters = screen.getByTestId('filters');
      expect(filters).toBeInTheDocument();
      expect(filters).toHaveTextContent('Showing 2 of 826');
    });
  });

  describe('Character Display', () => {
    it('displays characters when data is available', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: mockCharacters,
          totalCount: 2,
        })
      );

      render(<Home />);

      expect(screen.getByTestId('character-grid')).toBeInTheDocument();
      expect(screen.getByTestId('character-1')).toHaveTextContent(
        'Rick Sanchez'
      );
      expect(screen.getByTestId('character-2')).toHaveTextContent(
        'Morty Smith'
      );
    });

    it('renders empty character grid when no characters', () => {
      render(<Home />);

      const grid = screen.getByTestId('character-grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toBeEmptyDOMElement();
    });
  });

  describe('Loading State', () => {
    it('displays loader when loading is true', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          loading: true,
        })
      );

      render(<Home />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    });

    it('does not display loader when not loading', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          loading: false,
        })
      );

      render(<Home />);

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when error exists', () => {
      const errorMessage = 'Failed to fetch characters';
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          error: errorMessage,
        })
      );

      render(<Home />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('does not display error when error is null', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          error: null,
        })
      );

      render(<Home />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Load More Button', () => {
    it('displays load more button when hasMore is true and has characters', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: mockCharacters,
          hasMore: true,
          loading: false,
        })
      );

      render(<Home />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(/load more characters/i);
      expect(button).toHaveAttribute('data-variant', 'primary');
      expect(button).toHaveAttribute('data-size', 'large');
    });

    it('does not display load more button when hasMore is false', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: mockCharacters,
          hasMore: false,
          loading: false,
        })
      );

      render(<Home />);

      expect(screen.queryByTestId('button')).not.toBeInTheDocument();
    });

    it('does not display load more button when loading', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: mockCharacters,
          hasMore: true,
          loading: true,
        })
      );

      render(<Home />);

      expect(screen.queryByTestId('button')).not.toBeInTheDocument();
    });

    it('does not display load more button when no characters', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: [],
          hasMore: true,
          loading: false,
        })
      );

      render(<Home />);

      expect(screen.queryByTestId('button')).not.toBeInTheDocument();
    });

    it('calls loadMore when button is clicked', () => {
      const loadMore = vi.fn();
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: mockCharacters,
          hasMore: true,
          loadMore,
        })
      );

      render(<Home />);

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(loadMore).toHaveBeenCalledTimes(1);
    });
  });

  describe('End of Results Message', () => {
    it('displays end message when no more results and has characters', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: mockCharacters,
          hasMore: false,
        })
      );

      render(<Home />);

      expect(screen.getByText(/you've reached the end!/i)).toBeInTheDocument();
    });

    it('does not display end message when hasMore is true', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: mockCharacters,
          hasMore: true,
        })
      );

      render(<Home />);

      expect(
        screen.queryByText(/you've reached the end!/i)
      ).not.toBeInTheDocument();
    });

    it('does not display end message when no characters', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: [],
          hasMore: false,
        })
      );

      render(<Home />);

      expect(
        screen.queryByText(/you've reached the end!/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Context Integration', () => {
    it('passes filters from context to useCharacters hook', () => {
      const filters: CharacterFilters = {
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
      };
      const sortOrder: SortOrder = 'asc';

      mockUseFilterContext.mockReturnValue(
        createFilterContextValue({
          filters,
          sortOrder,
        })
      );

      render(<Home />);

      expect(mockUseCharacters).toHaveBeenCalledWith(filters, sortOrder);
    });

    it('handles null sortOrder', () => {
      const filters: CharacterFilters = { name: 'Morty' };

      mockUseFilterContext.mockReturnValue(
        createFilterContextValue({
          filters,
          sortOrder: null,
        })
      );

      render(<Home />);

      expect(mockUseCharacters).toHaveBeenCalledWith(filters, null);
    });
  });

  describe('Edge Cases', () => {
    it('handles simultaneous loading and error states', () => {
      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          loading: true,
          error: 'Network error',
        })
      );

      render(<Home />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('handles large number of characters', () => {
      const manyCharacters = Array.from({ length: 100 }, (_, i) => ({
        ...mockCharacters[0],
        id: i + 1,
        name: `Character ${i + 1}`,
      }));

      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: manyCharacters,
          totalCount: 826,
        })
      );

      render(<Home />);

      expect(screen.getByTestId('character-grid')).toBeInTheDocument();
      expect(screen.getByTestId('filters')).toHaveTextContent(
        'Showing 100 of 826'
      );
    });

    it('updates when useCharacters returns new data', () => {
      const { rerender } = render(<Home />);

      expect(screen.queryByTestId('character-1')).not.toBeInTheDocument();

      mockUseCharacters.mockReturnValue(
        createUseCharactersReturn({
          characters: mockCharacters,
          totalCount: 2,
        })
      );

      rerender(<Home />);

      expect(screen.getByTestId('character-1')).toBeInTheDocument();
      expect(screen.getByTestId('character-2')).toBeInTheDocument();
    });
  });
});
