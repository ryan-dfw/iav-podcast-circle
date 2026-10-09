import { getEpisodes, getLatestEpisode, podcastCopy } from '@/content';
import { integrations } from '@/config/integrations';
import { mailto, site } from '@/config/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useYouTubeMeta } from '@/hooks/useYouTubeMeta';
import { ButtonLink } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { EpisodeCard } from '@/components/podcast/EpisodeCard';
import { YouTubeEmbed } from '@/components/podcast/YouTubeEmbed';
import styles from './pages.module.css';

/** Central podcast hub: playlist (or latest episode), episode grid, Be a Guest. */
export function PodcastPage() {
  usePageMeta({ title: 'Podcast', description: podcastCopy.lead });
  const episodes = getEpisodes();
  const latest = getLatestEpisode();
  const { playlistId } = integrations.youtube;
  const latestMeta = useYouTubeMeta(latest?.video?.videoId);

  return (
    <>
      <div className={`container ${styles.intro}`}>
        <SectionHeading id="podcast-title" as="h1" eyebrow={site.podcast.showName} title={podcastCopy.title} />
        <p className={styles.lead}>{podcastCopy.lead}</p>
      </div>

      <Section tight labelledBy="watch-title">
        <div className={styles.videoWrap}>
          <h2 id="watch-title" className="visually-hidden">
            {playlistId ? 'All episodes' : 'Latest episode'}
          </h2>
          {playlistId ? (
            <YouTubeEmbed kind="playlist" playlistId={playlistId} title={`${site.podcast.showName} — all episodes`} />
          ) : (
            latest?.video && (
              <>
                <YouTubeEmbed kind="video" videoId={latest.video.videoId} />
                {latestMeta && <p className={styles.caption}>Latest: {latestMeta.title}</p>}
              </>
            )
          )}
        </div>
      </Section>

      <Section tone="surface" labelledBy="episodes-title">
        <div className="container">
          <SectionHeading id="episodes-title" title="Episodes" />
          <div className={styles.episodes}>
            {episodes.map((ep) => (
              <EpisodeCard key={ep.slug} episode={ep} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="blush" labelledBy="guest-title">
        <div className={`container-narrow ${styles.centerStack}`}>
          <SectionHeading id="guest-title" title={podcastCopy.guest.title} subtitle={podcastCopy.guest.body} />
          <ButtonLink to={mailto('Be a Guest — IAV Podcast Circle')}>{podcastCopy.guest.cta}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
