export enum Level {
  Error,
  Info,
  Debug,
}

export class Logger {
  protected prefix: string;
  protected level: Level;

  constructor(prefix: string, level: Level) {
    this.prefix = prefix;
    this.level = level;
  }

  extend = (prefix: string): Logger => {
    return new Logger(`${this.prefix}: ${prefix}`, this.level);
  };

  debug = (...s: any[]) => {
    if (this.level >= Level.Debug) {
      console.debug(`[DEBUG: ${this.prefix}]:`, ...s);
    }
  };

  info = (...s: any[]) => {
    if (this.level >= Level.Info) {
      console.info(`[INFO: ${this.prefix}]:`, ...s);
    }
  };

  error = (...s: any[]) => {
    if (this.level >= Level.Error) {
      console.error(`[ERROR: ${this.prefix}]:`, ...s);
    }
  };
}

export function getDefaultLogger(): Logger {
  return defaultLogger;
}

export function setDefaultLogger(logger: Logger): Logger {
  defaultLogger = logger;
  defaultLogger.debug("Configured default logger.");
  return defaultLogger;
}

let defaultLogger = new Logger("App", Level.Debug);
