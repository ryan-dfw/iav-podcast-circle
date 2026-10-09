export interface NavItem {
  label: string;
  to: string;
}

/** Primary navigation, in the order given in the client's handoff. */
export const primaryNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Podcast', to: '/podcast' },
  { label: 'Newsletter', to: '/newsletter' },
  { label: 'Resources', to: '/resources' },
  { label: 'The IAV Circle', to: '/circle' },
];
