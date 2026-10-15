import { expect, test, type Page } from '@playwright/test';

async function waitForServiceWorker(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // First load is not controlled by the SW yet; reload so it serves the app.
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15_000 });
}

test('core workflow works offline and progress survives a reload', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('./');
  await expect(page.getByRole('heading', { name: /Dzień dobry/ })).toBeVisible();
  await waitForServiceWorker(page);

  // Go offline before doing anything else.
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('status').filter({ hasText: 'Offline' })).toBeVisible();

  // Skip placement and start a session.
  await page.getByRole('button', { name: /Pomiń/ }).click();
  await page.getByRole('link', { name: /Zacznij sesję/ }).click();
  await page.getByRole('button', { name: 'Pokaż odpowiedź' }).click();
  await page.getByRole('button', { name: /Dobrze/ }).click();
  await expect(page.getByText(/Karta 2 z/)).toBeVisible();

  // Reload while still offline: the app must load from cache and keep progress.
  await page.reload();
  await page.goto('./#/stats');
  const known = page.locator('.stat', { hasText: 'Poznane karty' });
  await expect(known.locator('.big')).toHaveText('1');

  // Lessons and dialogues work offline.
  await page.goto('./#/lessons/l02-basics');
  await expect(page.getByRole('heading', { name: /Polisa, składka/ })).toBeVisible();
  await page.goto('./#/dialogues/d02-fnol');
  await expect(page.getByText('When exactly did it happen?').first()).toBeVisible();

  // PDF export works offline (font is served from the SW cache).
  await page.goto('./#/vocab');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /^PDF/ }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/\.pdf$/);

  expect(errors).toEqual([]);
});

test('every main screen renders', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const routes = [
    '', 'session', 'cards', 'vocab', 'practice', 'lessons', 'lessons/l12-programmes', 'grammar', 'grammar/g05-present-perfect',
    'dialogues', 'dialogues/d10-programme', 'emails', 'emails/e05-comparing-quotes', 'speaking', 'speaking/s05-exclusion',
    'listening', 'listening/li05-risk-engineer', 'stats', 'settings', 'install', 'placement',
  ];
  for (const r of routes) {
    await page.goto(`./#/${r}`);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('main')).not.toContainText('Nie ma takiej strony');
    await expect(page.locator('main')).not.toContainText(/Nie znaleziono (lekcji|tematu|rozmowy|zadania|nagrania)/);
  }
  expect(errors).toEqual([]);
});

test('email draft is saved and restored', async ({ page }) => {
  await page.goto('./#/emails/e01-request-docs');
  await page.getByLabel('Treść').fill('Dear Mr Weber, I am writing regarding the claim. Could you send the photos and the invoice by Friday? Kind regards');
  await page.waitForTimeout(900);
  await page.reload();
  await expect(page.getByLabel('Treść')).toHaveValue(/I am writing regarding the claim/);
  await page.getByRole('button', { name: 'Sprawdź' }).click();
  await expect(page.getByText(/Wynik sprawdzenia/)).toBeVisible();
});
