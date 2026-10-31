import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  buildCircleStarterPages,
  circleStarterGate,
  circleStarterPdfUrl,
  type CircleStarterContent,
  type CircleStarterDay,
} from '@/content';
import { clearToken, fetchKitContent, readStoredToken, storeToken, verifyOnce } from '@/services/kit';
import { useKitRequest } from '@/components/circleStarter/useKitRequest';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Section } from '@/components/ui/Section';
import { ButtonLink, buttonClass } from '@/components/ui/Button';
import { JoinCircleButton } from '@/components/circle/JoinCircleButton';
import { JournalLines } from '@/components/circleStarter/JournalField';
import styles from './CircleStarterPage.module.css';

const DAY_TONES = ['surface', 'blush', 'mist', 'lavender'] as const;

type AccessState = 'loading' | 'gated' | 'expired' | 'error' | 'ready';

/**
 * Resolves the reader's access: a token arriving in the emailed link is kept
 * for next time, reported once so Isha hears about a verified address, then
 * wiped from the address bar. Everything after that is just "do we have
 * content yet".
 */
function useKitAccess() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlToken = searchParams.get('t');
  const [token] = useState<string | null>(() => urlToken ?? readStoredToken());
  const [content, setContent] = useState<CircleStarterContent | null>(null);
  const [state, setState] = useState<AccessState>(token ? 'loading' : 'gated');

  useEffect(() => {
    if (!urlToken) return;
    storeToken(urlToken);
    verifyOnce(urlToken);
    const next = new URLSearchParams(searchParams);
    next.delete('t');
    setSearchParams(next, { replace: true });
  }, [urlToken, searchParams, setSearchParams]);

  useEffect(() => {
    if (!token) {
      setState('gated');
      return;
    }
    let cancelled = false;
    setState('loading');
    void fetchKitContent(token).then((result) => {
      if (cancelled) return;
      if (result.status === 'ok') {
        setContent(result.content);
        setState('ready');
      } else if (result.status === 'unauthorized') {
        clearToken();
        setState('expired');
      } else {
        setState('error');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { state, content, token };
}

/** The public face of the kit: what someone sees without a valid link. */
function KitGate({ notice }: { notice?: string }) {
  const { email, setEmail, status, notice: formNotice, submit } = useKitRequest();
  const shown = formNotice || notice || '';

  return (
    <div className={styles.gate}>
      <p className="eyebrow">{circleStarterGate.eyebrow}</p>
      <h1 id="starter-page-title" className={styles.coverTitle}>
        {circleStarterGate.title}
      </h1>
      <p className={styles.coverSubtitle}>{circleStarterGate.subtitle}</p>
      <p className={styles.gateLead}>{circleStarterGate.lead}</p>

      <form className={styles.gateForm} onSubmit={submit} noValidate>
        <label className="visually-hidden" htmlFor="kit-gate-email">
          Your email address
        </label>
        <input
          id="kit-gate-email"
          className={styles.gateInput}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === 'error'}
        />
        <button type="submit" className={buttonClass('primary')} disabled={status === 'sending'}>
          {status === 'sending' ? circleStarterGate.sending : circleStarterGate.cta}
        </button>
      </form>

      <p className={styles.gateNotice} role="status" aria-live="polite" data-tone={status}>
        {shown}
      </p>
    </div>
  );
}

/** One day's page — keyed by day so each question's draft stays with its day. */
function DayPage({ day }: { day: CircleStarterDay }) {
  return (
    <div className={styles.day}>
      <p className={styles.dayOf}>Day {day.number} of 7</p>
      <h2 id="starter-page-title" className={styles.dayTheme}>
        {day.theme}
      </h2>
      <p className={styles.dayLead}>{day.lead}</p>
      <p className={styles.privacyNote}>
        What you write here stays in this browser only — it’s never sent anywhere or saved on our end.
      </p>
      <ol className={styles.dayQuestions}>
        {day.questions.map((q, i) => (
          <li key={q}>
            <p className={styles.questionText}>{q}</p>
            <JournalLines storageKey={`circle-starter:day-${day.number}:q${i}`} ariaLabel={q} minRows={3} />
          </li>
        ))}
      </ol>
      <div className={styles.promptRow}>
        <label className={styles.promptLabel} htmlFor={`day-${day.number}-prompt`}>
          {day.prompt}
        </label>
        <JournalLines
          key={`day-${day.number}-prompt`}
          id={`day-${day.number}-prompt`}
          storageKey={`circle-starter:day-${day.number}:prompt`}
          ariaLabel={day.prompt}
          minRows={1}
        />
      </div>
    </div>
  );
}

function PageNumbers({ current, total }: { current: number; total: number }) {
  return (
    <ol className={styles.pageNumbers}>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <li key={n}>
          {n === current ? (
            <span className={styles.pageNumberCurrent} aria-current="page">
              {n}
            </span>
          ) : (
            <Link to={`/circle-starter/${n}`} className={styles.pageNumber}>
              {n}
            </Link>
          )}
        </li>
      ))}
    </ol>
  );
}

