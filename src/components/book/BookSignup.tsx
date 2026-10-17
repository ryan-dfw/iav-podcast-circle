import { useId, useState, type FormEvent } from 'react';
import { bookSignupCopy as copy } from '@/content';
import { isNewsletterConnected, subscribeToNewsletter } from '@/services/newsletter';
import styles from './BookSignup.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Notice = { tone: 'ok' | 'info' | 'error'; text: string } | null;

/** Early-reader list signup. Goes through the newsletter service, so it stays inert until a provider is connected. */
export function BookSignup() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const inputId = useId();
  const noticeId = useId();
  const titleId = useId();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setNotice({ tone: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setBusy(true);
    try {
      const result = await subscribeToNewsletter({ email: email.trim(), source: 'book-early-readers' });
      if (result.status === 'subscribed') {
        setEmail('');
        setNotice({ tone: 'ok', text: 'Thank you — you’re on the list.' });
      } else if (result.status === 'not-connected') {
        setNotice({ tone: 'info', text: 'Sample only — not implemented yet.' });
      } else {
        setNotice({ tone: 'error', text: result.message });
      }
    } catch {
      setNotice({ tone: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={titleId} className={styles.title}>
          {copy.title}
        </h2>
        <p className={styles.body}>{copy.body}</p>

        <form className={styles.form} onSubmit={onSubmit} noValidate aria-label="Book early-reader list">
          <label htmlFor={inputId} className="visually-hidden">
            {copy.emailLabel}
          </label>
          <input
            id={inputId}
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder={copy.placeholder}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={notice?.tone === 'error'}
            aria-describedby={notice ? noticeId : undefined}
          />
          <button
            type="submit"
            className={`${styles.submit} ${isNewsletterConnected() ? '' : 'unimplemented-x'}`}
            disabled={busy}
          >
            {busy ? 'Sending…' : copy.cta}
          </button>
        </form>
        <div id={noticeId} className={styles.notice} role="status" aria-live="polite" data-tone={notice?.tone}>
          {notice?.text}
        </div>
      </div>
    </section>
  );
}
