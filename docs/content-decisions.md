# Source and editorial decisions

All 16 Markdown files in `raw messy data/` were read. The homepage is the strongest source for the business story. Service product pages provide detailed inclusions. Contact and privacy pages supply real contact details and the existing privacy policy.

- Brand: Horizon Accounting Services, based in Jacksonville; virtual bookkeeping, payroll support, business formation and fractional CFO services.
- Lillian has over 15 years of private and public accounting experience. No invented surname, CPA designation, certification, address, hours, client count or results.
- The homepage prices ($150 / $250 monthly / $400 monthly / $750 monthly) conflict with product prices ($250 / $500 / $2,500 / $3,000, unspecified cadence). All price claims are omitted pending owner confirmation. Services invite a conversation instead of offering a fake checkout.
- The privacy policy says the business is not a tax preparation or tax advisory firm. The homepage describes Lillian personally as a licensed tax preparer. The site does not promote tax preparation as a service; coordination with the client's tax professional is retained.
- Squarespace stock template paragraphs, placeholder about-page imagery, empty cart, broken newsletter text, and reCAPTCHA artifacts are excluded from marketing content.
- Testimonials retain the source meaning and attribution; typographic punctuation is normalized. No star ratings or verified-review claims are added.
- All 15 distinct source media URLs are locally archived and optimized. `media-manifest.json` maps each URL to its original and WebP file and source documents. Concatenated sitemap URLs are separated before parsing. Original unused template assets are archived but not loaded by the site.
- The coastal image and the subsequently supplied Kling film are atmospheric AI-generated media, not representations of an actual business property. The real Lillian portrait is from the source. The user-supplied film is now the scroll hero, with exact first-frame posters and the prior WebGL treatment as a video-error fallback.
- No backend, booking provider, or email credentials were supplied. The contact form explicitly opens an email draft; it never claims delivery. Telephone and direct email links work without JavaScript.
- Existing source routes redirect to their relevant homepage sections; privacy has its own page. The old generic template route returns 404.
