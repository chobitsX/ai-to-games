#!/bin/bash

echo "🧪 测试字母打地鼠游戏"
echo "===================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo "请访问 https://nodejs.org 下载安装"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

echo "✅ 依赖已安装"

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo "🌐 游戏将在 http://localhost:3000 打开"
echo "🔧 开发模式下可以看到调试信息"
echo ""
echo "📋 测试步骤："
echo "1. 点击'开始游戏'按钮"
echo "2. 选择难度等级"
echo "3. 观察是否有地鼠出现"
echo "4. 按键盘字母键测试击中功能"
echo "5. 查看右下角的调试信息"
echo ""
echo "🐛 如果地鼠不出现，请："
echo "- 打开浏览器开发者工具 (F12)"
echo "- 查看控制台日志"
echo "- 点击左上角的Debug按钮查看调试面板"
echo ""

npm run dev
