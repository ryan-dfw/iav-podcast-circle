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
