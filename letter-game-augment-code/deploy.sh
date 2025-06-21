#!/bin/bash

# 字母打地鼠游戏部署脚本

echo "🎯 开始部署字母打地鼠游戏..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安装"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装成功"

# 构建项目
echo "🔨 构建生产版本..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 检查构建输出
if [ -d "dist" ]; then
    echo "✅ 构建文件已生成在 dist 目录"
    echo "📁 构建文件列表："
    ls -la dist/
else
    echo "❌ 构建目录不存在"
    exit 1
fi

echo ""
echo "🎉 部署准备完成！"
echo ""
echo "📋 接下来的步骤："
echo "1. 将 dist 目录中的文件上传到你的 Web 服务器"
echo "2. 或者运行 'npm run preview' 来本地预览生产版本"
echo "3. 或者使用静态托管服务如 Netlify、Vercel、GitHub Pages 等"
echo ""
echo "🚀 本地预览命令: npm run preview"
echo "🌐 开发服务器命令: npm run dev"
echo ""
echo "✨ 享受你的字母打地鼠游戏吧！"
