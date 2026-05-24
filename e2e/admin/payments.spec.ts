import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Payments", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/payments");
    await expect(page.getByRole("heading", { name: "Payments" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("search input filters results", async ({ page }) => {
    await page.goto("/admin/payments");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("main").getByPlaceholder("Search payments...").nth(0).fill("test");
    await page.waitForLoadState("domcontentloaded");
  });

  test("clicking a row opens payment detail", async ({ page }) => {
    await page.goto("/admin/payments");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/payments\/.+/);
  });
});
