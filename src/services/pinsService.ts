import { Request, Response } from "express";
import makeDebugger from "debug";
import queueService from "./queueService.js";

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

export function addPin({ body }: Request, res: Response) {
  queueService.sendToQueue(body.cid);
  res
    .status(202)
    .setHeader("content-type", "application/json")
    .send(<IPinResponse>{
      // TODO: proper requestid; maybe CID? Or something from rabbitMQ?
      requestid: "",
      status: "queued",
      created: new Date().toISOString(),
      pin: body,
      // TODO: do we need to add any delegates here?
      delegates: [""],
    });
}
