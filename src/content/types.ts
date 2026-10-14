/**
 * Content model for the IAV Podcast Circle site.
 *
 * Everything the client is likely to change (episodes, guests, resources,
 * events, Circle themes, page copy) is described by these types and lives as
 * plain local data under `src/content/`. Pages read it only through the
 * accessors in `src/content/index.ts`, so a CMS (or any other source) can
 * replace the local files later without touching presentation components.
 */

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

/**
 * Inline rich text. A plain string, or a list of runs so editorial copy can
 * carry emphasis (e.g. a book title in italics) without embedding HTML.
 */
export type InlineRun = string | { em: string } | { strong: string };
export type RichText = string | InlineRun[];

export interface ImageAsset {
  /** Full-size image. */
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Optional smaller rendition of the same image (same aspect ratio), for srcset. */
  thumb?: { src: string; width: number };
}

/**
 * Marks content that is NOT real client information. Sample entries exist only
 * so the interface can be built and evaluated, and are labelled as samples
 * wherever they render. Replace or delete them as real content arrives.
 */
export interface MaybeSample {
  sample?: boolean;
}

/* ------------------------------------------------------------------ */
/* Episodes                                                            */
/* ------------------------------------------------------------------ */

export interface Person {
  name: string;
  /** Short descriptor shown under the name, e.g. "Author". Only real facts. */
  descriptor?: string;
  portrait?: ImageAsset;
}

export interface YouTubeVideo {
  videoId: string;
  // Title and channel are fetched live from YouTube (src/services/youtube.ts).
}

/** Visual tone of a pull quote — maps to the brand's soft color blocks. */
export type QuoteTone = 'cream' | 'blush' | 'lavender' | 'mist';

export type EpisodeBlock =
  | { type: 'paragraph'; text: RichText }
  | { type: 'quote'; text: string; attribution?: string; tone?: QuoteTone }
  | { type: 'note'; label: string; text: RichText };

export interface EpisodeSection {
  heading: string;
  blocks: EpisodeBlock[];
}

export interface Episode {
  /** URL segment: /podcast/:slug */
  slug: string;
  number: number;
  /** Show / series name as printed on the episode page. */
  series: string;
  /** Short display title, e.g. "Navigating Narcissism". */
  title: string;
  /** Line under the title in the hero, e.g. "Insights from Paola’s Journey". */
  kicker: string;
  /** Article headline for the editorial body. */
  headline: string;
  /** Standfirst under the headline. */
  dek: string;
  /** One- or two-sentence summary used on cards and in metadata. */
  summary: string;
  host: string;
  guests: Person[];
  /** ISO date. Leave undefined when unknown rather than guessing. */
  publishedOn?: string;
  video?: YouTubeVideo;
  heroImage?: ImageAsset;
  sections: EpisodeSection[];
  listen: {
    heading: string;
    /** Text before and after the linked episode title. */
    before: RichText;
    after: RichText;
  };
  /** Old URLs (e.g. the Canva-hosted page) that should redirect here. */
  legacyPaths?: string[];
  /** Show this episode's guest in the home page "Guest Capsules". */
  featured?: boolean;
}

/* ------------------------------------------------------------------ */
/* Guest capsules (home page)                                          */
/* ------------------------------------------------------------------ */

/**
 * A guest shown in the home page "Featured Guests" row. Real capsules are
 * derived from featured episodes; standalone entries here are placeholders.
 */
export interface GuestCapsule extends MaybeSample {
  name: string;
  portrait?: ImageAsset;
  /**
   * The episode this guest appeared in. `slug` links to the episode page;
   * placeholder episodes have no slug (and no page).
   */
  episode?: Pick<Episode, 'number' | 'title'> & { slug?: string };
}

/* ------------------------------------------------------------------ */
/* Resources                                                           */
/* ------------------------------------------------------------------ */

export interface Resource extends MaybeSample {
  name: string;
  description: string;
  url?: string;
  location?: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  intro: string;
  items: Resource[];
}

/* ------------------------------------------------------------------ */
/* IAV Circle & events                                                 */
/* ------------------------------------------------------------------ */

export interface CircleEvent extends MaybeSample {
  id: string;
  title: string;
  /** ISO date-time (local wall time is fine: "2026-11-12T19:00"). */
  startsAt: string;
  format: 'in-person' | 'online' | 'hybrid';
  location?: string;
  description: string;
  /** Where to RSVP / learn more, once a real destination exists. */
  url?: string;
}

export interface MonthlyTheme extends MaybeSample {
  month: string;
  title: string;
  description: string;
}

export interface Benefit extends MaybeSample {
  title: string;
  description: string;
}
