import * as express from "express";
import {getMockData} from "../common/utils/mock";
export function mockMiddleWare(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
    console.log('log==========')
    getMockData()
    next()
}
