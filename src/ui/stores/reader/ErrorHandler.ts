/**
 * Error Handler Module
 *
 * Centralized error handling with toast notifications.
 *
 * @module ErrorHandler
 */

/**
 * Error Handler - manages error state and toast notifications
 */
export class ErrorHandler {
  private error: string | null = null;
  private toastType: 'info' | 'error' = 'error';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Get current error message
   */
  getError(): string | null {
    return this.error;
  }

  /**
   * Get current toast type
   */
  getToastType(): 'info' | 'error' {
    return this.toastType;
  }

  /**
   * Set error message
   *
   * @param message - Error message or null to clear
   */
  setError(message: string | null): void {
    this.error = message;
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Show toast notification
   *
   * @param message - Toast message
   * @param type - Toast type ('info' or 'error')
   * @param duration - Duration in milliseconds (default: 2000)
   */
  showToast(message: string, type: 'info' | 'error' = 'info', duration = 2000): void {
    this.toastType = type;
    this.error = message;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    if (duration > 0) {
      this.toastTimer = setTimeout(() => {
        this.error = null;
        this.toastTimer = null;
      }, duration);
    } else {
      this.toastTimer = null;
    }
  }

  /**
   * Clear toast timer
   */
  clearToastTimer(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.clearToastTimer();
  }
}

/**
 * Create error handler instance
 */
export function createErrorHandler(): ErrorHandler {
  return new ErrorHandler();
}
