import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Partnerships", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/partnerships");
    await expect(page.getByRole("heading", { name: "Partnerships" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("add partnership button navigates to create page", async ({ page }) => {
    await page.goto("/admin/partnerships");
    await page.getByRole("button", { name: /add partnership/i }).click();
    await page.waitForURL(/\/admin\/partnerships\/create/);
    await expect(page.getByRole("heading", { name: /add partnership/i }).first()).toBeVisible();
  });

  test("create form — submit disabled when required fields empty", async ({ page }) => {
    await page.goto("/admin/partnerships/create");
    await expect(page.getByRole("button", { name: /create partnership/i })).toBeDisabled();
  });

  test("create form — submit enabled when required fields filled", async ({ page }) => {
    await page.goto("/admin/partnerships/create");
    await page.getByPlaceholder("Acme Corporation").fill("Test Partner");
    await page.locator("select").selectOption({ index: 1 });
    await expect(page.getByRole("button", { name: /create partnership/i })).toBeEnabled();
  });

  test("clicking a row opens partnership detail", async ({ page }) => {
    await page.goto("/admin/partnerships");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/partnerships\/.+/);
  });
});
