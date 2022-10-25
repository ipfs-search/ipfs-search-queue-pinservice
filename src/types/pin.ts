interface IPin {
  cid: string;
  name: string;
  origins: string[];
  meta: Record<string, unknown>;
}

type QueueStatus = "queued" | "pinning" | "pinned" | "failed";

export interface IPinResponse {
  requestid: string;
  status: QueueStatus;
  created: string;
  pin: IPin;
  delegates: [...string[]];
  info?: Record<string, unknown>;
}

export interface IGetPinsResponse {
  count: number;
  results: IPinResponse[];
}
