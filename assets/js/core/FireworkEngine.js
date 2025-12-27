import { ParticleSystem } from './ParticleSystem.js';

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
                return true;
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
        x = x || Math.random() * this.canvas.width;
        const targetY = y || 100 + Math.random() * 200;

        const color = this.themeManager.getRandomFireworkColor();
        const firework = new Firework(x, this.canvas.height, targetY, color);

        this.fireworks.push(firework);
        if (this.audioManager) {
            this.audioManager.play('launch');
        }
    }

    update() {
        this.fireworks = this.fireworks.filter(fw => {
            const shouldExplode = fw.update();
            if (shouldExplode) {
                this.explode(fw);
                return false;
            }
            return !fw.exploded;
        });

        this.particleSystem.update();
    }

    explode(firework) {
        const shapes = ['circle', 'circle', 'circle', 'heart', 'star'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        this.particleSystem.createExplosion(
            firework.x,
            firework.y,
            firework.color,
            100,
            shape
        );

        if (this.audioManager) {
            this.audioManager.play(Math.random() > 0.5 ? 'explosion_small' : 'explosion_large');
        }
    }

    render() {
        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let fw of this.fireworks) {
            fw.render(this.ctx);
        }

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

export { FireworkEngine };
