import { TimeZoneDetector } from './utils/TimeZoneDetector.js';
import { CalendarCalculator } from './utils/CalendarCalculator.js';
import { LocationService } from './utils/LocationService.js';
import { ThemeManager } from './core/ThemeManager.js';
import { AudioManager } from './core/AudioManager.js';
import { FireworkEngine } from './core/FireworkEngine.js';
import { HistoryHighlights } from './core/HistoryHighlights.js';
import { Particle } from './core/ParticleSystem.js';

class MainController {
    constructor() {
        this.canvas = document.getElementById('firework-canvas');

        this.timeDetector = new TimeZoneDetector();
        this.locationService = new LocationService();
        this.calendarCalc = new CalendarCalculator();
        this.themeManager = new ThemeManager(this.calendarCalc);
        this.audioManager = new AudioManager();
        this.fireworkEngine = null;
        this.historyHighlights = null;

        this.countdownInterval = null;
        this.started = false;
        this.particleCountdownStarted = false;
        this.finaleTriggered = false;
        this.locationProfile = null;
    }

    async init() {
        try {
            await this.audioManager.init();
            await this.locationService.detectLocation();
        } catch (error) {
            console.warn('Initialization warning', error);
        }

        this.locationProfile = this.locationService.getRegionalPreset();

        this.themeManager.applyTheme();
        if (this.locationProfile.palette) {
            this.themeManager.setRegionalPalette(this.locationProfile.palette);
        }

        this.fireworkEngine = new FireworkEngine(
            this.canvas,
            this.audioManager,
            this.themeManager
        );
        this.fireworkEngine.setRegionalProfile(this.locationProfile);

        this.historyHighlights = new HistoryHighlights(
            this.fireworkEngine.particleSystem,
            this.canvas
        );

        this.displayGreeting();
        this.showWelcomePage();
    }

    showWelcomePage() {
        const welcomeDiv = document.getElementById('welcome-screen');
        welcomeDiv.style.display = 'flex';

        const startBtn = document.getElementById('start-button');
        const triggerStart = (event) => {
            event.preventDefault();
            this.start();
            welcomeDiv.classList.add('hide');
        };
        startBtn.addEventListener('click', triggerStart, { once: true });
        startBtn.addEventListener('touchstart', triggerStart, { once: true, passive: false });
    }

    start() {
        if (this.started) return;
        this.audioManager.unlock();
        this.audioManager.playBGM(this.calendarCalc.getCurrentMode());

        this.fireworkEngine.animate();
        this.fireworkEngine.startAutoLaunch(1300);

        this.startCountdown();

        this.canvas.addEventListener('click', (e) => {
            this.fireworkEngine.launchFirework(e.clientX, e.clientY);
        });

        this.started = true;
    }

    startCountdown() {
        this.updateCountdownDisplay();

        this.countdownInterval = setInterval(() => {
            const targetDate = this.calendarCalc.getTargetNewYearDate();
            const now = new Date();
            const diff = targetDate - now;

            if (diff < 0) {
                clearInterval(this.countdownInterval);
                document.getElementById('countdown-display').textContent = '新年快乐！';
                return;
            }

            if (diff <= 60000 && !this.particleCountdownStarted) {
                this.startParticleCountdown();
            }

            if (diff <= 0 && !this.finaleTriggered) {
                this.triggerNewYearCelebration();
            }

            this.updateCountdownDisplay();
        }, 1000);
    }

    updateCountdownDisplay() {
        const targetDate = this.calendarCalc.getTargetNewYearDate();
        const now = new Date();
        const diff = targetDate - now;

        if (diff >= 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const display = `${days}天 ${hours}时 ${minutes}分 ${seconds}秒`;
            document.getElementById('countdown-display').textContent = display;
            const subtitle = document.getElementById('countdown-subtitle');
            if (subtitle) {
                const nextMidnight = targetDate.toLocaleString([], { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                subtitle.textContent = `以你的本地时间为准，下一次零点是：${nextMidnight}`;
            }
        }

        return diff;
    }

    startParticleCountdown() {
        this.particleCountdownStarted = true;
        document.getElementById('countdown-display').style.display = 'none';

        let seconds = 60;

        const particleCountdownInterval = setInterval(() => {
            if (seconds <= 0) {
                clearInterval(particleCountdownInterval);
                document.getElementById('countdown-display').style.display = 'block';
                return;
            }

            this.audioManager.play('countdown_heartbeat');
            this.drawParticleNumber(seconds);

            seconds--;
        }, 1000);
    }

    drawParticleNumber(number) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const offCanvas = document.createElement('canvas');
        offCanvas.width = 200;
        offCanvas.height = 200;
        const offCtx = offCanvas.getContext('2d');

        offCtx.fillStyle = 'white';
        offCtx.font = 'bold 120px Arial';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(number.toString(), 100, 100);

        const imageData = offCanvas.getImageData(0, 0, 200, 200);
        const points = [];

        for (let y = 0; y < 200; y += 4) {
            for (let x = 0; x < 200; x += 4) {
                const index = (y * 200 + x) * 4;
                if (imageData.data[index + 3] > 128) {
                    points.push({
                        x: centerX + (x - 100),
                        y: centerY + (y - 100)
                    });
                }
            }
        }

        const color = this.themeManager.getRandomFireworkColor();
        for (let point of points) {
            const velocity = { x: 0, y: 0 };
            const particle = new Particle(point.x, point.y, color, velocity, 0, 1);
            particle.decay = 0.02;
            this.fireworkEngine.particleSystem.particles.push(particle);
        }
    }

    async triggerNewYearCelebration() {
        if (this.finaleTriggered) return;
        this.finaleTriggered = true;
        this.audioManager.play('finale_boom', 1.0);

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.fireworkEngine.launchFirework();
            }, i * 100);
        }

        setTimeout(() => {
            this.historyHighlights.start();
        }, 3000);

        this.fireworkEngine.startAutoLaunch(500);
    }

    displayGreeting() {
        const greeting = this.locationService.getGreetingText();
        document.getElementById('location-greeting').textContent = greeting;

        const wish = document.getElementById('regional-wish');
        if (wish) wish.textContent = this.locationProfile?.wish || '';

        const message = document.getElementById('regional-message');
        if (message) message.textContent = this.locationProfile?.message || '';

        const locationLabel = document.getElementById('location-label');
        if (locationLabel) locationLabel.textContent = this.locationService.getLocationLabel();

        const timezoneLabel = document.getElementById('timezone-display');
        if (timezoneLabel) {
            timezoneLabel.textContent = `${this.timeDetector.formatTimeZoneName()} · ${this.timeDetector.getOffsetLabel()}`;
        }

        const seasonLabel = document.getElementById('mode-label');
        if (seasonLabel) seasonLabel.textContent = `${this.calendarCalc.getCurrentMode() === 'SOLAR' ? '阳历元旦' : '农历春节'}`;

        const seasonDesc = document.getElementById('mode-desc');
        if (seasonDesc) seasonDesc.textContent = this.calendarCalc.getSeasonDescription();

        const midnightLabel = document.getElementById('midnight-label');
        if (midnightLabel) midnightLabel.textContent = `本地零点：${this.timeDetector.getLocalMidnightString()}`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const controller = new MainController();
    controller.init();
});
