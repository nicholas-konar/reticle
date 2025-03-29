export class Projectile {
  constructor(x, y, velocity, size) {
    this.pos = createVector(x, y);
    this.vel = velocity.copy();
    this.prev = undefined;
    this.size = size;
    console.log("projectile initialized");
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
