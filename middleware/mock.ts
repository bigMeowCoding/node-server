import * as express from "express";
export function mockMiddleWare(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
    console.log('log==========')
    next()
}
