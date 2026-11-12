/**
 * Editor-side shapes for articles and quotes, and lossless conversion to and
 * from the site's content types.
 *
 * An article body is edited as one flat list of blocks; a `heading` block
 * starts a new section, which is how `ArticleSection` reads on the page and
 * how Markdown writes it. Text that can carry emphasis is edited as Markdown
 * (see ./markdown.ts). Fields the forms don't show (e.g. `sample`) are carried
 * over from the stored article untouched.
 */
import type { Article, ArticleBlock, ImageAsset, Quote, QuoteTone } from '@/content/types';
import { parseInline, serializeInline } from './markdown';

const newId = () => crypto.randomUUID();

/* Blocks ------------------------------------------------------------- */

export type EBlock =
  | { id: string; type: 'heading'; text: string }
  | { id: string; type: 'paragraph'; md: string }
  | { id: string; type: 'quote'; text: string; attribution: string; tone: QuoteTone | '' }
  | { id: string; type: 'note'; label: string; md: string }
  | { id: string; type: 'pull'; text: string }
  | { id: string; type: 'figure'; image?: ImageAsset; caption: string }
  | { id: string; type: 'ask'; text: string }
  | { id: string; type: 'mentor'; text: string; attribution: string }
  | { id: string; type: 'toc'; title: string; items: string; current: number }
  | { id: string; type: 'signature'; line: string; name: string };

export type BlockType = EBlock['type'];

/** Names and one-line explanations shown in the "add block" menu. */
export const BLOCK_TYPES: Array<{ type: BlockType; label: string; hint: string }> = [
  { type: 'paragraph', label: 'Paragraph', hint: 'Body text' },
  { type: 'heading', label: 'Heading', hint: 'Starts a new section' },
  { type: 'pull', label: 'Pull quote', hint: 'A line from the piece, set large between rules' },
  { type: 'figure', label: 'Image', hint: 'A picture with an optional caption' },
  { type: 'ask', label: 'Question', hint: 'A short reflective question for the reader' },
  { type: 'quote', label: 'Quote', hint: 'Someone’s words in a coloured block' },
  { type: 'mentor', label: 'Remark', hint: 'Something someone else said, with who said it' },
  { type: 'note', label: 'Note', hint: 'A labelled aside' },
  { type: 'toc', label: 'Outline', hint: 'A list of the piece’s stages, one marked as current' },
  { type: 'signature', label: 'Sign-off', hint: 'Closing line and first name' },
];

export const TONES: QuoteTone[] = ['cream', 'blush', 'lavender', 'mist'];

export function emptyBlock(type: BlockType): EBlock {
  const id = newId();
  switch (type) {
    case 'heading':
      return { id, type, text: '' };
    case 'paragraph':
      return { id, type, md: '' };
    case 'quote':
      return { id, type, text: '', attribution: '', tone: '' };
    case 'note':
      return { id, type, label: '', md: '' };
    case 'pull':
    case 'ask':
      return { id, type, text: '' };
    case 'figure':
      return { id, type, caption: '' };
    case 'mentor':
      return { id, type, text: '', attribution: '' };
    case 'toc':
      return { id, type, title: '', items: '', current: -1 };
    case 'signature':
      return { id, type, line: '', name: 'Isha' };
  }
}

function toEBlock(b: ArticleBlock): EBlock {
  const id = newId();
  switch (b.type) {
    case 'paragraph':
      return { id, type: 'paragraph', md: serializeInline(b.text) };
    case 'quote':
      return { id, type: 'quote', text: b.text, attribution: b.attribution ?? '', tone: b.tone ?? '' };
    case 'note':
      return { id, type: 'note', label: b.label, md: serializeInline(b.text) };
    case 'pull':
    case 'ask':
      return { id, type: b.type, text: b.text };
    case 'figure':
      return { id, type: 'figure', image: b.image, caption: b.caption ?? '' };
    case 'mentor':
      return { id, type: 'mentor', text: b.text, attribution: b.attribution ?? '' };
    case 'toc':
      return {
        id,
        type: 'toc',
        title: b.title,
        items: b.items.map((it) => it.label).join('\n'),
        current: b.items.findIndex((it) => it.current),
      };
    case 'signature':
      return { id, type: 'signature', line: b.line, name: b.name };
  }
}

