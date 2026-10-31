/**
 * Shape of the Circle Starter journal content.
 *
 * TYPES ONLY — no values. The prose itself lives server-side in
 * `netlify/functions/_lib/content.ts` so it never reaches the JS bundle; this
 * file is imported by both sides (the functions import it with a relative
 * path) purely so the shape has one definition. Adding a runtime value here
 * would be a mistake: it would ship to every visitor.
 */

/**
 * Why someone handed over their email. Carried inside the signed token, so
 * what Isha is told about a signup can't be faked by the page that sent it.
 */
export type KitIntent = 'kit' | 'book';

export interface CircleStarterDay {
  number: number;
  theme: string;
  lead: string;
  questions: string[];
  prompt: string;
}

export interface CircleStarterContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  byline: string;
  welcome: {
    greeting: string;
    paragraphs: string[];
  };
  howToUse: {
    title: string;
    items: string[];
    outro: string;
    signoff: string;
  };
  days: CircleStarterDay[];
  closing: {
    title: string;
    paragraphs: string[];
    circlePitch: {
      intro: string;
      bullets: string[];
    };
    keepGoing: {
      title: string;
      listenTitle: string;
      listenNote: string;
      shareTitle: string;
      shareNote: string;
    };
    signoff: string;
    disclaimer: string;
  };
}

/** One page of the journal, in the order they're meant to be read. */
export type CircleStarterPageData =
  | { kind: 'cover' }
  | { kind: 'welcome' }
  | { kind: 'day'; day: CircleStarterDay }
  | { kind: 'closing' };
