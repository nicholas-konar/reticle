import { Projectile } from "/js/projectile.js";
import { Target } from "/js/target.js";

let projectile, target, cam;

window.setup = () => {
  createCanvas(1000, 800, WEBGL);
  debugMode();

  cam = createCamera();
  cam.setPosition(150, -50, 250);
  setCamera(cam);

  const angle = radians(13);
  const windage = radians(-2);
  const speed = 100;
  const initialProjectilePos = createVector(0, 0, 0);
  const initialVelocity = createVector(
    speed * cos(angle),
    speed * sin(angle),
    speed * sin(windage),
  );
  projectile = new Projectile(initialProjectilePos, initialVelocity, 5);

  const initialTargetPos = createVector(350, 0, 0);
  target = new Target(initialTargetPos, 50, 100, 2);

  cam.lookAt(
    initialTargetPos.x / 2,
    -initialTargetPos.y - 50,
    initialTargetPos.z,
  );
};

window.draw = () => {
  background(220);

  target.display();
  projectile.update();
  projectile.display();

  //cam.lookAt(projectile.pos.x, -projectile.pos.y - 50, 0);

  if (projectile.pos.x >= target.pos.x) {
    const px = projectile.at(target.pos.x);
    const { impact, delta } = target.impactedBy(px);
    console.log({ impact, delta });

    if (impact) target.displayImpact(px);

    const report = generateReport(impact, delta);
    console.log(report);

    projectile.displayTrail();
    noLoop();
  }

  const outOfFrame =
    projectile.pos.x < 0 ||
    projectile.pos.x > width ||
    projectile.pos.y < 0 ||
    projectile.pos.y > height;

  if (outOfFrame) {
    projectile.displayTrail();
    console.log("Projectile out of frame", projectile.pos);
    noLoop();
  }
};

function generateReport(impact, delta) {
  let report = [impact ? "Impact." : "Missed."];

  if (delta.y > 0) {
    report.push(`${abs(delta.y)} units high`);
  } else if (delta.y < 0) {
    report.push(`${abs(delta.y)} units low`);
  }

  if (delta.z > 0) {
    report.push(`${abs(delta.z)} units right`);
  } else if (delta.z < 0) {
    report.push(`${abs(delta.z)} units left`);
  }

  if (report.length > 1) report.splice(2, 0, "and");
  report.push("from center mass.");

  return report.join(" ");
}
