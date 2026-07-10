import type { Browser, Page } from '@playwright/test';
import { chromium, test } from '@playwright/test';

import {
  addMyNovelReaderUserscript,
  assertMnrSmokeState,
  createConsoleCollector,
  getMnrE2eConfig,
  printRunSummary,
  saveStableScreenshot,
  waitForMnrReader,
} from './mnrE2e';

test('injects MyNovelReader through an existing Chrome CDP session', async ({
  browserName: _browserName,
}, testInfo) => {
  const endpoint = process.env.MNR_E2E_CDP_ENDPOINT;
  test.skip(
    !endpoint,
    'Set MNR_E2E_CDP_ENDPOINT, for example http://127.0.0.1:9222, to run CDP smoke.'
  );
  if (!endpoint) return;

  const config = getMnrE2eConfig();
  let browser: Browser | undefined;
  let page: Page | undefined;

  try {
    browser = await chromium.connectOverCDP(endpoint);
    const context = browser.contexts()[0];
    if (!context) {
      throw new Error(`No default Chrome context found at ${endpoint}`);
    }

    await addMyNovelReaderUserscript(context);

    page = await context.newPage();
    const logs = createConsoleCollector(page);
    const response = await page.goto(config.targetUrl, {
      timeout: 60_000,
      waitUntil: 'domcontentloaded',
    });

    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);

    const state = await waitForMnrReader(page);
    const screenshotPath = await saveStableScreenshot(page, 'cdp-smoke');
    await testInfo.attach('cdp-smoke-page', { path: screenshotPath, contentType: 'image/png' });

    printRunSummary('real-chrome-cdp-smoke', {
      logs,
      screenshotPath,
      state,
      status: response?.status() ?? null,
    });

    assertMnrSmokeState(state);

    if (logs.some(line => line.includes('CSS injection error'))) {
      throw new Error(`Unexpected CSS injection error:\n${logs.join('\n')}`);
    }
  } finally {
    await page?.close().catch(() => undefined);
    await browser?.close().catch(() => undefined);
  }
});
