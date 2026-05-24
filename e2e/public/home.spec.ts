import { test, expect } from "@playwright/test";

test.describe("Public — Home", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\//);
    await expect(page.locator("body")).toBeVisible();
  });

  test("nav links are visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("header, nav").first()).toBeVisible();
  });

  test("sign in page is accessible", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByPlaceholder("mail@example.com")).toBeVisible();
  });
});
