#!/usr/bin/env bash
set -euo pipefail
# Retain the uploaded original. The bottom 90 pixels contain the fixed watermark.
input=${1:-public/media/kling_20261003_VIDEO_A_single_u_1223_0.mp4}
# Keep native source resolution (no downscale) and a short GOP so scrubbing stays cheap without all-intra bloat.
ffmpeg -hide_banner -loglevel error -y -i "$input" -map 0:v:0 -an -vf 'crop=1760:990:78:0,setsar=1' -c:v libx264 -preset slow -crf 20 -tune film -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -movflags +faststart public/media/horizon-scroll-desktop.mp4
ffmpeg -hide_banner -loglevel error -y -i "$input" -map 0:v:0 -an -vf 'crop=1760:990:78:0,crop=556:990:(iw-556)/2:0,setsar=1' -c:v libx264 -preset slow -crf 20 -tune film -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -movflags +faststart public/media/horizon-scroll-mobile.mp4
# Pipe exact first frames to Sharp for WebP (the local ffmpeg build lacks libwebp).
ffmpeg -hide_banner -loglevel error -i public/media/horizon-scroll-desktop.mp4 -frames:v 1 -f image2pipe -c:v png - | node --input-type=module -e 'import sharp from "sharp"; process.stdin.pipe(sharp().webp({quality:86})).pipe((await import("node:fs")).createWriteStream("public/media/horizon-film-poster.webp"));'
ffmpeg -hide_banner -loglevel error -i public/media/horizon-scroll-mobile.mp4 -frames:v 1 -f image2pipe -c:v png - | node --input-type=module -e 'import sharp from "sharp"; process.stdin.pipe(sharp().webp({quality:84})).pipe((await import("node:fs")).createWriteStream("public/media/horizon-film-mobile.webp"));'
