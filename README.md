# Korea, The Long Way

Static website for [kiggaboi77.com](https://kiggaboi77.com/) — Korean culture explained in English for travelers, expats and the curious.

## Pages

- `index.html` — home: hero, why the long way, four chapters, article journey, Korean word of the day, about, email signup
- `privacy.html` — privacy policy (includes the Google AdSense cookie disclosure)

## Design

- `assets/img/hero.svg` — hand-built illustration: a hanok under the moon, a pine, misty mountains and a long road winding to the horizon (*meon gil*, "the long way"). Swap in a photo by changing the `<img class="hero-art">` source.
- `assets/img/dancheong.svg` — band pattern inspired by dancheong temple painting
- `assets/img/lattice.svg` — hanok window-lattice background
- Red *dojang* seal mark with 길 (gil, "road") as the logo

## Adding a new article

Edit the `posts` array in `assets/script.js`. Posts without a `url` show as **COMING SOON**; add the WordPress permalink once published.

## Run locally

```bash
python3 -m http.server 8000
```

## To do

- Replace `your-email@example.com` (footer and privacy page) with the real contact address
- Replace the featured article link with its WordPress permalink
- Connect the subscribe form to an email service
