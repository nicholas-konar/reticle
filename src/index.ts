/// <reference types="p5/global" />
import { Projectile } from "./projectile.js";
import { Target } from "./target.js";

let projectile, target, cam, ground;
const distBehindTarget = 1000;

declare global {
  interface Window {
    setup: () => void;
    draw: () => void;
  }
}

window.setup = () => {
  createCanvas(1000, 800, WEBGL);
  // units in cm
  const shooterPosition = createVector(0, 0, 0);
  const cameraPosition = createVector(0, 0, 50);
  // 2000cm ~ 22 yards
  const targetPosition = createVector(20000, 0, 0);
  const targetDimension = createVector(50, 100, 2);

  setupCamera(cameraPosition);
  setupTarget(targetPosition, targetDimension);
  setupProjectile(shooterPosition);

  ground = min(shooterPosition.y, target.borders.bottomY) - 100;
  cam.lookAt(target.pos.x, -target.pos.y, target.pos.z);
};

window.draw = () => {
  background(220);

  target.display();
  projectile.display();
  setupGroundPlane();

  projectile.update();
  projectile.displayTrail();

  if (projectile.pos.x >= target.pos.x) {
    const px = projectile.at(target.pos.x);
    const { impact, delta } = target.impactedBy(px);

    const report = generateReport(impact, delta);
    console.log(report);

    if (impact) {
      target.displayImpact(px);
      console.log(projectile.trail);
      noLoop();
    }
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

function setupTarget(pos, dim) {
  target = new Target(pos, dim);
}

function setupProjectile(pos) {
  const angle = radians(0);
  const windage = radians(0);
  const speed = 3000;
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

  if (report.length > 2) report.splice(2, 0, "and");
  report.push("from center mass.");

  return report.join(" ");
}
