/**
 * UserScript Meta Block Generator
 *
 * Centralized userscript metadata for build and runtime usage.
 * Uses simplified @match rules since we now have intelligent auto-detection.
 */

import { BUILD_DATE, VERSION } from './version';

// This userscript supports many sites via auto-detection.
// Keep @connect permissive so GM_xmlhttpRequest works on any supported host.
const CONNECTS = ['*'];

export const META_BASE = {
  id: 'mynovelreader@ywzhaiqi@gmail.com',
  name: 'My Novel Reader',
  'name:zh-CN': '小说阅读脚本',
  'name:zh-TW': '小說閱讀腳本',
  namespace: 'https://github.com/ywzhaiqi',
  author: 'ywzhaiqi',
  contributor: 'JasonEX, Roger Au, shyangs, JixunMoe、akiba9527 及其他网友',
  description: '小说阅读脚本，统一阅读样式，内容去广告、修正拼音字、段落整理，自动下一页',
  'description:zh-CN': '小说阅读脚本，统一阅读样式，内容去广告、修正拼音字、段落整理，自动下一页',
  'description:zh-TW': '小說閱讀腳本，統一閱讀樣式，內容去廣告、修正拼音字、段落整理，自動下一頁',
  license: 'GPL version 3',
  homepageURL: 'https://greasyfork.org/scripts/292/',
  supportURL: 'https://github.com/JasonEX/MyNovelReader/issues',

  // GM API grants
  grants: [
    'GM_xmlhttpRequest',
    'GM_addStyle',
    'GM_getValue',
    'GM_setValue',
    'GM_deleteValue',
    'GM_listValues',
    'GM_getResourceURL',
    'GM_openInTab',
    'GM_setClipboard',
    'GM_registerMenuCommand',
    'GM_info',
    'unsafeWindow',
  ],

  // Network connections - allow all to avoid breaking unknown/unsupported-yet sites
  connects: CONNECTS,

  // Simplified match patterns - auto-detection handles the rest
  // These cover the most common novel site URL patterns
  matches: [
    // Common novel chapter URL patterns
    '*://*/*.html',
    '*://*/*.htm',
    '*://*/*.shtml',
    '*://*/*/*.html',
    '*://*/*/*.htm',
    '*://*/*/*/*.html',
    '*://*/*/*/*.htm',
    '*://*/*/*/*/*.html',

    // Common route patterns
    '*://*/txt/*/*',
    '*://*/book/*/*',
    '*://*/read/*/*',
    '*://*/chapter/*/*',
    '*://*/novel/*/*',
    // Template-style routes used by a bunch of mobile novel sites (no .html)
    '*://*/xs_*/*/*',
    '*://*/xs_*/*/*/*',
    '*://*/gb_*/*/*',
    '*://*/gb_*/*/*/*',

    // Major novel platforms (explicit for better UX)
    '*://www.qidian.com/chapter/*/*',
    '*://m.qidian.com/chapter/*/*',
    '*://read.qidian.com/chapter/*',
    '*://vipreader.qidian.com/chapter/*/*',
    '*://book.zongheng.com/chapter/*/*.html',
    '*://read.zongheng.com/chapter/*/*.html',
    '*://www.17k.com/chapter/*/*.html',
    '*://book.sfacg.com/Novel/*/*/*/',
    '*://weread.qq.com/web/reader/*',
    '*://www.ciweimao.com/chapter/*',
    '*://wap.ciweimao.com/chapter/*',
    '*://www.tadu.com/book/*/*/',
    '*://tieba.baidu.com/p/*',
    '*://masiro.me/admin/novelReading*',

    // Explicitly supported sites with numeric/custom routes. Keep these explicit so the
    // userscript menu and manual entry are available even when generic path patterns miss.
    '*://dingdianzww.org/*',
    '*://www.dingdianzww.org/*',
    '*://deqixs.org/*',
    '*://www.deqixs.org/*',
    '*://deqixs.co/*',
    '*://www.deqixs.co/*',

    // PHP patterns
    '*://*/*.php?*',

    // Numbered patterns
    '*://*/*_*.html',
    '*://*/book/*/*.html',
    '*://*/chapter/*/*.html',
    '*://*/read/*/*.html',
  ],

  // Exclude patterns
  excludes: [
    '*://*/*/index.html',
    '*://*/*/list.html',
    '*://*/*/catalog.html',
    '*://*/search/*',
    '*://*/login*',
    '*://*/register*',
    '*://www.tadu.com/book/*/toc/',
  ],

  // Resources (none needed with new architecture)
  resources: [],

  // External dependencies (minimized)
  requires: [],
};

