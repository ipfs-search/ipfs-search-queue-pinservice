export interface IQueueHandler {
  initialize: (options: { queueHost?: string }) => Promise<void>;
  close: () => Promise<void>;
  sendToQueue: (CID: string) => Promise<void>;
}
