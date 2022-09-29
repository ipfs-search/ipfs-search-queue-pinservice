import amqplib from "amqplib";
import { IQueueHandler } from "../types/IQueueHandler";

const queue = "hashes";
let connection: amqplib.Connection;
let channel: amqplib.Channel;

const initialize = async (options) => {
  connection = await amqplib.connect(options?.queueHost || "amqp://localhost");
  channel = await connection.createChannel();
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
};

export default <IQueueHandler>{
  initialize,
  close,
  sendToQueue,
};
