/**
 * External integration settings — the single place to "switch on" a service
 * once the client has decided what she actually wants.
 *
 * Nothing here is connected yet, on purpose. Each value is `null` until a real
 * decision (and real account) exists. Values can come from Vite env vars so
 * they never have to be committed: copy `.env.example` to `.env.local`.
 */

export const integrations = {
  youtube: {
    /** Channel whose newest videos feed the Podcast page (via the /api/youtube-feed proxy). */
    channelId: 'UCxfm6b5Y5mdn5vTh3fbRqcQ',
    channelUrl: 'https://www.youtube.com/@letstalkforabit',
  },

  spotify: {
    showUrl: 'https://open.spotify.com/show/2EcpQ0LE4GMmmbN42QNPcC',
  },

  newsletter: {
    /**
     * Which email provider handles signups. `null` = not connected; the form
     * still renders and tells visitors honestly that the list isn't open yet.
     * See `src/services/newsletter/` for where a provider adapter plugs in.
     */
    provider: null as null | 'custom',
  },

  circle: {
    /** Where "Join the Circle" goes — her Substack. */
    joinUrl: 'https://iavcircle.substack.com/?r=9dbnah&utm_campaign=pub-share-checklist' as string | null,
  },

  events: {
    /**
     * Events are local data for now (`src/content/events.ts`). If the client
     * later manages events in an external calendar, its feed/embed is
     * configured here and read through `getUpcomingEvents()`.
     */
    calendarSource: null as null | string,
  },
} as const;
