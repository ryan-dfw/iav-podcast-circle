import type { Episode } from '@/content/types';
import styles from './EpisodeHero.module.css';

/**
 * Masthead for an episode page — series name set large, episode title beneath,
 * then the kicker and episode number, mirroring the client's original Canva
 * episode page.
 *
 * With `heroImage`: the artwork is a full-width banner and the text sits on its
 * blank left side, positioned/scaled with the banner (as in her Canva layout).
 * Without: a soft palette arch stands in for the artwork.
 */
export function EpisodeHero({ episode }: { episode: Episode }) {
  const image = episode.heroImage;

  const text = (
    <>
      <p className={styles.series}>{episode.series}:</p>
      <h1 className={styles.title}>{episode.title}</h1>
      <p className={styles.kicker}>
        {episode.kicker} <span className={styles.divider}>|</span> <strong>Episode {episode.number}</strong>
      </p>
    </>
  );

  if (image) {
    return (
      <header className={styles.banner}>
        <div className={styles.bannerFrame}>
          <img
            className={styles.bannerImg}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            fetchPriority="high"
          />
          <div className={styles.bannerText}>{text}</div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>{text}</div>
        <div className={styles.art} aria-hidden="true">
          <div className={styles.arch} />
        </div>
      </div>
    </header>
  );
}
