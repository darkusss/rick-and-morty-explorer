import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: 'Alive' | 'Dead' | 'unknown';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusClass = status.toLowerCase() as 'alive' | 'dead' | 'unknown';

  return (
    <span className={`${styles.badge} ${styles[statusClass]}`}>
      <span className={styles.dot}></span>
      {status}
    </span>
  );
}
