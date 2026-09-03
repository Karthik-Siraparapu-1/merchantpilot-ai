import { z } from 'zod';

const runtimeEnvironmentSchema = z.enum(['development', 'test', 'production']);

export const runtimeConfigSchema = z.object({
  NODE_ENV: runtimeEnvironmentSchema.default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3001)
});

export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>;

export const loadRuntimeConfig = (environment: NodeJS.ProcessEnv = process.env): RuntimeConfig =>
  runtimeConfigSchema.parse(environment);
