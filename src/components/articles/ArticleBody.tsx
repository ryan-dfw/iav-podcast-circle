import type { ArticleBlock, ArticleSection, RichText as RichTextValue } from '@/content/types';
import { RichText } from '@/lib/RichText';
import { defaultSrc, srcSetFor } from '@/lib/image';
import { site } from '@/config/site';
import styles from './ArticleBody.module.css';

/**
 * Splits off a literal first character for the drop cap, so punctuation
 * attached to it (e.g. the apostrophe in "I've") is never enlarged along
 * with the letter the way CSS `::first-letter` would do it.
 */
function splitFirstChar(text: RichTextValue): [string, RichTextValue] {
  if (typeof text === 'string') {
    return [text.charAt(0), text.slice(1)];
  }
  const [firstRun, ...restRuns] = text;
  if (typeof firstRun === 'string') {
    const rest = firstRun.slice(1);
    return [firstRun.charAt(0), rest ? [rest, ...restRuns] : restRuns];
  }
  // First run isn't plain text (starts with emphasis/a link) — skip the drop cap.
  return ['', text];
}

function Block({ block, dropcap }: { block: ArticleBlock; dropcap?: boolean }) {
  switch (block.type) {
    case 'paragraph':
      if (dropcap) {
        const [first, rest] = splitFirstChar(block.text);
        return (
          <p className={styles.paragraph}>
            {first && <span className={styles.dropcap}>{first}</span>}
            <RichText value={rest} />
          </p>
        );
      }
      return (
        <p className={styles.paragraph}>
          <RichText value={block.text} />
        </p>
      );
    case 'pull':
      return (
        <blockquote className={styles.pull}>
          <p>“{block.text}”</p>
        </blockquote>
      );
    case 'quote':
      return (
        <figure className={styles.quote}>
          <blockquote>
            <p>“{block.text}”</p>
          </blockquote>
          {block.attribution && <figcaption>— {block.attribution}</figcaption>}
        </figure>
      );
    case 'note':
      return (
        <p className={styles.note}>
          {block.label && <strong>{block.label} </strong>}
          <RichText value={block.text} />
        </p>
      );
    case 'ask':
      return <p className={styles.ask}>{block.text}</p>;
    case 'mentor':
      return (
        <blockquote className={styles.mentor}>
          <p>{block.text}</p>
          {block.attribution && <cite>— {block.attribution}</cite>}
        </blockquote>
      );
    case 'toc':
      return (
        <nav className={styles.toc} aria-label="Stages in this essay">
          <h3 className={styles.tocTitle}>{block.title}</h3>
          <ol>
            {block.items.map((item) => (
              <li key={item.label} className={item.current ? styles.tocHere : undefined}>
                {item.label}
                {item.current && <span className={styles.tocBadge}>I am here</span>}
              </li>
            ))}
          </ol>
        </nav>
      );
    case 'signature':
      return (
        <div className={styles.signature}>
          <img
            src={defaultSrc(site.host.paintedPortrait)}
            srcSet={srcSetFor(site.host.paintedPortrait)}
            sizes="4rem"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className={styles.signatureLine}>{block.line}</p>
            <p className={styles.signatureName}>{block.name}</p>
          </div>
        </div>
      );
    case 'figure':
      return (
        <figure className={styles.inlineFigure}>
          <img
            src={defaultSrc(block.image)}
            srcSet={srcSetFor(block.image)}
            sizes="(max-width: 48rem) 100vw, 50rem"
            alt={block.image.alt}
            width={block.image.width}
            height={block.image.height}
            loading="lazy"
            decoding="async"
          />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
  }
}

/** Renders an article's sections. The very first paragraph gets the drop cap. */
export function ArticleBody({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className={styles.body}>
      {sections.map((section, i) => {
        const id = `article-section-${i + 1}`;
        return (
          <section key={id} className={styles.section} aria-labelledby={section.heading ? id : undefined}>
            {section.heading && (
              <h2 id={id} className={styles.heading}>
                {section.heading}
              </h2>
            )}
            {section.blocks.map((block, j) => (
              <div key={j}>
                <Block block={block} dropcap={i === 0 && j === 0} />
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
