// Error Logging Service for Gharpayy

interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  user_id?: string;
  context?: Record<string, unknown>;
}

class ErrorLogger {
  private endpoint: string | null = null;

  constructor() {
    // Configure error logging endpoint
    this.endpoint = import.meta.env.VITE_SENTRY_DSN || null;
  }

  public log(error: Error | string, context?: Record<string, unknown>): void {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context,
    };

    // Log to console
    console.error('ErrorLogger:', errorLog);

    // Send to error reporting service
    if (this.endpoint) {
      this.sendToService(errorLog);
    }
  }

  public logInfo(message: string, context?: Record<string, unknown>): void {
    console.info('Info:', { message, context, timestamp: new Date().toISOString() });
  }

  public logWarning(message: string, context?: Record<string, unknown>): void {
    console.warn('Warning:', { message, context, timestamp: new Date().toISOString() });
  }

  private async sendToService(errorLog: ErrorLog): Promise<void> {
    try {
      await fetch(this.endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
    } catch (error) {
      console.error('Failed to send error log:', error);
    }
  }
}

export const errorLogger = new ErrorLogger();
