import { useId, useState, type FormEvent } from 'react';
import { isNewsletterConnected, subscribeToNewsletter } from '@/services/newsletter';
import { buttonClass } from '@/components/ui/Button';
import styles from './CircleSignup.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Notice = { tone: 'ok' | 'info' | 'error'; text: string } | null;

/** "Join the Circle": email field with the join button beside it. Inert until a newsletter provider is connected. */
export function CircleSignup() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const inputId = useId();
  const noticeId = useId();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setNotice({ tone: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setBusy(true);
    try {
      const result = await subscribeToNewsletter({ email: email.trim(), source: 'circle-page' });
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
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={onSubmit} noValidate aria-label="Join the Circle">
        <label htmlFor={inputId} className="visually-hidden">
          Email address
        </label>
        <input
          id={inputId}
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={notice?.tone === 'error'}
          aria-describedby={notice ? noticeId : undefined}
        />
        <button
          type="submit"
          className={`${buttonClass('primary')} ${styles.submit} ${isNewsletterConnected() ? '' : 'unimplemented-x'}`}
          disabled={busy}
        >
          {busy ? 'Sending…' : 'Join the Circle'}
        </button>
      </form>
      <div id={noticeId} className={styles.notice} role="status" aria-live="polite" data-tone={notice?.tone}>
        {notice?.text}
      </div>
    </div>
  );
}
