import { expect, test } from "@playwright/test";

const widths = [320, 390, 768, 1024, 1440];

for (const width of widths) {
  test(`landing page has no horizontal overflow at ${width}px`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Real journeys/i })
    ).toBeVisible();
    await expect(page.getByRole("search")).toBeVisible();

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
      );
    });

    expect(overflow).toBeLessThanOrEqual(1);
  });
}

for (const width of widths) {
  test(`explore page has no horizontal overflow at ${width}px`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/explore");

    await expect(
      page.getByRole("heading", { name: /Explore/i }).first()
    ).toBeVisible();
    await expect(page.getByRole("search").first()).toBeVisible();

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
      );
    });

    expect(overflow).toBeLessThanOrEqual(1);
  });
}

for (const width of widths) {
  test(`trip detail page has no horizontal overflow at ${width}px`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/trips/meghalaya-clouds-caves-and-living-roots");

    await expect(
      page.getByRole("heading", { name: /Meghalaya/i }).first()
    ).toBeVisible();
    await expect(page.getByText(/Trip by Anisha Verma/i)).toBeVisible();

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
      );
    });

    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("destination and trip cards navigate to the right places", async ({
  page
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Bali 12.5K trips/i }).click();
  await expect(page).toHaveURL(/\/explore\?destination=Bali/);
  await expect(
    page.getByRole("heading", { name: /Explore/i }).first()
  ).toBeVisible();

  await page.goto("/explore");
  await page.locator(".explore-card-content").first().click();
  await expect(page).toHaveURL(/\/trips\//);
  await expect(page.getByRole("heading").first()).toBeVisible();
});

for (const width of widths) {
  test(`auth page has no horizontal overflow at ${width}px`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: /Continue to AfterTrip/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Continue with Google/i }).first()
    ).toBeVisible();

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
      );
    });

    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("login and signup routes render the shared auth flow", async ({
  page
}) => {
  await page.goto("/");
  const loginLink = page.getByRole("link", { name: /^Log in$/i });
  if (!(await loginLink.isVisible().catch(() => false))) {
    await page.getByRole("button", { name: /Open menu/i }).click();
  }
  await page.getByRole("link", { name: /^Log in$/i }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole("heading", { name: /Continue to AfterTrip/i }).first()
  ).toBeVisible();

  await page.goto("/signup");
  await expect(
    page.getByRole("heading", { name: /Continue to AfterTrip/i }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Continue with Google/i }).first()
  ).toBeVisible();
});

for (const width of widths) {
  test(`my trips dashboard has no horizontal overflow at ${width}px`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: /^My Trips$/i })
    ).toBeVisible();
    await expect(page.getByPlaceholder("Search my trips...")).toBeVisible();
    await expect(
      page.getByRole("tab", { name: /^Published$/i })
    ).toHaveAttribute("aria-selected", "true");

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
      );
    });

    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("my trips dashboard filters and switches tabs", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByPlaceholder("Search my trips...").fill("Bali");
  await expect(page.getByText("Bali: Island of Gods")).toBeVisible();
  await expect(page.getByText("Meghalaya Road Trip")).toBeHidden();

  await page.getByRole("tab", { name: /^Drafts$/i }).click();
  await expect(page.getByText("No trips found")).toBeVisible();
  await page.getByRole("button", { name: /Clear search/i }).click();
  await expect(page.getByText("Munnar Monsoon Escape")).toBeVisible();
});
