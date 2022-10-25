
// TODO: proper mocks here
import { IPinStatus } from "../types/pin";

export function funcpinsrequestid(req, res) {
  res
    .status(200)
    .setHeader("content-type", "application/json")
    .send(<IPinStatus>{
  });
}

export function getPinByRequestId(req, res) {
  res.send({
  });
}

export function replacePinByRequestId(req, res) {
  res.send({
  });
}

export function deletePinByRequestId(req, res) {
  res.send({
  });
}
