import { Projectile } from "/js/projectile.js";
import { Target } from "/js/target.js";

let projectile, target, cam, ground;
const distBehindTarget = 100;

window.setup = () => {
  createCanvas(1000, 800, WEBGL);
  const shooterPosition = createVector(0, 0, 0);
  const cameraPosition = createVector(-100, 50, 50);
  const targetPosition = createVector(1000, 100, 0);

  setupCamera(cameraPosition);
  setupTarget(targetPosition);
  setupProjectile(shooterPosition);

  ground = min(shooterPosition.y, target.borders.bottomY) - 5;
  cam.lookAt(target.pos.x, -target.pos.y, target.pos.z);
};

window.draw = () => {
  background(220);

  target.display();
  projectile.update();
  projectile.display();
  setupGroundPlane();

  if (projectile.pos.x >= target.pos.x) {
    const px = projectile.at(target.pos.x);
    const { impact, delta } = target.impactedBy(px);

    if (impact) target.displayImpact(px), noLoop();

    const report = generateReport(impact, delta);
    console.log(report);

    projectile.displayTrail();
  }

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
  const angle = radians(6);
  const windage = radians(0);
  const speed = 1000;
  const initialVelocity = createVector(
    speed * cos(angle),
    speed * sin(angle),
    speed * sin(windage),
  );
  projectile = new Projectile(pos, initialVelocity, 5);
}

function setupGroundPlane() {
  const x = target.pos.x + distBehindTarget;
  push();
  translate(target.pos.x / 2, -ground, 0);
  rotateX(PI / 2);
  fill("grey");
  plane(x, 500);
  pop();
}

function generateReport(impact, delta) {
  // e.g. "Impact. 12.173758895194497 units low and 8.75820177756227 units left from center mass."
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
