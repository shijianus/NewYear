# 2026 跨时空烟花项目 - 完整开发方案

## 目录
1. [项目架构设计](#1-项目架构设计)
2. [核心模块详细设计](#2-核心模块详细设计)
3. [实现步骤与优先级](#3-实现步骤与优先级)
4. [技术难点解决方案](#4-技术难点解决方案)
5. [测试与优化策略](#5-测试与优化策略)

---

## 1. 项目架构设计

### 1.1 目录结构

```
NewYear/
├── index.html                 # Main 主会场入口
├── firecracker.html          # Firecracker 纯享解压屋
├── assets/
│   ├── audio/               # 所有音频资源
│   │   ├── bgm_solar.mp3
│   │   ├── bgm_lunar.mp3
│   │   ├── launch.mp3
│   │   ├── explosion_small.mp3
│   │   ├── explosion_large.mp3
│   │   ├── countdown_heartbeat.mp3
│   │   └── finale_boom.mp3
│   ├── images/              # 背景图与图标
│   │   ├── bg_solar.jpg
│   │   ├── bg_lunar.jpg
│   │   └── favicon.png
│   ├── fonts/               # 本地字体文件
│   │   └── custom-font.woff2
│   └── js/
│       ├── core/
│       │   ├── FireworkEngine.js      # 烟花核心引擎
│       │   ├── ParticleSystem.js      # 粒子系统
│       │   ├── AudioManager.js        # 音频管理器
│       │   └── ThemeManager.js        # 主题管理器
│       ├── utils/
│       │   ├── TimeZoneDetector.js    # 时区检测工具
│       │   ├── CalendarCalculator.js  # 双历计算器
│       │   └── LocationService.js     # 位置服务
│       └── config/
│           ├── themes.js              # 主题配置
│           └── constants.js           # 常量配置
├── almanac/
│   ├── 2025/                # 2025年归档
│   └── 2026/                # 2026年归档（未来）
└── homage/                   # 初代版本保留
```

### 1.2 核心类关系图

```
TimeZoneDetector → ThemeManager → Main Controller
                    ↓
CalendarCalculator →  ↓
                    ↓
LocationService →    ↓
                    ↓
                FireworkEngine ← AudioManager
                    ↓
                ParticleSystem
```

---

## 2. 核心模块详细设计

### 2.1 时区与位置检测 (TimeZoneDetector + LocationService)

**功能需求**：
- 检测用户本地时区
- 获取用户粗略地理位置（国家/城市）
- 计算用户本地时间的跨年倒计时

**实现方式**：

#### TimeZoneDetector.js

```javascript
class TimeZoneDetector {
    constructor() {
        this.timezone = null;
        this.offset = null;
        this.init();
    }
    
    init() {
        // 获取用户时区
        // 方法1: 使用 Intl API
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // 例: "Asia/Shanghai", "America/New_York"
        
        // 方法2: 计算UTC偏移
        this.offset = new Date().getTimezoneOffset();
        // 负值表示东时区，正值表示西时区
    }
    
    getLocalNewYearTime(year) {
        // 构建目标年份的跨年时刻（本地时间）
        const targetDate = new Date(year, 0, 1, 0, 0, 0, 0);
        return targetDate;
    }
    
    getCountdownToNewYear(year) {
        const now = new Date();
        const newYear = this.getLocalNewYearTime(year);
        const diff = newYear - now;
        
        if (diff < 0) {
            // 已过新年
            return { passed: true, milliseconds: 0 };
        }
        
        return {
            passed: false,
            milliseconds: diff,
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
        };
    }
    
    formatTimeZoneName() {
        // 将时区名转换为友好显示
        // "Asia/Shanghai" -> "上海"
        // "America/New_York" -> "纽约"
        const cityMap = {
            'Asia/Shanghai': '上海',
            'America/New_York': '纽约',
            'Europe/London': '伦敦',
            'Asia/Tokyo': '东京',
            // ... 更多映射
        };
        return cityMap[this.timezone] || this.timezone.split('/')[1];
    }
}
```

#### LocationService.js

```javascript
class LocationService {
    constructor() {
        this.location = null;
    }
    
    async detectLocation() {
        // 策略1: 使用 ipapi.co (无需API key，有请求限制)
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            this.location = {
                country: data.country_name,
                city: data.city,
                countryCode: data.country_code
            };
            return this.location;
        } catch (error) {
            console.warn('IP定位失败，使用备用方案');
            return this.fallbackLocation();
        }
    }
    
    fallbackLocation() {
        // 备用方案: 根据时区猜测大致位置
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // 简化映射
        const zoneToLocation = {
            'Asia/Shanghai': { country: '中国', city: '未知城市' },
            'America/New_York': { country: 'United States', city: 'Unknown City' },
            'Europe/London': { country: 'United Kingdom', city: 'Unknown City' }
            // ... 更多映射
        };
        
        return zoneToLocation[timezone] || { country: 'Unknown', city: 'Unknown' };
    }
    
    getGreetingText() {
        if (!this.location) return '';
        
        // 根据位置生成问候语
        const { city, country } = this.location;
        
        if (city !== 'Unknown City') {
            return `Happy New Year from ${city}!`;
        } else {
            return `Happy New Year from ${country}!`;
        }
    }
}
```

**关键逻辑**：
1. 优先使用 `Intl.DateTimeFormat` 获取标准时区名称
2. 计算倒计时时，基于用户本地时间构建目标日期
3. IP定位采用容错机制，失败时回退到时区推测

---

### 2.2 双日历主题系统 (CalendarCalculator + ThemeManager)

**功能需求**：
- 自动判断当前应显示"阳历模式"还是"阴历模式"
- 根据模式加载不同的配置（颜色、背景、BGM、文案）

**实现方式**：

#### CalendarCalculator.js

```javascript
class CalendarCalculator {
    constructor() {
        // 2026年农历春节日期：2026年2月17日
        this.lunarNewYear2026 = new Date(2026, 1, 17); // 月份从0开始
        
        // 定义主题切换的临界点
        this.solarEndDate = new Date(2026, 0, 15); // 1月15日
        this.lunarEndDate = new Date(2026, 2, 5);   // 3月5日（约农历正月十五后）
    }
    
    getCurrentMode() {
        const now = new Date();
        
        // 判断逻辑：
        // 1. 部署日 - 1月15日: Solar Mode
        // 2. 1月16日 - 3月初: Lunar Mode
        // 3. 3月初之后: Solar Mode (为下一年准备)
        
        if (now <= this.solarEndDate) {
            return 'SOLAR';
        } else if (now > this.solarEndDate && now <= this.lunarEndDate) {
            return 'LUNAR';
        } else {
            return 'SOLAR'; // 默认
        }
    }
    
    getTargetNewYearDate() {
        const mode = this.getCurrentMode();
        
        if (mode === 'SOLAR') {
            // 阳历元旦: 2026年1月1日
            return new Date(2026, 0, 1, 0, 0, 0, 0);
        } else {
            // 农历春节: 2026年2月17日
            return this.lunarNewYear2026;
        }
    }
    
    shouldShowCountdown() {
        const target = this.getTargetNewYearDate();
        const now = new Date();
        return now < target;
    }
}
```

#### ThemeManager.js

```javascript
class ThemeManager {
    constructor(calendarCalculator) {
        this.calculator = calendarCalculator;
        this.currentTheme = null;
        this.themes = this.loadThemeConfigs();
    }
    
    loadThemeConfigs() {
        return {
            SOLAR: {
                name: 'solar',
                colors: {
                    primary: '#00D4FF',      // 科技蓝
                    secondary: '#9D4EDD',    // 霓虹紫
                    background: '#0A0E1A',   // 星际黑
                    text: '#FFFFFF'
                },
                background: 'assets/images/bg_solar.jpg',
                bgm: 'assets/audio/bgm_solar.mp3',
                copywriting: {
                    header: '2026，很高兴遇见你',
                    footer: '愿去年的遗憾，都是今年惊喜的铺垫。祝你永远热泪盈眶，永远向阳而生。',
                    waiting: '正在点亮星空...'
                },
                fireworkColors: [
                    'hsl(200, 100%, 60%)',  // 蓝色系
                    'hsl(280, 100%, 70%)',  // 紫色系
                    'hsl(180, 100%, 50%)',  // 青色系
                    'hsl(330, 100%, 60%)'   // 粉色系
                ]
            },
            
            LUNAR: {
                name: 'lunar',
                colors: {
                    primary: '#FF3B3B',      // 中国红
                    secondary: '#FFD700',    // 琉璃金
                    background: '#1A0B0B',   // 暖黑
                    text: '#FFF5E6'          // 暖白
                },
                background: 'assets/images/bg_lunar.jpg',
                bgm: 'assets/audio/bgm_lunar.mp3',
                copywriting: {
                    header: '金蛇纳福 · 岁岁平安',
                    footer: '灯火可亲，家人闲坐。愿新的一年，所求皆如愿，所行皆坦途。',
                    waiting: '静候佳节'
                },
                fireworkColors: [
                    'hsl(0, 100%, 50%)',    // 正红
                    'hsl(45, 100%, 50%)',   // 金黄
                    'hsl(30, 100%, 60%)',   // 橙红
                    'hsl(350, 100%, 65%)'   // 粉红
                ],
                specialEffects: ['ironFlower'] // 春节特效：打铁花
            }
        };
    }
    
    applyTheme() {
        const mode = this.calculator.getCurrentMode();
        this.currentTheme = this.themes[mode];
        
        // 应用CSS变量
        document.documentElement.style.setProperty('--primary-color', this.currentTheme.colors.primary);
        document.documentElement.style.setProperty('--secondary-color', this.currentTheme.colors.secondary);
        document.documentElement.style.setProperty('--bg-color', this.currentTheme.colors.background);
        document.documentElement.style.setProperty('--text-color', this.currentTheme.colors.text);
        
        // 设置背景图
        document.body.style.backgroundImage = `url('${this.currentTheme.background}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        
        // 更新文案
        this.updateCopywriting();
        
        return this.currentTheme;
    }
    
    updateCopywriting() {
        const copy = this.currentTheme.copywriting;
        document.getElementById('header-title').textContent = copy.header;
        document.getElementById('footer-message').textContent = copy.footer;
    }
    
    getRandomFireworkColor() {
        const colors = this.currentTheme.fireworkColors;
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
```

**关键逻辑**：
1. 日期判断使用固定的临界点（1月15日、3月5日）
2. 主题配置集中管理，便于维护
3. 使用CSS变量实现动态主题切换

---

### 2.3 烟花核心引擎 (FireworkEngine + ParticleSystem)

**功能需求**：
- 管理烟花的发射、爆炸、粒子运动
- 支持多种形状（圆形、心形、星形、文字）
- 物理模拟（重力、阻力、速度）
- 特殊效果（打铁花、流星雨）

**实现方式**：

#### ParticleSystem.js

```javascript
class Particle {
    constructor(x, y, color, velocity, gravity = 0.1, friction = 0.99) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = velocity.x; // x方向速度
        this.vy = velocity.y; // y方向速度
        this.gravity = gravity;
        this.friction = friction;
        this.alpha = 1.0;     // 透明度
        this.radius = 2;      // 半径
        this.life = 1.0;      // 生命值 (1.0 -> 0.0)
        this.decay = 0.015;   // 衰减速度
    }
    
    update() {
        // 应用速度
        this.x += this.vx;
        this.y += this.vy;
        
        // 应用重力
        this.vy += this.gravity;
        
        // 应用摩擦力
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // 生命值衰减
        this.life -= this.decay;
        this.alpha = this.life;
        
        return this.life > 0;
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
    }
    
    createExplosion(x, y, color, particleCount = 100, shape = 'circle') {
        const particles = [];
        
        switch(shape) {
            case 'circle':
                particles.push(...this.createCircleExplosion(x, y, color, particleCount));
                break;
            case 'heart':
                particles.push(...this.createHeartExplosion(x, y, color));
                break;
            case 'star':
                particles.push(...this.createStarExplosion(x, y, color));
                break;
            case 'text':
                // 文字形状由外部提供坐标点
                break;
        }
        
        this.particles.push(...particles);
    }
    
    createCircleExplosion(x, y, color, count) {
        const particles = [];
        const speed = 3 + Math.random() * 2; // 随机速度
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            
            particles.push(new Particle(x, y, color, velocity));
        }
        
        return particles;
    }
    
    createHeartExplosion(x, y, color) {
        const particles = [];
        const pointsOnHeart = this.generateHeartPoints(60); // 60个点组成心形
        
        for (let point of pointsOnHeart) {
            // 心形方程: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
            const velocity = {
                x: point.x * 0.05, // 速度基于点的位置
                y: point.y * 0.05
            };
            
            particles.push(new Particle(x, y, color, velocity));
        }
        
        return particles;
    }
    
    generateHeartPoints(count) {
        const points = [];
        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            points.push({ x: x * 2, y: y * 2 }); // 放大2倍
        }
        return points;
    }
    
    createStarExplosion(x, y, color) {
        const particles = [];
        const points = 5; // 五角星
        const outerRadius = 50;
        const innerRadius = 20;
        
        for (let i = 0; i < points * 2; i++) {
            const angle = (Math.PI * i) / points;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const velocity = {
                x: Math.cos(angle) * 3,
                y: Math.sin(angle) * 3
            };
            
            particles.push(new Particle(x, y, color, velocity));
        }
        
        return particles;
    }
    
    // 打铁花特效（春节专属）
    createIronFlowerEffect(x, y) {
        const particles = [];
        const color = 'hsl(45, 100%, 50%)'; // 金黄色
        
        for (let i = 0; i < 150; i++) {
            const angle = Math.random() * Math.PI; // 只向下半球喷射
            const speed = 2 + Math.random() * 3;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            
            // 打铁花特点: 高重力、低摩擦、长拖尾
            const particle = new Particle(x, y, color, velocity, 0.25, 0.97);
            particle.decay = 0.008; // 更慢的衰减
            particles.push(particle);
        }
        
        this.particles.push(...particles);
    }
    
    update() {
        this.particles = this.particles.filter(p => p.update());
    }
    
    render() {
        for (let particle of this.particles) {
            particle.render(this.ctx);
        }
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
```

#### FireworkEngine.js

```javascript
class Firework {
    constructor(x, y, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.color = color;
        this.speed = 5;
        this.exploded = false;
    }
    
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.exploded = true;
                return true; // 触发爆炸
            }
        }
        return false;
    }
    
    render(ctx) {
        if (!this.exploded) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 拖尾效果
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + 10);
            ctx.stroke();
        }
    }
}

