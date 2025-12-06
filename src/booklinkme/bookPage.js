import { $x, GM_request } from '../common/utils';
import config from './config';

async function getAndInsertFirst(url) {
  try {
    const response = await GM_request(url);
    const html = typeof response === 'string' ? response : response && response.responseText;
    if (!html) {
      console.error('getAndInsertFirst empty response', url);
      return;
    }
    var doc = new DOMParser().parseFromString(html, 'text/html');

    if (url.includes('www.lwxs520.com')) {
      var chapters = $x('//div[@class="dccss"]/a', doc);
      var lastChapter = chapters[chapters.length - 1];

      insertToFirst(url, lastChapter.textContent);
    }
  } catch (error) {
    console.error('getAndInsertFirst request failed', url, error);
  }
}

function insertToFirst(newUrl, text) {
  var firstLink = $x('//font[text()="补充链接"]/..')[0];
  firstLink.insertAdjacentHTML(
    'beforebegin',
    `
      <a href="${newUrl}" target="_blank" style="margin-right: 3px;">
          <font color="red">${text}</font>
      </a>`
  );
  return firstLink;
}

export function fixErrorBook() {
  const thisPageBookName = $('h1').text().trim();
  const txt = config.newsites;
  txt.split('\n').forEach(line => {
    const [bookName, newUrl, newName] = line.split(/,|，/g);
    if (bookName == thisPageBookName) {
      insertToFirst(newUrl, newName || '我的补充');
    }
  });
}
