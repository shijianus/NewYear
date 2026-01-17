#!/bin/bash

echo "========================================"
echo "  📋 部署状态检查"
echo "========================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}【1/4】Git 状态检查${NC}"
echo ""

git_status=$(git status --porcelain)
if [ -z "$git_status" ]; then
    echo -e "${GREEN}✓${NC} 工作区干净，所有更改已提交"
else
    echo -e "${RED}✗${NC} 有未提交的更改："
    echo "$git_status"
fi

echo ""
echo -e "${BLUE}【2/4】主界面文件检查${NC}"
echo ""

if [ -f "index.html" ]; then
    size=$(du -h index.html | cut -f1)
    echo -e "${GREEN}✓${NC} index.html 存在 (${size})"
    
    if grep -q "星空湖景" index.html; then
        echo -e "${GREEN}✓${NC} 确认为星空湖景版本"
    else
        echo -e "${RED}✗${NC} 不是星空湖景版本"
    fi
else
    echo -e "${RED}✗${NC} index.html 不存在"
fi

if [ -f "index.backup-fireworks.html" ]; then
    echo -e "${GREEN}✓${NC} index.backup-fireworks.html 存在（备份）"
else
    echo -e "${YELLOW}⚠${NC} index.backup-fireworks.html 不存在"
fi

echo ""
echo -e "${BLUE}【3/4】资源文件检查${NC}"
echo ""

resources=(
    "wallpaper/output/materials/背景.png"
    "wallpaper/output/materials/湖面.png"
    "_headers"
    "_redirects"
)

all_ok=true
for resource in "${resources[@]}"; do
    if [ -f "$resource" ]; then
        size=$(du -h "$resource" | cut -f1)
        echo -e "${GREEN}✓${NC} $resource ($size)"
    else
        echo -e "${RED}✗${NC} $resource (缺失)"
        all_ok=false
    fi
done

echo ""
echo -e "${BLUE}【4/4】Git 推送状态${NC}"
echo ""

remote_info=$(git remote -v)
echo "远程仓库:"
echo "$remote_info"
echo ""

branch=$(git branch --show-current)
echo "当前分支: $branch"

ahead=$(git rev-list --count HEAD..origin/$branch 2>/dev/null || echo "0")
behind=$(git rev-list --count origin/$branch..HEAD 2>/dev/null || echo "0")

if [ "$ahead" -eq 0 ] && [ "$behind" -eq 0 ]; then
    echo -e "${GREEN}✓${NC} 本地与远程同步"
elif [ "$ahead" -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} 本地领先远程 $ahead 个提交"
else
    echo -e "${YELLOW}⚠${NC} 本地落后远程 $behind 个提交"
fi

echo ""
echo "========================================"
echo -e "${BLUE}【访问指南】${NC}"
echo "========================================"
echo ""

echo -e "${GREEN}方式一：本地预览${NC}"
echo "  命令: bash preview.sh"
echo "  访问: http://localhost:8080"
echo ""

echo -e "${GREEN}方式二：Cloudflare Pages${NC}"
echo "  1. 访问: https://dash.cloudflare.com/"
echo "  2. Workers & Pages → Create a project"
echo "  3. Connect to Git → 选择 NewYear 仓库"
echo "  4. Save and Deploy"
echo "  5. 访问生成的 .pages.dev 域名"
echo ""

echo -e "${GREEN}方式三：GitHub Pages${NC}"
echo "  如果已启用: https://shijianus.github.io/NewYear/"
echo ""

echo "========================================"
echo -e "${BLUE}【确认新版本】${NC}"
echo "========================================"
echo ""

echo "访问页面后，检查以下内容："
echo "  ✅ 页面标题: 星空湖景 - Starry Lake Background"
echo "  ✅ 左上角有信息面板"
echo "  ✅ 看到闪烁的星星"
echo "  ✅ 看到旋转的星轨"
echo "  ✅ 看到随机流星"
echo "  ✅ 看到漂浮粒子"
echo "  ✅ 鼠标移动有视差效果"
echo ""

echo "========================================"
echo -e "${BLUE}【快速命令】${NC}"
echo "========================================"
echo ""

echo "查看状态:   git status"
echo "查看日志:   git log --oneline -3"
echo "本地测试:   bash preview.sh"
echo "强制推送:   git push -f origin main"
echo ""

echo "========================================"
