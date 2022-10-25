import * as amqplib from "amqplib";
import { IQueueHandler } from "../types/IQueueHandler";
import { QUEUE_HOST } from "../conf.js";
import { amqLogger } from "../logger.js";

const queue = "hashes";
let connection: amqplib.Connection = null;
let channel: amqplib.ConfirmChannel;

const initialize = async () => {
  while (!connection) {
    try {
      await amqplib.connect(QUEUE_HOST).then(
        (conn) => {
          amqLogger("Connected to RabbitMQ");
          connection = conn;
        },
        async (error) => {
          amqLogger(error.code, "Unable to connect to RabbitMQ; trying again");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      );
    } catch (error) {
      amqLogger(error.code, "Error trying to connect to RabbitMQ; trying again");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  channel = await connection.createConfirmChannel();
};

const close = async () => {
  await channel.close();
  await connection.close();
};

const sendToQueue = (CID: string) => {
  const options = {
    deliveryMode: 2,
    mandatory: true,
    contentType: "application/json",
  };
  // Source 4 = usersource (see https://github.com/ipfs-search/ipfs-search/blob/master/types/sourcetype.go#L29)
  const payload = { Protocol: 1, ID: CID, Source: 4 };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), options);
  return new Promise((resolve, reject) => {
    channel.waitForConfirms().then(resolve).catch(reject);
  });
};

export default <IQueueHandler>{
  initialize,
  close,
  sendToQueue,
};
