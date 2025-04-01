import { Projectile } from "/js/projectile.js";
import { Target } from "/js/target.js";

let projectile, target, cam;

window.setup = () => {
  createCanvas(1000, 800, WEBGL);
  debugMode();

  cam = createCamera();
  cam.setPosition(100, -50, 250);
  setCamera(cam);

  const angle = radians(20);
  const windage = radians(4);
  const speed = 100;
  const initialPos = createVector(0, 0, 0);
  const initialVelocity = createVector(
    speed * cos(angle),
    speed * sin(angle),
    speed * sin(windage),
  );
  projectile = new Projectile(initialPos, initialVelocity, 5);
  target = new Target(300, 0, 50, 100);
};

window.draw = () => {
  background(220);

  projectile.update();
  projectile.display();
  target.display();

  cam.lookAt(projectile.pos.x, -projectile.pos.y - 50, 100);

  if (projectile.pos.x >= target.x) {
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

  if (outOfFrame)
    noLoop(), console.log("Projectile out of frame", projectile.pos);
};
