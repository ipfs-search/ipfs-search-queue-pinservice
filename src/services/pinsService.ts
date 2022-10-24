import { Request, Response } from "express";
import {CID} from "multiformats";
import queueService from "./queueService.js";
import { IGetPinsResponse, IPinResponse } from "../types/pin";

export function getPins(req: Request, res: Response) {
  res.status(202).send(<IGetPinsResponse>{
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
          // TODO: do we need to add any delegates here?
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
