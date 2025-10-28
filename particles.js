// Particle System
class ParticleSystem {
    constructor(containerId, particleCount = 30) {
        this.container = document.getElementById(containerId);
        this.particleCount = particleCount;
        this.particles = [];
        this.init();
    }

    init() {
        if (!this.container) return;

        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;

        // Random movement
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        const duration = 3 + Math.random() * 4;

        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animationDuration = duration + 's';

        this.container.appendChild(particle);
        this.particles.push(particle);

        // Randomize animation delay
        particle.style.animationDelay = Math.random() * 2 + 's';
    }

    destroy() {
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
    }

    resize() {
        // Reposition particles on window resize
        this.particles.forEach(particle => {
            if (parseFloat(particle.style.left) > window.innerWidth) {
                particle.style.left = (Math.random() * window.innerWidth) + 'px';
            }
            if (parseFloat(particle.style.top) > window.innerHeight) {
                particle.style.top = (Math.random() * window.innerHeight) + 'px';
            }
        });
    }
}

// Initialize particle system when page loads
let particleSystem = null;

window.addEventListener('load', () => {
    particleSystem = new ParticleSystem('particles-container', 30);
});

window.addEventListener('resize', () => {
    if (particleSystem) {
        particleSystem.resize();
    }
});
