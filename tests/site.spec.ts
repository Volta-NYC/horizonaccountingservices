import { test, expect } from "@playwright/test";
test("desktop: local assets, real content, service details and contact validation", async ({
  page,
}) => {
  const failures: string[] = [];
  page.on("pageerror", (e) => failures.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Less worry.More possibility.",
  );
  await expect(page.locator(".hero-image img")).toHaveJSProperty(
    "complete",
    true,
  );
  await expect(page.locator(".hero-image img")).not.toHaveJSProperty(
    "naturalWidth",
    0,
  );
  await page.locator("#services").scrollIntoViewIfNeeded();
  await page.locator(".service-card").nth(1).locator("summary").click();
  await expect(
    page.getByText("Bank & credit card reconciliations", { exact: true }),
  ).toBeVisible();
  await page.locator(".service-card").nth(1).getByRole("link").click();
  await expect(page.locator("#contact")).toBeInViewport();
  await page.getByRole("button", { name: "Start the conversation" }).click();
  await expect(page.locator('input[name="name"]')).toBeFocused();
  await page.getByLabel("Your name").fill("Website test");
  await page.getByLabel("Email address").fill("test@example.com");
  await page
    .getByLabel("A little about what you need")
    .fill("Preview test; no email sent.");
  await page.getByRole("button", { name: "Start the conversation" }).click();
  await expect(page.getByRole("status")).toContainText("email draft");
  expect(failures).toEqual([]);
});
for (const width of [320, 360, 390, 768, 1440])
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        (imgs as HTMLImageElement[])
          .filter((i) => i.complete && !i.naturalWidth)
          .map((i) => i.src),
      );
    expect(broken).toEqual([]);
  });
test("mobile navigation and expandable services", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByLabel("Open navigation").click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByText("Our services")
    .click();
  await expect(page.locator("#services")).toBeInViewport();
  await page.locator(".service-card").first().locator("summary").click();
  await expect(
    page.getByText("State registration & EIN assistance"),
  ).toBeVisible();
});
test("reduced motion keeps hero readable and static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page
      .locator(".horizon-experience")
      .evaluate((el) => (el as HTMLElement).offsetHeight),
  ).toBeLessThanOrEqual(900);
  await expect(page.locator(".horizon-canvas")).toBeHidden();
});
test("no JavaScript preserves content, service expansion and contact links", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator(".service-card").first().locator("summary").click();
  await expect(
    page.getByText("State registration & EIN assistance"),
  ).toBeVisible();
  expect(
    await page
      .locator('a[href="mailto:info@horizonaccountingservices.com"]')
      .count(),
  ).toBeGreaterThan(0);
  await page.goto("/privacy");
  await expect(
    page.getByRole("heading", { name: "Privacy policy", exact: true }),
  ).toBeVisible();
  await context.close();
});
test("scroll choreography and pause remain stable", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() =>
    document
      .querySelector(".horizon-experience")
      ?.classList.contains("motion-active"),
  );
  await page.evaluate(() => window.scrollTo(0, 350));
  await page.waitForTimeout(650);
  const p = await page
    .locator(".horizon-experience")
    .evaluate((el) =>
      Number((el as HTMLElement).style.getPropertyValue("--progress")),
    );
  expect(p).toBeGreaterThan(0.1);
  const before = await page
    .locator(".horizon-experience")
    .evaluate((el) => el.getBoundingClientRect().height);
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  const after = await page
    .locator(".horizon-experience")
    .evaluate((el) => el.getBoundingClientRect().height);
  expect(after).toBe(before);
});
test("legacy links resolve and privacy is available", async ({ request }) => {
  for (const url of [
    "/home",
    "/contact",
    "/privacypolicy",
    "/services-store/p/basic-service-jsn4g",
  ]) {
    const r = await request.get(url);
    expect(r.ok()).toBe(true);
  }
  expect((await request.get("/missing-page")).status()).toBe(404);
});

test("WebGL renders real pixels, preserves the poster on context loss, and reports no GL errors", async ({
  page,
}) => {
  await page.route("**/media/horizon-scroll-*.mp4", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".horizon-canvas")).toHaveCSS("opacity", "1");
  const diagnostics = await page.locator("canvas").evaluate((el) => {
    const gl = (el as HTMLCanvasElement).getContext("webgl")!;
    return {
      error: gl.getError(),
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
      lost: gl.isContextLost(),
    };
  });
  expect(diagnostics.error).toBe(0);
  expect(diagnostics.width).toBeGreaterThan(300);
  expect(diagnostics.lost).toBe(false);
  await page
    .locator("canvas")
    .evaluate((el) =>
      (el as HTMLCanvasElement)
        .getContext("webgl")
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext(),
    );
  await expect(page.locator(".horizon-canvas")).toHaveCSS("opacity", "0");
  await expect(page.locator(".hero-image img")).toBeVisible();
});

test("WCAG automated checks on desktop, mobile and privacy", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const [url, width] of [
    ["/", 1440],
    ["/", 390],
    ["/privacy", 1440],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  }
});
