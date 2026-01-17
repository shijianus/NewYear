# 星空湖景壁纸

基于 Wallpaper Engine 素材的纯浏览器实现，无需任何插件或依赖。

## 快速预览

```bash
bash preview.sh
```

然后访问 http://localhost:8080

## 部署到 Cloudflare Pages

1. 访问 [Cloudflare Pages](https://dash.cloudflare.com/)
2. 选择 "Direct Upload"
3. 上传整个项目文件夹
4. 完成！

详细说明请查看 [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md)

## 效果展示

- ✨ 250 颗闪烁星星
- 🌌 3 层旋转星轨
- ☄️ 随机流星
- ✨ 梦幻粒子
- 🌊 湖面波纹
- 🌫️ 雾气效果
- 🖱️ 视差交互

## 文件结构

```
NewYear/
├── index.html          # 主页面
├── wallpaper/          # 壁纸资源
│   └── output/materials/
│       ├── 背景.png
│       └── 湖面.png
├── _headers            # Cloudflare 配置
├── _redirects          # 路由配置
├── preview.sh          # 预览脚本
├── final-check.sh      # 检查脚本
├── CLOUDFLARE_DEPLOY.md # 部署指南
└── DEPLOYMENT_GUIDE.md # 详细说明
```

## 兼容性

- ✓ Chrome 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Edge 90+
- ✓ iOS Safari 14+
- ✓ Chrome Mobile 90+

## 性能

- 首次加载: ~2-3 秒
- 帧率: 60 FPS
- 内存: ~50-80 MB

## 技术栈

- HTML5 Canvas
- CSS3 Animations
- Vanilla JavaScript (无依赖)

## 更新日志

### v2.0 (2026-01-17)
- 添加星轨效果
- 添加粒子系统
- 添加雾气层
- 优化视觉效果
- 确保 Cloudflare 兼容性
- 注释其他功能，专注背景效果

## 许可

壁纸素材来源于 Wallpaper Engine workshop，仅供学习使用。
