import { Container } from '../../components/layout';
import { CharacterGrid, Filters } from '../../components/character';
import { Button, Loader } from '../../components/common';
import { useCharacters } from '../../hooks';
import { useFilterContext } from '../../context';
import styles from './Home.module.css';

export default function Home() {
  const { filters, sortOrder } = useFilterContext();

  const { characters, loading, error, hasMore, totalCount, loadMore } =
    useCharacters(filters, sortOrder);

  return (
    <Container>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Characters</h1>
        <p className={styles.subtitle}>
          Explore all characters from the Rick and Morty universe
        </p>
      </div>

      {/* Filters */}
      <Filters totalCount={totalCount} showingCount={characters.length} />

      {/* Error State */}
      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}></span>
          <p>{error}</p>
        </div>
      )}

      {/* Character Grid */}
      <CharacterGrid characters={characters} />

      {/* Loading State */}
      {loading && <Loader />}

      {/* Load More Button */}
      {hasMore && !loading && characters.length > 0 && (
        <div className={styles.loadMore}>
          <Button variant="primary" size="large" onClick={loadMore}>
            Load More Characters
          </Button>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && characters.length > 0 && (
        <p className={styles.endMessage}>You've reached the end!</p>
      )}
    </Container>
  );
}
