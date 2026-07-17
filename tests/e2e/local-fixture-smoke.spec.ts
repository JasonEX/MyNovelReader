import { expect, type Locator, type Page, test } from '@playwright/test';

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
      button { padding: 0 14px 0 2px !important; line-height: 3 !important; text-align: left !important; }
      button svg { margin-left: 6px !important; vertical-align: baseline !important; }
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

const nextFixtureHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>第101章 手势续读 - 测试小说</title>
  </head>
  <body>
    <main>
      <h1>第101章 手势续读</h1>
      <div id="content">${paragraphs.replaceAll('本地固定页面', '移动端手势')}</div>
      <nav>
        <a href="/chapter/100.html">上一章</a>
        <a href="/book/1/index.html">目录</a>
        <a href="/chapter/102.html">下一章</a>
      </nav>
    </main>
  </body>
</html>`;

const hetushuFirstUrl = 'https://www.hetushu.com/book/9145/6567989.html';
const hetushuSecondUrl = 'https://www.hetushu.com/book/9145/6567990.html';

function makeHetushuFixture(options: {
  chapterTitle: string;
  nextUrl: string;
  prevUrl: string;
}): string {
  const contentRows = Array.from(
    { length: 56 },
    (_, index) =>
      `<div class="shown">${options.chapterTitle}第 ${index + 1} 段正常正文，验证和图书翻页解析不会把 JS Detection 当成挑战页。<acronym>www.hetushu.com</acronym></div>`
  ).join('');

  return `<!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8">
        <title>木叶：让宇智波再次伟大_${options.chapterTitle}_虚空吟唱者_和图书</title>
        <style>#content .shown { display: block; }</style>
        <script src="/cdn-cgi/challenge-platform/scripts/jsd/main.js"></script>
      </head>
      <body>
        <div id="left"><h3><a href="/book/9145/index.html">木叶：让宇智波再次伟大</a></h3></div>
        <a id="pre" href="${options.prevUrl}">上一章</a>
        <a id="next" href="${options.nextUrl}">下一章</a>
        <div id="content"><h2>${options.chapterTitle}</h2>${contentRows}</div>
      </body>
    </html>`;
}

const ttksBookPath = '/novel/chapters/kaijuxiangqinnvshenbuhuodugujiujian';

function makeTtksFixture(options: {
  body: string;
  chapterTitle: string;
  nextChapter: number;
  prevChapter: number;
  trailingNoise: string;
}): string {
  return `<!doctype html>
    <html lang="zh-TW">
      <head>
        <meta charset="utf-8">
        <title>⚡ 《開局相親女神捕，獲獨孤九劍》 ${options.chapterTitle} - ⚡ 天天看小說</title>
      </head>
      <body>
        <div class="frame_body">
          <div class="breadcrumb_nav">
            <a href="/">首頁</a>
            <a href="${ttksBookPath}/index.html">《開局相親女神捕，獲獨孤九劍》</a>
          </div>
          <div class="title"><h1>${options.chapterTitle}</h1></div>
          <div class="content">
            <a class="anchor_bookmark" href="/bookmark">書籤圖示</a>
            <div class="txtcenter">loadAdv(1, 0);</div>
            <p>${options.chapterTitle}</p>
            ${options.body}
            <p>${options.trailingNoise}</p>
            <div class="txtcenter">loadAdv(3, 0);</div>
            <div class="div_feedback">添加書籤 返回目錄 章節報錯</div>
            <div class="social_share_frame">分享給朋友</div>
          </div>
          <div class="content">
            <a id="linkPrev" href="${ttksBookPath}/${options.prevChapter}.html">上一章</a>
            <a id="linkNext" href="${ttksBookPath}/${options.nextChapter}.html">下一章</a>
          </div>
        </div>
      </body>
    </html>`;
}

async function dispatchReaderTouch(
  page: Page,
  type: 'touchstart' | 'touchmove' | 'touchend',
  point: { x: number; y: number }
): Promise<void> {
  await page.locator('#mnr-reader-root').evaluate(
    (host, input) => {
      const main = host.shadowRoot?.querySelector('.mnr-reader-main');
      if (!main) throw new Error('reader main element not found');

      const touch = { identifier: 1, clientX: input.point.x, clientY: input.point.y };
      const event = new Event(input.type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, {
        touches: { value: input.type === 'touchend' ? [] : [touch] },
        changedTouches: { value: [touch] },
      });
      main.dispatchEvent(event);
    },
    { type, point }
  );
}

function makeGobooPage(pageNumber: number, nextHref: string, nextText = '下一页'): string {
  const visible = `第${pageNumber}页可见正文。`.repeat(48);
  const hidden = `第${pageNumber}页编码后续正文。`.repeat(48);
  const encoded = Buffer.from(`<p>${hidden}</p>`, 'utf8').toString('base64');
  const prevHref = pageNumber === 1 ? 'javascript:void(0);' : `/gb_1/94443/1/${pageNumber - 1}`;

  return `<!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8">
        <title>001 本地分页测试(${pageNumber}/3) - 测试书小说 - 钢笔小说</title>
      </head>
      <body>
        <h1>001 本地分页测试(${pageNumber}/3)</h1>
        <div class="content">
          <p>【测试书】小说免费阅读，请收藏 钢笔小说【goboo.cc】</p>
          <p>${visible}</p>
          <p>阅|读|模|式|或|畅|读|模|式|下，无|法|显|示|本|章|节|全|部|内|容，请|返|回|原|网|页阅|读。<button>加|载|更|多</button></p>
        </div>
        <div class="page">
          <span class="left"><a href="${prevHref}">上一页</a></span>
          <span class="center"><a href="/ml_1/94443?cid=1">目录</a></span>
          <span class="right"><a href="${nextHref}">${nextText}</a></span>
        </div>
        <script>const p_key='${encoded}';</script>
      </body>
    </html>`;
}

function makeGobooNextChapter(): string {
  const content = '第2章已由共享自动加载器成功预载。'.repeat(96);

  return `<!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8">
        <title>002 通用自动预载回归 - 测试书小说 - 钢笔小说</title>
      </head>
      <body>
        <h1>002 通用自动预载回归</h1>
        <div class="content"><p>${content}</p></div>
        <div class="page">
          <a class="left" href="/gb_1/94443/1">上一章</a>
          <a class="center" href="/ml_1/94443?cid=2">目录</a>
          <a class="right" href="/gb_1/94443/3">下一章</a>
        </div>
      </body>
    </html>`;
}

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

  await page.locator('#mnr-reader-root').locator('[aria-label="打开目录"]').click();
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
      offlineTitle: shadow?.querySelector('#mnr-offline-title')?.textContent?.trim() ?? '',
      offlineStatus: shadow?.querySelector('.mnr-offline-copy span')?.textContent?.trim() ?? '',
      offlineAction:
        shadow?.querySelector('.mnr-offline-action.primary')?.textContent?.trim() ?? '',
      temporaryCacheMarks: shadow?.querySelectorAll('[aria-label="已临时缓存"]').length ?? 0,
    };
  });
  expect(renderedToc.renderedRows).toBeGreaterThan(0);
  expect(renderedToc.renderedRows).toBeLessThan(50);
  expect(renderedToc.totalText).toContain('1200');
  expect(renderedToc.offlineTitle).toBe('离线阅读');
  expect(renderedToc.offlineStatus).toBe('尚未缓存');
  expect(renderedToc.offlineAction).toBe('缓存本书');
  expect(renderedToc.temporaryCacheMarks).toBe(0);
  const [drawerCloseAlignment] = await getIconAlignments(
    page.locator('#mnr-reader-root').locator('.mnr-drawer-close')
  );
  expectCentered(drawerCloseAlignment ?? null);
  await page.keyboard.press('Escape');

  await page.locator('#mnr-reader-root').locator('[aria-label="打开设置"]').click();
  await expect
    .poll(() =>
      page.locator('#mnr-reader-root').evaluate(host => {
        const shadow = host.shadowRoot;
        return {
          visible: !!shadow?.querySelector('.mnr-settings-panel'),
          groups: Array.from(shadow?.querySelectorAll('details > summary') ?? [], summary =>
            summary.textContent?.trim()
          ),
          sliders: shadow?.querySelectorAll('input[type="range"]').length ?? 0,
          mainInert: shadow?.querySelector('.mnr-reader-main')?.hasAttribute('inert') ?? false,
          activeId: shadow?.activeElement?.id ?? '',
          drawerOpen: shadow?.querySelector('.mnr-drawer')?.classList.contains('open') ?? false,
          settingsCacheAction: !!shadow?.querySelector('.mnr-settings-panel .mnr-cache-action'),
        };
      })
    )
    .toEqual({
      visible: true,
      groups: ['排版细节', '阅读行为', '本站与高级'],
      sliders: 6,
      mainInert: true,
      activeId: 'mnr-settings-title',
      drawerOpen: false,
      settingsCacheAction: false,
    });

  const fontSizeControl = page.locator('#mnr-reader-root').locator('#mnr-font-size');
  await expect(fontSizeControl).toHaveAttribute('aria-labelledby', 'mnr-font-size-label');
  const fontSizeBox = await fontSizeControl.boundingBox();
  expect(fontSizeBox?.height).toBeGreaterThanOrEqual(32);

  await page.keyboard.press('Tab');
  await expect
    .poll(() =>
      page.locator('#mnr-reader-root').evaluate(host => ({
        activeLabel: host.shadowRoot?.activeElement?.getAttribute('aria-label') ?? '',
        drawerOpen:
          host.shadowRoot?.querySelector('.mnr-drawer')?.classList.contains('open') ?? false,
      }))
    )
    .toEqual({ activeLabel: '关闭设置', drawerOpen: false });

  const typographyDetails = page
    .locator('#mnr-reader-root')
    .locator('details')
    .filter({ hasText: '排版细节' });
  await typographyDetails.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(typographyDetails).toHaveAttribute('open', '');
  expect(page.url()).toBe(targetUrl);

  await page.keyboard.press('q');
  await expect(page.locator('#mnr-reader-root')).toHaveCount(1);
  const [settingsCloseAlignment] = await getIconAlignments(
    page.locator('#mnr-reader-root').locator('.mnr-close-btn')
  );
  expectCentered(settingsCloseAlignment ?? null);
  await page.keyboard.press('Escape');
  await expect(page.locator('#mnr-reader-root').locator('.mnr-settings-panel')).toHaveCount(0);
  await expect
    .poll(() =>
      page.locator('#mnr-reader-root').evaluate(host => ({
        mainInert: host.shadowRoot?.querySelector('.mnr-reader-main')?.hasAttribute('inert'),
        activeLabel: host.shadowRoot?.activeElement?.getAttribute('aria-label') ?? '',
      }))
    )
    .toEqual({ mainInert: false, activeLabel: '打开设置' });

  await page.keyboard.press('q');
  await expect.poll(() => page.locator('#mnr-reader-root').count()).toBe(0);

  await expect(page.locator('#host-page')).toBeVisible();
  await expect(page.locator('#mnr-hide-original')).toHaveCount(0);
  const readerEntry = page.locator('#mnr-entry-root').locator('#mnr-entry-button');
  await expect(readerEntry).toBeVisible();
  await expect(readerEntry).toHaveText('进入阅读模式');
  await expect(readerEntry).toHaveCSS('background-color', 'rgb(0, 102, 204)');
  await expect(readerEntry).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0.2) 0px 6px 18px 0px');
  const entryAlignment = await readerEntry.evaluate(button => {
    const icon = button.querySelector('svg');
    if (!icon) return null;
    const buttonRect = button.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();
    return {
      y: iconRect.top + iconRect.height / 2 - (buttonRect.top + buttonRect.height / 2),
    };
  });
  expect(Math.abs(entryAlignment?.y ?? Infinity)).toBeLessThanOrEqual(0.5);
  await expect(page).toHaveTitle('第100章 本地测试 - 测试小说');
  expect(logs.some(line => line.includes('pageerror'))).toBe(false);
});

test('keeps normal Cloudflare JS Detection pages readable across previous navigation', async ({
  context,
  page,
}) => {
  await context.route(hetushuSecondUrl, route =>
    route.fulfill({
      body: makeHetushuFixture({
        chapterTitle: '第二章 宇智波止水',
        nextUrl: '/book/9145/6567991.html',
        prevUrl: '/book/9145/6567989.html',
      }),
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  await context.route(hetushuFirstUrl, route =>
    route.fulfill({
      body: makeHetushuFixture({
        chapterTitle: '第一章 还不如不激活呢',
        nextUrl: '/book/9145/6567990.html',
        prevUrl: '/book/9145/6567988.html',
      }),
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  await context.route('**/cdn-cgi/challenge-platform/scripts/jsd/main.js', route =>
    route.fulfill({ body: '', contentType: 'text/javascript', status: 200 })
  );
  await addMyNovelReaderUserscript(context);

  await page.goto(hetushuSecondUrl, { waitUntil: 'domcontentloaded' });
  const readerRoot = page.locator('#mnr-reader-root');
  await expect(readerRoot).toHaveCount(1);
  await expect(readerRoot.locator(`article[data-chapter-url="${hetushuSecondUrl}"]`)).toContainText(
    '第二章 宇智波止水'
  );
  await expect(page.locator('script[src*="/challenge-platform/scripts/jsd/"]')).toHaveCount(1);

  await readerRoot.locator('.mnr-reader-main').focus();
  await page.keyboard.press('ArrowLeft');

  await expect.poll(() => page.url()).toBe(hetushuFirstUrl);
  await expect(readerRoot.locator(`article[data-chapter-url="${hetushuFirstUrl}"]`)).toContainText(
    '第一章 还不如不激活呢'
  );
});

test('auto-starts TTKS and navigates through a short author-note chapter', async ({
  context,
  page,
}) => {
  const firstUrl = `https://ttks.tw${ttksBookPath}/83.html`;
  const noteUrl = `https://ttks.tw${ttksBookPath}/84.html`;
  const thirdUrl = `https://ttks.tw${ttksBookPath}/85.html`;
  let noteRequests = 0;
  let thirdRequests = 0;

  await context.route(firstUrl, route =>
    route.fulfill({
      body: makeTtksFixture({
        chapterTitle: '第82章 真黑袍（求月票）',
        body: `
          <p>第一段正常正文。</p>
          <p>第一節結尾正文。\u3000\u3000【寫到這裡我希望讀者記一下我們域名 天天看小說超貼心，𝗍𝗍𝗄𝗌.𝗍𝗐等你尋 】</p>
          <p>${'本章後續正常正文。'.repeat(80)}</p>
          <p>本章結尾正文。</p>
        `,
        nextChapter: 84,
        prevChapter: 82,
        trailingNoise: '福',
      }),
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  await context.route(noteUrl, route => {
    noteRequests += 1;
    return route.fulfill({
      body: makeTtksFixture({
        chapterTitle: '求點月票！',
        body: '<p>如題，兄弟們，雙倍月票最後一天了，不要留在手機了呀！</p><p>問道在此跪求一波月票！</p>',
        nextChapter: 85,
        prevChapter: 83,
        trailingNoise: '&gt;',
      }),
      contentType: 'text/html; charset=utf-8',
      status: 200,
    });
  });
  await context.route(thirdUrl, route => {
    thirdRequests += 1;
    return route.fulfill({
      body: makeTtksFixture({
        chapterTitle: '第83章 大劫指對七絕旋風腿',
        body: `<p>${'下一章正常正文。'.repeat(80)}</p><p>下一章結尾正文。</p>`,
        nextChapter: 86,
        prevChapter: 84,
        trailingNoise: '&gt;',
      }),
      contentType: 'text/html; charset=utf-8',
      status: 200,
    });
  });
  await addMyNovelReaderUserscript(context);

  await page.goto(firstUrl, { waitUntil: 'domcontentloaded' });
  const readerRoot = page.locator('#mnr-reader-root');
  await expect(readerRoot).toHaveCount(1);
  await expect(page.locator('#mnr-entry-root, #mnr-entry-prompt-root')).toHaveCount(0);

  const firstChapter = readerRoot.locator(`article[data-chapter-url="${firstUrl}"]`);
  await expect(firstChapter.locator('.mnr-chapter-title')).toHaveText('第82章 真黑袍（求月票）');
  await expect(firstChapter).toContainText('第一節結尾正文。');
  await expect(firstChapter).toContainText('本章結尾正文。');
  await expect(firstChapter).not.toContainText('天天看小說');
  await expect(firstChapter).not.toContainText('loadAdv');
  await expect(firstChapter).not.toContainText('添加書籤');
  await expect(firstChapter).not.toContainText('福');

  await readerRoot.locator('.mnr-reader-main').focus();
  await page.keyboard.press('ArrowRight');
  const noteChapter = readerRoot.locator(`article[data-chapter-url="${noteUrl}"]`);
  await expect(noteChapter.locator('.mnr-chapter-title')).toHaveText('求點月票！');
  await expect(noteChapter).toContainText('雙倍月票最後一天');
  await expect(noteChapter).toContainText('問道在此跪求一波月票');
  await expect.poll(() => page.url()).toBe(noteUrl);
  expect(noteRequests).toBe(1);

  await page.waitForTimeout(700);
  await readerRoot.locator('.mnr-reader-main').focus();
  await page.keyboard.press('ArrowRight');
  const thirdChapter = readerRoot.locator(`article[data-chapter-url="${thirdUrl}"]`);
  await expect(thirdChapter.locator('.mnr-chapter-title')).toHaveText('第83章 大劫指對七絕旋風腿');
  await expect(thirdChapter).toContainText('下一章結尾正文。');
  await expect.poll(() => page.url()).toBe(thirdUrl);
  expect(thirdRequests).toBe(1);
});

test('keeps detection details internal and hands a dismissed prompt off to manual entry', async ({
  context,
  page,
}) => {
  const promptUrl = 'http://mnr.test/chapter/200.html';
  const promptHtml = `<!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8">
        <title>第200章 安静的正文 - 测试小说</title>
        <style>button { all: unset !important; width: 1px !important; height: 1px !important; }</style>
      </head>
      <body>
        <h1>第200章 安静的正文</h1>
        <div id="content">${paragraphs}</div>
      </body>
    </html>`;

  await context.route(promptUrl, route =>
    route.fulfill({
      body: promptHtml,
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  await addMyNovelReaderUserscript(context);
  const logs = createConsoleCollector(page);
  await page.goto(promptUrl, { waitUntil: 'domcontentloaded' });

  const prompt = page.locator('#mnr-entry-prompt-root');
  await expect(prompt.locator('[role="dialog"]')).toBeVisible();
  await expect(prompt.locator('#mnr-entry-prompt-title')).toHaveText('检测到小说正文');
  await expect(prompt.locator('text=检测置信度')).toHaveCount(0);
  await expect(prompt.locator('.mnr-result-list')).toHaveCount(0);
  await expect(prompt.locator('.mnr-entry-button.primary')).toBeFocused();
  await expect(prompt.locator('.mnr-entry-button.primary')).toHaveCSS('min-height', '44px');

  await page.keyboard.press('Escape');
  await expect(prompt).toHaveCount(0);

  const readerEntry = page.locator('#mnr-entry-root').locator('#mnr-entry-button');
  await expect(readerEntry).toBeVisible();
  await readerEntry.click();
  await expect(page.locator('#mnr-entry-root')).toHaveCount(0);
  await expect(page.locator('#mnr-reader-root').locator('.mnr-reader-content')).toContainText(
    '这是第 1 段测试正文'
  );
  expect(logs.some(line => line.includes('pageerror'))).toBe(false);
});

test('shows the first Goboo section before rate-limited background merging completes', async ({
  context,
  page,
}) => {
  const firstUrl = 'https://m.goboo.cc/gb_1/94443/1';
  const secondUrl = `${firstUrl}/2`;
  const thirdUrl = `${firstUrl}/3`;
  const nextChapterUrl = 'https://m.goboo.cc/gb_1/94443/2';
  const requestTimes = new Map<string, number>();
  const startedAt = Date.now();

  await context.route(firstUrl, route =>
    route.fulfill({
      body: makeGobooPage(1, '/gb_1/94443/1/2'),
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  await context.route(secondUrl, route =>
    route.fulfill({
      body: makeGobooPage(2, '/gb_1/94443/1/3'),
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  await context.route(thirdUrl, route =>
    route.fulfill({
      body: makeGobooPage(3, '/gb_1/94443/2', '下一章'),
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  await context.route(nextChapterUrl, route =>
    route.fulfill({
      body: makeGobooNextChapter(),
      contentType: 'text/html; charset=utf-8',
      status: 200,
    })
  );
  page.on('request', request => {
    if (request.url() === secondUrl || request.url() === thirdUrl) {
      requestTimes.set(request.url(), Date.now() - startedAt);
    }
  });
  await addMyNovelReaderUserscript(context);
  const logs = createConsoleCollector(page);

  await page.goto(firstUrl, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#mnr-reader-root')).toHaveCount(1, { timeout: 1_000 });
  const initialText = await page
    .locator('#mnr-reader-root')
    .evaluate(host =>
      host.shadowRoot?.querySelector('.mnr-reader-content')?.textContent?.replace(/\s+/g, '')
    );

  expect(initialText).toContain('第1页可见正文');
  expect(initialText).toContain('第1页编码后续正文');
  expect(initialText).not.toContain('第2页可见正文');
  expect(requestTimes.has(secondUrl)).toBe(false);

  await expect
    .poll(
      () =>
        page
          .locator('#mnr-reader-root')
          .evaluate(host =>
            host.shadowRoot?.querySelector('.mnr-reader-content')?.textContent?.replace(/\s+/g, '')
          ),
      { timeout: 6_000 }
    )
    .toContain('第3页编码后续正文');

  expect(requestTimes.get(thirdUrl)! - requestTimes.get(secondUrl)!).toBeGreaterThanOrEqual(1_000);
  await expect
    .poll(
      () =>
        page
          .locator('#mnr-reader-root')
          .evaluate(host => host.shadowRoot?.querySelectorAll('.mnr-reader-content').length || 0),
      { timeout: 8_000 }
    )
    .toBe(2);
  await expect(
    page.locator('#mnr-reader-root').locator('.mnr-reader-content').nth(1)
  ).toContainText('第2章已由共享自动加载器成功预载');
  await expect(page.locator('#mnr-reader-root')).toHaveCount(1);
  expect(logs.some(line => line.includes('pageerror'))).toBe(false);
});

test.describe('mobile gesture paging', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('keeps vertical scrolling native and turns one screen with horizontal swipes', async ({
    context,
    page,
  }) => {
    const nextUrl = 'http://mnr.test/chapter/101.html';
    let nextRequests = 0;

    await context.route(targetUrl, route =>
      route.fulfill({
        body: fixtureHtml,
        contentType: 'text/html; charset=utf-8',
        status: 200,
      })
    );
    await context.route(nextUrl, route => {
      nextRequests += 1;
      return route.fulfill({
        body: nextFixtureHtml,
        contentType: 'text/html; charset=utf-8',
        status: 200,
      });
    });
    await addMyNovelReaderUserscript(context);

    const logs = createConsoleCollector(page);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    assertMnrSmokeState(await waitForMnrReader(page));

    const readerRoot = page.locator('#mnr-reader-root');
    const readerMain = readerRoot.locator('.mnr-reader-main');
    await expect(readerMain).toHaveCSS('touch-action', 'pan-y pinch-zoom');

    await readerRoot.locator('[aria-label="打开设置"]').click();
    const behaviorSettings = readerRoot.locator('details').filter({ hasText: '阅读行为' });
    await behaviorSettings.locator('summary').click();
    await expect(behaviorSettings).toHaveAttribute('open', '');
    const gestureSetting = readerRoot
      .locator('.mnr-switch-row')
      .filter({ hasText: '左右滑动翻屏' });
    await expect(gestureSetting).toHaveCount(1);
    await expect(gestureSetting.locator('input')).toBeChecked();

    const preloadSetting = readerRoot
      .locator('.mnr-switch-row')
      .filter({ hasText: '自动加载下一章' });
    await preloadSetting.locator('input').uncheck();
    await readerRoot.locator('.mnr-close-btn').click();

    const initialPosition = await readerMain.evaluate(main => ({
      scrollTop: main.scrollTop,
      clientHeight: main.clientHeight,
    }));
    await dispatchReaderTouch(page, 'touchstart', { x: 330, y: 420 });
    await dispatchReaderTouch(page, 'touchend', { x: 70, y: 420 });
    await expect
      .poll(() => readerMain.evaluate(main => main.scrollTop))
      .toBeGreaterThan(initialPosition.scrollTop + initialPosition.clientHeight * 0.75);
    expect(nextRequests).toBe(0);

    await page.waitForTimeout(700);
    await dispatchReaderTouch(page, 'touchstart', { x: 70, y: 420 });
    await dispatchReaderTouch(page, 'touchend', { x: 330, y: 420 });
    await expect.poll(() => readerMain.evaluate(main => main.scrollTop)).toBeLessThan(80);

    await page.waitForTimeout(700);
    await readerMain.evaluate(main => {
      main.scrollTop = main.scrollHeight;
    });

    await dispatchReaderTouch(page, 'touchstart', { x: 195, y: 500 });
    await dispatchReaderTouch(page, 'touchmove', { x: 195, y: 480 });
    await expect(readerRoot.locator('.mnr-boundary-gesture-hint')).toHaveText('继续上滑加载下一章');
    await dispatchReaderTouch(page, 'touchend', { x: 195, y: 480 });
    await expect(readerRoot.locator('.mnr-boundary-gesture-hint')).toHaveCount(0);
    await page.waitForTimeout(250);
    expect(nextRequests).toBe(0);

    await dispatchReaderTouch(page, 'touchstart', { x: 195, y: 500 });
    await dispatchReaderTouch(page, 'touchmove', { x: 195, y: 430 });
    await expect(readerRoot.locator('.mnr-boundary-gesture-hint')).toHaveText('松手加载下一章');
    await dispatchReaderTouch(page, 'touchend', { x: 195, y: 430 });

    await expect.poll(() => nextRequests).toBe(1);
    await expect(readerRoot.locator('.mnr-chapter-title')).toHaveCount(2);
    await expect(readerRoot.locator('.mnr-chapter-title').nth(1)).toHaveText('第101章 手势续读');
    await expect
      .poll(() =>
        readerRoot.evaluate(host => {
          const shadow = host.shadowRoot;
          const main = shadow?.querySelector('.mnr-reader-main');
          const chapter = shadow?.querySelectorAll('.mnr-reader-content')[1];
          if (!main || !chapter) return Number.POSITIVE_INFINITY;
          return Math.abs(chapter.getBoundingClientRect().top - main.getBoundingClientRect().top);
        })
      )
      .toBeLessThan(2);
    expect(logs.some(line => line.includes('pageerror'))).toBe(false);
  });
});
