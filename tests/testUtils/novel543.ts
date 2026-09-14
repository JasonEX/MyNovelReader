export const novel543Origin = 'https://www.novel543.com';
export const novel543BookPath = '/1019622989';
export const novel543BookTitle = '測試修仙小說';

export function novel543ChapterPath(chapter: number, page = 1): string {
  return `${novel543BookPath}/8096_${chapter}${page > 1 ? `_${page}` : ''}.html`;
}

export function makeNovel543Chapter(chapter: number, page = 1): string {
  const title = `第${chapter}章 百倍獎勵 (${page}/2)`;
  const paragraphs = Array.from(
    { length: 22 },
    (_, index) =>
      `<p>第${page}頁正文第${index + 1}段。這是用來驗證章節合併與正文提取的測試內容，應當完整保留。</p>`
  ).join('');
  return `<!doctype html><html lang="zh-cmn-Hant"><head><title>${title}</title>
    <meta name="keywords" content="${novel543BookTitle}官方首發,${novel543BookTitle}小說">
    </head><body id="read"><div id="chapterWarp">
    <div class="header"><ul class="nav"><li><a href="/">首页</a></li><li><a href="${novel543BookPath}/"></a></li></ul></div>
    <div class="chapter-content"><h1>${title}</h1><div class="content">
      <div class="gadBlock">廣告干擾</div>${paragraphs}
      <p>第${page}頁末句。</p>
      <p>他看到一張紙，上面寫著溫馨提示，便停下腳步。</p>
      <div class="adBlock">廣告干擾</div>
      <div><p><span>溫馨提示: </span>登錄用戶的「站內信」功能已經優化，請到用戶中心查看！</p></div>
      <div><p><span>溫馨提示: </span>搜書名找不到, 可以試試搜作者哦, 也許只是改名了!</p></div>
    </div></div></div><div class="foot-nav">
    <a href="${novel543ChapterPath(page === 1 ? chapter - 1 : chapter)}">上一章</a>
    <a href="${novel543BookPath}/dir">目錄</a>
    <a href="${novel543ChapterPath(page === 1 ? chapter : chapter + 1, page === 1 ? 2 : 1)}">下一章</a>
    </div></body></html>`;
}

export function makeNovel543Toc(): string {
  const link = (chapter: number) =>
    `<li><a href="${novel543ChapterPath(chapter)}">第${chapter}章 百倍獎勵</a></li>`;
  return `<title>${novel543BookTitle}章節列表 - 稷下書院</title><div class="chaplist">
    <ul>${[943, 942].map(link).join('')}</ul>
    <ul class="all">${[940, 941, 942, 943].map(link).join('')}</ul>
    </div>`;
}
