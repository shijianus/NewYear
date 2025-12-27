#!/bin/bash
# 快速部署到 Cloudflare Pages 的脚本

echo "🚀 正在部署到 Cloudflare Pages..."
echo ""

# 部署当前目录
npx wrangler pages deploy . --project-name=newyear

echo ""
echo "✅ 部署完成!"
echo "🌐 访问: https://newyear-d1x.pages.dev/"
echo ""
echo "注意: 这是手动部署。要实现自动部署,请在 Cloudflare Dashboard"
echo "      连接 GitHub 仓库,这样每次 push 都会自动部署。"
