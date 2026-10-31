/**
 * GET /api/kit-pdf?t=<token>  ->  the printable journal
 *
 * The PDF no longer lives in `public/`, because anything under there is a
 * permanent public URL that a token check on a page can't protect. It ships
 * inside the function bundle instead (netlify.toml `included_files`) and only
 * comes back out for a valid signature. A GET with the token in the query is
 * unavoidable here — it has to work as a plain link in an href.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readToken } from './_lib/token';

const FILE = 'circle-starter-7-day-journal.pdf';

/** Bundlers move things around; try the places it can legitimately land. */
function candidatePaths(): string[] {
  const paths = [
    join(process.cwd(), 'netlify', 'assets', FILE),
    join(process.cwd(), 'assets', FILE),
  ];
  try {
    paths.push(fileURLToPath(new URL(`../assets/${FILE}`, import.meta.url)));
  } catch {
    /* import.meta.url isn't a file URL in every runtime — fine, skip it */
  }
  return paths;
}

async function loadPdf(): Promise<Uint8Array | null> {
  for (const path of candidatePaths()) {
    try {
      // Copied into a plain Uint8Array: a Node Buffer isn't a valid Response body type.
      return new Uint8Array(await readFile(path));
    } catch {
      continue;
    }
  }
  return null;
}

export default async (req: Request): Promise<Response> => {
  const token = new URL(req.url).searchParams.get('t');
  if (!readToken(token)) {
    return new Response('This download link isn’t valid. Request a fresh one from the site.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const pdf = await loadPdf();
  if (!pdf) {
    console.error('kit-pdf: file not found; looked in', candidatePaths().join(', '));
    return new Response('The file is temporarily unavailable.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(pdf.byteLength),
      'Content-Disposition': `attachment; filename="${FILE}"`,
      'Cache-Control': 'private, no-store',
    },
  });
};

export const config = { path: '/api/kit-pdf' };
