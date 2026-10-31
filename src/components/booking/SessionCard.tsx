import type { BookingSession } from '@/content';
import { mailto, site } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';
import styles from './SessionCard.module.css';

interface Props {
  session: BookingSession;
  variant?: 'primary' | 'mauve';
  headingLevel?: 2 | 3;
}

/** One bookable offering on the "Book a Consultation" page — real copy, a real Calendly link. */
export function SessionCard({ session, variant = 'primary', headingLevel = 2 }: Props) {
  const H = `h${headingLevel}` as const;
  const { beforeWeMeet } = session;

  return (
    <article className={styles.card}>
      <p className={styles.eyebrow}>{session.eyebrow}</p>
      <H className={styles.title}>{session.title}</H>
      <p className={styles.prompt}>{session.prompt}</p>
      <p className={styles.description}>{session.description}</p>
      <ul className={styles.bullets}>
        {session.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <p className={styles.beforeWeMeet}>
        {typeof beforeWeMeet === 'string' ? (
          beforeWeMeet
        ) : (
          <>
            {beforeWeMeet.before}
            <a href={mailto()}>{site.contact.email}</a>
            {beforeWeMeet.after}
          </>
        )}
      </p>
      <dl className={styles.meta}>
        <div>
          <dt>Length</dt>
          <dd>{session.length}</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>{session.price}</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>{session.format}</dd>
        </div>
      </dl>
      <ButtonLink to={session.bookingUrl} variant={variant} className={styles.cta}>
        {session.cta}
      </ButtonLink>
    </article>
  );
}
