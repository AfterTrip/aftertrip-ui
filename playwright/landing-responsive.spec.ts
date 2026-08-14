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

test("home navigation opens the dashboard", async ({ page }) => {
  await page.goto("/");
  const myTripsLink = page.getByRole("link", { name: /^My Trips$/i });
  if (!(await myTripsLink.isVisible().catch(() => false))) {
    await page.getByRole("button", { name: /Open menu/i }).click();
  }
  await page.getByRole("link", { name: /^My Trips$/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: /^My Trips$/i })
  ).toBeVisible();
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

for (const width of widths) {
  test(`legal page has no horizontal overflow at ${width}px`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/legal");

    await expect(
      page.getByRole("heading", { name: /Terms and Privacy/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Terms of Service/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Your privacy matters/i })
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

test("login legal links open the shared legal sections", async ({ page }) => {
  await page.goto("/login");
  await page.locator('a[href="/legal#terms"]:visible').first().click();
  await expect(page).toHaveURL(/\/legal#terms$/);
  await expect(
    page.getByRole("heading", { name: /Terms of Service/i })
  ).toBeVisible();

  await page.goto("/login");
  await page.locator('a[href="/legal#privacy"]:visible').first().click();
  await expect(page).toHaveURL(/\/legal#privacy$/);
  await expect(
    page.getByRole("heading", { name: /Your privacy matters/i })
  ).toBeVisible();
});

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
    await expect(page.locator(".dashboard-side-nav")).not.toContainText(
      "Drafts"
    );
    await expect(page.locator(".dashboard-side-nav")).not.toContainText(
      "Bookmarks"
    );

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

  await page.getByRole("tab", { name: /^Bookmarks$/i }).click();
  await expect(page.getByText("Meghalaya Road Trip")).toBeVisible();
  await expect(page.getByText("Kashmir in Spring")).toBeVisible();
  await expect(page.getByText("Munnar Monsoon Escape")).toBeHidden();
});

for (const width of widths) {
  test(`create trip journey has no horizontal overflow at ${width}px`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/dashboard/create-trip");

    await expect(
      page.getByRole("heading", { name: /^Create Trip$/i })
    ).toBeVisible();
    await expect(page.getByText(/Cover photo/i)).toBeVisible();

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
  test(`travel footprint page has no horizontal overflow at ${width}px`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/dashboard/travel-footprint");

    await expect(
      page.getByRole("heading", { name: /Sreehari P/i })
    ).toBeVisible();
    await expect(page.getByText("Travel DNA")).toBeVisible();

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
      );
    });

    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("create trip moves quickly through the journey", async ({ page }) => {
  await page.goto("/dashboard/create-trip");
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(
    page.getByText(/Tell people what this trip felt like/i)
  ).toBeVisible();
  await expect(page.locator(".create-stepper button.incomplete")).toContainText(
    "Basics"
  );
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(page.getByText(/Day-by-day itinerary/i)).toBeVisible();
  await page.getByRole("button", { name: /Add another day/i }).click();
  await expect(page.getByText("Day 2")).toBeVisible();
  await page.getByRole("button", { name: "Remove day 2" }).click();
  await expect(page.getByText("Day 2")).toHaveCount(0);
  await expect(
    page.locator(".create-stepper button.incomplete", { hasText: "About Trip" })
  ).toBeVisible();
});

test("create trip media uploads can be previewed and removed", async ({
  page
}) => {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAEAAAAAwCAIAAAAuKetIAAAAeElEQVR4nO3YQQ6AIAwEwbn/pb2YEYRmAyYtRF8M57V0tZQAlmVZliVyu0eiNXW1e4P9hz6XXc4tD0ErK39rL77wVYs8d/4CVLJJDZrU3s9+W8s5zw6SVg8A4rQBMg4YIUMJMbASyYuXQF3lYADvL1nVb8bAPKS8Yg6uT6rAAAAAElFTkSuQmCC",
    "base64"
  );
  const video = Buffer.from([
    0, 0, 0, 24, 102, 116, 121, 112, 109, 112, 52, 50, 0, 0, 0, 0, 109, 112, 52,
    50, 105, 115, 111, 109
  ]);

  await page.goto("/dashboard/create-trip");
  await page.getByRole("button", { name: /About Trip/i }).click();
  await page.locator(".media-upload-panel input[type=file]").setInputFiles([
    { name: "mountain.png", mimeType: "image/png", buffer: png },
    { name: "waterfall.mp4", mimeType: "video/mp4", buffer: video }
  ]);

  await expect(page.locator(".media-strip article")).toHaveCount(2);
  await page.getByRole("button", { name: "Preview mountain.png" }).click();
  await expect(
    page.getByRole("dialog", { name: "Uploaded media preview" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Close media preview" }).click();

  await page.getByRole("button", { name: "Preview waterfall.mp4" }).click();
  await expect(
    page.locator(".create-media-lightbox video[controls]")
  ).toBeVisible();
  await page.getByRole("button", { name: "Close media preview" }).click();

  await page.getByRole("button", { name: "Remove mountain.png" }).click();
  await expect(page.locator(".media-strip article")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Preview mountain.png" })
  ).toHaveCount(0);
});

test("create trip dates cannot be in the future", async ({ page }) => {
  await page.goto("/dashboard/create-trip");
  const dateInputs = page.locator('input[type="date"]');
  const maxDate = await dateInputs.first().getAttribute("max");

  expect(maxDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await expect(dateInputs.nth(1)).toHaveAttribute("max", maxDate || "");

  const [year, month, day] = (maxDate || "2026-08-10").split("-").map(Number);
  const futureDate = new Date(Date.UTC(year, month - 1, day + 1));
  const futureDateString = futureDate.toISOString().slice(0, 10);

  await dateInputs.first().fill(futureDateString);
  await expect(dateInputs.first()).not.toHaveValue(futureDateString);
  await dateInputs.nth(1).fill(futureDateString);
  await expect(dateInputs.nth(1)).not.toHaveValue(futureDateString);
});

test("create trip budget is required and supports ranges", async ({ page }) => {
  await page.goto("/dashboard/create-trip");
  await expect(
    page.getByRole("button", { name: /Stay & Transport/i })
  ).toHaveCount(0);

  await page.getByRole("button", { name: /Budget/i }).click();
  await expect(page.getByRole("heading", { name: /^Budget$/i })).toBeVisible();
  await expect(
    page.getByText(/All budget values are per person/i)
  ).toBeVisible();

  await page.getByRole("button", { name: /Continue/i }).click();
  await expect(
    page.locator(".create-stepper button.incomplete", { hasText: "Budget" })
  ).toBeVisible();

  await page.getByRole("button", { name: /Budget/i }).click();
  await page.getByRole("button", { name: "INR" }).click();
  await page.getByRole("option", { name: "USD" }).click();
  await expect(page.getByRole("button", { name: "USD" })).toBeVisible();
  await page.getByRole("button", { name: /Budget range/i }).click();
  await page.getByPlaceholder("e.g. 20000").fill("20k000");
  await expect(page.getByPlaceholder("e.g. 20000")).toHaveValue("20000");
  await page.getByPlaceholder("e.g. 30000").fill("30,000");
  await expect(page.getByPlaceholder("e.g. 30000")).toHaveValue("30000");
  await page.getByRole("button", { name: /Continue/i }).click();

  await expect(page.getByText(/Review your trip/i)).toBeVisible();
  await expect(
    page.getByText(/Published trips are visible to everyone/i)
  ).toBeVisible();
  await expect(page.getByText(/Publish summary/i)).toHaveCount(0);
  await expect(page.getByText(/What will be shown publicly/i)).toHaveCount(0);
  await expect(page.getByText(/Visibility & sharing/i)).toHaveCount(0);
  await expect(
    page.locator(".review-checklist p", { hasText: "Budget" })
  ).toContainText("Completed");
});

test("create trip review uses uploaded cover as full preview", async ({
  page
}) => {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAEAAAAAwCAIAAAAuKetIAAAAeElEQVR4nO3YQQ6AIAwEwbn/pb2YEYRmAyYtRF8M57V0tZQAlmVZliVyu0eiNXW1e4P9hz6XXc4tD0ErK39rL77wVYs8d/4CVLJJDZrU3s9+W8s5zw6SVg8A4rQBMg4YIUMJMbASyYuXQF3lYADvL1nVb8bAPKS8Yg6uT6rAAAAAElFTkSuQmCC",
    "base64"
  );

  await page.goto("/dashboard/create-trip");
  await page.getByRole("button", { name: /Budget/i }).click();
  await page.getByPlaceholder("e.g. 25000").fill("25000");
  await page.getByRole("button", { name: /Basics/i }).click();
  await page
    .getByPlaceholder("e.g. Magical Meghalaya Escape")
    .fill("Cover Check Trip");
  await page
    .getByPlaceholder("Search and select a real place")
    .fill("Meghalaya");
  await page
    .locator(".verified-place-results button", { hasText: "Meghalaya, India" })
    .click();
  await page.locator('input[type="date"]').first().fill("2024-05-01");
  await page.locator('input[type="date"]').nth(1).fill("2024-05-05");
  await page.locator('.cover-upload input[type="file"]').first().setInputFiles({
    name: "cover.png",
    mimeType: "image/png",
    buffer: png
  });
  await page.getByRole("button", { name: "Friends" }).click();
  await page.getByRole("button", { name: /About Trip/i }).click();
  await page
    .getByPlaceholder("Share a short intro about your trip...")
    .fill("A compact route through mist and waterfalls.");
  await page.getByRole("button", { name: "Nature" }).click();
  await page.getByRole("button", { name: /Review/i }).click();

  const reviewMetrics = await page.evaluate(() => {
    const card = document
      .querySelector(".trip-preview-card")
      ?.getBoundingClientRect();
    const cover = document
      .querySelector(".trip-preview-card > .native-photo-preview")
      ?.getBoundingClientRect();
    return {
      card: card && {
        width: Math.round(card.width),
        height: Math.round(card.height)
      },
      cover: cover && {
        width: Math.round(cover.width),
        height: Math.round(cover.height)
      },
      nestedPreviewSquares: document.querySelectorAll(
        ".trip-preview-card > div > span"
      ).length
    };
  });

  expect(reviewMetrics.cover).toEqual(reviewMetrics.card);
  expect(reviewMetrics.nestedPreviewSquares).toBe(0);
});
