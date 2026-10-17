import { podcastCopy } from '@/content';
import styles from './HumanCapsule.module.css';

/** Navy statement band: what the podcast is for. */
export function HumanCapsule() {
  const { capsule } = podcastCopy;
  return (
    <section className={styles.section} aria-labelledby="capsule-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{capsule.eyebrow}</p>
        <h2 id="capsule-title" className={styles.title}>
          {capsule.title}
        </h2>
        <p className={styles.body}>{capsule.body}</p>
      </div>
    </section>
  );
}
