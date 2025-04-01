export class Target {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    push();
    stroke("grey");
    strokeWeight(1);
    translate(this.x, -(this.y + this.h / 2), 0);
    rotateY(PI / 2);
    box(this.w, this.h, 5);
    pop();
  }

  #intersects2D(a, b, c, d) {
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

  impactedBy(projectile) {
    const a = projectile.pos;
    const b = projectile.prevPoints.at(-1);
    const c = createVector(this.x, this.y + this.h);
    const d = createVector(this.x, this.y);
    return this.#intersects2D(a, b, c, d);
  }
}
