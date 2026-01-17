# 星空湖景壁纸 - 部署说明

## 功能特性

### 已实现效果 ✓
- **闪烁星星** - 250颗随机闪烁的星星，带有淡入淡出效果
- **旋转星轨** - 3层旋转的星星轨迹，模拟星轨效果
- **流星划过** - 随机出现并划过夜空的流星
- **梦幻粒子** - 漂浮的光点粒子效果
- **湖面波纹** - 动态的水波纹动画
- **雾气效果** - 雾气层缓慢移动，营造梦幻氛围
- **视差效果** - 鼠标移动时产生视差交互效果

### 已注释功能
- 烟花效果
- 新春祝福文字
- 星历面板
- 音频播放
- 时间显示

## 部署到 Cloudflare Pages

### 方法一：通过 Git 部署（推荐）

1. 将代码推送到 GitHub/GitLab 仓库
2. 在 Cloudflare 控制台：
   - 进入 Pages
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 选择你的仓库
   - 配置构建设置：
     ```
     Framework preset: None
     Build command: (留空)
     Build output directory: /
     Root directory: /
     ```
   - 点击 "Save and Deploy"

### 方法二：直接上传

1. 在 Cloudflare 控制台：
   - 进入 Pages
   - 点击 "Create a project"
   - 选择 "Direct Upload"
   - 拖拽整个项目文件夹
   - 点击 "Deploy Site"

## 文件结构

```
NewYear/
├── index.html                  # 主页面（增强版星空湖景）
├── wallpaper/                  # 壁纸资源文件夹
│   └── output/
│       └── materials/
│           ├── 背景.png         # 背景图片
│           └── 湖面.png         # 湖面图片
├── _headers                    # Cloudflare Headers配置
└── _redirects                  # Cloudflare Redirects配置
```

## 本地测试

```bash
# 启动本地服务器
python3 -m http.server 8080

# 访问
http://localhost:8080
```

## 兼容性

- 支持所有现代浏览器（Chrome, Firefox, Safari, Edge）
- 支持移动端（iOS Safari, Chrome Mobile）
- 响应式设计，适配各种屏幕尺寸
- Canvas 2D API 兼容

## 性能优化

- 使用 requestAnimationFrame 实现流畅动画
- Canvas 分层渲染，减少重绘
- CSS 动画与 Canvas 结合
- 延迟加载和资源预加载

## 自定义配置

### 调整星星数量
在 `index.html` 中修改：
```javascript
const stars = Array.from({ length: 250 }, () => new Star());
```

### 调整流星数量
```javascript
const meteors = Array.from({ length: 3 }, () => new Meteor());
```

### 调整粒子数量
```javascript
const particles = Array.from({ length: 50 }, () => new Particle());
```

### 调整雾气透明度
```css
.fog-layer {
    opacity: 0.15; /* 0-1之间调整 */
}
```

## 已知问题

无

## 更新日志

### v2.0 (2026-01-17)
- ✓ 添加星轨效果
- ✓ 添加粒子系统
- ✓ 添加雾气层
- ✓ 优化视觉效果
- ✓ 注释其他功能，保留纯净背景
- ✓ 确保Cloudflare兼容性

### v1.0
- ✓ 基础星空湖景背景
- ✓ 星星闪烁
- ✓ 流星效果
- ✓ 湖面波纹
- ✓ 视差交互
