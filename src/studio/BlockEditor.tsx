/**
 * The article body as a list of blocks. Pasting Markdown with more than one
 * paragraph into a paragraph splits it into blocks (headings, quotes and all),
 * so text drafted elsewhere comes in already structured.
 */
import { useState, type ClipboardEvent } from 'react';
import { BLOCK_TYPES, TONES, blocksFromMarkdown, emptyBlock, looksLikeMarkdownDocument, type BlockType, type EBlock } from './model';
import { ImageField } from './ImageField';
import styles from './studio.module.css';

type Patch = Partial<Omit<EBlock, 'id' | 'type'>>;

const labelFor = (type: BlockType) => BLOCK_TYPES.find((b) => b.type === type)?.label ?? type;

export function BlockEditor({ blocks, onChange }: { blocks: EBlock[]; onChange: (next: EBlock[]) => void }) {
  const update = (id: string, patch: Patch) =>
    onChange(blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as EBlock) : b)));
  const remove = (id: string) => onChange(blocks.filter((b) => b.id !== id));
  const move = (index: number, by: -1 | 1) => {
    const next = [...blocks];
    const [b] = next.splice(index, 1);
    next.splice(index + by, 0, b);
    onChange(next);
  };
  const insertAt = (index: number, items: EBlock[]) => {
    const next = [...blocks];
    next.splice(index, 0, ...items);
    onChange(next);
  };

  const pasteInto = (index: number) => (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text/plain');
    if (!looksLikeMarkdownDocument(text)) return;
    const parsed = blocksFromMarkdown(text).blocks;
    if (!parsed.length) return;
    e.preventDefault();
    const current = blocks[index];
    const isEmpty = current.type === 'paragraph' && !current.md.trim();
    const next = [...blocks];
    next.splice(isEmpty ? index : index + 1, isEmpty ? 1 : 0, ...parsed);
    onChange(next);
  };

  return (
    <div className={styles.blocks}>
      <p className={styles.hint}>In any text box: **bold**  *italic*  [link text](https://…)</p>
      {blocks.length === 0 && <p className={styles.muted}>The body is empty.</p>}
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className={`${styles.block} ${block.type === 'paragraph' ? styles.blockPlain : block.type === 'heading' ? styles.blockHeading : styles.blockCard}`}
        >
          <div className={styles.blockHead}>
            <span className={styles.blockType}>{block.type === 'paragraph' ? '' : labelFor(block.type)}</span>
            <span className={styles.blockTools}>
              <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                ↑
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={index === blocks.length - 1}
                onClick={() => move(index, 1)}
              >
                ↓
              </button>
              <button type="button" aria-label={`Delete ${labelFor(block.type).toLowerCase()}`} onClick={() => remove(block.id)}>
                ✕
              </button>
            </span>
          </div>
          <BlockFields block={block} update={(patch) => update(block.id, patch)} onPaste={pasteInto(index)} />
          <AddMenu compact onAdd={(type) => insertAt(index + 1, [emptyBlock(type)])} />
        </div>
      ))}
      <AddMenu onAdd={(type) => insertAt(blocks.length, [emptyBlock(type)])} />
    </div>
  );
}

