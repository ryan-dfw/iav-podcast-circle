/** Small pieces shared by the Studio screens. */
import { useEffect, useState, type ReactNode } from 'react';
import { hasUnpublishedEdits, type Status } from './data';
import styles from './studio.module.css';

export function StatusTag({ record }: { record: { status: Status; draft: unknown; published: unknown } | null }) {
  if (!record) return <span className={styles.tag}>New</span>;
  const live = record.status === 'published';
  return (
    <span className={`${styles.tag} ${live ? styles.tagLive : ''}`}>
      {live ? 'Published' : 'Draft'}
      {hasUnpublishedEdits(record) && ' · unpublished edits'}
    </span>
  );
}

export type Notice = { kind: 'info' | 'error'; text: ReactNode } | null;

export function NoticeLine({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p className={notice.kind === 'error' ? styles.error : styles.muted} role={notice.kind === 'error' ? 'alert' : 'status'}>
      {notice.text}
    </p>
  );
}

/** A button that asks once more before doing something hard to undo. */
export function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  disabled,
}: {
  label: string;
  confirmLabel: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);
  if (!armed) {
    return (
      <button type="button" className={styles.quiet} disabled={disabled} onClick={() => setArmed(true)}>
        {label}
      </button>
    );
  }
  return (
    <span className={styles.row}>
      <button
        type="button"
        className={styles.danger}
        disabled={disabled}
        onClick={() => {
          setArmed(false);
          onConfirm();
        }}
      >
        {confirmLabel}
      </button>
      <button type="button" className={styles.quiet} onClick={() => setArmed(false)}>
        Cancel
      </button>
    </span>
  );
}

/** Warns before closing or reloading the tab with unsaved changes. */
export function useLeaveGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);
}

export const when = (d?: Date) =>
  d ? d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export const timeOnly = (d: Date) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

export const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));