class FireworkEngine {
    constructor(canvas, audioManager, themeManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.audioManager = audioManager;
        this.themeManager = themeManager;
        this.particleSystem = new ParticleSystem(canvas);
        
        this.fireworks = [];
        this.autoLaunchInterval = null;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    launchFirework(x = null, y = null) {
        // 如果未指定位置，随机生成
        x = x || Math.random() * this.canvas.width;
        const targetY = y || 100 + Math.random() * 200;
        
        const color = this.themeManager.getRandomFireworkColor();
        const firework = new Firework(x, this.canvas.height, targetY, color);
        
        this.fireworks.push(firework);
        this.audioManager.play('launch');
    }
    
    update() {
        // 更新烟花
        this.fireworks = this.fireworks.filter(fw => {
            const shouldExplode = fw.update();
            if (shouldExplode) {
                this.explode(fw);
                return false;
            }
            return !fw.exploded;
        });
        
        // 更新粒子系统
        this.particleSystem.update();
    }
    
    explode(firework) {
        const shapes = ['circle', 'circle', 'circle', 'heart', 'star']; // 圆形概率更高
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        this.particleSystem.createExplosion(
            firework.x, 
            firework.y, 
            firework.color, 
            100, 
            shape
        );
        
        this.audioManager.play(Math.random() > 0.5 ? 'explosion_small' : 'explosion_large');
    }
    
    render() {
        // 使用渐变擦除创造拖尾效果
        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 渲染烟花
        for (let fw of this.fireworks) {
            fw.render(this.ctx);
        }
        
        // 渲染粒子
        this.particleSystem.render();
    }
    
    startAutoLaunch(interval = 1000) {
        this.autoLaunchInterval = setInterval(() => {
            this.launchFirework();
        }, interval);
    }
    
    stopAutoLaunch() {
        if (this.autoLaunchInterval) {
            clearInterval(this.autoLaunchInterval);
        }
    }
    
    animate() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}
```

**关键逻辑**：
1. Firework类负责上升阶段，到达目标高度后触发爆炸
2. ParticleSystem管理所有粒子的生命周期
3. 使用三角函数生成特殊形状（心形、星形）
4. 打铁花通过调整物理参数实现（高重力、低摩擦）

---

### 2.4 史册摘要图阵系统

**功能需求**：
- 在0点整触发特殊演出
- 按顺序展示：灵蛇图案 → AI文字 → 爱心 → 2026数字
- 使用粒子吸附技术绘制图案

**实现方式**：

```javascript
class HistoryHighlights {
    constructor(particleSystem, canvas) {
        this.particleSystem = particleSystem;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sequence = ['snake', 'ai', 'heart', '2026'];
        this.currentIndex = 0;
        this.isPlaying = false;
    }
    
