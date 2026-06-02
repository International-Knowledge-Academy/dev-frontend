import { test, expect } from "@playwright/test";

test.describe("Public — Programs", () => {
  test("programs list page loads", async ({ page }) => {
    await page.goto("/programs");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("search input is visible", async ({ page }) => {
    await page.goto("/programs");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByPlaceholder("Search programs...").first()).toBeVisible();
  });

  test("program cards or empty state loads", async ({ page }) => {
    await page.goto("/programs");
    // Programs load async — wait for either a card or an empty-state message
    await expect(
      page.locator("article").first()
        .or(page.locator("a[href*='/programs/']").first())
        .or(page.getByText(/no programs|no results/i).first())
    ).toBeVisible({ timeout: 15000 });
  });

  test("clicking a program card navigates to program detail", async ({ page }) => {
    await page.goto("/programs");
    await page.waitForLoadState("domcontentloaded");
    const firstCard = page.locator("a[href*='/programs/']").first();
    const count = await firstCard.count();
    if (count > 0) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/programs\/.+/);
    }
  });
});
