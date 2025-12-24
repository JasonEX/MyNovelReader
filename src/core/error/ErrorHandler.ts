/**
 * Centralized Error Handling System
 *
 * Provides unified error handling, user notification, and error reporting
 * capabilities throughout the application.
 *
 * @module ErrorHandler
 */

/**
 * Error context information
 */
export interface ErrorContext {
  /** Component or module where error occurred */
  component: string;
  /** Action being performed when error occurred */
  action: string;
  /** URL being processed (if applicable) */
  url?: string;
  /** Additional data relevant to the error */
  data?: Record<string, unknown>;
}

/**
 * Error severity level
 */
export enum ErrorSeverity {
  /** Information only, not a real error */
  Info = 'info',
  /** Warning, operation continued */
  Warning = 'warning',
  /** Error, operation failed but can be retried */
  Error = 'error',
  /** Critical error, application may be unstable */
  Critical = 'critical',
}

/**
 * Error report with metadata
 */
export interface ErrorReport {
  /** Error message */
  message: string;
  /** Error stack trace */
  stack?: string;
  /** Error context */
  context: ErrorContext;
  /** Severity level */
  severity: ErrorSeverity;
  /** Timestamp */
  timestamp: number;
  /** User-friendly message */
  userMessage: string;
}

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
  /** Enable console logging (default: true) */
  enableConsole?: boolean;
  /** Enable user notifications (default: true) */
  enableNotifications?: boolean;
  /** Enable error reporting (default: false) */
  enableReporting?: boolean;
  /** Custom notification handler */
  notificationHandler?: (message: string, severity: ErrorSeverity) => void;
  /** Custom error reporter */
  errorReporter?: (report: ErrorReport) => void | Promise<void>;
}

/**
 * Custom error types
 */
export class ChapterLoadError extends Error {
  constructor(
    message: string,
    public url?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ChapterLoadError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public url?: string,
    public timeout?: boolean
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ParserError extends Error {
  constructor(
    message: string,
    public url?: string,
    public selector?: string
  ) {
    super(message);
    this.name = 'ParserError';
  }
}

/**
 * Centralized error handler
 *
 * @example
 * ```typescript
 * const handler = ErrorHandler.getInstance();
 *
 * try {
 *   await loadChapter();
 * } catch (error) {
 *   handler.handleError(error, {
 *     component: 'ChapterLoader',
 *     action: 'loadChapter',
 *     url: chapterUrl
 *   });
 * }
 * ```
 */
export class ErrorHandler {
  private static instance: ErrorHandler | null = null;
  private options: Required<ErrorHandlerOptions>;
  private errorHistory: ErrorReport[] = [];
  private readonly maxHistorySize = 100;

  private constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      enableConsole: options.enableConsole ?? true,
      enableNotifications: options.enableNotifications ?? true,
      enableReporting: options.enableReporting ?? false,
      notificationHandler: options.notificationHandler ?? this.defaultNotificationHandler,
      errorReporter: options.errorReporter ?? this.defaultErrorReporter,
    };
  }

  /**
   * Get the singleton ErrorHandler instance
   *
   * @param options - Options to configure the handler (only on first call)
   * @returns ErrorHandler instance
   */
  static getInstance(options?: ErrorHandlerOptions): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler(options);
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle an error with context
   *
   * @param error - The error to handle
   * @param context - Error context
   * @param severity - Error severity (default: auto-detected)
   */
  handleError(error: Error | string, context: ErrorContext, severity?: ErrorSeverity): void {
    // Normalize error
    const normalizedError = this.normalizeError(error);

    // Auto-detect severity if not provided
    const detectedSeverity = severity ?? this.detectSeverity(normalizedError, context);

    // Create error report
    const report: ErrorReport = {
      message: normalizedError.message,
      stack: normalizedError.stack,
      context,
      severity: detectedSeverity,
      timestamp: Date.now(),
      userMessage: this.getUserFriendlyMessage(normalizedError, context),
    };

    // Add to history
    this.addToHistory(report);

    // Log to console
    if (this.options.enableConsole) {
      this.logToConsole(report);
    }

    // Notify user
    if (this.options.enableNotifications) {
      this.notifyUser(report);
    }

    // Report error
    if (this.options.enableReporting) {
      this.reportError(report);
    }
  }

  /**
   * Handle an async error with context
   *
   * @param error - The error to handle
   * @param context - Error context
   * @param severity - Error severity
   */
  async handleAsyncError(
    error: Error | string,
    context: ErrorContext,
    severity?: ErrorSeverity
  ): Promise<void> {
    this.handleError(error, context, severity);
  }

