# WELCOME TO KOREA, THE LONG WAY

Website and WordPress theme for [kiggaboi77.com](https://kiggaboi77.com/) — Korean culture explained in English.

## WordPress theme

- Source: `wordpress-theme/korea-the-long-way/`
- Ready to upload: **`dist/korea-the-long-way.zip`**

### Install

1. WordPress admin → **Appearance → Themes → Add New Theme → Upload Theme**
2. Choose `korea-the-long-way.zip` → **Install Now** → **Activate**

> On WordPress.com, uploading a custom theme requires a plan that allows themes and plugins (Business / Creator). Self-hosted WordPress needs no plan.

### What happens on activation

- Creates **About**, **Contact Us** and **Privacy Policy** pages from `inc/pages/*.html`. Pages that already exist with slugs `about`, `contact-us` or `privacy-policy` are **not** changed — paste the content from those files instead if you want it.
- If the homepage is set to "Your latest posts", creates **Home** and **Articles** pages and sets them as the homepage and posts page (Settings → Reading).

### Afterwards

- **Menus** (Appearance → Menus): assign *Primary* and *Footer*, or leave empty to get the automatic About / Articles / Contact Us / Privacy Policy links.
- **Hero photo** (Appearance → Customize → Header Image): optional; replaces the illustration.
- **Chapters** link to categories with these slugs if they exist: `etiquette`, `food`, `k-pop-k-drama`, `holidays`, `language`, `korea-and-america`.
- **AdSense**: add the code with Site Kit by Google (or Auto ads); ad units can also go in the *After Post Content* widget area.

## Static preview

`index.html`, `about.html`, `contact.html` and `privacy.html` are a plain-HTML preview of the same design:

```bash
python3 -m http.server 8000
```
