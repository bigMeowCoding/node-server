import * as fs from "fs";
import * as url from "url";
import * as path from "path";
const express = require('express')
const app = express()
const port = 8888
// const staticPath = path.resolve(__dirname, "public");
app.get('/',(req:any,res:any)=> {
  const {  url: urlPath } = req;
  const { pathname } = url.parse(urlPath);
  let fileName = pathname?.substr(1);
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
})
app.post('/test',(req:any,res:any)=> {
  const { method, url: urlPath } = req;
    res.json({
      data:{a:'test'}
    },200);
    return;

})
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.listen(port);
