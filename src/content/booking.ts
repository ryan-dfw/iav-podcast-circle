/**
 * "Book a Consultation" page content.
 *
 * Transcribed from the client's own AI-authored reference pages
 * (ref/book-a-session.html, then ref/b.html, neither part of the app). Her
 * developer notes confirm both Calendly links and the session lengths/prices
 * are final. The speaking option and its request form come from b.html.
 */

export interface BookingEmailLine {
  before: string;
  after: string;
}

export interface BookingMeta {
  label: string;
  value: string;
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
  /** Label/value pairs — the sessions bill by time, the talk doesn't. */
  meta: BookingMeta[];
  cta: string;
  /** Calendly for the sessions; an internal route for the speaking request. */
  bookingUrl: string;
}

export const speakingPath = '/book-a-consultation/speaking';

export const bookingCopy = {
  eyebrow: 'Book a Session',
  title: 'Book a Session with Isha',
  greeting: 'Hello and welcome!',
  lead: 'Have a talent you’re ready to stop hiding? An upcoming interview to prepare for? You’ve come to the right place. Choose the session that fits where you are, and let’s take your next step together. Planning an event? You can also book Isha to speak.',

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
      meta: [
        { label: 'Length', value: '30 minutes' },
        { label: 'Format', value: 'Zoom video call' },
        { label: 'Price', value: 'Free' },
      ],
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
      meta: [
        { label: 'Length', value: '60 minutes' },
        { label: 'Format', value: 'Zoom video call' },
        { label: 'Price', value: '$95' },
      ],
      cta: 'Book Interview Prep',
      bookingUrl: 'https://calendly.com/iavcircle/resume-interview-prep-session',
    },
    {
      slug: 'speaking',
      eyebrow: 'Bring Isha to your event',
      title: 'Book Isha to Speak',
      prompt: 'Is your audience ready to let go of an old story?',
      description:
        'A talk that helps your audience let go of the old story they tell about themselves and see who they truly are. Isha shares her own turning point and the pillars of discovering your talent. Then she shows how to start building the new you, one action at a time.',
      bullets: [
        'Hear a real story of reinvention, told with honesty',
        'Learn the pillars for finding the talent within you',
        'Leave with one action to start building the new you today',
      ],
      beforeWeMeet:
        'Before we connect: tell us who will be in the room and what you hope they walk away with.',
      meta: [
        { label: 'Audience', value: 'Students and working professionals' },
        { label: 'Format', value: 'In person or virtual' },
        { label: 'Fee', value: 'Based on your event' },
      ],
      cta: 'Book Isha to Speak',
      bookingUrl: speakingPath,
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
      {
        question: 'How do I book Isha to speak at my event?',
        answer:
          'Click “Book Isha to Speak” above and fill in the short request form with your event details, dates and budget. Isha will reply within 3 business days.',
      },
    ],
  },
};

/** The speaking request form — its own page, reached from the third card. */
export const speakingCopy = {
  eyebrow: 'Speaking request',
  title: 'Tell us about your event',
  intro: 'Fields marked * are required. Isha will reply within 3 business days.',
  submit: 'Send request',
  sending: 'Sending…',
  back: '← Back to sessions',
  groups: {
    about: 'About you',
    event: 'Your event',
    budget: 'Budget and timing',
  },
  errors: {
    required: 'Please fill in the required fields marked *.',
    dateOrder: 'The latest date should be on or after the earliest date.',
    failedBefore: 'Something went wrong. Please try again, or email ',
    failedAfter: '.',
  },
  thanks: {
    title: 'Thank you!',
    body: 'Your request is on its way. Isha will be in touch within 3 business days.',
    contactBefore: 'Questions in the meantime? Email ',
    contactAfter: '.',
  },
  options: {
    referral: ['Podcast', 'Instagram', 'Substack', 'Saw Isha speak', 'Referral', 'Other'],
    eventType: [
      'Conference',
      'College or student event',
      'Company training',
      'Women’s group or ERG',
      'Nonprofit or community',
      'Other',
    ],
    locationType: ['In person', 'Virtual', 'Not sure yet'],
    audienceSize: ['Under 50', '50–150', '150–500', '500+'],
    format: ['Keynote (30–45 min)', 'Workshop (60–90 min)', 'Fireside chat', 'Panel', 'Not sure yet'],
    budget: ['Under $1,000', '$1,000–$2,500', '$2,500–$5,000', '$5,000+', 'Not sure yet'],
    travel: ['Yes, separate from the fee', 'Included in the budget', 'Virtual event', 'Not sure yet'],
  },
};
