#!/bin/bash

echo "=== 部署前检查 ==="
echo ""

# 检查index.html是否存在
if [ -f "index.html" ]; then
    echo "✓ index.html 存在"
else
    echo "✗ index.html 不存在"
    exit 1
fi

# 检查壁纸资源
if [ -f "wallpaper/output/materials/背景.png" ]; then
    echo "✓ 背景.png 存在"
else
    echo "✗ 背景.png 不存在"
fi

if [ -f "wallpaper/output/materials/湖面.png" ]; then
    echo "✓ 湖面.png 存在"
else
    echo "✗ 湖面.png 不存在"
fi

# 检查配置文件
if [ -f "_headers" ]; then
    echo "✓ _headers 存在"
else
    echo "✗ _headers 不存在"
fi

if [ -f "_redirects" ]; then
    echo "✓ _redirects 存在"
else
    echo "✗ _redirects 不存在"
fi

echo ""
echo "=== 文件大小 ==="
du -h index.html
du -h wallpaper/output/materials/背景.png
du -h wallpaper/output/materials/湖面.png

echo ""
echo "=== 测试完成 ==="
echo "可以部署到 Cloudflare Pages"
