import { FireworkEngine } from './core/FireworkEngine.js';

class TouchController {
    constructor(canvas, fireworkEngine) {
        this.canvas = canvas;
        this.engine = fireworkEngine;
        this.initTouchEvents();
        this.initShakeDetection();
    }

    initTouchEvents() {
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
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.engine.launchFirework();
            }, i * 50);
        }

        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }
}

class FirecrackerController {
    constructor() {
        this.canvas = document.getElementById('firework-canvas');
        this.audioManager = null;

        this.theme = {
            colors: [
                'hsl(0, 100%, 50%)',
                'hsl(45, 100%, 50%)',
                'hsl(120, 100%, 50%)',
                'hsl(200, 100%, 60%)',
                'hsl(280, 100%, 70%)',
                'hsl(330, 100%, 60%)'
            ]
        };

        this.fireworkEngine = null;
        this.touchController = null;
    }

    async init() {
        const { AudioManager } = await import('./core/AudioManager.js');
        this.audioManager = new AudioManager();
        await this.audioManager.init();

        this.fireworkEngine = new FireworkEngine(
            this.canvas,
            this.audioManager,
            {
                getRandomFireworkColor: () => this.getRandomColor()
            }
        );

        this.touchController = new TouchController(
            this.canvas,
            this.fireworkEngine
        );

        this.start();
    }

    start() {
        this.audioManager.unlock();
        this.fireworkEngine.animate();

        this.fireworkEngine.startAutoLaunch(800);

        this.canvas.addEventListener('click', (e) => {
            this.fireworkEngine.launchFirework(e.clientX, e.clientY);
        });
    }

    getRandomColor() {
        return this.theme.colors[Math.floor(Math.random() * this.theme.colors.length)];
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const controller = new FirecrackerController();
    controller.init();
});
