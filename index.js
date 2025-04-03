import { Projectile } from "/js/projectile.js";
import { Target } from "/js/target.js";

let projectile, target, cam, ground;

window.setup = () => {
  createCanvas(1000, 800, WEBGL);
  debugMode();
  const shooterPosition = createVector(0, 0, 0);
  const cameraPosition = createVector(150, 50, 250);
  const targetPosition = createVector(250, 0, 0);

  setupCamera(cameraPosition);
  setupTarget(targetPosition);
  setupProjectile(shooterPosition);
  setupGroundPlane(shooterPosition, target);

  cam.lookAt(target.pos.x, -target.pos.y, target.pos.z);
};

window.draw = () => {
  background(220);

  target.display();
  projectile.update();
  projectile.display();

  if (projectile.pos.x >= target.pos.x) {
    const px = projectile.at(target.pos.x);
    const { impact, delta } = target.impactedBy(px);

    if (impact) target.displayImpact(px), noLoop();

    const report = generateReport(impact, delta);
    console.log(report);

    projectile.displayTrail();
  }

  const distBehindTarget = 100;
  const outOfFrame =
    projectile.pos.x < 0 ||
    projectile.pos.x > target.pos.x + distBehindTarget ||
    projectile.pos.y < ground;
  if (outOfFrame) {
    projectile.displayTrail();
    console.log("Projectile out of frame", projectile.pos);
    noLoop();
  }
};

function setupCamera(pos) {
  cam = createCamera();
  cam.setPosition(pos.x, -pos.y, pos.z);
  setCamera(cam);
}

function setupTarget(pos) {
  target = new Target(pos, 50, 100, 2);
}

function setupProjectile(pos) {
  const angle = radians(5);
  const windage = radians(-2);
  const speed = 100;
  const initialVelocity = createVector(
    speed * cos(angle),
    speed * sin(angle),
    speed * sin(windage),
  );
  projectile = new Projectile(pos, initialVelocity, 5);
}

function setupGroundPlane(shooter, target) {
  ground = min(shooter.y, target.borders.bottomY) - 5;
  push();
  plane();
  pop();
}

function generateReport(impact, delta) {
  let report = [impact ? "Impact." : "Missed."];

  if (delta.y > target.pos.y) {
    report.push(`${abs(delta.y)} units high`);
  } else if (delta.y < target.pos.y) {
    report.push(`${abs(delta.y)} units low`);
  }

  if (delta.z > target.pos.z) {
    report.push(`${abs(delta.z)} units right`);
  } else if (delta.z < target.pos.z) {
    report.push(`${abs(delta.z)} units left`);
  }

  if (report.length > 1) report.splice(2, 0, "and");
  report.push("from center mass.");

  return report.join(" ");
}
