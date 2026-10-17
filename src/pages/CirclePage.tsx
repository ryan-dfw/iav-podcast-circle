import { circleIntro, nominateCopy } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { CircleSignup } from '@/components/circle/CircleSignup';
import { SampleButton } from '@/components/ui/SampleButton';
import styles from './pages.module.css';

/**
 * Public information page for the IAV Circle. Membership itself (pricing,
 * checkout, accounts, gated content) is intentionally not built — the join
 * CTA (JoinCircleButton) points at `integrations.circle.joinUrl` once one exists.
 *
 * For now the page is just the intro, with the email signup built into the join button, then a guest nomination button (not wired up). The themes, events,
 * benefits and resources sections were removed; their content still lives in
 * `src/content/circle.ts` and `src/content/resources.ts`.
 */
export function CirclePage() {
  usePageMeta({ title: 'The IAV Circle', description: circleIntro.lead });

  return (
    <>
      <section className={styles.circleHero} aria-labelledby="circle-title">
        <div className="container">
          <div className={styles.circleMain}>
            <p className="eyebrow">{circleIntro.eyebrow}</p>
            <h1 id="circle-title">{circleIntro.title}</h1>
            <p className={styles.lead}>{circleIntro.lead}</p>
            <CircleSignup />
          </div>

          <div className={styles.circleNominate}>
            <p className="eyebrow">{nominateCopy.eyebrow}</p>
            <h2>{nominateCopy.title}</h2>
            <p className={styles.lead}>{nominateCopy.body}</p>
            <SampleButton showNote={false}>{nominateCopy.cta}</SampleButton>
          </div>
        </div>
      </section>
    </>
  );
}
