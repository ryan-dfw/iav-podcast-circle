import type { Article } from '../types';
import { iBidOnMyself } from './i-bid-on-myself';
import { sampleArticles } from './samples';

/**
 * Article registry. To publish an article:
 *   1. copy `i-bid-on-myself.ts` to a new file and replace its content;
 *   2. add it to this array (order doesn't matter — the site sorts by date).
 * The Articles page, article pages, routing and the navbar link pick it up
 * automatically. Later, a submission form + database can fill the same
 * `Article` shape; only `getArticles()` in `content/index.ts` needs to change.
 */
export const articles: Article[] = [iBidOnMyself, ...sampleArticles];
