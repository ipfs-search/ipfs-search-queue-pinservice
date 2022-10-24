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
          amqLogger("Unable to connect to RabbitMQ; trying again", error);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      );
      channel = await connection.createConfirmChannel();
    } catch (error) {
      amqLogger("Error trying to connect to RabbitMQ; trying again", error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
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
  const payload = { Protocol: 1, ID: CID, Source: 5 };

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
