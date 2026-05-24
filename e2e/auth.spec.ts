import { test, expect } from "@playwright/test";
import { loginAsAdmin, ADMIN_EMAIL, ADMIN_PASSWORD } from "./helpers/auth";

test.describe("Authentication", () => {
  test("sign-in page loads", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await page.getByPlaceholder("mail@example.com").fill("wrong@email.com");
    await page.getByPlaceholder("Min. 8 characters").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText(/no active account found/i)).toBeVisible({ timeout: 8000 });
  });

  test("admin login redirects to /admin", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin/);
  });

  test("unauthenticated access redirects to sign-in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });
});
