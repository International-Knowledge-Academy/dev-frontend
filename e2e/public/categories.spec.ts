import { test, expect } from "@playwright/test";

test.describe("Public — Categories", () => {
  test("categories page loads with heading", async ({ page }) => {
    await page.goto("/categories");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading", { name: /training categories/i }).first()).toBeVisible();
  });

  test("category cards are visible", async ({ page }) => {
    await page.goto("/categories");
    await page.waitForLoadState("domcontentloaded");
    // Either category cards or an empty state should be visible
    const hasContent = await page.locator("main a, main [class*='card']").count();
    expect(hasContent).toBeGreaterThan(0);
  });
});
