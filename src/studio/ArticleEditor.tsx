import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Article } from '@/content/types';
import {
  deleteArticle,
  loadArticle,
  loadArticles,
  publishArticle,
  saveArticleDraft,
  unpublishArticle,
  type ArticleRecord,
} from './data';
import {
  SLUG_PATTERN,
  articleProblems,
  emptyArticleForm,
  fromArticleForm,
  slugify,
  toArticleForm,
  type ArticleForm,
} from './model';
import { BlockEditor, MarkdownImport } from './BlockEditor';
import { ImageField } from './ImageField';
import { requestRebuild } from './rebuild';
import { useStudioUser } from './context';
import { ConfirmButton, NoticeLine, StatusTag, errorText, timeOnly, useLeaveGuard, type Notice } from './ui';
import styles from './studio.module.css';

export function ArticleEditor() {
  const { slug: routeSlug } = useParams();
  const isNew = routeSlug === undefined;
  const user = useStudioUser();
  const navigate = useNavigate();

  const [record, setRecord] = useState<ArticleRecord | null>(null);
  const [form, setForm] = useState<ArticleForm | null>(isNew ? emptyArticleForm() : null);
  const [saved, setSaved] = useState<string | null>(isNew ? '' : null);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [categories, setCategories] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [problems, setProblems] = useState<string[]>([]);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    if (isNew) return;
    try {
      const r = await loadArticle(routeSlug);
      if (!r) {
        setLoadError('There’s no article at this address.');
        return;
      }
      const f = toArticleForm(r.draft);
      setRecord(r);
      setForm(f);
      setSaved(JSON.stringify(fromArticleForm(f, r.draft)));
    } catch (err) {
      setLoadError(errorText(err));
    }
  }, [isNew, routeSlug]);

  useEffect(() => {
    void load();
    loadArticles()
      .then((all) => setCategories([...new Set(all.map((a) => a.draft.category).filter(Boolean))]))
      .catch(() => {});
  }, [load]);

  const article: Article | null = useMemo(
    () => (form ? fromArticleForm(form, record?.draft) : null),
    [form, record],
  );
  const dirty = article !== null && JSON.stringify(article) !== saved;
  useLeaveGuard(dirty);

  if (loadError) {
    return (
      <section className={styles.panel}>
        <p className={styles.error}>{loadError}</p>
        <Link to="/studio">Back to all content</Link>
      </section>
    );
  }
  if (!form || !article) return <p className={styles.muted}>Loading…</p>;

  const isLive = Boolean(record?.published);
  const set = (patch: Partial<ArticleForm>) => setForm((f) => (f ? { ...f, ...patch } : f));

  /** Saves the draft; returns the slug it's stored under, or null on failure. */
  const save = async (): Promise<string | null> => {
    const draft = fromArticleForm(form, record?.draft);
    if (!draft.slug) {
      setNotice({ kind: 'error', text: 'Add a title (or a web address) before saving.' });
      return null;
    }
    if (!SLUG_PATTERN.test(draft.slug) || draft.slug === 'quotes') {
      setNotice({ kind: 'error', text: 'The web address can only use lowercase letters, numbers and dashes.' });
      return null;
    }
    if (!dirty && record) return draft.slug;
    await saveArticleDraft(draft, user.email ?? '', record?.slug);
    const fresh = await loadArticle(draft.slug);
    setRecord(fresh);
    setSaved(JSON.stringify(draft));
    if (draft.slug !== routeSlug) navigate(`/studio/articles/${draft.slug}`, { replace: true });
    return draft.slug;
  };

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setNotice(null);
    try {
      await action();
    } catch (err) {
      setNotice({ kind: 'error', text: errorText(err) });
    } finally {
      setBusy(false);
    }
  };

  const onSave = () =>
    run(async () => {
      if (await save()) setNotice({ kind: 'info', text: `Saved at ${timeOnly(new Date())}.` });
    });

  const onPreview = () => {
    // Opened synchronously so the browser treats it as a click, then pointed at the page once saved.
    const tab = window.open('about:blank', '_blank');
    void run(async () => {
      const slug = await save();
      if (!slug) {
        tab?.close();
        return;
      }
      const url = `/articles/${slug}?preview=${encodeURIComponent(slug)}`;
      if (tab) tab.location.href = url;
      else window.location.href = url;
    });
  };

  const onPublish = () =>
    run(async () => {
      const found = articleProblems(article);
      setProblems(found);
      if (found.length) return;
      const slug = await save();
      if (!slug) return;
      await publishArticle(slug, user.email ?? '');
      setRecord(await loadArticle(slug));
      const rebuilt = await requestRebuild(user);
      setNotice(
        rebuilt.ok
          ? { kind: 'info', text: 'Published. The live page updates in about two minutes.' }
          : { kind: 'error', text: `Published, but the site didn’t rebuild: ${rebuilt.message}` },
      );
    });

  const onUnpublish = () =>
    run(async () => {
      if (!record) return;
      await unpublishArticle(record.slug, user.email ?? '');
      setRecord(await loadArticle(record.slug));
      const rebuilt = await requestRebuild(user);
      setNotice(
        rebuilt.ok
          ? { kind: 'info', text: 'Taken off the site. It disappears from the live site in about two minutes.' }
          : { kind: 'error', text: `Unpublished, but the site didn’t rebuild: ${rebuilt.message}` },
      );
    });

  const onDelete = () =>
    run(async () => {
      if (record) await deleteArticle(record.slug);
      setSaved(JSON.stringify(article));
      navigate('/studio');
    });

  const publishLabel = isLive ? 'Publish changes' : 'Publish';
  const canPublish = !isLive || dirty || (record ? JSON.stringify(record.draft) !== JSON.stringify(record.published) : true);

  return (
    <>
      <div className={styles.editorBar}>
        <Link
          to="/studio"
          className={styles.back}
          onClick={(e) => {
            if (dirty && !window.confirm('Leave without saving your changes?')) e.preventDefault();
          }}
        >
          ← All content
        </Link>
        <StatusTag record={record} />
        {dirty && <span className={styles.muted}>Unsaved changes</span>}
        <span className={styles.barActions}>
          <button type="button" className={styles.secondary} disabled={busy || (!dirty && Boolean(record))} onClick={onSave}>
            Save draft
          </button>
          <button type="button" className={styles.secondary} disabled={busy} onClick={onPreview}>
            Preview
          </button>
          <button type="button" className={styles.primary} disabled={busy || !canPublish} onClick={onPublish}>
            {busy ? 'Working…' : publishLabel}
          </button>
        </span>
      </div>
      <NoticeLine notice={notice} />
      {problems.length > 0 && (
        <div className={`${styles.panel} ${styles.notice}`} role="alert">
          <p>Before this can be published:</p>
          <ul className={styles.problems}>
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <section className={styles.panel} aria-label="About this article">
        <label className={styles.field}>
          <span className={styles.label}>Title</span>
          <input
            className={`${styles.input} ${styles.titleInput}`}
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              set(slugTouched ? { title } : { title, slug: slugify(title) });
            }}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Summary — shown under the title, on cards and in link previews</span>
          <textarea className={styles.textarea} rows={2} value={form.dek} onChange={(e) => set({ dek: e.target.value })} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>
            Web address{isLive && <span className={styles.hint}> — fixed once published</span>}
          </span>
          <span className={styles.slugRow}>
            <span className={styles.muted}>/articles/</span>
            <input
              className={styles.input}
              value={form.slug}
              readOnly={isLive}
              onChange={(e) => {
                setSlugTouched(true);
                set({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') });
              }}
            />
          </span>
        </label>
        <div className={styles.grid3}>
          <label className={styles.field}>
            <span className={styles.label}>Category</span>
            <input
              className={styles.input}
              list="studio-categories"
              value={form.category}
              onChange={(e) => set({ category: e.target.value })}
            />
            <datalist id="studio-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Topic (optional)</span>
            <input className={styles.input} value={form.topic} onChange={(e) => set({ topic: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Publish date</span>
            <input
              className={styles.input}
              type="date"
              value={form.publishedOn}
              onChange={(e) => set({ publishedOn: e.target.value })}
            />
          </label>
        </div>
        <div className={styles.grid3}>
          <label className={styles.field}>
            <span className={styles.label}>Author</span>
            <input className={styles.input} value={form.author} onChange={(e) => set({ author: e.target.value })} />
          </label>
          <fieldset className={styles.fieldset}>
            <legend className={styles.label}>Layout</legend>
            <label className={styles.radio}>
              <input type="radio" checked={form.format === 'essay'} onChange={() => set({ format: 'essay' })} /> Essay
            </label>
            <label className={styles.radio}>
              <input type="radio" checked={form.format === 'note'} onChange={() => set({ format: 'note' })} /> Personal
              note (framed card)
            </label>
          </fieldset>
          {form.format === 'note' && (
            <label className={styles.field}>
              <span className={styles.label}>Label above the title</span>
              <input className={styles.input} value={form.noteLabel} onChange={(e) => set({ noteLabel: e.target.value })} />
            </label>
          )}
        </div>
        <ImageField label="Main image (optional)" value={form.heroImage} onChange={(heroImage) => set({ heroImage })} />
        {form.heroImage && (
          <label className={styles.field}>
            <span className={styles.label}>Caption under the main image (optional)</span>
            <input className={styles.input} value={form.heroCaption} onChange={(e) => set({ heroCaption: e.target.value })} />
          </label>
        )}
        <details className={styles.disclosure}>
          <summary>Also published elsewhere</summary>
          <label className={styles.field}>
            <span className={styles.label}>One per line: Name, or Name | https://link</span>
            <textarea
              className={styles.textarea}
              rows={2}
              value={form.alsoPublishedOn}
              onChange={(e) => set({ alsoPublishedOn: e.target.value })}
            />
          </label>
        </details>
      </section>

      <section className={styles.panel} aria-labelledby="studio-body">
        <h2 id="studio-body" className={styles.h2}>
          Body
        </h2>
        <MarkdownImport
          onImport={(parsed, mode) =>
            set({
              blocks: mode === 'replace' ? parsed.blocks : [...form.blocks, ...parsed.blocks],
              ...(parsed.title && !form.title.trim()
                ? { title: parsed.title, ...(slugTouched ? {} : { slug: slugify(parsed.title) }) }
                : {}),
            })
          }
        />
        <BlockEditor blocks={form.blocks} onChange={(blocks) => set({ blocks })} />
      </section>

      <section className={`${styles.panel} ${styles.actions}`} aria-label="Remove">
        {isLive ? (
          <ConfirmButton label="Unpublish…" confirmLabel="Take it off the site" disabled={busy} onConfirm={onUnpublish} />
        ) : (
          <ConfirmButton
            label={record ? 'Delete draft…' : 'Discard…'}
            confirmLabel={record ? 'Delete this draft' : 'Discard'}
            disabled={busy}
            onConfirm={onDelete}
          />
        )}
      </section>
    </>
  );
}
