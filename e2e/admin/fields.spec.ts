import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Fields", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/fields");
    await expect(page.getByRole("heading", { name: "Fields" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("create form — submit disabled when required fields empty", async ({ page }) => {
    await page.goto("/admin/fields/create");
    await expect(page.getByRole("button", { name: /create field/i })).toBeDisabled();
  });

  test("create form — submit enabled when all required fields filled", async ({ page }) => {
    await page.goto("/admin/fields/create");
    await page.getByPlaceholder("e.g. Technology").fill("Test Field");
    await page.getByPlaceholder("Brief description of this field...").fill("Test description");
    // Category is a native <select> — pick first non-empty option
    await page.locator("select").selectOption({ index: 1 });
    await expect(page.getByRole("button", { name: /create field/i })).toBeEnabled();
  });

  test("clicking a row opens field detail", async ({ page }) => {
    await page.goto("/admin/fields");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/fields\/.+/);
  });

  test("edit page loads pre-filled data", async ({ page }) => {
    await page.goto("/admin/fields");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().getByRole("button", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/admin\/fields\/.+\/edit/);
    await expect(page.getByPlaceholder("e.g. Technology").first()).not.toHaveValue("");
  });
});
