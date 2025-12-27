#!/bin/bash

# 2026 跨时空烟花项目 - GitHub + Cloudflare Pages 快速部署脚本

echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║   🚀 GitHub + Cloudflare Pages 快速部署脚本            ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 检查 git 是否安装
if ! command -v git &> /dev/null; then
    echo "❌ 错误：未安装 git"
    echo "   请先安装 git: https://git-scm.com/"
    exit 1
fi

# 检查是否在 git 仓库中
if [ ! -d ".git" ]; then
    echo "❌ 错误：当前目录不是 git 仓库"
    echo "   请先运行: git init"
    exit 1
fi

echo "✅ Git 仓库检查通过"
echo ""

# 检查必需文件
echo "📁 检查必需文件..."
REQUIRED_FILES=(
    "index.html"
    "firecracker.html"
    "_headers"
    "_redirects"
    "assets/js/main.js"
    "assets/js/firecracker.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
        echo ""
        echo "❌ 部署失败：缺少必需文件"
        exit 1
    fi
done

echo ""
echo "✅ 所有必需文件已就绪"
echo ""

# 显示当前 git 状态
echo "📊 当前 Git 状态:"
echo ""
git status --short
echo ""

# 询问是否继续
read -p "是否继续部署? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 部署已取消"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查是否有远程仓库
if git remote get-url origin &> /dev/null; then
    REMOTE_URL=$(git remote get-url origin)
    echo "📌 检测到远程仓库:"
    echo "   $REMOTE_URL"
    echo ""

    read -p "是否推送到现有仓库? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        PUSH_TO_EXISTING=true
    else
        PUSH_TO_EXISTING=false
    fi
else
    PUSH_TO_EXISTING=false
fi

# 如果没有现有仓库或用户想创建新仓库
if [ "$PUSH_TO_EXISTING" = false ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📝 创建新的 GitHub 仓库"
    echo ""
    echo "请按照以下步骤操作："
    echo ""
    echo "1. 访问 https://github.com/new"
    echo "2. 创建新仓库（不初始化 README、.gitignore 或 license）"
    echo "3. 创建后，GitHub 会显示推送命令"
    echo ""
    echo "或者，如果你想推送到现有仓库："
    echo ""
    read -p "请输入你的 GitHub 仓库 URL: " REPO_URL

    if [ -z "$REPO_URL" ]; then
        echo "❌ 仓库 URL 不能为空"
        exit 1
    fi

    # 添加或更新远程仓库
    if git remote get-url origin &> /dev/null; then
        git remote set-url origin "$REPO_URL"
    else
        git remote add origin "$REPO_URL"
    fi

    echo ""
    echo "✅ 远程仓库已配置"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 添加所有文件
echo "📦 添加文件到 Git..."
git add .
echo "✅ 文件已添加"

# 提交
echo ""
echo "💬 提交更改..."
read -p "请输入提交信息 (默认: '✨ 完成跨时空烟花项目'): " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="✨ 完成跨时空烟花项目 - Project Epoch

- 添加完整的粒子系统和烟花引擎
- 实现智能时空检测和双日历主题
- 添加史册摘要和音频系统
- 整合所有资源文件
- 配置 Cloudflare Pages 自动部署"
fi

git commit -m "$COMMIT_MSG"
echo "✅ 更改已提交"

# 推送
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 推送到 GitHub..."
echo ""

if git push origin main; then
    echo ""
    echo "✅ 代码已成功推送到 GitHub!"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. 仓库 URL 不正确"
    echo "2. 没有推送权限"
    echo "3. 需要身份验证"
    echo ""
    echo "请检查并手动运行: git push origin main"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║   ✅ 代码已成功推送到 GitHub！                        ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📝 下一步：在 Cloudflare Pages 创建项目"
echo ""
echo "1. 访问 https://dash.cloudflare.com/"
echo "2. 选择 'Workers & Pages' → 'Create application'"
echo "3. 点击 'Connect to Git'"
echo "4. 选择你的 GitHub 仓库"
echo "5. 配置："
echo "   - Production branch: main"
echo "   - Build command: (留空)"
echo "   - Build output directory: /"
echo "6. 点击 'Save and Deploy'"
echo ""
echo "详细步骤请查看: DEPLOYMENT.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
