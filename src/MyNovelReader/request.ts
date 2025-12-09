/**
 * Request layer adapter - replaces the old request.js with new implementation.
 * Maintains backward compatibility for existing imports.
 */
export { RequestStatus, iframeHeight } from './request/constants';
export { HttpRequest } from './request/HttpRequest';
export { IframeRequest } from './request/IframeRequest';
