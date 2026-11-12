/**
 * /studio — where Isha (and Ryan) write and publish articles and quotes.
 *
 * Unlinked, noindexed and lazily loaded; the real gate is Firestore rules,
 * which only let the listed editor accounts read or write anything but the
 * published copies. An account that signs in without being an editor gets a
 * permission error on its first read and is told so.
 */
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
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
import { StudioUser, useStudioUser as useUserFromContext } from './context';
import { ArticleEditor } from './ArticleEditor';
import { QuoteEditor } from './QuoteEditor';
import { StatusTag, errorText, when } from './ui';
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

  return (
    <StudioUser.Provider value={user}>
      <Shell user={user}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="articles/new" element={<ArticleEditor key="new" />} />
          <Route path="articles/:slug" element={<KeyedArticleEditor />} />
          <Route path="quotes/new" element={<QuoteEditor key="new" />} />
          <Route path="quotes/:number" element={<KeyedQuoteEditor />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Shell>
    </StudioUser.Provider>
  );
}

// Keyed by the address so moving between items starts each editor fresh.
function KeyedArticleEditor() {
  const { slug } = useParams();
  return <ArticleEditor key={slug} />;
}
function KeyedQuoteEditor() {
  const { number } = useParams();
  return <QuoteEditor key={number} />;
}

type Load =
  | { state: 'loading' }
  | { state: 'denied' }
  | { state: 'error'; message: string }
  | { state: 'ready'; articles: ArticleRecord[]; quotes: QuoteRecord[]; meta: PublishedMeta | null };