    async start() {
        this.isPlaying = true;
        
        for (let iconType of this.sequence) {
            await this.displayIcon(iconType);
            await this.wait(3000); // 每个图案停留3秒
        }
        
        this.isPlaying = false;
    }
    
    async displayIcon(type) {
        const points = this.generateIconPoints(type);
        const color = this.getColorForIcon(type);
        
        // 生成吸附粒子
        await this.createAttractorParticles(points, color);
    }
    
    generateIconPoints(type) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const points = [];
        
        switch(type) {
            case 'snake':
                // 简化的蛇形贝塞尔曲线
                points.push(...this.generateSnakePath(centerX, centerY));
                break;
                
            case 'ai':
                // 渲染"AI"文字到离屏canvas，提取像素点
                points.push(...this.generateTextPoints('AI', centerX, centerY));
                break;
                
            case 'heart':
                // 心形方程
                points.push(...this.generateHeartPoints(centerX, centerY));
                break;
                
            case '2026':
                // 渲染"2026"到离屏canvas
                points.push(...this.generateTextPoints('2026', centerX, centerY));
                break;
        }
        
        return points;
    }
    
    generateTextPoints(text, centerX, centerY) {
        // 创建离屏canvas
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 600;
        offCanvas.height = 300;
        const offCtx = offCanvas.getContext('2d');
        
        // 绘制文字
        offCtx.fillStyle = 'white';
        offCtx.font = 'bold 150px Arial';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(text, 300, 150);
        
        // 提取像素
        const imageData = offCtx.getImageData(0, 0, 600, 300);
        const points = [];
        const sampling = 4; // 采样间隔
        
        for (let y = 0; y < 300; y += sampling) {
            for (let x = 0; x < 600; x += sampling) {
                const index = (y * 600 + x) * 4;
                const alpha = imageData.data[index + 3];
                
                if (alpha > 128) { // 不透明像素
                    points.push({
                        x: centerX + (x - 300),
                        y: centerY + (y - 150)
                    });
                }
            }
        }
        
        return points;
    }
    
