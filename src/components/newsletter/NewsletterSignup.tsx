import { useId, useState, type FormEvent } from 'react';
import { isNewsletterConnected, subscribeToNewsletter, type SubscribeResult } from '@/services/newsletter';
import { buttonClass } from '@/components/ui/Button';
import styles from './NewsletterSignup.module.css';

interface Props {
  /** Identifies where the form lives (passed to the provider for tagging). */
  source: string;
  title?: string;
  subtitle?: string;
  /** Heading level for the form's title. */
  headingLevel?: 1 | 2 | 3;
  compact?: boolean;
}

type UiState = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'invalid' } | { kind: 'done'; result: SubscribeResult };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup({ source, title, subtitle, headingLevel = 2, compact }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<UiState>({ kind: 'idle' });
  const inputId = useId();
  const messageId = useId();
  const headingId = useId();
  const H = `h${headingLevel}` as const;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setState({ kind: 'invalid' });
      return;
    }
    setState({ kind: 'submitting' });
    try {
      const result = await subscribeToNewsletter({ email: email.trim(), source });
      setState({ kind: 'done', result });
      if (result.status === 'subscribed') setEmail('');
    } catch {
      setState({ kind: 'done', result: { status: 'error', message: 'Something went wrong. Please try again.' } });
    }
  }

  const message = (() => {
    if (state.kind === 'invalid') return { tone: 'error', text: 'Please enter a valid email address.' };
    if (state.kind !== 'done') return null;
    switch (state.result.status) {
      case 'subscribed':
        return { tone: 'ok', text: 'Thank you — you’re on the list.' };
      case 'not-connected':
        return { tone: 'info', text: 'Sample only — not implemented yet.' };
      case 'error':
        return { tone: 'error', text: state.result.message };
    }
  })();

  return (
    <div className={`${styles.box} ${compact ? styles.compact : ''}`}>
      {title && (
        <H id={headingId} className={styles.title}>
          {title}
        </H>
      )}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <form className={styles.form} onSubmit={onSubmit} noValidate aria-labelledby={title ? headingId : undefined}>
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
          aria-invalid={state.kind === 'invalid'}
          aria-describedby={message ? messageId : undefined}
        />
        <button
          type="submit"
          className={`${buttonClass('blush')} ${styles.submit} ${isNewsletterConnected() ? '' : 'unimplemented-x'}`}
          disabled={state.kind === 'submitting'}
        >
          {state.kind === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>

      <div id={messageId} className={styles.message} role="status" aria-live="polite" data-tone={message?.tone}>
        {message?.text}
      </div>

    </div>
  );
}
