export interface IPin {
  cid: string;
  name: string;
  origins: string[];
  meta: Record<string, unknown>;
}

type QueueStatus = "queued" | "pinning" | "pinned" | "failed";

export interface IPinStatus {
  requestid: string;
  status: QueueStatus;
  created: string;
  pin: IPin;
  delegates: [string, ...string[]];
  info?: Record<string, unknown>;
}

export interface IPinResults {
  count: number;
  results: IPinStatus[];
}
