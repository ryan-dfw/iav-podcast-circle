/**
 * The Circle Starter journal — the actual prose, served only to a request
 * carrying a valid token.
 *
 * This lives in the function bundle on purpose. It used to sit in
 * `src/content/`, which meant every visitor downloaded all ten pages of her
 * writing inside the JS bundle whether or not they'd ever given an email —
 * a route-level gate in a single-page app hides nothing. Keeping it here is
 * what makes the gate real.
 *
 * Transcribed verbatim from the client's own print-ready journal
 * (ref/u.html, not part of the app), which is also the source of the PDF.
 */
import type { CircleStarterContent } from '../../../src/content/circleStarterTypes';

export const circleStarterContent: CircleStarterContent = {
  eyebrow: 'A 7-Day Guided Journal',
  title: 'Uncover Your Gift',
  subtitle: 'Seven days, a few honest questions, and the gift that was there all along.',
  byline: 'by Isha Vazquez · host of Let’s Talk for a Bit',

  welcome: {
    greeting: 'Welcome. I’m so glad you’re here.',
    paragraphs: [
      'For more than 25 years I built a career in corporate America, most recently as an Executive Director at a financial firm. From the outside, it looked like I had it all figured out. But some of my most important gifts were sitting quiet, waiting for me to notice them.',
      'Today I spend my time doing what lights me up: sitting across from people, asking good questions, and watching them discover what they’re capable of. Through my podcast and the IAV Circle, I’ve seen it again and again. Everyone has a gift. Most of us just haven’t been asked the right questions yet.',
      'That’s what this journal is for.',
    ],
  },

  howToUse: {
    title: 'How to use this journal',
    items: [
      'Give yourself 10–15 minutes a day for 7 days.',
      'Write freely. There are no wrong answers, and no one is grading you.',
      'If a question feels uncomfortable, stay with it a little longer. That’s usually where the good stuff is.',
      'Missed a day? Just pick up where you left off.',
    ],
    outro:
      'By Day 7, you’ll have your own Gift Statement: a few honest sentences about what you bring to the world, and one step to start sharing it.',
    signoff: 'Let’s begin. — Isha',
  },

  days: [
    {
      number: 1,
      theme: 'Noticing',
      lead: 'Your gift often shows up in the things people already come to you for.',
      questions: [
        'What do friends, family, or coworkers ask for your help with most often?',
        'What compliment have you heard more than once but brushed off?',
        'What comes so easily to you that you assume everyone can do it?',
      ],
      prompt: 'Today I noticed:',
    },
    {
      number: 2,
      theme: 'Energy',
      lead: 'Your gift lives where your energy rises, not where it drains.',
      questions: [
        'Describe a time you completely lost track of time. What were you doing?',
        'Which activities leave you more energized than when you started?',
        'If you had a free Saturday with no obligations, what would you choose to spend it on?',
      ],
      prompt: 'My energy rises when:',
    },
    {
      number: 3,
      theme: 'Story',
      lead: 'The moments that changed us often point straight to what we’re here to share.',
      questions: [
        'Write about a moment that changed the direction of your life.',
        'What did that moment teach you that you could teach someone else?',
        'Who showed up for you during a hard season, and what did they give you?',
      ],
      prompt: 'My story taught me:',
    },
    {
      number: 4,
      theme: 'Feedback',
      lead: 'Sometimes others see our gifts more clearly than we do.',
      questions: [
        'Text three people you trust: “What’s one thing you think I’m really good at?” Write their answers here.',
        'What surprised you about their answers?',
        'Where do their answers overlap with what you wrote on Days 1–3?',
      ],
      prompt: 'Others see in me:',
    },
    {
      number: 5,
      theme: 'Fear',
      lead: 'Every gift that stays quiet has a reason. Let’s name yours gently.',
      questions: [
        'What has kept you from fully sharing your gift?',
        'Whose voice do you hear when you doubt yourself? Is that voice telling the truth?',
        'What would you do with your gift if you knew no one would judge you?',
      ],
      prompt: 'The story I’m ready to let go of:',
    },
    {
      number: 6,
      theme: 'Amplify',
      lead: 'A gift grows when it’s shared, even in small ways.',
      questions: [
        'Who in your life could benefit from your gift right now?',
        'What is one small way you could share your gift this week? (A conversation, a post, an offer to help.)',
        'What support would make it easier to take that step?',
      ],
      prompt: 'This week I will:',
    },
    {
      number: 7,
      theme: 'Commit',
      lead: 'Look back at everything you’ve written. Your gift has been here the whole time.',
      questions: [
        'Reread Days 1–6. Which words or themes keep showing up?',
        'Finish this sentence: “My gift is ______, and I share it by ______.”',
        'How will you feel 90 days from now if you keep sharing your gift?',
      ],
      prompt: 'My Gift Statement:',
    },
  ],

  closing: {
    title: 'You did it.',
    paragraphs: [
      'Seven days ago, you started with a question. Today you have a Gift Statement in your own words. That’s not small. Most people never stop long enough to ask.',
      'Here’s what I know from years of conversations: a gift grows fastest in good company. When you share it with people who see you, encourage you, and hold you to your next step, it gets louder.',
      'That’s why I created the IAV Circle.',
    ],
    circlePitch: {
      intro:
        'An intimate membership for personal development events, a space to keep amplifying the gifts our conversations bring to light. Inside, you’ll find:',
      bullets: [
        'Small-group conversations where your voice is heard',
        'Personal development events designed to help you take the next step',
        'A community of people who celebrate each other’s wins',
      ],
    },
    keepGoing: {
      title: 'Keep the conversation going',
      listenTitle: 'Listen in',
      listenNote: 'Let’s Talk for a Bit · @letstalk_iavpodcastcircle',
      shareTitle: 'Share it',
      shareNote: 'Post your Gift Statement and tag me. I’d love to celebrate you.',
    },
    signoff: 'Your gift was always there. Now it’s time to let it be seen. — Isha',
    disclaimer:
      'This journal is for personal reflection and growth. It is not a substitute for professional medical or mental health care.',
  },
};
