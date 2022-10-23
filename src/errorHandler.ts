import { NextFunction, Request, Response } from "express";
import { logError } from './logger.js'
import { ENVIRONMENT } from './conf.js'

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const errorHandler = (err: HttpException, _: Request, res: Response, next: NextFunction) => {
  function error(res: Response, code: number, err: string) {
    logError(`${code}: ${err}`);
    res
      .status(code)
      .json({ error: `${err}` })
      .end();
  }
  if (res.headersSent) {
    return next(err)
  }
  if (ENVIRONMENT === "production") {
    // Don't leak details in production
    error(res, 500, "Internal Server Error");
    return;
  }
  error(res, 500, err.message);
};
