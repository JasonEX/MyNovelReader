import {
  addMyNovelReaderUserscript,
  assertMnrSmokeState,
  createConsoleCollector,
  getFirstPage,
  getMnrE2eConfig,
  launchPersistentMnrContext,
  printRunSummary,
  saveStableScreenshot,
  waitForMnrReader,
} from './mnrE2e';
import { test } from '@playwright/test';

const smokeConfig = getMnrE2eConfig();
test.setTimeout(Math.max(120_000, smokeConfig.readerTimeoutMs + 60_000));

test('injects MyNovelReader into a real chapter page and renders reader UI', async ({
  browserName: _browserName,
}, testInfo) => {
  const config = getMnrE2eConfig();
  const context = await launchPersistentMnrContext(testInfo, {
    blockHeavyResources: true,
    headlessFallback: true,
  });

  try {
    await addMyNovelReaderUserscript(context);

    const page = await getFirstPage(context);
    const logs = createConsoleCollector(page);
    const response = await page.goto(config.targetUrl, {
      timeout: 60_000,
      waitUntil: 'domcontentloaded',
    });

    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);

    const state = await waitForMnrReader(page);
    const screenshotPath = await saveStableScreenshot(page, 'smoke');
    await testInfo.attach('smoke-page', { path: screenshotPath, contentType: 'image/png' });

    printRunSummary('real-site-smoke', {
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
    await context.close();
  }
});
