import { Link } from 'react-router-dom';
import { articlePath, readingMinutes } from '@/content';
import type { Article } from '@/content/types';
import { formatDate } from '@/lib/format';
import { defaultSrc, srcSetFor } from '@/lib/image';
import { SampleBadge } from '@/components/ui/Section';
import styles from './ArticleCard.module.css';

interface Props {
  article: Article;
  /** Larger, side-by-side layout for the newest article. */
  featured?: boolean;
  headingLevel?: 2 | 3;
}

export function ArticleCard({ article, featured, headingLevel = 2 }: Props) {
  const { heroImage } = article;
  const H = `h${headingLevel}` as const;
  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <div className={styles.media}>
        {heroImage ? (
          <img
            src={defaultSrc(heroImage)}
            srcSet={srcSetFor(heroImage)}
            sizes="(max-width: 40rem) 90vw, 20rem"
            alt=""
            width={heroImage.width}
            height={heroImage.height}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.fallback}>
            <svg className={styles.fallbackIcon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="9" cy="10" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M4 17l5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.fallbackLabel}>No artwork yet</span>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <p className={styles.meta}>
          {article.category}
          {article.topic && <> · {article.topic}</>}
          {article.sample && <SampleBadge />}
        </p>
        <H className={styles.title}>
          <Link to={articlePath(article)} className={styles.link}>
            {article.title}
          </Link>
        </H>
        <p className={styles.dek}>{article.dek}</p>
        <p className={styles.byline}>
          {article.author} · {formatDate(article.publishedOn)} · {readingMinutes(article)} min read
        </p>
      </div>
    </article>
  );
}
