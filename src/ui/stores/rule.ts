/**
 * Rule Store - Manages site rules
 */

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { getRuleManager } from '@/core/rules/RuleManager';
import type { SiteRule } from '@/core/rules/types';

export const useRuleStore = defineStore('rule', () => {
  // State
  const userRules = ref<Map<string, SiteRule>>(new Map());
  const builtInRules = ref<SiteRule[]>([]);
  const isLoading = ref(false);
  const currentRule = ref<SiteRule | null>(null);
  const isEditing = ref(false);
  const editingRule = ref<SiteRule | null>(null);

  // Getters
  const userRuleCount = computed(() => userRules.value.size);
  const builtInRuleCount = computed(() => builtInRules.value.length);
  const totalRuleCount = computed(() => userRuleCount.value + builtInRuleCount.value);

  const userRuleList = computed(() => Array.from(userRules.value.values()));

  // Actions
  async function initialize() {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
      const manager = getRuleManager();
      await manager.initialize();

      // Load user rules
      const storage = manager.getStorage();
      userRules.value = await storage.getAllUserRules();

      // Load built-in rules count (don't load all data for performance)
      builtInRules.value = await manager.getBuiltInRules();
    } catch (e) {
      console.error('[RuleStore] Initialize error:', e);
    } finally {
      isLoading.value = false;
    }
  }

  async function matchRule(url: string): Promise<SiteRule | null> {
    try {
      const manager = getRuleManager();
      const result = await manager.matchRule(url);
      currentRule.value = result?.rule || null;
      return currentRule.value;
    } catch (e) {
      console.error('[RuleStore] Match error:', e);
      return null;
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

  function getUserRule(domain: string): SiteRule | undefined {
    return userRules.value.get(domain);
  }

  function hasUserRule(domain: string): boolean {
    return userRules.value.has(domain);
  }

  // Editing actions
  function startEditing(rule?: SiteRule) {
    isEditing.value = true;
    editingRule.value = rule ? { ...rule } : createEmptyRule();
  }

  function stopEditing() {
    isEditing.value = false;
    editingRule.value = null;
  }

  function updateEditingRule(updates: Partial<SiteRule>) {
    if (editingRule.value) {
      editingRule.value = { ...editingRule.value, ...updates };
    }
  }

  async function saveEditingRule(domain: string) {
    if (!editingRule.value) return;

    await saveUserRule(domain, editingRule.value);
    stopEditing();
  }

  function createEmptyRule(): SiteRule {
    return {
      id: `user-${Date.now()}`,
      name: '',
      version: 1,
      match: {
        pattern: '',
        type: 'regex',
      },
      content: {
        selector: '',
      },
      meta: {
        source: 'user',
        autoLaunch: true,
      },
    };
  }

  // Export/Import
  function exportRules(): string {
    const rules = Array.from(userRules.value.entries()).map(([domain, rule]) => ({
      domain,
      rule,
    }));
    return JSON.stringify(rules, null, 2);
  }

  async function importRules(json: string) {
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data)) {
        throw new Error('Invalid format: expected array');
      }

      for (const item of data) {
        if (item.domain && item.rule) {
          await saveUserRule(item.domain, item.rule);
        }
      }
    } catch (e) {
      console.error('[RuleStore] Import error:', e);
      throw e;
    }
  }

  function $reset() {
    userRules.value = new Map();
    builtInRules.value = [];
    isLoading.value = false;
    currentRule.value = null;
    isEditing.value = false;
    editingRule.value = null;
  }

  return {
    // State
    userRules,
    builtInRules,
    isLoading,
    currentRule,
    isEditing,
    editingRule,

    // Getters
    userRuleCount,
    builtInRuleCount,
    totalRuleCount,
    userRuleList,

    // Actions
    initialize,
    matchRule,
    saveUserRule,
    deleteUserRule,
    getUserRule,
    hasUserRule,
    startEditing,
    stopEditing,
    updateEditingRule,
    saveEditingRule,
    createEmptyRule,
    exportRules,
    importRules,
    $reset,
  };
});
