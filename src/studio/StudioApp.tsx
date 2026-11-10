/**
 * /studio — where Isha (and Ryan) manage published content.
 *
 * Unlinked, noindexed and lazily loaded; the real gate is Firestore rules,
 * which only let the listed editor accounts read or write anything but the
 * published copies. An account that signs in without being an editor gets a
 * permission error on its first read and is told so.
 */
import { useCallback, useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { firebase, missingConfig, projectId } from './firebase';
import {
  bundledArticles,
  bundledQuotes,
  importBundled,
  loadArticles,
  loadPublishedMeta,
  loadQuotes,
  type ArticleRecord,
  type PublishedMeta,
  type QuoteRecord,
} from './data';
import { requestRebuild, type RebuildResult } from './rebuild';
import styles from './studio.module.css';

function useStudioHead() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Studio · IAV Circle';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => {
      document.title = prevTitle;
      robots.remove();
    };
  }, []);
}

export default function StudioApp() {
  useStudioHead();

  if (missingConfig.length) {
    return (
      <Shell>
        <section className={styles.panel}>
          <h1 className={styles.h1}>Studio isn’t configured on this deploy</h1>
          <p>Missing environment variables:</p>
          <ul className={styles.mono}>
            {missingConfig.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      </Shell>
    );
  }

  return <Authed />;
}

function Authed() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [signInError, setSignInError] = useState('');

  useEffect(() => onAuthStateChanged(firebase().auth, setUser), []);

  if (user === undefined) return <Shell />;

  if (!user) {
    return (
      <Shell>
        <section className={`${styles.panel} ${styles.signIn}`}>
          <h1 className={styles.h1}>Studio</h1>
          <button
            type="button"
            className={styles.primary}
            onClick={async () => {
              setSignInError('');
              try {
                await signInWithPopup(firebase().auth, new GoogleAuthProvider());
              } catch (err) {
                const code = err instanceof FirebaseError ? err.code : '';
                if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
                  setSignInError(`Sign-in failed${code ? ` (${code})` : ''}.`);
                }
              }
            }}
          >
            Sign in with Google
          </button>
          {signInError && <p className={styles.error}>{signInError}</p>}
        </section>
      </Shell>
    );
  }

  return <Dashboard user={user} />;
}

type Load =
  | { state: 'loading' }
  | { state: 'denied' }
  | { state: 'error'; message: string }
  | { state: 'ready'; articles: ArticleRecord[]; quotes: QuoteRecord[]; meta: PublishedMeta | null };

