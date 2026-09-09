import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import {
  addMyNovelReaderUserscript,
  createConsoleCollector,
  launchPersistentMnrContext,
  printRunSummary,
  saveStableScreenshot,
  waitForMnrReader,
} from './mnrE2e';

// 小说之家（xszj.org）：验证查询分页章节在浏览器内被合并为单章，且 prev/next 指向真实章节。
// - 章节页 /b/{bookId}/c/{chapterId}?page={n}，首页无 page 参数
// - 站点缺陷：分页时“下一页”链接的 rel 错标为 prev，规则只能依赖链接文字
const BOOK_TITLE = '暮年武圣：开局六十倍修炼速度';
const CHAPTER_TITLE = '第93章 让人震惊的实力';
const START_URL = 'https://xszj.org/b/490346/c/1534359';
const NEXT_CHAPTER_URL = 'https://xszj.org/b/490346/c/1534362';

// 各分页独有的句子，用于证明 ?page=2..4 被合并进同一章
const PAGE_SENTINELS = [
  '越往下，血腥味越浓，第一个死去的巡卫出现在半地下层', // page 1
  '石阶到了尽头，再往里就是关押九邪教大执事冯海元的地方了', // page 2
  '他歪了歪脑袋，干裂的唇翕动', // page 3
  '剧痛终于让何九冷静了一些', // page 4
];

type XszjDeepState = {
  articleChars: number;
  articleText: string;
  articleTitle: string;
  articleUrl: string;
  cloudflareChallenge: boolean;
  href: string;
  pageTitle: string;
  readerMounted: boolean;
  readerRoot: boolean;
};

function collectXszjState(page: Page, chapterUrlPart: string): Promise<XszjDeepState> {
  return page.evaluate(urlPart => {
    const normalize = (text: string | null | undefined) => (text || '').replace(/\s+/g, ' ').trim();
    const cloudflareSelectors = [
      '[id*="cf-chl"]',
      '[class*="cf-chl"]',
      'form[action*="/cdn-cgi/"]',
      'iframe[src*="challenges.cloudflare.com"]',
    ];

    const root = document.querySelector('#mnr-reader-root');
    const shadow = root?.shadowRoot || null;
    const article = Array.from(shadow?.querySelectorAll('article.mnr-reader-content') || []).find(
      item => item.getAttribute('data-chapter-url')?.includes(urlPart)
    );
    const text = normalize(article?.textContent || '');

    return {
      articleChars: text.length,
      articleText: text,
      articleTitle: normalize(article?.querySelector('.mnr-chapter-title')?.textContent),
      articleUrl: article?.getAttribute('data-chapter-url') || '',
      cloudflareChallenge:
        location.pathname.startsWith('/cdn-cgi/') ||
        document.querySelector(cloudflareSelectors.join(',')) !== null,
      href: location.href,
      pageTitle: document.title,
      readerMounted: !!shadow?.querySelector('.mnr-reader'),
      readerRoot: !!root,
    };
  }, chapterUrlPart);
}

async function waitForUrl(page: Page, url: string): Promise<void> {
  await page.waitForFunction(expectedUrl => location.href === expectedUrl, url, {
    timeout: 30_000,
  });
}

async function pressAndWait(
  page: Page,
  key: 'ArrowLeft' | 'ArrowRight',
  url: string
): Promise<void> {
  await page.keyboard.press(key);
  await waitForUrl(page, url);
}

