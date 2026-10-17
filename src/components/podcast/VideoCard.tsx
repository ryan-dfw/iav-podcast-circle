import type { ChannelVideo } from '@/services/youtube';
import { formatDate } from '@/lib/format';
import { youtubeThumb, youtubeWatchUrl } from './YouTubeEmbed';
import styles from './EpisodeCard.module.css';

/** Card for a channel video that has no write-up page on this site; opens it on YouTube. */
export function VideoCard({ video }: { video: ChannelVideo }) {
  const summary = video.description.split('\n')[0]?.slice(0, 180);
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img src={youtubeThumb(video.videoId)} alt="" loading="lazy" decoding="async" />
      </div>
      <div className={styles.body}>
        <p className={styles.meta}>{formatDate(video.published)}</p>
        <h3 className={styles.title}>
          <a href={youtubeWatchUrl(video.videoId)} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {video.title}
            <span className="visually-hidden"> (opens on YouTube in a new tab)</span>
          </a>
        </h3>
        {summary && <p className={styles.summary}>{summary}</p>}
        <span className={styles.more} aria-hidden="true">
          Watch on YouTube →
        </span>
      </div>
    </article>
  );
}
