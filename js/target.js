export class Target {
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
    const b = projectile.prev;
    const c = this.pos.lower;
    const d = this.pos.upper;
    return this.#intersects2D(a, b, c, d);
  }
}
