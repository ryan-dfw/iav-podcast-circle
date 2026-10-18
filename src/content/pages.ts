/**
 * Page copy.
 *
 * Sources: the client's handoff email (brand purpose, section list, hero copy),
 * her mockup (headings and microcopy), and her email signature (host facts).
 * Lines marked DRAFT are assembled from those sources and should be confirmed
 * or rewritten in the client's own voice.
 */

export const homeCopy = {
  // From the homepage design mockup (ex/Homepage-html).
  hero: {
    eyebrow: 'Let’s Talk for a Bit',
    title: 'Your gift didn’t disappear.',
    titleAccent: 'Life just got loud.',
    body: 'After 25 years leading teams in corporate America, I’m collecting the raw, real stories of everyday people who found their gift in their hardest seasons. It’s a human time capsule for a world being reshaped by AI. Your story belongs in it.',
    starter: {
      lead: 'Start here:',
      name: 'The Circle Starter — 7 Days to Find Your Gift and Your People',
      note: '(free)',
      cta: 'Send me the free kit',
    },
    latestStory: 'or hear the latest story →',
    // Placeholder until the client supplies a high-res photo: point src at it (4:5 works best).
    portrait: { src: '/images/portrait-placeholder.svg', alt: '', width: 400, height: 500 },
  },
};

/**
 * About page — first person throughout, built only from facts the client has
 * supplied. Everything she still needs to provide is a visible placeholder.
 */
export const aboutCopy = {
  // Bio in the client's own wording (her preferred About description, Oct 2026).
  bio: [
    'Ishah (Isha) Vazquez is a Talent Amplifier, writer, and host of the Let’s Talk for a Bit podcast. After more than 25 years in corporate America — including 18+ years in financial services, most recently as an Executive Director at a financial firm — she built her career leading teams, strengthening risk governance, and developing AI training programs. Along the way, she learned that her greatest skill was never the spreadsheets. It was spotting the talent in people that they couldn’t yet see in themselves.',
    'Today, she has traded the corner office for the conversation. Through her consulting work, the IAV Circle community, and her podcast, Isha seeks out the “silent angels” — everyday people quietly surviving, thriving, and carrying gifts the world hasn’t noticed yet — and helps amplify them. Certified in nutrition and neuropsychology, she brings a whole-person lens to the question at the heart of everything she does: who are you when life asks everything of you?',
    'She is the author of the article “I Bid on Myself” and is writing her first book, Talent Within: Remembering who you are when life asks everything of you, under the name I. A. Vazquez. Her mission is to create a living capsule of real human stories in the age of AI — proof that the most valuable talent is often the one hiding in plain sight.',
  ],
  roles: ['Talent Amplifier', 'Writer', 'Podcast host'],
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
  // From the homepage design mockup (ex/Main.dc.html).
  capsule: {
    eyebrow: 'The human capsule',
    title: 'In a world learning to think like machines, someone should remember what it felt like to be human.',
    body: 'Every conversation is preserved as part of a living record: our failures, our embarrassments, our quiet comebacks, and the talents that carried us through. A capsule for the humans of tomorrow.',
  },
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

/** Closing block on every article. Same for all articles; kept in Isha’s words. */
export const articleFooterCopy = {
  bio: 'Isha Vazquez is a Talent Amplifier and the host of Let’s Talk for a Bit, a podcast about everyday people with hidden gifts. She lives in Plano, Texas, with her cocker spaniel, Joaquin.',
  nominate: 'Know a silent angel? Nominate them at',
  findShow: 'or find the show on',
  handle: '@letstalk_iavpodcastcircle',
};

/** The Book page. Title, subtitle and author are as printed on the cover. */
export const bookCopy = {
  eyebrow: 'The Book',
  title: 'Talent Within',
  subtitle: 'Remembering who you are when life asks everything of you',
  author: 'I. A. Vazquez',
  cover: {
    src: '/images/book/talent-within-cover.webp',
    thumb: { src: '/images/book/talent-within-cover_thumb.webp', width: 640 },
    width: 1200,
    height: 1800,
    alt: 'Cover of Talent Within by I. A. Vazquez: a leaf-shaped pendant hanging from a single thread, holding a childhood photo, above the title.',
  },
  // Lorem ipsum until the client supplies the real description, release details and purchase link.
  sample: true,
  description: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
  ],
  details: [
    { label: 'Release', value: 'Lorem ipsum 2027' },
    { label: 'Format', value: 'Dolor sit amet' },
    { label: 'Available at', value: 'Consectetur adipiscing' },
  ],
  cta: 'Get the book',
};

/** "The book, in progress" early-reader signup, from the homepage mockup (ex/Homepage-html). */
export const bookSignupCopy = {
  eyebrow: 'The book, in progress',
  title: 'The talent that carries us through our darkest chapters.',
  // Mockup reads "leading teams"; confirm with the client.
  body: 'These stories — together with what I learned leading teams in corners of the world most people never see — are becoming a book. Join the list to read early chapters first and help shape it.',
  emailLabel: 'Email for early chapters',
  placeholder: 'Your email address',
  cta: 'Read it first',
};
