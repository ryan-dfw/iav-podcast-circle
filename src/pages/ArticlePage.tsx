import { useParams } from 'react-router-dom';
import { getArticle, getArticles, readingMinutes } from '@/content';
import { formatDate } from '@/lib/format';
import { defaultSrc, srcSetFor } from '@/lib/image';
import { usePageMeta } from '@/hooks/usePageMeta';
import { SectionHeading, SampleBadge, Section } from '@/components/ui/Section';
import { ArticleBody } from '@/components/articles/ArticleBody';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleFooter } from '@/components/articles/ArticleFooter';
import { NotFoundPage } from './NotFoundPage';
import styles from './articles.module.css';

export function ArticlePage() {
  const { slug } = useParams();
  const article = slug ? getArticle(slug) : undefined;
  usePageMeta({ title: article?.title, description: article?.dek });
  if (!article) return <NotFoundPage />;

  const more = getArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  const isNote = article.format === 'note';

  return (
    <article>
      {isNote ? (
        <div className={`container-narrow ${styles.noteWrap}`}>
          <div className={styles.noteCard}>
            {article.heroImage && (
              <figure className={styles.noteFigure}>
                <img
                  src={defaultSrc(article.heroImage)}
                  srcSet={srcSetFor(article.heroImage)}
                  sizes="(max-width: 48rem) 100vw, 47.5rem"
                  alt={article.heroImage.alt}
                  width={article.heroImage.width}
                  height={article.heroImage.height}
                />
                {article.heroCaption && <figcaption>{article.heroCaption}</figcaption>}
              </figure>
            )}
            <p className={styles.noteLabel}>
              {article.noteLabel ?? article.category}
              {article.sample && <SampleBadge />}
            </p>
            <h1 className={styles.noteTitle}>{article.title}</h1>
            <p className={styles.noteMeta}>
              {formatDate(article.publishedOn)} · {readingMinutes(article)} min read
            </p>
            <div className={styles.noteBody}>
              <ArticleBody sections={article.sections} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className={`container-narrow ${styles.articleHead}`}>
            <p className={styles.kicker}>
              {article.category}
              {article.topic && <> | {article.topic}</>}
              {article.sample && <SampleBadge />}
            </p>
            <h1 className={styles.articleTitle}>{article.title}</h1>
            <p className={styles.articleDek}>{article.dek}</p>
            <p className={styles.articleByline}>
              <span>
                By <strong>{article.author}</strong>
              </span>
              <span>{formatDate(article.publishedOn)}</span>
              <span>{readingMinutes(article)} min read</span>
            </p>
          </header>

          {article.heroImage && (
            <figure className={styles.figure}>
              <img
                src={defaultSrc(article.heroImage)}
                srcSet={srcSetFor(article.heroImage)}
                sizes="(max-width: 56rem) 100vw, 55rem"
                alt={article.heroImage.alt}
                width={article.heroImage.width}
                height={article.heroImage.height}
              />
              {article.heroCaption && <figcaption>{article.heroCaption}</figcaption>}
            </figure>
          )}

          <ArticleBody sections={article.sections} />
        </>
      )}

      <ArticleFooter article={article} />

      {more.length > 0 && (
        <Section tone="surface" tight labelledBy="more-articles-title">
          <div className={`container ${styles.moreRead}`}>
            <SectionHeading id="more-articles-title" title="Keep reading" />
            <div className={styles.grid}>
              {more.map((a) => (
                <ArticleCard key={a.slug} article={a} headingLevel={3} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </article>
  );
}
