/**
 * `?preview=<slug>` on any page: an editor sees that article's saved draft in
 * place of the live version (or added, if it isn't live yet), rendered by the
 * real site. Loaded only when the parameter is present, before the app
 * renders; visitors and signed-out editors get the normal site.
 */
import { doc, getDoc } from 'firebase/firestore';
import { cms } from '@/content/cms/snapshot';
import { getArticles } from '@/content';
import type { Article } from '@/content/types';
import { firebase, missingConfig } from './firebase';

function banner(text: string, slug?: string) {
  const bar = document.createElement('div');
  bar.setAttribute('role', 'status');
  bar.style.cssText =
    'position:fixed;inset:auto 0 0 0;z-index:9999;padding:.6rem 1rem;background:#0a1a2f;color:#f7f4ef;' +
    'font:500 .9rem/1.4 "Inter Variable",system-ui,sans-serif;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap';
  const label = document.createElement('span');
  label.textContent = text;
  bar.append(label);
  if (slug) {
    const back = document.createElement('a');
    back.href = `/studio/articles/${encodeURIComponent(slug)}`;
    back.textContent = 'Back to the editor';
    back.style.color = '#f4c9d8';
    bar.append(back);
  }
  document.body.append(bar);
}

export async function applyPreview(slug: string): Promise<void> {
  if (missingConfig.length) return;
  const { auth, db } = firebase();
  await auth.authStateReady();
  if (!auth.currentUser) {
    banner('Sign in to Studio to see draft previews. Showing the live site.');
    return;
  }

  let draft: Article | undefined;
  try {
    const snap = await getDoc(doc(db, 'articles', slug));
    draft = snap.exists() ? (snap.data().draft as Article) : undefined;
  } catch {
    banner('This account can’t see drafts. Showing the live site.');
    return;
  }
  if (!draft) {
    banner('There’s no draft with that address. Showing the live site.');
    return;
  }

  const others = getArticles().filter((a) => a.slug !== slug);
  cms.articles = [...others, draft];
  if (!cms.managed.includes('articles')) cms.managed = [...cms.managed, 'articles'];
  banner('Draft preview — visitors don’t see this version until it’s published.', slug);
}
