import { type BrowserContext, expect, type Page, test, type TestInfo } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

import {
  addMyNovelReaderUserscript,
  getFirstPage,
  getMnrE2eConfig,
  launchPersistentMnrContext,
  waitForMnrReader,
} from './mnrE2e';

type CpuProfileNode = {
  id: number;
  hitCount?: number;
  callFrame: {
    functionName: string;
    url: string;
    lineNumber: number;
  };
};

type CpuProfile = {
  nodes: CpuProfileNode[];
  samples?: number[];
  timeDeltas?: number[];
  startTime: number;
  endTime: number;
};

type PerformanceMetric = { name: string; value: number };

const profileDir = path.resolve('.test/performance');

function summarizeProfile(profile: CpuProfile) {
  const nodeById = new Map(profile.nodes.map(node => [node.id, node]));
  const samples = profile.samples || [];
  const counts = new Map<number, number>();
  for (const id of samples) counts.set(id, (counts.get(id) || 0) + 1);
  const sampledMs = (profile.timeDeltas || []).reduce((sum, value) => sum + value, 0) / 1000;
  const msPerSample = samples.length > 0 ? sampledMs / samples.length : 0;

  const topSelf = Array.from(counts.entries())
    .map(([id, count]) => {
      const node = nodeById.get(id);
      return {
        functionName: node?.callFrame.functionName || '(anonymous)',
        url: node?.callFrame.url || '',
        line: (node?.callFrame.lineNumber ?? -1) + 1,
        samples: count,
        estimatedSelfMs: Number((count * msPerSample).toFixed(2)),
      };
    })
    .filter(entry => !['(idle)', '(program)', '(garbage collector)'].includes(entry.functionName))
    .sort((a, b) => b.samples - a.samples)
    .slice(0, 20);

  return {
    durationMs: Number(((profile.endTime - profile.startTime) / 1000).toFixed(2)),
    sampledMs: Number(sampledMs.toFixed(2)),
    sampleCount: samples.length,
    topSelf,
  };
}

function metricsToRecord(metrics: PerformanceMetric[]) {
  return Object.fromEntries(metrics.map(metric => [metric.name, metric.value]));
}

function diffMetrics(before: Record<string, number>, after: Record<string, number>) {
  const keys = [
    'TaskDuration',
    'ScriptDuration',
    'LayoutDuration',
    'RecalcStyleDuration',
    'LayoutCount',
    'RecalcStyleCount',
    'JSHeapUsedSize',
    'Nodes',
  ];
  return Object.fromEntries(
    keys.map(key => [key, Number(((after[key] || 0) - (before[key] || 0)).toFixed(4))])
  );
}

async function startProfiler(context: BrowserContext, page: Page) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', { interval: 100 });
  const before = metricsToRecord(
    ((await cdp.send('Performance.getMetrics')) as { metrics: PerformanceMetric[] }).metrics
  );
  await cdp.send('Profiler.start');

  return {
    async stop(label: string, testInfo: TestInfo, extra: Record<string, unknown>) {
      const { profile } = (await cdp.send('Profiler.stop')) as { profile: CpuProfile };
      const after = metricsToRecord(
        ((await cdp.send('Performance.getMetrics')) as { metrics: PerformanceMetric[] }).metrics
      );
      const summary = {
        label,
        ...extra,
        metricsDelta: diffMetrics(before, after),
        cpu: summarizeProfile(profile),
      };

      await mkdir(profileDir, { recursive: true });
      const profilePath = path.join(profileDir, `${label}.cpuprofile`);
      const summaryPath = path.join(profileDir, `${label}.json`);
      await writeFile(profilePath, JSON.stringify(profile));
      await writeFile(summaryPath, JSON.stringify(summary, null, 2));
      await testInfo.attach(`${label}-cpu-profile`, {
        path: profilePath,
        contentType: 'application/json',
      });
      await testInfo.attach(`${label}-summary`, {
        path: summaryPath,
        contentType: 'application/json',
      });
      console.log(JSON.stringify(summary, null, 2));
      return summary;
    },
  };
}

