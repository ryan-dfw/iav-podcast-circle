import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

type Variant = 'primary' | 'blush' | 'mauve' | 'periwinkle' | 'ghost' | 'light';

interface Props {
  to: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

const isExternal = (to: string) => /^(https?:|mailto:|tel:)/.test(to);

/** Link styled as a button. Internal paths use the router; others are plain anchors. */
export function ButtonLink({ to, children, variant = 'primary', className }: Props) {
  const cls = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  if (isExternal(to)) {
    const newTab = to.startsWith('http');
    return (
      <a className={cls} href={to} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
        {newTab && <span className="visually-hidden"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link className={cls} to={to}>
      {children}
    </Link>
  );
}

export const buttonClass = (variant: Variant = 'primary') => `${styles.button} ${styles[variant]}`;
