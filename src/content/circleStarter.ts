/**
 * "The Circle Starter — 7 Days to Find Your Gift and Your People" — the free
 * opt-in kit promised on the home page hero.
 *
 * The journal's prose is NOT here. It's served by `/api/kit-content` to
 * requests carrying a valid token, so it never reaches the JS bundle — see
 * `netlify/functions/_lib/content.ts`. What stays in this file is only what's
 * public by design: the copy on the gate itself, which anyone may read.
 */
import type { CircleStarterContent, CircleStarterPageData } from './circleStarterTypes';

export type { CircleStarterContent, CircleStarterDay, CircleStarterPageData, KitIntent } from './circleStarterTypes';

/** Shown to anyone without a valid link — public on purpose. */
export const circleStarterGate = {
  eyebrow: 'A 7-Day Guided Journal',
  title: 'The Circle Starter',
  subtitle: 'Seven days, a few honest questions, and the gift that was there all along.',
  lead: 'The journal is sent by email. Tell us where to send it and a link comes straight back — read it here a day at a time, or print the PDF and write on paper.',
  cta: 'Send me the journal',
  sending: 'Sending…',
  sent: 'Check your inbox — the link is on its way. It may take a minute, and it sometimes lands in spam.',
  invalidEmail: 'That doesn’t look like an email address.',
  failed: 'Something went wrong sending that. Please try again in a moment.',
  expired: 'This link isn’t valid any more. Enter your email and we’ll send a fresh one.',
  loading: 'Opening your journal…',
};

/** Where the signed PDF download lives, for a given access token. */
export const circleStarterPdfUrl = (token: string) => `/api/kit-pdf?t=${encodeURIComponent(token)}`;

/**
 * The journal as a flip-through sequence — one route per page, matching the
 * 10-page print layout (Cover, Welcome, Day 1–7, Closing). Built from fetched
 * content rather than imported content, since the prose arrives at runtime.
 */
export function buildCircleStarterPages(content: CircleStarterContent): CircleStarterPageData[] {
  return [
    { kind: 'cover' },
    { kind: 'welcome' },
    ...content.days.map((day) => ({ kind: 'day' as const, day })),
    { kind: 'closing' },
  ];
}
