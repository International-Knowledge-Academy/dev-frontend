import { test, expect } from "@playwright/test";

test.describe("Public — About", () => {
  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("page has content", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("main")).toBeVisible();
  });
});
