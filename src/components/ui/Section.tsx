import type { ReactNode } from 'react';
import styles from './Section.module.css';

type Tone = 'plain' | 'surface' | 'blush' | 'lavender' | 'mist' | 'navy';

interface SectionProps {
  children: ReactNode;
  tone?: Tone;
  /** Accessible name source: id of the section's heading. */
  labelledBy?: string;
  className?: string;
  tight?: boolean;
}

/** A full-width band with editorial vertical spacing and an optional soft color block. */
export function Section({ children, tone = 'plain', labelledBy, className, tight }: SectionProps) {
  const cls = [styles.section, styles[tone], tight && styles.tight, className].filter(Boolean).join(' ');
  return (
    <section className={cls} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}

interface HeadingProps {
  id: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  align?: 'center' | 'start';
  as?: 'h1' | 'h2';
}

export function SectionHeading({ id, title, eyebrow, subtitle, align = 'center', as: Tag = 'h2' }: HeadingProps) {
  return (
    <header className={`${styles.heading} ${align === 'center' ? styles.center : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag id={id} className={Tag === 'h1' ? styles.h1 : styles.h2}>
        {title}
      </Tag>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}

/** Small tag that marks placeholder content. */
export function SampleBadge() {
  return (
    <span className={styles.sample} title="Placeholder content">
      Sample
    </span>
  );
}
