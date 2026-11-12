/**
 * The inline syntax Studio's text fields use, mapped onto the site's
 * `RichText` runs (plain / em / strong / link — no nesting, by design):
 *
 *   **bold**   *italic* or _italic_   [link text](https://…)   \* for a literal *
 *
 * `serializeInline` is the exact inverse of `parseInline` for anything the
 * content model can hold, so opening and saving an article changes nothing.
 */
import type { InlineRun, RichText } from '@/content/types';

const isWord = (c: string | undefined) => !!c && /[\p{L}\p{N}]/u.test(c);
const isSpace = (c: string | undefined) => !c || /\s/.test(c);
const ESCAPABLE = '\\*_[]';

/** Index of the closing delimiter at or after `from`, skipping escapes; -1 if none. */
function findClose(s: string, delim: string, from: number): number {
  for (let j = from; j < s.length; j++) {
    if (s[j] === '\\') {
      j++;
      continue;
    }
    if (!s.startsWith(delim, j)) continue;
    if (delim === '*' && (s[j + 1] === '*' || s[j - 1] === '*')) continue;
    return j;
  }
  return -1;
}

const unescape = (s: string) => s.replace(/\\([\\*_[\]])/g, '$1');

export function parseInline(md: string): RichText {
  const runs: InlineRun[] = [];
  let text = '';
  const flush = () => {
    if (text) runs.push(text);
    text = '';
  };

  let i = 0;
  while (i < md.length) {
    const c = md[i];

    if (c === '\\' && ESCAPABLE.includes(md[i + 1] ?? '')) {
      text += md[i + 1];
      i += 2;
      continue;
    }

    if (md.startsWith('**', i) && !isSpace(md[i + 2])) {
      const end = findClose(md, '**', i + 2);
      if (end > i + 2 && !isSpace(md[end - 1])) {
        flush();
        runs.push({ strong: unescape(md.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }

    if (c === '*' && md[i + 1] !== '*' && !isSpace(md[i + 1])) {
      const end = findClose(md, '*', i + 1);
      if (end > i + 1 && !isSpace(md[end - 1])) {
        flush();
        runs.push({ em: unescape(md.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
    }

    if (c === '_' && !isWord(md[i - 1]) && !isSpace(md[i + 1])) {
      const end = findClose(md, '_', i + 1);
      if (end > i + 1 && !isWord(md[end + 1]) && !isSpace(md[end - 1])) {
        flush();
        runs.push({ em: unescape(md.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
    }

    if (c === '[') {
      const close = findClose(md, ']', i + 1);
      if (close > i + 1 && md[close + 1] === '(') {
        const paren = md.indexOf(')', close + 2);
        if (paren > close + 2) {
          flush();
          runs.push({ link: unescape(md.slice(i + 1, close)), href: md.slice(close + 2, paren).trim() });
          i = paren + 1;
          continue;
        }
      }
    }

    text += c;
    i++;
  }
  flush();

  if (runs.length === 0) return '';
  if (runs.length === 1 && typeof runs[0] === 'string') return runs[0];
  return runs;
}

function escape(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if ('\\*[]'.includes(c)) out += `\\${c}`;
    else if (c === '_' && !(isWord(s[i - 1]) && isWord(s[i + 1]))) out += '\\_';
    else out += c;
  }
  return out;
}

export function serializeInline(value: RichText): string {
  if (typeof value === 'string') return escape(value);
  return value
    .map((run) => {
      if (typeof run === 'string') return escape(run);
      if ('em' in run) return `*${escape(run.em)}*`;
      if ('strong' in run) return `**${escape(run.strong)}**`;
      return `[${escape(run.link)}](${run.href})`;
    })
    .join('');
}

/** Plain text of a rich text value, for previews and word counts. */
export function plainText(value: RichText): string {
  if (typeof value === 'string') return value;
  return value.map((r) => (typeof r === 'string' ? r : 'em' in r ? r.em : 'strong' in r ? r.strong : r.link)).join('');
}
