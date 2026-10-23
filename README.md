# IAV Podcast Circle

Freelance client project, in progress. A website for a podcast and community brand. It replaces a set of disconnected, AI-generated Canva pages with one site the client owns.

**Worth a quick look, not a deep one.** It's a small, early-stage build: real client content has started landing (an episode's guest photo, the book's back-cover copy and early-reader signup), but most of the rest is still placeholder awaiting her input. What's interesting is the brief and how it was scoped, more than the code volume.

## The brief

The client sent an LLM-generated developer handoff. It mixed real intent (pages, palette, tone) with technology the AI had named on her behalf: Webflow, Stripe, Memberstack, Mailchimp, a login portal and a CMS. Her actual workflow was: record the podcast, have AI write up the episode, paste it into Canva, publish one page per episode.

## What I did

- **Reconstructed her existing episode page** from the live Canva site (text, artwork and layout) as a native React page. Her old URL redirects to it.
- **Turned episodes into data.** Each episode is a typed content file rendered by one template. Adding Episode 2 means adding a file, not building another page.
- **Built five sections from her spec** — About, Podcast, Articles, The Book, The Circle — in her palette and typography, responsive and keyboard/screen-reader friendly. The original six-page list (which also named Newsletter and Resources as standalone pages) folded those into About and The Circle once the site had a shape of its own; old links still redirect.
- **Brought in real content as it arrived**: the first episode's guest photo, and the book's back-cover description and early-reader signup copy, preserving her italics.
- **Deliberately didn't build** the CMS, payments, login or newsletter integration. None of those had a real decision behind them yet. Each has a clear integration point instead, and the UI marks unconnected parts visibly — a "Sample" tag or a white X on anything inert — so a draft can't be mistaken for a finished site.
- **Kept it light:** a static site with no backend. YouTube video and channel info are fetched live rather than hardcoded.

## Status

Design draft for client review. Content is filling in piece by piece as she sends it; everything else stays clearly marked as a placeholder.

## Stack

React 19 · TypeScript · Vite · React Router · CSS Modules · Netlify
