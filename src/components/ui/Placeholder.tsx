import type { ReactNode } from 'react';
import styles from './Placeholder.module.css';

/** Clearly marked slot for content the client still needs to supply. */
export function Placeholder({ label = 'To come from Isha', children }: { label?: string; children: ReactNode }) {
  return (
    <div className={styles.slot}>
      <span className={styles.label}>{label}</span>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
