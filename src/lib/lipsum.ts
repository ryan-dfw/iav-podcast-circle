import { intBetween, mulberry32, pick, type Random } from './random';

/**
 * Lorem ipsum generator.
 *
 * Placeholder copy is generated rather than written, on purpose. Anything
 * hand-written to fill a gap — even obviously provisional prose — reads as a
 * suggestion about what the client should say, and has a habit of surviving
 * into the finished site. Latin filler can't be mistaken for her voice, and it
 * still shows how a block of that length sits in the layout.
 */

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim',
  'id', 'est', 'laborum', 'at', 'vero', 'eos', 'accusamus', 'iusto', 'odio', 'dignissimos',
  'ducimus', 'blanditiis', 'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'quas', 'molestias',
] as const;

/** Short words only — for places where a long Latin word would break the layout. */
const SHORT_WORDS = WORDS.filter((word) => word.length <= 6);

export const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export function lipsumWords(rand: Random, count: number, shortOnly = false): string[] {
  const source = shortOnly ? SHORT_WORDS : WORDS;
  return Array.from({ length: count }, () => pick(rand, source));
}

/** One sentence, capitalised, with a full stop. */
export function lipsumSentence(rand: Random, minWords = 6, maxWords = 14): string {
  const words = lipsumWords(rand, intBetween(rand, minWords, maxWords));
  return `${capitalize(words.join(' '))}.`;
}

export function lipsumParagraph(rand: Random, minSentences = 2, maxSentences = 4): string {
  return Array.from({ length: intBetween(rand, minSentences, maxSentences) }, () => lipsumSentence(rand)).join(' ');
}

/** A generator seeded from `seed`, so the same slot always gets the same filler. */
export const lipsumFor = (seed: number): Random => mulberry32(seed * 0x9e3779b1);
