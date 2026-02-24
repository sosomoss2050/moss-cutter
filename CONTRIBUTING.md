# 贡献指南

感谢您对 MossCutter 项目的关注！我们欢迎各种形式的贡献。

## 🎯 如何贡献

### 1. 报告问题
- 使用 [GitHub Issues](https://github.com/sosomoss/moss-cutter/issues) 报告bug
- 描述清晰的问题现象和复现步骤
- 如果是bug，请说明您的浏览器版本和操作系统

### 2. 功能建议
- 在Issues中提出新功能想法
- 描述使用场景和预期效果
- 如果可以，提供设计思路或原型

### 3. 代码贡献
- Fork 本仓库
- 创建功能分支 (`git checkout -b feature/AmazingFeature`)
- 提交更改 (`git commit -m 'Add some AmazingFeature'`)
- 推送到分支 (`git push origin feature/AmazingFeature`)
- 开启 Pull Request

## 🏗️ 开发环境设置

### 前提条件
- Node.js 14+ (可选，用于开发服务器)
- Python 3.6+ (可选，用于启动脚本)
- Git

### 步骤
```bash
# 1. 克隆仓库
git clone https://github.com/sosomoss/moss-cutter.git
cd moss-cutter

# 2. 安装开发依赖 (可选)
npm install

# 3. 启动开发服务器
npm run dev
# 或
python start_server.py

# 4. 访问 http://localhost:8000
```

## 📁 项目结构

```
moss-cutter/
├── index.html          # 主页面 - HTML结构
├── style.css           # 样式文件 - CSS样式
├── script.js           # 核心逻辑 - JavaScript代码
├── package.json        # Node.js配置
├── LICENSE             # MIT许可证
├── README.md           # 说明文档
├── CONTRIBUTING.md     # 贡献指南 (本文件)
├── start_server.py     # Python启动脚本
└── start_server.bat    # Windows启动脚本
```

## 🧪 代码规范

### HTML
- 使用语义化标签
- 添加适当的ARIA属性
- 保持结构清晰

### CSS
- 使用BEM命名约定
- 添加注释说明复杂样式
- 保持响应式设计

### JavaScript
- 使用ES6+语法
- 添加JSDoc注释
- 错误处理完善
- 代码模块化

### 提交信息
使用约定式提交：
- `feat:` 新功能
- `fix:` bug修复
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具

示例：
```
feat: 添加拖拽上传功能
fix: 修复图片质量设置不生效的问题
docs: 更新使用指南
```

## 🔧 开发任务

### 待开发功能
1. ✅ 基础图片切割功能
2. ⬜ 添加图片滤镜效果
3. ⬜ 支持批量处理多张图片
4. ⬜ 添加水印功能
5. ⬜ 导出为PDF格式
6. ⬜ 国际化支持 (多语言)
7. ⬜ 主题切换 (深色/浅色模式)

### 优化建议
1. ⬜ 性能优化 - 大图片处理
2. ⬜ 用户体验改进
3. ⬜ 代码重构和模块化
4. ⬜ 测试覆盖率提升

## 🐛 测试

### 手动测试项目
- [ ] 图片上传功能正常
- [ ] 网格设置准确
- [ ] 切割功能正常
- [ ] ZIP打包下载正常
- [ ] 响应式设计正常
- [ ] 键盘快捷键正常
- [ ] 错误处理完善

### 浏览器兼容性
- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] Edge 最新版

## 📝 文档

### 需要完善的文档
1. API文档 (如果需要)
2. 开发指南
3. 部署指南
4. 故障排除

## 🤔 决策过程

### 技术决策
- 使用原生JavaScript而非框架，保持轻量
- 使用CDN引入第三方库，减少依赖
- 优先考虑浏览器兼容性

### 功能决策
- 功能优先满足核心需求
- 用户体验优先
- 保持工具简单易用

## 🏆 贡献者奖励

所有贡献者将：
1. 列入项目贡献者名单
2. 获得SOSOMOSS AI社区的认可
3. 有机会参与MossTools系列其他项目

## 📞 沟通渠道

- **GitHub Issues**: 问题讨论和功能建议
- **Pull Requests**: 代码贡献
- **项目Wiki**: 文档和指南

## 🙏 感谢

感谢所有为MossCutter做出贡献的开发者！您的每一份贡献都让这个工具变得更好。

---

**SOSOMOSS AI** - 致力于开发实用的AI工具