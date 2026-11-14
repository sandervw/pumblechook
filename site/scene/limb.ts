// A limb is an arm or the rib: a tapered band.

const STEPS = 64;
// Scissors leave each edge a little uneven, in scene units.
const SNIP_REACH = 1.8;
const WAVE_REACH = 16;
const PHASE_GAP = 1.3;

/** A spot in the scene: across, then down. */
export type Point = readonly [number, number];

/** A line from a start, round a bend, to an end. */
export type Curve = readonly [Point, Point, Point];

/** A tapered band along a curve, tucked under the body. */
export interface Limb {
  readonly curve: Curve;
  readonly rootWidth: number;
  readonly tipWidth: number;
  readonly tuck: number;
}

/** How hard a limb bends, and where in its cycle. */
export interface Wriggle {
  readonly strength: number;
  readonly phase: number;
}

/** A limb at rest. */
export const STILL: Wriggle = { strength: 0, phase: 0 };

/** Return the wriggle an arm starts with. */
export function firstWriggle(armIndex: number): Wriggle {
  return { strength: 1, phase: armIndex * PHASE_GAP };
}

/** Return the heading of the centre line at one step. */
function headingAt(points: readonly Point[], step: number): number {
  const before = points[Math.max(step - 1, 0)];
  const after = points[Math.min(step + 1, points.length - 1)];
  return Math.atan2(after[1] - before[1], after[0] - before[0]);
}

/** Return a point moved sideways from the centre line. */
function shift(point: Point, heading: number, sideOffset: number): Point {
  return [point[0] - Math.sin(heading) * sideOffset, point[1] + Math.cos(heading) * sideOffset];
}

/** Return a point as path text. */
function spot(point: Point): string {
  return `${point[0].toFixed(1)} ${point[1].toFixed(1)}`;
}

/** Return points along a curve, bent by a wriggle. */
export function centreLine(curve: Curve, wriggle: Wriggle): Point[] {
  const [start, bend, end] = curve;
  const still: Point[] = [];
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

/** A rectangle of the scene: left, top, width, height. */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Return a fixed box holding a limb and its shadow. */
export function reachBox(limb: Limb): Box {
  const margin = limb.rootWidth / 2 + limb.tuck + WAVE_REACH + 12;
  const points = centreLine(limb.curve, STILL);
  const acrosses = points.map((point) => point[0]);
  const downs = points.map((point) => point[1]);
  const left = Math.floor(Math.min(...acrosses) - margin);
  const top = Math.floor(Math.min(...downs) - margin);
  return {
    x: left,
    y: top,
    width: Math.ceil(Math.max(...acrosses) + margin) - left,
    height: Math.ceil(Math.max(...downs) + margin) - top,
  };
}

/** Return the length of a centre line. */
export function limbLength(points: readonly Point[]): number {
  return points
    .slice(1)
    .reduce((total, point, step) => total + Math.hypot(point[0] - points[step][0], point[1] - points[step][1]), 0);
}

/** Return the path along a limb's centre. */
export function linePath(points: readonly Point[]): string {
  return `M ${points.map(spot).join(" L ")}`;
}

/** Return the path around a limb, with a round tip. */
export function outlinePath(limb: Limb, points: readonly Point[]): string {
  const last = points.length - 1;
  const lump = (step: number) => 1 + 0.05 * Math.sin(step * 0.3 + limb.rootWidth);
  const halfWidth = (step: number) => ((limb.rootWidth + ((limb.tipWidth - limb.rootWidth) * step) / last) / 2) * lump(step);
  const snip = (step: number, side: number) =>
    SNIP_REACH * (0.6 * Math.sin(step * 0.9 + side * 2.1 + limb.rootWidth) + 0.4 * Math.sin(step * 2.3 + side * 5.7));
  const upper = points.map((point, step) => shift(point, headingAt(points, step), -halfWidth(step) - snip(step, 0)));
  const lower = points.map((point, step) => shift(point, headingAt(points, step), halfWidth(step) + snip(step, 1)));
  const rootHeading = headingAt(points, 0);
  const tucked = (point: Point): Point => [
    point[0] - Math.cos(rootHeading) * limb.tuck,
    point[1] - Math.sin(rootHeading) * limb.tuck,
  ];
  const topEdge = [tucked(upper[0]), ...upper].map(spot).join(" L ");
  const bottomEdge = [...[...lower].reverse(), tucked(lower[0])].map(spot).join(" L ");
  const tipRadius = halfWidth(last).toFixed(1);
  return `M ${topEdge} A ${tipRadius} ${tipRadius} 0 0 1 ${bottomEdge} Z`;
}
