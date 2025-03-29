let projectile, target;
const dt = 0.1;
const g = 9.81;
const k = 0.05;

function setup() {
  createCanvas(1500, 800);
  let angle = radians(30);
  let speed = 175;
  let initialVelocity = createVector(speed * cos(angle), speed * sin(angle));
  projectile = new Projectile(0, 0, initialVelocity, 5);
  target = new Target(width * 0.9, 100, 250);
}

function draw() {
  background(220);
  translate(0, height);
  scale(1, -1);

  target.display();

  projectile.update();
  projectile.display();

  if (projectile.pos.x >= target.pos.lower.x) {
    const impact = target.impactedBy(projectile);
    if (impact) {
      console.log(`Impact x: ${impact.x} y: ${impact.y}`);
      push();
      stroke("red");
      strokeWeight(5);
      point(impact.x, impact.y);
      pop();
      noLoop();
    } else {
      console.log("Target missed.");
    }
  }

  if (
    projectile.pos.x < 0 ||
    projectile.pos.x > width ||
    projectile.pos.y < 0 ||
    projectile.pos.y > height
  ) {
    noLoop();
  }
}

class Target {
  constructor(x, y, height) {
    this.pos = {
      upper: createVector(x, y + height),
      lower: createVector(x, y),
    };
  }

  display() {
    push();
    stroke("grey");
    strokeWeight(1);
    line(
      this.pos.lower.x,
      this.pos.lower.y,
      this.pos.upper.x,
      this.pos.upper.y,
    );
    pop();
  }

  impactedBy(projectile) {
    const a = projectile.pos;
    const b = projectile.prev;
    const c = this.pos.lower;
    const d = this.pos.upper;
    return intersects2D(a, b, c, d);
  }
}

class Projectile {
  constructor(x, y, velocity, size) {
    this.pos = createVector(x, y);
    this.vel = velocity.copy();
    this.prev = undefined;
    this.size = size;
  }

  update() {
    this.prev = this.pos.copy();
    const gravity = createVector(0, -g);
    const drag = this.vel.copy().mult(-k);

    const acceleration = p5.Vector.add(gravity, drag);

    // Euler integration:
    this.vel.add(p5.Vector.mult(acceleration, dt));
    this.pos.add(p5.Vector.mult(this.vel, dt));
  }

  display() {
    circle(this.pos.x, this.pos.y, this.size);
  }
}

function intersects2D(a, b, c, d) {
  const denominator = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);

  if (denominator === 0) return false;

  const numeratorT = (c.x - a.x) * (d.y - c.y) - (c.y - a.y) * (d.x - c.x);
  const numeratorU = (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x);

  const t = numeratorT / denominator;
  const u = numeratorU / denominator;

  const validT = 0 <= t && t <= 1;
  const validU = 0 <= u && u <= 1;

  if (validT && validU) {
    const x = a.x + t * (b.x - a.x);
    const y = a.y + t * (b.y - a.y);
    return createVector(x, y);
  } else {
    return false;
  }
}

