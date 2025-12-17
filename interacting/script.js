function MovingCircle(x, y, r, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;

    this.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        // ctx.fillStyle = 'blue';
        // ctx.fill();

        ctx.strokeStyle = 'blue';
        ctx.stroke();

        ctx.closePath();
    };

    this.update = function (canvas) {
        if (this.x + this.r > canvas.width || this.x - this.r < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.r > canvas.height || this.y - this.r < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw(canvas.getContext('2d'));
    };
}

const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const circles = Array.from({ length: 100 }, () => {
    const r = 30;
    const x = Math.random() * (canvas.width - 2 * r) + r;
    const y = Math.random() * (canvas.height - 2 * r) + r;
    const dx = (Math.random() - 0.5) * 4;
    const dy = (Math.random() - 0.5) * 4;
    return new MovingCircle(x, y, r, dx, dy);
});

(function animate() {
    requestAnimationFrame(animate);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => circle.update(canvas));
}());
