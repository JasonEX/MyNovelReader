/**
 * Rule Store - Manages site rules
 */

import { defineStore } from 'pinia';
import { getRuleManager } from '@/core/rules/RuleManager';
import { ref } from 'vue';
import type { SiteRule } from '@/core/rules/types';

export const useRuleStore = defineStore('rule', () => {
  const userRules = ref<Map<string, SiteRule>>(new Map());
  const isLoading = ref(false);

  async function initialize() {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
      const manager = getRuleManager();
      await manager.initialize();

      userRules.value = new Map(manager.getAllUserRules());
    } catch (e) {
      console.error('[RuleStore] Initialize error:', e);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveUserRule(domain: string, rule: SiteRule) {
    try {
      const manager = getRuleManager();
      await manager.saveUserRule(domain, rule);
      userRules.value.set(domain, manager.getUserRule(domain) ?? rule);
    } catch (e) {
      console.error('[RuleStore] Save error:', e);
      throw e;
    }
  }

  async function deleteUserRule(domain: string) {
    try {
      const manager = getRuleManager();
      await manager.deleteUserRule(domain);
      userRules.value.delete(domain);
    } catch (e) {
      console.error('[RuleStore] Delete error:', e);
      throw e;
    }
  }

  function hasUserRule(domain: string): boolean {
    return userRules.value.has(domain);
  }

  return {
    initialize,
    saveUserRule,
    deleteUserRule,
    hasUserRule,
  };
});
