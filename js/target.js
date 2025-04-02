export class Target {
  constructor(pos, w, h, l) {
    this.pos = pos;
    this.dim = { w, h, l };
    this.centerMass = pos.copy().add(0, h / 2, 0);
    this.borders = {
      topY: pos.y + h,
      bottomY: pos.y,
      leftZ: -(w / 2),
      rightZ: w / 2,
    };
  }

  // pos represents the middle of the bottom edge of the target face.
  // p5.js puts the center of the shape at the origin, so we
  // translate & rotate to treat the center of the bottom edge as pos
  display(impact) {
    push();
    stroke("black");
    strokeWeight(1);
    translate(
      this.pos.x + this.dim.l / 2,
      -(this.pos.y + this.dim.h / 2),
      this.pos.z,
    );
    rotateY(PI / 2);
    box(this.dim.w, this.dim.h, this.dim.l);
    //stroke("red");
    //if (impact) cylinder(10, 5);
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
    const delta = p5.Vector.sub(p, this.centerMass);

    return { impact, delta };
  }
}
