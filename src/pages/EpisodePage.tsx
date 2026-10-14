import { Link, useParams } from 'react-router-dom';
import { episodePath, getEpisode, getEpisodes, newsletterCopy } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useYouTubeMeta } from '@/hooks/useYouTubeMeta';
import { RichText } from '@/lib/RichText';
import { defaultSrc, srcSetFor } from '@/lib/image';
import { Section } from '@/components/ui/Section';
import { EpisodeHero } from '@/components/episode/EpisodeHero';
import { EpisodeSections } from '@/components/episode/EpisodeBlocks';
import { YouTubeEmbed, youtubeWatchUrl } from '@/components/podcast/YouTubeEmbed';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';
import { NotFoundPage } from './NotFoundPage';
import styles from './EpisodePage.module.css';

/** Template for every episode — content comes entirely from the episode data. */
export function EpisodePage() {
  const { slug = '' } = useParams();
  const episode = getEpisode(slug);
  const videoMeta = useYouTubeMeta(episode?.video?.videoId);

  usePageMeta({
    title: episode ? `Episode ${episode.number}: ${episode.title}` : 'Episode not found',
    description: episode?.summary,
  });

  if (!episode) return <NotFoundPage />;

  const all = getEpisodes(); // newest first
  const idx = all.findIndex((e) => e.slug === episode.slug);
  const newer = idx > 0 ? all[idx - 1] : undefined;
  const older = idx < all.length - 1 ? all[idx + 1] : undefined;

  return (
    <article>
      <EpisodeHero episode={episode} />

      <div className={`container-narrow ${styles.article}`}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link to="/podcast">Podcast</Link> <span aria-hidden="true">/</span> Episode {episode.number}
        </nav>

        <header className={styles.header}>
          <h2 className={styles.headline}>{episode.headline}</h2>
          <p className={styles.dek}>{episode.dek}</p>
          <p className={styles.byline}>
            {episode.series} · Episode {episode.number}
          </p>
          {episode.guests.length > 0 && (
            <div className={styles.guestRow}>
              {episode.guests
                .filter((g) => g.portrait)
                .map((g) => (
                  <img
                    key={g.name}
                    className={styles.guestPortrait}
                    src={defaultSrc(g.portrait!)}
                    srcSet={srcSetFor(g.portrait!)}
                    sizes="8rem"
                    alt={g.portrait!.alt}
                    width={g.portrait!.width}
                    height={g.portrait!.height}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              <p className={styles.guests}>
                Hosted by {episode.host} · with{' '}
                {episode.guests.map((g, i) => (
                  <span key={g.name}>
                    {i > 0 && ', '}
                    <strong>{g.name}</strong>
                    {g.descriptor && <span className={styles.descriptor}> — {g.descriptor}</span>}
                  </span>
                ))}
              </p>
            </div>
          )}
        </header>

        <EpisodeSections sections={episode.sections} />

        <section className={styles.listen} aria-labelledby="listen-title">
          <h2 id="listen-title" className={styles.listenTitle}>
            {episode.listen.heading}
          </h2>
          <p>
            <RichText value={episode.listen.before} />{' '}
            {episode.video ? (
              <a href={youtubeWatchUrl(episode.video.videoId)} target="_blank" rel="noopener noreferrer">
                {videoMeta?.title ?? `Episode ${episode.number} on YouTube`}
                <span className="visually-hidden"> (opens YouTube in a new tab)</span>
              </a>
            ) : null}{' '}
            <RichText value={episode.listen.after} />
          </p>
          {episode.video && <YouTubeEmbed kind="video" videoId={episode.video.videoId} />}
        </section>

        {(newer || older) && (
          <nav className={styles.pager} aria-label="More episodes">
            {older ? (
              <Link to={episodePath(older)} rel="prev">
                <span>← Previous</span> Episode {older.number}: {older.title}
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link to={episodePath(newer)} rel="next" className={styles.next}>
                <span>Next →</span> Episode {newer.number}: {newer.title}
              </Link>
            )}
          </nav>
        )}
        <p className={styles.back}>
          <Link to="/podcast">← All episodes</Link>
        </p>
      </div>

      <Section tone="blush" tight>
        <div className="container">
          <NewsletterSignup
            source={`episode:${episode.slug}`}
            title="Get the next episode’s insights"
            subtitle={newsletterCopy.subtitle}
          />
        </div>
      </Section>
    </article>
  );
}
