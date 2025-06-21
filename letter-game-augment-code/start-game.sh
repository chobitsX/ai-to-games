#!/bin/bash

# 字母打地鼠游戏启动脚本

echo "🎯 欢迎来到字母打地鼠游戏！"
echo ""

# 显示游戏信息
echo "🎮 游戏特色："
echo "  • 帮助儿童练习字母输入"
echo "  • 三种难度等级"
echo "  • 精美的动画效果"
echo "  • 丰富的音效体验"
echo "  • 实时统计和记录"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 需要安装 Node.js 才能运行游戏"
    echo "请访问 https://nodejs.org 下载安装"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 需要安装 npm 才能运行游戏"
    exit 1
fi

echo "✅ 环境检查通过"

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    
    echo "✅ 依赖安装完成"
fi

echo ""
echo "🚀 启动游戏开发服务器..."
echo "🌐 游戏将在浏览器中自动打开"
echo "📱 支持手机和电脑访问"
echo ""
echo "⌨️  游戏操作："
echo "  • 看到字母就快速按下对应的键盘按键"
echo "  • 正确击中得分，错过扣生命值"
echo "  • 挑战你的最高分！"
echo ""
echo "🎵 提示：建议开启音效以获得最佳游戏体验"
echo ""

# 启动开发服务器
npm run dev
