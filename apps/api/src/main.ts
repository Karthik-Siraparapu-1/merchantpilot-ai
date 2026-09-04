import 'reflect-metadata';

import { Controller, Get, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loadRuntimeConfig } from '@merchantpilot/config';
import type { HealthStatus } from '@merchantpilot/contracts';
import { createLogger } from '@merchantpilot/observability';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { HttpExceptionFilter } from './common/http-exception.filter';

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

@Module({
  imports: [AuthModule, ProductModule, InventoryModule],
  controllers: [HealthController]
})
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('MerchantPilot AI - Core Commerce API')
    .setDescription('Multi-tenant Commerce & Explainable AI REST Services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.API_PORT);
  logger.info({ port: config.API_PORT, docs: '/api/docs' }, 'API server started successfully');
}

bootstrap().catch((error: unknown) => {
  createLogger('api').fatal({ error }, 'API bootstrap failed');
  process.exitCode = 1;
});
