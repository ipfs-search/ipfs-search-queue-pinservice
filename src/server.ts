import Express from "express";
import healthcheck from "express-healthcheck";
import { initialize } from "@oas-tools/core";
import http from "http";

import amqHandler from "./services/amqHandler.js";
import { errorHandler } from "./errorHandler.js";

import { PORT, HOST, ENVIRONMENT } from "./conf.js";

export const config = {
  oasFile: "api/ipfs-pinning-service.yaml",
  strict: true,
  middleware: {
    router: {
      controllers: "./lib/controllers",
    },
    swagger: {
      disable: ENVIRONMENT === "production",
    },
    security: {
      disable: true,
    },
  },
};

export const deploy = async () => {
  await amqHandler.initialize();

  const app = Express();
  app.use(Express.json({ limit: "50mb" }));

  initialize(app, config).then(() => {
    http.createServer(app).listen(PORT, HOST, () => {});
  });

  app.use(errorHandler);

  app.use("/healthcheck", healthcheck());

  return app;
};

export const undeploy = () => {
  amqHandler.close();
  process.exit();
};