function Dashboard() {
  const [load, setLoad] = useState<Load>({ state: 'loading' });

  const refresh = useCallback(async () => {
    try {
      const [articles, quotes, meta] = await Promise.all([loadArticles(), loadQuotes(), loadPublishedMeta()]);
      setLoad({ state: 'ready', articles, quotes, meta });
    } catch (err) {
      if (err instanceof FirebaseError && err.code === 'permission-denied') setLoad({ state: 'denied' });
      else setLoad({ state: 'error', message: errorText(err) });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (load.state === 'loading') return <p className={styles.muted}>Loading…</p>;

  if (load.state === 'denied') {
    return (
      <section className={styles.panel}>
        <h1 className={styles.h1}>No access</h1>
        <p>This Google account isn’t an editor on this site. Sign out and use the editor account.</p>
      </section>
    );
  }

  if (load.state === 'error') {
    return (
      <section className={styles.panel}>
        <h1 className={styles.h1}>Couldn’t load content</h1>
        <p className={styles.error}>{load.message}</p>
        <button type="button" className={styles.secondary} onClick={() => void refresh()}>
          Try again
        </button>
      </section>
    );
  }

  const setUp = Boolean(load.meta);

  return (
    <>
      {setUp ? (
        <>
          <section className={styles.panel} aria-labelledby="studio-articles">
            <div className={styles.panelHead}>
              <h2 id="studio-articles" className={styles.h2}>
                Articles
              </h2>
              <Link to="/studio/articles/new" className={styles.primary}>
                New article
              </Link>
            </div>
            {load.articles.length === 0 ? (
              <p className={styles.muted}>No articles yet.</p>
            ) : (
              <ul className={styles.items}>
                {load.articles.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/studio/articles/${a.slug}`} className={styles.item}>
                      <span className={styles.itemMain}>
                        <span className={styles.title}>{a.draft.title || 'Untitled'}</span>
                        <span className={styles.slug}>/articles/{a.slug}</span>
                      </span>
                      <StatusTag record={a} />
                      <span className={styles.itemWhen}>{when(a.updatedAt?.toDate())}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="studio-quotes">
            <div className={styles.panelHead}>
              <h2 id="studio-quotes" className={styles.h2}>
                Quotes
              </h2>
              <Link to="/studio/quotes/new" className={styles.primary}>
                New quote
              </Link>
            </div>
            {load.quotes.length === 0 ? (
              <p className={styles.muted}>No quotes yet.</p>
            ) : (
              <ul className={styles.items}>
                {load.quotes.map((q) => (
                  <li key={q.number}>
                    <Link to={`/studio/quotes/${q.number}`} className={styles.item}>
                      <span className={styles.itemMain}>
                        <span className={styles.title}>
                          No. {q.number} — {q.draft.beats.join(' ') || 'Untitled'}
                        </span>
                      </span>
                      <StatusTag record={q} />
                      <span className={styles.itemWhen}>{when(q.updatedAt?.toDate())}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <section className={`${styles.panel} ${styles.notice}`}>
          <h2 className={styles.h2}>Not set up yet</h2>
          <p>Studio needs a one-time setup by Ryan before articles can be written here.</p>
        </section>
      )}

      <DeveloperTools meta={load.meta} onImported={refresh} />
    </>
  );
}

/** Ryan's controls, folded away at the bottom. */
function DeveloperTools({ meta, onImported }: { meta: PublishedMeta | null; onImported: () => Promise<void> }) {
  const [rebuild, setRebuild] = useState<RebuildResult | 'working' | null>(null);
  const [importStep, setImportStep] = useState<'idle' | 'confirm' | 'working'>('idle');
  const [importError, setImportError] = useState('');
  const user = useUserFromContext();

  const doRebuild = async () => {
    setRebuild('working');
    setRebuild(await requestRebuild(user));
  };

  return (
    <details className={styles.devTools} open={!meta}>
      <summary>Developer</summary>
      <dl className={styles.facts}>
        <dt>Firebase project</dt>
        <dd className={styles.mono}>{projectId}</dd>
        <dt>Last publish</dt>
        <dd>
          {meta?.updatedAt ? `${when(meta.updatedAt.toDate())}${meta.updatedBy ? ` by ${meta.updatedBy}` : ''}` : '—'}
        </dd>
        <dt>Built from Firestore</dt>
        <dd>{meta?.managed?.length ? meta.managed.join(', ') : 'nothing yet (bundled content)'}</dd>
      </dl>

      {!meta && (
        <div className={styles.devBlock}>
          <p>
            Import the {bundledArticles.length} bundled articles and {bundledQuotes.length} quote
            {bundledQuotes.length === 1 ? '' : 's'} as published records, then rebuild. The site should look the same
            afterwards.
          </p>
          {importStep === 'idle' ? (
            <button type="button" className={styles.secondary} onClick={() => setImportStep('confirm')}>
              Import bundled content…
            </button>
          ) : (
            <div className={styles.row}>
              <button
                type="button"
                className={styles.primary}
                disabled={importStep === 'working'}
                onClick={async () => {
                  setImportStep('working');
                  setImportError('');
                  try {
                    await importBundled(user.email ?? '');
                    await onImported();
                    await doRebuild();
                  } catch (err) {
                    setImportError(errorText(err));
                    setImportStep('confirm');
                  }
                }}
              >
                {importStep === 'working' ? 'Importing…' : 'Import and rebuild'}
              </button>
              <button type="button" className={styles.quiet} disabled={importStep === 'working'} onClick={() => setImportStep('idle')}>
                Cancel
              </button>
            </div>
          )}
          {importError && <p className={styles.error}>{importError}</p>}
        </div>
      )}

      <div className={styles.devBlock}>
        <button type="button" className={styles.secondary} disabled={rebuild === 'working'} onClick={doRebuild}>
          {rebuild === 'working' ? 'Requesting…' : 'Rebuild site'}
        </button>
        {rebuild && rebuild !== 'working' && (
          <p className={rebuild.ok ? styles.muted : styles.error} role="status">
            {rebuild.ok ? 'Rebuild requested.' : rebuild.message}
          </p>
        )}
      </div>
    </details>
  );
}

function Shell({ user, children }: { user?: User; children?: ReactNode }) {
  return (
    <div className={styles.studio}>
      <header className={styles.bar}>
        <Link to="/studio" className={styles.brand}>
          IAV Circle <span className={styles.muted}>Studio</span>
        </Link>
        {user && (
          <span className={styles.who}>
            <a href="/" target="_blank" rel="noopener noreferrer" className={styles.link}>
              View site
            </a>
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

