// MossCutter 社交媒体推广图片生成器
// 生成9张不同风格的推广图片

const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// 创建输出目录
const outputDir = path.join(__dirname, 'promotion-images');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 图片尺寸（社交媒体常用）
const sizes = {
    instagram: { width: 1080, height: 1080 },      // Instagram方形
    instagram_story: { width: 1080, height: 1920 }, // Instagram故事
    twitter: { width: 1200, height: 675 },         // Twitter卡片
    facebook: { width: 1200, height: 630 },        // Facebook分享
    linkedin: { width: 1200, height: 627 },        // LinkedIn分享
    pinterest: { width: 1000, height: 1500 },      // Pinterest竖版
    youtube_thumbnail: { width: 1280, height: 720 }, // YouTube缩略图
    github_social: { width: 1280, height: 640 },   // GitHub社交预览
    generic: { width: 1200, height: 628 }          // 通用
};

// 品牌颜色
const colors = {
    primary: '#6366f1',     // 品牌紫色
    secondary: '#10b981',   // 品牌绿色
    accent: '#f59e0b',      // 品牌橙色
    dark: '#1f2937',        // 深色背景
    light: '#f9fafb',       // 浅色背景
    white: '#ffffff',
    black: '#111827'
};

// 品牌字体（使用系统字体）
const fonts = {
    title: 'bold 72px "Arial", sans-serif',
    subtitle: '36px "Arial", sans-serif',
    body: '24px "Arial", sans-serif',
    small: '18px "Arial", sans-serif'
};

