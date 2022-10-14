import { Request, Response } from "express";
import makeDebugger from "debug";
import queueService from "./queueService.js";
import { body, validationResult } from "express-validator";

const debug = makeDebugger("ipfs-search-enqueue-pinservice");

type QueueStatus = "queued" | "pinning" | "pinned" | "failed";

interface IPinResponse {
  requestid: string;
  status: QueueStatus;
  created: string;
  pin: IPin;
  delegates: [string, ...string[]];
  info?: Record<string, unknown>;
}

interface IGetPinsResponse {
  count: number;
  results: IPinResponse[];
}

export function getPins(req: Request, res: Response) {
  res.status(202).send(<IGetPinsResponse>{
    count: 0,
    results: [],
  });
}

export function addPin(req: Request, res: Response) {
  queueService.sendToQueue(req.body.cid)
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
    .catch((error)=> {
      res.status(500)
        .setHeader("content-type", "application/json")
        .send({
          "error": {
            "reason": "RabbitMQ Error",
            "details": error
          }
        })
    })
}