    generateHeartPoints(centerX, centerY) {
        const points = [];
        const scale = 8;
        
        for (let i = 0; i < 200; i++) {
            const t = (i / 200) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            points.push({
                x: centerX + x * scale,
                y: centerY + y * scale
            });
        }
        
        return points;
    }
    
    generateSnakePath(centerX, centerY) {
        // 使用简单的正弦波模拟蛇形
        const points = [];
        const segments = 150;
        const amplitude = 80;
        const wavelength = 100;
        
        for (let i = 0; i < segments; i++) {
            const x = centerX - 300 + (i * 600 / segments);
            const y = centerY + Math.sin((i / segments) * Math.PI * 4) * amplitude;
            points.push({ x, y });
        }
        
        return points;
    }
    
    async createAttractorParticles(targetPoints, color) {
        // 创建吸附器粒子
        // 粒子从随机位置缓慢移动到目标点
        
        const attractorParticles = targetPoints.map(point => ({
            current: {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height
            },
            target: point,
            color: color
        }));
        
        // 动画吸附过程 (1秒内完成)
        const duration = 1000;
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // 使用缓动函数
                const eased = this.easeOutCubic(progress);
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                for (let ap of attractorParticles) {
                    ap.current.x += (ap.target.x - ap.current.x) * 0.1;
                    ap.current.y += (ap.target.y - ap.current.y) * 0.1;
                    
                    this.ctx.fillStyle = ap.color;
                    this.ctx.beginPath();
                    this.ctx.arc(ap.current.x, ap.current.y, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    getColorForIcon(type) {
        const colorMap = {
            'snake': 'hsl(45, 100%, 50%)',  // 金色
            'ai': 'hsl(260, 100%, 70%)',    // 蓝紫色
            'heart': 'hsl(0, 100%, 60%)',   // 红色
            '2026': 'hsl(50, 100%, 50%)'    // 金黄色
        };
        return colorMap[type];
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```

---

### 2.5 音频管理系统 (AudioManager)

**功能需求**：
- 管理所有音频资源
- 处理用户交互解锁
- 支持音效叠加播放

**实现方式**：

```javascript
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.bgmNode = null;
        this.unlocked = false;
    }
    
    async init() {
        // 预加载所有音频
        const audioFiles = {
            bgm_solar: 'assets/audio/bgm_solar.mp3',
            bgm_lunar: 'assets/audio/bgm_lunar.mp3',
            launch: 'assets/audio/launch.mp3',
            explosion_small: 'assets/audio/explosion_small.mp3',
            explosion_large: 'assets/audio/explosion_large.mp3',
            countdown_heartbeat: 'assets/audio/countdown_heartbeat.mp3',
            finale_boom: 'assets/audio/finale_boom.mp3'
        };
        
        for (let [key, path] of Object.entries(audioFiles)) {
            await this.loadSound(key, path);
        }
    }
    
    async loadSound(key, path) {
        try {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            this.sounds[key] = arrayBuffer;
        } catch (error) {
            console.error(`Failed to load sound: ${key}`, error);
        }
    }
    
    unlock(userInteraction = true) {
        if (this.unlocked) return;
        
        // 用户交互后解锁AudioContext
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.unlocked = true;
        
        console.log('Audio unlocked');
    }
    
    play(soundKey, volume = 1.0, loop = false) {
        if (!this.unlocked || !this.audioContext) return;
        if (!this.sounds[soundKey]) return;
        
        // 解码并播放
        this.audioContext.decodeAudioData(
            this.sounds[soundKey].slice(0), // 复制buffer
            (buffer) => {
                const source = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();
                
                source.buffer = buffer;
                source.loop = loop;
                gainNode.gain.value = volume;
                
                source.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                source.start(0);
                
                if (soundKey.includes('bgm')) {
                    this.bgmNode = source; // 保存BGM引用以便控制
                }
            }
        );
    }
    
    playBGM(themeMode) {
        const bgmKey = themeMode === 'SOLAR' ? 'bgm_solar' : 'bgm_lunar';
        this.play(bgmKey, 0.3, true); // 循环播放，音量30%
    }
    
    stopBGM() {
        if (this.bgmNode) {
            this.bgmNode.stop();
            this.bgmNode = null;
        }
    }
    
    playRandomLaunch() {
        // 随机音调变化
        const pitchVariation = 0.8 + Math.random() * 0.4; // 0.8 - 1.2
        // 注：音调变化需要使用playbackRate，此处简化
        this.play('launch', 0.5);
    }
}
```

---

### 2.6 主控制器 (Main Controller)

**功能需求**：
- 协调所有模块
- 处理用户交互
- 管理页面状态

**实现方式**：

#### main.js (用于 index.html)

```javascript
class MainController {
    constructor() {
        this.canvas = document.getElementById('firework-canvas');
        
        // 初始化各模块
        this.timeDetector = new TimeZoneDetector();
        this.locationService = new LocationService();
        this.calendarCalc = new CalendarCalculator();
        this.themeManager = new ThemeManager(this.calendarCalc);
        this.audioManager = new AudioManager();
        this.fireworkEngine = null;
        this.historyHighlights = null;
        
        this.countdownInterval = null;
        this.started = false;
    }
    
    async init() {
        // 1. 加载音频
        await this.audioManager.init();
        
        // 2. 检测位置
        await this.locationService.detectLocation();
        this.displayGreeting();
        
        // 3. 应用主题
        this.themeManager.applyTheme();
        
        // 4. 初始化烟花引擎
        this.fireworkEngine = new FireworkEngine(
            this.canvas, 
            this.audioManager, 
            this.themeManager
        );
        
        this.historyHighlights = new HistoryHighlights(
            this.fireworkEngine.particleSystem,
            this.canvas
        );
        
        // 5. 显示引导页
        this.showWelcomePage();
    }
    
    showWelcomePage() {
        const welcomeDiv = document.getElementById('welcome-screen');
        welcomeDiv.style.display = 'flex';
        
        const startBtn = document.getElementById('start-button');
        startBtn.addEventListener('click', () => {
            this.start();
            welcomeDiv.style.display = 'none';
        });
    }
    
    start() {
        // 解锁音频
        this.audioManager.unlock();
        this.audioManager.playBGM(this.calendarCalc.getCurrentMode());
        
        // 开始动画
        this.fireworkEngine.animate();
        
        // 启动倒计时
        this.startCountdown();
        
        // 添加点击事件
        this.canvas.addEventListener('click', (e) => {
            this.fireworkEngine.launchFirework(e.clientX, e.clientY);
        });
        
        this.started = true;
    }
    
    startCountdown() {
        this.updateCountdownDisplay();
        
        this.countdownInterval = setInterval(() => {
            const countdown = this.timeDetector.getCountdownToNewYear(2026);
            
            if (countdown.passed) {
                // 已过新年，停止倒计时
                clearInterval(this.countdownInterval);
                document.getElementById('countdown-display').textContent = '新年快乐！';
                return;
            }
            
            // 检查是否进入最后60秒
            if (countdown.milliseconds <= 60000 && countdown.milliseconds > 59000) {
                this.startParticleCountdown();
            }
            
            // 检查是否到0点整
            if (countdown.seconds === 0 && countdown.minutes === 0 && countdown.hours === 0) {
                this.triggerNewYearCelebration();
            }
            
            this.updateCountdownDisplay();
        }, 1000);
    }
    
    updateCountdownDisplay() {
        const countdown = this.timeDetector.getCountdownToNewYear(2026);
        
        if (!countdown.passed) {
            const display = `${countdown.days}天 ${countdown.hours}时 ${countdown.minutes}分 ${countdown.seconds}秒`;
            document.getElementById('countdown-display').textContent = display;
        }
    }
    
    startParticleCountdown() {
        // 隐藏HTML倒计时
        document.getElementById('countdown-display').style.display = 'none';
        
        // 启动粒子倒计时
        let seconds = 60;
        
        const particleCountdownInterval = setInterval(() => {
            if (seconds <= 0) {
                clearInterval(particleCountdownInterval);
                return;
            }
            
            // 播放心跳音效
            this.audioManager.play('countdown_heartbeat');
            
            // 在屏幕中央用粒子绘制数字
            this.drawParticleNumber(seconds);
            
            seconds--;
        }, 1000);
    }
    
    drawParticleNumber(number) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 使用离屏canvas绘制数字
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 200;
        offCanvas.height = 200;
        const offCtx = offCanvas.getContext('2d');
        
        offCtx.fillStyle = 'white';
        offCtx.font = 'bold 120px Arial';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(number.toString(), 100, 100);
        
        // 提取像素并创建粒子
        const imageData = offCtx.getImageData(0, 0, 200, 200);
        const points = [];
        
        for (let y = 0; y < 200; y += 3) {
            for (let x = 0; x < 200; x += 3) {
                const index = (y * 200 + x) * 4;
                if (imageData.data[index + 3] > 128) {
                    points.push({
                        x: centerX + (x - 100),
                        y: centerY + (y - 100)
                    });
                }
            }
        }
        
        // 创建粒子
        const color = this.themeManager.getRandomFireworkColor();
        for (let point of points) {
            const velocity = { x: 0, y: 0 };
            const particle = new Particle(point.x, point.y, color, velocity, 0, 1);
            particle.decay = 0.02;
            this.fireworkEngine.particleSystem.particles.push(particle);
        }
    }
    
    async triggerNewYearCelebration() {
        // 1. 播放震撼音效
        this.audioManager.play('finale_boom', 1.0);
        
        // 2. 大规模烟花齐放
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.fireworkEngine.launchFirework();
            }, i * 100);
        }
        
