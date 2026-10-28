import { getEpisodes, podcastCopy } from '@/content';
import { integrations } from '@/config/integrations';
import { mailto, site } from '@/config/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useLatestVideos } from '@/hooks/useLatestVideos';
import { Section, SectionHeading } from '@/components/ui/Section';
import { EpisodeCard } from '@/components/podcast/EpisodeCard';
import { VideoCard } from '@/components/podcast/VideoCard';
import { HumanCapsule } from '@/components/podcast/HumanCapsule';
import { ButtonLink } from '@/components/ui/Button';
import styles from './pages.module.css';

const LATEST_COUNT = 3;

/** Podcast hub: the channel's three newest videos, a link to the rest, Be a Guest. */
export function PodcastPage() {
  usePageMeta({ title: 'Podcast', description: podcastCopy.lead });
  const episodes = getEpisodes();
  const latest = useLatestVideos(LATEST_COUNT);

  return (
    <>
      <div className={`container ${styles.intro}`}>
        <SectionHeading id="podcast-title" as="h1" eyebrow={site.podcast.showName} title={podcastCopy.title} />
        <p className={styles.lead}>{podcastCopy.lead}</p>
      </div>

      <Section tone="surface" labelledBy="episodes-title">
        <div className="container">
          <SectionHeading id="episodes-title" title="Episodes" />
          <div className={styles.episodes} aria-busy={latest.status === 'loading'}>
            {latest.status === 'ready' &&
              latest.videos.map((video) => {
                // Episodes with a write-up here link to it; the rest open on YouTube.
                const written = episodes.find((e) => e.video?.videoId === video.videoId);
                return written ? (
                  <EpisodeCard key={video.videoId} episode={written} />
                ) : (
                  <VideoCard key={video.videoId} video={video} />
                );
              })}
            {latest.status === 'error' &&
              episodes.slice(0, LATEST_COUNT).map((ep) => <EpisodeCard key={ep.slug} episode={ep} />)}
          </div>
          <p className={styles.allEpisodes}>
            All episodes on{' '}
            <a href={integrations.youtube.channelUrl} target="_blank" rel="noopener noreferrer">
              YouTube<span className="visually-hidden"> (opens in a new tab)</span>
            </a>{' '}
            &amp;{' '}
            <a href={integrations.spotify.showUrl} target="_blank" rel="noopener noreferrer">
              Spotify<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </Section>

      <HumanCapsule />

      <Section tone="blush" labelledBy="guest-title">
        <div className={`container-narrow ${styles.centerStack}`}>
          <SectionHeading id="guest-title" title={podcastCopy.guest.title} subtitle={podcastCopy.guest.body} />
          <div className={styles.guestActions}>
            <ButtonLink to={mailto('Be a Guest — IAV Podcast Circle')} variant="mauve">
              {podcastCopy.guest.cta}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
