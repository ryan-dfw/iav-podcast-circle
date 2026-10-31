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

/**
 * Extra links shown in the footer only — reachable, but not prominent
 * enough to earn a spot in the header's top nav alongside the five main
 * sections.
 */
export const footerExtraNav: NavItem[] = [{ label: 'Book a Consultation', to: '/book-a-consultation' }];
