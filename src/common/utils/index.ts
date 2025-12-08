import { GM_request as gmRequest } from './GM_request';
import { $x as rawXPathSelector } from './selector';

export { isFirefox, isChrome } from './detect';

type GMRequestOptions = Partial<Omit<xhrParams, 'url'>> & { timeout?: number };
type XPathSelector = (_aXPath: string, _aContext?: Node) => Node[];

export const GM_request: (_url: string, _opt?: GMRequestOptions) => Promise<GmXhrResponse> =
  gmRequest;

export const $x: XPathSelector = rawXPathSelector;

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