test('profiles large-TOC and reader interactions on a deterministic page', async ({
  context,
  page,
}, testInfo) => {
  test.setTimeout(120_000);
  const chapterUrl = 'http://mnr-profile.test/chapter/2500.html';
  const paragraphs = Array.from(
    { length: 180 },
    (_, index) => `<p>第 ${index + 1} 段压力测试正文，用于测量滚动、章节定位和阅读进度更新。</p>`
  ).join('');
  const toc = Array.from(
    { length: 5000 },
    (_, index) => `<a href="/chapter/${index + 1}.html">第 ${index + 1} 章 性能测试</a>`
  ).join('');

  await context.route(chapterUrl, route =>
    route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: `<!doctype html><html><head><title>第2500章 性能测试</title></head><body><h1>第2500章 性能测试</h1><main id="content">${paragraphs}</main><nav><a href="/chapter/2499.html">上一章</a><a href="/book/index.html">目录</a><a href="/chapter/2501.html">下一章</a></nav></body></html>`,
    })
  );
  await context.route('http://mnr-profile.test/book/index.html', route =>
    route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: `<!doctype html><html><body>${toc}</body></html>`,
    })
  );
  await addMyNovelReaderUserscript(context);
  const startupStartedAt = performance.now();
  await page.goto(chapterUrl, { waitUntil: 'domcontentloaded' });
  await waitForMnrReader(page);
  const startupMs = performance.now() - startupStartedAt;
  const profiler = await startProfiler(context, page);

  const interactions = await page.locator('#mnr-reader-root').evaluate(async host => {
    const shadow = host.shadowRoot!;
    const waitFor = async (predicate: () => boolean) => {
      const startedAt = performance.now();
      while (!predicate()) {
        if (performance.now() - startedAt > 10_000)
          throw new Error('Timed out waiting for UI state');
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      }
    };

    const tocStartedAt = performance.now();
    shadow.querySelector<HTMLElement>('[aria-label="打开目录"]')?.click();
    await waitFor(() => !!shadow.querySelector('#mnr-chapter-search'));
    const tocOpenMs = performance.now() - tocStartedAt;
    const renderedRows = shadow.querySelectorAll('.mnr-chapter-button').length;

    const search = shadow.querySelector<HTMLInputElement>('#mnr-chapter-search')!;
    const searchStartedAt = performance.now();
    search.value = '第 4999 章';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    await waitFor(() => shadow.querySelectorAll('.mnr-chapter-button').length === 1);
    const searchMs = performance.now() - searchStartedAt;

    search.value = '';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    await waitFor(() => shadow.querySelectorAll('.mnr-chapter-button').length > 1);
    const drawer = shadow.querySelector<HTMLElement>('.mnr-drawer-content')!;
    const drawerScrollStartedAt = performance.now();
    for (let index = 0; index < 120; index++) {
      drawer.scrollTop = (index / 119) * Math.max(0, drawer.scrollHeight - drawer.clientHeight);
      drawer.dispatchEvent(new Event('scroll'));
      if (index % 6 === 0)
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
    const drawerScrollMs = performance.now() - drawerScrollStartedAt;
    shadow.querySelector<HTMLElement>('[aria-label="关闭目录"]')?.click();

    const settingsStartedAt = performance.now();
    shadow.querySelector<HTMLElement>('[aria-label="打开设置"]')?.click();
    await waitFor(() => !!shadow.querySelector('.mnr-more-settings'));
    const settingsOpenMs = performance.now() - settingsStartedAt;
    shadow.querySelector<HTMLElement>('[aria-label="关闭设置"]')?.click();

    const reader = shadow.querySelector<HTMLElement>('.mnr-reader-main')!;
    const readerScrollStartedAt = performance.now();
    for (let index = 0; index < 180; index++) {
      reader.scrollTop = (index / 179) * Math.max(0, reader.scrollHeight - reader.clientHeight);
      reader.dispatchEvent(new Event('scroll'));
      if (index % 6 === 0)
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
    const readerScrollMs = performance.now() - readerScrollStartedAt;

    return {
      tocOpenMs,
      searchMs,
      drawerScrollMs,
      readerScrollMs,
      settingsOpenMs,
      renderedRows,
      finalRenderedRows: shadow.querySelectorAll('.mnr-chapter-button').length,
    };
  });

  expect(interactions.renderedRows).toBeLessThan(50);
  expect(interactions.finalRenderedRows).toBeLessThan(50);
  await profiler.stop('local-ui-profile', testInfo, { startupMs, interactions });
});

test('profiles startup and rendering on the real target chapter', async ({
  browserName: _browserName,
}, testInfo) => {
  test.skip(
    process.env.MNR_PROFILE_REAL !== '1',
    'Set MNR_PROFILE_REAL=1 to profile the real site'
  );
  const config = getMnrE2eConfig();
  test.setTimeout(Math.max(120_000, config.readerTimeoutMs + 60_000));
  const context = await launchPersistentMnrContext(testInfo, {
    blockHeavyResources: true,
    headlessFallback: true,
  });

  try {
    await addMyNovelReaderUserscript(context);
    const page = await getFirstPage(context);
    const profiler = await startProfiler(context, page);
    const startedAt = performance.now();
    const response = await page.goto(config.targetUrl, {
      timeout: 60_000,
      waitUntil: 'domcontentloaded',
    });
    const state = await waitForMnrReader(page);
    const startupMs = performance.now() - startedAt;
    await profiler.stop('real-site-startup-profile', testInfo, {
      startupMs,
      status: response?.status() ?? null,
      contentChars: state.contentChars,
      paragraphCount: state.paragraphCount,
      targetUrl: config.targetUrl,
    });
  } finally {
    await context.close();
  }
});
