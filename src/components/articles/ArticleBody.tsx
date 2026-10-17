import type { ArticleBlock, ArticleSection } from '@/content/types';
import { RichText } from '@/lib/RichText';
import styles from './ArticleBody.module.css';

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'paragraph':
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
              <div key={j} className={i === 0 && j === 0 ? styles.first : undefined}>
                <Block block={block} />
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
