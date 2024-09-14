const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs-extra');

const app = express();
const port = 3000;

// 使用 CORS 允许跨域请求
app.use(cors());
// 解析 JSON 格式的请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const formidable = require('formidable');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = 'uploads/';
//         fs.ensureDirSync(uploadPath); // 确保目录存在
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const name = path.basename(file.originalname, ext);
//         cb(null, `${name}-${Date.now()}${ext}`);
//     }
// });
// const upload = multer({ storage: storage });

// 自定义日志中间件
app.use((req, res, next) => {
    console.log('--- Incoming Request ---');
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log('Query Parameters:', req.query);
    console.log('Path Parameters:', req.params);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);

    // 记录响应数据
    const originalSend = res.send;
    res.send = function (data) {
        console.log('--- Response ---');
        console.log('Status Code:', res.statusCode);
        console.log('Response Body:', data);
        return originalSend.apply(res, arguments);
    };

    next();
});



// 文件上传的 POST 请求接口
// app.post('/upload', upload.single('file'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }
//     const filePath = req.file.path;
//     res.json({
//         message: 'File uploaded successfully!',
//         filePath: filePath,
//         fileName: req.file.filename
//     });
// });
app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm({
        uploadDir: path.join(__dirname, 'uploads'), // 上传文件保存的目录
        keepExtensions: true,  // 保留文件后缀
    });

    // 解析请求，处理文件上传
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }

        console.log('Fields:', fields); // 表单中的其他字段数据
        console.log('Uploaded Files:', files); // 上传的文件信息

        res.json({
            message: 'File uploaded successfully!',
            filePath: files.file.filepath,
            fileName: files.file.originalFilename
        });
    });
});

// 提供上传文件页面的接口（用于简单文件上传表单）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
