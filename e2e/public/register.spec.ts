import { test, expect } from "@playwright/test";

test.describe("Public — Program Registration", () => {
  test("register page loads with step 1", async ({ page }) => {
    await page.goto("/register/program");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading", { name: /register for a program/i }).first()).toBeVisible();
  });

  test("step indicator shows Select Program as first step", async ({ page }) => {
    await page.goto("/register/program");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByText(/select program/i).first()).toBeVisible();
  });

  test("continue button is disabled until program is selected", async ({ page }) => {
    await page.goto("/register/program");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  test("trainer registration page loads", async ({ page }) => {
    await page.goto("/register/trainer");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});
