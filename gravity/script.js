const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});


function Ball(x, y, radius, color, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dy = dy;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    this.update = function () {
        if (this.y + this.radius > canvas.height) {
            this.dy = -this.dy;
        } else{
            this.dy += 0.98; // gravity
        }
        this.y += this.dy;
        this.draw();
    }
}

let ball = undefined;
function init() {
    ball = new Ball(canvas.width / 2, canvas.height / 2, 30, 'blue', 1);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.update();
}

init();
animate();