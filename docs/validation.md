# Validation

Validated against a fresh production build served at http://127.0.0.1:3000.

- `npm run build`: passed, static home/privacy pages and route metadata generated.
- `npm run lint`: TypeScript check passed.
- `npm test`: all 18 Playwright tests passed.
- `npm audit --audit-level=high`: zero vulnerabilities reported.
- All 15 distinct source images downloaded successfully and have optimized local WebP versions.
- Browser checks cover 320, 360, 390, 768 and 1440 px widths; source image loading; contact validation and email-draft preparation (no email sent); expandable service details; mobile navigation; legacy route redirects; privacy; and 404 behavior.
- Reduced-motion and disabled-JavaScript sessions preserve readable content and working service/contact links.
- When film requests are deliberately blocked, the WebGL fallback initializes without GL errors. Simulated context loss exposes the underlying poster; the page remains usable. Pause does not collapse the scroll section or shift its height.
- Desktop and portrait videos decode correctly. Browser-presented frame timestamps match scroll positions at 20%, 85%, 40%, 100% and 0%, including reverse seeks. Pause retains the same video element and current frame; resume catches up.
- Reduced-motion and no-JavaScript contexts request no MP4s.
- Separate Chromium desktop/mobile and WebKit mobile-viewport checks decoded the correct local source, scrubbed to 4 seconds, and reported no page or media errors. Real-device iOS testing has not been performed.
- Both MP4s have all 121 frames independently seekable, no audio, and the moov index before mdat. The 1760×990 crop excludes the fixed lower-right watermark; opening and later frames were visually reviewed. Original uploaded copies retain identical checksums.
- Axe automated WCAG 2 A/AA and 2.1 AA checks found zero violations on desktop, mobile, and the privacy page. This does not replace a complete manual accessibility audit.
- Desktop hero, scroll chapter, service grid, founder section, mobile hero and contact views were captured for visual review. Temporary screenshots and the frame timing report are under `artifacts/` (gitignored).

Initial Higgsfield generation was blocked by the account's plan. The user later supplied a Kling film, which is now cropped, optimized and integrated as the primary scroll media. WebGL is retained as a video-error fallback. No public deployment has been performed. Contact opens a draft in the visitor's email app; there is no mail-sending backend.
