/**
 * Page copy.
 *
 * Sources: the client's handoff email (brand purpose, section list, hero copy),
 * her mockup (headings and microcopy), and her email signature (host facts).
 * Lines marked DRAFT are assembled from those sources and should be confirmed
 * or rewritten in the client's own voice.
 */

export const homeCopy = {
  hero: {
    // From the handoff: "IAV Podcast Circle — Talent Amplified / Where raw stories become legacy."
    title: 'Talent Amplified',
    subtitle: 'Where raw stories become legacy.',
    primaryCta: 'Listen to the Podcast',
    secondaryCta: 'Join the Circle',
  },
  guests: {
    // From the mockup.
    title: 'Featured Guests',
    subtitle: 'Capturing raw talent before the world meets them.',
    cta: 'Listen to Episode',
  },
};

/**
 * About page — first person throughout, built only from facts the client has
 * supplied. Everything she still needs to provide is a visible placeholder.
 */
export const aboutCopy = {
  // DRAFT — her signature facts rewritten in first person; no new claims.
  intro:
    'I’m a podcast host, nutrition coach, and talent amplifier, certified in neuropsychology. On my show I sit down with talented people and let them be heard as they are — before the world meets them.',
  roles: ['Talent amplifier', 'Podcast host', 'Nutrition coach'],
  credentials: [
    // TODO(client): spell out CNC and CNP as she wants them written.
    { short: 'CNC', full: undefined as string | undefined },
    { short: 'CNP', full: undefined as string | undefined },
    { short: 'Neuropsychology', full: 'Certified in neuropsychology' },
  ],
  why: {
    title: 'Why I amplify talent',
    // Her own signature line.
    statement:
      'Discovering talented humans and preserving their gifts in a living time capsule, one conversation at a time.',
    // From the mockup — the platform mission, reduced to one line.
    mission: 'Guiding creators from discovery to development.',
    storyPlaceholder:
      'Isha’s story, in her words: how nutrition coaching, neuropsychology and podcasting led her to amplifying talent. Three to five sentences.',
  },
  work: {
    title: 'Conversations so far',
  },
  next: {
    title: 'Where to next',
  },
};

export const podcastCopy = {
  eyebrow: 'The Podcast',
  title: 'Conversations that become capsules',
  lead: 'Intimate interviews with talented people, captured in their raw, human state — before the world meets them.',
  guest: {
    title: 'Be a Guest',
    body: 'Have a story or a gift the world should meet? We’d love to hear from you.',
    cta: 'Be a Guest',
  },
};

export const newsletterCopy = {
  eyebrow: 'Newsletter',
  title: 'Join Our Newsletter',
  // From the mockup.
  subtitle: 'Get exclusive insights & event updates',
  // DRAFT — derived from the handoff and from the existing episode write-up format.
  receives: [
    { title: 'Episode insights', body: 'Editorial companions to each conversation, like the write-up for Episode 1.' },
    { title: 'Event updates', body: 'Word on IAV Circle gatherings as they’re announced.' },
    { title: 'Exclusive reflections', body: 'Ideas on story, growth, and amplifying talent — sent with care, never crowded.' },
  ],
};

export const resourcesCopy = {
  eyebrow: 'Resources',
  title: 'Curated for creators',
  lead: 'Tools, people, and places we trust to help talent grow.',
};
