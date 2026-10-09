import { getFeaturedGuests, homeCopy, newsletterCopy } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ButtonLink } from '@/components/ui/Button';
import { Starfield } from '@/components/ui/Starfield';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GuestCapsuleCard } from '@/components/podcast/GuestCapsuleCard';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';
import styles from './HomePage.module.css';

export function HomePage() {
  usePageMeta({});
  const featured = getFeaturedGuests();
  const { hero, guests } = homeCopy;

  return (
    <>
      <section className={styles.hero} aria-labelledby="home-title">
        <Starfield />
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.heroEyebrow}>IAV Podcast Circle</p>
          <h1 id="home-title" className={styles.heroTitle}>
            {hero.title}
          </h1>
          <p className={styles.heroSub}>{hero.subtitle}</p>
          <div className={styles.ctas}>
            <ButtonLink to="/podcast" variant="primary" className={styles.heroPrimary}>
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink to="/circle" variant="blush">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <Section labelledBy="guests-title" className={styles.guestsSection}>
          <div className="container">
            <SectionHeading id="guests-title" title={guests.title} subtitle={guests.subtitle} />
            <div className={styles.guests}>
              {featured.map((guest, i) => (
                <GuestCapsuleCard key={guest.name} guest={guest} index={i} cta={guests.cta} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section tone="blush" className={styles.newsletterSection}>
        <div className="container">
          <NewsletterSignup source="home" title={newsletterCopy.title} subtitle={newsletterCopy.subtitle} />
        </div>
      </Section>
    </>
  );
}
