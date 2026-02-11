import { useParams } from 'react-router';
import { Container } from '../../components/layout';
import { Loader, StatusBadge } from '../../components/common';
import { useCharacter } from '../../hooks';
import styles from './CharacterDetail.module.css';

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>();
  const { character, episodes, loading, error } = useCharacter(Number(id));

  if (loading) {
    return (
      <Container size="medium">
        <Loader size="large" />
      </Container>
    );
  }

  if (error || !character) {
    return (
      <Container size="medium">
        <div className={styles.error}>
          <span className={styles.errorIcon}>😵</span>
          <h2>Character Not Found</h2>
          <p>{error || 'The character you are looking for does not exist.'}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container size="medium">
      <div className={styles.detail}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <img
            src={character.image}
            alt={character.name}
            className={styles.image}
          />
        </div>

        {/* Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <h1 className={styles.name}>{character.name}</h1>
            <StatusBadge status={character.status} />
          </div>

          {/* Basic Info */}
          <div className={styles.infoGrid}>
            <InfoItem label="Species" value={character.species} />
            <InfoItem label="Gender" value={character.gender} />
            <InfoItem label="Type" value={character.type || 'Unknown'} />
            <InfoItem label="Origin" value={character.origin.name} />
            <InfoItem label="Location" value={character.location.name} />
            <InfoItem
              label="Episodes"
              value={`${character.episode.length} episode${character.episode.length !== 1 ? 's' : ''}`}
            />
          </div>

          {/* Episodes List */}
          <div className={styles.episodesSection}>
            <h2 className={styles.sectionTitle}>Episode Appearances</h2>
            {episodes.length > 0 ? (
              <div className={styles.episodesList}>
                {episodes.map((episode) => (
                  <div key={episode.id} className={styles.episodeItem}>
                    <span className={styles.episodeCode}>
                      {episode.episode}
                    </span>
                    <span className={styles.episodeName}>{episode.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noEpisodes}>Loading episodes...</p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

// Helper component for info items
interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}
