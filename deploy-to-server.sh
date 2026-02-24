#!/bin/bash
# MossCutter 服务器部署脚本
# 使用方法：在网站根目录运行 ./deploy-to-server.sh

echo "================================================"
echo "🚀 MossCutter v1.1.1 服务器部署脚本"
echo "================================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函数：检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "命令 $1 未找到，请先安装"
        exit 1
    fi
}

# 函数：检查当前目录
check_current_dir() {
    local current_dir=$(pwd)
    print_info "当前目录: $current_dir"
    
    # 检查是否是网站目录（常见宝塔路径）
    if [[ ! "$current_dir" =~ "/www/wwwroot/" ]]; then
        print_warning "当前目录可能不是网站根目录"
        print_warning "建议在宝塔网站目录运行，如：/www/wwwroot/yourdomain.com"
        read -p "是否继续？(y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "部署已取消"
            exit 0
        fi
    fi
}

# 函数：备份当前版本
backup_current_version() {
    local backup_dir="../moss-cutter-backup-$(date +%Y%m%d-%H%M%S)"
    
    print_info "正在备份当前版本..."
    
    # 创建备份目录
    mkdir -p "$backup_dir"
    
    # 备份所有文件
    if [ "$(ls -A .)" ]; then
        cp -r ./* "$backup_dir/"
        print_success "备份完成: $backup_dir"
        echo "备份内容:"
        ls -la "$backup_dir/" | head -10
    else
        print_info "当前目录为空，无需备份"
    fi
}

# 函数：清理当前目录
clean_current_dir() {
    print_info "正在清理当前目录..."
    
    # 保留脚本本身
    local script_name=$(basename "$0")
    
    # 删除除脚本外的所有文件
    find . -maxdepth 1 ! -name "$script_name" ! -name "." -exec rm -rf {} \; 2>/dev/null || true
    
    print_success "目录清理完成"
    echo "当前目录内容:"
    ls -la
}

# 函数：从GitHub下载最新版本
download_from_github() {
    print_info "正在从GitHub下载MossCutter v1.1.1..."
    
    # GitHub仓库信息
    local repo_owner="sosomoss2050"
    local repo_name="moss-cutter"
    local version="v1.1.1"
    
    # 方法1：使用git（推荐）
    if command -v git &> /dev/null; then
        print_info "使用git克隆仓库..."
        git clone --depth 1 --branch "$version" "https://github.com/$repo_owner/$repo_name.git" temp_mosscutter
        if [ $? -eq 0 ]; then
            cp -r temp_mosscutter/* .
            rm -rf temp_mosscutter
            print_success "Git下载完成"
            return 0
        fi
    fi
    
    # 方法2：使用curl下载ZIP
    print_info "使用curl下载ZIP包..."
    if command -v curl &> /dev/null; then
        curl -L "https://github.com/$repo_owner/$repo_name/archive/refs/tags/$version.zip" -o mosscutter.zip
        if [ $? -eq 0 ]; then
            unzip -q mosscutter.zip
            cp -r "$repo_name-${version#v}"/* .
            rm -rf "$repo_name-${version#v}" mosscutter.zip
            print_success "ZIP下载完成"
            return 0
        fi
    fi
    
    # 方法3：使用wget下载ZIP
    print_info "使用wget下载ZIP包..."
    if command -v wget &> /dev/null; then
        wget "https://github.com/$repo_owner/$repo_name/archive/refs/tags/$version.zip" -O mosscutter.zip
        if [ $? -eq 0 ]; then
            unzip -q mosscutter.zip
            cp -r "$repo_name-${version#v}"/* .
            rm -rf "$repo_name-${version#v}" mosscutter.zip
            print_success "ZIP下载完成"
            return 0
        fi
    fi
    
    print_error "所有下载方法都失败了"
    return 1
}

# 函数：手动下载（如果自动下载失败）
manual_download_instructions() {
    print_warning "自动下载失败，请手动下载文件"
    echo "================================================"
    echo "📥 手动下载步骤："
    echo "1. 访问: https://github.com/sosomoss2050/moss-cutter"
    echo "2. 点击 'Code' → 'Download ZIP'"
    echo "3. 解压ZIP文件"
    echo "4. 上传所有文件到当前目录"
    echo ""
    echo "或者使用命令："
    echo "wget https://github.com/sosomoss2050/moss-cutter/archive/refs/tags/v1.1.1.zip"
    echo "unzip v1.1.1.zip"
    echo "cp -r moss-cutter-1.1.1/* ."
    echo "rm -rf moss-cutter-1.1.1 v1.1.1.zip"
    echo "================================================"
    
    read -p "是否已手动准备好文件？(y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "请先手动下载文件"
        exit 1
    fi
}

# 函数：设置文件权限
set_permissions() {
    print_info "正在设置文件权限..."
    
    # 设置文件权限
    find . -type f -name "*.html" -exec chmod 644 {} \;
    find . -type f -name "*.css" -exec chmod 644 {} \;
    find . -type f -name "*.js" -exec chmod 644 {} \;
    find . -type f -name "*.png" -exec chmod 644 {} \;
    find . -type f -name "*.jpg" -exec chmod 644 {} \;
    find . -type f -name "*.json" -exec chmod 644 {} \;
    find . -type f -name "*.md" -exec chmod 644 {} \;
    
    # 设置目录权限
    find . -type d -exec chmod 755 {} \;
    
    # 尝试设置用户组（如果知道Web服务器用户）
    if [ -n "$WEB_USER" ]; then
        chown -R $WEB_USER:$WEB_USER .
        print_info "已设置用户组为: $WEB_USER"
    else
        # 尝试猜测Web服务器用户
        if id www &>/dev/null; then
            chown -R www:www .
            print_info "已设置用户组为: www"
        elif id nginx &>/dev/null; then
            chown -R nginx:nginx .
            print_info "已设置用户组为: nginx"
        elif id apache &>/dev/null; then
            chown -R apache:apache .
            print_info "已设置用户组为: apache"
        else
            print_warning "无法确定Web服务器用户，跳过用户组设置"
        fi
    fi
    
    print_success "权限设置完成"
}

# 函数：验证部署
verify_deployment() {
    print_info "正在验证部署..."
    
    # 检查必要文件
    local required_files=("index.html" "style.css" "script.js")
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        print_error "缺少必要文件: ${missing_files[*]}"
        return 1
    fi
    
    # 检查文件大小
    print_info "文件检查:"
    ls -la index.html style.css script.js | awk '{print $5 " bytes - " $9}'
    
    # 检查版本信息
    if grep -q "v1.1.1" index.html; then
        print_success "版本信息正确: v1.1.1"
    else
        print_warning "版本信息可能不是v1.1.1"
    fi
    
    # 检查文件总数
    local file_count=$(find . -type f | wc -l)
    print_info "总文件数: $file_count"
    
    print_success "部署验证通过"
    return 0
}

# 函数：生成Nginx配置建议
generate_nginx_config() {
    print_info "生成Nginx配置建议..."
    
    local domain="yourdomain.com"  # 请替换为你的域名
    local config_file="nginx-mosscutter.conf"
    
    cat > "$config_file" << EOF
# MossCutter Nginx 配置
# 保存为: /www/server/panel/vhost/nginx/yourdomain.com.conf

server {
    listen 80;
    server_name $domain www.$domain;
    root /www/wwwroot/$domain;
    index index.html index.htm;
    
    # 开启gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/xml+rss 
               application/json image/svg+xml;
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # HTML文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
    
    # 防止目录列表
    autoindex off;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # 错误页面
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}

# HTTPS配置（申请SSL证书后启用）
# server {
#     listen 443 ssl http2;
#     server_name $domain www.$domain;
#     root /www/wwwroot/$domain;
#     index index.html index.htm;
#     
#     ssl_certificate /www/server/panel/vhost/cert/$domain/fullchain.pem;
#     ssl_certificate_key /www/server/panel/vhost/cert/$domain/privkey.pem;
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
#     
#     # 其他配置与HTTP相同...
#     
#     # 强制HTTPS（取消下面注释）
#     # if (\$scheme = http) {
#     #     return 301 https://\$server_name\$request_uri;
#     # }
# }
EOF
    
    print_success "Nginx配置已生成: $config_file"
    print_info "请将文件中的 'yourdomain.com' 替换为你的实际域名"
}

# 函数：生成部署报告
generate_deployment_report() {
    local report_file="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
================================================
MossCutter 部署报告
生成时间: $(date)
================================================

部署目录: $(pwd)
部署版本: v1.1.1
GitHub仓库: https://github.com/sosomoss2050/moss-cutter

文件清单:
$(find . -type f | sort)

关键文件检查:
$(ls -la index.html style.css script.js)

权限设置:
$(ls -la | head -5)

部署步骤完成:
1. 目录检查: 完成
2. 备份旧版本: 完成
3. 清理目录: 完成  
4. 下载新版本: 完成
5. 设置权限: 完成
6. 验证部署: 完成

下一步操作:
1. 在宝塔面板中配置网站
2. 设置域名解析
3. 申请SSL证书
4. 测试网站功能

问题排查:
1. 如果无法访问，检查Nginx配置
2. 如果功能异常，检查浏览器控制台
3. 如果权限问题，运行: chmod 644 *.html *.css *.js

技术支持:
• GitHub Issues: https://github.com/sosomoss2050/moss-cutter/issues
• 文档: https://github.com/sosomoss2050/moss-cutter#readme

================================================
部署完成！ 🎉
EOF
    
    print_success "部署报告已生成: $report_file"
}

# 主函数
main() {
    echo ""
    print_info "开始MossCutter v1.1.1部署流程"
    echo ""
    
    # 步骤1：检查当前目录
    check_current_dir
    
    # 步骤2：备份当前版本
    backup_current_version
    
    # 步骤3：清理当前目录
    clean_current_dir
    
    # 步骤4：下载最新版本
    if ! download_from_github; then
        manual_download_instructions
    fi
    
    # 步骤5：设置文件权限
    set_permissions
    
    # 步骤6：验证部署
    if ! verify_deployment; then
        print_error "部署验证失败"
        exit 1
    fi
    
    # 步骤7：生成Nginx配置
    generate_nginx_config
    
    # 步骤8：生成部署报告
    generate_deployment_report
    
    echo ""
    echo "================================================"
    print_success "🎉 MossCutter v1.1.1 部署完成！"
    echo "================================================"
    echo ""
    echo "📋 下一步操作："
    echo "1. 在宝塔面板中检查网站配置"
    echo "2. 访问你的域名测试功能"
    echo "3. 申请SSL证书启用HTTPS"
    echo "4. 配置CDN（可选）"
    echo ""
    echo "🔗 重要链接："
    echo "• 在线演示: https://sosomoss2050.github.io/moss-cutter/"
    echo "• GitHub仓库: https://github.com/sosomoss2050/moss-cutter"
    echo "• 问题反馈: https://github.com/sosomoss2050/moss-cutter/issues"
    echo ""
    echo "🛠️  如果遇到问题："
    echo "1. 查看部署报告: cat deployment-report-*.txt"
    echo "2. 检查Nginx配置: nginx -t"
    echo "3. 查看错误日志: tail -f /www/wwwlogs/error.log"
    echo "4. 重启Nginx: service nginx restart"
    echo ""
    echo "================================================"
}

# 执行主函数
main "$@"