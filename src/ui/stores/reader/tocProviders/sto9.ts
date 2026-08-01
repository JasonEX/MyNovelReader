import { createAjaxChapterListLoader } from './ajaxChapterList';

export const sto9TocLoader = createAjaxChapterListLoader({
  id: 'sto9',
  ruleIds: ['sto9'],
  matchesHost: hostname => /^(?:www\.)?sto9\.com$/i.test(hostname),
  matchesChapterPath: pathname => /^\/txt\/\d+\/\d+\.html?$/i.test(pathname),
});
