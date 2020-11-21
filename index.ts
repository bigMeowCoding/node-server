import * as http from "http";
import * as Http from "http";
import { ServerResponse } from "http";

const server = http.createServer();

server.on("request", (req: Http.IncomingMessage, res: ServerResponse) => {
  const url = req.url;

  if (req.method === "POST") {
    let arr = [];
    req.on("data", function (chunk: Buffer) {
      arr.push(chunk);
    });
    req.on("end", function () {
      console.log(Buffer.concat(arr).toString());
    });
  }
  res.setHeader('zhouyijun', "niubi")
  console.log(res.statusCode);
  console.log(req.headers);
  console.log(req.method);
  console.log(req.url);
  if (url === "/data") {
    res.end(
      JSON.stringify({
        data: [1, 2, 3],
      })
    );
  } else {
    res.end("hi");
  }
});

server.listen(8888);
