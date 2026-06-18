/**
 * Camp carousel + objectives + CTA tests.
 * Excluded from the staging run (testIgnore in playwright.config.ts) until
 * the camp feature is deployed. Run locally with:
 *   BASE_URL=http://localhost:3000 npx playwright test e2e/public/home-camp.spec.ts
 */
import { test, expect } from "@playwright/test";

test.describe("Public — Home Camp Sections", () => {
  test("camp carousel section is visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByText(/Gulf Young/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("camp carousel auto-advances to slide 2", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(6000);
    await expect(page.getByText(/Gulf Youth Camp/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("camp carousel next arrow navigates to slide 2", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("button", { name: /next slide/i }).click();
    await expect(page.getByText(/Gulf Youth Camp/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("camp carousel prev arrow wraps to last slide", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("button", { name: /previous slide/i }).click();
    await expect(page.getByText(/Gulf Future/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("camp carousel dot navigation works", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("button", { name: "Go to slide 3" }).click();
    await expect(page.getByText(/Gulf Future Leaders Camp/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("Register Your Interest CTA navigates to /register/camp", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("link", { name: /Register Your Interest/i }).first().click();
    await expect(page).toHaveURL(/\/register\/camp/);
  });

  test("camp objectives section is visible on scroll", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.evaluate(() => window.scrollBy(0, 800));
    await expect(page.getByText(/Camp Objectives/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("objective cards are rendered", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(600);
    await expect(page.getByText(/Confidence/i).first()).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/Leadership/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("camp CTA strip shows Places Are Limited", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.evaluate(() => window.scrollBy(0, 2000));
    await expect(page.getByText(/Places Are Limited/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("navbar is transparent at page top", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const nav = page.locator("nav").first();
    const bg = await nav.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg === "rgba(0, 0, 0, 0)" || bg === "transparent").toBeTruthy();
  });

  test("navbar gains white bg after scrolling", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(400);
    const nav = page.locator("nav").first();
    const bg = await nav.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toMatch(/^rgb\(255, 255, 255\)|^rgba\(255, 255, 255/);
  });
});

test.describe("Public — Camp Registration Form", () => {
  test("camp registration page loads", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("submit button is disabled when form is empty", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("button", { name: /submit|register/i }).first()).toBeDisabled();
  });

  test("age range inputs are hidden from the user", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    const minAge = page.locator('input[name="min_age"]');
    const maxAge = page.locator('input[name="max_age"]');
    if (await minAge.count() > 0) await expect(minAge).toBeHidden();
    if (await maxAge.count() > 0) await expect(maxAge).toBeHidden();
  });

  test("first name field accepts input", async ({ page }) => {
    await page.goto("/register/camp");
    await page.waitForLoadState("domcontentloaded");
    const firstName = page.getByLabel(/first name/i).first();
    await expect(firstName).toBeVisible();
    await firstName.fill("Ahmed");
    await expect(firstName).toHaveValue("Ahmed");
  });
});

test.describe("Admin — Camp Registrations", () => {
  // imported inline to avoid shared beforeEach with the skipped manager suite
  const { loginAsAdmin } = require("../helpers/auth");

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await expect(page.getByRole("heading", { name: /Camp Registrations/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test("clicking a row opens detail page", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/admin\/camp-registrations\/.+/);
  });

  test("detail page has actions dropdown", async ({ page }) => {
    await page.goto("/admin/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("button", { name: /actions/i }).first()).toBeVisible({ timeout: 8000 });
  });
});

test.describe("Account Manager — Camp Registrations", () => {
  const { loginAsManager } = require("../helpers/auth");

  test.beforeEach(async ({ page }) => {
    await loginAsManager(page);
  });

  test("list page loads", async ({ page }) => {
    await page.goto("/account-manager/camp-registrations");
    await expect(page.getByRole("heading", { name: /Camp Registrations/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test("clicking a row opens detail page", async ({ page }) => {
    await page.goto("/account-manager/camp-registrations");
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/\/account-manager\/camp-registrations\/.+/);
  });
});
