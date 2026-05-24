import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Services", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/services");
    await expect(page.getByRole("heading", { name: "Services" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("add service button navigates to create page", async ({ page }) => {
    await page.goto("/admin/services");
    await page.getByRole("button", { name: /add service|new service/i }).click();
    await page.waitForURL(/\/admin\/services\/create/);
    await expect(page.getByRole("heading", { name: /new service|create service/i }).first()).toBeVisible();
  });

  test("create form — submit disabled when required fields empty", async ({ page }) => {
    await page.goto("/admin/services/create");
    await expect(page.getByRole("button", { name: /create service/i })).toBeDisabled();
  });

  test("create form — submit enabled when required fields filled", async ({ page }) => {
    await page.goto("/admin/services/create");
    await page.getByPlaceholder("e.g. Airport Transfer").fill("Test Service");
    await page.getByPlaceholder("Brief description of the service...").fill("Test description");
    await expect(page.getByRole("button", { name: /create service/i })).toBeEnabled();
  });

  test("clicking a row opens service detail", async ({ page }) => {
    await page.goto("/admin/services");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/services\/.+/);
  });
});
