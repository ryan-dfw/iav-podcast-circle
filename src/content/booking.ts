/**
 * "Book a Consultation" page content.
 *
 * Transcribed from the client's own AI-authored reference page
 * (ref/book-a-session.html, not part of the app). Her developer notes there
 * confirm both Calendly links and the session lengths/prices are final.
 */

export interface BookingEmailLine {
  before: string;
  after: string;
}

export interface BookingSession {
  slug: string;
  eyebrow: string;
  title: string;
  prompt: string;
  description: string;
  bullets: string[];
  /** A plain note, or one that wraps a mention of the contact email. */
  beforeWeMeet: string | BookingEmailLine;
  length: string;
  price: string;
  format: string;
  cta: string;
  bookingUrl: string;
}

export const bookingCopy = {
  eyebrow: 'Book a Session',
  title: 'Book a Session with Isha',
  greeting: 'Hello and welcome!',
  lead: 'Have a talent you’re ready to stop hiding? An upcoming interview to prepare for? You’ve come to the right place. Choose the session that fits where you are, and let’s take your next step together.',

  sessions: [
    {
      slug: 'talent-discovery',
      eyebrow: 'Find your gift',
      title: 'Talent Discovery Session',
      prompt: 'Have a talent you’re ready to stop hiding?',
      description:
        'A one-on-one conversation to uncover what lights you up and what’s been holding you back, so you can start sharing your gift with confidence.',
      bullets: [
        'Explore the strengths people already see in you',
        'Name what’s been keeping your talent on the shelf',
        'Leave with one clear next step',
      ],
      beforeWeMeet: 'Before we meet: think of one thing people always come to you for.',
      length: '30 minutes',
      price: 'Free',
      format: 'Zoom video call',
      cta: 'Book Talent Discovery',
      bookingUrl: 'https://calendly.com/iavcircle/talent-discovery-session',
    },
    {
      slug: 'interview-prep',
      eyebrow: 'Get interview ready',
      title: 'Resume & Interview Prep Session',
      prompt: 'An upcoming interview to prepare for?',
      description:
        'We’ll review your resume together, then practice with a one-on-one mock interview tailored to the role you want.',
      bullets: [
        'Personal feedback on your resume',
        'A realistic mock interview for your target job',
        'Coaching on how to tell your story with confidence',
      ],
      beforeWeMeet: {
        before: 'Before we meet: please send your resume and the job posting to ',
        after: '.',
      },
      length: '60 minutes',
      price: '$95',
      format: 'Zoom video call',
      cta: 'Book Interview Prep',
      bookingUrl: 'https://calendly.com/iavcircle/resume-interview-prep-session',
    },
  ] satisfies BookingSession[],

  howItWorks: {
    title: 'How it works',
    lead: 'Simple, personal, and focused on you.',
    steps: [
      { title: 'Choose your session', description: 'Pick the one that fits where you are today.' },
      {
        title: 'Book a time',
        description: 'Select a date that works for you. You’ll get a confirmation by email.',
      },
      { title: 'Come as you are', description: 'No polish required. Just bring your curiosity and a little courage.' },
      {
        title: 'Leave with a next step',
        description: 'Every session ends with something clear you can act on right away.',
      },
    ],
  },

  bio: {
    eyebrow: 'Meet your Talent Amplifier',
    greeting: 'Hi, I’m Isha.',
    paragraphs: [
      'After more than 25 years in corporate leadership, including my role as an Executive Director at a financial firm, I learned that my favorite part of the work was never the title. It was watching people discover what they’re capable of.',
      'Today I help people find their gifts, build the confidence to use them, and show up ready for the opportunities they want. With a background in neuropsychology and a heart for everyday heroes, I’ll meet you exactly where you are.',
    ],
    signoff: 'Let’s talk for a bit.',
  },

  faq: {
    title: 'Questions',
    lead: 'A few things people often ask before booking.',
    items: [
      {
        question: 'Which session is right for me?',
        answer:
          'If you’re not sure what your gift is or how to use it, start with the Talent Discovery Session. If you have a specific job or interview coming up, choose Resume & Interview Prep.',
      },
      {
        question: 'Where do sessions take place?',
        answer: 'Sessions are held by video call via Zoom. You’ll receive the link in your confirmation email.',
      },
      {
        question: 'What if I need to reschedule?',
        answer: 'You may reschedule at any time through Calendly, using the link in your confirmation email.',
      },
      {
        question: 'How do I send my resume?',
        answer: { before: 'Please send your resume to ', after: ' before your scheduled call.' } as BookingEmailLine,
      },
    ],
  },
};
