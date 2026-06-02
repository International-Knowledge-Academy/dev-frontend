import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Categories", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads with table", async ({ page }) => {
    await page.goto("/admin/categories");
    // Two <h1> exist (breadcrumb + PageHeader) — use first()
    await expect(page.getByRole("heading", { name: "Categories" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("create button navigates to create page", async ({ page }) => {
    await page.goto("/admin/categories");
    // "Add Category" is a <button onClick={navigate(...)}>, not an <a>
    await page.getByRole("button", { name: "Add Category" }).click();
    await page.waitForURL(/\/admin\/categories\/create/);
    await expect(page.getByRole("heading", { name: "Create Category" }).first()).toBeVisible();
  });

  test("create form — submit button disabled when name is empty", async ({ page }) => {
    await page.goto("/admin/categories/create");
    await expect(page.getByRole("button", { name: /create category/i })).toBeDisabled();
  });

  test("create form — submit button enabled when name is filled", async ({ page }) => {
    await page.goto("/admin/categories/create");
    await page.getByPlaceholder("e.g. Leadership Training").fill("Test Category");
    await expect(page.getByRole("button", { name: /create category/i })).toBeEnabled();
  });

  test("create a new category and land on list", async ({ page }) => {
    const name = `E2E Category ${Date.now()}`;
    await page.goto("/admin/categories/create");
    await page.getByPlaceholder("e.g. Leadership Training").fill(name);
    await page.getByRole("button", { name: /create category/i }).click();
    // waitForURL proves the POST succeeded and the app redirected back
    await page.waitForURL("**/admin/categories");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
  });

  test("clicking a row opens category detail", async ({ page }) => {
    await page.goto("/admin/categories");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/categories\/.+/);
  });

  test("edit page loads pre-filled data", async ({ page }) => {
    await page.goto("/admin/categories");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    // Click the inline Edit button in the first row (not the row itself)
    await page.locator("table tbody tr").first().getByRole("button", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/admin\/categories\/.+\/edit/);
    await expect(page.getByPlaceholder("e.g. Leadership Training").first()).not.toHaveValue("");
  });
});
