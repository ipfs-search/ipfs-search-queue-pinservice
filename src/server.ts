import Express, { Response, Request, NextFunction } from "express";
import healthcheck from "express-healthcheck";
import { initialize } from "@oas-tools/core";
import makeDebugger from "debug";
import express from "express";
import http from "http";

import amqHandler from "./services/amqHandler.js";
import { errorHandler } from "./errorHandler.js";

import { PORT, QUEUE_HOST } from "./conf.js";

const debug = makeDebugger("ipfs-search-enqueue-pinservice");

const config = {
  oasFile: "api/ipfs-pinning-service.yaml",
  strict: true,
  middleware: {
    router: {
      controllers: "./lib/controllers",
    },
    swagger: {
      disable: false,
    },
    security: {
      disable: true,
      // auth: {
      //   accessToken: () => { /* no-op */ },
      // }
    },
  },
};

export const deploy = () => {
  amqHandler.initialize({ queueHost: QUEUE_HOST });

  const app = Express();
  app.use(express.json({ limit: "50mb" }));

  initialize(app, config).then(() => {
    http.createServer(app).listen(PORT, () => {
      debug("App running at http://localhost:" + PORT);
      if (config.middleware.swagger?.disable !== true) {
        debug("API docs (Swagger UI) available on http://localhost:" + PORT + "/docs");
      }
    });
  });

  app.use(errorHandler);

  app.use("/healthcheck", healthcheck());

  return app;
};

export const undeploy = () => {
  amqHandler.close();
  process.exit();
};
