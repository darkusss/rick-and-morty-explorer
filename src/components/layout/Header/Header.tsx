import { Link, useLocation, useNavigate } from 'react-router';
import styles from './Header.module.css';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleBack = (e: React.MouseEvent) => {
    if (location.state?.fromList) {
      e.preventDefault();
      navigate(-1);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" onClick={handleBack} className={styles.logo}>
          <span className={styles.logoIcon}>🛸</span>
          <span className={styles.logoText}>Rick & Morty</span>
        </Link>
        {!isHome && (
          <Link to="/" onClick={handleBack} className={styles.backLink}>
            ← Back to Characters
          </Link>
        )}
      </div>
    </header>
  );
}
