(() => {
    'use strict';

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = Object.freeze({
        colors: ['#146152', '#44803F', '#B4CF66', '#FFEC5C', '#FF5A33'],
        interactivityDistance: 50,
        circleCount: 2000,
        maxRadius: 40,
        minRadius: 5,
        maxSpeed: 2,
    });

    const pointer = { x: null, y: null };
    let viewport = { width: 0, height: 0, dpr: 1 };
    let circles = [];
    let rafId = null;

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dpr = Math.max(1, window.devicePixelRatio || 1);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        viewport = { width, height, dpr };
    }

    function setPointerPosition(event) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
    }

    function clearPointer() {
        pointer.x = null;
        pointer.y = null;
    }

    function createRandomCircle({ width, height }) {
        const r = randomBetween(1, config.minRadius + 1);
        const x = randomBetween(r, width - r);
        const y = randomBetween(r, height - r);
        const vx = randomBetween(-config.maxSpeed, config.maxSpeed);
        const vy = randomBetween(-config.maxSpeed, config.maxSpeed);
        const color = randomFromArray(config.colors);

        return new MovingCircle({ x, y, r, vx, vy, color });
    }

    function init() {
        circles = Array.from({ length: config.circleCount }, () =>
            createRandomCircle(viewport),
        );
    }

    function animate() {
        rafId = window.requestAnimationFrame(animate);

        ctx.clearRect(0, 0, viewport.width, viewport.height);
        for (const circle of circles) {
            circle.update(viewport, pointer);
            circle.draw(ctx);
        }
    }

    window.addEventListener('mouseout', e => e.relatedTarget == null && clearPointer(), { passive: true });
    window.addEventListener('pointermove', setPointerPosition, { passive: true });
    window.addEventListener('blur', clearPointer);
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });


    class MovingCircle {
        constructor({ x, y, r, vx, vy, color }) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.vx = vx;
            this.vy = vy;
            this.minRadius = r;
            this.color = color;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update({ width, height }, pointer) {
            if (this.x + this.r > width || this.x - this.r < 0) {
                this.vx = -this.vx;
            }

            if (this.y + this.r > height || this.y - this.r < 0) {
                this.vy = -this.vy;
            }

            this.x += this.vx;
            this.y += this.vy;

            const isPointerActive = pointer.x != null && pointer.y != null;

            if (!isPointerActive) {
                if (this.r > this.minRadius) {
                    this.r -= 1;
                }
                return;
            }

            const dx = Math.abs(pointer.x - this.x);
            const dy = Math.abs(pointer.y - this.y);
            if (dx < config.interactivityDistance &&
                dy < config.interactivityDistance &&
                this.r < config.maxRadius) {
                this.r += 1;
            } else if (this.r > this.minRadius) {
                this.r -= 1;
            }
        }
    }


    resizeCanvas();
    init();
    animate();
})();
