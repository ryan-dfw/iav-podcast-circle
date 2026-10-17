/**
 * Content access layer — the ONLY way pages and components read mutable content.
 *
 * Today every accessor returns local, typed data from this folder. If the
 * client later wants to edit content through a CMS, swap the implementations
 * here (and make them async / wrap with a loader) — the content types in
 * `./types.ts` stay the contract, and presentation components don't change.
 */
import { episodes } from './episodes';
import { resourceCategories } from './resources';
import { events, memberBenefits, monthlyThemes } from './circle';
import { articles } from './articles';
import type { Article, CircleEvent, Episode, ResourceCategory } from './types';

export * from './pages';
export { circleIntro, nominateCopy } from './circle';
export { primaryNav } from './navigation';
export type * from './types';

/* Episodes ---------------------------------------------------------- */

/** All episodes, newest (highest number) first. */
export function getEpisodes(): Episode[] {
  return [...episodes].sort((a, b) => b.number - a.number);
}

export function getEpisode(slug: string): Episode | undefined {
  return episodes.find((e) => e.slug === slug);
}

export function getLatestEpisode(): Episode | undefined {
  return getEpisodes()[0];
}

export function getFeaturedEpisodes(): Episode[] {
  return getEpisodes().filter((e) => e.featured);
}

/** Legacy URL → current path, e.g. "/episode01" → "/podcast/episode-01". */
export function getLegacyRedirects(): Array<{ from: string; to: string }> {
  return episodes.flatMap((e) =>
    (e.legacyPaths ?? []).map((from) => ({ from, to: episodePath(e) })),
  );
}

export const episodePath = (e: Pick<Episode, 'slug'>) => `/podcast/${e.slug}`;

/* Resources --------------------------------------------------------- */

export function getResourceCategories(): ResourceCategory[] {
  return resourceCategories;
}

/* Circle ------------------------------------------------------------ */

export const getMonthlyThemes = () => monthlyThemes;
export const getMemberBenefits = () => memberBenefits;

/** Events that haven't started yet, soonest first. */
export function getUpcomingEvents(now: Date = new Date()): CircleEvent[] {
  return events
    .filter((e) => new Date(e.startsAt) >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/* Articles ---------------------------------------------------------- */

/** All articles, newest first. */
export function getArticles(): Article[] {
  return [...articles].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export const articlePath = (a: Pick<Article, 'slug'>) => `/articles/${a.slug}`;

/** Rough reading time from the body text, in whole minutes (minimum 1). */
export function readingMinutes(article: Article): number {
  const flat = (t: string | Array<string | { em: string } | { strong: string }>) =>
    typeof t === 'string' ? t : t.map((r) => (typeof r === 'string' ? r : 'em' in r ? r.em : r.strong)).join('');
  const words = article.sections
    .flatMap((s) => s.blocks.map((b) => flat('text' in b ? b.text : '')))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
