# IAV Podcast Circle

Website for **IAV Podcast Circle**, a talent-amplifying podcast and community hosted by Isha Vazquez. It replaces the previous per-episode Canva pages with one site the client owns.

**Status:** design draft. Structure, design and Episode 01 are in place; client content, the newsletter provider and Circle membership are still to come (see [Not built yet](#not-built-yet)).

Built with Vite, React 19, TypeScript and React Router. It's a static site with no backend; content lives in typed local files.

## Getting started

Requires Node 22+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the built site locally
```

Dev and production builds render identical content.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero, featured guests, newsletter signup |
| `/about` | About the host |
| `/podcast` | Podcast hub: latest episode or playlist, episode grid, "Be a Guest" |
| `/podcast/:slug` | Episode page, rendered from episode data |
| `/newsletter` | Newsletter signup |
| `/resources` | Curated resources by category |
| `/circle` | IAV Circle: themes, events, benefits |
| `/episode01` | Redirects to `/podcast/episode-01` (legacy Canva URL) |

## Project structure

```
src/
  config/        site identity, contact, socials; integration switches
  content/       all editable content + the content access layer (index.ts)
    episodes/    one file per episode + registry
  services/      external boundaries: newsletter, YouTube metadata
  components/    layout shell, UI primitives, podcast/episode/newsletter/etc.
  pages/         one component per route
  hooks/         page metadata, YouTube metadata
  styles/        design tokens (client palette + type) and global CSS
public/          images and episode artwork
```

Pages read content only through `src/content/index.ts`, so the local data could later be swapped for a CMS without touching components.

## Adding an episode

1. Copy `src/content/episodes/episode-01.ts` to `episode-02.ts` and replace the content. Sections are made of paragraphs, pull quotes and notes.
2. Add it to the array in `src/content/episodes/index.ts`.
3. Optional: put banner artwork in `public/episodes/<slug>/` and reference it as `heroImage`.

The episode then appears on the Podcast hub and at `/podcast/<slug>`, and with `featured: true` its guest appears on the home page. Video titles are fetched live from YouTube via oEmbed; only the video ID is stored.

## Configuration

Optional environment variables (see `.env.example`):

| Variable | Effect when set |
| --- | --- |
| `VITE_YOUTUBE_PLAYLIST_ID` | Podcast hub embeds the full playlist instead of the latest episode |
| `VITE_CIRCLE_JOIN_URL` | "Join the Circle" becomes a real link |

Nothing needs to be set for the site to build and run.

## Not built yet

These wait on decisions from the client. Placeholders are marked on the page with "Sample" tags or a white X over unconnected buttons.

- **Newsletter:** the signup form validates and calls `subscribeToNewsletter()`; no provider is connected. Add an adapter in `src/services/newsletter/`.
- **Circle membership:** no payments, accounts or gated content. The join button activates once `VITE_CIRCLE_JOIN_URL` is set.
- **Events calendar:** events are local data read through `getUpcomingEvents()`.
- **CMS:** not needed yet; see the content access layer above.

Content marked `sample: true` in `src/content/` is placeholder and should be replaced or removed.

## Deployment

Deployed on Netlify. `netlify.toml` sets the build command, the `dist/` publish directory and the single-page-app rewrite so every route loads directly.
