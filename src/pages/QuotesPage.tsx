import { Link } from 'react-router-dom';
import { getQuotes } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import styles from './quotes.module.css';

/** Every quote in the series, newest first. Each card turns over in place. */
export function QuotesPage() {
  usePageMeta({ title: 'Quotes', description: 'Short quotes from Isha Vazquez, published as a series.' });
  const [newest, ...rest] = getQuotes();

  return (
    <>
      <div className={`container ${styles.intro}`}>
        <h1 className={styles.title}>Quotes</h1>
      </div>

      <div className={`container ${styles.list}`}>
        {newest ? (
          <>
            <QuoteCard quote={newest} headingLevel={2} />
            {rest.length > 0 && (
              <div className={styles.grid}>
                {rest.map((quote) => (
                  <QuoteCard key={quote.number} quote={quote} headingLevel={2} compact />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className={styles.empty}>The first quote is on its way.</p>
        )}
      </div>

      <div className={`container-narrow ${styles.footerNav}`}>
        <p className={styles.back}>
          <Link to="/articles">← All articles</Link>
        </p>
      </div>
    </>
  );
}
