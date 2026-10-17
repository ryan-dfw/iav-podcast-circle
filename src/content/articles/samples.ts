import type { Article } from '../types';

/**
 * Placeholder entries so the listing's grid, filters and "load more" can be
 * judged with more than one article. Delete this file (and its use in
 * `index.ts`) once real articles exist.
 */
const filler = [
  { type: 'paragraph', text: 'Placeholder article text. Real pieces are written by Isha and published here as they are submitted.' },
  { type: 'paragraph', text: 'This entry exists only to preview how the Articles page looks with several entries.' },
] as const;

export const sampleArticles: Article[] = [
  {
    sample: true,
    slug: 'sample-what-the-quiet-ones-know',
    category: 'Reflection',
    topic: 'Listening',
    title: 'What the quiet ones know',
    dek: 'Placeholder dek: a short standfirst that sets up the piece in a sentence or two.',
    author: 'Isha Vazquez',
    publishedOn: '2026-09-29',
    sections: [{ blocks: [...filler] }],
  },
  {
    sample: true,
    slug: 'sample-notes-from-the-circle',
    category: 'Circle notes',
    title: 'Notes from the circle',
    dek: 'Placeholder dek: a recap of a Circle gathering and the idea that came out of it.',
    author: 'Isha Vazquez',
    publishedOn: '2026-09-15',
    sections: [{ blocks: [...filler] }],
  },
  {
    sample: true,
    slug: 'sample-a-gift-in-hard-seasons',
    category: 'Essay',
    topic: 'Gifts',
    title: 'A gift in hard seasons',
    dek: 'Placeholder dek: why the talents we lean on most are often born in our hardest chapters.',
    author: 'Isha Vazquez',
    publishedOn: '2026-08-30',
    sections: [{ blocks: [...filler] }],
  },
];
