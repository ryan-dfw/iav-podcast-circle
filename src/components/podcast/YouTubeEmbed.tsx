import { useState } from 'react';
import { useYouTubeMeta } from '@/hooks/useYouTubeMeta';
import styles from './YouTubeEmbed.module.css';

type Props =
  | { kind: 'video'; videoId: string }
  | { kind: 'playlist'; playlistId: string; title: string };

export const youtubeThumb = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
export const youtubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

/**
 * Privacy-friendly YouTube embed. Single videos render a lightweight poster
 * and only load YouTube's player when the visitor presses play; playlists
 * load a lazy iframe (no poster image is available without an API key).
 */
export function YouTubeEmbed(props: Props) {
  const [active, setActive] = useState(false);
  const meta = useYouTubeMeta(props.kind === 'video' ? props.videoId : undefined);

  if (props.kind === 'playlist') {
    return (
      <div className={styles.frame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(props.playlistId)}`}
          title={props.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  const { videoId } = props;
  const title = meta?.title ?? 'YouTube video';
  return (
    <div className={styles.frame}>
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.poster} onClick={() => setActive(true)}>
          <img src={youtubeThumb(videoId)} alt="" loading="lazy" decoding="async" />
          <span className={styles.play} aria-hidden="true" />
          <span className="visually-hidden">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}
