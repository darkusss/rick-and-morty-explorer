import styles from './Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export function Container({ children, size = 'large' }: ContainerProps) {
  return (
    <div className={`${styles.container} ${styles[size]}`}>{children}</div>
  );
}
