import { Request, Response } from "express";
import queueService from "./queueService.js";
import { IGetPinsResponse, IPinResponse } from "../types/pin";

export function getPins(req: Request, res: Response) {
  res
    .status(200)
    .setHeader("content-type", "application/json")
    .send(<IGetPinsResponse>{
      count: 0,
      results: [],
    });
}

export function addPin(req: Request, res: Response) {
  queueService
    .sendToQueue(req.body.cid)
    .then(() => {
      res
        .status(202)
        .setHeader("content-type", "application/json")
        .send(<IPinResponse>{
          // TODO: proper requestid; maybe CID? Or something from rabbitMQ?
          requestid: "",
          status: "queued",
          created: new Date().toISOString(),
          pin: req.body,
          // TODO: What should be the delegate?
          delegates: [""],
        });
    })
    .catch((error) => {
      res
        .status(500)
        .setHeader("content-type", "application/json")
        .send({
          error: {
            reason: "RabbitMQ Error",
            details: error,
          },
        });
    });
}
