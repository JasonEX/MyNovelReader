import type { SiteConfig } from '../../../typings/MyNovelReader';
import Setting from '../../Setting';
import config from '../../config';
import Rule from '../../rule';
import { validateRuleSchemas } from '../../rule/schema';
import { C, L_getValue, L_removeValue, toRE } from '../../lib';

type RuleModule = {
  customRules: SiteConfig[];
  specialSite: SiteConfig[];
  customReplace: Record<string, string>;
  parseCustomReplaceRules: (_rules: string) => Record<string, string>;
  titleRegExp: RegExp;
};

const ruleModule = Rule as unknown as RuleModule;

type AutoLaunchResult = boolean | -1;

class SiteManager {
  private static instance: SiteManager;

  private constructor() {}

  static getInstance(): SiteManager {
    if (!SiteManager.instance) {
      SiteManager.instance = new SiteManager();
    }
    return SiteManager.instance;
  }

  loadCustomSetting(): void {
    let customRules: unknown;

    try {
      customRules = new Function(String(Setting.customSiteinfo));
    } catch (e) {
      C.error('载入自定义站点配置错误', e);
    }

    if (Array.isArray(customRules)) {
      ruleModule.customRules = customRules;
      validateRuleSchemas(ruleModule.customRules, 'customRules');
      C.log('载入自定义站点规则成功', customRules);
    }

    ruleModule.customReplace = ruleModule.parseCustomReplaceRules(
      String(Setting.customReplaceRules)
    );
    C.log('载入自定义替换规则成功', ruleModule.customReplace);
  }

  matchSite(url: string): SiteConfig | null {
    const rulesList = ruleModule.customRules.concat(ruleModule.specialSite);
    const info = rulesList.find(rule => toRE(rule.url).test(url));

    if (!info) {
      C.log('没有找到规则，尝试自动模式。');
      return null;
    }

    C.log('找到规则：', info);
    return info;
  }

  getCurSiteInfo(): SiteConfig | null {
    return this.matchSite(window.location.href);
  }

  isAutoLaunch(site: SiteConfig): AutoLaunchResult {
    void site;
    const locationHost = window.location.host;
    const referrer = document.referrer;

    switch (true) {
      case L_getValue('mynoverlreader_disable_once') === 'true':
        L_removeValue('mynoverlreader_disable_once');
        return false;
      case Setting.booklink_enable && /booklink\.me/.test(referrer):
        return true;
      case locationHost === 'tieba.baidu.com': {
        const title = $('.core_title_txt').text();
        if (title.match(ruleModule.titleRegExp)) {
          return false;
        }
        return -1;
      }
      case Setting.launchMode === 'manual':
        return false;
      case Setting.launchMode === 'auto':
      case GM_getValue('auto_enable'):
      case config.soduso && /www\.sodu\.so/.test(referrer):
        return true;
      default:
        return false;
    }
  }
}

const siteManager = SiteManager.getInstance();

export { SiteManager, siteManager };
export default siteManager;
