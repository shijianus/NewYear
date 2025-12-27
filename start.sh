#!/bin/bash

# 2026 跨时空烟花项目 - 一键启动脚本

echo "================================"
echo "🎆 2026 跨时空烟花项目"
echo "   正在启动服务器..."
echo "================================"
echo ""

# 检查项目文件
if [ ! -f "index.html" ]; then
    echo "❌ 错误：未找到 index.html"
    echo "   请确保在项目根目录运行此脚本"
    exit 1
fi

# 检查Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo "❌ 未找到Python，请先安装Python"
    echo "   Ubuntu/Debian: sudo apt-get install python3"
    echo "   macOS: brew install python3"
    exit 1
fi

echo "✅ 检测到Python: $PYTHON_CMD"
echo ""

# 统计资源
AUDIO_COUNT=$(ls -1 assets/audio/*.mp3 2>/dev/null | wc -l)
IMAGE_COUNT=$(ls -1 assets/images/*.{jpg,png} 2>/dev/null | wc -l)

echo "📊 资源统计:"
echo "   音频文件: $AUDIO_COUNT 个"
echo "   图片文件: $IMAGE_COUNT 个"
echo ""

if [ $AUDIO_COUNT -lt 7 ]; then
    echo "⚠️  警告：音频文件不完整（应有7个）"
fi

if [ $IMAGE_COUNT -lt 3 ]; then
    echo "⚠️  警告：图片文件不完整（应有3个）"
fi

echo ""
echo "================================"
echo "🚀 服务器已启动！"
echo "================================"
echo ""
echo "请在浏览器中访问："
echo ""
echo "  🌐 主会场:"
echo "     http://localhost:8000/index.html"
echo ""
echo "  🎆 纯享模式:"
echo "     http://localhost:8000/firecracker.html"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""
echo "================================"
echo ""

# 启动服务器
$PYTHON_CMD -m http.server 8000
