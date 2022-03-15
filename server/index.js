import server from "./server.js";
import config from './config.js';
import { logger } from './util.js';

server.listen(config.port).on('listening', () => logger.info(`Server running at port: ${config.port}`));