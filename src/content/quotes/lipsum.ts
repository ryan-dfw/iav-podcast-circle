import type { Quote } from '../types';
import { capitalize, lipsumFor, lipsumParagraph, lipsumSentence, lipsumWords } from '@/lib/lipsum';
import { intBetween } from '@/lib/random';

/**
 * Placeholder quotes, generated to fill the series until enough real ones
 * exist. They carry `sample: true`, so every surface that renders them can say
 * plainly that they aren't Isha's words.
 *
 * Generating these also exercises the states a real quote can be in: a short
 * one-beat line, a three-beat line, a long back face, a missing follow-up.
 */
export function lipsumQuote(number: number): Quote {
  const rand = lipsumFor(number);

  // Mirror the shape of her real quote: a few staccato beats, or one line.
  const beatCount = intBetween(rand, 1, 3);
  const beats = lipsumWords(rand, beatCount, true).map((word) => `${capitalize(word)}.`);

  return {
    number,
    publishedOn: new Date(Date.UTC(2026, 0, 1 + number)).toISOString().slice(0, 10),
    // Generated too: reusing her real series label here would have a card
    // reading "a quote from Isha" directly above "not Isha's words".
    label: capitalize(lipsumWords(rand, intBetween(rand, 4, 6), true).join(' ')),
    beats,
    rest: lipsumSentence(rand, 5, 10),
    thought: Array.from({ length: intBetween(rand, 1, 2) }, () => lipsumParagraph(rand, 1, 3)),
    tryIt: lipsumSentence(rand, 8, 16),
    sample: true,
  };
}

/**
 * Tops the real quotes up to `wanted`, so the section can be judged at the size
 * it will actually run at. Placeholders stand for quotes not yet written, so
 * they follow the real ones and continue the numbering rather than displacing
 * Isha's work from the lead position.
 */
export function padWithLipsum(real: Quote[], wanted: number): Quote[] {
  if (real.length >= wanted) return real;
  const highest = real.reduce((max, quote) => Math.max(max, quote.number), 0);
  const fillers = Array.from({ length: wanted - real.length }, (_, i) => lipsumQuote(highest + i + 1));
  return [...real, ...fillers];
}
