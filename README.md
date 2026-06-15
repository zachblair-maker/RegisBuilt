# RegisBuilt — Website Rebuild

A modern, fluid, single-page marketing site for **RegisBuilt**, self storage
design & construction specialists (Australia & New Zealand).

The site is built to do one job well: **build trust and prove capability**.
It's fast, dependency-free, accessible, and easy to maintain.

## Brand

| Token | Hex | Use |
|-------|-----|-----|
| Charcoal | `#14161A` / `#1E2125` | Anchor sections (hero, projects, CTA, footer) |
| International Orange | `#FF4F00` | Primary accent / calls to action |
| White / paper | `#FFFFFF` / `#F5F6F8` | Editorial light sections |
| Charcoal ink | `#1E2125` | Body text on light |

Type: **Fraunces** (editorial serif display) + **Inter** (body), via Google
Fonts with a system-font fallback. The design alternates light editorial
sections with deep charcoal-grey anchor sections for a premium, non-"ecommerce" feel.

## Stack

Plain **HTML + CSS + vanilla JS** — no build step, no framework, no
dependencies. Open `index.html` in any browser, or serve the folder.

```
index.html           # home
team.html            # team page (pulled from the live About page)
assets/
  css/styles.css     # full design system
  js/main.js         # header state, mobile nav, scroll reveals,
                     # counters, active-nav, form
  img/projects/*.svg # branded placeholder project imagery (see below)
  img/team/*.svg     # initial-based placeholder team avatars
```

Office: **26 Connell Road, Oakleigh VIC 3167** · 1300 388 224 ·
info@regisbuilt.com.au

### Run locally

```bash
# any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

## Features

- Sticky header that condenses on scroll, with mobile hamburger menu
- Animated gradient-mesh hero with skyline + pointer parallax
- Scroll-reveal animations with staggered cascades (IntersectionObserver)
- Animated statistic counters
- Auto-scrolling client logo marquee
- Services, 5-step process timeline, project grid, about, testimonial, CTA
- Accessible contact form (demo handler — wire up to email/CRM to go live)
- Fully responsive; respects `prefers-reduced-motion`

## Images — IMPORTANT

The placeholder images in `assets/img/projects/` are branded SVGs, **not** the
real project photos. The build environment's network policy blocked access to
`regisbuilt.com.au` and image CDNs, so the original photography could not be
downloaded automatically.

To use the real photos, see **[`assets/img/IMAGES.md`](assets/img/IMAGES.md)**
for the exact list of slots and the two-step swap process.

## Content sources

Company details (services, projects, 1300 number, address, brand voice) were
compiled from public sources about RegisBuilt. Please review copy for accuracy
before publishing — particularly project dates and statistics.

## Going live — next steps

1. Drop in the real project photos (see `IMAGES.md`).
2. Connect the contact form to an email service or CRM endpoint.
3. Confirm all copy and figures with the RegisBuilt team.
4. Add analytics + a real Open Graph share image.
