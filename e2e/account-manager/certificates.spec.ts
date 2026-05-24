import { test, expect } from "@playwright/test";
import { loginAsManager } from "../helpers/auth";

test.describe("Account Manager — Certificates", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsManager(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/account-manager/certificates");
    await expect(page.getByRole("heading", { name: "Certificates" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("issue certificate button navigates to create page", async ({ page }) => {
    await page.goto("/account-manager/certificates");
    await page.getByRole("button", { name: /issue certificate/i }).click();
    await page.waitForURL(/\/account-manager\/certificates\/create/);
    await expect(page.getByRole("heading", { name: /issue certificate/i }).first()).toBeVisible();
  });

  test("create form — submit disabled when required fields empty", async ({ page }) => {
    await page.goto("/account-manager/certificates/create");
    await expect(page.getByRole("button", { name: /issue certificate/i })).toBeDisabled();
  });

  test("clicking a row opens certificate detail", async ({ page }) => {
    await page.goto("/account-manager/certificates");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/account-manager\/certificates\/.+/);
  });
});
