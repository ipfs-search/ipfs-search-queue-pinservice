import Express, { Response, Request, NextFunction } from "express";
import { strict as assert } from "assert";
import healthcheck from "express-healthcheck";
import urlJoin from "url-join";
import { IPFS_GATEWAY } from "./conf";

import makeDebugger from "debug";
const debug = makeDebugger("ipfs-search-push");

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

function getGatewayURL(req: Request, ipfsPath:string) {
  // We can use the referer to derive whether we've been requested from a gateway
  // and then use this to generate URL's.
  const referer = req.headers["referer"];
  debug(referer);

  return urlJoin(IPFS_GATEWAY, ipfsPath);
}

export default () => {
  const app = Express();

  app.get("/push-service/:cid", async (req, res, next) => {
    // TODO: Validation
    // https://express-validator.github.io/docs/
    const { cid } = req.params;

    debug(
      `Received request`
    );

    try {
    } catch (e) {
      // ExpressJS <5 doesn't properly catch async errors (yet)
      next(e);
    }
  });

  function error(res: Response, code: number, err: string) {
    console.error(`${code}: ${err}`);
    console.trace(err);

    res
      .status(code)
      .json({ error: `${err}` })
      .end();
  }

  app.use((err: HttpException, _: Request , res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === "production") {
      // Don't leak details in production
      error(res, 500, "Internal Server Error");
    }

    if (res.headersSent) {
      console.log("headers already sent");
      return next(err);
    }

    error(res, 500, err.message);
  });

  app.use("/healthcheck", healthcheck());

  return app;
};
