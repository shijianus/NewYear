(function() {
    'use strict';

    const SOLAR_TARGET = new Date(2026, 0, 1, 0, 0, 0, 0);
    const CITY_MAP = {
        'Asia/Shanghai': '上海 · 中国',
        'Asia/Tokyo': '东京 · 日本',
        'Asia/Seoul': '首尔 · 韩国',
        'Asia/Singapore': '新加坡 · 狮城',
        'Europe/London': '伦敦 · 英国',
        'Europe/Paris': '巴黎 · 法国',
        'America/New_York': '纽约 · 美国',
        'America/Los_Angeles': '洛杉矶 · 美国',
        'Australia/Sydney': '悉尼 · 澳大利亚'
    };

    class TimeHelper {
        constructor() {
            this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            this.offsetMinutes = new Date().getTimezoneOffset();
        }

        formatOffset() {
            const totalMinutes = -this.offsetMinutes;
            const sign = totalMinutes >= 0 ? '+' : '-';
            const absMinutes = Math.abs(totalMinutes);
            const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
            const minutes = String(absMinutes % 60).padStart(2, '0');
            return `GMT${sign}${hours}:${minutes}`;
        }

        getLocationLabel() {
            return CITY_MAP[this.timezone] || this.timezone || '本地时区';
        }

        getMidnightLabel() {
            return SOLAR_TARGET.toLocaleString([], {
                hour12: false,
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    class MeteorField {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.meteors = [];
            this.starBursts = [];
            this.starPulseCooldown = 0;
            this.running = false;
            this.resize();
        }

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        start() {
            if (this.running) return;
            this.running = true;
            const loop = () => {
                this.update();
                this.render();
                if (this.running) requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }

        stop() {
            this.running = false;
        }

        update() {
            if (Math.random() < 0.02) {
                this.meteors.push(this.createMeteor());
            }
            this.meteors = this.meteors.filter(meteor => meteor.opacity > 0);
            this.meteors.forEach(meteor => {
                meteor.x += meteor.vx;
                meteor.y += meteor.vy;
                meteor.opacity -= 0.003;
            });
            this.updateStarBursts();
        }

        createMeteor() {
            const angle = Math.random() * 0.3 + 0.35;
            const speed = 8 + Math.random() * 3;
            return {
                x: Math.random() * this.canvas.width * 0.3,
                y: -Math.random() * 150,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                length: 80 + Math.random() * 40,
                opacity: 0.5 + Math.random() * 0.4
            };
        }

        spawnStarPulse() {
            const radius = Math.min(this.canvas.width, this.canvas.height) * 0.12;
            const starCount = 18 + Math.floor(Math.random() * 16);
            const centerX = Math.random() * this.canvas.width;
            const centerY = Math.random() * this.canvas.height * 0.5;
            const stars = [];

            for (let i = 0; i < starCount; i++) {
                const angle = (Math.PI * 2 * i) / starCount;
                const dist = radius * (0.2 + Math.random() * 0.8);
                stars.push({
                    x: centerX + Math.cos(angle) * dist,
                    y: centerY + Math.sin(angle) * dist * 0.6,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    alpha: 0.5 + Math.random() * 0.4,
                    size: 1 + Math.random() * 1.2
                });
            }

            this.starBursts.push({
                stars,
                life: 220,
                maxLife: 220,
                opacity: 1
            });
        }

        updateStarBursts() {
            if (this.starPulseCooldown <= 0 && Math.random() < 0.03) {
                this.spawnStarPulse();
                this.starPulseCooldown = 240;
            } else {
                this.starPulseCooldown = Math.max(0, this.starPulseCooldown - 1);
            }

            this.starBursts = this.starBursts.filter(burst => burst.life > 0);
            this.starBursts.forEach(burst => {
                burst.life -= 2;
                const ratio = burst.life / burst.maxLife;
                burst.opacity = Math.max(0, Math.sin(ratio * Math.PI));
                burst.stars.forEach(star => {
                    star.x += star.vx;
                    star.y += star.vy;
                    star.vx *= 0.98;
                    star.vy *= 0.98;
                });
            });
        }

        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.meteors.forEach(meteor => {
                const gradient = this.ctx.createLinearGradient(
                    meteor.x,
                    meteor.y,
                    meteor.x - meteor.length,
                    meteor.y - meteor.length * 0.25
                );
                gradient.addColorStop(0, `rgba(255,255,255,${meteor.opacity})`);
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(meteor.x, meteor.y);
                this.ctx.lineTo(meteor.x - meteor.length, meteor.y - meteor.length * 0.25);
                this.ctx.stroke();
            });

            this.starBursts.forEach(burst => {
                burst.stars.forEach(star => {
                    this.ctx.save();
                    this.ctx.globalAlpha = burst.opacity * star.alpha;
                    this.ctx.fillStyle = '#b6d4ff';
                    this.ctx.beginPath();
                    this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                });
            });
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.alpha = 1;
            this.decay = 0.008;
            this.radius = 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            return this.alpha > 0;
        }
    }

    class FeatureCanvas {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.animationRunning = false;
            this.numberTimer = null;
            this.historyPlaying = false;
            // Auto shapes cycle through zodiac and tech glyphs for the 2026 story line.
            this.autoShapes = ['snake', 'ai', 'heart', '2026', 'horse', 'constellation'];
            this.autoShapeIndex = 0;
            this.shapeScaleMap = {
                snake: 1.3,
                ai: 1.25,
                heart: 1.25,
                2026: 1.4,
                horse: 1.25,
                constellation: 1.35
            };
            this.particleSizeRange = { min: 1.2, max: 1.9 };
            this.resize();
        }

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        startLoop() {
            if (this.animationRunning) return;
            this.animationRunning = true;
            const loop = () => {
                this.update();
                this.render();
                if (this.animationRunning) requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }

        stopLoop() {
            this.animationRunning = false;
        }

        update() {
            this.particles = this.particles.filter(p => p.update());
        }

        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(particle => {
                this.ctx.save();
                this.ctx.globalAlpha = particle.alpha;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        }

        drawNumber(num) {
            this.spawnFromText(num.toString(), '#7dd3ff');
        }

        spawnFromText(text, color) {
            const offCanvas = document.createElement('canvas');
            const width = 480;
            const height = 220;
            offCanvas.width = width;
            offCanvas.height = height;
            const offCtx = offCanvas.getContext('2d');
            offCtx.clearRect(0, 0, width, height);
            offCtx.fillStyle = '#fff';
            offCtx.font = 'bold 160px "Russo One", sans-serif';
            offCtx.textAlign = 'center';
            offCtx.textBaseline = 'middle';
            offCtx.fillText(text, width / 2, height / 2);

            const imageData = offCtx.getImageData(0, 0, width, height);
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const spacing = 4;
            this.particles.length = 0;

            for (let y = 0; y < height; y += spacing) {
                for (let x = 0; x < width; x += spacing) {
                    const index = (y * width + x) * 4 + 3;
                    if (imageData.data[index] > 128) {
                        const particle = new Particle(
                            centerX + (x - width / 2),
                            centerY + (y - height / 2),
                            color
                        );
                        particle.radius = 2.4;
                        particle.decay = 0.01;
                        this.particles.push(particle);
                    }
                }
            }
        }

        playHistorySequence() {
            if (this.historyPlaying) return Promise.resolve();
            this.historyPlaying = true;
            const order = ['snake', 'ai', 'heart', '2026'];
            return order.reduce((promise, shape) => {
                return promise.then(() => this.showShape(shape));
            }, Promise.resolve()).finally(() => {
                this.historyPlaying = false;
            });
        }

        playAutoSpecialBurst() {
            if (this.historyPlaying) return;
            const shape = this.autoShapes[this.autoShapeIndex % this.autoShapes.length];
            this.autoShapeIndex++;
            this.showShape(shape, { holdMs: 1600, releaseDelay: 500 });
        }

        showShape(shape, options = {}) {
            return new Promise(resolve => {
                const colorMap = {
                    snake: '#ffd166',
                    ai: '#9c6bff',
                    heart: '#ff5c8d',
                    2026: '#f7c948',
                    horse: '#ffda7b',
                    constellation: '#9ad0ff'
                };
                const holdMs = options.holdMs ?? (shape === '2026' ? 3200 : 2200);
                const releaseDelay = options.releaseDelay ?? 400;
                const scale = this.shapeScaleMap[shape] || 1.1;
                const points = this.getShapePoints(shape);
                const baseRadius = Math.min(this.particleSizeRange.max, this.particleSizeRange.min * scale);
                this.particles = points.map(point => {
                    const particle = new Particle(point.x, point.y, colorMap[shape] || '#fff');
                    // Keep these particles smaller than the main stage bursts while enlarging the overall glyph.
                    particle.radius = Math.min(baseRadius, 1.9);
                    particle.decay = 0.006;
                    particle.vx = (Math.random() - 0.5) * 0.4;
                    particle.vy = (Math.random() - 0.5) * 0.4;
                    return particle;
                });
                setTimeout(() => {
                    this.releaseCurrentShape();
                    setTimeout(() => resolve(), releaseDelay);
                }, holdMs);
            });
        }

        releaseCurrentShape() {
            this.particles.forEach(particle => {
                particle.vx = (Math.random() - 0.5) * 1.8;
                particle.vy = (Math.random() - 0.5) * 1.4 - 0.2;
                particle.decay = 0.01;
            });
        }

        getShapePoints(shape) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const scale = this.shapeScaleMap[shape] || 1.1;

            if (shape === 'snake') {
                const points = [];
                const segments = 240;
                const amplitude = 110 * scale;
                for (let i = 0; i < segments; i++) {
                    const x = centerX - 300 + (i * 600 / segments);
                    const y = centerY + Math.sin((i / segments) * Math.PI * 4.5) * amplitude;
                    points.push({ x, y });
                }
                return points;
            }

            if (shape === 'heart') {
                const points = [];
                const heartScale = 12 * scale;
                for (let i = 0; i < 220; i++) {
                    const t = (i / 220) * Math.PI * 2;
                    const x = 16 * Math.pow(Math.sin(t), 3);
                    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                    points.push({
                        x: centerX + x * heartScale,
                        y: centerY + y * heartScale
                    });
                }
                return points;
            }

            if (shape === 'constellation') {
                const points = [];
                const total = 280;
                const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.22 * scale;
                for (let i = 0; i < total; i++) {
                    const angle = (i / total) * Math.PI * 4;
                    const radius = (i / total) * maxRadius;
                    points.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius * 0.65
                    });
                }
                return points;
            }

            if (shape === 'horse') {
                return this.sampleTextPoints('馬', {
                    font: '900 200px \"Microsoft YaHei\", \"Noto Serif SC\", serif',
                    step: 4,
                    scale
                });
            }

            if (shape === 'ai') {
                return this.sampleTextPoints('AI', {
                    font: 'bold 200px \"Russo One\", sans-serif',
                    step: 4,
                    scale
                });
            }

            if (shape === '2026') {
                return this.sampleTextPoints('2026', {
                    font: 'bold 170px \"Russo One\", sans-serif',
                    step: 4,
                    scale
                });
            }

            return [];
        }

        sampleTextPoints(text, options = {}) {
            const width = options.width || 640;
            const height = options.height || 320;
            const step = options.step || 5;
            const scale = options.scale || 1;
            const font = options.font || 'bold 160px \"Russo One\", sans-serif';
            const offCanvas = document.createElement('canvas');
            offCanvas.width = width;
            offCanvas.height = height;
            const offCtx = offCanvas.getContext('2d');
            offCtx.clearRect(0, 0, width, height);
            offCtx.fillStyle = '#fff';
            offCtx.font = font;
            offCtx.textAlign = 'center';
            offCtx.textBaseline = 'middle';
            offCtx.fillText(text, width / 2, height / 2);
            const data = offCtx.getImageData(0, 0, width, height);
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const points = [];

            for (let y = 0; y < height; y += step) {
                for (let x = 0; x < width; x += step) {
                    const index = (y * width + x) * 4 + 3;
                    if (data.data[index] > 128) {
                        points.push({
                            x: centerX + (x - width / 2) * scale,
                            y: centerY + (y - height / 2) * scale
                        });
                    }
                }
            }
            return points;
        }

        startNumberCountdown(onComplete) {
            if (this.numberTimer) return;
            let current = 60;
            this.drawNumber(current);
            this.startLoop();
            this.numberTimer = setInterval(() => {
                current -= 1;
                if (current <= 0) {
                    clearInterval(this.numberTimer);
                    this.numberTimer = null;
                    this.particles = [];
                    if (typeof onComplete === 'function') onComplete();
                } else {
                    this.drawNumber(current);
                }
            }, 1000);
        }
    }

    class EpochController {
        constructor() {
            this.timeHelper = new TimeHelper();
            this.meteorField = new MeteorField(document.getElementById('meteor-canvas'));
            this.featureCanvas = new FeatureCanvas(document.getElementById('feature-canvas'));
            this.countdownInterval = null;
            this.particleCountdownStarted = false;
            this.historyTriggered = false;
            this.started = false;
            this.panelEl = document.querySelector('.epoch-panel');
            this.panelStorageKey = 'epoch_panel_disabled';
        }

        init() {
            this.applyPanelPreference();
            this.bindPanelControls();
            this.updateStaticCopy();
            this.updateCountdown();
            this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
            this.meteorField.start();
            this.featureCanvas.startLoop();
            window.addEventListener('resize', () => {
                this.meteorField.resize();
                this.featureCanvas.resize();
            });
            document.addEventListener('epoch:fireworks-start', () => this.handleStart());
            document.addEventListener('epoch:auto-special', () => this.handleAutoSpecial());
        }

        handleStart() {
            this.started = true;
        }

        updateStaticCopy() {
            const locationEl = document.getElementById('epoch-location');
            if (locationEl) {
                locationEl.textContent = `${this.timeHelper.getLocationLabel()} · ${this.timeHelper.formatOffset()}`;
            }
            const midnightEl = document.getElementById('epoch-midnight');
            if (midnightEl) {
                midnightEl.textContent = `本地零点：${this.timeHelper.getMidnightLabel()}`;
            }
        }

        updateCountdown() {
            const now = new Date();
            const diff = SOLAR_TARGET.getTime() - now.getTime();
            const countdownEl = document.getElementById('epoch-countdown');
            const hintEl = document.getElementById('epoch-hint');

            if (diff <= 0) {
                if (countdownEl) countdownEl.textContent = '新年快乐！';
                if (!this.historyTriggered) {
                    this.historyTriggered = true;
                    this.featureCanvas.playHistorySequence();
                }
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (countdownEl) {
                countdownEl.textContent = `${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`;
            }
            if (hintEl) {
                hintEl.textContent = '跨年前最后一分钟将切换为粒子倒计时';
            }

            if (diff <= 60000 && !this.particleCountdownStarted) {
                this.particleCountdownStarted = true;
                if (countdownEl) countdownEl.style.visibility = 'hidden';
                this.featureCanvas.startNumberCountdown(() => {
                    if (countdownEl) countdownEl.style.visibility = 'visible';
                });
            }

            if (diff <= 1000 && !this.historyTriggered) {
                this.historyTriggered = true;
                this.featureCanvas.playHistorySequence();
            }
        }

        handleAutoSpecial() {
            if (!this.started) return;
            this.featureCanvas.playAutoSpecialBurst();
        }

        applyPanelPreference() {
            if (!this.panelEl) return;
            try {
                if (localStorage.getItem(this.panelStorageKey) === '1') {
                    this.panelEl.classList.add('epoch-panel--hidden');
                }
            } catch (err) {
                console.warn('Epoch panel preference unavailable', err);
            }
        }

        bindPanelControls() {
            if (!this.panelEl) return;
            const closeBtn = document.getElementById('epoch-panel-close');
            const disableBtn = document.getElementById('epoch-panel-toggle');
            closeBtn && closeBtn.addEventListener('click', () => this.hidePanel());
            disableBtn && disableBtn.addEventListener('click', () => this.disablePanel());
        }

        hidePanel() {
            if (!this.panelEl) return;
            this.panelEl.classList.add('epoch-panel--hidden');
        }

        disablePanel() {
            try {
                localStorage.setItem(this.panelStorageKey, '1');
            } catch (err) {
                console.warn('Failed to persist epoch panel preference', err);
            }
            this.hidePanel();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const controller = new EpochController();
        controller.init();
    });
})();
