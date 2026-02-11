import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

export function Loader({ size = 'medium' }: LoaderProps) {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
    </div>
  );
}
