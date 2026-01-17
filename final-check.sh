#!/bin/bash

echo "========================================"
echo "  最终部署检查"
echo "========================================"
echo ""

SUCCESS=0
FAIL=0

# 检查函数
check() {
    if [ -f "$1" ]; then
        echo "✓ $1"
        ((SUCCESS++))
    else
        echo "✗ $1 (缺失)"
        ((FAIL++))
    fi
}

echo "文件检查..."
check "index.html"
check "_headers"
check "_redirects"
check "wallpaper/output/materials/背景.png"
check "wallpaper/output/materials/湖面.png"
check "preview.sh"
check "CLOUDFLARE_DEPLOY.md"
check "DEPLOYMENT_GUIDE.md"

echo ""
echo "统计: $SUCCESS 个文件正常, $FAIL 个文件缺失"

if [ $FAIL -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ✓ 所有检查通过！"
    echo "========================================"
    echo ""
    echo "下一步："
    echo "1. 本地测试: bash preview.sh"
    echo "2. Cloudflare 部署: 查看 CLOUDFLARE_DEPLOY.md"
    echo ""
    exit 0
else
    echo ""
    echo "========================================"
    echo "  ✗ 检查失败！"
    echo "========================================"
    exit 1
fi
