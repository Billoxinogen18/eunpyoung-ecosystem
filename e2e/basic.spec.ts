import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/EunCoin/);
  // Check connect button visible
  await expect(page.getByRole("button", { name: /connect wallet/i })).toBeVisible();
}); 