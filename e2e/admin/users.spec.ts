import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Users", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { name: "Users" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("clicking a row opens user detail", async ({ page }) => {
    await page.goto("/admin/users");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/users\/.+/);
  });

  test("edit page save button is enabled (pre-filled data)", async ({ page }) => {
    await page.goto("/admin/users");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().getByRole("button", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/admin\/users\/.+\/edit/);
    await expect(page.getByRole("button", { name: /save|update/i })).toBeEnabled();
  });
});
