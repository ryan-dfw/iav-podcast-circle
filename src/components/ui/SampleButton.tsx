import { useEffect, useId, useState, type ReactNode } from 'react';
import { buttonClass } from './Button';
import styles from './SampleButton.module.css';

type Variant = Parameters<typeof buttonClass>[0];

/**
 * Stand-in for a call to action on placeholder content. It looks like the real
 * button, carries a "Sample" disclaimer beneath it, and on press explains that
 * it isn't implemented. Each one should eventually be replaced with real
 * content (and a real link) or removed.
 */
export function SampleButton({
  children,
  variant = 'primary',
  showNote = true,
}: {
  children: ReactNode;
  variant?: Variant;
  /** false = only the white X; the note stays available to screen readers. */
  showNote?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const noteId = useId();

  useEffect(() => {
    if (!pressed) return;
    const t = window.setTimeout(() => setPressed(false), 4000);
    return () => window.clearTimeout(t);
  }, [pressed]);

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${buttonClass(variant)} unimplemented-x`}
        title="Not implemented yet"
        aria-describedby={noteId}
        onClick={() => setPressed(true)}
      >
        {children}
      </button>
      <p
        id={noteId}
        className={showNote ? styles.note : 'visually-hidden'}
        data-pressed={pressed}
        role="status"
        aria-live="polite"
      >
        {pressed ? 'Sample only — not implemented yet.' : 'Sample'}
      </p>
    </div>
  );
}
