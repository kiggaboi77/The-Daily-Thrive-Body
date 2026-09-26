# Life in America — Blogger theme for oneofkind77.com

A modern Blogger (Blogspot) theme for an English blog about everyday life in the United States.

- **Upload file:** `dist/oneofkind77-theme-v11.xml` (same as `dist/oneofkind77-blogger-theme.xml`; the version number makes the newest download easy to spot)
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

## Topics (two connected series)

The site is organised around two main topics. Each groups several Blogger labels (`PILLARS` in `src/script.js`, and the matching boxes/menu links in `src/template.xml`):

| Topic | Labels | "See all" / menu link |
|---|---|---|
| Holidays & Seasons | Holidays & Culture, Halloween, Fall Guides, Travel & Outdoors | label *Holidays & Culture* |
| Money & Daily Life | Money & Insurance, Credit Cards | label *Money & Insurance* |

- **Home → Start here:** each topic lists its newest posts as numbered stops along a road (read from the blog's own feed).
- **Post pages → Keep reading:** up to three other posts from the same topic, the first marked *Next up*. A post with no topic label shows the newest posts on the blog instead.
- For the "See all" pages to show everything, give every post its topic's main label too (e.g. a Halloween post also gets *Holidays & Culture*).

Gadgets left over from a previous theme are kept in the hidden *Old gadgets* section; delete them in **Layout** to clean up.

## Pages (About, Contact, Privacy)

`pages/about-us.html`, `pages/contact-us.html` and `pages/privacy-policy.html` are clean page bodies (no inline styles) to paste into Blogger's page editor in **HTML view**. The theme styles them.

## Editing

Edit the sources in `src/` and rebuild:

```bash
node blogger-theme/src/gen-hero.mjs          # only if you change the hero illustration
node blogger-theme/src/gen-backgrounds.mjs   # desert backdrop and Americana wallpaper
python3 blogger-theme/build.py
```

`build.py` inlines `skin.css`, `script.js` and the SVG backgrounds into `template.xml`, checks the XML is well-formed, and regenerates the previews.
