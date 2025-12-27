#!/bin/bash

# 2026 跨时空烟花项目 - 快速启动指南

echo "================================"
echo "🎆 2026 跨时空烟花项目"
echo "   快速启动指南"
echo "================================"
echo ""

# 检查Python是否安装
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo "❌ 未找到Python，请先安装Python"
    exit 1
fi

echo "✅ 检测到Python: $PYTHON_CMD"
echo ""

# 检查项目文件
echo "📁 检查项目文件..."
if [ -f "index.html" ] && [ -f "firecracker.html" ]; then
    echo "✅ HTML文件完整"
else
    echo "❌ HTML文件缺失"
    exit 1
fi

JS_COUNT=$(find assets/js -name "*.js" 2>/dev/null | wc -l)
if [ $JS_COUNT -ge 10 ]; then
    echo "✅ JavaScript文件完整 ($JS_COUNT 个文件)"
else
    echo "⚠️  JavaScript文件可能不完整 ($JS_COUNT 个文件)"
fi

echo ""
echo "================================"
echo "🚀 启动服务器..."
echo "================================"
echo ""

# 显示访问信息
echo "服务器将在以下端口启动："
echo "  - 主端口: 8000"
echo ""
echo "请在浏览器中访问："
echo "  🌐 主会场: http://localhost:8000/index.html"
echo "  🎆 纯享模式: http://localhost:8000/firecracker.html"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""
echo "================================"
echo ""

# 启动HTTP服务器
$PYTHON_CMD -m http.server 8000
