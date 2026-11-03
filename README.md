# IAV Podcast Circle

Freelance client project. A website for a podcast, a coaching practice and the community around them, live at **[iavcircle.com](https://iavcircle.com)**. It replaces a set of disconnected, AI-generated Canva pages with one site the client owns.

**Status: beta.** The site is live and in client testing.

## The brief

The client sent an LLM-generated developer handoff. It mixed real intent (pages, palette, tone) with technology the AI had named on her behalf: Webflow, Stripe, Memberstack, Mailchimp, a login portal and a CMS. Her actual workflow was: record the podcast, have AI write up the episode, paste it into Canva, publish one page per episode.

Each subsequent brief arrives the same way — a fresh HTML mockup, with the design and the implied architecture rerolled from scratch. Most of the work at each handoff is separating what she wants from what the generator happened to produce that day.

## What I did

- **Reconstructed her existing episode page** from the live Canva site (text, artwork and layout) as a native React page. Her old URL redirects to it.
- **Turned episodes into data.** Each episode is a typed content file rendered by one template. Adding Episode 2 means adding a file, not building another page.
- **Built the site from her spec** — About, Podcast, Articles, The Book, The Circle, Book a Consultation — in her palette and typography, responsive and keyboard/screen-reader friendly. Pages the original list named separately (Newsletter, Resources) folded into others once the site had a shape of its own; old links still redirect.
- **Built the Circle Starter**, her free seven-day journal, as a paginated web experience with a downloadable PDF — gated by email, with no accounts and no database. See below.
- **Added a speaking-request flow** for event bookers, on its own page behind the third option on the booking page.
- **Deliberately didn't build** the CMS, payments, login or newsletter integration. None of those had a real decision behind them yet. Each has a clear integration point instead, and the UI marks unconnected parts visibly — a "Sample" tag or a white X on anything inert — so a draft can't be mistaken for a finished site.

## The Circle Starter

The client's goal was to collect email addresses she can reach later, and to have them be real addresses rather than typos. She did not want a CRM, a paid SaaS tier, or user accounts. So there are none.

A reader enters an email; a Netlify Function signs a short payload with HMAC-SHA256 and emails back a link carrying it. The signature is the only credential — the server stores nothing and remembers nothing between requests, and the same function family serves the journal's prose and the PDF only when a valid signature is presented. Neither the prose nor the PDF ships in the client bundle, so the gate is real rather than cosmetic.

Design decisions worth naming, since they are choices and not oversights:

- **A link is shareable.** Anyone holding one can read the journal. For a free resource that is the right trade against making people create accounts. There is no secret here worth attacking.
- **Rotating `CIRCLE_KIT_SECRET` invalidates every link ever issued.** That is the revoke-everything lever, and the reason the secret is the only piece of state the system has.
- **Nothing anyone writes in the journal leaves their browser.** The writable lines persist to `localStorage` and are never transmitted. Losing them is a stated consequence, not a bug — the client did not want custody of what people write, and the page says so.
- **Two intents, one pipe.** The home page's signup and the book page's "notify me" use the same function; a flag in the payload decides whether she gets *"X got the free kit"* or *"X wants the book"*.

Speaking requests go through Netlify Forms instead, deliberately: that path needs no sending domain of its own, so it works the moment it deploys. Netlify only registers a form it can see in static HTML at build time, so a hidden copy of the field names lives in `index.html` — change one and you must change both.

## Running it locally

```sh
npm install
npm run dev          # Vite only; the kit endpoints are not available
netlify dev          # Vite plus the functions
```

`netlify dev` reads `.env` (not `.env.local`, which is the Vite convention) and reads it **once, at startup** — restart after changing it.

| Variable | Purpose |
| --- | --- |
| `CIRCLE_KIT_SECRET` | Signing key for access links. Any high-entropy string; rotating it revokes all outstanding links. |
| `RESEND_API_KEY` | Transactional email. |
| `KIT_FROM_EMAIL` | Sender. Must be on a domain verified in the same Resend account as the key. |
| `KIT_NOTIFY_EMAIL` | Where signup notifications go. |
| `SITE_URL` | Base URL used in emailed links. Falls back to Netlify's `URL`. |

There is no fallback sender. If `KIT_FROM_EMAIL` is unset the send fails loudly, which is the point: a default sender would deliver to the account owner and silently fail for everyone else.

## Stack

React 19 · TypeScript · Vite · React Router · CSS Modules · Netlify Functions · Resend · Netlify Forms

Static output with a prerender pass (`scripts/prerender.mjs`), no framework backend, no database. YouTube video and channel data are fetched live rather than hardcoded.
