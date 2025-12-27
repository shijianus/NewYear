class Particle {
    constructor(x, y, color, velocity, gravity = 0.1, friction = 0.99) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = velocity.x;
        this.vy = velocity.y;
        this.gravity = gravity;
        this.friction = friction;
        this.alpha = 1.0;
        this.radius = 2;
        this.life = 1.0;
        this.decay = 0.015;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;

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

    reset(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = velocity.x;
        this.vy = velocity.y;
        this.alpha = 1.0;
        this.life = 1.0;
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
                break;
        }

        this.particles.push(...particles);
    }

    createCircleExplosion(x, y, color, count) {
        const particles = [];
        const speed = 3 + Math.random() * 2;

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
        const pointsOnHeart = this.generateHeartPoints(60);

        for (let point of pointsOnHeart) {
            const velocity = {
                x: point.x * 0.05,
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
            points.push({ x: x * 2, y: y * 2 });
        }
        return points;
    }

    createStarExplosion(x, y, color) {
        const particles = [];
        const points = 5;
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

    createIronFlowerEffect(x, y) {
        const particles = [];
        const color = 'hsl(45, 100%, 50%)';

        for (let i = 0; i < 150; i++) {
            const angle = Math.random() * Math.PI;
            const speed = 2 + Math.random() * 3;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };

            const particle = new Particle(x, y, color, velocity, 0.25, 0.97);
            particle.decay = 0.008;
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
