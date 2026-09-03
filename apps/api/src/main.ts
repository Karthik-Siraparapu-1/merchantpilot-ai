import 'reflect-metadata';

import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { loadRuntimeConfig } from '@merchantpilot/config';
import type { HealthStatus } from '@merchantpilot/contracts';
import { createLogger } from '@merchantpilot/observability';

@Controller('health')
class HealthController {
  @Get()
  getStatus(): HealthStatus {
    return {
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString()
    };
  }
}

@Module({ controllers: [HealthController] })
class AppModule {}

async function bootstrap(): Promise<void> {
  const config = loadRuntimeConfig();
  const logger = createLogger('api', config.LOG_LEVEL);
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger({
    log: (message) => logger.info({ message }, 'nest'),
    error: (message, trace) => logger.error({ message, trace }, 'nest'),
    warn: (message) => logger.warn({ message }, 'nest'),
    debug: (message) => logger.debug({ message }, 'nest'),
    verbose: (message) => logger.trace({ message }, 'nest'),
    fatal: (message) => logger.fatal({ message }, 'nest')
  });

  await app.listen(config.API_PORT);
}

bootstrap().catch((error: unknown) => {
  createLogger('api').fatal({ error }, 'API bootstrap failed');
  process.exitCode = 1;
});
