import { test, expect } from "@playwright/test";

for (const [width, file] of [
  [1440, "desktop"],
  [390, "mobile"],
] as const) {
  test(`${file} film decodes and scrubs forward and backward to the requested frame`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const video = page.locator("video");
    await expect(video).toHaveCSS("opacity", "1");
    await expect(video).toHaveJSProperty("paused", true);
    expect(
      await video.evaluate((v) => (v as HTMLVideoElement).currentSrc),
    ).toContain(`horizon-scroll-${file}.mp4`);
    await video.evaluate((el) => {
      const v = el as HTMLVideoElement;
      const frame: VideoFrameRequestCallback = (_, metadata) => {
        v.dataset.presentedTime = String(metadata.mediaTime);
        v.requestVideoFrameCallback(frame);
      };
      v.requestVideoFrameCallback(frame);
    });
    const frames: Buffer[] = [];
    for (const progress of [0.2, 0.85, 0.4, 1, 0]) {
      await page.evaluate((p) => {
        document.documentElement.style.scrollBehavior = "auto";
        const hero = document.querySelector(
          ".horizon-experience",
        ) as HTMLElement;
        window.scrollTo(
          0,
          hero.offsetTop + (hero.offsetHeight - innerHeight) * p,
        );
      }, progress);
      const expected = Math.round(progress * 120) / 24;
      // Verify a decoded frame presented by the browser, not just assigned currentTime.
      await expect
        .poll(
          () =>
            video.evaluate((v) =>
              Number((v as HTMLVideoElement).dataset.presentedTime),
            ),
          { timeout: 10000 },
        )
        .toBeCloseTo(expected, 1);
      await expect
        .poll(() => video.evaluate((v) => (v as HTMLVideoElement).seeking))
        .toBe(false);
      frames.push(await video.screenshot());
    }
    expect(frames[0].equals(frames[1])).toBe(false);
    expect(frames[1].equals(frames[2])).toBe(false);
  });
}

test("pause preserves the decoded frame and resume catches up without replacing the video", async ({
  page,
}) => {
  await page.goto("/");
  const video = page.locator("video");
  await expect(video).toHaveCSS("opacity", "1");
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 200);
  });
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0.3);
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).seeking))
    .toBe(false);
  const time = await video.evaluate((v) => {
    v.setAttribute("data-identity", "original");
    return (v as HTMLVideoElement).currentTime;
  });
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(200);
  await expect(video).toHaveJSProperty("currentTime", time);
  await expect(video).toHaveAttribute("data-identity", "original");
  await page
    .getByRole("button", { name: "Enable motion", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(time + 0.3);
  await expect(video).toHaveAttribute("data-identity", "original");
});

for (const mode of ["reduced", "no-js"] as const) {
  test(`${mode} does not download the film`, async ({ browser }) => {
    const context = await browser.newContext(
      mode === "no-js"
        ? { javaScriptEnabled: false }
        : { reducedMotion: "reduce" },
    );
    const page = await context.newPage();
    const movieRequests: string[] = [];
    page.on("request", (r) => {
      if (r.url().endsWith(".mp4")) movieRequests.push(r.url());
    });
    await page.goto("/");
    await expect(page.locator(".hero-image img")).toBeVisible();
    await expect(page.locator("video")).toHaveCount(0);
    expect(movieRequests).toEqual([]);
    await context.close();
  });
}
