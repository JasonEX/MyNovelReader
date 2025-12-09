/**
 * Single source of truth for version
 * This version will be synced to package.json and meta.js during build
 */
export const VERSION = '9.0.0';
export const BUILD_DATE = new Date().toISOString().split('T')[0];
