import { Particle } from './ParticleSystem.js';

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
            await this.wait(3000);
        }

        this.isPlaying = false;
    }

    async displayIcon(type) {
        const points = this.generateIconPoints(type);
        const color = this.getColorForIcon(type);
        await this.createAttractorParticles(points, color);
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

    async createAttractorParticles(targetPoints, color) {
        const attractorParticles = targetPoints.map(point => ({
            current: {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height
            },
            target: point,
            color: color
        }));

        const duration = 1000;
        const startTime = Date.now();

        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

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
