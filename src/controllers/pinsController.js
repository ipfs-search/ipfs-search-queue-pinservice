import * as service from "../services/pinsService.js";
import { CID } from "multiformats/cid";

export function getPins(req, res) {
  service.getPins(req, res);
}

export function addPin(req, res) {
  try {
    CID.parse(req.body.cid);
  } catch (error) {
    return res
      .status(400)
      .contentType("application/json")
      .send({
        error: {
          reason: "Bad CID provided in request body",
        },
      });
  }
  service.addPin(req, res)
}
