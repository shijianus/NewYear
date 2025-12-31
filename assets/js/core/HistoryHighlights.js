import { Particle } from './ParticleSystem.js';

class HistoryHighlights {
    constructor(particleSystem, canvas) {
        this.particleSystem = particleSystem;
        this.canvas = canvas;
        this.sequence = ['snake', 'ai', 'heart', '2026'];
        this.currentIndex = 0;
        this.isPlaying = false;
    }

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        for (let iconType of this.sequence) {
            await this.displayIcon(iconType);
        }

        this.isPlaying = false;
    }

    async displayIcon(type) {
        const points = this.generateIconPoints(type);
        const color = this.getColorForIcon(type);
        const particles = this.createShapeParticles(points, color, type);
        const holdTime = type === '2026' ? 3500 : 2200;
        await this.wait(holdTime);
        this.releaseShapeParticles(particles);
        if (type === '2026') {
            this.triggerFinaleBurst(color);
        }
        await this.wait(800);
    }

    generateIconPoints(type) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const points = [];

        switch(type) {
            case 'snake':
                points.push(...this.generateSnakePath(centerX, centerY));
                break;
            case 'ai':
                points.push(...this.generateTextPoints('AI', centerX, centerY));
                break;
            case 'heart':
                points.push(...this.generateHeartPoints(centerX, centerY));
                break;
            case '2026':
                points.push(...this.generateTextPoints('2026', centerX, centerY));
                break;
        }

        return points;
    }

    generateTextPoints(text, centerX, centerY) {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 600;
        offCanvas.height = 300;
        const offCtx = offCanvas.getContext('2d');

        offCtx.fillStyle = 'white';
        offCtx.font = 'bold 150px Arial';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(text, 300, 150);

        const imageData = offCtx.getImageData(0, 0, 600, 300);
        const points = [];
        const sampling = 4;

        for (let y = 0; y < 300; y += sampling) {
            for (let x = 0; x < 600; x += sampling) {
                const index = (y * 600 + x) * 4;
                const alpha = imageData.data[index + 3];

                if (alpha > 128) {
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

    createShapeParticles(points, color, type) {
        const particles = [];
        const sizeBoost = type === '2026' ? 3 : 2;

        for (let point of points) {
            const particle = new Particle(point.x, point.y, color, { x: 0, y: 0 }, 0, 0.98);
            particle.radius = sizeBoost;
            particle.decay = 0.004;
            this.particleSystem.particles.push(particle);
            particles.push(particle);
        }

        return particles;
    }

    releaseShapeParticles(particles) {
        particles.forEach(particle => {
            particle.gravity = 0.18;
            particle.decay = 0.05;
            particle.vx = (Math.random() - 0.5) * 6;
            particle.vy = (Math.random() - 0.5) * 6;
        });
    }

    triggerFinaleBurst(color) {
        this.particleSystem.createExplosion(
            this.canvas.width / 2,
            this.canvas.height / 2 - 50,
            color,
            180,
            'circle'
        );
    }

    getColorForIcon(type) {
        const colorMap = {
            'snake': 'hsl(45, 100%, 50%)',
            'ai': 'hsl(260, 100%, 70%)',
            'heart': 'hsl(0, 100%, 60%)',
            '2026': 'hsl(50, 100%, 50%)'
        };
        return colorMap[type];
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export { HistoryHighlights };
