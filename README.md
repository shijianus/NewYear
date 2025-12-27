# 🎆 2026 跨时空烟花项目 - Project Epoch

<div align="center">

一个自主可控、具备历史记录功能、适配双历文化并能感知用户时区的综合性烟花庆祝平台。

[![部署状态](https://img.shields.io/badge/deployment-active-success)](https://your-project.pages.dev)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://www.javascript.com/)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

[在线演示](https://your-project.pages.dev) • [快速开始](#-快速开始) • [功能特性](#-功能特性) • [部署指南](#-部署到-cloudflare-pages)

</div>

---

## ✨ 项目特色

- 🌍 **智能时空系统** - 基于Intl API的全球时区检测，IP地理位置定位
- 🎆 **视觉盛宴** - 多种烟花形状、史册摘要粒子图阵
- 🎵 **听觉享受** - 7种精心设计的音效，主题BGM自动切换
- 📱 **全平台支持** - 响应式设计，支持多点触控和摇一摇
- ⚡ **零依赖** - 完全自主，无外部CDN依赖
- 🚀 **即开即用** - 无需构建，直接部署

---

## 🎯 功能特性

### 智能时空系统
- ✅ 基于Intl API的全球时区检测
- ✅ IP地理位置智能定位（多API备用）
- ✅ 双日历主题自动切换（阳历/阴历）
- ✅ 本地时间精确倒计时

### 视觉特效系统
- ✅ 4种烟花爆炸形状（圆形、心形、星形、打铁花）
- ✅ 史册摘要粒子图阵（蛇、AI、心、2026）
- ✅ 粒子吸附技术
- ✅ 文字转粒子点阵

### 音频管理系统
- ✅ 7种精心设计的音效
- ✅ 主题BGM自动切换
- ✅ 音频预加载和缓存
- ✅ 用户交互解锁机制

### 用户交互
- ✅ 点击发射烟花
- ✅ 多点触控支持
- ✅ 摇一摇触发大爆炸（移动端）
- ✅ 欢迎页引导

---

## 🚀 快速开始

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/newyear-2026.git
cd newyear-2026

# 方法1: 使用启动脚本（推荐）
bash start.sh

# 方法2: 使用 Python
python -m http.server 8000

# 方法3: 使用 Node.js
npx http-server
```

然后在浏览器访问：
- **主会场**: http://localhost:8000/index.html
- **纯享模式**: http://localhost:8000/firecracker.html

### 在线演示

访问部署的网站：
- **主会场**: https://your-project.pages.dev/index.html
- **纯享模式**: https://your-project.pages.dev/firecracker.html

---

## 📦 项目结构

```
newyear-2026/
├── index.html                    # 主会场
├── firecracker.html             # 纯享模式
├── _headers                     # Cloudflare headers 配置
├── _redirects                   # Cloudflare redirects 配置
├── assets/
│   ├── audio/                   # 音频资源
│   │   ├── bgm_solar.mp3
│   │   ├── bgm_lunar.mp3
│   │   ├── launch.mp3
│   │   ├── explosion_small.mp3
│   │   ├── explosion_large.mp3
│   │   ├── countdown_heartbeat.mp3
│   │   └── finale_boom.mp3
│   ├── images/                  # 图片资源
│   │   ├── bg_solar.jpg
│   │   ├── bg_lunar.jpg
│   │   └── favicon.png
│   └── js/
│       ├── core/                # 核心模块
│       │   ├── ParticleSystem.js
│       │   ├── FireworkEngine.js
│       │   ├── AudioManager.js
│       │   ├── ThemeManager.js
│       │   └── HistoryHighlights.js
│       ├── utils/               # 工具类
│       │   ├── TimeZoneDetector.js
│       │   ├── CalendarCalculator.js
│       │   └── LocationService.js
│       ├── config/              # 配置文件
│       │   ├── themes.js
│       │   └── constants.js
│       ├── main.js              # 主控制器
│       └── firecracker.js       # 纯享模式控制器
├── DEPLOYMENT.md                # 部署指南
├── GETTING_STARTED.md           # 快速开始
└── README.md                    # 本文件
```

---

## 🌐 部署到 Cloudflare Pages

### 方法 1: 快速部署（推荐）

```bash
# 运行部署脚本
bash deploy-github.sh

# 按照脚本提示操作：
# 1. 脚本会检查项目文件
# 2. 添加并提交所有文件到 Git
# 3. 推送到 GitHub
# 4. 然后在 Cloudflare Dashboard 创建 Pages 项目
```

### 方法 2: 手动部署

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "✨ 完成跨时空烟花项目"
   git push origin main
   ```

2. **在 Cloudflare 创建项目**
   - 访问 https://dash.cloudflare.com/
   - 选择 "Workers & Pages" → "Create application"
   - 点击 "Connect to Git"
   - 选择你的仓库
   - 配置：
     - Production branch: `main`
     - Build command: (留空)
     - Build output directory: `/`
   - 点击 "Save and Deploy"

详细步骤请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🎮 使用说明

### 主会场 (index.html)
1. 点击"点亮星空"按钮解锁音频
2. 观察倒计时和自动烟花
3. 点击屏幕发射交互式烟花
4. 等待0点整触发史册摘要图阵

### 纯享模式 (firecracker.html)
1. 享受无干扰的无限烟花
2. 尝试多点触控（移动端）
3. 摇一摇触发大爆炸（移动端）

---

## 🔧 技术栈

- **前端**: HTML5, CSS3, ES6+
- **渲染**: Canvas API
- **音频**: Web Audio API
- **时区**: Intl API
- **定位**: Fetch API + IP Geolocation
- **模块**: ES6 Modules
- **部署**: Cloudflare Pages

---

## 📊 项目统计

- **代码**: 1,197行 JavaScript
- **文件**: 12个核心模块
- **资源**: 10个（7音频 + 3图片）
- **功能**: 4种烟花形状 + 史册摘要
- **音效**: 7种精心设计的音效

---

## 📝 文档

- [DEPLOYMENT.md](DEPLOYMENT.md) - 完整部署指南
- [GETTING_STARTED.md](GETTING_STARTED.md) - 快速开始指南
- [FINAL_REPORT.md](FINAL_REPORT.md) - 项目完成报告
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 项目总结
- [assets/RESOURCES_GUIDE.md](assets/RESOURCES_GUIDE.md) - 资源文件说明

---

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- 感谢所有为这个项目做出贡献的人
- 感谢 Cloudflare 提供优秀的 Pages 服务
- 感谢开源社区的所有贡献者

---

## 📞 联系方式

如果你有任何问题或建议，欢迎：

- 提交 [Issue](https://github.com/YOUR_USERNAME/newyear-2026/issues)
- 发起 [Pull Request](https://github.com/YOUR_USERNAME/newyear-2026/pulls)
- 查看 [DEPLOYMENT.md](DEPLOYMENT.md) 获取帮助

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star！**

Made with ❤️ by [Your Name]

</div>
