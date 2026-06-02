import { test, expect } from "@playwright/test";
import { loginAsManager } from "../helpers/auth";

test.describe("Account Manager — Contact Submissions", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsManager(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/account-manager/contact");
    await expect(page.getByRole("heading", { name: /contact/i }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("edit button opens contact edit page", async ({ page }) => {
    await page.goto("/account-manager/contact");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().getByRole("button", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/account-manager\/contact\/.+\/edit/);
  });
});
