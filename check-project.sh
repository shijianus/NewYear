#!/bin/bash

echo "================================"
echo "2026 跨时空烟花项目 - 项目检查"
echo "================================"
echo ""

# 检查核心JS文件
echo "📁 检查核心JS文件..."
CORE_FILES=(
    "assets/js/core/ParticleSystem.js"
    "assets/js/core/FireworkEngine.js"
    "assets/js/core/AudioManager.js"
    "assets/js/core/ThemeManager.js"
    "assets/js/core/HistoryHighlights.js"
)

for file in "${CORE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
    fi
done

echo ""
echo "📁 检查工具类JS文件..."
UTIL_FILES=(
    "assets/js/utils/TimeZoneDetector.js"
    "assets/js/utils/CalendarCalculator.js"
    "assets/js/utils/LocationService.js"
)

for file in "${UTIL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
    fi
done

echo ""
echo "📁 检查配置文件..."
CONFIG_FILES=(
    "assets/js/config/themes.js"
    "assets/js/config/constants.js"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
    fi
done

echo ""
echo "📁 检查控制器文件..."
CONTROLLER_FILES=(
    "assets/js/main.js"
    "assets/js/firecracker.js"
)

for file in "${CONTROLLER_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
    fi
done

echo ""
echo "📄 检查HTML文件..."
HTML_FILES=(
    "index.html"
    "firecracker.html"
)

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
    fi
done

echo ""
echo "🎵 检查音频资源..."
AUDIO_COUNT=$(ls assets/audio/*.mp3 2>/dev/null | wc -l)
if [ $AUDIO_COUNT -gt 0 ]; then
    echo "  ✅ 找到 $AUDIO_COUNT 个音频文件"
    ls -lh assets/audio/*.mp3 2>/dev/null | awk '{print "     " $9 " (" $5 ")"}'
else
    echo "  ⚠️  音频文件未添加 (assets/audio/)"
    echo "     请参考 assets/RESOURCES_GUIDE.md 添加音频资源"
fi

echo ""
echo "🖼️  检查图片资源..."
IMAGE_COUNT=$(ls assets/images/*.{jpg,png} 2>/dev/null | wc -l)
if [ $IMAGE_COUNT -gt 0 ]; then
    echo "  ✅ 找到 $IMAGE_COUNT 个图片文件"
    ls -lh assets/images/*.{jpg,png} 2>/dev/null | awk '{print "     " $9 " (" $5 ")"}'
else
    echo "  ⚠️  图片文件未添加 (assets/images/)"
    echo "     请参考 assets/RESOURCES_GUIDE.md 添加图片资源"
fi

echo ""
echo "📊 项目统计..."
echo "  JS文件总数: $(find assets/js -name "*.js" | wc -l)"
echo "  HTML文件数: $(ls *.html | wc -l)"
echo "  总代码行数: $(find assets/js -name "*.js" -exec cat {} \; | wc -l)"

echo ""
echo "================================"
echo "检查完成！"
echo "================================"
echo ""
echo "📖 下一步："
echo "1. 添加音频和图片资源（参考 assets/RESOURCES_GUIDE.md）"
echo "2. 启动本地服务器测试："
echo "   python -m http.server 8000"
echo "   或"
echo "   npx http-server"
echo ""
echo "3. 在浏览器访问："
echo "   http://localhost:8000/index.html (主会场)"
echo "   http://localhost:8000/firecracker.html (纯享模式)"
echo ""
