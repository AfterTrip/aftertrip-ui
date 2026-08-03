import { expect, test } from "@playwright/test";

const widths = [320, 390, 768, 1024, 1440];

for (const width of widths) {
  test(`landing page has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Real journeys/i })).toBeVisible();
    await expect(page.getByRole("search")).toBeVisible();

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });

    expect(overflow).toBeLessThanOrEqual(1);
  });
}
