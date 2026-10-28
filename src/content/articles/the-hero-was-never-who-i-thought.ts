import type { Article } from '../types';

/**
 * Copy pulled from the client's own AI-authored reference page (ref/t.html,
 * not part of the app) — her second essay, transcribed in her words.
 */
export const theHeroWasNeverWhoIThought: Article = {
  slug: 'the-hero-was-never-who-i-thought',
  category: 'Essay',
  topic: 'The Journey',
  title: 'The Hero Was Never Who I Thought',
  dek: 'Joseph Campbell found the same story in myths across the world. I am writing mine from the middle of it.',
  author: 'Isha Vazquez',
  publishedOn: '2026-10-23',

  heroImage: {
    src: '/articles/the-hero-was-never-who-i-thought/hero.webp',
    alt: 'Painted portrait of Isha pausing at her desk, glasses in hand, looking down in thought.',
    width: 1600,
    height: 900,
    thumb: { src: '/articles/the-hero-was-never-who-i-thought/hero_thumb.webp', width: 720 },
  },

  sections: [
    {
      blocks: [
        {
          type: 'paragraph',
          text: 'In 1949, a mythology scholar named Joseph Campbell published a book that changed how we understand stories. After studying myths and legends across cultures, he noticed they kept telling the same tale: someone leaves the world they know, walks through darkness, and comes home changed, carrying something that helps others.',
        },
        { type: 'paragraph', text: 'He called it the hero’s journey.' },
        {
          type: 'paragraph',
          text: 'For most of my life, I thought heroes were other people. Warriors. Founders. People in movies. It took me twenty-five years in corporate America, a performance review and a hospital room to understand that the journey Campbell described isn’t about legends. It’s about all of us.',
        },
        {
          type: 'paragraph',
          text: 'Here’s mine, stage by stage. As you read, I’d like you to look for yours.',
        },
        {
          type: 'toc',
          title: 'The stages in this essay',
          items: [
            { label: 'The ordinary world' },
            { label: 'The call' },
            { label: 'The refusal' },
            { label: 'The mentor' },
            { label: 'The ordeal' },
            { label: 'Crossing the threshold' },
            { label: 'The road of trials', current: true },
            { label: 'What I’m carrying home' },
          ],
        },
      ],
    },
    {
      heading: 'The ordinary world',
      blocks: [
        {
          type: 'paragraph',
          text: 'Every journey begins somewhere familiar. Mine had a badge, a title and a team I would have gone to battle for. I had moved across the country to lead in that world. I knew its language, its rhythms and its rules. What I didn’t know was how much of myself I had quietly left outside the door each morning.',
        },
        { type: 'ask', text: 'Where is your ordinary world? What feels safe but small?' },
      ],
    },
    {
      heading: 'The call',
      blocks: [
        {
          type: 'paragraph',
          text: 'The call rarely arrives as a trumpet. Mine came as a feeling I couldn’t shake: the work I was proudest of had stopped being seen, and so had I. One moment didn’t do it. Small silences did, stacking up until I couldn’t ignore what they were telling me.',
        },
        { type: 'ask', text: 'What has been quietly calling you? Not shouting. Calling.' },
      ],
    },
    {
      heading: 'The refusal',
      blocks: [
        {
          type: 'paragraph',
          text: 'Campbell said almost every hero refuses the call at first. I did too. I stayed. I measured my words. I made myself smaller so no one would feel threatened. I told myself this was patience. It was fear dressed as loyalty.',
        },
        { type: 'ask', text: 'What are you calling patience that might actually be fear?' },
      ],
    },
    {
      heading: 'The mentor',
      blocks: [
        {
          type: 'paragraph',
          text: 'In every myth, the hero meets a guide, someone who sees what the hero can’t yet see. Often the mentor gives a gift the hero carries for years before understanding its power.',
        },
        {
          type: 'paragraph',
          text: 'I met mine in the 1990s, when I was a young intern in a law office. His name was Bill M. Shaw, a respected local attorney and former judge in my community.',
        },
        {
          type: 'paragraph',
          text: 'One afternoon, his paralegal was racing to finish a draft, and I wasn’t typing fast enough for her. In a moment of stress, she grabbed the papers out of my hands and cursed at me: “F— you. I’ll do it myself.”',
        },
        {
          type: 'paragraph',
          text: 'No one had ever spoken to me that way. I had grown up in a religious home, and words like that weren’t part of my world. I felt embarrassed. I felt small.',
        },
        {
          type: 'paragraph',
          text: 'The next day, I asked Mr. Shaw for a minute of his time. He listened to every word. Then he said something that changed the direction of my life.',
        },
        {
          type: 'mentor',
          text: '“Isha, I want you to listen to me. I will not be firing her. She will probably be with me for the rest of her career. But you are meant for bigger and better things. You are not going to stay here. Do not focus on this setback. Take everything you’ve learned with you, and grow to be successful in everything you do.”',
        },
        {
          type: 'paragraph',
          text: 'I looked at that man and something in me surrendered. I felt peace. I felt respected. He was right.',
        },
        {
          type: 'paragraph',
          text: [
            'I didn’t know it then, but he had handed me the gift I would need decades later. When the call finally came, sitting in that leadership role, feeling unseen, I heard his voice again: ',
            { em: 'Do not focus on this setback. You are meant for bigger things.' },
          ],
        },
        { type: 'paragraph', text: 'I’ve passed his words on to everyone willing to listen ever since.' },
        {
          type: 'ask',
          text: 'Who once saw something in you before you could see it yourself? What did they tell you that you still carry?',
        },
      ],
    },
    {
      heading: 'The ordeal',
      blocks: [
        {
          type: 'paragraph',
          text: 'Campbell called the darkest stage “the belly of the whale,” the moment the old life swallows you before you can be reborn.',
        },
        {
          type: 'paragraph',
          text: 'Mine was a hospital room. My son had been in a car accident. I sat beside his bed and listened to the machines keep time for him. In that room, no one cared about my rating, my role or my results. The only question that mattered was whether the person I loved would wake up.',
        },
        {
          type: 'paragraph',
          text: 'He did. And something in me that had been gripping so tightly finally opened its hand.',
        },
        { type: 'ask', text: 'What has life already taken from you that showed you what matters?' },
      ],
    },
    {
      heading: 'Crossing the threshold',
      blocks: [
        {
          type: 'paragraph',
          text: 'The threshold is the point of no return. I used to picture it as a cliff you jump from. Mine felt more like a door I had been standing in front of for months, with my hand on the knob. When I finally turned it, there was no drama. Just a quiet knowing that I wasn’t coming back the same way I came in.',
        },
        {
          type: 'paragraph',
          text: [
            '(I told the story of that leap in ',
            { link: '“I Bid on Myself.”', href: '/articles/i-bid-on-myself' },
            ')',
          ],
        },
        { type: 'ask', text: 'If you crossed your threshold, what would the first step be? Not the leap. The step.' },
      ],
    },
    {
      heading: 'The road of trials',
      blocks: [
        { type: 'paragraph', text: 'This is where I am right now.' },
        {
          type: 'paragraph',
          text: 'Every morning, I wake up hoping today is the day the work turns into steady growth. I spend my days helping the people around me find and share their gifts. Some months the income comes. Some months it doesn’t.',
        },
        {
          type: 'paragraph',
          text: 'I planned for this leap. Planning doesn’t make the road painless. When you jump, your soul holds two things at once: the hope of arriving, and the weight of knowing you risked everything to get there.',
        },
        {
          type: 'pull',
          text: 'I’m not writing this from the finish line. I’m writing it from the road.',
        },
        { type: 'paragraph', text: 'And I’m writing a book as I walk it.' },
        {
          type: 'paragraph',
          text: 'Campbell never promised the trials would be short. What his stories show is that the trials turn the hero into the person who can finish the journey. Some days I believe that completely. Other days, I just keep walking. Both count.',
        },
        { type: 'ask', text: 'What trial are you facing that might actually be training?' },
      ],
    },
    {
      heading: 'What I’m carrying home',
      blocks: [
        {
          type: 'paragraph',
          text: 'Campbell said the journey finds its meaning when the hero returns with something that helps others. Not treasure for herself. A gift for the people she comes home to.',
        },
        {
          type: 'paragraph',
          text: [
            'I haven’t reached the end of my road. But I already know what I’m carrying, because it turns out I had it all along: the ability to see talent in people who don’t yet see it in themselves. Today, as a Talent Amplifier and through my podcast, ',
            { em: 'Let’s Talk for a Bit' },
            ', I look for “silent angels,” everyday people with gifts no one has noticed yet.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Maybe that’s the part of the story we forget. You don’t have to finish the journey to start sharing what you’ve found.',
        },
        { type: 'ask', text: 'What would you bring back if you made your journey? Who needs it?' },
      ],
    },
    {
      heading: 'Your journey is already happening',
      blocks: [
        {
          type: 'paragraph',
          text: 'Here’s what I wish someone had told me sooner: you don’t choose whether to take the hero’s journey. You’re already on it. The only choice is whether you keep refusing the call.',
        },
        { type: 'paragraph', text: 'Find your stage. Name it. Then take the next step.' },
        { type: 'paragraph', text: 'I’ll be taking mine right alongside you.' },
      ],
    },
  ],
};
