import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test.describe("Admin — Trainers", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/trainers");
    await expect(page.getByRole("heading", { name: "Trainers" }).first()).toBeVisible();
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
  });

  test("create form — submit disabled when required fields empty", async ({ page }) => {
    await page.goto("/admin/trainers/create");
    await expect(page.getByRole("button", { name: /create trainer|add trainer/i })).toBeDisabled();
  });

  test("create form — submit enabled when required fields filled", async ({ page }) => {
    await page.goto("/admin/trainers/create");
    await page.getByPlaceholder("Jane Smith").fill("John Doe");
    await page.getByPlaceholder("jane@example.com").fill("john@example.com");
    await page.getByPlaceholder("Senior Consultant").fill("Senior Trainer");
    await expect(page.getByRole("button", { name: /create trainer|add trainer/i })).toBeEnabled();
  });

  test("clicking a row opens trainer detail", async ({ page }) => {
    await page.goto("/admin/trainers");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/trainers\/.+/);
  });
});
