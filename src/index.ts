/**
 * MyNovelReader - Main entry point
 *
 * A lightweight novel reader userscript with smart auto-detection
 */

// Re-export bootstrap functions
export {
  initialize,
  closeReader,
  manualEnable,
  isActive,
  getVersion,
  VERSION,
  BUILD_DATE,
} from '@/bootstrap';

// Re-export core modules for advanced users
export * from '@/core';

// Re-export UI stores
export * from '@/ui/stores';
