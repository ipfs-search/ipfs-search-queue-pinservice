export interface IQueueHandler {
  initialize: () => Promise<void>;
  close: () => Promise<void>;
  sendToQueue: (CID: string) => Promise<void>;
}
