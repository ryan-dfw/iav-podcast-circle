import { useEffect, useState } from 'react';
import { fetchLatestVideos, type ChannelVideo } from '@/services/youtube';

export type LatestVideos =
  | { status: 'loading' }
  | { status: 'ready'; videos: ChannelVideo[] }
  | { status: 'error' };

export function useLatestVideos(limit = 3): LatestVideos {
  const [state, setState] = useState<LatestVideos>({ status: 'loading' });
  useEffect(() => {
    let alive = true;
    fetchLatestVideos(limit).then(
      (videos) => alive && setState({ status: 'ready', videos }),
      () => alive && setState({ status: 'error' }),
    );
    return () => {
      alive = false;
    };
  }, [limit]);
  return state;
}
