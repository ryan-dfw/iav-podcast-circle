import type { Article } from '../types';

/**
 * Copy and imagery pulled from the client's own AI-authored reference page
 * (ref/i.html, not part of the app) — this is her actual piece, in her words.
 */
export const iBidOnMyself: Article = {
  slug: 'i-bid-on-myself',
  category: 'Essay',
  topic: 'Reinvention',
  title: 'I Bid on Myself',
  dek: 'After twenty-five years in corporate America, one performance review told me it was time to go. It turned out to be the best feedback I ever received.',
  author: 'Isha Vazquez',
  publishedOn: '2026-10-12',
  heroImage: {
    src: '/articles/i-bid-on-myself/hero.webp',
    thumb: { src: '/articles/i-bid-on-myself/hero_thumb.webp', width: 480 },
    alt: 'Painted portrait of Isha in a lavender and blue dress, seated with her black-and-white cocker spaniel, Joaquin, against a lavender and pink backdrop.',
    width: 733,
    height: 1100,
  },
  heroCaption: 'The author with her cocker spaniel, Joaquin.',

  sections: [
    {
      blocks: [
        {
          type: 'paragraph',
          text: 'The review came the same year I led a reconciliation project that saved the company millions.',
        },
        {
          type: 'paragraph',
          text: 'My senior manager rated me below expectations. She gave two reasons. I hadn’t moved fast enough to let someone go. And I hadn’t contributed enough on a risk management call that she, not I, had been assigned to lead.',
        },
        {
          type: 'paragraph',
          text: 'I asked two peers I trusted to read it. Both came back with the same quiet look. They saw what I saw.',
        },
        {
          type: 'paragraph',
          text: 'I sat with it for a moment. Then I closed my laptop and waited for the anger. It never came. Neither did the fear. What came instead was clarity.',
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
        {
          type: 'paragraph',
          text: 'I had moved to Dallas to be part of this leadership team. Even before the move, I had a quiet feeling that this leadership might step over me. I went anyway. I’m glad I did, because it led me here.',
        },
        {
          type: 'paragraph',
          text: ['I was proud of my team. I felt fulfilled. ', { strong: 'Until I wasn’t.' }],
        },
      ],
    },
    {
      heading: 'The circle',
      blocks: [
        {
          type: 'paragraph',
          text: 'The part of my week I loved most wasn’t on any org chart. It was our circle: a safe space where my team could be brutally honest about their struggles, their frustrations with a project, or the changes rolling through the company. We’d say the hard things out loud, then refocus on the real goal. Ideas flowed, and everyone left knowing how to move forward.',
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
        {
          type: 'paragraph',
          text: 'She didn’t need a vision. She needed someone to see what she actually needed. I’ve been doing that work ever since.',
        },
      ],
    },
    {
      heading: 'Until I wasn’t',
      blocks: [
        {
          type: 'paragraph',
          text: 'Then a new metric arrived. It measured how much time my team spent active on their computers.',
        },
        {
          type: 'paragraph',
          text: 'But my team handled calls and customer service. The hardest problems got solved in meeting rooms, face to face with clients, away from a keyboard. None of those hours counted.',
        },
        {
          type: 'paragraph',
          text: 'So I did what I’d always done. I found the root cause. I built a full response showing leadership exactly where the numbers went wrong.',
        },
        { type: 'paragraph', text: 'No one followed up. Not with me. Not with my team.' },
        {
          type: 'paragraph',
          text: 'That’s when I understood: I still had a seat at the table, but my voice had been muted.',
        },
        {
          type: 'paragraph',
          text: 'Later that year, the reconciliation project my team delivered became someone else’s result.',
        },
        {
          type: 'paragraph',
          text: 'I started moving carefully. I measured my words in meetings. I made myself smaller so no one would feel threatened. Anxiety rode with me to the office every morning. For the first time in almost two decades, I didn’t want to go to work and lead.',
        },
        {
          type: 'paragraph',
          text: 'Here’s the irony I couldn’t see at the time: what hurt most was watching good work go unseen. That was the very thing I was being called to fix.',
        },
      ],
    },
    {
      heading: 'The final straw',
      blocks: [
        { type: 'paragraph', text: 'Then life asked everything of me. My son was in a car accident.' },
        {
          type: 'figure',
          image: {
            src: '/articles/i-bid-on-myself/son-hospital.webp',
            thumb: { src: '/articles/i-bid-on-myself/son-hospital_thumb.webp', width: 480 },
            alt: 'A painting of a young man resting in a hospital bed in a yellow gown, wearing a neck brace, covered in white sheets.',
            width: 816,
            height: 1100,
          },
          caption: 'The day everything changed.',
        },
        {
          type: 'paragraph',
          text: 'He survived. And sitting beside him, I saw with total clarity what I’d been protecting and what I’d been giving away. A title. A metric. A manager’s approval. None of it mattered the way I’d let it matter.',
        },
      ],
    },
    {
      heading: 'I bid on myself',
      blocks: [
        {
          type: 'paragraph',
          text: 'So I started positioning myself to leave on my own terms: quietly, financially, deliberately. I would rather walk out with my name intact than let anyone take apart nearly two decades of dedication.',
        },
        { type: 'paragraph', text: 'People expect a story like this to be about leaping into fear. Mine isn’t.' },
        {
          type: 'paragraph',
          text: 'I gave sixty days’ notice. I thanked the people who had earned it. I built an exit plan for my successor so my team wouldn’t miss a beat. On my last day, my team celebrated me, and I said goodbye. I didn’t make an announcement. I simply stepped out of the equation.',
        },
        {
          type: 'pull',
          text: 'After a career spent helping a firm decide where to place its bets, I finally placed one on me.',
        },
        { type: 'paragraph', text: 'I haven’t looked back.' },
      ],
    },
    {
      heading: 'I was always the amplifier',
      blocks: [
        {
          type: 'paragraph',
          text: 'I’ve always loved watching people thrive, even when they grow past me. I let people show me who they are. When someone shows commitment to the work, I give them assignments that stretch them in three directions: knowledge, customer focus and risk awareness.',
        },
        {
          type: 'paragraph',
          text: 'One team lead was my number one for years. I pushed him in all three, again and again. Today he’s a director at another firm. I’m extremely proud of him, and quietly proud that I had a hand in it.',
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
          text: 'Today I’m building my own consulting firm as a Talent Amplifier. My work is simple to say and deeply personal to do: I bring clarity to a person’s talent, then help the world see it.',
        },
        {
          type: 'paragraph',
          text: [
            'It’s the circle, all grown up. Through my podcast, ',
            { em: 'Let’s Talk for a Bit' },
            ', I look for the “silent angels”: everyday people with gifts no one has noticed yet. I don’t need the spotlight. I’d rather be the one holding it.',
          ],
        },
      ],
    },
    {
      heading: 'To you, if you’re wondering',
      blocks: [
        {
          type: 'paragraph',
          text: 'If you’re reading this feeling unseen, undervalued, or quietly wondering if it’s time, here’s what I’d tell you if you were sitting in my circle.',
        },
        {
          type: 'paragraph',
          text: 'Bid on you. Not recklessly. Do it the way I did: with a plan, with your feet under you, and with your eyes open. And if it doesn’t go the way you hoped, you’ll still have something most people never get. You’ll know.',
        },
        {
          type: 'paragraph',
          text: 'One quiet performance review once told me it was time to leave the room. It turned out to be the best feedback I ever received.',
        },
      ],
    },
  ],
};
