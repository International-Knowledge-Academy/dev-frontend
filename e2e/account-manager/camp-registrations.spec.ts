import { test, expect } from "@playwright/test";
import { loginAsManager } from "../helpers/auth";

test.describe.skip("Account Manager — Camp Registrations", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsManager(page);
  });

  test("list page loads with heading", async ({ page }) => {
    await page.goto("/account-manager/camp-registrations");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading", { name: /Camp Registrations/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test("table renders with rows", async ({ page }) => {
    await page.goto("/account-manager/camp-registrations");
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    expect(await page.locator("table tbody tr").count()).toBeGreaterThan(0);
  });

  test("clicking a table row opens detail page", async ({ page }) => {
    await page.goto("/account-manager/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/account-manager\/camp-registrations\/.+/);
  });

  test("detail page shows participant info", async ({ page }) => {
    await page.goto("/account-manager/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByText(/Participant|participant/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("detail page has action dropdown button", async ({ page }) => {
    await page.goto("/account-manager/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await page.waitForLoadState("domcontentloaded");
    const actionsBtn = page.getByRole("button", { name: /actions/i }).first();
    await expect(actionsBtn).toBeVisible({ timeout: 8000 });
  });

  test("detail page back button returns to list", async ({ page }) => {
    await page.goto("/account-manager/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await page.waitForLoadState("domcontentloaded");
    const backBtn = page.getByRole("button", { name: /back/i }).first();
    await expect(backBtn).toBeVisible({ timeout: 6000 });
    await backBtn.click();
    await expect(page).toHaveURL(/\/account-manager\/camp-registrations$/);
  });
});
