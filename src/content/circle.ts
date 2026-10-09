import type { Benefit, CircleEvent, MonthlyTheme } from './types';

/**
 * IAV Circle content.
 *
 * The handoff establishes the Circle as a paid membership for personal
 * development events with monthly themes, an event calendar and member
 * benefits. It does NOT establish prices, what membership includes, or how
 * joining works — so this page presents the idea without inventing the
 * product. Everything marked `sample` is placeholder.
 */

export const circleIntro = {
  eyebrow: 'The IAV Circle',
  title: 'A circle for growing, together.',
  lead: 'The IAV Circle is a membership for personal development events — an intimate space to keep amplifying the gifts our conversations bring to light.',
};

export const monthlyThemes: MonthlyTheme[] = [
  { sample: true, month: 'Month one', title: 'Sample theme', description: 'Placeholder — monthly themes to be supplied by the client.' },
  { sample: true, month: 'Month two', title: 'Sample theme', description: 'Placeholder theme description.' },
  { sample: true, month: 'Month three', title: 'Sample theme', description: 'Placeholder theme description.' },
];

export const memberBenefits: Benefit[] = [
  { sample: true, title: 'Sample benefit', description: 'Placeholder — the client has not yet defined member benefits.' },
  { sample: true, title: 'Sample benefit', description: 'Placeholder benefit description.' },
  { sample: true, title: 'Sample benefit', description: 'Placeholder benefit description.' },
];

export const events: CircleEvent[] = [
  {
    sample: true,
    id: 'sample-gathering',
    title: 'Sample Circle gathering',
    startsAt: '2026-11-12T19:00',
    format: 'online',
    description: 'Placeholder event used to preview the calendar layout.',
  },
  {
    sample: true,
    id: 'sample-workshop',
    title: 'Sample workshop',
    startsAt: '2026-12-03T18:30',
    format: 'in-person',
    location: 'Venue to be announced',
    description: 'Placeholder event used to preview the calendar layout.',
  },
];
