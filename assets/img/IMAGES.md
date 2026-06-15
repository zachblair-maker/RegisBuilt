# Image slots

Every image on the site is referenced from `assets/img/projects/`. The files
currently in that folder are **branded SVG placeholders** so nothing renders
broken. Replace them with real RegisBuilt photography to finish the site.

## The slots

| File (placeholder) | Where it appears | Suggested photo |
|--------------------|------------------|-----------------|
| `kennards-truganina.svg`            | Projects (large) | Kennards Truganina exterior |
| `kennards-cranbourne.svg`           | Projects         | Kennards Cranbourne West |
| `store-local-pakenham.svg`          | Projects         | Store Local Pakenham |
| `kennards-craigieburn.svg`          | Projects         | Kennards Craigieburn |
| `public-self-storage-braybrook.svg` | Projects         | Public Self Storage Braybrook |
| `storhub-north-lakes.svg`           | Projects (large) | StorHub North Lakes |
| `about-team.svg`                    | About section    | Team / site / hero facility shot |

Recommended: landscape, ~1600×1067px or larger, JPG/WebP, optimised for web.

## How to swap in real photos

**Option A — keep the filenames simple (recommended)**

1. Save each photo as a `.jpg` (or `.webp`) using the base names above, e.g.
   `kennards-truganina.jpg`.
2. In `index.html`, update the matching `background-image:url('...svg')` to
   point at your new file extension. A one-line find/replace per image:
   `kennards-truganina.svg` → `kennards-truganina.jpg`.

**Option B — drop-in replacement, zero HTML edits**

Save your photos using the **exact existing filenames including the `.svg`
extension is not possible for JPGs** — so use Option A. (SVG is a vector
format; real photos are raster.)

## Why these aren't the originals

The site was built in an environment whose network policy blocked outbound
requests to `regisbuilt.com.au` and image CDNs (`host_not_allowed`). If you
re-run the build with a network policy that allows that host, the original
images can be pulled automatically — otherwise just drop them in here.
