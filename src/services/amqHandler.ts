import * as amqplib from "amqplib";
import { IQueueHandler } from "../types/IQueueHandler";
import { QUEUE_HOST } from "../conf.js";
import { amqLogger } from "../logger.js";

const queue = "hashes";
let connection: amqplib.Connection | null;
let channel: amqplib.ConfirmChannel | null;

/**
 * Set up a RabbitMQ connection. If the connection is unavailable, keep trying
 * every 5s until it becomes available
 */
const initialize = async () => {
  while (!connection) {
    try {
      await amqplib.connect(QUEUE_HOST).then(
        (conn) => {
          amqLogger(`Connected to RabbitMQ at ${QUEUE_HOST}`);
          connection = conn;
          connection.on("error", resetConnection);
          connection.on("close", resetConnection);
        },
        async (error) => {
          amqLogger(`${error?.code} Unable to connect to RabbitMQ; trying again`);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      );
    } catch (error: any) {
      amqLogger(`${error?.code} Error trying to connect to RabbitMQ; trying again`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  channel = await connection.createConfirmChannel();
};

const resetConnection = async () => {
  amqLogger("Connection error; resetting connection to RabbitMQ");
  connection = null;
  channel = null;
  await initialize();
};

const close = async () => {
  await channel?.close();
  await connection?.close();
};

const sendToQueue = (CID: string) => {
  const options = {
    deliveryMode: 2,
    mandatory: true,
    contentType: "application/json",
    priority: 9,
  };
  // Source 4 = usersource (see https://github.com/ipfs-search/ipfs-search/blob/master/types/sourcetype.go#L29)
  const payload = { Protocol: 1, ID: CID, Source: 4 };

  try {
    channel?.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), options);
  } catch (error: any) {
    return Promise.reject(error.toString());
  }
  return new Promise((resolve, reject) => {
    channel?.waitForConfirms().then(resolve).catch(reject);
  });
};

export default <IQueueHandler>{
  initialize,
  close,
  sendToQueue,
};
