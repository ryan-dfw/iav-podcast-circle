import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Quote } from '@/content/types';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { deleteQuote, loadQuote, loadQuotes, publishQuote, saveQuoteDraft, unpublishQuote, type QuoteRecord } from './data';
import { emptyQuoteForm, fromQuoteForm, quoteProblems, toQuoteForm, type QuoteForm } from './model';
import { requestRebuild } from './rebuild';
import { useStudioUser } from './context';
import { ConfirmButton, NoticeLine, StatusTag, errorText, timeOnly, useLeaveGuard, type Notice } from './ui';
import styles from './studio.module.css';

export function QuoteEditor() {
  const { number: routeNumber } = useParams();
  const isNew = routeNumber === undefined;
  const user = useStudioUser();
  const navigate = useNavigate();

  const [record, setRecord] = useState<QuoteRecord | null>(null);
  const [form, setForm] = useState<QuoteForm | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    try {
      if (isNew) {
        const all = await loadQuotes();
        setForm(emptyQuoteForm(Math.max(0, ...all.map((q) => q.number)) + 1));
        setSaved('');
        return;
      }
      const r = await loadQuote(Number(routeNumber));
      if (!r) {
        setLoadError('There’s no quote with that number.');
        return;
      }
      const f = toQuoteForm(r.draft);
      setRecord(r);
      setForm(f);
      setSaved(JSON.stringify(fromQuoteForm(f, r.draft)));
    } catch (err) {
      setLoadError(errorText(err));
    }
  }, [isNew, routeNumber]);

  useEffect(() => {
    void load();
  }, [load]);

  const quote: Quote | null = useMemo(() => (form ? fromQuoteForm(form, record?.draft) : null), [form, record]);
  const dirty = quote !== null && JSON.stringify(quote) !== saved;
  useLeaveGuard(dirty);

  if (loadError) {
    return (
      <section className={styles.panel}>
        <p className={styles.error}>{loadError}</p>
        <Link to="/studio">Back to all content</Link>
      </section>
    );
  }
  if (!form || !quote) return <p className={styles.muted}>Loading…</p>;

  const isLive = Boolean(record?.published);
  const set = (patch: Partial<QuoteForm>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const save = async (): Promise<boolean> => {
    if (!dirty && record) return true;
    await saveQuoteDraft(quote, user.email ?? '', !record);
    setRecord(await loadQuote(quote.number));
    setSaved(JSON.stringify(quote));
    if (isNew) navigate(`/studio/quotes/${quote.number}`, { replace: true });
    return true;
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

  const problems = quoteProblems(quote);
  const canPublish = !isLive || dirty || (record ? JSON.stringify(record.draft) !== JSON.stringify(record.published) : true);

  const onPublish = () =>
    run(async () => {
      if (problems.length) {
        setNotice({ kind: 'error', text: problems.join(' ') });
        return;
      }
      await save();
      await publishQuote(quote.number, user.email ?? '');
      setRecord(await loadQuote(quote.number));
      const rebuilt = await requestRebuild(user);
      setNotice(
        rebuilt.ok
          ? { kind: 'info', text: 'Published. The Articles page updates in about two minutes.' }
          : { kind: 'error', text: `Published, but the site didn’t rebuild: ${rebuilt.message}` },
      );
    });

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
          <button
            type="button"
            className={styles.secondary}
            disabled={busy || (!dirty && Boolean(record))}
            onClick={() =>
              run(async () => {
                if (await save()) setNotice({ kind: 'info', text: `Saved at ${timeOnly(new Date())}.` });
              })
            }
          >
            Save draft
          </button>
          <button type="button" className={styles.primary} disabled={busy || !canPublish} onClick={onPublish}>
            {busy ? 'Working…' : isLive ? 'Publish changes' : 'Publish'}
          </button>
        </span>
      </div>
      <NoticeLine notice={notice} />

      <div className={styles.quoteLayout}>
        <section className={styles.panel} aria-label={`Quote No. ${form.number}`}>
          <h2 className={styles.h2}>Quote No. {form.number}</h2>
          <label className={styles.field}>
            <span className={styles.label}>Small line above the number</span>
            <input className={styles.input} value={form.label} onChange={(e) => set({ label: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Opening line, one beat per line (set large)</span>
            <textarea className={styles.textarea} rows={3} value={form.beats} onChange={(e) => set({ beats: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>The softer line under it</span>
            <input className={styles.input} value={form.rest} onChange={(e) => set({ rest: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>The thought behind it — leave a blank line between paragraphs</span>
            <textarea className={styles.textarea} rows={5} value={form.thought} onChange={(e) => set({ thought: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Try it today</span>
            <textarea className={styles.textarea} rows={2} value={form.tryIt} onChange={(e) => set({ tryIt: e.target.value })} />
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
        </section>

        <section className={styles.previewPane} aria-label="Preview">
          <span className={styles.label}>Preview</span>
          {quote.beats.length ? (
            <QuoteCard quote={quote} headingLevel={3} />
          ) : (
            <p className={styles.muted}>The preview appears once the opening line has some text.</p>
          )}
        </section>
      </div>

      <section className={`${styles.panel} ${styles.actions}`} aria-label="Remove">
        {isLive ? (
          <ConfirmButton
            label="Unpublish…"
            confirmLabel="Take it off the site"
            disabled={busy}
            onConfirm={() =>
              run(async () => {
                await unpublishQuote(quote.number, user.email ?? '');
                setRecord(await loadQuote(quote.number));
                const rebuilt = await requestRebuild(user);
                setNotice(
                  rebuilt.ok
                    ? { kind: 'info', text: 'Taken off the site. It disappears in about two minutes.' }
                    : { kind: 'error', text: `Unpublished, but the site didn’t rebuild: ${rebuilt.message}` },
                );
              })
            }
          />
        ) : (
          <ConfirmButton
            label={record ? 'Delete draft…' : 'Discard…'}
            confirmLabel={record ? 'Delete this draft' : 'Discard'}
            disabled={busy}
            onConfirm={() =>
              run(async () => {
                if (record) await deleteQuote(record.number);
                setSaved(JSON.stringify(quote));
                navigate('/studio');
              })
            }
          />
        )}
      </section>
    </>
  );
}
