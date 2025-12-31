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

        showShape(shape) {
            return new Promise(resolve => {
                const colorMap = {
                    snake: '#ffd166',
                    ai: '#9c6bff',
                    heart: '#ff5c8d',
                    2026: '#f7c948'
                };
                const points = this.getShapePoints(shape);
                this.particles = points.map(point => {
                    const particle = new Particle(point.x, point.y, colorMap[shape] || '#fff');
                    particle.radius = shape === '2026' ? 2.8 : 2.2;
                    particle.decay = 0.006;
                    particle.vx = (Math.random() - 0.5) * 0.6;
                    particle.vy = (Math.random() - 0.5) * 0.6;
                    return particle;
                });
                setTimeout(() => resolve(), shape === '2026' ? 3200 : 2000);
            });
        }

        getShapePoints(shape) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;

            if (shape === 'snake') {
                const points = [];
                const segments = 220;
                const amplitude = 90;
                for (let i = 0; i < segments; i++) {
                    const x = centerX - 280 + (i * 560 / segments);
                    const y = centerY + Math.sin((i / segments) * Math.PI * 4) * amplitude;
                    points.push({ x, y });
                }
                return points;
            }

            if (shape === 'heart') {
                const points = [];
                const scale = 12;
                for (let i = 0; i < 200; i++) {
                    const t = (i / 200) * Math.PI * 2;
                    const x = 16 * Math.pow(Math.sin(t), 3);
                    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                    points.push({
                        x: centerX + x * scale,
                        y: centerY + y * scale
                    });
                }
                return points;
            }

            const text = shape === 'ai' ? 'AI' : '2026';
            const offCanvas = document.createElement('canvas');
            offCanvas.width = 620;
            offCanvas.height = 260;
            const offCtx = offCanvas.getContext('2d');
            offCtx.fillStyle = '#fff';
            offCtx.font = shape === 'ai' ? 'bold 180px "Russo One", sans-serif' : 'bold 150px "Russo One", sans-serif';
            offCtx.textAlign = 'center';
            offCtx.textBaseline = 'middle';
            offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);
            const data = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
            const points = [];

            for (let y = 0; y < offCanvas.height; y += 4) {
                for (let x = 0; x < offCanvas.width; x += 4) {
                    const index = (y * offCanvas.width + x) * 4 + 3;
                    if (data.data[index] > 128) {
                        points.push({
                            x: centerX + (x - offCanvas.width / 2),
                            y: centerY + (y - offCanvas.height / 2)
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
        }

        init() {
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
    }

    document.addEventListener('DOMContentLoaded', () => {
        const controller = new EpochController();
        controller.init();
    });
})();
