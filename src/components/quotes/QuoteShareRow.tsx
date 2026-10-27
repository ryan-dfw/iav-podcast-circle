import { useEffect, useState } from 'react';
import type { Quote } from '@/content/types';
import { quoteImageFile } from '@/lib/quoteImage';
import { CheckIcon, DownloadIcon, LinkIcon, ShareIcon } from './ShareIcons';
import styles from './QuoteShareRow.module.css';

/**
 * Share controls for a quote.
 *
 * Each control is only rendered once we know the browser can actually perform
 * it — a share button that silently does nothing is worse than no button. So
 * capability is detected after mount (never during render, which would differ
 * between the prerendered HTML and the first client paint) and the row fills
 * in with whatever this browser supports.
 *
 * On a phone the share sheet is the only route onto Instagram, which has no
 * web intent for composing a post. On desktop that route doesn't exist at all,
 * so the image is downloaded for upload by hand.
 */

type Feedback = { message: string; icon?: 'check' } | null;

export function QuoteShareRow({ quote, compact }: { quote: Quote; compact?: boolean }) {
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [canCopy, setCanCopy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    // A dummy file of the right type: canShare judges by type, not contents.
    const probe = new File([new Blob()], 'probe.png', { type: 'image/png' });
    setCanShareFiles(typeof navigator.canShare === 'function' && navigator.canShare({ files: [probe] }));
    setCanCopy(Boolean(navigator.clipboard?.writeText));
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function withImage(action: (file: File) => Promise<void> | void, failure: string) {
    setBusy(true);
    try {
      await action(await quoteImageFile(quote));
    } catch (error) {
      // Dismissing the share sheet rejects with AbortError — not a failure.
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setFeedback({ message: failure });
      }
    } finally {
      setBusy(false);
    }
  }

  const share = () =>
    withImage(
      (file) => navigator.share({ files: [file], title: `Quote No. ${quote.number}` }),
      'Sharing didn’t work. Try saving the image instead.',
    );

  const download = () =>
    withImage((file) => {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setFeedback({ message: 'Image saved.', icon: 'check' });
    }, 'The image couldn’t be created.');

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setFeedback({ message: 'Link copied.', icon: 'check' });
    } catch {
      setFeedback({ message: 'Couldn’t copy the link.' });
    }
  }

  return (
    <div className={`${styles.row} ${compact ? styles.compact : ''}`}>
      <p className={styles.feedback} role="status">
        {busy ? 'Preparing image…' : feedback?.message}
      </p>
      <ul className={styles.actions}>
        {canShareFiles ? (
          <li>
            <button
              type="button"
              className={styles.action}
              onClick={share}
              disabled={busy}
              aria-label="Share this quote"
              title="Share this quote"
            >
              <ShareIcon />
            </button>
          </li>
        ) : (
          <li>
            <button
              type="button"
              className={styles.action}
              onClick={download}
              disabled={busy}
              aria-label="Save this quote as an image"
              title="Save this quote as an image"
            >
              {feedback?.icon === 'check' ? <CheckIcon /> : <DownloadIcon />}
            </button>
          </li>
        )}
        {canCopy && (
          <li>
            <button
              type="button"
              className={styles.action}
              onClick={copyLink}
              aria-label="Copy a link to this quote"
              title="Copy a link to this quote"
            >
              {feedback?.icon === 'check' && feedback.message.startsWith('Link') ? <CheckIcon /> : <LinkIcon />}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
