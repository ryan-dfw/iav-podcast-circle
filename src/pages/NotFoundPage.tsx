import { usePageMeta } from '@/hooks/usePageMeta';
import { ButtonLink } from '@/components/ui/Button';
import styles from './pages.module.css';

export function NotFoundPage() {
  usePageMeta({ title: 'Page not found' });
  return (
    <div className={`container ${styles.notFound}`}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontSize: 'var(--step-4)', fontWeight: 400 }}>This page wandered off.</h1>
      <p>The page you’re looking for isn’t here, but every story starts somewhere.</p>
      <ButtonLink to="/">Return home</ButtonLink>
    </div>
  );
}
