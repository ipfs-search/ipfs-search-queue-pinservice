import { NextFunction, Request, Response } from "express";

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const errorHandler = (err: HttpException, _: Request , res: Response, next: NextFunction) => {
  function error(res: Response, code: number, err: string) {
    console.error(`${code}: ${err}`);
    console.trace(err);
    res
      .status(code)
      .json({ error: `${err}` })
      .end();
  }
  if (process.env.NODE_ENV === "production") {
    // Don't leak details in production
    error(res, 500, "Internal Server Error");
  }
  if (res.headersSent) {
    console.log("headers already sent");
    return next(err);
  }
  error(res, 500, err.message);
}

