import { expect, test } from '@playwright/test';

import {
  addMyNovelReaderUserscript,
  assertMnrSmokeState,
  createConsoleCollector,
  waitForMnrReader,
} from './mnrE2e';

const targetUrl = 'http://mnr.test/chapter/100.html';
const paragraphs = Array.from(
  { length: 72 },
  (_, index) =>
    `<p>这是第 ${index + 1} 段测试正文，用于验证本地固定页面的内容检测、阅读器渲染和退出恢复行为。</p>`
).join('');
const tocLinks = Array.from(
  { length: 1200 },
  (_, index) => `<a href="/chapter/${index + 1}.html">第 ${index + 1} 章</a>`
).join('');

const fixtureHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>第100章 本地测试 - 测试小说</title>
  </head>
  <body>
    <main id="host-page">
      <h1>第100章 本地测试</h1>
      <div id="content">${paragraphs}</div>
      <nav>
        <a href="/chapter/99.html">上一章</a>
        <a href="/book/1/index.html">目录</a>
        <a href="/chapter/101.html">下一章</a>
      </nav>
    </main>
  </body>
</html>`;

test('runs the built userscript and restores the host page after exit', async ({
  context,
  page,
}) => {
  await context.route(targetUrl, route =>
    route.fulfill({
      body: fixtureHtml,
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  await context.route('http://mnr.test/book/1/index.html', route =>
    route.fulfill({
      body: `<!doctype html><html><body><main>${tocLinks}</main></body></html>`,
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  await addMyNovelReaderUserscript(context);

  const logs = createConsoleCollector(page);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

  const state = await waitForMnrReader(page);
  assertMnrSmokeState(state);
  expect(state.href).toBe(targetUrl);
  expect(state.shadowTitle).toContain('第100章');

  const primaryUi = await page.locator('#mnr-reader-root').evaluate(host => {
    const shadow = host.shadowRoot;
    return {
      toolbarButtons: shadow?.querySelectorAll('.mnr-floating-toolbar .mnr-fab').length ?? 0,
      hasDirectory: !!shadow?.querySelector('[aria-label="打开目录"]'),
      hasSettings: !!shadow?.querySelector('[aria-label="打开设置"]'),
      settingsGearCircle: !!shadow?.querySelector('[aria-label="打开设置"] svg circle'),
      settingsGearPath:
        shadow?.querySelector('[aria-label="打开设置"] svg path')?.getAttribute('d') ?? '',
      hasToolbarCache: !!shadow?.querySelector('[aria-label="缓存管理"]'),
      boundaryNavigation: shadow?.querySelectorAll('.mnr-chapter-boundary-nav button').length ?? 0,
    };
  });
  expect(primaryUi).toEqual({
    toolbarButtons: 2,
    hasDirectory: true,
    hasSettings: true,
    settingsGearCircle: true,
    settingsGearPath: expect.stringContaining('M12.22 2h-.44'),
    hasToolbarCache: false,
    boundaryNavigation: 2,
  });

  await page.locator('#mnr-reader-root').evaluate(host => {
    host.shadowRoot?.querySelector<HTMLElement>('[aria-label="打开目录"]')?.click();
  });
  await expect
    .poll(() =>
      page.locator('#mnr-reader-root').evaluate(host => {
        const shadow = host.shadowRoot;
        return {
          drawerOpen: shadow?.querySelector('.mnr-drawer')?.classList.contains('open') ?? false,
          renderedRows: shadow?.querySelectorAll('.mnr-chapter-button').length ?? 0,
          searchVisible: !!shadow?.querySelector('#mnr-chapter-search'),
          totalText: shadow?.querySelector('.mnr-drawer-position')?.textContent?.trim() ?? '',
        };
      })
    )
    .toMatchObject({ drawerOpen: true, searchVisible: true });
  const renderedToc = await page.locator('#mnr-reader-root').evaluate(host => {
    const shadow = host.shadowRoot;
    return {
      renderedRows: shadow?.querySelectorAll('.mnr-chapter-button').length ?? 0,
      totalText: shadow?.querySelector('.mnr-drawer-position')?.textContent?.trim() ?? '',
    };
  });
  expect(renderedToc.renderedRows).toBeGreaterThan(0);
  expect(renderedToc.renderedRows).toBeLessThan(50);
  expect(renderedToc.totalText).toContain('1200');
  await page.keyboard.press('Escape');

  await page.locator('#mnr-reader-root').evaluate(host => {
    host.shadowRoot?.querySelector<HTMLElement>('[aria-label="打开设置"]')?.click();
  });
  await expect
    .poll(async () =>
      page.locator('#mnr-reader-root').evaluate(host => {
        const details = host.shadowRoot?.querySelector<HTMLDetailsElement>('.mnr-more-settings');
        return {
          visible: !!details,
          open: details?.open ?? false,
          scaleIcons: host.shadowRoot?.querySelectorAll('.mnr-scale-icon').length ?? 0,
        };
      })
    )
    .toEqual({ visible: true, open: false, scaleIcons: 4 });
  await page.keyboard.press('Escape');

  await page.keyboard.press('q');
  await expect.poll(() => page.locator('#mnr-reader-root').count()).toBe(0);

  await expect(page.locator('#host-page')).toBeVisible();
  await expect(page.locator('#mnr-hide-original')).toHaveCount(0);
  await expect(page.locator('#mnr-floating-btn')).toBeVisible();
  await expect(page).toHaveTitle('第100章 本地测试 - 测试小说');
  expect(logs.some(line => line.includes('pageerror'))).toBe(false);
});
