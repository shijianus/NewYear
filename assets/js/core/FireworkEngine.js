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

class Meteor {
    constructor(width, height) {
        this.reset(width, height);
    }

    reset(width, height) {
        this.x = Math.random() * width * 0.3;
        this.y = -Math.random() * 200;
        const angle = Math.random() * 0.25 + 0.35;
        const speed = 8 + Math.random() * 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.length = 80 + Math.random() * 50;
        this.opacity = 0.4 + Math.random() * 0.4;
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.004;

        if (this.x > width + 200 || this.y > height + 200 || this.opacity <= 0) {
            return false;
        }
        return true;
    }

    render(ctx) {
        ctx.save();
        const gradient = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x - this.length,
            this.y - this.length * 0.3
        );
        gradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length, this.y - this.length * 0.3);
        ctx.stroke();
        ctx.restore();
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
        this.meteors = [];
        this.regionalProfile = null;
        this.autoLaunchInterval = null;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setRegionalProfile(profile) {
        this.regionalProfile = profile;
    }

    launchFirework(x = null, y = null) {
        x = x || Math.random() * this.canvas.width;
        const targetY = y || 150 + Math.random() * 250;
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
        this.updateMeteors();
    }

    explode(firework) {
        const baseShapes = ['circle', 'circle', 'circle', 'heart', 'star'];
        let shapes = baseShapes;

        if (this.regionalProfile && this.regionalProfile.preferredShapes) {
            shapes = shapes.concat(this.regionalProfile.preferredShapes);
        }

        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        const shouldUseIronFlower = this.themeManager.hasSpecialEffect('ironFlower') && Math.random() < 0.2;
        if (shouldUseIronFlower) {
            this.particleSystem.createIronFlowerEffect(firework.x, firework.y);
        } else {
            this.particleSystem.createExplosion(
                firework.x,
                firework.y,
                firework.color,
                100,
                shape
            );
        }

        if (this.audioManager) {
            this.audioManager.play(Math.random() > 0.5 ? 'explosion_small' : 'explosion_large');
        }
    }

    render() {
        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderMeteors();

        for (let fw of this.fireworks) {
            fw.render(this.ctx);
        }

        this.particleSystem.render();
    }

    startAutoLaunch(interval = 1200) {
        this.stopAutoLaunch();
        this.autoLaunchInterval = setInterval(() => {
            this.launchFirework();
        }, interval);
    }

    stopAutoLaunch() {
        if (this.autoLaunchInterval) {
            clearInterval(this.autoLaunchInterval);
            this.autoLaunchInterval = null;
        }
    }

    animate() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.animate());
    }

    updateMeteors() {
        if (Math.random() < 0.02) {
            this.meteors.push(new Meteor(this.canvas.width, this.canvas.height));
        }
        this.meteors = this.meteors.filter(meteor => meteor.update(this.canvas.width, this.canvas.height));
    }

    renderMeteors() {
        for (let meteor of this.meteors) {
            meteor.render(this.ctx);
        }
    }
}

export { FireworkEngine };
