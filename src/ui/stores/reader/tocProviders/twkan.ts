import { createAjaxChapterListLoader } from './ajaxChapterList';

export const twkanTocLoader = createAjaxChapterListLoader({
  id: 'twkan',
  ruleIds: ['twkan'],
  matchesHost: hostname => /^twkan\.com$/i.test(hostname),
  matchesChapterPath: pathname => /^\/txt\/\d+\/\d+\/?$/i.test(pathname),
  cleanTitle: title => title.replace(/^\s*\d+[.、\s]+/, '').trim(),
});
