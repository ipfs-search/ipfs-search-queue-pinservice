import { create } from "ipfs-http-client";
import { ipfsAPI } from "./conf.ts";

const ipfs = create(ipfsAPI);
export default ipfs;
