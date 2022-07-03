import * as express from "express";
import { getMockData } from "../common/utils/mock";
import pathToRegexp from "path-to-regexp";
export function mockMiddleWare(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const mockData = getMockData();
  console.log("mockData==========", mockData);
  const method = req.method.toUpperCase();
  for (const key of Object.keys(mockData)) {
    const mock = mockData[key];
    if (mock.method !== method) continue;
    const { re } = getPathReAndKeys(mock.path);
    const m = re.exec(req.path);
    console.log("m=====", m);
    if (m) {
      if (typeof mock.handler === "function") {
      } else {
        res.statusCode = 200;
        res.json(mock.handler);
      }
      return;
    }
  }
  next();
}
function getPathReAndKeys(path: string) {
  const keys: any[] = [];
  const re = pathToRegexp(path, keys);
  return { re, keys };
}
