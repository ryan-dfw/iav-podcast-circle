/**
 * Home page sections below the hero, from the client's "Gift Activation
 * alignment" mockup (ref/, Nov 2026): who it's for, mission, the five pillars.
 * The mockup's other sections (ways to begin, book/articles/podcast teasers,
 * Join the Circle) only repeated pages the nav already reaches, so they were
 * left out. Copy lives in homeCopy (content/pages.ts).
 */
import { Link } from 'react-router-dom';
import { homeCopy } from '@/content';
import { site } from '@/config/site';
import { RichText } from '@/lib/RichText';
import styles from './HomeSections.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

export function HomeSections() {
  const { forYou, mission, pillars } = homeCopy;

  return (
    <>
      {/* Who it's for */}
      <section className={styles.band} aria-labelledby="home-for-you">
        <div className={`container ${styles.stack}`}>
          <header className={styles.head}>
            <p className={styles.eyebrow}>{forYou.eyebrow}</p>
            <h2 id="home-for-you" className={styles.h2}>
              {forYou.title}
            </h2>
          </header>
          <ol className={styles.cards}>
            {forYou.items.map((item, i) => (
              <li key={item} className={styles.card}>
                <span className={styles.number} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <p className={styles.cardText}>{item}</p>
              </li>
            ))}
          </ol>
          <p className={styles.closing}>{forYou.closing}</p>
        </div>
      </section>

      {/* Mission */}
      <section className={`${styles.band} ${styles.white}`} aria-labelledby="home-mission">
        <div className={`container ${styles.split}`}>
          <img
            className={styles.portrait}
            src={site.host.portrait.src}
            srcSet={`${site.host.portrait.thumb.src} ${site.host.portrait.thumb.width}w, ${site.host.portrait.src} ${site.host.portrait.width}w`}
            sizes="(min-width: 64rem) 27.5rem, 90vw"
            alt={site.host.portrait.alt}
            width={site.host.portrait.width}
            height={site.host.portrait.height}
            loading="lazy"
          />
          <div className={styles.missionCopy}>
            <p id="home-mission" className={styles.eyebrow}>
              {mission.eyebrow}
            </p>
            <p className={styles.statement}>{mission.statement}</p>
            <p className={styles.body}>{mission.body}</p>
            <p className={styles.signature}>
              <RichText value={mission.signature} />
            </p>
            <p>
              <Link to="/about" className={styles.textLink}>
                {mission.link}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Gift Activation pillars */}
      <section className={`${styles.band} ${styles.navy}`} aria-labelledby="home-pillars">
        <div className={`container ${styles.stack}`}>
          <header className={styles.head}>
            <p className={`${styles.eyebrow} ${styles.onNavy}`}>{pillars.eyebrow}</p>
            <h2 id="home-pillars" className={styles.h2}>
              {pillars.title}
            </h2>
            <p className={styles.lede}>{pillars.subtitle}</p>
          </header>
          <ol className={styles.pillars}>
            {pillars.items.map((p, i) => (
              <li key={p.title} className={styles.pillar}>
                <span className={styles.pillarNumber} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarBody}>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