function Dashboard({ user }: { user: User }) {
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [rebuild, setRebuild] = useState<RebuildResult | 'working' | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [articles, quotes, meta] = await Promise.all([loadArticles(), loadQuotes(), loadPublishedMeta()]);
      setLoad({ state: 'ready', articles, quotes, meta });
    } catch (err) {
      if (err instanceof FirebaseError && err.code === 'permission-denied') setLoad({ state: 'denied' });
      else setLoad({ state: 'error', message: err instanceof Error ? err.message : String(err) });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const doRebuild = async () => {
    setRebuild('working');
    setRebuild(await requestRebuild(user));
  };

  return (
    <Shell user={user}>
      {load.state === 'loading' && <p className={styles.muted}>Loading…</p>}

      {load.state === 'denied' && (
        <section className={styles.panel}>
          <h1 className={styles.h1}>No access</h1>
          <p>{user.email} isn’t an editor on this site. Sign out and use the editor account.</p>
        </section>
      )}

      {load.state === 'error' && (
        <section className={styles.panel}>
          <h1 className={styles.h1}>Couldn’t load content</h1>
          <p className={styles.error}>{load.message}</p>
          <button type="button" className={styles.secondary} onClick={() => void refresh()}>
            Try again
          </button>
        </section>
      )}

      {load.state === 'ready' && (
        <>
          {!load.meta && (
            <ImportPanel
              user={user}
              onDone={async () => {
                await refresh();
                await doRebuild();
              }}
            />
          )}

          <section className={styles.panel} aria-labelledby="studio-articles">
            <h2 id="studio-articles" className={styles.h2}>
              Articles
            </h2>
            {load.articles.length === 0 ? (
              <p className={styles.muted}>No articles in Studio yet.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {load.articles.map((a) => (
                    <tr key={a.slug}>
                      <td>
                        <span className={styles.title}>{a.draft.title}</span>
                        <span className={styles.slug}>/articles/{a.slug}</span>
                      </td>
                      <td>
                        <StatusTag record={a} />
                      </td>
                      <td className={styles.muted}>{when(a.updatedAt?.toDate())}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="studio-quotes">
            <h2 id="studio-quotes" className={styles.h2}>
              Quotes
            </h2>
            {load.quotes.length === 0 ? (
              <p className={styles.muted}>No quotes in Studio yet.</p>
            ) : (
              <ul className={styles.list}>
                {load.quotes.map((q) => (
                  <li key={q.number}>
                    <span className={styles.title}>
                      No. {q.number} — {q.draft.beats.join(' ')}
                    </span>{' '}
                    <StatusTag record={q} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="studio-rebuild">
            <h2 id="studio-rebuild" className={styles.h2}>
              Live site
            </h2>
            <p className={styles.muted}>
              Published changes reach the site after a rebuild, which takes a minute or two.
              {load.meta?.updatedAt && <> Last publish: {when(load.meta.updatedAt.toDate())}.</>}
            </p>
            <button type="button" className={styles.secondary} disabled={rebuild === 'working'} onClick={doRebuild}>
              {rebuild === 'working' ? 'Requesting…' : 'Rebuild site'}
            </button>
            {rebuild && rebuild !== 'working' && (
              <p className={rebuild.ok ? styles.muted : styles.error} role="status">
                {rebuild.ok ? 'Rebuild started. The site updates when Netlify finishes.' : rebuild.message}
              </p>
            )}
          </section>
        </>
      )}
    </Shell>
  );
}

function ImportPanel({ user, onDone }: { user: User; onDone: () => Promise<void> }) {
  const [step, setStep] = useState<'idle' | 'confirm' | 'working'>('idle');
  const [error, setError] = useState('');

  return (
    <section className={`${styles.panel} ${styles.notice}`} aria-labelledby="studio-import">
      <h2 id="studio-import" className={styles.h2}>
        Not managed here yet
      </h2>
      <p>
        The site is building from the {bundledArticles.length} articles and {bundledQuotes.length} quote
        {bundledQuotes.length === 1 ? '' : 's'} in its code. Import them to edit and publish them from Studio; they’re
        copied as they are, so the site looks the same afterwards.
      </p>
      {step === 'idle' && (
        <button type="button" className={styles.primary} onClick={() => setStep('confirm')}>
          Import into Studio
        </button>
      )}
      {step !== 'idle' && (
        <div className={styles.row}>
          <button
            type="button"
            className={styles.primary}
            disabled={step === 'working'}
            onClick={async () => {
              setStep('working');
              setError('');
              try {
                await importBundled(user.email ?? '');
                await onDone();
              } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                setStep('confirm');
              }
            }}
          >
            {step === 'working' ? 'Importing…' : 'Import and rebuild'}
          </button>
          <button type="button" className={styles.secondary} disabled={step === 'working'} onClick={() => setStep('idle')}>
            Cancel
          </button>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}

function StatusTag({ record }: { record: { status: string; draft: unknown; published: unknown } }) {
  const unpublishedChanges =
    record.status === 'published' && JSON.stringify(record.draft) !== JSON.stringify(record.published);
  return (
    <span className={`${styles.tag} ${record.status === 'published' ? styles.tagLive : ''}`}>
      {record.status === 'published' ? 'Published' : 'Draft'}
      {unpublishedChanges && ' · unpublished edits'}
    </span>
  );
}

function Shell({ user, children }: { user?: User; children?: React.ReactNode }) {
  return (
    <div className={styles.studio}>
      <header className={styles.bar}>
        <span className={styles.brand}>
          IAV Circle <span className={styles.muted}>Studio</span>
        </span>
        <span className={styles.project} title="Firebase project this deploy reads and writes">
          {projectId}
        </span>
        {user && (
          <span className={styles.who}>
            <span className={styles.muted}>{user.email}</span>
            <button type="button" className={styles.link} onClick={() => void signOut(firebase().auth)}>
              Sign out
            </button>
          </span>
        )}
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

const when = (d?: Date) =>
  d ? d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