        // 3. 播放史册摘要图阵
        setTimeout(() => {
            this.historyHighlights.start();
        }, 3000);
        
        // 4. 继续自动烟花
        this.fireworkEngine.startAutoLaunch(500);
    }
    
    displayGreeting() {
        const greeting = this.locationService.getGreetingText();
        document.getElementById('location-greeting').textContent = greeting;
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    const controller = new MainController();
    controller.init();
});
```

---

## 3. 实现步骤与优先级

### Phase 1: 基础架构 (Week 1)
1. 搭建目录结构
2. 创建基础HTML模板 (index.html, firecracker.html)
3. 实现ParticleSystem类和基础粒子物理
4. 测试简单的圆形烟花

### Phase 2: 时空系统 (Week 2)
1. 实现TimeZoneDetector
2. 实现CalendarCalculator
3. 实现ThemeManager
4. 测试主题切换逻辑

### Phase 3: 核心功能 (Week 3)
1. 完善FireworkEngine
2. 实现多种形状烟花
3. 实现倒计时系统
4. 添加用户交互（点击、触摸）

### Phase 4: 视觉增强 (Week 4)
1. 实现HistoryHighlights
2. 实现打铁花特效
3. 优化粒子渲染性能
4. 添加背景图和CSS样式

### Phase 5: 音频与完善 (Week 5)
1. 实现AudioManager
2. 集成所有音频文件
3. 调试音频同步
4. 添加文案和最终打磨

### Phase 6: 独立页面 (Week 6)
1. 完成Firecracker页面（零干扰模式）
2. 添加摇一摇功能
3. 测试多点触控
4. 准备归档目录结构

---

## 4. 技术难点解决方案

### 4.1 粒子性能优化

**问题**: 大量粒子同时渲染可能导致卡顿

**解决方案**:
```javascript
// 使用对象池避免频繁创建/销毁
class ParticlePool {
    constructor(size = 1000) {
        this.pool = [];
        this.activeParticles = [];
        
        for (let i = 0; i < size; i++) {
            this.pool.push(new Particle(0, 0, '#fff', {x:0, y:0}));
        }
    }
    
