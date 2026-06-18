import { test, expect } from "@playwright/test";

test.describe.skip("Public — Camp Registration", () => {
  test("camp registration page loads", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("submit button is disabled when form is empty", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    const submit = page.getByRole("button", { name: /submit|register/i }).first();
    await expect(submit).toBeDisabled();
  });

  test("age range inputs are hidden from the user", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    const minAge = page.locator('input[name="min_age"]');
    const maxAge = page.locator('input[name="max_age"]');
    if (await minAge.count() > 0) await expect(minAge).toBeHidden();
    if (await maxAge.count() > 0) await expect(maxAge).toBeHidden();
  });

  test("first name field is present and accepts input", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    const firstName = page.getByLabel(/first name/i).first();
    await expect(firstName).toBeVisible();
    await firstName.fill("Ahmed");
    await expect(firstName).toHaveValue("Ahmed");
  });

  test("email field validates format", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    const emailInput = page.getByLabel(/email/i).first();
    if (await emailInput.count() === 0) return;
    await emailInput.fill("notanemail");
    await emailInput.blur();
    // either browser validation or custom error message
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    const hasError = await page.getByText(/valid email|invalid email/i).count() > 0;
    expect(isInvalid || hasError).toBeTruthy();
  });

  test("camp type selector is present", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    // should have a selector for Youth Camp vs Future Leaders Camp
    const selector = page.locator("select, [role='listbox'], [role='combobox']").first();
    await expect(selector).toBeVisible({ timeout: 8000 });
  });
});
