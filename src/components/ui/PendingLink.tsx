import type { ReactNode } from 'react';

/**
 * A text link that isn't working yet, rendered as struck-through text instead
 * of a dead anchor. Swap back to a real link once its destination is live.
 */
export function PendingLink({ children }: { children: ReactNode }) {
  return (
    <span className="pending-link" title="Link not active yet">
      {children}
      <span className="visually-hidden"> (link not available yet)</span>
    </span>
  );
}
