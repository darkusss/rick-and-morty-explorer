import { Link, useLocation } from 'react-router';
import styles from './Header.module.css';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🛸</span>
          <span className={styles.logoText}>Rick & Morty</span>
        </Link>

        {!isHome && (
          <Link to="/" className={styles.backLink}>
            ← Back to Characters
          </Link>
        )}
      </div>
    </header>
  );
}
