const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const COLOR_ARRAY = ['#146152', '#44803F', '#B4CF66', '#FFEC5C', '#FF5A33'];
const INTERACTIVITY_DISTANCE = 50;
const CIRCLE_COUNT = 2000;
const MAX_RADIUS = 40;
const MIN_RADIUS = 5;

const mouse = {
    x: undefined,
    y: undefined
};


window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

let circles = [];
function init() {
    circles = Array.from({ length: CIRCLE_COUNT }, () => {
        const r = Math.random() * MIN_RADIUS + 1;
        const x = Math.random() * (canvas.width - 2 * r) + r;
        const y = Math.random() * (canvas.height - 2 * r) + r;
        const dx = (Math.random() - 0.5) * 4;
        const dy = (Math.random() - 0.5) * 4;
        return new MovingCircle(x, y, r, dx, dy);
    });
}

init();

(function animate() {
    requestAnimationFrame(animate);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => circle.update(canvas));
}());



class MovingCircle {
    constructor(x, y, r, dx, dy) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        this.minRadius = r;
        this.color = COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)];

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

            if (Math.abs(mouse.x - this.x) < INTERACTIVITY_DISTANCE &&
                Math.abs(mouse.y - this.y) < INTERACTIVITY_DISTANCE &&
                this.r < MAX_RADIUS) {
                this.r += 1;
            } else if (this.r > this.minRadius) {
                this.r -= 1;
            }

            this.draw(canvas.getContext('2d'));
        };
    }
}