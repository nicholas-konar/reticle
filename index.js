import { Projectile } from "/js/projectile.js";

let projectile, target;

window.setup = () => {
  createCanvas(1500, 800);
  const angle = radians(5);
  const speed = 1000;
  const initialVelocity = createVector(speed * cos(angle), speed * sin(angle));
  projectile = new Projectile(0, 0, initialVelocity, 5);
  target = new Target(width * 0.9, 100, 250);
};

window.draw = () => {
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
};

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

