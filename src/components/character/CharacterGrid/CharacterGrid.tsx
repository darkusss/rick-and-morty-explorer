import type { Character } from '../../../types/character';
import { CharacterCard } from '../CharacterCard/CharacterCard';
import styles from './CharacterGrid.module.css';

interface CharacterGridProps {
  characters: Character[];
}

export function CharacterGrid({ characters }: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🔍</span>
        <p className={styles.emptyText}>No characters found</p>
        <p className={styles.emptySubtext}>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
