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
import { sampleGuests } from './guests';
import { events, memberBenefits, monthlyThemes } from './circle';
import type { CircleEvent, Episode, GuestCapsule, ResourceCategory } from './types';

export * from './pages';
export { circleIntro } from './circle';
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

/** Home page guest capsules: guests of featured episodes, then any placeholders. */
export function getFeaturedGuests(): GuestCapsule[] {
  const real = getFeaturedEpisodes().flatMap((e) =>
    e.guests.map((g) => ({
      name: g.name,
      portrait: g.portrait,
      episode: { slug: e.slug, number: e.number, title: e.title },
    })),
  );
  return [...real, ...sampleGuests];
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