function CircleStarterNav({ current, total }: { current: number; total: number }) {
  const prev = current > 1 ? current - 1 : null;
  const next = current < total ? current + 1 : null;
  return (
    <nav className={`container ${styles.nav}`} aria-label="Journal pages">
      <div className={styles.navButtons}>
        {prev ? (
          <ButtonLink to={`/circle-starter/${prev}`} variant="ghost">
            ← Back
          </ButtonLink>
        ) : (
          <span />
        )}
        {next ? (
          <ButtonLink to={`/circle-starter/${next}`} variant="primary">
            Next →
          </ButtonLink>
        ) : (
          <span />
        )}
      </div>
      <PageNumbers current={current} total={total} />
    </nav>
  );
}

/**
 * "The Circle Starter" — the free 7-day journal promised on the home page
 * hero, a page at a time like flipping through the printed version.
 *
 * The prose arrives from `/api/kit-content` against the token from the
 * emailed link; without one, this route is the sign-up gate and nothing more.
 * Answers people type stay in their own browser (see JournalField).
 */
export function CircleStarterPage() {
  const { page } = useParams();
  const { state, content, token } = useKitAccess();
  usePageMeta({ title: circleStarterGate.title, description: circleStarterGate.subtitle });

  if (state === 'loading') {
    return (
      <Section tone="plain" className={styles.page}>
        <div className={`container-narrow ${styles.pageInner}`}>
          <p className={styles.loading} role="status">
            {circleStarterGate.loading}
          </p>
        </div>
      </Section>
    );
  }

  if (state !== 'ready' || !content || !token) {
    const notice =
      state === 'expired' ? circleStarterGate.expired : state === 'error' ? circleStarterGate.failed : undefined;
    return (
      <Section tone="plain" labelledBy="starter-page-title" className={styles.page}>
        <div className={`container-narrow ${styles.pageInner}`}>
          <KitGate notice={notice} />
        </div>
      </Section>
    );
  }

  const pages = buildCircleStarterPages(content);
  const total = pages.length;
  const parsed = Number(page);
  const n = Number.isInteger(parsed) && parsed >= 1 && parsed <= total ? parsed : 1;
  const current = pages[n - 1];
  const { welcome, howToUse, closing } = content;
  const pdfUrl = circleStarterPdfUrl(token);

  const tone =
    current.kind === 'cover'
      ? 'plain'
      : current.kind === 'welcome'
        ? 'surface'
        : current.kind === 'closing'
          ? 'navy'
          : DAY_TONES[(current.day.number - 1) % DAY_TONES.length];

  return (
    <>
      <Section tone={tone} labelledBy="starter-page-title" className={styles.page}>
        <div className={`container-narrow ${styles.pageInner}`}>
          {current.kind === 'cover' && (
            <div className={styles.cover}>
              <p className="eyebrow">{content.eyebrow}</p>
              <h1 id="starter-page-title" className={styles.coverTitle}>
                {content.title}
              </h1>
              <p className={styles.coverSubtitle}>{content.subtitle}</p>
              <p className={styles.byline}>{content.byline}</p>
              <a className={`${buttonClass('blush')} ${styles.downloadBtn}`} href={pdfUrl}>
                Download the PDF
              </a>
            </div>
          )}

          {current.kind === 'welcome' && (
            <div className={styles.welcome}>
              <h2 id="starter-page-title" className={styles.welcomeGreeting}>
                {welcome.greeting}
              </h2>
              {welcome.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <h3 className={styles.howtoTitle}>{howToUse.title}</h3>
              <ul className={styles.howtoList}>
                {howToUse.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>{howToUse.outro}</p>
              <p className={styles.signoff}>{howToUse.signoff}</p>
            </div>
          )}

          {/*
           * key forces a full remount per day — otherwise React Router keeps
           * this same component instance across Back/Next (only the `day`
           * prop changes), and any field here that isn't inside a keyed list
           * (the prompt, unlike the three questions) would keep whatever was
           * typed on a DIFFERENT day instead of resetting for this one.
           */}
          {current.kind === 'day' && <DayPage key={current.day.number} day={current.day} />}

          {current.kind === 'closing' && (
            <div className={styles.closing}>
              <h2 id="starter-page-title" className={styles.closingTitle}>
                {closing.title}
              </h2>
              {closing.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>{closing.circlePitch.intro}</p>
              <ul className={styles.closingBullets}>
                {closing.circlePitch.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <h3 className={styles.keepGoingTitle}>{closing.keepGoing.title}</h3>
              <div className={styles.closingCtas}>
                <JoinCircleButton variant="blush" />
                <ButtonLink to="/podcast" variant="mauve">
                  {closing.keepGoing.listenTitle}
                </ButtonLink>
                <a className={buttonClass('light')} href={pdfUrl}>
                  Download the PDF
                </a>
              </div>
              <p className={styles.shareNote}>
                <strong>{closing.keepGoing.shareTitle}:</strong> {closing.keepGoing.shareNote}
              </p>
              <p className={styles.signoff}>{closing.signoff}</p>
              <p className={styles.disclaimer}>{closing.disclaimer}</p>
            </div>
          )}
        </div>
      </Section>
      <CircleStarterNav current={n} total={total} />
    </>
  );
}
