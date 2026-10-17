/**
 * YouTube metadata, fetched live from YouTube's public oEmbed endpoint so
 * titles and channel names are never hardcoded — rename a video on YouTube
 * and the site follows. No API key needed; responses are cached per page load.
 */
export interface YouTubeMeta {
  title: string;
  channelName: string;
  channelUrl: string;
}

const cache = new Map<string, Promise<YouTubeMeta | null>>();

export function fetchYouTubeMeta(videoId: string): Promise<YouTubeMeta | null> {
  let pending = cache.get(videoId);
  if (!pending) {
    const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    pending = fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d ? { title: d.title, channelName: d.author_name, channelUrl: d.author_url } : null))
      .catch(() => null);
    cache.set(videoId, pending);
  }
  return pending;
}

export interface ChannelVideo {
  videoId: string;
  title: string;
  /** ISO timestamp. */
  published: string;
  description: string;
}

let latest: Promise<ChannelVideo[]> | undefined;

/** Newest videos on the channel (the feed is already newest-first). Rejects if the feed can't be read. */
export function fetchLatestVideos(limit = 3): Promise<ChannelVideo[]> {
  latest ??= fetch('/api/youtube-feed')
    .then((r) => {
      if (!r.ok) throw new Error(`Feed responded ${r.status}`);
      return r.text();
    })
    .then((xml) => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      return Array.from(doc.getElementsByTagName('entry'))
        .filter((entry) => !entry.getElementsByTagName('link')[0]?.getAttribute('href')?.includes('/shorts/'))
        .map((entry) => {
        const text = (tag: string) => entry.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
        return {
          videoId: text('yt:videoId'),
          title: text('title'),
          published: text('published'),
          description: text('media:description'),
        };
      });
    })
    .then((videos) => {
      if (videos.length === 0) throw new Error('Feed had no videos');
      return videos;
    });
  latest.catch(() => {
    latest = undefined; // allow a retry on the next visit
  });
  return latest.then((v) => v.slice(0, limit));
}
