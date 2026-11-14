// Cut-paper arms, eyes, and colour over painted pieces.

import { ARMS, EYES, RIB } from "../shared/layout.js";
import { centreLine, limbLength, linePath, outlinePath } from "../shared/limb.js";
import { drawRows, layOutOwner, layOutProject, loadMeasure } from "../shared/rows.js";
import { addShape } from "../shared/svg.js";
import { buildSwarm, slideSwarm } from "../shared/swarm.js";
import { OWNER, PROJECTS } from "../shared/words.js";

const STILL = { strength: 0, phase: 0 };
// Text stops short of the narrow tip.
const TEXT_REACH = 0.9;
const LID_REST = 0.42;
const BLINK_LASTS = 650;

/** Redraw an arm's paint, shade, and text line. */
function pose(arm) {
  const points = centreLine(arm.limb, { strength: 1, phase: arm.phase });
  const outline = outlinePath(arm.limb, points);
  arm.paint.setAttribute("d", outline);
  arm.shade.setAttribute("d", outline);
  arm.line.setAttribute("d", linePath(points));
}

/** Cut one arm from a sheet and write its project along it. */
function buildArm(parent, index, measure) {
  const limb = ARMS[index];
  const group = addShape(parent, "g", {});
  const paper = addShape(group, "g", { filter: "url(#cut)" });
  const arm = {
    limb,
    paint: addShape(paper, "path", { fill: "url(#rust-dark)" }),
    shade: addShape(paper, "path", { fill: "url(#glow)" }),
    line: addShape(group, "path", { id: `arm-${index}-line`, fill: "none" }),
    phase: index * 1.3,
    pace: 0.00045 + index * 0.00006,
    flow: 1,
    held: false,
  };
  pose(arm);
  const room = limbLength(centreLine(limb, STILL)) * TEXT_REACH;
  drawRows(group, layOutProject(PROJECTS[index], limb, room, measure), `arm-${index}-line`);
  for (const [event, held] of [["pointerenter", true], ["pointerleave", false], ["focusin", true], ["focusout", false]]) {
    group.addEventListener(event, () => {
      arm.held = held;
    });
  }
  return arm;
}

/** Let each arm drift, and bring a held arm to rest. */
function drift(arms, elapsed) {
  for (const arm of arms) {
    arm.flow += ((arm.held ? 0 : 1) - arm.flow) * Math.min(elapsed / 200, 1);
    if (arm.flow > 0.002) {
      arm.phase += elapsed * arm.pace * arm.flow;
      pose(arm);
    }
  }
}

/** Place the painted rib and write the owner's mark along it. */
function buildRib(measure) {
  addShape(document.querySelector("#rib-art"), "image", { href: "../painted-pieces/art/rib.webp", ...RIB.art, filter: "url(#bone)" });
  const points = centreLine(RIB, STILL);
  const group = document.querySelector("#rib");
  addShape(group, "path", { id: "rib-line", d: linePath(points), fill: "none" });
  drawRows(group, layOutOwner(OWNER, RIB, RIB.textEnd, measure), "rib-line");
}

/** Return the lid's outline when it covers part of an eye. */
function lidPath(eye, cover) {
  const radius = eye.radius + 3;
  const [across, down] = eye.centre;
  const chord = down - radius + 2 * radius * Math.min(cover, 0.985);
  const half = Math.sqrt(radius ** 2 - (chord - down) ** 2);
  const large = cover > 0.5 ? 1 : 0;
  return `M ${across - half} ${chord} A ${radius} ${radius} 0 ${large} 1 ${across + half} ${chord} Z`;
}

/** Build one eye: eyeball, pupil, and a lid on top. */
function buildEye(parent, eye) {
  const [across, down] = eye.centre;
  const ball = { cx: across, cy: down, r: eye.radius };
  addShape(parent, "circle", { ...ball, fill: "url(#yellow)", filter: "url(#shadow)" });
  addShape(parent, "circle", { ...ball, fill: "url(#eye-glow)" });
  addShape(parent, "circle", { cx: eye.pupil[0], cy: eye.pupil[1], r: eye.pupilRadius, fill: "#17110b" });
  const lid = addShape(parent, "g", { filter: "url(#shadow)" });
  return {
    eye,
    paint: addShape(lid, "path", { fill: "url(#rust-dark)" }),
    shade: addShape(lid, "path", { fill: "url(#glow)" }),
  };
}

/** Return when each eye next starts to blink. */
function planBlink(time) {
  const start = time + 6000 + Math.random() * 7000;
  return EYES.map(() => start + Math.random() * 320);
}

/** Set each lid for this moment of its blink. */
function blink(lids, starts, time) {
  lids.forEach((lid, index) => {
    const beat = time - starts[index];
    const shut = beat > 0 && beat < BLINK_LASTS ? Math.sin((Math.PI * beat) / BLINK_LASTS) : 0;
    const outline = lidPath(lid.eye, LID_REST + (1 - LID_REST) * shut);
    lid.paint.setAttribute("d", outline);
    lid.shade.setAttribute("d", outline);
  });
}

const measure = await loadMeasure();
const armsGroup = document.querySelector("#arms");
const arms = [4, 3, 2, 1, 0].map((index) => buildArm(armsGroup, index, measure));
buildRib(measure);
const lids = EYES.map((eye) => buildEye(document.querySelector("#eyes"), eye));
const swarm = buildSwarm(document.querySelector("#swarm"));
const moment = { last: 0, blinks: planBlink(0) };

/** Draw one frame and ask for the next. */
function animate(time) {
  const elapsed = Math.min(time - moment.last, 100);
  moment.last = time;
  drift(arms, elapsed);
  slideSwarm(swarm, elapsed);
  if (time > Math.max(...moment.blinks) + BLINK_LASTS) {
    moment.blinks = planBlink(time);
  }
  blink(lids, moment.blinks, time);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
