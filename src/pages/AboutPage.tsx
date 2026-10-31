import { aboutCopy, getEpisodes, podcastCopy } from '@/content';
import { mailto, site } from '@/config/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ButtonLink } from '@/components/ui/Button';
import { EpisodeCard } from '@/components/podcast/EpisodeCard';
import { JoinCircleButton } from '@/components/circle/JoinCircleButton';
import styles from './AboutPage.module.css';

export function AboutPage() {
  usePageMeta({
    title: 'About',
    description: `Meet ${site.host.name} — talent amplifier, podcast host, and nutrition coach.`,
  });
  const { host } = site;
  const episodes = getEpisodes();
  const c = aboutCopy;

  return (
    <>
      {/* 1. Her, first */}
      <section className={styles.intro} aria-labelledby="about-title">
        <div className={`container ${styles.introGrid}`}>
          <figure className={styles.portraitFrame}>
            <img
              src={host.portrait.src}
              srcSet={`${host.portrait.thumb.src} ${host.portrait.thumb.width}w, ${host.portrait.src} ${host.portrait.width}w`}
              sizes="(min-width: 52rem) 24rem, 90vw"
              alt={host.portrait.alt}
              width={host.portrait.width}
              height={host.portrait.height}
              fetchPriority="high"
            />
          </figure>

          <div className={styles.introText}>
            <p className="eyebrow">About</p>
            <h1 id="about-title" className={styles.name}>
              {host.name}
            </h1>
            <p className={styles.roles}>{c.roles.join(' · ')}</p>
            {c.bio.map((p) => (
              <p key={p} className={styles.lead}>
                {p}
              </p>
            ))}
            <ul className={styles.credentials} aria-label="Credentials">
              {c.credentials.map((cr) => (
                <li key={cr.short} title={cr.full ?? 'Full title to be confirmed'}>
                  {cr.full ?? cr.short}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Why — her line and the one-line mission */}
      <section className={styles.why} aria-labelledby="why-title">
        <div className={`container-narrow ${styles.whyInner}`}>
          <h2 id="why-title" className={styles.h2}>
            {c.why.title}
          </h2>
          <blockquote className={styles.statement}>
            <p>“{c.why.statement}”</p>
          </blockquote>
          <p className={styles.mission}>{c.why.mission}</p>
        </div>
      </section>

      {/* 3. Proof through the work */}
      <section className={styles.work} aria-labelledby="work-title">
        <div className="container">
          <h2 id="work-title" className={styles.h2}>
            {c.work.title}
          </h2>
          <div className={styles.episodes}>
            {episodes.map((ep) => (
              <EpisodeCard key={ep.slug} episode={ep} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Next steps */}
      <section className={styles.next} aria-labelledby="next-title">
        <div className={`container ${styles.nextInner}`}>
          <h2 id="next-title" className={styles.h2}>
            {c.next.title}
          </h2>
          <div className={styles.ctas}>
            <ButtonLink to="/podcast">Listen to the Podcast</ButtonLink>
            <ButtonLink to={mailto('Be a Guest — IAV Podcast Circle')} variant="mauve">
              {podcastCopy.guest.cta}
            </ButtonLink>
            <JoinCircleButton variant="periwinkle" />
            <ButtonLink to="/book-a-consultation" variant="blush">
              Book a Consultation
            </ButtonLink>
          </div>
          <p className={styles.contact}>
            Or write to me at <a href={mailto()}>{site.contact.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}
