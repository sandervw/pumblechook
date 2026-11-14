// Painted pieces: each piece is one whole painted picture.

import { EYES, RIB } from "../shared/layout.js";
import { centreLine, limbLength, linePath } from "../shared/limb.js";
import { drawRows, layOutOwner, layOutProject, loadMeasure } from "../shared/rows.js";
import { addShape } from "../shared/svg.js";
import { buildSwarm, slideSwarm } from "../shared/swarm.js";
import { OWNER, PROJECTS } from "../shared/words.js";

const STILL = { strength: 0, phase: 0 };
const LID_REST = 0.42;
const ROOT_TUCK = 70;
// A painted arm thins to a point, so text stops early.
const TEXT_REACH = 0.84;
// Each painted arm lies straight from its root to its tip.
const PLACES = [
  { root: [296, 56], tip: [985, 68], thickness: 185, nameSize: 19, textSize: 13 },
  { root: [284, 150], tip: [935, 240], thickness: 165, nameSize: 16, textSize: 11 },
  { root: [240, 200], tip: [800, 352], thickness: 190, nameSize: 18, textSize: 12 },
  { root: [180, 250], tip: [600, 432], thickness: 160, nameSize: 15, textSize: 11 },
  { root: [100, 285], tip: [520, 560], thickness: 230, nameSize: 18, textSize: 12 },
].map((place) => ({ ...place, textStart: 62 }));

/** Place one painted arm and write its words along it. */
function buildArm(parent, place, index, measure) {
  const reach = Math.hypot(place.tip[0] - place.root[0], place.tip[1] - place.root[1]);
  const turn = (Math.atan2(place.tip[1] - place.root[1], place.tip[0] - place.root[0]) * 180) / Math.PI;
  const anchor = addShape(parent, "g", { class: "arm", transform: `translate(${place.root}) rotate(${turn})` });
  const sway = addShape(anchor, "g", { class: "sway" });
  addShape(sway, "image", {
    href: `art/arm-${index + 1}.webp`,
    x: -ROOT_TUCK,
    y: -place.thickness / 2,
    width: reach + ROOT_TUCK,
    height: place.thickness,
    preserveAspectRatio: "none",
    filter: "url(#shadow)",
  });
  addShape(sway, "path", { id: `arm-${index + 1}-line`, d: `M 0 0 L ${reach} 0`, fill: "none" });
  drawRows(sway, layOutProject(PROJECTS[index], place, reach * TEXT_REACH, measure), `arm-${index + 1}-line`);
}

/** Place one painted eye under a lid that slides shut. */
function buildEye(parent, eye, index) {
  const [across, down] = eye.centre;
  const size = eye.radius * 2;
  const group = addShape(parent, "g", { class: "eye", "clip-path": `url(#eye-hole-${index})` });
  const hole = addShape(group, "clipPath", { id: `eye-hole-${index}` });
  addShape(hole, "circle", { cx: across, cy: down, r: eye.radius + 2 });
  // The painted pupil sits dead centre, so the eyeball is shifted.
  const ball = size * 1.6;
  addShape(group, "image", { href: "art/eyeball.webp", x: eye.pupil[0] - ball / 2, y: eye.pupil[1] - ball / 2, width: ball, height: ball });
  addShape(group, "image", {
    class: "lid",
    href: "art/lid.webp",
    x: across - eye.radius - 4,
    y: down - eye.radius - size * (1 - LID_REST) - 4,
    width: size + 8,
    height: size + 4,
    preserveAspectRatio: "none",
    style: `--shut: ${size * (1 - LID_REST) + 4}px`,
  });
}

const measure = await loadMeasure();
const armsGroup = document.querySelector("#arms");
for (const index of [4, 3, 2, 1, 0]) {
  buildArm(armsGroup, PLACES[index], index, measure);
}
const ribLine = centreLine(RIB, STILL);
const ribGroup = document.querySelector("#rib");
addShape(document.querySelector("#rib-art"), "image", { href: "art/rib.webp", ...RIB.art, filter: "url(#shadow)" });
addShape(ribGroup, "path", { id: "rib-line", d: linePath(ribLine), fill: "none" });
drawRows(ribGroup, layOutOwner(OWNER, RIB, limbLength(ribLine) - 30, measure), "rib-line");
EYES.forEach((eye, index) => buildEye(document.querySelector("#eyes"), eye, index));
const swarm = buildSwarm(document.querySelector("#swarm"));
const moment = { last: 0 };

/** Slide the fish one frame and ask for the next. */
function animate(time) {
  slideSwarm(swarm, Math.min(time - moment.last, 100));
  moment.last = time;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
