import { env, exit } from "node:process";
import { log } from "./logger.js";

export const ENVIRONMENT = env.NODE_ENV || "development";
export const PROCESSES = parseInt(env.PROCESSES || "") || 1;
export const HOST = env.PINSERVICE_HOST || "localhost";
export const PORT = parseInt(env.PINSERVICE_PORT || "7070");
export const QUEUE_HOST = env.AMQP_URL || "amqp://guest:guest@localhost:5672";

// set delegates of your ipfs node(s) e.g. using PINSERVICE_DELEGATES=ipfs id | jq -r -c '.Addresses'
// note that when not providing any delegates, the service will still work, but the client can give
// an error about the request
// Allowed formats for PINSERVICE_DELEGATES:
// string, comma-separated string, JSON array
let delegates: string[] = [""];

try {
  delegates = JSON.parse(env.PINSERVICE_DELEGATES || "");
  if (!Array.isArray(delegates)) throw new Error();
} catch (e) {
  if (env.PINSERVICE_DELEGATES) {
    delegates = env.PINSERVICE_DELEGATES?.split(",");
  }
}

if (delegates?.length > 20) {
  log("Bad value for PINSERVICE_DELEGATES env variable; maximum 20 values allowed");
  exit(1);
}
export const DELEGATES = delegates || [""];
