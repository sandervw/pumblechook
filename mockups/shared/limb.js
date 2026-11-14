// A limb is an arm or the rib: a tapered band.

const STEPS = 32;
const WAVE_REACH = 16;

/** Return the heading of the centre line at one step. */
function headingAt(points, step) {
  const before = points[Math.max(step - 1, 0)];
  const after = points[Math.min(step + 1, points.length - 1)];
  return Math.atan2(after[1] - before[1], after[0] - before[0]);
}

/** Return a point moved sideways from the centre line. */
function shift(point, heading, sideOffset) {
  return [point[0] - Math.sin(heading) * sideOffset, point[1] + Math.cos(heading) * sideOffset];
}

/** Return a point as path text. */
function spot(point) {
  return `${point[0].toFixed(1)} ${point[1].toFixed(1)}`;
}

/** Return points along a limb's centre line, bent by a wriggle. */
export function centreLine(limb, wriggle) {
  const [start, bend, end] = limb.curve;
  const still = [];
  for (let step = 0; step <= STEPS; step += 1) {
    const progress = step / STEPS;
    const weights = [(1 - progress) ** 2, 2 * (1 - progress) * progress, progress ** 2];
    still.push([
      weights[0] * start[0] + weights[1] * bend[0] + weights[2] * end[0],
      weights[0] * start[1] + weights[1] * bend[1] + weights[2] * end[1],
    ]);
  }
  return still.map((point, step) => {
    const progress = step / STEPS;
    const swing = wriggle.strength * WAVE_REACH * progress ** 1.3 * Math.sin(progress * 7 - wriggle.phase);
    return shift(point, headingAt(still, step), swing);
  });
}

/** Return the length of a centre line. */
export function limbLength(points) {
  return points.slice(1).reduce((total, point, step) => total + Math.hypot(point[0] - points[step][0], point[1] - points[step][1]), 0);
}

/** Return the path along a limb's centre. */
export function linePath(points) {
  return `M ${points.map(spot).join(" L ")}`;
}

/** Return the path around a limb, with a round tip. */
export function outlinePath(limb, points) {
  const last = points.length - 1;
  const lump = (step) => 1 + 0.05 * Math.sin(step * 0.6 + limb.rootWidth);
  const halfWidth = (step) => ((limb.rootWidth + ((limb.tipWidth - limb.rootWidth) * step) / last) / 2) * lump(step);
  const upper = points.map((point, step) => shift(point, headingAt(points, step), -halfWidth(step)));
  const lower = points.map((point, step) => shift(point, headingAt(points, step), halfWidth(step)));
  const rootHeading = headingAt(points, 0);
  const tucked = (point) => [point[0] - Math.cos(rootHeading) * limb.tuck, point[1] - Math.sin(rootHeading) * limb.tuck];
  const topEdge = [tucked(upper[0]), ...upper].map(spot).join(" L ");
  const bottomEdge = [...lower.toReversed(), tucked(lower[0])].map(spot).join(" L ");
  const tipRadius = halfWidth(last).toFixed(1);
  return `M ${topEdge} A ${tipRadius} ${tipRadius} 0 0 1 ${bottomEdge} Z`;
}