/** `undefined` for blocks with nothing in them, so stray empty blocks never publish. */
function fromEBlock(e: Exclude<EBlock, { type: 'heading' }>): ArticleBlock | undefined {
  const opt = (s: string) => (s.trim() ? s.trim() : undefined);
  switch (e.type) {
    case 'paragraph':
      return e.md.trim() ? { type: 'paragraph', text: parseInline(e.md.trim()) } : undefined;
    case 'quote':
      return e.text.trim()
        ? { type: 'quote', text: e.text.trim(), attribution: opt(e.attribution), tone: e.tone || undefined }
        : undefined;
    case 'note':
      return e.md.trim() ? { type: 'note', label: e.label.trim(), text: parseInline(e.md.trim()) } : undefined;
    case 'pull':
    case 'ask':
      return e.text.trim() ? { type: e.type, text: e.text.trim() } : undefined;
    case 'figure':
      return e.image ? { type: 'figure', image: e.image, caption: opt(e.caption) } : undefined;
    case 'mentor':
      return e.text.trim() ? { type: 'mentor', text: e.text.trim(), attribution: opt(e.attribution) } : undefined;
    case 'toc': {
      const labels = e.items.split('\n').map((s) => s.trim()).filter(Boolean);
      if (!labels.length) return undefined;
      return {
        type: 'toc',
        title: e.title.trim(),
        items: labels.map((label, i) => (i === e.current ? { label, current: true } : { label })),
      };
    }
    case 'signature':
      return e.line.trim() || e.name.trim() ? { type: 'signature', line: e.line.trim(), name: e.name.trim() } : undefined;
  }
}

/* Articles ----------------------------------------------------------- */

export interface ArticleForm {
  slug: string;
  title: string;
  dek: string;
  category: string;
  topic: string;
  format: 'essay' | 'note';
  noteLabel: string;
  author: string;
  publishedOn: string;
  heroImage?: ImageAsset;
  heroCaption: string;
  /** One per line: `Name` or `Name | https://…` */
  alsoPublishedOn: string;
  blocks: EBlock[];
}

export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function emptyArticleForm(): ArticleForm {
  return {
    slug: '',
    title: '',
    dek: '',
    category: 'Essay',
    topic: '',
    format: 'essay',
    noteLabel: '',
    author: 'Isha Vazquez',
    publishedOn: todayIso(),
    heroCaption: '',
    alsoPublishedOn: '',
    blocks: [emptyBlock('paragraph')],
  };
}

export function toArticleForm(a: Article): ArticleForm {
  const blocks: EBlock[] = [];
  for (const section of a.sections) {
    if (section.heading !== undefined) blocks.push({ id: newId(), type: 'heading', text: section.heading });
    blocks.push(...section.blocks.map(toEBlock));
  }
  return {
    slug: a.slug,
    title: a.title,
    dek: a.dek,
    category: a.category,
    topic: a.topic ?? '',
    format: a.format ?? 'essay',
    noteLabel: a.noteLabel ?? '',
    author: a.author,
    publishedOn: a.publishedOn,
    heroImage: a.heroImage,
    heroCaption: a.heroCaption ?? '',
    alsoPublishedOn: (a.alsoPublishedOn ?? []).map((p) => (p.url ? `${p.name} | ${p.url}` : p.name)).join('\n'),
    blocks,
  };
}

export function fromArticleForm(f: ArticleForm, base?: Article): Article {
  const sections: Article['sections'] = [];
  let current: Article['sections'][number] = { blocks: [] };
  for (const e of f.blocks) {
    if (e.type === 'heading') {
      if (current.heading !== undefined || current.blocks.length) sections.push(current);
      current = { heading: e.text.trim(), blocks: [] };
    } else {
      const block = fromEBlock(e);
      if (block) current.blocks.push(block);
    }
  }
  if (current.heading !== undefined || current.blocks.length) sections.push(current);

  const also = f.alsoPublishedOn
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, url] = line.split('|').map((s) => s.trim());
      return url ? { name, url } : { name };
    });

  const article: Article = {
    ...(base ?? {}),
    slug: f.slug.trim(),
    category: f.category.trim(),
    title: f.title.trim(),
    dek: f.dek.trim(),
    author: f.author.trim(),
    publishedOn: f.publishedOn,
    sections,
  };
  const set = <K extends keyof Article>(key: K, value: Article[K] | undefined) => {
    if (value === undefined || value === '') delete article[key];
    else article[key] = value;
  };
  set('topic', f.topic.trim());
  // Essay is the default, so it's left unset unless the stored article said so.
  set('format', f.format === 'note' ? 'note' : base?.format === 'essay' ? 'essay' : undefined);
  set('noteLabel', f.format === 'note' ? f.noteLabel.trim() : undefined);
  set('heroImage', f.heroImage);
  set('heroCaption', f.heroImage ? f.heroCaption.trim() : undefined);
  set('alsoPublishedOn', also.length ? also : undefined);
  return article;
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

