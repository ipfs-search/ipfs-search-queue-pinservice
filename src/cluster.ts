import { exit } from "node:process";
import cluster from "cluster";
import { log } from "./logger.js";
import { config, deploy, undeploy } from "./server.js";
import { HOST, PORT, PROCESSES } from "./conf.js";

let workerCount = 0;
cluster.on("listening", (worker) => {
  workerCount++;
  log(`Started worker ${worker.id} with pid ${worker.process.pid}. ${workerCount} workers are running`)
  if(workerCount === PROCESSES) {
    log(`App running at http://${HOST}:${PORT}`);
    if (config.middleware.swagger?.disable !== true) {
      log(`API docs (Swagger UI) available on http://${HOST}:${PORT}/docs`);
    }
  }
});

// quit on ctrl-c when running docker in terminal
process.on("SIGINT", function onSigint() {
  workerCount--;
  log(`Got SIGINT (ctrl-c). Graceful shutdown of pid ${process.pid}`);
  undeploy();
});

// quit properly on docker stop
process.on("SIGTERM", function onSigterm() {
  workerCount--;
  log(`Got SIGTERM (docker container stop). Graceful shutdown of pid ${process.pid}`);
  undeploy();
});

cluster.on("exit", function (worker) {
  workerCount--;
  log(`Worker ${worker.id} with pid ${worker.process.pid} died. ${workerCount} workers are still running.`);
  exit(1);
  // N.b. this means that if one worker gets killed, the entire cluster is taken offline.
});

if (cluster.isPrimary) {
  for (let i = 0; i < PROCESSES; i++) {
    cluster.fork();
  }
} else {
  deploy();
}

