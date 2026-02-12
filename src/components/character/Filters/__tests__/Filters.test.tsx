import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Filters } from '../Filters';
import * as FilterContext from '../../../../context/FilterContext';
import type { CharacterFilters, SortOrder } from '../../../../types/character';

vi.mock('../../../../context/FilterContext', () => ({
  useFilterContext: vi.fn(),
}));

const mockUseFilterContext = vi.mocked(FilterContext.useFilterContext);

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
    setSearchValue: vi.fn(),
    filters: overrides?.filters ?? baseFilters,
    setFilters: vi.fn(),
    sortOrder: overrides?.sortOrder ?? null,
    setSortOrder: vi.fn(),
    clearAll: vi.fn(),
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

    fireEvent.change(
      screen.getByPlaceholderText('Search characters by name...'),
      {
        target: { value: 'rick' },
      }
    );

    expect(contextValue.setSearchValue).toHaveBeenCalledWith('rick');
  });

  it('updates status, species, and gender filters', () => {
    const contextValue = createContextValue();
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} />);

    const [statusSelect, speciesSelect, genderSelect] =
      screen.getAllByRole('combobox');

    fireEvent.change(statusSelect, { target: { value: 'alive' } });
    fireEvent.change(speciesSelect, { target: { value: 'human' } });
    fireEvent.change(genderSelect, { target: { value: 'female' } });

    expect(contextValue.setFilters).toHaveBeenCalledWith({
      ...contextValue.filters,
      status: 'alive',
    });

    expect(contextValue.setFilters).toHaveBeenCalledWith({
      ...contextValue.filters,
      species: 'human',
    });

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
    fireEvent.click(screen.getByRole('button', { name: 'Z-A' }));

    expect(contextValue.setSortOrder).toHaveBeenCalledWith('asc');
    expect(contextValue.setSortOrder).toHaveBeenCalledWith('desc');
  });

  it('shows clear button when filters are active', () => {
    const contextValue = createContextValue({
      searchValue: 'rick',
    });
    mockUseFilterContext.mockReturnValue(contextValue);

    render(<Filters totalCount={0} showingCount={0} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));

    expect(contextValue.clearAll).toHaveBeenCalled();
  });
});
