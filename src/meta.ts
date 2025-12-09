/**
 * UserScript Meta Block Generator
 *
 * Generates the UserScript meta block with version from version.ts
 * Uses simplified @match rules since we now have intelligent auto-detection
 */

import { VERSION } from '@/version';

/** Build timestamp */
const BUILD_DATE = new Date().toISOString().split('T')[0];

/** UserScript meta information */
export const META = {
  id: 'mynovelreader@ywzhaiqi@gmail.com',
  name: 'My Novel Reader',
  'name:zh-CN': '小说阅读脚本',
  'name:zh-TW': '小說閱讀腳本',
  version: VERSION,
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

  // Network connections
  connects: ['*'],

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

    // Major novel platforms (explicit for better UX)
    '*://www.qidian.com/chapter/*/*',
    '*://m.qidian.com/chapter/*/*',
    '*://vipreader.qidian.com/chapter/*/*',
    '*://book.zongheng.com/chapter/*/*.html',
    '*://read.zongheng.com/chapter/*/*.html',
    '*://www.17k.com/chapter/*/*.html',
    '*://www.jjwxc.net/onebook.php?*',
    '*://book.sfacg.com/Novel/*/*/*/',
    '*://weread.qq.com/web/reader/*',

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
  ],

  // Resources (none needed with new architecture)
  resources: [],

  // External dependencies (minimized)
  requires: [],
};

/**
 * Generate the full meta block string
 */
export function generateMetaBlock(): string {
  const lines: string[] = ['// ==UserScript=='];

  // Basic info
  lines.push(`// @id             ${META.id}`);
  lines.push(`// @name           ${META.name}`);
  lines.push(`// @name:zh-CN     ${META['name:zh-CN']}`);
  lines.push(`// @name:zh-TW     ${META['name:zh-TW']}`);
  lines.push(`// @version        ${META.version}`);
  lines.push(`// @namespace      ${META.namespace}`);
  lines.push(`// @author         ${META.author}`);
  lines.push(`// @contributor    ${META.contributor}`);
  lines.push(`// @description    ${META.description}`);
  lines.push(`// @description:zh-CN  ${META['description:zh-CN']}`);
  lines.push(`// @description:zh-TW  ${META['description:zh-TW']}`);
  lines.push(`// @license        ${META.license}`);
  lines.push(`// @homepageURL    ${META.homepageURL}`);
  lines.push(`// @supportURL     ${META.supportURL}`);

  // Grants
  lines.push('');
  for (const grant of META.grants) {
    lines.push(`// @grant          ${grant}`);
  }

  // Connects
  lines.push('');
  for (const connect of META.connects) {
    lines.push(`// @connect        ${connect}`);
  }

  // Matches
  lines.push('');
  lines.push('// Match patterns (auto-detection handles specifics)');
  for (const match of META.matches) {
    lines.push(`// @match          ${match}`);
  }

  // Excludes
  lines.push('');
  for (const exclude of META.excludes) {
    lines.push(`// @exclude        ${exclude}`);
  }

  // Requires (if any)
  if (META.requires.length > 0) {
    lines.push('');
    for (const require of META.requires) {
      lines.push(`// @require        ${require}`);
    }
  }

  // Resources (if any)
  if (META.resources.length > 0) {
    lines.push('');
    for (const resource of META.resources) {
      lines.push(`// @resource       ${resource}`);
    }
  }

  // Build info comment
  lines.push('');
  lines.push(`// @build-date     ${BUILD_DATE}`);
  lines.push('// ==/UserScript==');

  return lines.join('\n');
}

/**
 * Export for vite-plugin-monkey or similar build tools
 */
export const userscriptConfig = {
  name: META.name,
  namespace: META.namespace,
  version: META.version,
  description: META.description,
  author: META.author,
  license: META.license,
  homepage: META.homepageURL,
  supportURL: META.supportURL,
  match: META.matches,
  exclude: META.excludes,
  grant: META.grants,
  connect: META.connects,
};
