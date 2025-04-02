import constants from "/js/constants.js";

export class Projectile {
  constructor(pos, velocity, size) {
    this.pos = pos;
    this.vel = velocity.copy();
    this.size = size;
    this.prevPoints = [];
  }

  update() {
    this.prevPoints.push(this.pos.copy());

    const { dt, g, k } = constants;
    const gravity = createVector(0, -g, 0);
    const drag = this.vel.copy().mult(-k);
    const acceleration = p5.Vector.add(gravity, drag);

    // Euler integration:
    this.vel.add(p5.Vector.mult(acceleration, dt));
    this.pos.add(p5.Vector.mult(this.vel, dt));
  }

  display() {
    push();
    stroke("yellow");
    translate(this.pos.x, -this.pos.y, this.pos.z);
    sphere(1);
    pop();
    for (const p of this.prevPoints) {
      push();
      stroke("green");
      translate(p.x, -p.y, p.z);
      sphere(0.5);
      pop();
    }
  }

  at(x) {
    const p1 = this.prevPoints.at(-1);
    const p2 = this.pos;
    const t = (x - p1.x) / (p2.x - p1.x);
    if (t < 0 || t > 1) throw Error("Segment does not intersect with x");
    const y = p1.y + t * (p2.y - p1.y);
    const z = p1.z + t * (p2.z - p1.z);
    return createVector(x, y, z);
  }
}
