import { Link } from 'react-router-dom';
import { episodePath, type Episode } from '@/content';
import { padEpisode } from '@/lib/format';
import { youtubeThumb } from './YouTubeEmbed';
import styles from './EpisodeCard.module.css';

/** Episode grid card: thumbnail + title + short description (per the handoff). */
export function EpisodeCard({ episode, headingLevel = 3 }: { episode: Episode; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as const;
  const image = episode.video ? youtubeThumb(episode.video.videoId) : episode.heroImage?.src;
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image ? <img src={image} alt="" loading="lazy" decoding="async" /> : <div className={styles.fallback} />}
        <span className={styles.number} aria-hidden="true">
          {padEpisode(episode.number)}
        </span>
      </div>
      <div className={styles.body}>
        <p className={styles.meta}>
          Episode {episode.number} · {episode.guests.map((g) => g.name).join(', ')}
        </p>
        <H className={styles.title}>
          <Link to={episodePath(episode)} className={styles.link}>
            {episode.title}
          </Link>
        </H>
        <p className={styles.summary}>{episode.summary}</p>
        <span className={styles.more} aria-hidden="true">
          Read &amp; listen →
        </span>
      </div>
    </article>
  );
}
