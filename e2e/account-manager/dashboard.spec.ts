import { test, expect } from "@playwright/test";
import { loginAsManager } from "../helpers/auth";

test.describe("Account Manager — Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsManager(page);
  });

  test("dashboard page loads", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/account-manager/);
    await expect(page.getByRole("heading", { name: "Dashboard" }).first()).toBeVisible();
  });

  test("sidebar nav is visible", async ({ page }) => {
    await expect(page.locator("nav, aside").first()).toBeVisible();
  });
});
