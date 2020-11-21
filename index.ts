import * as http from "http";
import * as Http from "http";
import { ServerResponse } from "http";
import * as fs from "fs";
import * as url from "url";
import * as path from "path";

const server = http.createServer();
// const staticPath = path.resolve(__dirname, "public");

server.on("request", (req: Http.IncomingMessage, res: ServerResponse) => {
  const { method, url: urlPath } = req;
  if (method !== "GET") {
    res.statusCode = 200;
    res.end();
    return;
  }
  const { pathname } = url.parse(urlPath);
  let fileName = pathname.substr(1);
  const cacheAge = 3600 * 24;
  if (!fileName) {
    fileName = "index.html";
  }
  fs.readFile(path.resolve("public", fileName), function (e, data) {
    if (e) {
      if (e.errno === -2) {
        res.statusCode = 404;
        fs.readFile(path.resolve("public", "404.html"), function (e, d) {
          res.end(d);
        });
      }
      return;
    }
    res.setHeader("Cache-Control", `public,max-age=${cacheAge}`);
    res.end(data);
  });
});

server.listen(8888);
