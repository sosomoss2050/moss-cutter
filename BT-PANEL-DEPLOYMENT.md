# MossCutter 宝塔面板部署指南

## 📋 部署前准备

### 1. 服务器环境确认
```
✅ 腾讯云轻量服务器
✅ Linux系统（CentOS/Ubuntu）
✅ 宝塔面板已安装
✅ 域名已解析到服务器IP
```

### 2. 所需信息
```
• 宝塔面板登录地址：http://服务器IP:8888
• 宝塔面板用户名和密码
• 你的域名：example.com
• SSH登录信息（可选）
```

## 🚀 快速部署步骤（5分钟完成）

### 步骤1：登录宝塔面板
```
1. 打开浏览器访问：http://你的服务器IP:8888
2. 输入用户名和密码登录
3. 如果是首次登录，同意用户协议
```

### 步骤2：创建网站
```
1. 点击左侧菜单「网站」
2. 点击「添加站点」
3. 填写以下信息：
```

#### 网站配置：
```
域名：你的域名（如 example.com）
根目录：/www/wwwroot/example.com
PHP版本：纯静态
数据库：不需要
FTP：可选创建
备注：MossCutter图片切割工具
```

#### 点击「提交」创建网站

### 步骤3：进入网站目录
```
方法1：通过宝塔文件管理器
1. 点击左侧「文件」
2. 进入 /www/wwwroot/example.com

方法2：通过SSH
ssh root@你的服务器IP
cd /www/wwwroot/example.com
```

### 步骤4：运行部署脚本

#### 上传部署脚本：
```
1. 在宝塔文件管理器中，点击「上传」
2. 选择 quick-deploy.sh 文件
3. 上传到 /www/wwwroot/example.com
```

#### 运行部署脚本：
```bash
# 通过SSH运行
cd /www/wwwroot/example.com
bash quick-deploy.sh

# 或者通过宝塔终端运行
# 宝塔面板 → 网站 → 对应网站 → 终端
```

### 步骤5：验证部署
```
1. 访问你的域名：http://example.com
2. 应该看到MossCutter界面
3. 测试上传图片和切割功能
```

## 🔧 详细部署步骤

### 方法A：使用完整部署脚本

#### 1. 上传完整脚本
```
上传 deploy-to-server.sh 到网站根目录
```

#### 2. 运行脚本
```bash
# 给脚本执行权限
chmod +x deploy-to-server.sh

# 运行脚本
./deploy-to-server.sh
```

#### 3. 脚本会自动：
```
✅ 备份当前版本
✅ 清理目录
✅ 下载MossCutter v1.1.1
✅ 设置文件权限
✅ 生成Nginx配置建议
✅ 生成部署报告
```

### 方法B：手动部署

#### 1. 清理网站目录
```bash
cd /www/wwwroot/example.com
rm -rf *
```

#### 2. 下载MossCutter
```bash
# 使用git（推荐）
git clone https://github.com/sosomoss2050/moss-cutter.git .
git checkout v1.1.1

# 或者下载ZIP
wget https://github.com/sosomoss2050/moss-cutter/archive/refs/tags/v1.1.1.zip
unzip v1.1.1.zip
cp -r moss-cutter-1.1.1/* .
rm -rf moss-cutter-1.1.1 v1.1.1.zip
```

#### 3. 设置权限
```bash
chmod 644 *.html *.css *.js
chown www:www -R .
```

## ⚙️ Nginx配置优化

### 1. 在宝塔面板中配置
```
1. 点击网站 → 设置
2. 点击「配置文件」
3. 添加以下配置：
```

### 2. 推荐配置
```nginx
# 静态文件缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# 开启gzip压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
           application/javascript application/xml+rss 
           application/json image/svg+xml;

# 安全头
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

### 3. 重启Nginx
```bash
# 在宝塔终端或SSH中运行
service nginx restart

# 或者宝塔面板 → 软件商店 → Nginx → 重启
```

## 🔐 SSL证书配置（HTTPS）

### 1. 申请免费证书
```
1. 宝塔面板 → 网站 → 设置
2. 点击「SSL」
3. 选择「Let's Encrypt」
4. 勾选你的域名
5. 点击「申请」
```

### 2. 启用HTTPS
```
1. 证书申请成功后
2. 开启「强制HTTPS」
3. 点击「保存」
```

### 3. 验证HTTPS
```
访问：https://example.com
应该看到绿色安全锁
```

## 🐛 常见问题解决

### 问题1：403 Forbidden
```
原因：权限问题
解决：
chmod 755 /www/wwwroot/example.com
chmod 644 /www/wwwroot/example.com/*
chown www:www -R /www/wwwroot/example.com
```

### 问题2：404 Not Found
```
原因：文件不存在或路径错误
解决：
1. 检查文件是否在正确目录
2. 检查Nginx root配置
3. 检查index.html是否存在
```

### 问题3：功能不正常
```
原因：JavaScript错误
解决：
1. 浏览器按F12打开开发者工具
2. 查看Console错误信息
3. 检查文件路径是否正确
```

### 问题4：Nginx配置错误
```
解决：
1. 检查Nginx配置语法
nginx -t

2. 查看Nginx错误日志
tail -f /www/wwwlogs/example.com.error.log

3. 重启Nginx
service nginx restart
```

## 📊 部署检查清单

### 基础检查
```
[ ] 1. 域名解析到服务器IP
[ ] 2. 宝塔面板可以登录
[ ] 3. 网站创建成功
[ ] 4. 文件上传完成
[ ] 5. 网站可以访问（HTTP）
[ ] 6. SSL证书配置（HTTPS）
```

### 功能检查
```
[ ] 1. 首页正常显示
[ ] 2. 可以上传图片
[ ] 3. 网格切割功能正常
[ ] 4. 下载功能正常
[ ] 5. 移动端适配正常
```

### 性能检查
```
[ ] 1. 页面加载速度
[ ] 2. HTTPS连接正常
[ ] 3. 缓存配置生效
```

## 🔄 更新版本

### 自动更新
```bash
cd /www/wwwroot/example.com
./deploy-to-server.sh
```

### 手动更新
```bash
cd /www/wwwroot/example.com
git pull origin main
# 或者重新运行部署脚本
bash quick-deploy.sh
```

## 📱 移动端测试

### 测试方法
```
1. 手机访问你的域名
2. 测试所有功能
3. 检查布局是否正常
4. 测试触摸操作
```

### 常见问题
```
• 按钮太小：检查CSS响应式设计
• 上传失败：检查文件大小限制
• 布局错乱：检查viewport设置
```

## 🎯 部署完成验证

### 最终测试
```
1. 桌面浏览器访问
2. 手机浏览器访问
3. 测试完整功能流程
4. 检查控制台错误
5. 验证HTTPS安全锁
```

### 性能测试工具
```
• Google PageSpeed Insights
• GTmetrix
• WebPageTest
```

## 📞 技术支持

### 遇到问题？
```
1. 查看部署报告：cat deployment-report-*.txt
2. 检查错误日志：tail -f /www/wwwlogs/error.log
3. GitHub Issues：https://github.com/sosomoss2050/moss-cutter/issues
```

### 需要帮助？
```
1. 宝塔官方论坛
2. 腾讯云工单
3. GitHub Discussions
```

## 🎉 恭喜！
你的MossCutter已经成功部署到腾讯云服务器！

现在可以：
1. 开始推广你的工具
2. 收集用户反馈
3. 监控网站访问
4. 规划功能更新

**祝你部署顺利！** 🚀