    acquire(x, y, color, velocity) {
        let particle;
        if (this.pool.length > 0) {
            particle = this.pool.pop();
            particle.reset(x, y, color, velocity);
        } else {
            particle = new Particle(x, y, color, velocity);
        }
        this.activeParticles.push(particle);
        return particle;
    }
    
    release(particle) {
        this.pool.push(particle);
    }
    
    update() {
        this.activeParticles = this.activeParticles.filter(p => {
            if (p.update()) {
                return true;
            } else {
                this.release(p);
                return false;
            }
        });
    }
}

// 在Particle类中添加reset方法
Particle.prototype.reset = function(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = velocity.x;
    this.vy = velocity.y;
    this.alpha = 1.0;
    this.life = 1.0;
}
```

### 4.2 移动端触控优化

**问题**: 需要支持多点触控和摇一摇

**解决方案**:
```javascript
class TouchController {
    constructor(canvas, fireworkEngine) {
        this.canvas = canvas;
        this.engine = fireworkEngine;
        this.initTouchEvents();
        this.initShakeDetection();
    }
    
    initTouchEvents() {
        // 多点触控支持
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            for (let touch of e.touches) {
                const rect = this.canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                this.engine.launchFirework(x, y);
            }
        }, { passive: false });
    }
    
    initShakeDetection() {
        if (!window.DeviceMotionEvent) return;
        
        let lastX = 0, lastY = 0, lastZ = 0;
        let lastTime = Date.now();
        
        window.addEventListener('devicemotion', (e) => {
            const acc = e.accelerationIncludingGravity;
            if (!acc) return;
            
            const currentTime = Date.now();
            const timeDiff = currentTime - lastTime;
            
            if (timeDiff > 100) {
                const deltaX = Math.abs(acc.x - lastX);
                const deltaY = Math.abs(acc.y - lastY);
                const deltaZ = Math.abs(acc.z - lastZ);
                
                // 检测剧烈晃动
                if (deltaX + deltaY + deltaZ > 30) {
                    this.triggerShakeEffect();
                }
                
                lastX = acc.x;
                lastY = acc.y;
                lastZ = acc.z;
                lastTime = currentTime;
            }
        });
    }
    
    triggerShakeEffect() {
        // 触发大规模烟花爆炸
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.engine.launchFirework();
            }, i * 50);
        }
        
        // 触发震动反馈
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }
}
```

### 4.3 IP定位的容错机制

**问题**: 免费IP定位API可能失败或被限流

**解决方案**:
```javascript
class LocationService {
    constructor() {
        this.location = null;
        this.apiEndpoints = [
            'https://ipapi.co/json/',
            'https://ip-api.com/json/',
            // 添加更多备用API
        ];
        this.currentApiIndex = 0;
    }
    
