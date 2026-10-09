import { useEffect, useState } from 'react';
import { fetchYouTubeMeta, type YouTubeMeta } from '@/services/youtube';

/** Live title/channel for a YouTube video; `null` while loading or if unavailable. */
export function useYouTubeMeta(videoId: string | undefined): YouTubeMeta | null {
  const [meta, setMeta] = useState<YouTubeMeta | null>(null);
  useEffect(() => {
    if (!videoId) return;
    let alive = true;
    fetchYouTubeMeta(videoId).then((m) => alive && setMeta(m));
    return () => {
      alive = false;
    };
  }, [videoId]);
  return meta;
}
