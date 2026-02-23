#!/usr/bin/env python3
"""
图片网格切割工具 - 本地服务器启动脚本
"""

import http.server
import socketserver
import webbrowser
import sys
import os

PORT = 8000

def start_server():
    """启动本地HTTP服务器"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    handler = http.server.SimpleHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"服务器已启动！")
        print(f"访问地址: http://localhost:{PORT}")
        print(f"按 Ctrl+C 停止服务器")
        print("\n工具功能:")
        print("1. 上传图片并选择网格大小")
        print("2. 一键切割图片")
        print("3. 打包成ZIP下载")
        
        # 自动打开浏览器
        try:
            webbrowser.open(f"http://localhost:{PORT}")
            print("已尝试在浏览器中打开页面...")
        except:
            print("无法自动打开浏览器，请手动访问上述地址")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")
            sys.exit(0)

def print_banner():
    banner = """
    ╔══════════════════════════════════════════════════════╗
    ║                  MossCutter v1.0.0                   ║
    ║       Intelligent Image Grid Cutting Tool            ║
    ║                by SOSOMOSS LTD.                      ║
    ║         https://github.com/sosomoss/moss-cutter      ║
    ╚══════════════════════════════════════════════════════╝
    """
    print(banner)

if __name__ == "__main__":
    print_banner()
    start_server()