// 生成单张图片
async function generateImage(index, size, title, description, style) {
    const { width, height } = size;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // 根据样式设置背景
    if (style === 'dark') {
        ctx.fillStyle = colors.dark;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = colors.white;
    } else if (style === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(1, colors.secondary);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = colors.white;
    } else {
        ctx.fillStyle = colors.light;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = colors.black;
    }
    
    // 添加品牌装饰
    if (style === 'gradient' || style === 'dark') {
        // 添加网格图案
        ctx.strokeStyle = style === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        
        // 绘制网格
        const gridSize = 80;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // 添加切割线效果
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 10]);
        
        // 对角线切割线
        ctx.beginPath();
        ctx.moveTo(width * 0.2, height * 0.2);
        ctx.lineTo(width * 0.8, height * 0.8);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(width * 0.8, height * 0.2);
        ctx.lineTo(width * 0.2, height * 0.8);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }
    
    // 添加标题
    ctx.font = fonts.title;
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, height * 0.3);
    
    // 添加副标题
    ctx.font = fonts.subtitle;
    ctx.fillText(description, width / 2, height * 0.4);
    
    // 添加品牌信息
    ctx.font = fonts.body;
    ctx.fillText('由 SOSOMOSS AI 开发', width / 2, height * 0.55);
    
    // 添加功能亮点
    ctx.font = fonts.small;
    const features = [
        '🖼️ 支持多种图片格式',
        '🔢 自定义网格大小',
        '⚡ 一键切割打包',
        '📱 响应式设计'
    ];
    
    features.forEach((feature, i) => {
        ctx.fillText(feature, width / 2, height * 0.65 + i * 40);
    });
    
    // 添加网址
    ctx.font = fonts.small;
    ctx.fillText('https://sosomoss2050.github.io/moss-cutter/', width / 2, height * 0.85);
    
    // 添加品牌徽章
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(width - 100, 100, 60, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = colors.white;
    ctx.font = 'bold 48px "Arial", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MC', width - 100, 100);
    
    // 保存图片
    const buffer = canvas.toBuffer('image/png');
    const filename = `promotion-${index + 1}-${Object.keys(sizes)[index]}.png`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ 生成图片: ${filename} (${width}×${height})`);
    
    return filepath;
}

// 9张不同风格的推广图片
const promotionImages = [
    {
        size: sizes.instagram,
        title: 'MossCutter 🦞',
        description: '智能图片网格切割工具',
        style: 'gradient'
    },
    {
        size: sizes.instagram_story,
        title: '一键切割图片',
        description: '支持9宫格、4宫格等',
        style: 'dark'
    },
    {
        size: sizes.twitter,
        title: '开源图片工具',
        description: '100%客户端处理，保护隐私',
        style: 'light'
    },
    {
        size: sizes.facebook,
        title: '免费在线工具',
        description: '无需安装，立即使用',
        style: 'gradient'
    },
    {
        size: sizes.linkedin,
        title: '专业图片处理',
        description: '设计师和创作者必备',
        style: 'dark'
    },
    {
        size: sizes.pinterest,
        title: '创意网格设计',
        description: '社交媒体内容创作',
        style: 'light'
    },
    {
        size: sizes.youtube_thumbnail,
        title: 'MossTools系列',
        description: 'SOSOMOSS AI开发',
        style: 'gradient'
    },
    {
        size: sizes.github_social,
        title: '开源项目',
        description: 'GitHub Star支持',
        style: 'dark'
    },
    {
        size: sizes.generic,
        title: '立即体验',
        description: '上传→切割→下载',
        style: 'light'
    }
];

// 生成所有图片
async function generateAllImages() {
    console.log('🎨 开始生成MossCutter推广图片...\n');
    
    const generatedFiles = [];
    
    for (let i = 0; i < promotionImages.length; i++) {
        const config = promotionImages[i];
        try {
            const filepath = await generateImage(i, config.size, config.title, config.description, config.style);
            generatedFiles.push({
                index: i + 1,
                filename: path.basename(filepath),
                size: `${config.size.width}×${config.size.height}`,
                style: config.style,
                platform: Object.keys(sizes)[i]
            });
        } catch (error) {
            console.error(`❌ 生成图片 ${i + 1} 失败:`, error.message);
        }
    }
    
    console.log('\n📊 生成完成！');
    console.log('┌─────┬────────────────────────────┬──────────────┬──────────┬─────────────┐');
    console.log('│ 序号 │ 文件名                    │ 尺寸         │ 样式     │ 平台        │');
    console.log('├─────┼────────────────────────────┼──────────────┼──────────┼─────────────┤');
    
    generatedFiles.forEach(file => {
        const index = String(file.index).padEnd(3);
        const filename = file.filename.padEnd(26);
        const size = file.size.padEnd(12);
        const style = file.style.padEnd(8);
        const platform = file.platform;
        console.log(`│ ${index} │ ${filename} │ ${size} │ ${style} │ ${platform} │`);
    });
    
    console.log('└─────┴────────────────────────────┴──────────────┴──────────┴─────────────┘');
    
    // 生成使用说明
    console.log('\n📱 社交媒体发布建议：');
    console.log('1. Instagram: 使用图片1-2，添加相关标签');
    console.log('2. Twitter: 使用图片3，简短介绍+链接');
    console.log('3. Facebook: 使用图片4，详细功能介绍');
    console.log('4. LinkedIn: 使用图片5，专业工具介绍');
    console.log('5. Pinterest: 使用图片6，创意设计展示');
    console.log('6. YouTube: 使用图片7，视频缩略图');
    console.log('7. GitHub: 使用图片8，开源项目推广');
    console.log('8. 通用: 使用图片9，各种平台适用');
    
    console.log('\n🏷️ 推荐标签：');
    console.log('#MossCutter #图片处理 #网格切割 #9宫格 #开源工具');
    console.log('#SOSOMOSSAI #MossTools #前端开发 #Web工具');
    console.log('#设计工具 #内容创作 #社交媒体 #图片编辑');
    
    console.log('\n📝 文案建议：');
    console.log('• "发现一款超好用的图片网格切割工具！一键将图片切成9宫格、4宫格..."');
    console.log('• "开源免费！MossCutter - 智能图片网格切割工具，100%客户端处理..."');
    console.log('• "设计师必备！轻松创建社交媒体内容，支持多种格式和自定义网格..."');
    console.log('• "由SOSOMOSS AI开发，MossTools系列首款工具，更多实用工具即将发布！"');
    
    console.log('\n🔗 重要链接：');
    console.log('• 在线工具: https://sosomoss2050.github.io/moss-cutter/');
    console.log('• GitHub仓库: https://github.com/sosomoss2050/moss-cutter');
    console.log('• 问题反馈: https://github.com/sosomoss2050/moss-cutter/issues');
    
    console.log('\n🎯 推广策略：');
    console.log('1. 分批次发布：每天1-2张图片，持续一周');
    console.log('2. 不同平台：针对各平台特点选择合适图片');
    console.log('3. 互动引导：鼓励用户试用并反馈');
    console.log('4. 社区参与：在相关技术社区分享');
    console.log('5. 收集反馈：根据用户反馈持续改进');
    
    console.log('\n✅ 所有推广图片已生成到: promotion-images/ 目录');
}

// 运行生成器
generateAllImages().catch(console.error);