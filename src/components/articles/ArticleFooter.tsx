import { Link } from 'react-router-dom';
import { articleFooterCopy as copy } from '@/content';
import type { Article } from '@/content/types';
import { integrations } from '@/config/integrations';
import { site } from '@/config/site';
import { PendingLink } from '@/components/ui/PendingLink';
import styles from './ArticleFooter.module.css';

/** External link: opens in a new tab and says so to assistive tech. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

/** Closing block shared by every article: bio, nomination call, where to find the show. */
export function ArticleFooter({ article }: { article: Pick<Article, 'alsoPublishedOn'> }) {
  const linktree = site.socials.find((s) => s.id === 'linktree');
  const elsewhere = article.alsoPublishedOn ?? [];

  return (
    <footer className={styles.end}>
      <p className={styles.stars} aria-hidden="true">
        * * *
      </p>
      <div className={styles.note}>
        <p>{copy.bio}</p>
        <p>
          {copy.nominate}{' '}
          {linktree ? (
            linktree.pending ? (
              <PendingLink>Linktree</PendingLink>
            ) : (
              <ExternalLink href={linktree.url}>Linktree</ExternalLink>
            )
          ) : (
            'our Linktree'
          )}{' '}
          {copy.findShow} <ExternalLink href={integrations.youtube.channelUrl}>YouTube</ExternalLink> and{' '}
          <ExternalLink href={integrations.spotify.showUrl}>Spotify</ExternalLink> (<span translate="no">{copy.handle}</span>
          ).
        </p>
        {elsewhere.length > 0 && (
          <p>
            Also published on{' '}
            {elsewhere.map((p, i) => (
              <span key={p.name}>
                {i > 0 && ', '}
                {p.url ? <ExternalLink href={p.url}>{p.name}</ExternalLink> : p.name}
              </span>
            ))}
            .
          </p>
        )}
      </div>
      <p className={styles.back}>
        <Link to="/articles">← All articles</Link>
      </p>
    </footer>
  );
}
