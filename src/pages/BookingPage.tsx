import { bookingCopy } from '@/content';
import { mailto, site } from '@/config/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SessionCard } from '@/components/booking/SessionCard';
import styles from './BookingPage.module.css';

/** "Book a Consultation" — two real, Calendly-backed sessions, transcribed from the client's own reference page. */
export function BookingPage() {
  const { sessions, howItWorks, bio, faq } = bookingCopy;
  usePageMeta({ title: 'Book a Consultation', description: bookingCopy.lead });

  return (
    <>
      <div className={`container ${styles.intro}`}>
        <p className="eyebrow">{bookingCopy.eyebrow}</p>
        <h1 id="booking-title" className={styles.title}>
          {bookingCopy.title}
        </h1>
        <p className={styles.greeting}>{bookingCopy.greeting}</p>
        <p className={styles.lead}>{bookingCopy.lead}</p>
      </div>

      <div className={`container ${styles.sessions}`}>
        {sessions.map((session, i) => (
          <SessionCard key={session.slug} session={session} variant={i === 0 ? 'primary' : 'mauve'} />
        ))}
      </div>

      <Section tone="surface" labelledBy="how-it-works-title">
        <div className={`container-narrow ${styles.stepsWrap}`}>
          <SectionHeading id="how-it-works-title" title={howItWorks.title} subtitle={howItWorks.lead} />
          <ol className={styles.steps}>
            {howItWorks.steps.map((step, i) => (
              <li key={step.title}>
                <span className={styles.stepNumber}>{i + 1}</span>
                <div>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="blush" labelledBy="booking-bio-title">
        <div className={`container-narrow ${styles.bio}`}>
          <figure className={styles.bioPortrait}>
            <img
              src={site.host.bookingPortrait.src}
              srcSet={`${site.host.bookingPortrait.thumb.src} ${site.host.bookingPortrait.thumb.width}w, ${site.host.bookingPortrait.src} ${site.host.bookingPortrait.width}w`}
              sizes="(min-width: 48rem) 16rem, 60vw"
              alt={site.host.bookingPortrait.alt}
              width={site.host.bookingPortrait.width}
              height={site.host.bookingPortrait.height}
            />
          </figure>
          <div className={styles.bioText}>
            <p className="eyebrow">{bio.eyebrow}</p>
            <h2 id="booking-bio-title" className={styles.bioGreeting}>
              {bio.greeting}
            </h2>
            {bio.paragraphs.map((p) => (
              <p key={p} className={styles.bioParagraph}>
                {p}
              </p>
            ))}
            <p className={styles.bioSignoff}>{bio.signoff}</p>
          </div>
        </div>
      </Section>

      <Section tone="plain" labelledBy="booking-faq-title">
        <div className={`container-narrow ${styles.faqWrap}`}>
          <SectionHeading id="booking-faq-title" title={faq.title} subtitle={faq.lead} />
          <dl className={styles.faq}>
            {faq.items.map((item) => (
              <div key={item.question}>
                <dt>{item.question}</dt>
                <dd>
                  {typeof item.answer === 'string' ? (
                    item.answer
                  ) : (
                    <>
                      {item.answer.before}
                      <a href={mailto()}>{site.contact.email}</a>
                      {item.answer.after}
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  );
}
