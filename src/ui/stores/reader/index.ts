/**
 * Reader Store Module - Barrel Export
 * Re-exports all types and the main store
 */

// Export types
export * from './types';

// Export utilities (for testing and external use)
export * from './utils';
export * from './detection';
export * from './toc';
export * from './section';

// The main store is in the parent reader.ts for now
// This allows gradual migration while maintaining compatibility