/** What has to be fixed before an article can go live. Empty when it's ready. */
export function articleProblems(a: Article): string[] {
  const problems: string[] = [];
  if (!a.title) problems.push('Add a title.');
  if (!a.dek) problems.push('Add a summary — it shows under the title and in link previews.');
  if (!a.category) problems.push('Add a category.');
  if (!a.author) problems.push('Add an author.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.publishedOn)) problems.push('Set a publish date.');
  if (!SLUG_PATTERN.test(a.slug)) problems.push('The web address can only use lowercase letters, numbers and dashes.');
  if (a.slug === 'quotes') problems.push('“quotes” is already used by the quotes page; pick another web address.');
  if (!a.sections.some((s) => s.blocks.length)) problems.push('The article has no body text yet.');
  if (a.heroImage && !a.heroImage.alt.trim()) problems.push('Describe the main image for people who can’t see it.');
  for (const s of a.sections) {
    for (const b of s.blocks) {
      if (b.type === 'figure' && !b.image.alt.trim()) problems.push('Describe each image in the body for people who can’t see it.');
    }
  }
  return [...new Set(problems)];
}

/* Quotes ------------------------------------------------------------- */

export interface QuoteForm {
  number: number;
  publishedOn: string;
  label: string;
  /** One beat per line. */
  beats: string;
  rest: string;
  /** Paragraphs separated by a blank line. */
  thought: string;
  tryIt: string;
}

export function emptyQuoteForm(number: number): QuoteForm {
  return {
    number,
    publishedOn: todayIso(),
    label: 'A quote from Isha to start your day',
    beats: '',
    rest: '',
    thought: '',
    tryIt: '',
  };
}

export function toQuoteForm(q: Quote): QuoteForm {
  return {
    number: q.number,
    publishedOn: q.publishedOn,
    label: q.label ?? '',
    beats: q.beats.join('\n'),
    rest: q.rest ?? '',
    thought: (q.thought ?? []).join('\n\n'),
    tryIt: q.tryIt ?? '',
  };
}

export function fromQuoteForm(f: QuoteForm, base?: Quote): Quote {
  const quote: Quote = {
    ...(base ?? {}),
    number: f.number,
    publishedOn: f.publishedOn,
    beats: f.beats.split('\n').map((s) => s.trim()).filter(Boolean),
  };
  const set = <K extends keyof Quote>(key: K, value: Quote[K] | undefined) => {
    if (value === undefined || value === '' || (Array.isArray(value) && !value.length)) delete quote[key];
    else quote[key] = value;
  };
  set('label', f.label.trim());
  set('rest', f.rest.trim());
  set(
    'thought',
    f.thought
      .split(/\n\s*\n/)
      .map((p) => p.trim().replace(/\s*\n\s*/g, ' '))
      .filter(Boolean),
  );
  set('tryIt', f.tryIt.trim());
  return quote;
}

export function quoteProblems(q: Quote): string[] {
  const problems: string[] = [];
  if (!q.beats.length) problems.push('Add the quote’s opening line.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(q.publishedOn)) problems.push('Set a publish date.');
  return problems;
}

/* Markdown import ---------------------------------------------------- */

/**
 * Turns pasted Markdown (what AI tools produce) into blocks. Headings start
 * sections, `>` lines become a quote (a trailing "— Name" line becomes its
 * attribution), list items become paragraphs — the article model has no list
 * block — and a leading `# Title` is returned separately.
 */
export function blocksFromMarkdown(md: string): { title?: string; blocks: EBlock[] } {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const blocks: EBlock[] = [];
  let title: string | undefined;
  let para: string[] = [];

  const flush = () => {
    if (para.length) blocks.push({ id: newId(), type: 'paragraph', md: para.join(' ') });
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || /^([-*_])\1{2,}$/.test(line)) {
      flush();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (heading) {
      flush();
      const text = heading[2].replace(/^\*\*(.+)\*\*$/, '$1');
      if (heading[1] === '#' && title === undefined && blocks.length === 0) title = text;
      else blocks.push({ id: newId(), type: 'heading', text });
      continue;
    }

    if (line.startsWith('>')) {
      flush();
      const quoted: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoted.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      i--;
      let attribution = '';
      const last = quoted[quoted.length - 1]?.match(/^[—–-]{1,2}\s*(.+)$/);
      if (last && quoted.length > 1) {
        attribution = last[1];
        quoted.pop();
      }
      const text = quoted.filter(Boolean).join(' ').replace(/^["“](.*)["”]$/, '$1');
      if (text) blocks.push({ id: newId(), type: 'quote', text, attribution, tone: '' });
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"[^"]*")?\)$/);
    if (image) {
      flush();
      blocks.push({ id: newId(), type: 'figure', image: { src: image[2], alt: image[1] }, caption: '' });
      continue;
    }

    const item = line.match(/^(?:[-*+]|\d+[.)])\s+(.+)$/);
    if (item) {
      flush();
      blocks.push({ id: newId(), type: 'paragraph', md: item[1] });
      continue;
    }

    para.push(line);
  }
  flush();
  return { title, blocks };
}

/** Whether pasted text looks like more than a single run of text. */
export const looksLikeMarkdownDocument = (text: string) =>
  /\n\s*\n/.test(text) || /^(#{1,6}\s|>|[-*+]\s|\d+[.)]\s)/m.test(text);
