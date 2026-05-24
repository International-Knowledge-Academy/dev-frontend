import { test, expect } from "@playwright/test";
import { loginAsManager } from "../helpers/auth";

test.describe("Account Manager — Programs", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsManager(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/account-manager/programs");
    await expect(page.getByRole("heading", { name: "Programs" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("create form — submit disabled when required fields empty", async ({ page }) => {
    await page.goto("/account-manager/programs/create");
    await expect(page.getByRole("button", { name: /create program/i })).toBeDisabled();
  });

  test("clicking a row opens program detail", async ({ page }) => {
    await page.goto("/account-manager/programs");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/account-manager\/programs\/.+/);
  });
});
