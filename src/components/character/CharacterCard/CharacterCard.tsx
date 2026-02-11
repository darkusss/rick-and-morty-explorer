import { Link } from 'react-router';
import type { Character } from '../../../types/character';
import { StatusBadge } from '../../common';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link to={`/character/${character.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={character.image}
          alt={character.name}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.name}>{character.name}</h2>

        <div className={styles.info}>
          <StatusBadge status={character.status} />
          <span className={styles.species}>{character.species}</span>
        </div>

        <div className={styles.location}>
          <span className={styles.locationLabel}>Last known location:</span>
          <span className={styles.locationValue}>
            {character.location.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
