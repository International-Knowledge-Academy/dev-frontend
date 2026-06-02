import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Certificates", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/certificates");
    await expect(page.getByRole("heading", { name: "Certificates" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("issue certificate button navigates to create page", async ({ page }) => {
    await page.goto("/admin/certificates");
    await page.getByRole("button", { name: /issue certificate/i }).click();
    await page.waitForURL(/\/admin\/certificates\/create/);
    await expect(page.getByRole("heading", { name: /issue certificate/i }).first()).toBeVisible();
  });

  test("create form — submit disabled when required fields empty", async ({ page }) => {
    await page.goto("/admin/certificates/create");
    await expect(page.getByRole("button", { name: /issue certificate/i })).toBeDisabled();
  });

  test("clicking a row opens certificate detail", async ({ page }) => {
    await page.goto("/admin/certificates");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/certificates\/.+/);
  });
});
