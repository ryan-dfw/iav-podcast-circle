import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import styles from './JournalField.module.css';

/** Keeps a draft in this browser only — there's no backend to save it to. */
function useDraft(key: string) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) ?? '';
    } catch {
      return '';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private browsing, storage full, etc. — fine to drop */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

/**
 * Ruled lines to write an answer on, like the printed journal's blanks.
 * Starts at `minRows` tall and grows with what's typed — never scrolls or
 * clips an answer that runs long.
 */
export function JournalLines({
  storageKey,
  ariaLabel,
  minRows = 3,
  id,
}: {
  storageKey: string;
  ariaLabel: string;
  minRows?: number;
  id?: string;
}) {
  const [value, setValue] = useDraft(storageKey);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      id={id}
      className={styles.lines}
      style={{ ['--min-rows' as string]: minRows }}
      rows={minRows}
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
      aria-label={ariaLabel}
      spellCheck
    />
  );
}
