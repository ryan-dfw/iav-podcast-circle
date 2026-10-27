import { useMemo, type CSSProperties } from 'react';
import { quoteStars } from '@/lib/quoteImageCore';
import styles from './QuoteStars.module.css';

/**
 * The sky behind a quote, from the same seeded generator the exported image
 * uses — so the card on the page and the card someone posts to Instagram have
 * the same stars in the same places.
 */
export function QuoteStars({ seed }: { seed: number }) {
  const stars = useMemo(() => quoteStars(seed), [seed]);

  return (
    <div className={styles.sky} aria-hidden="true">
      {stars.map((star, i) =>
        star.sparkle ? (
          <svg
            key={i}
            className={styles.sparkle}
            viewBox="0 0 20 20"
            width={star.size}
            height={star.size}
            style={{ left: `${star.x}%`, top: `${star.y}%`, '--o': star.opacity, animationDelay: `${star.delay}s` } as CSSProperties}
          >
            <path d="M10 0 C10.9 7 13 9.1 20 10 C13 10.9 10.9 13 10 20 C9.1 13 7 10.9 0 10 C7 9.1 9.1 7 10 0Z" />
          </svg>
        ) : (
          <span
            key={i}
            className={styles.star}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              '--o': star.opacity,
              animationDelay: `${star.delay}s`,
            } as CSSProperties}
          />
        ),
      )}
    </div>
  );
}
