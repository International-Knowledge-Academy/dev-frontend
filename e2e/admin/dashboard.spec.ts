import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dashboard page loads", async ({ page }) => {
    await page.goto("/admin/default");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/admin\/default/);
    await expect(page.getByRole("heading", { name: "Dashboard" }).first()).toBeVisible();
  });

  test("sidebar nav is visible", async ({ page }) => {
    await page.goto("/admin/default");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("nav, aside").first()).toBeVisible();
  });
});
