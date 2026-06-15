# Images

The site now uses **real RegisBuilt photography** pulled from the live
`regisbuilt.com.au` site. The branded SVG placeholders remain in the repo as
fallbacks but are no longer referenced by the pages.

## Team (`assets/img/team/`)

| File | Person | Role |
|------|--------|------|
| `anthony-regis.jpg`   | Anthony Regis    | Director |
| `ken-snow.jpg`        | Ken Snow         | Project Development Manager |
| `jason-crisafi.jpg`   | Jason Crisafi    | Project Manager |
| `jonathan-buzgau.jpg` | Jonathan Buzgau  | Contract Administrator |
| `areti-waterson.png`  | Areti Waterson   | Finance Manager |
| `kobe-regis.png`      | Kobe Regis       | "People Motivator" (the office dog) |

## Projects (`assets/img/projects/`)

| File | Slot | Photo |
|------|------|-------|
| `kennards-truganina.jpg`            | Kennards — Truganina (large) | Kennards Truganina exterior, dusk |
| `kennards-cranbourne.jpg`           | Kennards — Cranbourne West | Kennards two-storey exterior |
| `store-local-pakenham.jpg`          | Store Local — Pakenham | Real facility, orange roller doors (no competing brand shown) |
| `kennards-craigieburn.jpg`          | Kennards — Craigieburn | Kennards Craigieburn exterior (labelled source) |
| `public-self-storage-braybrook.jpg` | Public Self Storage — Braybrook | Public Self Storage aerial |
| `storhub-north-lakes.jpg`           | StorHub — North Lakes (large) | Aerial drone shot (brand not legible) |
| `about-team.jpg`                    | Home "about" section | RegisBuilt team on-site during construction |
| `gallery-1/2/3.jpg`                 | Case-study galleries (shared) | Reception fitout · storage corridor · steel-frame build |

> **Accuracy note:** photos are brand-accurate where a brand is visible. For the
> slots without a brand-matched original (Cranbourne, Store Local Pakenham,
> StorHub North Lakes) a real RegisBuilt facility photo that does **not** show a
> competing brand was used. Confirm the exact facility per case study with the
> RegisBuilt team before publishing.

## Clients (`assets/img/clients/`)

`kennards.png`, `storage-king.png`, `public-self-storage.png`,
`store-and-more.png`, `storelocal.png`, `jims.png` — shown in the trust marquee
on the home page.

## Re-pulling imagery

`node scripts/fetch-real-photos.mjs` re-downloads the team headshots + a hero
shot from the live site (solving SiteGround's bot challenge, with a Wayback
Machine fallback) and re-wires the HTML.
