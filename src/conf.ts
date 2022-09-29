import os from "os";

export const PROCESSES = parseInt(process.env.PROCESSES) || os.cpus().length;
export const HOST = process.env.SERVER_HOST || "localhost";
export const PORT = parseInt(process.env.SERVER_PORT || "7070");
export const IPNS_UPDATE_INTERVAL = parseInt(process.env.IPNS_UPDATE_INTERVAL || "60000");
export const IPFS_API = process.env.IPFS_API || "http://localhost:5001";
export const IPFS_TIMEOUT = parseInt(process.env.IPFS_TIMEOUT || "120000");
export const PUBLIC_IPFS_GATEWAY = process.env.PUBLIC_IPFS_GATEWAY || "https://dweb.link";
export const PRIVATE_IPFS_GATEWAY = process.env.PRIVATE_IPFS_GATEWAY || "http://127.0.0.1:8080";

export const QUEUE_HOST = process.env.QUEUE_HOST || "amqp://localhost";
