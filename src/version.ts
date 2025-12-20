/**
 * Version constants injected at build time from package.json
 * Fallbacks are used when running in non-bundled contexts.
 */
declare const __MNR_VERSION__: string | undefined;
declare const __MNR_BUILD_DATE__: string | undefined;

export const VERSION =
  typeof __MNR_VERSION__ !== 'undefined' && __MNR_VERSION__ ? __MNR_VERSION__ : '0.0.0';
export const BUILD_DATE =
  typeof __MNR_BUILD_DATE__ !== 'undefined' && __MNR_BUILD_DATE__
    ? __MNR_BUILD_DATE__
    : new Date().toISOString().split('T')[0];
