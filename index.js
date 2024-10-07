const fs = require('fs');
const path = require('path');

// 读取 images 目录下的所有图片文件
const imagesDir = path.join(__dirname, 'images');
const images = fs.readdirSync(imagesDir);

// 定义每张幻灯片的图片名称
const slides = [
  { title: '选购食材', description: '小朋友首先需要准备好做饭所需的食材。在超市里，挑选新鲜的蔬菜和肉类。', notes: '介绍小朋友如何开始挑选食材，图片可能展示各种食材。' },
  { title: '清洗食材', description: '接下来，将选购好的蔬菜和肉类进行清洗，保证食材的干净和健康。', notes: '这张幻灯片说明了做饭时保持食材干净的重要性，图片展示清洗过程。' },
  { title: '切菜', description: '小朋友在家长的指导下，用刀将蔬菜切成小块，准备进行烹饪。', notes: '强调在父母指导下安全使用刀具，图片展示切菜的过程。' },
  { title: '烹饪准备', description: '将准备好的食材放在锅中进行初步加热，准备做一道美味的菜肴。', notes: '图片可能展示食材被放入锅中，作为烹饪准备的一部分。' },
  { title: '炒菜', description: '小朋友在锅里翻炒蔬菜，注意火候和油量，制作自己的第一道菜。', notes: '强调实际的炒菜过程，图片展示小朋友在翻炒食物。' },
  { title: '加入调料', description: '加入适量的盐和其他调料，让食材更加入味，提升菜肴的风味。', notes: '图片展示小朋友为菜肴添加调料的场景。' },
  { title: '烹饪完成', description: '菜肴终于完成了！热腾腾的美食出锅，准备上桌。', notes: '展示完成的菜肴，图片可能展示装盘后的成品。' },
  { title: '摆盘与上桌', description: '将做好的菜肴摆放在盘子里，小朋友成功完成了自己的第一次做饭任务。', notes: '展示小朋友为菜肴摆盘的场景。' },
  { title: '享受成果', description: '小朋友和家人一起享用这顿美味的饭菜，感受到自己劳动的快乐。', notes: '展示小朋友和家人一起品尝食物的场景。' },
  { title: '反思与总结', description: '这次做饭的经历让小朋友学会了很多。通过这次家庭作业，小朋友认识到了做饭的乐趣与挑战。', notes: '对本次做饭的经历进行总结和反思。' }
];

// 将图片名称与幻灯片对应
for (let i = 0; i < slides.length; i++) {
  slides[i].image = images[i] ? `images/${images[i]}` : 'images/placeholder.jpg';  // 如果没有图片，使用占位图片
}

// 生成 Markdown 内容
let mdContent = '# 第一次做饭 - 一个小朋友的家庭作业\n\n';
slides.forEach((slide, index) => {
  mdContent += `## 幻灯片 ${index + 1}: ${slide.title}\n`;
  mdContent += `- **图片**: \`${slide.image}\`\n`;
  mdContent += `- **描述**: ${slide.description}\n`;
  mdContent += `- **备注**: ${slide.notes}\n\n`;
});

// 保存为 Markdown 文件
fs.writeFile('第一次做饭_大纲.md', mdContent, (err) => {
  if (err) throw err;
  console.log('Markdown 文件已生成！');
});
