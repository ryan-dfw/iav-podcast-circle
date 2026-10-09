/**
 * External integration settings — the single place to "switch on" a service
 * once the client has decided what she actually wants.
 *
 * Nothing here is connected yet, on purpose. Each value is `null` until a real
 * decision (and real account) exists. Values can come from Vite env vars so
 * they never have to be committed: copy `.env.example` to `.env.local`.
 */

const env = import.meta.env;

function optional(value: string | undefined): string | null {
  return value && value.trim() ? value.trim() : null;
}

export const integrations = {
  youtube: {
    /** Full-show playlist for the Podcast hub. Falls back to the latest episode's video. */
    playlistId: optional(env.VITE_YOUTUBE_PLAYLIST_ID),
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
    /**
     * Where "Join the Circle" should go once membership is real (a checkout
     * link, an application form, etc.). Until then the CTA opens an email to
     * the client so interest isn't lost. No payments or accounts are built.
     */
    joinUrl: optional(env.VITE_CIRCLE_JOIN_URL),
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
