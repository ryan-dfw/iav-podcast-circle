import { bookCopy as book } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { SampleBadge } from '@/components/ui/Section';
import { BookSignup } from '@/components/book/BookSignup';
import { buttonClass } from '@/components/ui/Button';
import styles from './BookPage.module.css';

export function BookPage() {
  usePageMeta({ title: `${book.title} — The Book`, description: book.subtitle });

  return (
    <>
      <section className={`container ${styles.layout}`} aria-labelledby="book-title">
        <img
          className={styles.cover}
          src={book.cover.src}
          srcSet={`${book.cover.thumb.src} ${book.cover.thumb.width}w, ${book.cover.src} ${book.cover.width}w`}
          sizes="(min-width: 52rem) 24rem, 80vw"
          width={book.cover.width}
          height={book.cover.height}
          alt={book.cover.alt}
          decoding="async"
        />

        <div className={styles.text}>
          <p className="eyebrow">{book.eyebrow}</p>
          <h1 id="book-title" className={styles.title}>
            {book.title}
          </h1>
          <p className={styles.subtitle}>{book.subtitle}</p>
          <p className={styles.author}>By {book.author}</p>
          {book.sample && (
            <p>
              <SampleBadge />
            </p>
          )}
          {book.description.map((p) => (
            <p key={p} className={styles.description}>
              {p}
            </p>
          ))}
          <dl className={styles.details}>
            {book.details.map((d) => (
              <div key={d.label}>
                <dt>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
          {/* No purchase link yet — crossed out like the other unimplemented actions. */}
          <button type="button" className={`${buttonClass('primary')} unimplemented-x`} aria-disabled="true">
            {book.cta}
          </button>
        </div>
      </section>
      <BookSignup />
    </>
  );
}
