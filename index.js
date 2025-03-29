let projectile, target;
const dt = 0.1; 
const g = 9.81; 
const k = 0.05;

function setup() {
  createCanvas(1500, 800);
  let angle = radians(40);
  let speed = 150;
  let initialVelocity = createVector(speed * cos(angle), speed * sin(angle));
  projectile = new Projectile(0, 0, initialVelocity);
  target = new Target(width * 0.9, 100, 50);
}

function draw() {
  background(220);
  translate(0, height);
  scale(1, -1);

  target.display();

  projectile.update();
  projectile.display();

  if (
    projectile.pos.x > width ||
    projectile.pos.y > height ||
    projectile.pos.x < 0
  ) {
    noLoop();
  }
}

  display() {
    push();
    stroke(255, 0, 0);
    strokeWeight(10);
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.height);
    pop();
  }
}

class Projectile {
  constructor(x, y, velocity) {
    this.pos = createVector(x, y);
    this.vel = velocity.copy();
  }

  update() {
    let gravity = createVector(0, -g);
    let drag = this.vel.copy().mult(-k);

    let acceleration = p5.Vector.add(gravity, drag);

    // Euler integration:
    this.vel.add(p5.Vector.mult(acceleration, dt));
    this.pos.add(p5.Vector.mult(this.vel, dt));
  }

  display() {
    circle(this.pos.x, this.pos.y, 15);
    //let vec = this.vel.copy();
    //let start = this.pos.copy().add(vec);
    //let end = this.pos.copy().sub(vec);
    //line(start.x, start.y, end.x, end.y);
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
