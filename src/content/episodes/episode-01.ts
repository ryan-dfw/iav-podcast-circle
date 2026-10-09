import type { Episode } from '../types';

/**
 * Episode 01 — content recovered from the client's published Canva page
 * (https://iavpodcastcircle.com/episode01). Copy is kept as she published it.
 */
export const episode01: Episode = {
  slug: 'episode-01',
  number: 1,
  series: 'Let’s Talk For a Bit',
  title: 'Navigating Narcissism',
  kicker: 'Insights from Paola’s Journey',
  headline: 'Navigating Narcissism: Insights from Paola’s Journey',
  dek: 'Exploring the emotional impact of narcissistic relationships.',
  summary:
    'Host Isha speaks with Paola about her journey through narcissistic abuse, the book that grew out of her healing, and the small red flags worth noticing.',
  host: 'Isha',
  guests: [{ name: 'Paola Roman', descriptor: 'Author, “The Narcissist Love of My Life”' }],
  video: { videoId: 'tHH6PM3AycU' },
  // Banner artwork from the client's original Canva page (decorative, so empty alt).
  heroImage: { src: '/episodes/episode-01/hero.webp', alt: '', width: 1344, height: 576 },
  featured: true,
  legacyPaths: ['/episode01'],

  sections: [
    {
      heading: 'From the Editor',
      blocks: [
        {
          type: 'paragraph',
          text: 'In this first episode, host Isha speaks with Paola about her journey through narcissistic abuse and the emotional complexity of relationships marked by narcissistic personality disorder (NPD).',
        },
        {
          type: 'paragraph',
          text: 'With warmth and honesty, Paola shares the insights and lessons that have shaped her understanding, offering listeners space to reflect on what they may have experienced and what healing can make possible.',
        },
      ],
    },
    {
      heading: 'The Power of Reflection',
      blocks: [
        {
          type: 'paragraph',
          text: [
            'Paola’s book, ',
            { em: '“The Narcissist Love of My Life,”' },
            ' began as a personal journal for healing and unexpectedly became a guide for others. What started as a private act of reflection grew into a way to help readers recognize their own experiences and imagine a path forward.',
          ],
        },
        {
          type: 'quote',
          text: 'Your book really opens a reader up to the realization that there is a light at the end of the tunnel.',
          attribution: 'Isha',
          tone: 'cream',
        },
        {
          type: 'paragraph',
          text: 'Isha’s words capture the hope at the heart of Paola’s story: reflection can bring clarity, and sharing a difficult journey can help someone else feel understood.',
        },
      ],
    },
    {
      heading: 'Understanding Narcissistic Personality Disorder',
      blocks: [
        {
          type: 'paragraph',
          text: 'Narcissistic personality disorder is often misunderstood. In the conversation, Paola describes the patterns she has come to recognize while keeping the focus on lived experience, compassion, and understanding rather than diagnosis.',
        },
        {
          type: 'quote',
          text: 'It’s a condition that requires admiration; they need to be the center of attention. They lack empathy and need to be right all the time.',
          attribution: 'Paola',
          tone: 'mist',
        },
        {
          type: 'paragraph',
          text: 'Recognizing these traits can be a first step toward liberation. Naming what feels confusing may help a person create distance from self-doubt and begin considering what they need for safety, clarity, and healing.',
        },
      ],
    },
    {
      heading: 'Signs and Red Flags',
      blocks: [
        {
          type: 'paragraph',
          text: 'Some signs can be subtle at first, easy to dismiss, or difficult to understand until a pattern becomes clearer. Paola recalls a first-date comment that she now recognizes as a significant red flag:',
        },
        {
          type: 'quote',
          text: 'If you were standing in front of a group of models, you would not stand out.',
          tone: 'blush',
        },
        {
          type: 'paragraph',
          text: 'Looking back, Paola sees how a small behavior can carry meaning that is not immediately obvious. She encourages listeners to notice the small moments that feel diminishing, unsettling, or out of place—especially when those behaviors begin to escalate over time.',
        },
        {
          type: 'note',
          label: 'A gentle reminder:',
          text: 'You do not have to explain away every feeling that something is off. Paying attention to your experience can be an important part of understanding it.',
        },
      ],
    },
    {
      heading: 'Encouragement for the Journey',
      blocks: [
        {
          type: 'paragraph',
          text: 'Paola offers a simple invitation to stay curious about the questions that surface along the way:',
        },
        {
          type: 'quote',
          text: 'Don’t be scared of digging into whatever it is that you’re not sure about.',
          attribution: 'Paola',
          tone: 'lavender',
        },
        {
          type: 'paragraph',
          text: 'Trust your instincts when something feels off, and give yourself permission to seek understanding rather than silence your questions. Learning more can be a compassionate step toward recognizing what you have lived through and deciding what support you need next.',
        },
      ],
    },
    {
      heading: 'A Hopeful Note',
      blocks: [
        {
          type: 'paragraph',
          text: 'Paola’s journey reminds us that resilience and healing can grow through reflection, honest connection, and the courage to speak. Even when an experience feels isolating, you are not alone—and, as Isha says, “it brings humanity together.”',
        },
      ],
    },
  ],

  listen: {
    heading: 'Listen to Episode 1',
    before: ['Listen to the full episode of ', { em: 'Let’s Talk For a Bit' }],
    after:
      'for a deeper dive into Paola’s journey, the lessons she shares, and the encouragement at the heart of this conversation.',
  },
};
