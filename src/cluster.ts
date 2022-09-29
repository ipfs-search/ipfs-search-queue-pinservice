import { exit } from "node:process";
import cluster from "cluster";
import debuggerFactory from "debug";

import { deploy, undeploy } from "./server.js";

import { HOST, PORT, PROCESSES } from "./conf.js";

const debug = debuggerFactory("ipfs-search-push:cluster");

function forkWorkers() {
  // Start workers and listen for messages containing notifyRequest
  debug(`Starting ${PROCESSES} worker processes.`);

  let workerCount = 0;
  cluster.on("listening", (worker, address) => {
    workerCount++;

    debug("Started worker %d: %s", workerCount, worker);

    if (workerCount == PROCESSES) {
      console.log(
        `${workerCount} workers started and listening on http://${address.address}:${address.port}`
      );
    }
  });

  cluster.on("exit", function (worker) {
    console.log(`worker ${worker.process.pid} died.\nshutting down server.`);
    exit(1);
  });

  for (let i = 0; i < PROCESSES; i++) {
    debug(i);
    cluster.fork();
  }
}

// async function startWorker() {
//   const app = deploy();

// app.listen(PORT, HOST, () => {
//   debug(`Started server on http://${HOST}:${PORT}/`)
// });
// }

// if (cluster.isPrimary) {
//   debug('starting cluster')
//   forkWorkers();
// } else {
//   debug('starting worker')
//   startWorker();
// }

// quit on ctrl-c when running docker in terminal
process.on("SIGINT", function onSigint() {
  debug(`[${new Date().toISOString()}] Got SIGINT (aka ctrl-c in docker). Graceful shutdown`);
  undeploy();
});

// quit properly on docker stop
process.on("SIGTERM", function onSigterm() {
  debug(`[${new Date().toISOString()}] Got SIGTERM (docker container stop). Graceful shutdown`);
  undeploy();
});

deploy();
