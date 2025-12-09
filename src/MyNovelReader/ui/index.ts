import UI from '../UI';
import * as constants from './constants';
import * as managers from './managers';

export { default } from '../UI';
export { default as UI } from '../UI';
export * from './constants';
export * from './managers';
export * from './types';

export const createUIFacade = () => ({
  UI,
  constants,
  managers,
});

export const uiFacade = createUIFacade();
