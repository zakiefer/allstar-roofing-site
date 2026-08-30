# All Star Roofing & Exteriors — website

Static website generated from the Claude Design handoff package
("Modern Heartland Site Design", final revision). No build step, no
framework — plain HTML + CSS + one small `site.js`. Host it anywhere
that serves static files (Netlify, Vercel, Cloudflare Pages, GitHub
Pages, S3…).

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `residential.html` | Residential & commercial roofing |
| `farmers.html` | We Love Farmers (agricultural) |
| `storm.html` | Storm damage & insurance |
| `exteriors.html` | Exteriors & financing |
| `stories.html` | Customer stories |
| `about.html` | About the team |
| `contact.html` | Free inspection request |

## Run locally

```bash
python3 -m http.server 4173
```

then open http://localhost:4173

## Notes

- `site.js` powers the mobile menu, scroll-reveal animations, the
  click-to-play YouTube embeds, and the contact form.
- The contact form submits via FormSubmit.co to 812allstar@gmail.com
  (see FORM_ENDPOINT in site.js to change the recipient). IMPORTANT:
  the first-ever submission triggers FormSubmit's one-time activation
  email to that inbox — it must be confirmed once before submissions
  are delivered. On network failure the form shows a call-us fallback
  message instead of a false success.
- Select dropdowns use `appearance:none` with a drawn chevron so they
  render identically in Safari, Chrome, and Firefox (Safari's native
  select ignores field padding and draws a double-arrow control).
- All images are local in `assets/` (the AI-generated hero/section
  images were downloaded from the design's CDN links and compressed).
- Fonts load from Google Fonts (Besley, Barlow, Barlow Condensed, Caveat).
- Open items flagged in the design's fact sheet: confirm the BBB A+
  rating and Owens Corning certification are current, verify the
  YouTube video id (1Y6Z1zN5d-4), and confirm the 5-year labor
  warranty wording.
