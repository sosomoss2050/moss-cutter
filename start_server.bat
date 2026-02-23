@echo off
echo ╔══════════════════════════════════════════════════════╗
echo ║                  MossCutter v1.0.0                   ║
echo ║       Intelligent Image Grid Cutting Tool            ║
echo ║                by SOSOMOSS LTD.                      ║
echo ║         https://github.com/sosomoss/moss-cutter      ║
echo ╚══════════════════════════════════════════════════════╝
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Python，请先安装Python 3
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM 启动服务器
echo 正在启动本地服务器...
echo 访问地址: http://localhost:8000
echo 按 Ctrl+C 停止服务器
echo.
echo 工具功能:
echo 1. 上传图片并选择网格大小
echo 2. 一键切割图片
echo 3. 打包成ZIP下载
echo.

python start_server.py

pause