function AddMenu({ onAdd, compact }: { onAdd: (type: BlockType) => void; compact?: boolean }) {
  if (compact) {
    return (
      <select
        className={styles.addBelow}
        aria-label="Add a block below"
        value=""
        onChange={(e) => e.target.value && onAdd(e.target.value as BlockType)}
      >
        <option value="">+ Add below…</option>
        {BLOCK_TYPES.map((b) => (
          <option key={b.type} value={b.type}>
            {b.label} — {b.hint}
          </option>
        ))}
      </select>
    );
  }
  return (
    <div className={styles.addBar}>
      {(['paragraph', 'heading', 'figure', 'pull'] as BlockType[]).map((type) => (
        <button key={type} type="button" className={styles.secondary} onClick={() => onAdd(type)}>
          + {labelFor(type)}
        </button>
      ))}
      <select
        className={styles.select}
        aria-label="Add another kind of block"
        value=""
        onChange={(e) => e.target.value && onAdd(e.target.value as BlockType)}
      >
        <option value="">More…</option>
        {BLOCK_TYPES.filter((b) => !['paragraph', 'heading', 'figure', 'pull'].includes(b.type)).map((b) => (
          <option key={b.type} value={b.type}>
            {b.label} — {b.hint}
          </option>
        ))}
      </select>
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
  multiline,
  onPaste,
  hint,
  className,
  bare,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  onPaste?: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
  hint?: string;
  className?: string;
  bare?: boolean;
}) {
  return (
    <label className={styles.field}>
      <span className={bare ? 'visually-hidden' : styles.label}>
        {label}
        {hint && <span className={styles.hint}> {hint}</span>}
      </span>
      {multiline ? (
        <textarea
          className={`${styles.textarea} ${className ?? ''}`}
          value={value}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          onPaste={onPaste}
        />
      ) : (
        <input className={`${styles.input} ${className ?? ''}`} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function BlockFields({
  block,
  update,
  onPaste,
}: {
  block: EBlock;
  update: (patch: Patch) => void;
  onPaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
}) {
  switch (block.type) {
    case 'heading':
      return <Text bare label="Heading" value={block.text} onChange={(text) => update({ text })} className={styles.headingInput} />;
    case 'paragraph':
      return (
        <Text
          bare
          label="Paragraph"
          multiline
          value={block.md}
          onChange={(md) => update({ md })}
          onPaste={onPaste}
          className={styles.prose}
        />
      );
    case 'pull':
      return <Text label="Pull quote" multiline value={block.text} onChange={(text) => update({ text })} />;
    case 'ask':
      return <Text label="Question" multiline value={block.text} onChange={(text) => update({ text })} />;
    case 'quote':
      return (
        <>
          <Text label="Quote" multiline value={block.text} onChange={(text) => update({ text })} />
          <div className={styles.grid2}>
            <Text label="Who said it (optional)" value={block.attribution} onChange={(attribution) => update({ attribution })} />
            <label className={styles.field}>
              <span className={styles.label}>Colour</span>
              <select className={styles.select} value={block.tone} onChange={(e) => update({ tone: e.target.value as typeof block.tone })}>
                <option value="">Default</option>
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      );
    case 'mentor':
      return (
        <>
          <Text label="What they said" multiline value={block.text} onChange={(text) => update({ text })} />
          <Text label="Who said it (optional)" value={block.attribution} onChange={(attribution) => update({ attribution })} />
        </>
      );
    case 'note':
      return (
        <>
          <Text label="Label" value={block.label} onChange={(label) => update({ label })} />
          <Text label="Text" multiline value={block.md} onChange={(md) => update({ md })} />
        </>
      );
    case 'figure':
      return (
        <>
          <ImageField label="Image" value={block.image} onChange={(image) => update({ image })} />
          <Text label="Caption (optional)" value={block.caption} onChange={(caption) => update({ caption })} />
        </>
      );
    case 'toc': {
      const items = block.items.split('\n').map((s) => s.trim()).filter(Boolean);
      return (
        <>
          <Text label="Title" value={block.title} onChange={(title) => update({ title })} />
          <Text label="Stages, one per line" multiline value={block.items} onChange={(v) => update({ items: v })} />
          <label className={styles.field}>
            <span className={styles.label}>Where this piece is</span>
            <select className={styles.select} value={block.current} onChange={(e) => update({ current: Number(e.target.value) })}>
              <option value={-1}>None marked</option>
              {items.map((label, i) => (
                <option key={i} value={i}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </>
      );
    }
    case 'signature':
      return (
        <div className={styles.grid2}>
          <Text label="Closing line" value={block.line} onChange={(line) => update({ line })} />
          <Text label="Name" value={block.name} onChange={(name) => update({ name })} />
        </div>
      );
  }
}

/** Paste a whole draft at once; offered above the body. */
export function MarkdownImport({
  onImport,
}: {
  onImport: (parsed: { title?: string; blocks: EBlock[] }, mode: 'replace' | 'append') => void;
}) {
  const [text, setText] = useState('');
  const parsed = text.trim() ? blocksFromMarkdown(text) : null;
  return (
    <details className={styles.disclosure}>
      <summary>Paste a whole draft (Markdown, e.g. from ChatGPT)</summary>
      <label className={styles.field}>
        <span className={styles.label}>
          Headings (## …) start sections, &gt; lines become quotes, **bold** and *italic* carry over.
        </span>
        <textarea className={styles.textarea} rows={8} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      {parsed && (
        <p className={styles.muted}>
          {parsed.blocks.length} block{parsed.blocks.length === 1 ? '' : 's'}
          {parsed.title && <> · title “{parsed.title}”</>}
        </p>
      )}
      <div className={styles.row}>
        <button
          type="button"
          className={styles.secondary}
          disabled={!parsed?.blocks.length}
          onClick={() => {
            if (parsed) onImport(parsed, 'replace');
            setText('');
          }}
        >
          Replace the body
        </button>
        <button
          type="button"
          className={styles.secondary}
          disabled={!parsed?.blocks.length}
          onClick={() => {
            if (parsed) onImport(parsed, 'append');
            setText('');
          }}
        >
          Add to the end
        </button>
      </div>
    </details>
  );
}
