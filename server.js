const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

// 上传图片接口
app.post('/upload', upload.single('icon'), async (req, res) => {
    const originalExt = path.extname(req.file.originalname).toLowerCase();  // 获取上传文件的原始扩展名
    const tempPath = req.file.path;  // multer 生成的临时文件路径
    const newFilePath = tempPath + originalExt;  // 新路径，带有 .svg 扩展名

    // 检查上传的文件是否为 SVG 格式
    if (originalExt !== '.svg') {
        return res.status(400).send('Only SVG files are allowed');
    }

    try {
        // 将临时文件重命名为带扩展名的文件
        await fs.rename(tempPath, newFilePath);

        // 将该文件放入一个临时目录
        const svgDir = path.join('uploads', 'svgs');
        await fs.ensureDir(svgDir);  // 创建目录
        await fs.copy(newFilePath, path.join(svgDir, path.basename(newFilePath)));  // 复制文件到目录中

        // 调用生成字体的逻辑
        const fontPath = await generateFontFromSVG(svgDir);
        res.download(fontPath);  // 生成完后可以让用户下载字体文件
    } catch (error) {res.status(500).send('Error generating font: ' + error.message);
    }
});

// 生成字体逻辑
async function generateFontFromSVG(svgDirectory) {
    const fontDirectory = 'generated-fonts';
    await fs.ensureDir(fontDirectory);  // 确保目录存在

    const fontSvgPath = path.join(fontDirectory, 'iconfont.svg');

    // 调用 svgicons2svgfont 命令行工具生成 SVG 字体文件，注意这里传递的是目录
    return new Promise((resolve, reject) => {
        const command = `svgicons2svgfont --src ${svgDirectory} --output ${fontSvgPath}`;
        exec(command, (err) => {
            if (err) return reject(err);
            resolve(fontSvgPath);
        });
    });
}

app.listen(port, () => {
    console.log(`Iconfont service running on http://localhost:${port}`);
});
