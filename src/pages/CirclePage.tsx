import { circleIntro } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { CircleSignup } from '@/components/circle/CircleSignup';
import styles from './pages.module.css';

/**
 * Public information page for the IAV Circle. Membership itself (pricing,
 * checkout, accounts, gated content) is intentionally not built.
 *
 * For now the page is just the intro, with the email signup built into the
 * join button. The themes, events, benefits and resources sections were
 * removed; their content still lives in `src/content/circle.ts` and
 * `src/content/resources.ts`.
 */
export function CirclePage() {
  usePageMeta({ title: 'The IAV Circle', description: circleIntro.lead });

  return (
    <section className={styles.circleHero} aria-labelledby="circle-title">
      <div className="container">
        <p className="eyebrow">{circleIntro.eyebrow}</p>
        <h1 id="circle-title">{circleIntro.title}</h1>
        <p className={styles.lead}>{circleIntro.lead}</p>
        <CircleSignup />
      </div>
    </section>
  );
}
