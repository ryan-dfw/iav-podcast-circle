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
export type InlineRun = string | { em: string } | { strong: string } | { link: string; href: string };
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
/* Quotes                                                              */
/* ------------------------------------------------------------------ */

/**
 * A short quote from Isha, published as a numbered series alongside the
 * articles. Each one is a small fixed template rather than free-form blocks:
 * the quote itself, an optional note on what's behind it, and an optional
 * prompt. Keeping it a template means she can later fill the same four fields
 * in a form without anyone writing markup.
 */
export interface Quote extends MaybeSample {
  /** Her own numbering ("No. 1"). */
  number: number;
  /** ISO date (YYYY-MM-DD). */
  publishedOn: string;
  /** Small line above the number, e.g. "A quote from Isha to start your day". */
  label?: string;
  /**
   * The quote's opening line, as separate beats set large on the card
   * ("Wait." / "Think." / "Move."). Trailing punctuation is rendered in the
   * accent colour. A single-element array is simply one line.
   */
  beats: string[];
  /** The softer line under the beats. */
  rest?: string;
  /** "The thought behind it" — a paragraph or two in her voice. */
  thought?: string[];
  /** "Try it today" — one concrete thing to do. */
  tryIt?: string;
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

/* ------------------------------------------------------------------ */
/* Articles                                                            */
/* ------------------------------------------------------------------ */

/**
 * Blocks an article body can contain. Reuses the episode blocks and adds a
 * pull quote set off by rules. Everything here is plain JSON-serialisable, so
 * a submission form / database (e.g. Firestore) can store an `Article` as-is.
 */
export interface ArticleTocItem {
  label: string;
  /** Marks the stage the reader is on now. */
  current?: boolean;
}

export type ArticleBlock =
  | EpisodeBlock
  | { type: 'pull'; text: string }
  | { type: 'figure'; image: ImageAsset; caption?: string }
  /** A short reflective question, set off from the body text. */
  | { type: 'ask'; text: string }
  /** A quoted remark from someone other than the author or episode guest. */
  | { type: 'mentor'; text: string; attribution?: string }
  /** A labelled outline of the piece's stages/sections, with the current one marked. */
  | { type: 'toc'; title: string; items: ArticleTocItem[] }
  /** Closing signature for a personal note — a short line plus the author's first name. */
  | { type: 'signature'; line: string; name: string };

export interface ArticleSection {
  /** Omit for the opening section, which has no heading. */
  heading?: string;
  blocks: ArticleBlock[];
}

export interface Article extends MaybeSample {
  /** URL segment: /articles/:slug */
  slug: string;
  /** Short kind of piece, e.g. "Essay". Used for filtering. */
  category: string;
  /** Optional topic shown after the category, e.g. "Reinvention". */
  topic?: string;
  /**
   * Presentation mode. `'essay'` (default) is the standard article template.
   * `'note'` is a shorter, more personal piece — e.g. a journal entry — framed
   * in its own card instead of the standard kicker/byline header.
   */
  format?: 'essay' | 'note';
  /** For `format: 'note'`, the small label shown above the title (e.g. "A Note from Isha's Desk"). */
  noteLabel?: string;
  title: string;
  /** Standfirst under the title; also used on cards and in metadata. */
  dek: string;
  author: string;
  /** ISO date (YYYY-MM-DD). */
  publishedOn: string;
  heroImage?: ImageAsset;
  /** Caption printed under the hero image. */
  heroCaption?: string;
  sections: ArticleSection[];
  /** Other places this piece also ran. Rendered after the article; `url` makes the name a link. */
  alsoPublishedOn?: Array<{ name: string; url?: string }>;
}
