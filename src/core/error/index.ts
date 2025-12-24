/**
 * Error handling module exports
 *
 * Provides centralized error handling, custom error types,
 * and error reporting capabilities
 */

export {
  ErrorHandler,
  handleError,
  createComponentErrorHandler,
  createAsyncErrorHandler,
} from './ErrorHandler';

export { ChapterLoadError, ValidationError, NetworkError, ParserError } from './ErrorHandler';

export type { ErrorContext, ErrorReport, ErrorHandlerOptions } from './ErrorHandler';

export { ErrorSeverity } from './ErrorHandler';
