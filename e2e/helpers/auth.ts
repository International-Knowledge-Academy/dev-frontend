import { Page } from "@playwright/test";

export const ADMIN_EMAIL    = "admin@academy.com";
export const ADMIN_PASSWORD = "Admin123!@#";

export const MANAGER_EMAIL    = "manager@academy.com";
export const MANAGER_PASSWORD = "Manager123!@#";

export async function loginAsAdmin(page: Page) {
  await page.goto("/auth/sign-in");
  await page.getByPlaceholder("mail@example.com").fill(ADMIN_EMAIL);
  await page.getByPlaceholder("Min. 8 characters").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("**/admin**");
  await page.waitForLoadState("domcontentloaded");
}

export async function loginAsManager(page: Page) {
  await page.goto("/auth/sign-in");
  await page.getByPlaceholder("mail@example.com").fill(MANAGER_EMAIL);
  await page.getByPlaceholder("Min. 8 characters").fill(MANAGER_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("**/account-manager**");
  await page.waitForLoadState("domcontentloaded");
}
