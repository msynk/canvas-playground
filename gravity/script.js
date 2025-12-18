// Configuration
const CONFIG = {
  physics: {
    gravity: 0.98,
    friction: 0.69,
  },
  balls: {
    count: 100,
    minRadius: 5,
    maxRadius: 30,
    velocityRange: { x: [-1, 1], y: [1, 3] },
  },
  colors: ['#BF0B3B', '#D50DD9', '#238C2A', '#F2B90C', '#F27405'],
};

// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Utility functions
const randomRange = (min, max) => Math.random() * (max - min) + min;
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Ball class using modern ES6+ syntax
class Ball {
  #ctx;
  #canvas;

  constructor(ctx, canvas, { x, y, radius, color, dx, dy }) {
    this.#ctx = ctx;
    this.#canvas = canvas;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
  }

  draw() {
    const { x, y, radius, color } = this;
    this.#ctx.beginPath();
    this.#ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.#ctx.fillStyle = color;
    this.#ctx.fill();
  }

  update() {
    const { gravity, friction } = CONFIG.physics;
    const { width, height } = this.#canvas;

    // Vertical boundary collision (floor)
    if (this.y + this.radius + this.dy > height) {
      this.dy = -this.dy * friction;
    } else {
      this.dy += gravity;
    }

    // Horizontal boundary collision (walls)
    if (this.x + this.radius + this.dx > width || this.x - this.radius <= 0) {
      this.dx = -this.dx * friction;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }

  static create(ctx, canvas) {
    const { minRadius, maxRadius, velocityRange } = CONFIG.balls;
    const radius = randomRange(minRadius, maxRadius);

    return new Ball(ctx, canvas, {
      x: randomRange(radius, canvas.width - radius),
      y: randomRange(radius, canvas.height - radius),
      radius,
      color: randomItem(CONFIG.colors),
      dx: randomRange(...velocityRange.x),
      dy: randomRange(...velocityRange.y),
    });
  }
}

// Simulation controller
class GravitySimulation {
  #ctx;
  #canvas;
  #balls = [];
  #animationId = null;
  #resizeTimeout = null;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
    this.#setupEventListeners();
  }

  #setupEventListeners() {
    // Debounced resize handler
    window.addEventListener('resize', () => {
      clearTimeout(this.#resizeTimeout);
      this.#resizeTimeout = setTimeout(() => {
        resizeCanvas();
        this.init();
      }, 150);
    });

    // Click to reset
    window.addEventListener('click', () => this.init());
  }

  init() {
    this.#balls = Array.from(
      { length: CONFIG.balls.count },
      () => Ball.create(this.#ctx, this.#canvas)
    );
  }

  #render = () => {
    this.#animationId = requestAnimationFrame(this.#render);
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.#balls.forEach((ball) => ball.update());
  };

  start() {
    resizeCanvas();
    this.init();
    this.#render();
  }

  stop() {
    if (this.#animationId) {
      cancelAnimationFrame(this.#animationId);
      this.#animationId = null;
    }
  }
}

// Initialize and start
const simulation = new GravitySimulation(canvas);
simulation.start();