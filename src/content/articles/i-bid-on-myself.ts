import type { Article } from '../types';

/**
 * Transcribed from the design mockup (ex/blog.png). Confirm wording, byline and
 * hero image with the client before launch.
 */
export const iBidOnMyself: Article = {
  slug: 'i-bid-on-myself',
  category: 'Essay',
  topic: 'Reinvention',
  title: 'I Bid on Myself',
  dek: 'After twenty-five years in corporate America, one quiet moment of feedback showed me who I had been all along.',
  author: 'Isha Vazquez',
  publishedOn: '2026-10-13',
  heroImage: {
    src: '/articles/i-bid-on-myself/hero.jpg',
    alt: 'Painted portrait of Isha with her cocker spaniel, Joaquin, against a lavender and pink backdrop.',
    width: 893,
    height: 501,
  },
  heroCaption: 'The author with her cocker spaniel, Joaquin.',

  sections: [
    {
      blocks: [
        {
          type: 'paragraph',
          text: 'After twenty-five years in corporate America, it was one quiet moment of feedback that told me it was time to go.',
        },
        {
          type: 'paragraph',
          text: 'I sat with it for a moment. Then I closed my laptop and felt something I didn’t expect. Not anger. Not fear. Clarity.',
        },
        {
          type: 'paragraph',
          text: 'The universe had been talking to me for months. That day, I finally listened.',
        },
      ],
    },
    {
      heading: 'Before',
      blocks: [
        {
          type: 'paragraph',
          text: 'I was an Executive Director at a financial firm. My days were meetings, client calls, metrics, hiring decisions and more PowerPoints than I can count.',
        },
        {
          type: 'paragraph',
          text: 'My job was to lead, to direct action for our stakeholders and teams, and to find the root cause of whatever wasn’t working. I was a problem solver, and I was good at it.',
        },
        { type: 'paragraph', text: 'I was proud of my team. I felt fulfilled. Until I wasn’t.' },
      ],
    },
    {
      heading: 'The pow wow circle',
      blocks: [
        {
          type: 'paragraph',
          text: 'The part of my week I loved most wasn’t on any org chart. I called it our pow wow circle: a safe space where my team could be brutally honest about their struggles, their frustrations with a project, or the changes rolling through the company. We’d say the hard things out loud, then refocus on the real goal. Ideas flowed, and everyone left knowing how to move forward.',
        },
        {
          type: 'paragraph',
          text: 'When AI arrived at our firm, some of my team quietly stepped back. They didn’t argue. They just stopped showing up to the conversation.',
        },
        {
          type: 'paragraph',
          text: 'So three colleagues and I built a session to meet them where they were. We answered their questions and showed real prompts for the reconciliation work they did every week.',
        },
        {
          type: 'paragraph',
          text: 'Afterward, a woman who had been firmly closed to the idea came up to me. She didn’t want a philosophy of AI. She wanted me to show her how to organize her Outlook inbox and polish her emails. That small request felt bigger than any metric I’d ever hit.',
        },
      ],
    },
    {
      heading: 'Until I wasn’t',
      blocks: [
        {
          type: 'paragraph',
          text: 'Over time, things around me shifted, and I no longer felt the same trust. My team’s efforts and achievements went unacknowledged. I realized I was no longer a voice at the table. I had become a contrarian, the one pointing out what didn’t add up.',
        },
        {
          type: 'paragraph',
          text: 'It took me months to see it clearly, but those experiences weren’t setbacks. They were lessons. They were meant to happen, because they pointed me toward the person I was becoming.',
        },
        {
          type: 'paragraph',
          text: 'Here’s the irony I couldn’t see at the time: what hurt most was watching good work go unseen. That was the very thing I was being called to fix.',
        },
      ],
    },
    {
      heading: 'I bid on myself',
      blocks: [
        { type: 'paragraph', text: 'People expect a story like this to be about leaping into fear. Mine isn’t.' },
        {
          type: 'paragraph',
          text: 'When I walked away, I had peace. I had planned my exit. My finances were in order. After a career spent helping a firm decide where to place its bets, I finally placed one on me.',
        },
        { type: 'pull', text: 'I just bid on myself.' },
      ],
    },
    {
      heading: 'I always was one',
      blocks: [
        {
          type: 'paragraph',
          text: 'I’ve always loved watching people thrive, even when they grow past me. I’m the kind of leader who isn’t afraid to let the people on my team shine. To me, their success is the best compliment to how well I built the team.',
        },
        {
          type: 'paragraph',
          text: 'One team lead was my number one for years. Today he’s a director at another firm. I’m extremely proud of him, and quietly proud that I had a hand in pushing him toward bigger opportunities.',
        },
        {
          type: 'paragraph',
          text: 'That’s when I understood what reinvention really meant for me. I didn’t become someone new. I finally built my life around who I had always been.',
        },
      ],
    },
    {
      heading: 'Talent Amplifier',
      blocks: [
        {
          type: 'paragraph',
          text: 'Today I’m building my own consulting firm as a Talent Amplifier. My work is simple to say and deeply personal to do: I align clarity to a person’s talent, then help the world see it.',
        },
        {
          type: 'paragraph',
          text: [
            'It’s the pow wow circle, all grown up. Through my podcast, Let’s Talk for a Bit, I look for the “silent angels”: everyday people with gifts no one has noticed yet. I don’t need the spotlight. I’d rather be the one holding it.',
          ],
        },
      ],
    },
    {
      heading: 'To you, if you’re wondering',
      blocks: [
        {
          type: 'paragraph',
          text: 'If you’re reading this and feeling unseen, undervalued, quietly wondering if it’s time, here’s what I’d tell you if you were sitting in my circle.',
        },
        {
          type: 'paragraph',
          text: 'Go for it. Bid on you. What’s the worst that can happen? That you go back to square one? Even then, you’ll get to say, “At least I tried.” That alone is worth it.',
        },
        {
          type: 'paragraph',
          text: 'Just do it the way I did: with a plan, with your feet under you, and with your eyes open.',
        },
        {
          type: 'paragraph',
          text: 'One quiet moment of feedback once told me it was time to leave the room. It turned out to be the best feedback I ever received.',
        },
      ],
    },
  ],

  // TODO(client): add the LinkedIn post's URL to make this a link.
  alsoPublishedOn: [{ name: 'LinkedIn' }],
};
