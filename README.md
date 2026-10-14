# IAV Podcast Circle

Freelance client project, in progress. A website for a podcast and community brand. It replaces a set of disconnected, AI-generated Canva pages with one site the client owns.

**Worth a quick look, not a deep one.** It's a small, early-stage build, and much of what you'll see is placeholder awaiting client content. What's interesting is the brief and how it was scoped, more than the code volume.

## The brief

The client sent an LLM-generated developer handoff. It mixed real intent (pages, palette, tone) with technology the AI had named on her behalf: Webflow, Stripe, Memberstack, Mailchimp, a login portal and a CMS. Her actual workflow was: record the podcast, have AI write up the episode, paste it into Canva, publish one page per episode. 


## What I did

- **Reconstructed her existing episode page** from the live Canva site (text, artwork and layout) as a native React page. Her old URL redirects to it.
- **Turned episodes into data.** Each episode is a typed content file rendered by one template. Adding Episode 2 means adding a file, not building another page.
- **Built the six pages from her spec** (Home, About, Podcast, Newsletter, Resources, Circle) in her palette and typography, responsive and keyboard/screen-reader friendly.
- **Deliberately didn't build** the CMS, payments, login or newsletter integration. None of those had a real decision behind them yet. Each has a clear integration point instead, and the UI marks unconnected parts visibly so a draft can't be mistaken for a finished site.
- **Kept it light:** a static site with no backend. YouTube titles are fetched live rather than hardcoded.

## Status

Design draft for client review.

## Stack

React 19 · TypeScript · Vite · React Router · CSS Modules · Netlify

