import Express, { Response, Request, NextFunction } from "express";
import healthcheck from "express-healthcheck";
import { initialize } from "@oas-tools/core";
import makeDebugger from "debug";
import express from "express";
import http from "http";
import amqplib from 'amqplib';


import { errorHandler } from "./errorHandler.js";

import { PORT } from "./conf.js";

const debug = makeDebugger("ipfs-search-enqueue-pinservice");

const config = {
  oasFile: "api/ipfs-pinning-service.yaml",
  strict: true,
  middleware: {
    router: {
      controllers: "./lib/controllers"
    },
    swagger: {
      disable: false,
    },
    security: {
      disable: true,
      // auth: {
      //   accessToken: () => { /* no-op */ },
      // }
    }
  }
}


const amqtest = async () => {
  const queue = 'hashes';
  const conn = await amqplib.connect('amqp://localhost');

  const ch2 = await conn.createChannel();

  const options = {
    deliveryMode: 'persistent',
    mandatory: true,
    contentType: "application/json",
  }
  const payload = {"Protocol":1,"ID":"QmScsxzCV1bJnNokCA8jHnU2X8uek37BxbrBUEdUFridOH","Source":5}

  ch2.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), options);
  ch2.close()
}

export const deploy = () => {
  const app = Express()
  app.use(express.json({limit: '50mb'}));

  initialize(app, config).then(() => {
    http.createServer(app).listen(PORT, () => {
      debug("App running at http://localhost:" + PORT);
      if (config.middleware.swagger?.disable !== true) {
        debug('API docs (Swagger UI) available on http://localhost:' + PORT + '/docs');
      }
    });
  });

  app.use(errorHandler);

  app.use("/healthcheck", healthcheck());

  return app;
};

export const undeploy = () => {
  process.exit();
};


