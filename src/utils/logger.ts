/**
 * @file Contains the library's logger utility.
 * Provides a singleton logger with structured logging capabilities.
 */

import log from "loglevel";
import type { LogLevelDesc } from "loglevel";

/**
 * Contextual information to include in log entries.
 */
export interface LogContext {
  component?: string;
  operation?: string;
  nodeId?: string;
  [key: string]: any;
}

/**
 * A structured log entry.
 */
export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: LogContext;
  error?: Error;
}

/**
 * A singleton logger utility.
 * Provides structured logging with contextual information and error handling.
 */
class Logger {
  private static instance: Logger;
  private context: LogContext = {};

  /**
   * Private constructor to enforce singleton pattern.
   * Sets the default log level based on the environment and overrides log methods to add structure.
   */
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

  /**
   * Returns the singleton instance of the Logger.
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Sets global context to be included in all log entries.
   * @param context - The global context to set.
   */
  public setGlobalContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Clears the global context.
   */
  public clearGlobalContext(): void {
    this.context = {};
  }

  /**
   * Logs a debug message.
   * @param message - The message to log.
   * @param context - Optional context to include in the log entry.
   * @param error - Optional error to include in the log entry.
   */
  public debug(message: string, context?: LogContext, error?: Error): void {
    log.debug(message, context, error);
  }

  /**
   * Logs an info message.
   * @param message - The message to log.
   * @param context - Optional context to include in the log entry.
   * @param error - Optional error to include in the log entry.
   */
  public info(message: string, context?: LogContext, error?: Error): void {
    log.info(message, context, error);
  }

  /**
   * Logs a warning message.
   * @param message - The message to log.
   * @param context - Optional context to include in the log entry.
   * @param error - Optional error to include in the log entry.
   */
  public warn(message: string, context?: LogContext, error?: Error): void {
    log.warn(message, context, error);
  }

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @param context - Optional context to include in the log entry.
   * @param error - Optional error to include in the log entry.
   */
  public error(message: string, context?: LogContext, error?: Error): void {
    log.error(message, context, error);
  }

  /**
   * Sets the log level.
   * @param level - The log level to set.
   */
  public setLevel(level: LogLevelDesc): void {
    log.setLevel(level);
  }
}

/**
 * Sets the log level for the logger.
 * @param level - The log level to set.
 */
export function setLogLevel(level: LogLevelDesc) {
  log.setLevel(level);
}

export const logger = Logger.getInstance();
export default logger;
