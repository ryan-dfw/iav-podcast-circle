import type { EpisodeBlock, EpisodeSection } from '@/content/types';
import { RichText } from '@/lib/RichText';
import styles from './EpisodeBlocks.module.css';

function Block({ block }: { block: EpisodeBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className={styles.paragraph}>
          <RichText value={block.text} />
        </p>
      );
    case 'quote':
      return (
        <figure className={`${styles.quote} ${styles[block.tone ?? 'cream']}`}>
          <blockquote>
            <p>“{block.text}”</p>
          </blockquote>
          {block.attribution && <figcaption>— {block.attribution}</figcaption>}
        </figure>
      );
    case 'note':
      return (
        <p className={styles.note}>
          <strong>{block.label}</strong> <RichText value={block.text} />
        </p>
      );
  }
}

/** Renders an episode's editorial sections from structured content. */
export function EpisodeSections({ sections }: { sections: EpisodeSection[] }) {
  return (
    <>
      {sections.map((section, i) => {
        const id = `section-${i + 1}`;
        return (
          <section key={id} className={styles.section} aria-labelledby={id}>
            <h2 id={id} className={styles.heading}>
              {section.heading}
            </h2>
            {section.blocks.map((block, j) => (
              <Block key={j} block={block} />
            ))}
          </section>
        );
      })}
    </>
  );
}
