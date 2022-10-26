import { env } from "node:process";

export const ENVIRONMENT = env.NODE_ENV || "development";
export const PROCESSES = parseInt(env.PROCESSES) || 1;
export const HOST = env.PINSERVICE_HOST || "localhost";
export const PORT = parseInt(env.PINSERVICE_PORT || "7070");
export const QUEUE_HOST = env.AMQP_URL || "amqp://guest:guest@localhost:5672";
export const LOG_NAMESPACE = "queue-pinservice";

let delegates;
const delegates_err =
  "PINSERVICE_DELEGATES should be a JSON array with one or more delegates, e.g. [\"/ip4/161.230.143.49/tcp/64885/p2p/12D3KooWCfksHSx489oMAH2ysfNTvVtzQLj4u5PHfrXckYNzUU4x\"]. Consider running: PINSERVICE_DELEGATES=`ipfs id | jq -r -c '.Addresses'` npm start";
try {
  delegates = JSON.parse(env.PINSERVICE_DELEGATES);
  if (!Array.isArray(delegates)) throw new Error(delegates_err);
} catch (e) {
  throw new Error(delegates_err);
}
export const DELEGATES = delegates;
