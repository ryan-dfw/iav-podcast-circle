import { Link } from 'react-router-dom';
import { articlePath, readingMinutes } from '@/content';
import type { Article } from '@/content/types';
import { formatDate } from '@/lib/format';
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
          <img src={heroImage.src} alt="" width={heroImage.width} height={heroImage.height} loading="lazy" decoding="async" />
        ) : (
          <div className={styles.fallback} aria-hidden="true" />
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
