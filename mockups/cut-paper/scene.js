// Cut paper: painted sheets, cut by outlines drawn here.

import { ARMS, EYES, RIB, fishSpots } from "../shared/layout.js";
import { centreLine, limbLength, linePath, outlinePath } from "../shared/limb.js";
import { drawRows, layOutRows, loadMeasure } from "../shared/rows.js";
import { addShape } from "../shared/svg.js";
import { OWNER, PROJECTS } from "../shared/words.js";

const STILL = { strength: 0, phase: 0 };
const LID_REST = 0.42;
const BLINK_EVERY = 4300;
const BLINK_LASTS = 280;

/** Move a limb's paint, shade, and text line to a pose. */
function pose(piece, wriggle) {
  const points = centreLine(piece.limb, wriggle);
  const outline = outlinePath(piece.limb, points);
  piece.paint.setAttribute("d", outline);
  piece.shade.setAttribute("d", outline);
  piece.line.setAttribute("d", linePath(points));
}

/** Cut one limb from a sheet and write its words. */
function buildLimb(parent, entry, measure) {
  const group = addShape(parent, "g", {});
  const paper = addShape(group, "g", { filter: "url(#cut)" });
  const piece = {
    limb: entry.limb,
    paint: addShape(paper, "path", { fill: `url(#${entry.sheet})` }),
    shade: addShape(paper, "path", { fill: `url(#${entry.shade})` }),
    line: addShape(group, "path", { id: `${entry.id}-line`, fill: "none" }),
    strength: 0,
    held: false,
  };
  pose(piece, STILL);
  const room = limbLength(centreLine(entry.limb, STILL));
  drawRows(group, layOutRows(entry.words, entry.limb, room, measure), `${entry.id}-line`);
  group.addEventListener("pointerenter", () => (piece.held = true));
  group.addEventListener("pointerleave", () => (piece.held = false));
  return piece;
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

/** Set a lid for this moment of the blink cycle. */
function blink(lid, time) {
  const beat = (time + lid.eye.delay) % BLINK_EVERY;
  const shut = beat < BLINK_LASTS ? Math.sin((Math.PI * beat) / BLINK_LASTS) : 0;
  const outline = lidPath(lid.eye, LID_REST + (1 - LID_REST) * shut);
  lid.paint.setAttribute("d", outline);
  lid.shade.setAttribute("d", outline);
}

/** Ease each arm toward its wriggle and redraw the moving ones. */
function wriggle(arms, time) {
  for (const arm of arms) {
    arm.strength += ((arm.held ? 1 : 0) - arm.strength) * 0.07;
    if (arm.strength > 0.002) {
      pose(arm, { strength: arm.strength, phase: time * 0.006 });
    }
  }
}

const measure = await loadMeasure();
const armsGroup = document.querySelector("#arms");
const armEntries = ARMS.map((limb, index) => ({
  limb,
  id: `arm-${index + 1}`,
  sheet: "rust-dark",
  shade: "glow",
  words: PROJECTS[index],
}));
const arms = armEntries.toReversed().map((entry) => buildLimb(armsGroup, entry, measure));
const ribEntry = { limb: RIB, id: "rib", sheet: "bone", shade: "rib-shade", words: OWNER };
buildLimb(document.querySelector("#rib"), ribEntry, measure);
const lids = EYES.map((eye) => buildEye(document.querySelector("#eyes"), eye));
for (const fish of fishSpots()) {
  const place = `translate(${fish.across} ${fish.down}) rotate(${fish.tilt}) scale(${fish.scale})`;
  addShape(document.querySelector("#swarm"), "use", { href: "#fish", transform: place });
}

/** Draw one frame and ask for the next. */
function animate(time) {
  wriggle(arms, time);
  for (const lid of lids) {
    blink(lid, time);
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
