# MossCutter 🦞

<div align="center">

![MossCutter Logo](https://img.shields.io/badge/MossCutter-图片网格切割工具-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.2.0-orange)
![Stable](https://img.shields.io/badge/稳定版-✅-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

**智能图片网格切割工具 | 由 SOSOMOSS AI 开发**

[English](#english) | [中文](#mosscutter-)

</div>

## 🌟 特性

### v1.2.0 稳定版本 🎉
- 🎨 **视觉设计统一** - 页面Logo和浏览器favicon都使用剪刀图标
- 🔵 **品牌色一致** - 统一的蓝色渐变主题 (#4f46e5 → #8b5cf6)
- 📏 **图标大小优化** - 页面剪刀图标增大到2.5rem，更易识别
- 🎯 **用户体验优化** - 整个上传区域都可以点击，操作更便利
- ✅ **功能完整** - 所有按钮功能正常，用户体验流畅
- 🐛 **Bug修复** - 修复状态同步问题，提升稳定性
- 🔄 **状态管理** - 切割后自动启用所有控制按钮
- 🎨 **CSS优化** - 清理重复规则，提升界面一致性
- 🔧 **事件绑定** - 完善按钮事件监听器绑定时机
- 🧹 **资源清理** - 正确释放内存，防止内存泄漏

### v1.1.0 重要功能
- 👁️ **预览网格** - 切割后显示所有切片预览
- 🖱️ **单独下载** - 点击预览图可单独保存
- ✅ **批量选择** - 可选多个切片批量下载
- 📋 **智能选择** - 全选/取消全选功能
- 💾 **灵活下载** - 支持单个、多个或全部下载

### 核心功能
- 🖼️ **多格式支持** - JPG, PNG, GIF, WebP
- 🔢 **自定义网格** - 1×1 到 10×10 任意组合
- ⚡ **一键切割** - 快速高效的图片处理
- 📦 **自动打包** - 切割后自动打包为ZIP文件
- 🎨 **多种输出** - PNG (无损), JPEG (有损), WebP (现代)
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⌨️ **键盘快捷键** - 提升工作效率
- 🔒 **隐私保护** - 所有处理在浏览器本地完成

## 🚀 快速开始

### 在线使用
访问 [GitHub Pages](https://sosomoss2050.github.io/moss-cutter/) 

### 本地运行
```bash
# 克隆仓库
git clone https://github.com/sosomoss2050/moss-cutter.git
cd moss-cutter

# 方法1: 使用Python (推荐)
python start_server.py
# 访问 http://localhost:8000

# 方法2: 使用Node.js
npm install -g http-server
http-server -p 8000

# 方法3: 直接打开
双击 index.html
```

## 📖 使用指南

### 1. 上传图片
- 点击"选择图片"按钮
- 或拖拽图片到上传区域
- 支持所有常见图片格式

### 2. 设置网格
- 输入行数和列数 (如 3×3 九宫格)
- 或点击预设按钮快速选择
- 实时预览网格效果

### 3. 配置输出
- 设置ZIP文件名
- 选择输出格式:
  - PNG: 无损质量
  - JPEG: 有损压缩
  - WebP: 现代格式
- 调节图片质量 (JPEG/WebP)

### 4. 切割下载
- 点击"开始切割图片"
- 等待处理完成
- 下载ZIP压缩包

## ⌨️ 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + O` | 打开文件选择 |
| `Ctrl + R` | 重置工具 |
| `Ctrl + S` | 开始切割 |
| `Ctrl + D` | 下载ZIP文件 |

## 🛠️ 技术栈

- **HTML5 Canvas** - 图片处理和切割
- **Vanilla JavaScript** - 核心逻辑
- **JSZip** - ZIP文件创建
- **FileSaver.js** - 文件下载
- **Font Awesome** - 图标库

## 📁 项目结构

```
moss-cutter/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 核心逻辑
├── package.json        # Node.js配置
├── LICENSE             # MIT许可证
├── README.md           # 说明文档
├── start_server.py     # Python启动脚本
└── start_server.bat    # Windows启动脚本
```

## 🌐 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

> **注意**: 由于使用HTML5 Canvas API，不支持IE浏览器。

## 🤝 贡献指南

我们欢迎各种形式的贡献！

1. **Fork** 本仓库
2. **创建分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **开启 Pull Request**

### 开发设置
```bash
# 安装开发依赖
npm install

# 启动开发服务器
npm run dev
```

## 📄 许可证

本项目基于 **MIT 许可证** 开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 作者

**SOSOMOSS LTD.** - AI工具开发团队（法律实体）

- 网站: [sosomoss.net](https://sosomoss.net) 
- GitHub: [@sosomoss2050](https://github.com/sosomoss2050)
- 邮箱: 10000@sosomoss.net

## 🙏 致谢

- [JSZip](https://stuk.github.io/jszip/) - 优秀的ZIP库
- [FileSaver.js](https://github.com/eligrey/FileSaver.js) - 文件保存解决方案
- [Font Awesome](https://fontawesome.com) - 精美图标
- 所有贡献者和用户

## 📞 支持

- 🐛 **报告问题**: [GitHub Issues](https://github.com/sosomoss2050/moss-cutter/issues)
- 💡 **功能建议**: 通过Issues提交
- ❓ **使用帮助**: 查看本文档或提交Issue

---

<div align="center">

### 🦞 MossTools 系列

**MossCutter** 是 **MossTools** 系列的第一个工具，更多实用工具即将发布！

[⬆ 返回顶部](#mosscutter-)

</div>

---

## English

# MossCutter 🦞

Intelligent Image Grid Cutting Tool - Cut images into grids (9-grid, 4-grid, etc.) and download as ZIP packages.

### Features
- Multiple image format support
- Custom grid sizes (1×1 to 10×10)
- One-click cutting and ZIP packaging
- Multiple output formats (PNG, JPEG, WebP)
- Responsive design for all devices
- Keyboard shortcuts for efficiency
- 100% client-side processing (no server upload)

### Quick Start
```bash
git clone https://github.com/sosomoss2050/moss-cutter.git
cd moss-cutter
python start_server.py
# Open http://localhost:8000
```

### License
MIT License - see [LICENSE](LICENSE) for details.

## 功能特点

- 🖼️ **支持多种图片格式**：JPG、PNG、GIF、WebP
- 🔢 **自定义网格大小**：1×1 到 10×10 任意组合
- ⚡ **一键切割**：快速将图片分割成多个片段
- 📦 **自动打包**：将切割后的图片打包成ZIP文件下载
- 🎨 **多种输出格式**：PNG（无损）、JPEG（有损）、WebP（现代）
- 📱 **响应式设计**：在桌面和移动设备上都能良好工作
- ⌨️ **键盘快捷键**：提高工作效率

## 使用方法

### 1. 上传图片
- 点击"选择图片"按钮或拖拽图片到上传区域
- 支持所有常见的图片格式

### 2. 设置网格
- 输入行数和列数（如3×3为九宫格，2×2为四宫格）
- 或点击预设按钮快速选择常用网格

### 3. 配置输出
- 设置ZIP文件名
- 选择输出图片格式：
  - PNG：无损质量，文件较大
  - JPEG：有损压缩，文件较小
  - WebP：现代格式，质量与大小平衡
- 对于JPEG/WebP格式，可调整质量参数

### 4. 切割并下载
- 点击"开始切割图片"按钮
- 等待处理完成
- 点击"下载ZIP压缩包"获取结果

## 键盘快捷键

- `Ctrl + O`：打开文件选择对话框
- `Ctrl + R`：重置工具
- `Ctrl + S`：开始切割图片
- `Ctrl + D`：下载ZIP文件（切割完成后）

## 技术栈

- **HTML5 Canvas**：图片处理和切割
- **JavaScript**：核心逻辑
- **JSZip**：ZIP文件创建
- **FileSaver.js**：文件下载
- **Font Awesome**：图标库

## 使用场景

1. **社交媒体拼图**：将一张大图切割成九宫格发布
2. **创意设计**：制作网格艺术效果
3. **图片处理**：批量处理图片的不同部分
4. **教育用途**：制作拼图游戏
5. **内容创作**：为博客或文章准备图片素材

## 本地运行

1. 下载所有文件到同一目录
2. 使用任何HTTP服务器运行（如Python、Node.js等）
3. 或直接在浏览器中打开 `index.html`

### 使用Python快速启动服务器：
```bash
# Python 3
python3 -m http.server 8000

# 然后在浏览器中访问 http://localhost:8000
```

### 使用Node.js：
```bash
# 安装 http-server
npm install -g http-server

# 启动服务器
http-server -p 8000
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

**注意**：由于使用HTML5 Canvas和现代JavaScript API，不支持IE浏览器。

## 文件结构

```
image-grid-cutter/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript逻辑
├── README.md           # 说明文档
└── (可选) assets/      # 资源文件目录
```

## 许可证

本项目基于MIT许可证开源，可自由使用、修改和分发。

## 贡献

欢迎提交Issue和Pull Request来改进这个工具！

## 注意事项

1. 所有图片处理都在浏览器本地完成，不会上传到服务器
2. 处理大图片时可能需要一些时间，请耐心等待
3. 建议在桌面浏览器中使用以获得最佳体验
4. 切割后的图片质量取决于原始图片质量和输出设置

## 更新日志

### v1.2.0 (2026-02-24) 🎉
- 稳定版本发布
- 视觉设计统一：页面Logo和浏览器favicon都使用剪刀图标
- 品牌色一致：统一的蓝色渐变主题
- 图标大小优化：页面剪刀图标增大到2.5rem

### v1.1.5 (2026-02-24)
- 用户体验优化：整个上传区域都可以点击
- Bug修复：修复状态同步和按钮状态问题

### v1.1.0 (2026-02-24)
- 重要功能：预览网格、单独下载、批量选择
- 智能切割模式：自动处理宽高比问题

### v1.0.0 (2026-02-24)
- 初始版本发布
- 基本图片切割功能
- ZIP打包下载
- 响应式设计
- 键盘快捷键支持