test('xszj deep flow merges query-paged chapter and covers prev/next navigation', async ({
  browserName: _browserName,
}, testInfo) => {
  test.setTimeout(240_000);

  const context = await launchPersistentMnrContext(testInfo, {
    blockHeavyResources: true,
    headlessFallback: true,
  });
  const pagedRequests: string[] = [];

  try {
    await addMyNovelReaderUserscript(context);
    context.on('request', request => {
      const url = request.url();
      if (/xszj\.org\/b\/490346\/c\/1534359\?page=\d/.test(url)) {
        pagedRequests.push(url);
      }
    });

    const page = await context.newPage();
    const logs = createConsoleCollector(page);
    const response = await page.goto(START_URL, {
      timeout: 60_000,
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);

    await waitForMnrReader(page);
    await page.waitForFunction(
      tailSentinel => {
        const shadow = document.querySelector('#mnr-reader-root')?.shadowRoot;
        const article = Array.from(
          shadow?.querySelectorAll('article.mnr-reader-content') || []
        ).find(item => /c\/1534359/.test(item.getAttribute('data-chapter-url') || ''));
        return !!article && (article.textContent || '').includes(tailSentinel);
      },
      PAGE_SENTINELS[3],
      { timeout: 30_000 }
    );

    expect(response?.status()).toBe(200);
    const state = await collectXszjState(page, '/c/1534359');
    expect(state.cloudflareChallenge).toBe(false);
    expect(state.readerRoot).toBe(true);
    expect(state.readerMounted).toBe(true);
    expect(state.pageTitle).toContain(BOOK_TITLE);
    // 标题剥离了站点页码后缀 “（1/4）”
    expect(state.articleTitle).toBe(CHAPTER_TITLE);
    // 章节 URL 使用裸地址作为缓存键
    expect(state.articleUrl).toBe(START_URL);
    // ?page=2..4 被合并进同一章
    expect(state.articleChars).toBeGreaterThan(3000);
    for (const sentinel of PAGE_SENTINELS) {
      expect(state.articleText).toContain(sentinel);
    }
    // 站点壳层文本不得混入正文
    for (const junk of ['小说之家', '报错', '手机上看', '分享本章', '返回顶部']) {
      expect(state.articleText).not.toContain(junk);
    }
    // 合并所需的分页请求确实发生
    for (const pageNo of [2, 3, 4]) {
      expect(pagedRequests.some(url => url.endsWith(`?page=${pageNo}`))).toBe(true);
    }

    const screenshotPath = await saveStableScreenshot(page, 'xszj-deep', START_URL);
    printRunSummary('xszj-deep', {
      logs,
      screenshotPath,
      state,
      status: response?.status() ?? null,
      targetUrl: START_URL,
    });

    // 下一章（跳过 ?page=2..4），再返回上一章
    await pressAndWait(page, 'ArrowRight', NEXT_CHAPTER_URL);
    await waitForMnrReader(page);
    await page.waitForFunction(
      () => {
        const shadow = document.querySelector('#mnr-reader-root')?.shadowRoot;
        const article = Array.from(
          shadow?.querySelectorAll('article.mnr-reader-content') || []
        ).find(item => /c\/1534362/.test(item.getAttribute('data-chapter-url') || ''));
        return !!article && (article.textContent || '').length > 800;
      },
      undefined,
      { timeout: 30_000 }
    );
    const nextState = await collectXszjState(page, '/c/1534362');
    expect(nextState.readerMounted).toBe(true);
    expect(nextState.articleTitle).toContain('第94章');

    // 从第94章返回第93章（该页“上一章”指回无参数的 /c/1534359），合并内容仍然完整
    await pressAndWait(page, 'ArrowLeft', START_URL);
    await waitForMnrReader(page);
    await page.waitForFunction(
      tailSentinel => {
        const shadow = document.querySelector('#mnr-reader-root')?.shadowRoot;
        const article = Array.from(
          shadow?.querySelectorAll('article.mnr-reader-content') || []
        ).find(item => /c\/1534359/.test(item.getAttribute('data-chapter-url') || ''));
        return !!article && (article.textContent || '').includes(tailSentinel);
      },
      PAGE_SENTINELS[3],
      { timeout: 30_000 }
    );
    const prevState = await collectXszjState(page, '/c/1534359');
    expect(prevState.readerMounted).toBe(true);
    expect(prevState.articleTitle).toBe(CHAPTER_TITLE);
    expect(prevState.articleText).toContain(PAGE_SENTINELS[3]);
  } finally {
    await context.close();
  }
});

test('xszj deep link entry converges on the canonical chapter URL', async ({
  browserName: _browserName,
}, testInfo) => {
  test.setTimeout(240_000);

  const context = await launchPersistentMnrContext(testInfo, {
    blockHeavyResources: true,
    headlessFallback: true,
  });
  const chapterRequests: string[] = [];

  try {
    await addMyNovelReaderUserscript(context);
    context.on('request', request => {
      const url = request.url();
      if (/xszj\.org\/b\/490346\/c\/1534359(?:\?page=\d+)?$/.test(url)) {
        chapterRequests.push(url);
      }
    });

    const page = await context.newPage();
    const logs = createConsoleCollector(page);
    const response = await page.goto(`${START_URL}?page=2`, {
      timeout: 60_000,
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);

    await waitForMnrReader(page);
    await page.waitForFunction(
      tailSentinel => {
        const shadow = document.querySelector('#mnr-reader-root')?.shadowRoot;
        const article = Array.from(
          shadow?.querySelectorAll('article.mnr-reader-content') || []
        ).find(item => /c\/1534359/.test(item.getAttribute('data-chapter-url') || ''));
        return !!article && (article.textContent || '').includes(tailSentinel);
      },
      PAGE_SENTINELS[3],
      { timeout: 30_000 }
    );

    expect(response?.status()).toBe(200);
    const state = await collectXszjState(page, '/c/1534359');
    expect(state.readerMounted).toBe(true);
    // 深链入口收敛到裸地址，与首页入口共享同一缓存键
    expect(state.articleUrl).toBe(START_URL);
    expect(state.articleTitle).toBe(CHAPTER_TITLE);
    for (const sentinel of PAGE_SENTINELS) {
      expect(state.articleText).toContain(sentinel);
    }
    // 请求保留 page=1，章节身份则在确认分页链后收敛到裸地址。
    expect(chapterRequests.some(url => url.endsWith('?page=1'))).toBe(true);
    expect(chapterRequests.some(url => url.endsWith('?page=3'))).toBe(true);
    expect(chapterRequests.some(url => url.endsWith('?page=4'))).toBe(true);

    const screenshotPath = await saveStableScreenshot(page, 'xszj-deeplink', START_URL);
    printRunSummary('xszj-deeplink', {
      logs,
      screenshotPath,
      state,
      status: response?.status() ?? null,
      targetUrl: `${START_URL}?page=2`,
    });

    // 深链入口同样直达真实下一章
    await pressAndWait(page, 'ArrowRight', NEXT_CHAPTER_URL);
    await waitForMnrReader(page);
    const nextState = await collectXszjState(page, '/c/1534362');
    expect(nextState.articleTitle).toContain('第94章');
  } finally {
    await context.close();
  }
});
