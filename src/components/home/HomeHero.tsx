import { useId } from 'react';
import { Link } from 'react-router-dom';
import { homeCopy } from '@/content';
import { useKitRequest } from '@/components/circleStarter/useKitRequest';
import { ButtonLink } from '@/components/ui/Button';
import styles from './HomeHero.module.css';

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
  const { email, setEmail, status, notice, submit } = useKitRequest();
  const inputId = useId();
  const noticeId = useId();

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

          <form className={styles.form} onSubmit={submit} noValidate aria-label="Get the free Circle Starter">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={status === 'error'}
                aria-describedby={notice ? noticeId : undefined}
              />
              <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : hero.starter.cta}
              </button>
            </div>
            <div id={noticeId} className={styles.notice} role="status" aria-live="polite" data-tone={status}>
              {notice}
            </div>
          </form>

          <div className={styles.secondary}>
            <ButtonLink to="/book-a-consultation" variant="light" className={styles.bookButton}>
              {hero.bookConsultation}
            </ButtonLink>
            <p className={styles.latest}>
              <Link to="/podcast">{hero.latestStory}</Link>
            </p>
          </div>
        </div>

        <div className={styles.portrait}>
          <img
            src={hero.portrait.src}
            srcSet={`${hero.portrait.thumb.src} ${hero.portrait.thumb.width}w, ${hero.portrait.src} ${hero.portrait.width}w`}
            sizes="(min-width: 52rem) 32rem, 90vw"
            alt={hero.portrait.alt}
            width={hero.portrait.width}
            height={hero.portrait.height}
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
