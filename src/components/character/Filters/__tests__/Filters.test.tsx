import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Filters } from '../Filters';
import type { CharacterFilters, SortOrder } from '../../../../types/character';
import { useFilterContext } from '../../../../context';

vi.mock('../../../../context', () => ({
  useFilterContext: vi.fn(),
}));

vi.mock('../../../../hooks', () => ({
  useDebounce: vi.fn((value) => value),
}));

const mockUseFilterContext = vi.mocked(useFilterContext);

const createContextValue = (overrides?: {
  searchValue?: string;
  filters?: CharacterFilters;
  sortOrder?: SortOrder | null;
}) => {
  const baseFilters: CharacterFilters = {
    status: undefined,
    species: undefined,
    type: undefined,
    gender: undefined,
  };

  return {
    searchValue: overrides?.searchValue ?? '',
    updateSearchParam: vi.fn(),
    filters: overrides?.filters ?? baseFilters,
    sortOrder: overrides?.sortOrder ?? null,
    setSortOrder: vi.fn(),
    setSearchParams: vi.fn(),
  };
};

describe('Filters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders counts', () => {
    mockUseFilterContext.mockReturnValue(createContextValue());

    render(<Filters totalCount={100} showingCount={20} setFilters={vi.fn()} />);

    expect(
      screen.getByText('Showing 20 of 100 characters')
    ).toBeInTheDocument();
  });

  it('updates search value when typing', () => {
    const contextValue = createContextValue();
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} setFilters={vi.fn()} />);

    const searchInput = screen.getByPlaceholderText(
      'Search characters by name...'
    ) as HTMLInputElement;

    fireEvent.change(searchInput, {
      target: { value: 'rick' },
    });

    expect(searchInput.value).toBe('rick');
  });

  it('updates status, species, and gender filters', () => {
    const contextValue = createContextValue();
    const mockSetFilters = vi.fn();
    mockUseFilterContext.mockReturnValue(contextValue);

    render(
      <Filters totalCount={0} showingCount={0} setFilters={mockSetFilters} />
    );

    const [statusSelect, speciesSelect, genderSelect] =
      screen.getAllByRole('combobox');

    fireEvent.change(statusSelect, { target: { value: 'alive' } });
    fireEvent.change(speciesSelect, { target: { value: 'human' } });
    fireEvent.change(genderSelect, { target: { value: 'female' } });

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...contextValue.filters,
      status: 'alive',
    });

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...contextValue.filters,
      species: 'human',
    });

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...contextValue.filters,
      gender: 'female',
    });
  });

  it('toggles sort order', () => {
    const contextValue = createContextValue({ sortOrder: null });
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} setFilters={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'A-Z' }));
    fireEvent.click(screen.getByRole('button', { name: 'Z-A' }));

    expect(contextValue.setSortOrder).toHaveBeenCalledWith('asc');
    expect(contextValue.setSortOrder).toHaveBeenCalledWith('desc');
  });

  it('clears all filters when clear button is clicked', () => {
    const contextValue = createContextValue({
      searchValue: 'rick',
    });
    const mockSetFilters = vi.fn();
    mockUseFilterContext.mockReturnValue(contextValue);

    render(
      <Filters totalCount={0} showingCount={0} setFilters={mockSetFilters} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));

    expect(contextValue.updateSearchParam).toHaveBeenCalledWith('');
    expect(contextValue.setSortOrder).toHaveBeenCalledWith(null);
    expect(mockSetFilters).toHaveBeenCalledWith(
      {},
      expect.any(URLSearchParams)
    );
  });
});
