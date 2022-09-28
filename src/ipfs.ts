import { create } from "ipfs-http-client";
import type { IPFS } from "ipfs-core-types";
import urlJoin from "url-join";

import { IPFS_API, PUBLIC_IPFS_GATEWAY, PRIVATE_IPFS_GATEWAY } from "./conf.js";

enum gwType {
  public = "public",
  private = "private",
}

function getGw(type: gwType) {
  switch (type) {
    case gwType.public:
      return PUBLIC_IPFS_GATEWAY;
    case gwType.private:
      return PRIVATE_IPFS_GATEWAY;
  }
}

export function GetGatewayURL(ipfsPath: string, type: keyof typeof gwType): string {
  const gw = getGw(type as gwType);
  return urlJoin(gw, ipfsPath);
}

const ipfs: IPFS = create({
  url: IPFS_API,
});
export default ipfs;
