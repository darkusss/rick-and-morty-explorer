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
    setFilters: vi.fn(),
  };
};

describe('Filters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders counts', () => {
    mockUseFilterContext.mockReturnValue(createContextValue());

    render(<Filters totalCount={100} showingCount={20} />);

    expect(
      screen.getByText('Showing 20 of 100 characters')
    ).toBeInTheDocument();
  });

  it('updates search value when typing', () => {
    const contextValue = createContextValue();
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} />);

    const searchInput = screen.getByPlaceholderText(
      'Search characters by name...'
    ) as HTMLInputElement;

    fireEvent.change(searchInput, {
      target: { value: 'rick' },
    });

    expect(searchInput.value).toBe('rick');
  });

  it('updates filter selections', () => {
    const contextValue = createContextValue();
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} />);

    const [statusSelect, speciesSelect, genderSelect] =
      screen.getAllByRole('combobox');

    fireEvent.change(statusSelect, { target: { value: 'alive' } });

    expect(contextValue.setFilters).toHaveBeenCalledWith({
      ...contextValue.filters,
      status: 'alive',
    });

    fireEvent.change(speciesSelect, { target: { value: 'human' } });

    expect(contextValue.setFilters).toHaveBeenCalledWith({
      ...contextValue.filters,
      species: 'human',
    });

    fireEvent.change(genderSelect, { target: { value: 'female' } });

    expect(contextValue.setFilters).toHaveBeenCalledWith({
      ...contextValue.filters,
      gender: 'female',
    });
  });

  it('toggles sort order', () => {
    const contextValue = createContextValue({ sortOrder: null });
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} />);

    fireEvent.click(screen.getByRole('button', { name: 'A-Z' }));
    expect(contextValue.setSortOrder).toHaveBeenCalledWith('asc');

    fireEvent.click(screen.getByRole('button', { name: 'Z-A' }));
    expect(contextValue.setSortOrder).toHaveBeenCalledWith('desc');
  });

  it('clears all filters when clear button is clicked', () => {
    const contextValue = createContextValue({
      searchValue: 'rick',
    });
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));

    expect(contextValue.updateSearchParam).toHaveBeenCalledWith('');
    expect(contextValue.setSortOrder).toHaveBeenCalledWith(null);
    expect(contextValue.setFilters).toHaveBeenCalledWith(
      {},
      expect.any(URLSearchParams)
    );
  });

  it('shows clear button only when filters are active', () => {
    const contextValue = createContextValue();
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} />);

    // Initially, no clear button should be visible
    expect(
      screen.queryByRole('button', { name: 'Clear Filters' })
    ).not.toBeInTheDocument();

    // Type in search input to activate filters
    const searchInput = screen.getByPlaceholderText(
      'Search characters by name...'
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'rick' } });

    // Now clear button should be visible
    expect(
      screen.getByRole('button', { name: 'Clear Filters' })
    ).toBeInTheDocument();
  });

  it('shows clear button when status filter is selected', () => {
    const contextValue = createContextValue({
      filters: { status: 'alive' },
    });
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} />);

    expect(
      screen.getByRole('button', { name: 'Clear Filters' })
    ).toBeInTheDocument();
  });

  it('shows clear button when sort order is active', () => {
    const contextValue = createContextValue({ sortOrder: 'asc' });
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} />);

    expect(
      screen.getByRole('button', { name: 'Clear Filters' })
    ).toBeInTheDocument();
  });
});
