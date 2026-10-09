import type { Episode } from '../types';
import { episode01 } from './episode-01';

/**
 * Episode registry. To publish a new episode:
 *   1. copy `episode-01.ts` to `episode-02.ts` and replace its content;
 *   2. add it to this array.
 * The Podcast hub, home page capsules, routing and the episode page template
 * all pick it up automatically.
 */
export const episodes: Episode[] = [episode01];
