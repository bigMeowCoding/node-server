import * as fs from "fs";
import * as url from "url";
import * as path from "path";
import { mockMiddleWare } from "./middleware/mock";
const express = require("express");
const multer = require("multer");
const app = express();
const port = 8888;
// const staticPath = path.resolve(__dirname, "public");
// app.use(mockMiddleWare);

app.get("/", (req: any, res: any) => {
  const { url: urlPath } = req;
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
});
app.post("/test", (req: any, res: any) => {
  const { method, url: urlPath } = req;
  res.status(200).json({
    data: { a: "test" },
  });
  return;
});

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "public/uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 添加文件上传路由
app.post("/upload", upload.single("file"), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: "没有文件上传" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({
    message: "文件上传成功",
    url: fileUrl,
  });
});

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.listen(port);
