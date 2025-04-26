const express = require('express');
const path = require('path');
const cors = require('cors');
const etag = require('etag');
const fs = require('fs');
const app = express();
const port = 3000;

// 引入 cors 中间件并配置
app.use(cors({
  exposedHeaders: 'ETag' // 允许客户端获取 ETag 响应头

}));

// 定义静态文件存储目录，这里假设静态文件存放在 'public' 目录下
const staticDir = path.join(__dirname, 'uploads');

// 自定义中间件来处理 ETag 协商缓存
app.use((req, res, next) => {
  const filePath = path.join(staticDir, req.path);
  fs.stat(filePath, (err, stats) => {
    if (err) {
      return next();
    }
    const fileEtag = etag(stats);
    const clientEtag = req.headers['if-none-match'];
    console.log('ETag:', fileEtag, 'Client ETag:', clientEtag);
    if (clientEtag === fileEtag) {
      res.status(304).send();
    } else {
      res.setHeader('ETag', fileEtag);
      next();
    }
  });
});

// 提供静态文件服务
app.use(express.static(staticDir));

// 启动服务器
app.listen(port, () => {
  console.log(`CDN 访问服务已启动，监听端口 ${port}`);
});