export type UserscriptMeta = typeof META_BASE & {
  version: string;
  buildDate?: string;
};

export function createMeta(params: { version: string; buildDate?: string }): UserscriptMeta {
  return { ...META_BASE, version: params.version, buildDate: params.buildDate };
}

export const META = createMeta({ version: VERSION, buildDate: BUILD_DATE });

/**
 * Generate the full meta block string
 */
export function generateMetaBlock(meta: UserscriptMeta = META): string {
  const lines: string[] = ['// ==UserScript=='];

  // Basic info
  lines.push(`// @id             ${meta.id}`);
  lines.push(`// @name           ${meta.name}`);
  lines.push(`// @name:zh-CN     ${meta['name:zh-CN']}`);
  lines.push(`// @name:zh-TW     ${meta['name:zh-TW']}`);
  lines.push(`// @version        ${meta.version}`);
  lines.push(`// @namespace      ${meta.namespace}`);
  lines.push(`// @author         ${meta.author}`);
  lines.push(`// @contributor    ${meta.contributor}`);
  lines.push(`// @description    ${meta.description}`);
  lines.push(`// @description:zh-CN  ${meta['description:zh-CN']}`);
  lines.push(`// @description:zh-TW  ${meta['description:zh-TW']}`);
  lines.push(`// @license        ${meta.license}`);
  lines.push(`// @homepageURL    ${meta.homepageURL}`);
  lines.push(`// @supportURL     ${meta.supportURL}`);

  // Grants
  lines.push('');
  for (const grant of meta.grants) {
    lines.push(`// @grant          ${grant}`);
  }

  // Connects
  lines.push('');
  for (const connect of meta.connects) {
    lines.push(`// @connect        ${connect}`);
  }

  // Matches
  lines.push('');
  lines.push('// Match patterns (auto-detection handles specifics)');
  for (const match of meta.matches) {
    lines.push(`// @match          ${match}`);
  }

  // Excludes
  lines.push('');
  for (const exclude of meta.excludes) {
    lines.push(`// @exclude        ${exclude}`);
  }

  // Requires (if any)
  if (meta.requires.length > 0) {
    lines.push('');
    for (const require of meta.requires) {
      lines.push(`// @require        ${require}`);
    }
  }

  // Resources (if any)
  if (meta.resources.length > 0) {
    lines.push('');
    for (const resource of meta.resources) {
      lines.push(`// @resource       ${resource}`);
    }
  }

  // Build info comment
  if (meta.buildDate) {
    lines.push('');
    lines.push(`// @build-date     ${meta.buildDate}`);
  }
  lines.push('// ==/UserScript==');

  return lines.join('\n');
}

/**
 * Export for vite-plugin-monkey or similar build tools
 */
export function toUserscriptConfig(meta: UserscriptMeta = META): Record<string, unknown> {
  const config: Record<string, unknown> = {
    id: meta.id,
    name: meta.name,
    'name:zh-CN': meta['name:zh-CN'],
    'name:zh-TW': meta['name:zh-TW'],
    version: meta.version,
    namespace: meta.namespace,
    author: meta.author,
    contributor: meta.contributor,
    description: meta.description,
    'description:zh-CN': meta['description:zh-CN'],
    'description:zh-TW': meta['description:zh-TW'],
    license: meta.license,
    homepageURL: meta.homepageURL,
    supportURL: meta.supportURL,
    // Run as early as possible to block mobile ad-tech redirects (common on some novel sites).
    'run-at': 'document-start',
    match: meta.matches,
    exclude: meta.excludes,
    grant: meta.grants,
    connect: meta.connects,
    require: meta.requires,
    resource: meta.resources,
  };

  if (meta.buildDate) {
    config['build-date'] = meta.buildDate;
  }

  return config;
}

export const userscriptConfig = toUserscriptConfig(META);
