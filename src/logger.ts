/**
 * @file Provides logging utilities for the library, allowing fine-grained control over
 * logging.
 */
import log from 'loglevel';

log.setLevel('info');

/**
 * Sets the log level for the logger.
 * @param level - The log level to set (e.g., 'info', 'debug', 'warn', 'error').
 */
export function setLogLevel(level: log.LogLevelDesc) {
  log.setLevel(level);
}

export default log;
