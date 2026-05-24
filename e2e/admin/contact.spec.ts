import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Contact Submissions", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/contact");
    await expect(page.getByRole("heading", { name: /contact/i }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("search input is functional", async ({ page }) => {
    await page.goto("/admin/contact");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("main").getByPlaceholder(/search by name/i).nth(0).fill("test");
    await page.waitForLoadState("domcontentloaded");
  });

  test("edit button opens contact edit page", async ({ page }) => {
    await page.goto("/admin/contact");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().getByRole("button", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/admin\/contact\/.+\/edit/);
  });
});
