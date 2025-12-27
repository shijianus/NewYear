# 2026 跨时空烟花项目 - Project Epoch

一个自主可控、具备历史记录功能、适配双历文化并能感知用户时区的综合性烟花庆祝平台。

## 项目架构

项目包含四个完全独立的HTML入口：

### 1. Main (智能主会场) - index.html
- **功能**: 年度核心展示页，智能感知日期和时区
- **特性**:
  - 智能时区/IP定位
  - 双日历主题切换（阳历/阴历）
  - 倒计时与史册摘要烟花秀
  - 用户交互式烟花

### 2. Firecracker (纯享解压屋) - firecracker.html
- **功能**: 纯粹的互动娱乐，无时间压力
- **特性**:
  - 零干扰设计（无文字、无倒计时）
  - 无限循环烟花
  - 多点触控支持
  - 摇一摇触发大爆炸

### 3. Almanac (历史年鉴)
- **路径**: `/almanac/2025/`, `/almanac/2026/`
- **功能**: 静态博物馆，每年归档

### 4. Homage (初心致敬)
- **路径**: `/homage/`（原 `old/` 目录）
- **功能**: 保留2024年初代版本

## 目录结构

```
NewYear/
├── index.html                    # Main 主会场
├── firecracker.html             # Firecracker 纯享解压屋
├── assets/
│   ├── audio/                   # 音频资源（需添加）
│   │   ├── bgm_solar.mp3
│   │   ├── bgm_lunar.mp3
│   │   ├── launch.mp3
│   │   ├── explosion_small.mp3
│   │   ├── explosion_large.mp3
│   │   ├── countdown_heartbeat.mp3
│   │   └── finale_boom.mp3
│   ├── images/                  # 图片资源（需添加）
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
│       ├── main.js              # Main页面控制器
│       └── firecracker.js       # Firecracker页面控制器
├── almanac/                     # 历史归档
│   ├── 2025/
│   └── 2026/
└── homage/                      # 初代版本保留
```

## 需要准备的资源

### 音频文件 (assets/audio/)

1. **bgm_solar.mp3** - 阳历元旦背景乐
   - 风格：轻快、现代、流行/电子
   - 时长：建议2-3分钟循环

2. **bgm_lunar.mp3** - 农历春节背景乐
   - 风格：温暖、大气、包含民乐/管弦乐元素
   - 时长：建议2-3分钟循环

3. **launch.mp3** - 烟花发射音效
   - 时长：约1-2秒

4. **explosion_small.mp3** - 小型爆炸音效
   - 时长：约1-2秒

5. **explosion_large.mp3** - 大型爆炸音效
   - 时长：约2-3秒

6. **countdown_heartbeat.mp3** - 倒计时心跳音效
   - 时长：约1秒

7. **finale_boom.mp3** - 0点震撼音效
   - 时长：约3-5秒

### 图片文件 (assets/images/)

1. **bg_solar.jpg** - 阳历主题背景
   - 尺寸：1920x1080或更大
   - 内容：现代城市夜景剪影

2. **bg_lunar.jpg** - 阴历主题背景
   - 尺寸：1920x1080或更大
   - 内容：中式窗棂、灯笼纹理或红纸质感

3. **favicon.png** - 网站图标
   - 尺寸：32x32或64x64
   - 内容：烟花图标

## 核心功能

### 1. 智能时空引擎
- 基于 `Intl.DateTimeFormat` 的时区检测
- IP地理位置定位（支持多重备用方案）
- 基于用户本地时间的跨年倒计时

### 2. 双日历主题系统
- **阳历模式**: 部署日 - 2026年1月15日
- **阴历模式**: 2026年1月16日 - 3月初
- 自动切换主题色、背景、BGM和文案

### 3. 视觉与粒子系统
- 多种烟花形状：圆形、心形、五角星
- 特殊效果：打铁花、流星雨
- 史册摘要图阵：灵蛇、AI、爱心、2026

### 4. 音频系统
- 用户交互后自动解锁
- 支持音效叠加播放
- 根据主题自动切换BGM

## 部署说明

### 前置要求
1. 准备所有音频文件并放入 `assets/audio/` 目录
2. 准备背景图和favicon并放入 `assets/images/` 目录
3. 确保服务器支持ES6模块（type="module"）

### 本地测试
```bash
# 使用Python简单HTTP服务器
python -m http.server 8000

# 或使用Node.js的http-server
npx http-server
```

访问：
- Main页面: http://localhost:8000/index.html
- Firecracker页面: http://localhost:8000/firecracker.html

### 生产部署
1. 上传所有文件到服务器
2. 确保MIME类型正确配置（特别是.js模块）
3. 启用HTTPS（推荐，用于IP定位API）

## 维护指南

### 每年1月1日前
- 更新 `CalendarCalculator.js` 中的农历日期
- 更新主题文案中的年份
- 准备新的史册摘要图标（生肖等）
- 测试倒计时准确性

### 每年3月初
- 执行年度归档：将当前 `index.html` 复制到 `almanac/2026/`
- 更新主页为下一年度版本

## 浏览器兼容性

- Chrome (Desktop & Mobile) ✅
- Safari (iOS) ✅
- Firefox ✅
- Edge ✅

**必需特性**:
- Canvas API
- ES6 Modules
- AudioContext
- Intl API
- DeviceMotionEvent (可选，用于摇一摇)

## 技术栈

- **纯原生JavaScript** - 无外部依赖
- **Canvas API** - 烟花粒子渲染
- **Web Audio API** - 音频管理
- **Intl API** - 时区检测
- **Fetch API** - IP定位

## 开发历程

根据 development.md 中的6个Phase逐步实现：

1. ✅ Phase 1: 基础架构（ParticleSystem）
2. ✅ Phase 2: 时空系统（TimeZoneDetector、CalendarCalculator）
3. ✅ Phase 3: 核心功能（FireworkEngine、倒计时）
4. ✅ Phase 4: 视觉增强（HistoryHighlights）
5. ✅ Phase 5: 音频与完善（AudioManager、MainController）
6. ✅ Phase 6: 独立页面（Firecracker）

## 许可证

[根据原项目许可证]

---

**开发时间**: 2025年12月
**项目代号**: Project Epoch
**核心目标**: 构建一个自主可控的综合性烟花庆祝平台 🎆
