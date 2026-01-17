#!/bin/bash

# 部署检查和预览脚本

echo "======================================"
echo "  星空湖景壁纸 - 部署检查"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查文件
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (缺失)"
        return 1
    fi
}

echo "【1/3】检查必需文件..."
check_failed=0

check_file "index.html" || check_failed=1
check_file "_headers" || check_failed=1
check_file "_redirects" || check_failed=1
check_file "wallpaper/output/materials/背景.png" || check_failed=1
check_file "wallpaper/output/materials/湖面.png" || check_failed=1

if [ $check_failed -eq 1 ]; then
    echo ""
    echo -e "${RED}✗ 文件检查失败${NC}"
    exit 1
else
    echo ""
    echo -e "${GREEN}✓ 所有必需文件存在${NC}"
fi

# 检查文件大小
echo ""
echo "【2/3】检查文件大小..."

total_size=$(du -sh index.html wallpaper/output/materials/*.png | grep -E '^[0-9.]+[MG]' | awk '{sum+=$1} END {print sum}')

bg_size=$(du -h wallpaper/output/materials/背景.png | cut -f1)
lake_size=$(du -h wallpaper/output/materials/湖面.png | cut -f1)

echo "index.html: $(du -h index.html | cut -f1)"
echo "背景.png: $bg_size"
echo "湖面.png: $lake_size"
echo ""

if [ "$bg_size" != "236K" ]; then
    echo -e "${YELLOW}⚠ 背景图片大小可能不正确${NC}"
fi

if [ "$lake_size" != "1.5M" ]; then
    echo -e "${YELLOW}⚠ 湖面图片大小可能不正确${NC}"
fi

# 启动本地服务器
echo ""
echo "【3/3】启动本地预览服务器..."
echo ""

# 检查端口是否被占用
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ 端口 8080 已被占用${NC}"
    echo "尝试使用端口 8081..."
    PORT=8081
else
    PORT=8080
fi

# 启动服务器
echo -e "${GREEN}正在启动服务器...${NC}"
echo "访问地址: http://localhost:$PORT"
echo "按 Ctrl+C 停止服务器"
echo ""
echo "======================================"
echo ""

python3 -m http.server $PORT &
SERVER_PID=$!

# 等待服务器启动
sleep 2

# 测试服务器
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ | grep -q "200"; then
    echo -e "${GREEN}✓ 服务器启动成功${NC}"
    echo ""
    echo "📱 手机预览:"
    echo "   1. 确保手机和电脑在同一网络"
    echo "   2. 查看本机IP: ifconfig 或 ipconfig"
    echo "   3. 访问: http://<本机IP>:$PORT"
    echo ""

    # 等待用户中断
    wait $SERVER_PID
else
    echo -e "${RED}✗ 服务器启动失败${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi
