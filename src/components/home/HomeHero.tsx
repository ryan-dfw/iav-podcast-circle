import { useId, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { homeCopy } from '@/content';
import { isNewsletterConnected, subscribeToNewsletter } from '@/services/newsletter';
import styles from './HomeHero.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Notice = { tone: 'ok' | 'info' | 'error'; text: string } | null;

function Sparkle({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="currentColor" />
    </svg>
  );
}

/** Home page hero: headline, free-kit signup, portrait slot. Layout follows ex/Homepage-html. */
export function HomeHero() {
  const { hero } = homeCopy;
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
      const result = await subscribeToNewsletter({ email: email.trim(), source: 'home-hero' });
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
    <section className={styles.hero} aria-labelledby="home-title">
      <Sparkle className={styles.sparkleA} />
      <Sparkle className={styles.sparkleB} />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{hero.eyebrow}</p>
          <h1 id="home-title" className={styles.title}>
            {hero.title} <span className={styles.accent}>{hero.titleAccent}</span>
          </h1>
          <p className={styles.body}>{hero.body}</p>

          <form className={styles.form} onSubmit={onSubmit} noValidate aria-label="Get the free Circle Starter">
            <label htmlFor={inputId} className={styles.label}>
              {hero.starter.lead} <strong>{hero.starter.name}</strong> {hero.starter.note}
            </label>
            <div className={styles.row}>
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
                className={`${styles.submit} ${isNewsletterConnected() ? '' : 'unimplemented-x'}`}
                disabled={busy}
              >
                {busy ? 'Sending…' : hero.starter.cta}
              </button>
            </div>
            <div id={noticeId} className={styles.notice} role="status" aria-live="polite" data-tone={notice?.tone}>
              {notice?.text}
            </div>
          </form>

          <p className={styles.latest}>
            <Link to="/podcast">{hero.latestStory}</Link>
          </p>
        </div>

        <div className={styles.portrait}>
          <img src={hero.portrait.src} alt={hero.portrait.alt} width={hero.portrait.width} height={hero.portrait.height} />
        </div>
      </div>
    </section>
  );
}
