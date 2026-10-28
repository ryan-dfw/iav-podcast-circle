import { useId, useState } from 'react';
import type { Quote } from '@/content/types';
import { formatDate } from '@/lib/format';
import { QuoteStars } from './QuoteStars';
import { QuoteShareRow } from './QuoteShareRow';
import styles from './QuoteCard.module.css';

/** Splits trailing punctuation off a beat so it can be set in the accent colour. */
function splitPunctuation(beat: string): [string, string] {
  const match = beat.match(/[.!?…]+$/);
  if (!match) return [beat, ''];
  return [beat.slice(0, -match[0].length), match[0]];
}

interface Props {
  quote: Quote;
  /** h2 under a section heading, h3 when nested deeper. */
  headingLevel?: 2 | 3;
  /** Smaller setting for the three cards beneath the lead one. */
  compact?: boolean;
}

/**
 * A quote, shown as a card that crossfades in place to reveal the note behind
 * it — rather than linking away to a page of its own, which was far more
 * structure than a few lines of text deserves.
 */
export function QuoteCard({ quote, headingLevel = 2, compact }: Props) {
  const [flipped, setFlipped] = useState(false);
  const H = `h${headingLevel}` as const;
  const backId = useId();
  const hasBack = Boolean(quote.thought?.length || quote.tryIt);

  return (
    <article className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <div className={styles.inner}>
        <div className={styles.face} data-active={!flipped} inert={flipped}>
          <QuoteStars seed={quote.number} />
          <div className={styles.content}>
            {quote.sample && <p className={styles.sample}>Placeholder — not Isha’s words</p>}
            {quote.label && <p className={styles.label}>{quote.label}</p>}
            <p className={styles.number}>No. {quote.number}</p>
            <span className={styles.mark} aria-hidden="true">
              “
            </span>
            {quote.beats.length > 0 && (
              <H className={styles.beats}>
                {quote.beats.map((beat, i) => {
                  const [word, punctuation] = splitPunctuation(beat);
                  return (
                    <span key={`${beat}-${i}`} className={styles.beat}>
                      {word}
                      {punctuation && <span className={styles.dot}>{punctuation}</span>}
                    </span>
                  );
                })}
              </H>
            )}
            {quote.rest && <p className={styles.rest}>{quote.rest}</p>}
            <p className={styles.signature}>— Isha</p>
          </div>
        </div>

        {hasBack && (
          <div className={`${styles.face} ${styles.back}`} id={backId} data-active={flipped} inert={!flipped}>
            <QuoteStars seed={quote.number + 1000} />
            <div className={styles.content}>
              {quote.thought && quote.thought.length > 0 && (
                <>
                  <p className={styles.backTitle}>The thought behind it</p>
                  {quote.thought.map((paragraph) => (
                    <p key={paragraph} className={styles.thought}>
                      {paragraph}
                    </p>
                  ))}
                </>
              )}
              {quote.tryIt && (
                <div className={styles.tryIt}>
                  <p className={styles.tryItLabel}>Try it today</p>
                  <p className={styles.tryItText}>{quote.tryIt}</p>
                </div>
              )}
              <p className={styles.backDate}>{formatDate(quote.publishedOn)}</p>
            </div>
          </div>
        )}
      </div>

      {hasBack && (
        <button
          type="button"
          className={styles.flip}
          onClick={() => setFlipped((on) => !on)}
          aria-expanded={flipped}
          aria-controls={backId}
          aria-label={
            flipped ? `Show quote No. ${quote.number} again` : `Read the thought behind quote No. ${quote.number}`
          }
        />
      )}

      <div className={styles.share}>
        <QuoteShareRow quote={quote} compact={compact} />
      </div>
    </article>
  );
}
