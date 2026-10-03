# Horizon Accounting Services

A responsive Next.js website built from the 16 source documents in `raw messy data/`.

## Run

```sh
npm ci
npm run dev
```

Production: `npm run build && npm start`. Validation: `npm run lint`, `npm test` (install Chromium once with `npx playwright install chromium`).

## Experience

- Locally hosted, scroll-scrubbed coastal film, with a WebGL poster fallback.
- Native scrolling drives camera depth, typography chapters and progress; no scroll hijacking.
- Reduced-motion, pause, no-JavaScript, video-error and WebGL-loss paths preserve readable content.
- Four service detail disclosures, source-backed biography/testimonials, responsive navigation and source privacy policy.
- All source media downloaded and optimized to WebP; local Manrope variable font with OFL license.
- Contact form composes an email in the visitor's own app. It is explicitly labeled and does **not** send or store messages on a server. Phone and email links are also supplied. A direct-submission form would need a real email service and secure server-side credentials.
- Original source URL paths redirect to the relevant new section.

## Important content decisions

Source prices disagree, so the site requests a conversation instead of publishing uncertain prices. No unverified credentials, statistics, addresses, hours or tax preparation services are advertised. See `docs/content-decisions.md` and `docs/media-manifest.json`.

## Coastal film

Initial Higgsfield generation was blocked by the account's plan. The user subsequently supplied a Kling video. Its fixed watermark was cropped out while preserving the original files. The final experience now scrubs that real video by native scroll position.

The two self-hosted MP4s are 3.6 MiB desktop and 1.9 MiB mobile, silent H.264, with faststart and every frame a keyframe. Matching first-frame WebP posters prevent loading flashes. Reduced-motion and no-JavaScript sessions download no film. A failed video returns to the existing WebGL treatment; a working video does not run a hidden WebGL renderer.

To reproduce the assets: `bash scripts/prepare-horizon-video.sh` (requires ffmpeg and the installed Sharp dependency). Crop, source checksum, generation history and playback details are documented in `docs/motion-direction.md` and `docs/video-assets.json`.

## Key files

- `src/app/page.tsx`: source-grounded page content
- `src/app/globals.css`: responsive visual system
- `src/lib/components/horizon-experience.tsx`: scroll and motion lifecycle
- `src/lib/ocean-renderer.ts`: shoreline-masked water shader
- `src/lib/components/contact-form.tsx`: email composer
- `scripts/download-source-media.mjs`: recursive source-media download
- `tests/site.spec.ts`: production browser checks

This project is built and previewed locally, not deployed to a public host.
