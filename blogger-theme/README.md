# Life in America — Blogger theme for oneofkind77.com

A modern Blogger (Blogspot) theme for an English blog about everyday life in the United States.

- **Upload file:** `dist/oneofkind77-theme-v6.xml` (same as `dist/oneofkind77-blogger-theme.xml`; the version number makes the newest download easy to spot)
- **Preview (sample content):** `blogger-theme/preview/index.html`, `preview/post.html`

## Install

1. **Back up your current theme first:** Blogger → **Theme** → ▾ (next to *Customize*) → **Backup** → *Download*.
2. Same menu → **Restore** → upload `oneofkind77-blogger-theme.xml`.
3. Blogger → **Layout**:
   - **Nav** (top menu) and **Footer** use the *Pages* gadget — click *Edit* and tick the pages to show (e.g. About, Contact, Privacy Policy).
   - **Start here topics** shows your labels (most-used first); **Popular** shows your most-read posts.
   - **Hero photo (home page)**: add an *Image* gadget with a real photo to replace the illustration.
   - **Ad slot** (below posts): *Add a Gadget* → *AdSense* if you want a fixed ad unit. Auto ads work without it.

The blog title in the header, hero and footer comes from **Settings → Title**, so it updates automatically.

## What's in it

- Home page focused on **Everyday Life in America** (a single focus is safer for AdSense review): hero, a "Start here" block on a desert Route 66 backdrop listing your real Blogger labels (so no link ever leads to an empty page), latest posts with the newest one featured wide on an Americana wallpaper (no flag), most read, and a search box.
- **Hero photo:** Layout → *Hero photo (home page)* → *Add a Gadget* → *Image* and upload a photo. It replaces the illustration as the full-screen background (upscaled automatically, with a dark gradient so the text stays readable). Remove the gadget to go back to the illustration.
- Label, search and archive pages use the same card grid with a heading.
- Post pages: large title, label, author and date, readable article typography, tags, comments, newer/older links.
- Page-not-found view with search.
- Light and dark mode, mobile menu, no external scripts.

Guide cards link to `/search?q=…` (housing, credit, insurance, driving, work, culture), so they always show matching posts even before labels exist.

## Editing

Edit the sources in `src/` and rebuild:

```bash
node blogger-theme/src/gen-hero.mjs          # only if you change the hero illustration
node blogger-theme/src/gen-backgrounds.mjs   # desert backdrop and Americana wallpaper
python3 blogger-theme/build.py
```

`build.py` inlines `skin.css`, `script.js` and the SVG backgrounds into `template.xml`, checks the XML is well-formed, and regenerates the previews.
