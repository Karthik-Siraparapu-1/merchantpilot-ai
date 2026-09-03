import pino, { type Logger, type LoggerOptions } from 'pino';

export type LoggerContext = Record<string, string | number | boolean | undefined>;

export const createLogger = (service: string, level = 'info'): Logger => {
  const options: LoggerOptions = {
    base: { service },
    level,
    redact: {
      paths: ['password', 'token', 'authorization', 'cookie', '*.secret', '*.apiKey'],
      remove: true
    }
  };

  return pino(options);
};
