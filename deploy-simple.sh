#!/bin/bash

# 2026 跨时空烟花项目 - 简单部署脚本

echo "================================"
echo "📦 2026 跨时空烟花项目"
echo "   部署检查脚本"
echo "================================"
echo ""

# 检查必需文件
echo "📁 检查项目文件..."

REQUIRED_FILES=(
    "index.html"
    "firecracker.html"
    "assets/js/main.js"
    "assets/js/firecracker.js"
    "assets/js/core/ParticleSystem.js"
    "assets/js/core/FireworkEngine.js"
    "assets/js/core/AudioManager.js"
    "assets/js/core/ThemeManager.js"
    "assets/js/core/HistoryHighlights.js"
    "assets/js/utils/TimeZoneDetector.js"
    "assets/js/utils/CalendarCalculator.js"
    "assets/js/utils/LocationService.js"
    "assets/js/config/themes.js"
    "assets/js/config/constants.js"
)

ALL_EXIST=true

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
        ALL_EXIST=false
    fi
done

echo ""

if [ "$ALL_EXIST" = false ]; then
    echo "❌ 部署失败：缺少必需文件"
    exit 1
fi

# 检查资源文件
echo "📊 检查资源文件..."

AUDIO_COUNT=$(ls -1 assets/audio/*.mp3 2>/dev/null | wc -l)
IMAGE_COUNT=$(ls -1 assets/images/*.{jpg,png} 2>/dev/null | wc -l)

echo "  音频文件: $AUDIO_COUNT/7"
echo "  图片文件: $IMAGE_COUNT/3"

if [ $AUDIO_COUNT -lt 7 ]; then
    echo "  ⚠️  音频文件不完整，但不影响部署"
fi

if [ $IMAGE_COUNT -lt 3 ]; then
    echo "  ⚠️  图片文件不完整，但不影响部署"
fi

echo ""
echo "================================"
echo "✅ 项目可以部署！"
echo "================================"
echo ""
echo "📋 部署清单："
echo "  1. 将以下文件/目录上传到服务器："
echo "     - index.html"
echo "     - firecracker.html"
echo "     - assets/"
echo ""
echo "  2. 确保服务器支持ES6模块"
echo "     - 正确的MIME类型: application/javascript"
echo ""
echo "  3. 建议使用HTTPS以获得更好的体验"
echo ""
echo "  4. 如果使用Nginx/Apache，确保配置："
echo "     AddType application/javascript .js"
echo ""
echo "================================"
echo ""

# 生成部署文件列表
echo "📄 生成部署文件列表..."
echo "index.html" > deploy-files.txt
echo "firecracker.html" >> deploy-files.txt
find assets -type f >> deploy-files.txt

echo "✅ 部署文件列表已保存到: deploy-files.txt"
echo ""
echo "可以使用以下命令上传："
echo "  rsync -avz --files-from=deploy-files.txt . user@server:/path/to/www/"
echo ""
