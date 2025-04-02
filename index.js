import { Projectile } from "/js/projectile.js";
import { Target } from "/js/target.js";

let projectile, target, cam;

window.setup = () => {
  createCanvas(1000, 800, WEBGL);
  debugMode();

  cam = createCamera();
  cam.setPosition(100, -50, 250);
  setCamera(cam);

  const angle = radians(32);
  const windage = radians(2);
  const speed = 100;
  const initialProjectilePos = createVector(0, 0, 0);
  const initialVelocity = createVector(
    speed * cos(angle),
    speed * sin(angle),
    speed * sin(windage),
  );
  projectile = new Projectile(initialProjectilePos, initialVelocity, 5);

  const initialTargetPos = createVector(250, 0, 0);
  target = new Target(initialTargetPos, 50, 100, 2);
};

window.draw = () => {
  background(220);

  target.display();
  projectile.update();
  projectile.display();

  cam.lookAt(projectile.pos.x, -projectile.pos.y - 50, 100);

  if (projectile.pos.x >= target.pos.x) {
    const px = projectile.at(target.pos.x);
    const impact = target.impactedBy(px);
    if (impact) {
      push();
      stroke("red");
      strokeWeight(5);
      point(impact.x, -impact.y, 0);
      pop();
    }
    noLoop();
  }

  const outOfFrame =
    projectile.pos.x < 0 ||
    projectile.pos.x > width ||
    projectile.pos.y < 0 ||
    projectile.pos.y > height;

  if (outOfFrame)
    noLoop(), console.log("Projectile out of frame", projectile.pos);
};
