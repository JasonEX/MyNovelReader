import { GM_request as gmRequest } from './GM_request';
import { $x as rawXPathSelector } from './selector';

export { isFirefox, isChrome } from './detect';

type GMRequestOptions = Partial<Omit<xhrParams, 'url'>> & { timeout?: number };
type XPathSelector = (aXPath: string, aContext?: Node) => Node[];

export const GM_request: (url: string, opt?: GMRequestOptions) => Promise<GmXhrResponse> =
  gmRequest;

export const $x: XPathSelector = rawXPathSelector;

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
