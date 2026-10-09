import type { CSSProperties } from 'react';
import styles from './Starfield.module.css';

/** Deterministic PRNG so the sky is identical on every render. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  delay: number;
}

function makeStars(count: number, seed: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const r = rand();
    return {
      x: rand() * 100,
      y: rand() * 100,
      size: r > 0.93 ? 2.5 : r > 0.7 ? 1.8 : 1.1,
      opacity: 0.35 + rand() * 0.6,
      twinkle: rand() > 0.72,
      delay: rand() * 6,
    };
  });
}

/** Four-point "sparkle" stars, as in the client's mockup. Positions in %. */
const SPARKLES = [
  { x: 3, y: 34, size: 14 },
  { x: 91, y: 33, size: 11 },
  { x: 24, y: 18, size: 8 },
  { x: 76, y: 74, size: 9 },
  { x: 58, y: 9, size: 7 },
  { x: 12, y: 80, size: 7 },
];

const STARS = makeStars(110, 20261006);

/** Decorative night sky for dark hero bands. */
export function Starfield() {
  return (
    <div className={styles.sky} aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className={`${styles.star} ${s.twinkle ? styles.twinkle : ''}`}
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              '--o': s.opacity,
              animationDelay: `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
      {SPARKLES.map((s, i) => (
        <svg
          key={`sp${i}`}
          className={styles.sparkle}
          viewBox="0 0 20 20"
          width={s.size * 2}
          height={s.size * 2}
          style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${i * 1.3}s` }}
        >
          <path d="M10 0 C10.9 7 13 9.1 20 10 C13 10.9 10.9 13 10 20 C9.1 13 7 10.9 0 10 C7 9.1 9.1 7 10 0Z" />
        </svg>
      ))}
    </div>
  );
}
