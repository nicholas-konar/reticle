import { Projectile } from "/js/projectile.js";
import { Target } from "/js/target.js";

let projectile, target;

window.setup = () => {
  createCanvas(1500, 800);
  const angle = radians(20);
  const speed = 500;
  const initialVelocity = createVector(speed * cos(angle), speed * sin(angle));
  projectile = new Projectile(0, 100, initialVelocity, 5);
  target = new Target(width * 0.9, 500, 100);
};

window.draw = () => {
  background(220);
  translate(0, height);
  scale(1, -1);

  projectile.update();
  projectile.display();
  target.display();

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

  const outOfFrame =
    projectile.pos.x < 0 ||
    projectile.pos.x > width ||
    projectile.pos.y < 0 ||
    projectile.pos.y > height;

  if (outOfFrame) noLoop();
};

