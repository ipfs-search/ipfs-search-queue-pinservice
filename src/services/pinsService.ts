import { createHash } from "crypto";
import { Request, Response } from "express";
import queueService from "./queueService.js";
import { IErrorResponse, IPinResults, IPinStatus } from "../types/pin";
import { DELEGATES } from "../conf.js";

export function getPins(req: Request, res: Response) {
  res
    .status(200)
    .setHeader("content-type", "application/json")
    .send(<IPinResults>{
      count: 0,
      results: [],
    });
}

export function addPin(req: Request, res: Response) {
  queueService
    .sendToQueue(req.body.cid)
    .then(() => {
      try {
        res
          .status(202)
          .setHeader("content-type", "application/json")
          .send(<IPinStatus>{
            // needs a unique identifier, so hash the cid+timestamp
            requestid: createHash("sha256").update(`${req.body.cid}${Date.now()}`).digest("hex"),
            status: "queued",
            created: new Date().toISOString(),
            pin: req.body,
            delegates: DELEGATES,
          });
      } catch (error: any) {
        // Note that this code should never be reached, if the response is formatted well
        res
          .status(500)
          .setHeader("content-type", "application/json")
          .send(<IErrorResponse>{
            error: {
              reason: "Validation error",
              details: error.toString(),
            },
          });
      }
    })
    .catch((error: any) => {
      res
        .status(500)
        .setHeader("content-type", "application/json")
        .send(<IErrorResponse>{
          error: {
            reason: "RabbitMQ Error",
            details: error.toString(),
          },
        });
    });
}
