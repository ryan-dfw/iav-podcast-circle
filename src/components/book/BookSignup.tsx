import { useId } from 'react';
import { bookSignupCopy as copy } from '@/content';
import { useKitRequest } from '@/components/circleStarter/useKitRequest';
import { RichText } from '@/lib/RichText';
import styles from './BookSignup.module.css';

/**
 * Early-reader list signup.
 *
 * Unlike the kit form, this one doesn't make anybody prove their inbox: there
 * is no book to hand over yet, so there's nothing a round trip would protect.
 * Submitting tells Isha straight away that this address wants the book, and
 * she has said she'd rather have a possible typo than a missed reader.
 */
export function BookSignup() {
  const { email, setEmail, status, notice, submit } = useKitRequest('book', copy.sent);
  const inputId = useId();
  const noticeId = useId();
  const titleId = useId();

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={titleId} className={styles.title}>
          <RichText value={copy.title} />
        </h2>
        <p className={styles.body}>
          <RichText value={copy.body} />
        </p>
        <p className={styles.prompt}>{copy.prompt}</p>

        {status === 'sent' ? (
          <div className={styles.notice} role="status" data-tone="sent">
            {notice}
          </div>
        ) : (
          <>
            <form className={styles.form} onSubmit={submit} noValidate aria-label="Book early-reader list">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={status === 'error'}
                aria-describedby={notice ? noticeId : undefined}
              />
              <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : copy.cta}
              </button>
            </form>
            <div id={noticeId} className={styles.notice} role="status" aria-live="polite" data-tone={status}>
              {notice}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
