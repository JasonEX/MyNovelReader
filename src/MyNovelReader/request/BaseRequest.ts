import type { SiteConfig } from '../types';
import { RequestStatus } from './constants';

/**
 * Abstract base class for all request types.
 */
export abstract class BaseRequest {
  protected errorHandle: () => void = () => {};
  protected finishHandle: () => void = () => {};
  protected siteInfo: SiteConfig;
  public status: RequestStatus = RequestStatus.Idle;

  constructor(siteInfo: SiteConfig) {
    this.siteInfo = siteInfo;
  }

  setErrorHandle(func: () => void): void {
    this.errorHandle = func;
  }

  setFinishHandle(func: () => void): void {
    this.finishHandle = func;
  }

  abstract send(url: string, referer?: string): Promise<Document | null>;
  abstract getDocument(): Document | null;
  abstract hide(): void;
  abstract show(): void;
}