    async detectLocation() {
        // 尝试所有API直到成功
        for (let i = 0; i < this.apiEndpoints.length; i++) {
            try {
                const response = await fetch(this.apiEndpoints[i], {
                    timeout: 3000 // 3秒超时
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.location = this.normalizeLocationData(data, i);
                    return this.location;
                }
            } catch (error) {
                console.warn(`API ${i} failed, trying next...`);
                continue;
            }
        }
        
        // 所有API都失败，使用备用方案
        return this.fallbackLocation();
    }
    
    normalizeLocationData(data, apiIndex) {
        // 不同API返回的字段名可能不同，统一格式
        switch(apiIndex) {
            case 0: // ipapi.co
                return {
                    country: data.country_name,
                    city: data.city,
                    countryCode: data.country_code
                };
            case 1: // ip-api.com
                return {
                    country: data.country,
                    city: data.city,
                    countryCode: data.countryCode
                };
            default:
                return data;
        }
    }
}
```

### 4.4 音频自动播放限制

**问题**: 浏览器限制自动播放音频

**解决方案**:
```javascript
class AudioManager {
    // ... 前面的代码
    
    async attemptAutoPlay() {
        // 尝试静音自动播放，引导用户交互
        try {
            const testAudio = new Audio();
            testAudio.muted = true;
            await testAudio.play();
            testAudio.pause();
            
            // 自动播放被允许
            this.autoPlayAllowed = true;
        } catch (error) {
            // 需要用户交互
            this.autoPlayAllowed = false;
            this.showAudioPrompt();
        }
    }
    
    showAudioPrompt() {
        // 显示"点击以启用音效"提示
        const prompt = document.createElement('div');
        prompt.id = 'audio-prompt';
        prompt.innerHTML = `
            <div class="audio-notice">
                <p>点击屏幕任意位置启用音效</p>
            </div>
        `;
        document.body.appendChild(prompt);
        
        // 等待用户点击
        document.addEventListener('click', () => {
            this.unlock();
            prompt.remove();
        }, { once: true });
    }
}
```

### 4.5 农历日期计算

**问题**: 需要准确的农历转换

**解决方案**:
```javascript
class LunarCalculator {
    constructor() {
        // 预定义未来几年的农历春节日期
        this.lunarNewYearDates = {
            2025: new Date(2025, 0, 29),  // 2025年1月29日
            2026: new Date(2026, 1, 17),  // 2026年2月17日
            2027: new Date(2027, 1, 6),   // 2027年2月6日
            2028: new Date(2028, 0, 26),  // 2028年1月26日
            2029: new Date(2029, 1, 13),  // 2029年2月13日
            2030: new Date(2030, 1, 3)    // 2030年2月3日
        };
    }
    
    getLunarNewYear(year) {
        return this.lunarNewYearDates[year] || null;
    }
    
    getDaysUntilLunarNewYear(year) {
        const lunarDate = this.getLunarNewYear(year);
        if (!lunarDate) return null;
        
        const now = new Date();
        const diff = lunarDate - now;
        
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}
```

---

## 5. 测试与优化策略

### 5.1 性能测试清单

**帧率监控**:
```javascript
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
    }
    
    update() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // 如果FPS低于30，降低粒子数量
            if (this.fps < 30) {
                this.suggestOptimization();
            }
        }
    }
    
    suggestOptimization() {
        console.warn(`Low FPS detected: ${this.fps}. Reducing particle count...`);
        // 触发优化逻辑
    }
    
    displayFPS() {
        const display = document.getElementById('fps-counter');
        if (display) {
            display.textContent = `FPS: ${this.fps}`;
        }
    }
}
```

### 5.2 浏览器兼容性测试

**必测项目**:
- Chrome (Desktop & Mobile)
- Safari (iOS)
- Firefox
- Edge

**关键功能测试**:
```javascript
class CompatibilityChecker {
    static check() {
        const report = {
            canvas: !!document.createElement('canvas').getContext,
            audioContext: !!(window.AudioContext || window.webkitAudioContext),
            deviceMotion: !!window.DeviceMotionEvent,
            touchEvents: 'ontouchstart' in window,
            intlAPI: !!Intl.DateTimeFormat
        };
        
        console.log('Compatibility Report:', report);
        
        // 如果核心功能不支持，显示警告
        if (!report.canvas) {
            alert('您的浏览器不支持Canvas，无法显示烟花效果');
        }
        
        return report;
    }
}

// 在页面加载时检查
window.addEventListener('DOMContentLoaded', () => {
    CompatibilityChecker.check();
});
```

### 5.3 内存泄漏检测

**检查点**:
1. 确保事件监听器正确移除
2. Canvas上下文不重复创建
3. 音频节点正确断开

```javascript
class MemoryManager {
    constructor() {
        this.eventListeners = [];
    }
    
    addEventListener(target, event, handler) {
        target.addEventListener(event, handler);
        this.eventListeners.push({ target, event, handler });
    }
    
    cleanup() {
        // 清理所有事件监听器
        for (let listener of this.eventListeners) {
            listener.target.removeEventListener(listener.event, listener.handler);
        }
        this.eventListeners = [];
    }
}
```

### 5.4 移动端优化

**触摸延迟优化**:
```css
/* 添加到CSS */
* {
    touch-action: manipulation; /* 禁用双击缩放 */
}