  /**
   * Wrap an async function with error handling
   *
   * @param fn - Async function to wrap
   * @param context - Error context
   * @returns Wrapped function with error handling
   */
  wrapAsync<TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => Promise<TResult>,
    context: ErrorContext
  ): (...args: TArgs) => Promise<TResult> {
    return async (...args: TArgs) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError(error as Error, context);
        throw error; // Re-throw for caller to handle
      }
    };
  }

  /**
   * Get error history
   *
   * @param filter - Optional filter by severity
   * @returns Array of error reports
   */
  getHistory(filter?: ErrorSeverity): ErrorReport[] {
    if (filter) {
      return this.errorHistory.filter(report => report.severity === filter);
    }
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Get error statistics
   *
   * @returns Error statistics by severity
   */
  getStats(): Record<ErrorSeverity, number> {
    const stats: Record<string, number> = {
      [ErrorSeverity.Info]: 0,
      [ErrorSeverity.Warning]: 0,
      [ErrorSeverity.Error]: 0,
      [ErrorSeverity.Critical]: 0,
    };

    for (const report of this.errorHistory) {
      stats[report.severity]++;
    }

    return stats as Record<ErrorSeverity, number>;
  }

  /**
   * Normalize error to Error object
   *
   * @param error - Error or string
   * @returns Normalized Error object
   */
  private normalizeError(error: Error | string): Error {
    if (typeof error === 'string') {
      return new Error(error);
    }
    return error;
  }

  /**
   * Detect error severity based on error type and context
   *
   * @param error - Normalized error
   * @param _context - Error context
   * @returns Detected severity
   */
  private detectSeverity(error: Error, _context: ErrorContext): ErrorSeverity {
    // Critical errors
    if (error.name === 'ChunkLoadError' || error.message.includes('critical')) {
      return ErrorSeverity.Critical;
    }

    // VIP/付费 content errors are just informational
    if (error.message.includes('VIP') || error.message.includes('付费')) {
      return ErrorSeverity.Info;
    }

    // Network errors
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return ErrorSeverity.Warning;
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      return ErrorSeverity.Warning;
    }

    // Default to error level
    return ErrorSeverity.Error;
  }

  /**
   * Generate user-friendly error message
   *
   * @param error - Normalized error
   * @param _context - Error context
   * @returns User-friendly message
   */
  private getUserFriendlyMessage(error: Error, _context: ErrorContext): string {
    const message = error.message.toLowerCase();

    // VIP/付费 content
    if (message.includes('vip') || message.includes('付费')) {
      return '该章节为VIP/付费内容，无法加载';
    }

    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return '网络连接失败，请检查网络设置后重试';
    }

    // Parser errors
    if (message.includes('parse') || message.includes('content not found')) {
      return '章节解析失败，该页面可能不是章节页';
    }

    // Validation errors
    if (message.includes('invalid') || message.includes('validation')) {
      return '输入数据格式不正确';
    }

    // Default message
    return `加载失败：${error.message}`;
  }

  /**
   * Log error to console with proper formatting
   *
   * @param report - Error report
   */
  private logToConsole(report: ErrorReport): void {
    const prefix = `[MNR][${report.context.component}][${report.severity.toUpperCase()}]`;

    switch (report.severity) {
      case ErrorSeverity.Critical:
      case ErrorSeverity.Error:
        console.error(prefix, report.context.action, ':', report.message);
        if (report.stack) {
          console.error('Stack:', report.stack);
        }
        break;

      case ErrorSeverity.Warning:
        console.warn(prefix, report.context.action, ':', report.message);
        break;

      case ErrorSeverity.Info:
        console.info(prefix, report.context.action, ':', report.message);
        break;
    }
  }

  /**
   * Notify user of error
   *
   * @param report - Error report
   */
  private notifyUser(report: ErrorReport): void {
    this.options.notificationHandler(report.userMessage, report.severity);
  }

  /**
   * Report error to external service
   *
   * @param _report - Error report
   */
  private async reportError(_report: ErrorReport): Promise<void> {
    // Default implementation - override via options for actual reporting
  }

  /**
   * Default notification handler
   *
   * @param message - User-friendly message
   * @param severity - Error severity
   */
  private defaultNotificationHandler(message: string, severity: ErrorSeverity): void {
    // Default implementation - can be overridden
    // In a real implementation, this would show a toast or notification
    console.log('[User Notification]', message, `(severity: ${severity})`);
  }

  /**
   * Add error to history
   *
   * @param report - Error report
   */
  private addToHistory(report: ErrorReport): void {
    this.errorHistory.push(report);

    // Keep history size limited
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
  }
}

/**
 * Convenience function to handle errors
 *
 * @param error - Error to handle
 * @param context - Error context
 * @param severity - Error severity
 */
export function handleError(
  error: Error | string,
  context: ErrorContext,
  severity?: ErrorSeverity
): void {
  const handler = ErrorHandler.getInstance();
  handler.handleError(error, context, severity);
}

/**
 * Create an error handler for a specific component
 *
 * @param component - Component name
 * @returns Component-specific error handler
 */
export function createComponentErrorHandler(component: string) {
  const handler = ErrorHandler.getInstance();

  return {
    handle(error: Error | string, action: string, url?: string): void {
      handler.handleError(error, { component, action, url });
    },

    wrap<TArgs extends unknown[], TResult>(
      fn: (...args: TArgs) => Promise<TResult>,
      action: string
    ): (...args: TArgs) => Promise<TResult> {
      return handler.wrapAsync(fn, { component, action });
    },
  };
}

/**
 * Handle async errors in Promise chains
 *
 * @param context - Error context
 * @returns Function that can be passed to Promise.catch()
 */
export function createAsyncErrorHandler(context: ErrorContext) {
  return (error: unknown) => {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    handleError(normalizedError, context);
  };
}
