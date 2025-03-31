import { Projectile } from "/js/projectile.js";
import { Target } from "/js/target.js";

let projectile, target, cam;

window.setup = () => {
  createCanvas(1500, 800, WEBGL);
  debugMode();

  cam = createCamera();
  cam.setPosition(0, -500, 1500);
  setCamera(cam);

  const angle = radians(12);
  const speed = 200;
  const initialVelocity = createVector(speed * cos(angle), speed * sin(angle));
  projectile = new Projectile(0, 0, initialVelocity, 5);
  target = new Target(1000, 50, 100);
};

window.draw = () => {
  background(220);

  projectile.update();
  projectile.display();
  target.display();

  cam.lookAt(projectile.pos.x, projectile.pos.y, 100);

  if (projectile.pos.x >= target.pos.lower.x) {
    const impact = target.impactedBy(projectile);
    if (impact) {
      console.log(`Impact x: ${impact.x} y: ${impact.y}`);
      push();
      stroke("red");
      strokeWeight(5);
      point(impact.x, -impact.y, 0);
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

