/**
 * Site identity and contact details.
 *
 * Only facts the client has actually supplied belong here. Anything unknown is
 * `undefined`, and the UI simply omits it — please don't fill these in with
 * guesses.
 */

export interface SocialLink {
  id: 'youtube' | 'spotify' | 'instagram' | 'linktree';
  label: string;
  url: string;
  /** Set while the destination isn't working yet; renders struck through, unlinked. */
  pending?: boolean;
}

const socials: Array<Omit<SocialLink, 'url'> & { url?: string }> = [
  // Source: client email signature ("YouTube, Spotify & Linktree"); URL confirmed working.
  { id: 'linktree', label: 'Linktree', url: 'https://linktr.ee/iavpodcastcircle' },
  // TODO(client): channel / show URLs were not provided — add them to show the icons.
  { id: 'youtube', label: 'YouTube', url: undefined },
  { id: 'spotify', label: 'Spotify', url: undefined },
  { id: 'instagram', label: 'Instagram', url: undefined },
];

export const site = {
  name: 'IAV Podcast Circle',
  /** Short brand name shown in the header wordmark and footer. */
  shortName: 'IAV Circle',
  tagline: 'Talent Amplified',
  subtagline: 'Where raw stories become legacy.',
  /** Production origin, used for canonical/OG URLs. */
  url: 'https://iavcircle.com',
  defaultDescription:
    'IAV Podcast Circle captures talented people in their raw, human state before the world meets them — preserving a human capsule through intimate podcast conversations.',

  host: {
    name: 'Isha Vazquez',
    roles: ['Talent Amplifier', 'Podcast host & nutrition coach', 'Certified in neuropsychology'],
    // From the handoff ("Professional bio (CNC, CNP)"). Confirm exact wording with the client.
    credentials: 'CNC, CNP',
    portrait: {
      src: '/images/isha-vazquez-about.webp',
      thumb: { src: '/images/isha-vazquez-about_thumb.webp', width: 640 },
      alt: 'Portrait of Isha Vazquez, the host.',
      width: 1080,
      height: 1620,
    },
    signatureLine:
      'Discovering talented humans and preserving their gifts in a living time capsule, one conversation at a time.',
    /** Painted portrait (with Joaquin) used in article bios and sign-offs — distinct from the photographic `portrait` above. */
    paintedPortrait: {
      src: '/images/isha-vazquez-painted.webp',
      thumb: { src: '/images/isha-vazquez-painted_thumb.webp', width: 320 },
      alt: '',
      width: 733,
      height: 733,
    },
    /** Small author photo next to the byline on the Book page. */
    bookPortrait: {
      src: '/images/isha-vazquez-book.webp',
      thumb: { src: '/images/isha-vazquez-book_thumb.webp', width: 240 },
      alt: 'Isha Vazquez, the author.',
      width: 480,
      height: 720,
    },
    /** Portrait used in the bio section of the Book a Consultation page. */
    bookingPortrait: {
      src: '/images/isha-vazquez-booking.webp',
      thumb: { src: '/images/isha-vazquez-booking_thumb.webp', width: 480 },
      alt: 'Isha, Talent Amplifier, smiling and leaning on a table.',
      width: 900,
      height: 1350,
    },
  },

  podcast: {
    /**
     * The Episode 01 page calls the show "Let’s Talk For a Bit"; the client's
     * email signature says "Let’s Talk with Isha". Confirm which is current.
     */
    showName: 'Let’s Talk For a Bit',
  },

  contact: {
    email: 'iavpodcastcircle@gmail.com',
  },

  socials: socials.filter((s): s is SocialLink => Boolean(s.url)),

} as const;

export function mailto(subject?: string): string {
  const base = `mailto:${site.contact.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
