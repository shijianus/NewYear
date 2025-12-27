# 🚀 快速开始指南

## 立即启动项目

### 方法1: 一键启动（最简单）

```bash
bash start.sh
```

### 方法2: 手动启动

```bash
# 使用Python
python -m http.server 8000

# 或使用Python3
python3 -m http.server 8000

# 或使用Node.js
npx http-server -p 8000
```

## 访问地址

启动服务器后，在浏览器中访问：

- **主会场**: http://localhost:8000/index.html
- **纯享模式**: http://localhost:8000/firecracker.html

## 项目文件清单

### ✅ 已完成的文件

#### HTML页面（2个）
- `index.html` - 主会场（5.5K）
- `firecracker.html` - 纯享模式（955B）

#### JavaScript文件（12个，1,197行）

**核心模块（5个）**
- `ParticleSystem.js` (4.7K) - 粒子系统
- `FireworkEngine.js` (3.6K) - 烟花引擎
- `HistoryHighlights.js` (5.3K) - 史册摘要
- `AudioManager.js` (2.6K) - 音频管理
- `ThemeManager.js` (1.9K) - 主题管理

**工具类（3个）**
- `TimeZoneDetector.js` (1.6K) - 时区检测
- `LocationService.js` (2.3K) - 位置服务
- `CalendarCalculator.js` (917B) - 日历计算

**配置文件（2个）**
- `themes.js` (1.6K) - 主题配置
- `constants.js` (606B) - 常量定义

**控制器（2个）**
- `main.js` (6.7K) - 主控制器
- `firecracker.js` (3.6K) - 纯享模式控制器

#### 资源文件（10个）

**音频文件（7个）**
- `bgm_solar.mp3` (3.7M) - 阳历背景乐
- `bgm_lunar.mp3` (4.3M) - 阴历背景乐
- `launch.mp3` (3.7M) - 发射音效
- `explosion_small.mp3` (2.9M) - 小型爆炸
- `explosion_large.mp3` (3.7M) - 大型爆炸
- `countdown_heartbeat.mp3` (3.7M) - 倒计时心跳
- `finale_boom.mp3` (3.7M) - 0点震撼音效

**图片文件（3个）**
- `bg_solar.jpg` (101K) - 阳历背景图
- `bg_lunar.jpg` (101K) - 阴历背景图
- `favicon.png` (39K) - 网站图标

## 功能特性

### 🌍 智能时空系统
- ✅ 全球时区自动检测
- ✅ IP地理位置定位
- ✅ 双日历主题切换（阳历/阴历）
- ✅ 本地时间倒计时

### 🎆 视觉特效
- ✅ 4种烟花形状（圆形、心形、星形、打铁花）
- ✅ 史册摘要粒子图阵
- ✅ 粒子吸附技术
- ✅ 文字转粒子点阵

### 🎵 音频体验
- ✅ 7种精心设计的音效
- ✅ 主题BGM自动切换
- ✅ 音频预加载和缓存

### 📱 交互方式
- ✅ 点击发射烟花
- ✅ 多点触控支持
- ✅ 摇一摇触发大爆炸（移动端）
- ✅ 自动烟花循环

## 使用建议

### 首次使用
1. 启动服务器：`bash start.sh`
2. 访问主会场：http://localhost:8000/index.html
3. 点击"点亮星空"按钮解锁音频
4. 观察倒计时和自动烟花
5. 点击屏幕发射交互式烟花

### 纯享模式
1. 访问纯享模式：http://localhost:8000/firecracker.html
2. 享受无干扰的无限烟花
3. 尝试多点触控（移动端）
4. 尝试摇一摇触发大爆炸（移动端）

## 测试倒计时功能

### 方法1: 修改系统时间
将系统时间设置为2025年12月31日23:59:00，然后访问主会场。

### 方法2: 修改代码
在 `assets/js/utils/CalendarCalculator.js` 中修改目标日期：

```javascript
// 将这个日期改为明天的日期
const target = new Date(2025, 11, 32, 0, 0, 0); // 2026年1月1日
```

## 常见问题

### Q: 音频无法播放？
A: 确保点击了"点亮星空"按钮，浏览器需要用户交互才能解锁AudioContext。

### Q: 烟花卡顿？
A: 尝试减少粒子数量，或使用性能更好的设备。

### Q: IP定位失败？
A: 系统会自动回退到时区检测，不影响核心功能。

### Q: 模块加载失败？
A: 确保使用HTTP服务器（而不是直接打开文件），并正确设置MIME类型。

## 部署到生产环境

### 检查部署文件
```bash
bash deploy-simple.sh
```

### 上传到服务器
```bash
# 使用rsync
rsync -avz --exclude 'old' --exclude '.git' . user@server:/path/to/www/

# 或使用scp
scp -r index.html firecracker.html assets user@server:/path/to/www/
```

### 服务器配置

#### Nginx配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/www;

    # 确保正确处理.js文件
    location ~ \.js$ {
        add_type application/javascript;
    }

    # 建议使用HTTPS
    listen 443 ssl;
}
```

#### Apache配置
```apache
AddType application/javascript .js
```

## 下一步

1. **体验项目**: 运行 `bash start.sh` 启动并体验
2. **阅读文档**: 查看 `FINAL_REPORT.md` 了解完整功能
3. **部署上线**: 使用 `bash deploy-simple.sh` 检查并部署

## 技术支持

详细文档：
- `FINAL_REPORT.md` - 最终完成报告
- `README_NEW.md` - 完整项目文档
- `development.md` - 开发技术细节

---

**🎉 祝您使用愉快！🎉**
