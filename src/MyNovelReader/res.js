import './lang';
import tpl_mainCss from './res/main.css.txt';
import tpl_preferencesHTML from './res/preferences.tpl';
import tpl_preferencesCSS from './res/preferences.css.txt';

let cachedPreferencesHTML;
function getPreferencesHTML() {
  if (cachedPreferencesHTML === undefined) {
    cachedPreferencesHTML = tpl_preferencesHTML.uiTrans().replace(/\\n/g, '\n');
  }
  return cachedPreferencesHTML;
}

var Res = {
  CSS_MAIN: tpl_mainCss,

  getPreferencesHTML,

  get preferencesHTML() {
    return getPreferencesHTML();
  },

  preferencesCSS: tpl_preferencesCSS,
};

export default Res;