canvas {
    -webkit-tap-highlight-color: transparent; /* 移除点击高亮 */
}
```

**视口配置**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

## 6. Firecracker页面实现（纯享模式）

### 6.1 核心差异

**与Main页面的区别**:
- 无任何文字UI
- 无倒计时
- 烟花自动循环
- 支持多点触控
- 支持摇一摇

### 6.2 实现代码

```javascript
// firecracker.js
class FirecrackerController {
    constructor() {
        this.canvas = document.getElementById('firework-canvas');
        this.audioManager = new AudioManager();
        
        // 简化版主题（固定黑色背景）
        this.theme = {
            colors: ['hsl(0,100%,50%)', 'hsl(120,100%,50%)', 'hsl(240,100%,50%)']
        };
        
        this.fireworkEngine = null;
        this.touchController = null;
    }
    
    async init() {
        await this.audioManager.init();
        
        // 初始化引擎
        this.fireworkEngine = new FireworkEngine(
            this.canvas,
            this.audioManager,
            { getRandomFireworkColor: () => this.getRandomColor() }
        );
        
        // 触控控制器
        this.touchController = new TouchController(
            this.canvas,
            this.fireworkEngine
        );
        
        // 立即开始（无引导页）
        this.start();
    }
    
    start() {
        this.audioManager.unlock();
        this.fireworkEngine.animate();
        
        // 无限循环自动发射
        this.fireworkEngine.startAutoLaunch(800); // 每0.8秒一次
    }
    
    getRandomColor() {
        return this.theme.colors[Math.floor(Math.random() * this.theme.colors.length)];
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const controller = new FirecrackerController();
    controller.init();
});
```

---

## 7. 归档流程（Almanac）

### 7.1 手动归档步骤

每年春节结束后（约3月初），执行以下步骤：

```bash
# 1. 创建新年份目录
mkdir almanac/2026

# 2. 复制Main页面完整内容
cp index.html almanac/2026/
cp -r assets almanac/2026/

# 3. 修改index.html中的路径引用
# 将所有 'assets/' 改为 '../assets/'
# 或保留独立副本

# 4. 更新主页index.html为2027年版本
# 修改CalendarCalculator中的日期配置
# 更新主题文案
```

### 7.2 自动化脚本（可选）

```javascript
// archive.js (Node.js脚本)
const fs = require('fs-extra');
const path = require('path');

async function archiveYear(year) {
    const targetDir = `almanac/${year}`;
    
    // 创建目录
    await fs.ensureDir(targetDir);
    
    // 复制文件
    await fs.copy('index.html', path.join(targetDir, 'index.html'));
    await fs.copy('assets', path.join(targetDir, 'assets'));
    
    console.log(`Year ${year} archived successfully!`);
}

// 使用: node archive.js 2026
const year = process.argv[2];
archiveYear(year);
```

---

## 8. 部署与维护

### 8.1 部署检查清单

- [ ] 所有音频文件已下载到本地
- [ ] 所有图片资源已优化并本地化
- [ ] 字体文件已本地化（如使用自定义字体）
- [ ] 移除所有外部CDN引用
- [ ] 测试所有四个入口页面
- [ ] 检查移动端兼容性
- [ ] 验证时区检测功能
- [ ] 测试音频解锁流程

### 8.2 年度维护任务

**每年1月1日前**:
- 更新CalendarCalculator中的农历日期
- 更新主题文案中的年份
- 准备新的史册摘要图标（生肖等）
- 测试倒计时准确性

**每年3月初**:
- 执行年度归档
- 将当年内容移入Almanac
- 准备下一年度的Main页面

---

## 9. 关键配置文件示例

### 9.1 constants.js

```javascript
// assets/js/config/constants.js
export const CONSTANTS = {
    PARTICLE_COUNT: {
        SMALL: 50,
        MEDIUM: 100,
        LARGE: 200
    },
    
    FIREWORK_INTERVAL: {
        SLOW: 1500,
        NORMAL: 1000,
        FAST: 500
    },
    
    PHYSICS: {
        GRAVITY: 0.1,
        FRICTION: 0.99,
        IRON_FLOWER_GRAVITY: 0.25,
        IRON_FLOWER_FRICTION: 0.97
    },
    
    AUDIO: {
        BGM_VOLUME: 0.3,
        SFX_VOLUME: 0.5
    },
    
    DATES: {
        LUNAR_NEW_YEAR_2026: '2026-02-17',
        SOLAR_LUNAR_CUTOFF: '2026-01-15',
        LUNAR_END: '2026-03-05'
    }
};
```

### 9.2 themes.js

```javascript
// assets/js/config/themes.js
export const THEMES = {
    SOLAR: {
        // ... 完整的Solar配置
    },
    LUNAR: {
        // ... 完整的Lunar配置
    }
};
```

---

## 10. 常见问题解决

### Q1: 烟花在移动端卡顿？
**A**: 降低粒子数量，使用对象池，减少绘制调用

### Q2: 音频无法播放？
**A**: 确保用户交互后才初始化AudioContext，添加"解锁音频"提示

### Q3: 时区检测不准确？
**A**: 使用 `Intl.DateTimeFormat().resolvedOptions().timeZone`，这是最可靠的方法

### Q4: IP定位失败？
**A**: 实现多重备用方案，最终回退到时区猜测

### Q5: 粒子形状不规则？
**A**: 提高采样率，优化形状生成算法，使用更精细的贝塞尔曲线

---

## 总结

本开发方案涵盖了项目的全部核心功能模块，每个模块都提供了：
- 清晰的功能定位
- 详细的实现逻辑
- 可执行的伪代码示例
- 技术难点的解决方案

**开发建议**:
1. 按Phase顺序逐步实现，确保每个阶段都经过充分测试
2. 优先保证核心功能（烟花引擎、时空系统）的稳定性
3. 移动端优化应作为重点，确保流畅体验
4. 保持代码模块化，便于维护和扩展

**预估工作量**: 6周全职开发（如上Phase划分）

祝开发顺利！🎆
