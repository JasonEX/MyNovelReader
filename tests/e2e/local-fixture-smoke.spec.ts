import { expect, type Locator, test } from '@playwright/test';

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
    <style>
      button { padding: 0 14px 0 2px; line-height: 3; text-align: left; }
      button svg { margin-left: 6px; vertical-align: baseline; }
    </style>
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

function expectCentered(alignment: { x: number; y: number } | null): void {
  expect(alignment).not.toBeNull();
  expect(Math.abs(alignment?.x ?? Infinity)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(alignment?.y ?? Infinity)).toBeLessThanOrEqual(0.5);
}

async function getIconAlignments(
  buttons: Locator
): Promise<Array<{ x: number; y: number } | null>> {
  return buttons.evaluateAll(elements =>
    elements.map(button => {
      const icon = button.querySelector('svg');
      if (!icon) return null;

      const buttonRect = button.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      return {
        x: iconRect.left + iconRect.width / 2 - (buttonRect.left + buttonRect.width / 2),
        y: iconRect.top + iconRect.height / 2 - (buttonRect.top + buttonRect.height / 2),
      };
    })
  );
}

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
      boundaryNavigation: shadow?.querySelectorAll('.mnr-chapter-boundary-nav').length ?? 0,
    };
  });
  expect(primaryUi).toEqual({
    toolbarButtons: 2,
    hasDirectory: true,
    hasSettings: true,
    settingsGearCircle: true,
    settingsGearPath: expect.stringContaining('M12.22 2h-.44'),
    hasToolbarCache: false,
    boundaryNavigation: 0,
  });
  const toolbarIconAlignment = await getIconAlignments(
    page.locator('#mnr-reader-root').locator('.mnr-fab')
  );
  expect(toolbarIconAlignment).toHaveLength(2);
  toolbarIconAlignment.forEach(expectCentered);

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
  const [drawerCloseAlignment] = await getIconAlignments(
    page.locator('#mnr-reader-root').locator('.mnr-drawer-close')
  );
  expectCentered(drawerCloseAlignment ?? null);
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
  const [settingsCloseAlignment] = await getIconAlignments(
    page.locator('#mnr-reader-root').locator('.mnr-close-btn')
  );
  expectCentered(settingsCloseAlignment ?? null);
  await page.keyboard.press('Escape');

  await page.keyboard.press('q');
  await expect.poll(() => page.locator('#mnr-reader-root').count()).toBe(0);

  await expect(page.locator('#host-page')).toBeVisible();
  await expect(page.locator('#mnr-hide-original')).toHaveCount(0);
  await expect(page.locator('#mnr-floating-btn')).toBeVisible();
  await expect(page.locator('#mnr-floating-btn')).toHaveCSS(
    'background-color',
    'rgb(25, 118, 210)'
  );
  await expect(page.locator('#mnr-floating-btn')).toHaveCSS(
    'box-shadow',
    'rgba(0, 0, 0, 0.15) 0px 4px 12px 0px'
  );
  const [floatingEntryAlignment] = await getIconAlignments(page.locator('#mnr-floating-btn'));
  expectCentered(floatingEntryAlignment ?? null);
  await expect(page).toHaveTitle('第100章 本地测试 - 测试小说');
  expect(logs.some(line => line.includes('pageerror'))).toBe(false);
});
