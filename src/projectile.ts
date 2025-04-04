import p5 from "p5";
import constants from "./constants";

export class Projectile {
  constructor(pos, velocity, size) {
    this.pos = pos;
    this.vel = velocity.copy();
    this.size = size;
    this.trail = [pos.copy()];
  }

  update() {
    const { dt, g, k } = constants;
    const gravity = createVector(0, -g, 0);
    const drag = this.vel.copy().mult(-k);
    const acceleration = p5.Vector.add(gravity, drag);

    // Euler integration:
    this.vel.add(p5.Vector.mult(acceleration, dt));
    this.pos.add(p5.Vector.mult(this.vel, dt));
    this.trail.push(this.pos.copy());
  }

  display() {
    push();
    stroke("black");
    translate(this.pos.x, -this.pos.y, this.pos.z);
    sphere(1);
    pop();
  }

  displayTrail(color = "green") {
    push();
    noFill();
    stroke(color);
    beginShape();
    for (const p of this.trail) {
      const { x, y, z } = p;
      vertex(x, -y, z);
    }
    endShape();
    pop();
  }

  at(x) {
    const [p1, p2] = this.trail.slice(-2);
    const t = (x - p1.x) / (p2.x - p1.x);
    // Todo: error handling
    if (t < 0 || t > 1) throw Error("Segment does not intersect with x");
    const y = p1.y + t * (p2.y - p1.y);
    const z = p1.z + t * (p2.z - p1.z);
    return createVector(x, y, z);
  }
}
