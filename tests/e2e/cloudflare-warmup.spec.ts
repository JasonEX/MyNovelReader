import {
  getFirstPage,
  getMnrE2eConfig,
  launchPersistentMnrContext,
  printRunSummary,
  saveStableScreenshot,
  waitForReadableNonCloudflarePage,
} from './mnrE2e';
import { test } from '@playwright/test';

test('warm up persistent browser profile for Cloudflare-protected sites', async ({
  browserName: _browserName,
}, testInfo) => {
  const config = getMnrE2eConfig();
  test.setTimeout(config.warmupTimeoutMs + 30_000);

  const context = await launchPersistentMnrContext(testInfo, {
    blockHeavyResources: false,
    forceHeaded: true,
    headlessFallback: false,
  });

  try {
    const page = await getFirstPage(context);
    const response = await page.goto(config.targetUrl, {
      timeout: 60_000,
      waitUntil: 'domcontentloaded',
    });

    console.log(
      [
        'Opened a persistent headed Chromium profile.',
        'If Cloudflare or a site challenge appears, complete it in the browser window.',
        'The test will close the browser once the target page is readable.',
        `Target: ${config.targetUrl}`,
        `Profile: ${config.profileDir}`,
      ].join('\n')
    );

    const state = await waitForReadableNonCloudflarePage(page);
    const screenshotPath = await saveStableScreenshot(page, 'warmup');
    await testInfo.attach('warmup-page', { path: screenshotPath, contentType: 'image/png' });
    printRunSummary('warmup', {
      screenshotPath,
      state,
      status: response?.status() ?? null,
    });
  } finally {
    await context.close();
  }
});
