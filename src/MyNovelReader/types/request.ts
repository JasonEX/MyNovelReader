/**
 * Request layer types and constants.
 */

/**
 * Request status enumeration.
 */
export enum RequestStatus {
  Idle = 0,
  Loading = 1,
  Finish = 2,
  Fail = 3,
}

/**
 * iframe height constant for IframeRequest.
 * Uses unsafeWindow.innerHeight in UserScript context,
 * falls back to window.innerHeight in non-browser environments.
 */
export const iframeHeight: number =
  typeof unsafeWindow !== 'undefined'
    ? unsafeWindow.innerHeight
    : typeof window !== 'undefined'
      ? window.innerHeight
      : 800; // default fallback

/**
 * Base request interface shared by HttpRequest and IframeRequest.
 */
export interface BaseRequest {
  setErrorHandle(func: () => void): void;
  setFinishHandle(func: () => void): void;
  send(url: string, referer?: string): Promise<Document | null>;
  getDocument(): Document | null;
  hide(): void;
  show(): void;
}
