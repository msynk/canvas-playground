const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const interactivityDistance = 50;
const circleCount = 2000;
const maxRadius = 40;
const minRadius = 5;
const mouse = {
    x: undefined,
    y: undefined
};

const colorArray = ['#ffaa33', '#99ffaa', '#00ff00', '#4411aa', '#ff1100'];

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

const circles = Array.from({ length: circleCount }, () => {
    const r = minRadius;
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


function MovingCircle(x, y, r, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    this.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

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

        if (Math.abs(mouse.x - this.x) < interactivityDistance &&
            Math.abs(mouse.y - this.y) < interactivityDistance) {
            if (this.r < maxRadius) {
                this.r += 2;
            }
        } else if (this.r > minRadius) {
            this.r -= 2;
        }

        this.draw(canvas.getContext('2d'));
    };
}