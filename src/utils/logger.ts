import log from "loglevel";
import type { LogLevelDesc } from "loglevel";

export interface LogContext {
  component?: string;
  operation?: string;
  nodeId?: string;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private context: LogContext = {};

  private constructor() {
    // Set default level based on environment.
    const defaultLevel: LogLevelDesc =
      process.env.NODE_ENV === "production" ? "WARN" : "DEBUG";
    log.setLevel(defaultLevel);

    // Override log methods to add structure.
    const originalFactory = log.methodFactory;
    log.methodFactory = (methodName, logLevel, loggerName) => {
      const rawMethod = originalFactory(methodName, logLevel, loggerName);

      return (message: any, context?: LogContext, error?: Error) => {
        // In production, only log WARN and above
        if (
          process.env.NODE_ENV === "production" &&
          logLevel < log.levels.WARN
        ) {
          return;
        }

        const logEntry: LogEntry = {
          timestamp: new Date().toISOString(),
          level: methodName.toUpperCase(),
          message:
            typeof message === "string" ? message : JSON.stringify(message),
          context: { ...this.context, ...context },
        };

        if (error) {
          logEntry.error = {
            name: error.name,
            message: error.message,
            stack: error.stack,
          };
        }

        // Format for development: human readable.
        if (process.env.NODE_ENV !== "production") {
          const contextStr =
            logEntry.context && Object.keys(logEntry.context).length > 0
              ? `[${Object.entries(logEntry.context)
                  .map(([k, v]) => `${k}=${v}`)
                  .join(", ")}]`
              : "";

          rawMethod(
            `${logEntry.timestamp} ${logEntry.level} ${contextStr} ${logEntry.message}`,
          );
          if (error) {
            rawMethod(error.stack);
          }
        } else {
          // Format for production: JSON for better parsing.
          rawMethod(JSON.stringify(logEntry));
        }
      };
    };

    // Apply the new method factory to all logging methods.
    log.setLevel(log.getLevel());
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setGlobalContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  public clearGlobalContext(): void {
    this.context = {};
  }

  public debug(message: string, context?: LogContext, error?: Error): void {
    log.debug(message, context, error);
  }

  public info(message: string, context?: LogContext, error?: Error): void {
    log.info(message, context, error);
  }

  public warn(message: string, context?: LogContext, error?: Error): void {
    log.warn(message, context, error);
  }

  public error(message: string, context?: LogContext, error?: Error): void {
    log.error(message, context, error);
  }

  public setLevel(level: LogLevelDesc): void {
    log.setLevel(level);
  }
}

export function setLogLevel(level: LogLevelDesc) {
  log.setLevel(level);
}

export const logger = Logger.getInstance();
export default logger;
