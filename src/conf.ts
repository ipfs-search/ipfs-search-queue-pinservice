import os from "os";

export const PROCESSES : number = parseInt(process.env.PROCESSES || '') || os.cpus().length;
export const HOST = process.env.NYATS_SERVER_HOST || "localhost";
export const PORT = process.env.NYATS_SERVER_PORT || "9614";
export const IPFS_API = process.env.IPFS_API || "http://localhost:5001";
export const IPFS_TIMEOUT = process.env.IPFS_TIMEOUT || 120 * 1000;
export const IPFS_GATEWAY = process.env.IPFS_GATEWAY || "https://dweb.link";
