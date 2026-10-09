import { circleIntro, getMemberBenefits, getMonthlyThemes, getUpcomingEvents } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { SampleBadge, Section, SectionHeading } from '@/components/ui/Section';
import { EventList } from '@/components/events/EventList';
import { JoinCircleButton } from '@/components/circle/JoinCircleButton';
import styles from './pages.module.css';

/**
 * Public information page for the IAV Circle. Membership itself (pricing,
 * checkout, accounts, gated content) is intentionally not built — the join
 * CTA (JoinCircleButton) points at `integrations.circle.joinUrl` once one exists.
 */
export function CirclePage() {
  usePageMeta({ title: 'The IAV Circle', description: circleIntro.lead });
  const themes = getMonthlyThemes();
  const benefits = getMemberBenefits();
  const events = getUpcomingEvents();

  return (
    <>
      <section className={styles.circleHero} aria-labelledby="circle-title">
        <div className="container">
          <p className="eyebrow">{circleIntro.eyebrow}</p>
          <h1 id="circle-title">{circleIntro.title}</h1>
          <p className={styles.lead}>{circleIntro.lead}</p>
          <JoinCircleButton />
        </div>
      </section>

      <Section labelledBy="themes-title">
        <div className="container">
          <SectionHeading id="themes-title" title="Monthly Themes" subtitle="Each month, the Circle gathers around a single idea." />
          {themes.length > 0 ? (
            <ol className={styles.themes}>
              {themes.map((t, i) => (
                <li key={i} className={styles.theme}>
                  <span className={styles.themeMonth}>
                    {t.month}
                    {t.sample && <SampleBadge />}
                  </span>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.emptyNote}>This season’s themes will be shared soon.</p>
          )}
        </div>
      </Section>

      <Section tone="surface" labelledBy="events-title">
        <div className={styles.narrow}>
          <SectionHeading id="events-title" title="Upcoming Events" />
          <EventList events={events} />
        </div>
      </Section>

      <Section tone="navy" labelledBy="benefits-title">
        <div className="container">
          <h2 id="benefits-title" className={styles.statement} style={{ color: 'var(--cream)', marginBottom: 'var(--space-l)' }}>
            Member Benefits
          </h2>
          {benefits.length > 0 ? (
            <ul className={styles.benefits}>
              {benefits.map((b, i) => (
                <li key={i}>
                  <h3>
                    {b.title}
                    {b.sample && <SampleBadge />}
                  </h3>
                  <p>{b.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyNote}>Membership details are on their way.</p>
          )}
        </div>
      </Section>

      <Section tone="lavender" labelledBy="join-title">
        <div className={`container-narrow ${styles.centerStack}`}>
          <SectionHeading id="join-title" title="Join the Circle" subtitle="Be among the first to hear when membership opens." />
          <JoinCircleButton />
        </div>
      </Section>
    </>
  );
}
