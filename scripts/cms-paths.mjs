/** Shared by vite.config.ts and prerender.mjs: where `@cms/snapshot` points. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const generatedSnapshot = (root) => join(root, 'src/content/cms/snapshot.generated.json');

export function cmsSnapshotPath(root) {
  const generated = generatedSnapshot(root);
  return existsSync(generated) ? generated : join(root, 'src/content/cms/snapshot.empty.json');
}
