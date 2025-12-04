import tpl_mainCss from './res/main.css.txt'
import tpl_preferencesHTML from './res/preferences.tpl'
import tpl_preferencesCSS from './res/preferences.css.txt'

var Res = {
  CSS_MAIN: tpl_mainCss,

  preferencesHTML: tpl_preferencesHTML
    .uiTrans().replace(/\\n/g, '\n'),

  preferencesCSS: tpl_preferencesCSS,
};

export default Res

