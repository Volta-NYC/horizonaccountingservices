# Motion direction

## Visual direction
Quiet confidence. A broad coastal horizon, deep Atlantic navy, warm ivory, muted sage. Aerial coastal imagery evokes the Jacksonville source location without making an exact location claim. The opening message links financial clarity to the owner's personal freedom.

## Film now integrated

Initial Higgsfield generation was blocked by the account's plan. The user later supplied `kling_20261003_VIDEO_A_single_u_1223_0.mp4`, a 1916 × 1080, 24 fps, 121-frame Kling export lasting 5.041667 seconds. Both uploaded copies are preserved unchanged.

The fixed lower-right watermark is outside a 1760 × 990 crop at x=78, y=0: this trims 90 bottom pixels and 78 pixels per side, keeping 16:9 framing and the horizon intact. This is a crop, not inpainting. Sampled frames across the shot were visually reviewed.

`scripts/prepare-horizon-video.sh` produces local, silent H.264/yuv420p, faststart MP4s with every frame a keyframe:
- `horizon-scroll-desktop.mp4`: 1280 × 720, about 3.6 MiB.
- `horizon-scroll-mobile.mp4`: a centered portrait crop at 576 × 1024, about 1.9 MiB.
- `horizon-film-poster.webp` and `horizon-film-mobile.webp`: exact opening frames, for loading, reduced-motion and no-JavaScript views.

Native scroll maps to the 121 source frames. Seeks are quantized to 1/24 second and coalesced while a seek is in flight. Pause retains the same video element and decoded frame; resume catches up to scroll position. A media-query hook selects one source on the video element. This avoids source-child error events from a skipped media alternative being mistaken for a total video failure.

The video is mounted only after motion preferences are known. Reduced-motion and no-JavaScript sessions make no MP4 requests. Video loading errors activate the existing WebGL/poster treatment. The WebGL renderer does not run underneath a working film. Browser tests verify actual presented frame timestamps, in both directions, on desktop and mobile.

Asset metadata, crop parameters, original checksum and MP4 atom order are in `docs/video-assets.json`.

## Poster generation
Built-in imagegen tool. Original: `/Users/henryzhao/.codex/generated_images/01a0fa9f-7c94-7982-91fe-b86704386bf0/exec-07f1368d-d937-4d93-86b3-be74bbc99de7.png`.
Local deliverables: `/public/media/horizon-poster.webp` (desktop), `/public/media/horizon-mobile.webp` (portrait crop).

Prompt: “Create a photoreal cinematic photograph for a premium accounting brand website background. Wide landscape 16:9 composition, high resolution. A serene northeast Florida Atlantic barrier island at dawn photographed by a drone from 150 feet. Ocean occupies left 65 percent, dark inky navy teal water with fine gentle ripples. Elegant thin ivory sandy shore curves from bottom right toward middle horizon, dark muted sage coastal marsh and dunes on the right. Perfectly level distant horizon at upper third, dusky gray-blue sky, subtle apricot soft sunlight on the horizon to the right, gentle mist in far distance. Sophisticated travel magazine landscape photography, fine grain, natural realistic topography, restrained desaturated colors. Airy atmospheric upper third, deep blue shadows in the water. Beautiful contemplative quiet mood. Not tropical, no mountains, no buildings, no people, no boats, no text, no graphics, no watermarks. This is an atmospheric brand image, not a specific identified property.”

## WebGL treatment

If the video fails to load, the poster is uploaded as a single WebGL texture. A coastline mask limits subtle two-frequency displacement and light shimmer to the water; the skyline and sand stay stable. Desktop pointer input gently influences the water. Native scroll drives the slow camera push and two typography chapters. A single shader pass, capped device pixel ratio, and offscreen suspension limit GPU work. This fallback is a still-image shader treatment; the normal experience uses the supplied film.

## Safeguards
Native scroll, requestAnimationFrame transforms, no scroll interception. WebGL is decorative and the original image always sits below it. Canvas resolution capped at 1.5 DPR. Animation stops offscreen, in hidden tabs, and via pause control. Reduced motion renders the static hero. Without JavaScript, all marketing copy, links, native details and portrait remain readable. No autoplay audio. No hidden-loading gate.
