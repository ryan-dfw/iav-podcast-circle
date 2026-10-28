/**
 * Deterministic pseudo-random numbers.
 *
 * Placeholder content and generated artwork both need to be stable: the same
 * seed must give the same result on every render and every build, or filler
 * text reshuffles on each keystroke in dev and stars drift between the page
 * and the exported image.
 */

/** Mulberry32 — small, fast, good enough for layout and decoration. */
export function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Random = () => number;

/** Integer in [min, max]. */
export const intBetween = (rand: Random, min: number, max: number) => min + Math.floor(rand() * (max - min + 1));

/** A random member of `items`. */
export const pick = <T>(rand: Random, items: readonly T[]): T => items[Math.floor(rand() * items.length)];
