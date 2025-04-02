export class Target {
  constructor(pos, w, h, l) {
    this.pos = pos;
    this.dim = { w, h, l };
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
  display() {
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
    pop();
  }

  impactedBy(p) {
    const { topY, bottomY, leftZ, rightZ } = this.borders;
    const { x, y, z } = p;
    const checkX = x === x;
    const checkY = p.y <= topY && bottomY <= p.y;
    const checkZ = p.z <= rightZ && leftZ <= p.y;
    if (checkX && checkY && checkZ) {
      console.log("impact", p);
      return true;
    } else {
      console.log("missed", { checkX, checkY, checkZ, topY }, p);
      return false;
    }
  }
}
