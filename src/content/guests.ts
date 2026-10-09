import type { GuestCapsule } from './types';

/**
 * Placeholder guests for evaluating the Featured Guests layout. Not real
 * people: names are lorem ipsum and the portraits are AI-generated
 * (thispersondoesnotexist.com).
 */
export const sampleGuests: GuestCapsule[] = [
  {
    sample: true,
    name: 'Lorem Ipsum',
    episode: { number: 2, title: 'Sed Do Eiusmod Tempor' },
    portrait: { src: '/images/guests/sample-lorem-ipsum.jpg', alt: 'Placeholder portrait (AI-generated)' },
  },
  {
    sample: true,
    name: 'Dolor Amet',
    episode: { number: 3, title: 'Ut Enim ad Minim Veniam' },
    portrait: { src: '/images/guests/sample-dolor-amet.jpg', alt: 'Placeholder portrait (AI-generated)' },
  },
];
