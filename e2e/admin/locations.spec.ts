import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Locations", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/locations");
    await expect(page.getByRole("heading", { name: "Locations" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("create form — submit disabled when required fields empty", async ({ page }) => {
    await page.goto("/admin/locations/create");
    await expect(page.getByRole("button", { name: /create location/i })).toBeDisabled();
  });

  test("create a location", async ({ page }) => {
    const name = `E2E Location ${Date.now()}`;
    await page.goto("/admin/locations/create");
    await page.getByPlaceholder("Main Campus").fill(name);
    await page.getByPlaceholder("Dubai").fill("Riyadh");
    // Country is a SearchableDropdown — click trigger, pick first option
    await page.getByRole("button").filter({ hasText: "Select country..." }).click();
    await page.locator("ul li").first().click();
    await page.getByPlaceholder("123 Main St").fill("123 Test St");
    // Both Contact Phone and WhatsApp share the same placeholder
    await page.getByPlaceholder("+971 50 000 0000").first().fill("+966500000000");
    await page.getByPlaceholder("+971 50 000 0000").last().fill("+966500000000");
    await page.getByRole("button", { name: /create location/i }).click();
    // waitForURL proves the POST succeeded and the app redirected back
    await page.waitForURL("**/admin/locations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
  });

  test("clicking a row opens location detail", async ({ page }) => {
    await page.goto("/admin/locations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/locations\/.+/);
  });
});
