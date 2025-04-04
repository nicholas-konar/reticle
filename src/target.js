import p5 from "p5";

export class Target {
  constructor(pos, dim) {
    this.pos = pos;
    this.dim = { w: dim.x, h: dim.y, l: dim.z };
    this.borders = {
      topY: pos.y + dim.y / 2,
      bottomY: pos.y - dim.y / 2,
      leftZ: -(dim.x / 2),
      rightZ: dim.x / 2,
    };
  }

  display() {
    push();
    stroke("black");
    strokeWeight(1);
    translate(this.pos.x + this.dim.l / 2, -this.pos.y, this.pos.z);
    rotateY(PI / 2);
    box(this.dim.w, this.dim.h, this.dim.l);
    pop();
  }

  displayImpact(p) {
    push();
    stroke("red");
    translate(p.x, -p.y, p.z);
    rotateZ(PI / 2);
    cylinder(1, 0);
    pop();
  }

  impactedBy(p) {
    const { x, y, z } = p;
    const { topY, bottomY, leftZ, rightZ } = this.borders;

    const checkX = x === x;
    const checkY = p.y <= topY && bottomY <= p.y;
    const checkZ = p.z <= rightZ && leftZ <= p.z;

    const impact = checkX && checkY && checkZ;
    const delta = p5.Vector.sub(p, this.pos);

    return { impact, delta };
  }
}
