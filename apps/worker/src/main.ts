import { loadRuntimeConfig } from '@merchantpilot/config';
import { createLogger } from '@merchantpilot/observability';

const config = loadRuntimeConfig();
const logger = createLogger('worker', config.LOG_LEVEL);

logger.info('Worker runtime initialized');
