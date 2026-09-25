# Korea, The Long Way

Static website for [kiggaboi77.com](https://kiggaboi77.com/) — Korean culture explained in English for travelers, expats and the curious.

## Pages

- `index.html` — home: latest article, article list with topic filters, Korean word of the day, about, email signup
- `privacy.html` — privacy policy (includes the Google AdSense cookie disclosure)

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
