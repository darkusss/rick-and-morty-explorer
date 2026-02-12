import { useFilterContext } from '../../../context/FilterContext';
import { Input, Select, Button } from '../../common';
import type { CharacterFilters } from '../../../types/character';
import styles from './Filters.module.css';

interface FiltersProps {
  totalCount: number;
  showingCount: number;
}

const STATUS_OPTIONS = [
  { value: 'alive', label: 'Alive' },
  { value: 'dead', label: 'Dead' },
  { value: 'unknown', label: 'Unknown' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'genderless', label: 'Genderless' },
  { value: 'unknown', label: 'Unknown' },
];

const SPECIES_OPTIONS = [
  { value: 'human', label: 'Human' },
  { value: 'alien', label: 'Alien' },
  { value: 'humanoid', label: 'Humanoid' },
  { value: 'robot', label: 'Robot' },
  { value: 'animal', label: 'Animal' },
  { value: 'mythological creature', label: 'Mythological' },
  { value: 'poopybutthole', label: 'Poopybutthole' },
  { value: 'cronenberg', label: 'Cronenberg' },
];

export function Filters({ totalCount, showingCount }: FiltersProps) {
  const {
    searchValue,
    setSearchValue,
    filters,
    setFilters,
    sortOrder,
    setSortOrder,
    clearAll,
  } = useFilterContext();

  const handleFilterChange = (key: keyof CharacterFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    searchValue ||
    filters.status ||
    filters.species ||
    filters.gender ||
    sortOrder;

  return (
    <div className={styles.container}>
      {/* Search */}
      <div className={styles.searchRow}>
        <div className={styles.searchInput}>
          <Input
            placeholder="Search characters by name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className={styles.filtersRow}>
        <Select
          placeholder="Status"
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          options={STATUS_OPTIONS}
        />

        <Select
          placeholder="Species"
          value={filters.species || ''}
          onChange={(e) => handleFilterChange('species', e.target.value)}
          options={SPECIES_OPTIONS}
        />

        <Select
          placeholder="Gender"
          value={filters.gender || ''}
          onChange={(e) => handleFilterChange('gender', e.target.value)}
          options={GENDER_OPTIONS}
        />

        {/* Sort Buttons */}
        <div className={styles.sortButtons}>
          <Button
            variant={sortOrder === 'asc' ? 'primary' : 'outline'}
            size="medium"
            onClick={() => setSortOrder(sortOrder === 'asc' ? null : 'asc')}
          >
            A-Z
          </Button>
          <Button
            variant={sortOrder === 'desc' ? 'primary' : 'outline'}
            size="medium"
            onClick={() => setSortOrder(sortOrder === 'desc' ? null : 'desc')}
          >
            Z-A
          </Button>
        </div>
      </div>

      {/* Results Info & Clear */}
      <div className={styles.resultsRow}>
        <span className={styles.resultsCount}>
          Showing {showingCount} of {totalCount} characters
        </span>

        {hasActiveFilters && (
          <Button variant="secondary" size="small" onClick={clearAll}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
