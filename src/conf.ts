import { cpus } from 'node:os';
import { env } from 'node:process'

export const ENVIRONMENT = env.NODE_ENV || 'development'; // 'production' in production
export const PROCESSES = parseInt(env.PROCESSES) || cpus().length;
export const HOST = env.PINSERVICE_HOST || "localhost";
export const PORT = parseInt(env.PINSERVICE_PORT || "7070");
export const QUEUE_HOST = env.AMQP_URL || "amqp://guest:guest@localhost:5672";
