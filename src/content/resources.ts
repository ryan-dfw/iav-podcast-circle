import type { ResourceCategory } from './types';

/**
 * Curated resources for creators and talent. The four categories come from the
 * client's handoff. No real listings have been provided yet, so every item
 * below is a clearly marked SAMPLE.
 */
export const resourceCategories: ResourceCategory[] = [
  {
    id: 'publishing',
    title: 'Publishing Companies',
    intro: 'Publishers and imprints for writers ready to share their work.',
    items: [
      { sample: true, name: 'Sample Press', description: 'Placeholder listing — replace with a real publisher recommended by the client.' },
      { sample: true, name: 'Example Imprint', description: 'Placeholder listing used to preview the layout.' },
    ],
  },
  {
    id: 'venues',
    title: 'Venues',
    intro: 'Rooms and stages where emerging talent can be seen and heard.',
    items: [
      { sample: true, name: 'Sample Listening Room', location: 'City, State', description: 'Placeholder venue listing.' },
    ],
  },
  {
    id: 'coaches',
    title: 'Coaches',
    intro: 'Guides who help creators develop their gifts with intention.',
    items: [
      { sample: true, name: 'Sample Coach', description: 'Placeholder coach listing — real names to come from the client.' },
    ],
  },
  {
    id: 'creator-tools',
    title: 'Creator Tools',
    intro: 'Practical tools for recording, editing, and sharing your story.',
    items: [
      { sample: true, name: 'Sample Tool', description: 'Placeholder tool listing.' },
    ],
  },
];
