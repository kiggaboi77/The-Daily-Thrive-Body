# Life in America — Blogger theme for oneofkind77.com

A modern Blogger (Blogspot) theme for an English blog about everyday life in the United States.

- **Upload file:** `dist/oneofkind77-blogger-theme.xml`
- **Preview (sample content):** `blogger-theme/preview/index.html`, `preview/post.html`

## Install

1. **Back up your current theme first:** Blogger → **Theme** → ▾ (next to *Customize*) → **Backup** → *Download*.
2. Same menu → **Restore** → upload `oneofkind77-blogger-theme.xml`.
3. Blogger → **Layout**:
   - **Nav** (top menu) and **Footer** use the *Pages* gadget — click *Edit* and tick the pages to show (e.g. About, Contact, Privacy Policy).
   - **Topics** shows your labels; **Popular** shows your most-read posts.
   - **Ad slot** (below posts): *Add a Gadget* → *AdSense* if you want a fixed ad unit. Auto ads work without it.

The blog title in the header, hero and footer comes from **Settings → Title**, so it updates automatically.

## What's in it

- Home page: dusk hero (suburban street, city skyline, road into town), six "Start here" guide cards, latest posts as cards, topics (labels), most read, and a search box.
- Label, search and archive pages use the same card grid with a heading.
- Post pages: large title, label, author and date, readable article typography, tags, comments, newer/older links.
- Page-not-found view with search.
- Light and dark mode, mobile menu, no external scripts.

Guide cards link to `/search?q=…` (housing, credit, insurance, driving, work, culture), so they always show matching posts even before labels exist.

## Editing

Edit the sources in `src/` and rebuild:

```bash
node blogger-theme/src/gen-hero.mjs   # only if you change the hero illustration
python3 blogger-theme/build.py
```

`build.py` inlines `skin.css`, `script.js` and `hero.svg` into `template.xml`, checks the XML is well-formed, and regenerates the previews.
