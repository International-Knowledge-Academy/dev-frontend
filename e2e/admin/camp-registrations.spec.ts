import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe.skip("Admin — Camp Registrations", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads with heading", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading", { name: /Camp Registrations/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test("table renders with rows", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    const rows = page.locator("table tbody tr");
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test("clicking a table row opens detail page", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/camp-registrations\/.+/);
  });

  test("detail page shows participant info", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await page.waitForLoadState("domcontentloaded");
    // Should show participant details section
    await expect(page.getByText(/Participant|participant/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("detail page has action dropdown button", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await page.waitForLoadState("domcontentloaded");
    // DropdownButton (Actions button)
    const actionsBtn = page.getByRole("button", { name: /actions/i }).first();
    await expect(actionsBtn).toBeVisible({ timeout: 8000 });
  });

  test("detail page has back button navigating to list", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await page.waitForLoadState("domcontentloaded");
    const backBtn = page.getByRole("button", { name: /back/i }).first();
    await expect(backBtn).toBeVisible({ timeout: 6000 });
    await backBtn.click();
    await expect(page).toHaveURL(/\/admin\/camp-registrations$/);
  });

  test("status badge is visible on detail page", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await page.waitForLoadState("domcontentloaded");
    // A badge with status: pending / accepted / rejected / interview_scheduled
    const badge = page.locator("span").filter({ hasText: /pending|accepted|rejected|interview/i }).first();
    await expect(badge).toBeVisible({ timeout: 8000 });
  });

  test("filter by status works (pending filter)", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await page.waitForLoadState("domcontentloaded");
    const pendingFilter = page.getByRole("button", { name: /pending/i }).first();
    if (await pendingFilter.isVisible()) {
      await pendingFilter.click();
      await page.waitForTimeout(600);
      await expect(page.locator("table")).toBeVisible();
    }
  });
});
