import logger from "debug";
import makeDebugger from "debug";
import { LOG_NAMESPACE } from "./conf.js";

export const log = logger(LOG_NAMESPACE);
export const logError = logger(`${LOG_NAMESPACE}:error`);
export const amqLogger = makeDebugger(`${LOG_NAMESPACE}:amqHandler`);
