import type { Quote } from '../types';
import { quote01 } from './quote-01';

/**
 * Quote registry. To publish a quote:
 *   1. copy `quote-01.ts` to the next number and replace its content;
 *   2. add it to this array (order doesn't matter — the site sorts by number).
 * The Articles page band, the quotes index and the per-quote pages pick it up
 * automatically. Later, an authoring form can write the same `Quote` shape;
 * only `getQuotes()` in `content/index.ts` needs to change.
 */
export const quotes: Quote[] = [quote01];
