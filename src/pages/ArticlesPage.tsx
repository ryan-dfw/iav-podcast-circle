import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, getQuotes, quotesPath } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import styles from './articles.module.css';

const PAGE_SIZE = 9;
const ALL = 'All';

/** Article listing: newest piece featured, then a filterable grid that grows with "Load more". */
export function ArticlesPage() {
  usePageMeta({ title: 'Articles', description: 'Essays and reflections from Isha Vazquez.' });
  const all = getArticles();
  const quotes = getQuotes();
  const [latestQuote, ...earlierQuotes] = quotes;
  const categories = useMemo(() => [ALL, ...Array.from(new Set(all.map((a) => a.category)))], [all]);
  const [category, setCategory] = useState(ALL);
  const [shown, setShown] = useState(PAGE_SIZE);

  const filtered = category === ALL ? all : all.filter((a) => a.category === category);
  const [lead, ...rest] = filtered;
  const visibleRest = rest.slice(0, shown);

  return (
    <>
      <div className={`container ${styles.intro}`}>
        <SectionHeading
          id="articles-title"
          as="h1"
          eyebrow="Articles"
          title="Words from Isha"
          subtitle="Essays and reflections on gifts, reinvention, and the people who carry them."
        />

        {categories.length > 2 && (
          <ul className={styles.filters} aria-label="Filter articles by category">
            {categories.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  className={styles.chip}
                  aria-pressed={c === category}
                  onClick={() => {
                    setCategory(c);
                    setShown(PAGE_SIZE);
                  }}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`container ${styles.listing}`}>
        {lead ? (
          <>
            <ArticleCard article={lead} featured />
            {visibleRest.length > 0 && (
              <div className={styles.grid}>
                {visibleRest.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            )}
            {rest.length > shown && (
              <div className={styles.more}>
                <button type="button" className={styles.moreButton} onClick={() => setShown((n) => n + PAGE_SIZE)}>
                  Load more articles
                </button>
              </div>
            )}
          </>
        ) : (
          <p className={styles.empty}>New articles are on the way.</p>
        )}
      </div>

      {latestQuote && (
        <Section tone="surface" tight labelledBy="quotes-band-title">
          <div className={`container ${styles.quotes}`}>
            <h2 id="quotes-band-title" className={styles.quotesTitle}>
              Quotes
            </h2>
            <QuoteCard quote={latestQuote} headingLevel={3} />
            {earlierQuotes.length > 0 && (
              <div className={styles.quotesStrip}>
                {earlierQuotes.slice(0, 3).map((quote) => (
                  <QuoteCard key={quote.number} quote={quote} headingLevel={3} compact />
                ))}
              </div>
            )}
            <p className={styles.quotesMore}>
              <Link to={quotesPath}>All quotes →</Link>
            </p>
          </div>
        </Section>
      )}
    </>
  );
}
