import { Link } from 'react-router';
import { Container } from '../../components/layout';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <Container size="small">
      <div className={styles.wrapper}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>
          The page you are looking for does not exist.
        </p>
        <Link to="/" className={styles.homeLink}>
          Back to Characters
        </Link>
      </div>
    </Container>
  );
}
