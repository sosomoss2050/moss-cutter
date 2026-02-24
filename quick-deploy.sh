#!/bin/bash
# MossCutter 快速部署脚本
# 在网站根目录运行: bash quick-deploy.sh

echo "🚀 MossCutter 快速部署开始..."

# 备份当前文件（如果有）
if [ "$(ls -A . 2>/dev/null)" ]; then
    echo "📦 备份当前文件..."
    backup_dir="../backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$backup_dir"
    cp -r ./* "$backup_dir/" 2>/dev/null || true
    echo "✅ 备份到: $backup_dir"
fi

# 清理当前目录（保留脚本）
echo "🧹 清理目录..."
find . -maxdepth 1 ! -name "quick-deploy.sh" ! -name "." -exec rm -rf {} \; 2>/dev/null || true

# 下载MossCutter v1.1.1
echo "⬇️  下载MossCutter v1.1.1..."

# 尝试不同的下载方法
if command -v git &> /dev/null; then
    echo "使用git下载..."
    git clone --depth 1 --branch v1.1.1 https://github.com/sosomoss2050/moss-cutter.git temp_moss
    cp -r temp_moss/* .
    rm -rf temp_moss
elif command -v curl &> /dev/null; then
    echo "使用curl下载..."
    curl -L https://github.com/sosomoss2050/moss-cutter/archive/refs/tags/v1.1.1.zip -o moss.zip
    unzip -q moss.zip
    cp -r moss-cutter-1.1.1/* .
    rm -rf moss-cutter-1.1.1 moss.zip
elif command -v wget &> /dev/null; then
    echo "使用wget下载..."
    wget https://github.com/sosomoss2050/moss-cutter/archive/refs/tags/v1.1.1.zip -O moss.zip
    unzip -q moss.zip
    cp -r moss-cutter-1.1.1/* .
    rm -rf moss-cutter-1.1.1 moss.zip
else
    echo "❌ 需要git、curl或wget，请先安装"
    exit 1
fi

# 设置权限
echo "🔒 设置权限..."
chmod 644 *.html *.css *.js *.json *.md 2>/dev/null || true
chmod 755 . 2>/dev/null || true

# 尝试设置正确的用户组
if id www &>/dev/null; then
    chown -R www:www . 2>/dev/null || true
    echo "✅ 用户组设置为: www"
elif id nginx &>/dev/null; then
    chown -R nginx:nginx . 2>/dev/null || true
    echo "✅ 用户组设置为: nginx"
fi

# 验证部署
echo "✅ 部署完成！"
echo ""
echo "📋 文件清单:"
ls -la | head -10
echo ""
echo "🔍 验证关键文件:"
[ -f "index.html" ] && echo "✅ index.html 存在" || echo "❌ index.html 缺失"
[ -f "style.css" ] && echo "✅ style.css 存在" || echo "❌ style.css 缺失"
[ -f "script.js" ] && echo "✅ script.js 存在" || echo "❌ script.js 缺失"
echo ""
echo "🎯 下一步:"
echo "1. 在宝塔面板中检查网站配置"
echo "2. 访问你的域名测试功能"
echo "3. 运行: service nginx restart (重启Nginx)"
echo ""
echo "🌐 在线演示: https://sosomoss2050.github.io/moss-cutter/"
echo "📚 GitHub: https://github.com/sosomoss2050/moss-cutter"