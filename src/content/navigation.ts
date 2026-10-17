export interface NavItem {
  label: string;
  to: string;
}

/** Primary navigation. Home is reached through the wordmark. */
export const primaryNav: NavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Podcast', to: '/podcast' },
  { label: 'Articles', to: '/articles' },
  { label: 'The Book', to: '/book' },
  { label: 'The Circle', to: '/circle' },
];
