import { test, expect } from "@playwright/test";

test.describe("Public — Contact", () => {
  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("contact form is visible", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("form, [class*='form']").first()).toBeVisible();
  });

  test("submit button is visible", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("button", { name: /send|submit/i }).first()).toBeVisible();
  });
});
