// Arms wriggle slowly, and rest while a visitor reaches them.

import { findPieces } from "./find.ts";
import { centreLine, firstWriggle, linePath, outlinePath, type Limb } from "./limb.ts";

const BASE_PACE = 0.00045;
const PACE_STEP = 0.00006;
const SETTLE_TIME = 200;
// Below this flow an arm counts as still.
const AT_REST = 0.002;
const REACHED = ":hover, :focus-within";

/** One arm: its pieces in the scene and its wriggle. */
export interface Arm {
  readonly limb: Limb;
  readonly papers: readonly SVGPathElement[];
  readonly line: SVGPathElement;
  readonly parts: readonly Element[];
  readonly pace: number;
  phase: number;
  flow: number;
}

/** Find each arm's paper, text line, and words. */
export function findArms(scene: Element, limbs: readonly Limb[]): Arm[] {
  return limbs.map((limb, armIndex) => ({
    limb,
    papers: findPieces<SVGPathElement>(scene, `.paper[data-arm="${armIndex}"] path`, 2),
    line: findPieces<SVGPathElement>(scene, `.words [data-arm="${armIndex}"] > path`, 1)[0],
    parts: findPieces(scene, `[data-arm="${armIndex}"]`, 2),
    pace: BASE_PACE + armIndex * PACE_STEP,
    phase: firstWriggle(armIndex).phase,
    flow: 1,
  }));
}

/** Redraw an arm's paper and the line its text follows. */
function pose(arm: Arm): void {
  const points = centreLine(arm.limb.curve, { strength: 1, phase: arm.phase });
  const outline = outlinePath(arm.limb, points);
  for (const paper of arm.papers) {
    paper.setAttribute("d", outline);
  }
  arm.line.setAttribute("d", linePath(points));
}

/** Let each arm drift, and bring a reached arm to rest. */
export function drift(arms: readonly Arm[], elapsed: number): void {
  for (const arm of arms) {
    const reached = arm.parts.some((part) => part.matches(REACHED));
    arm.flow += ((reached ? 0 : 1) - arm.flow) * Math.min(elapsed / SETTLE_TIME, 1);
    if (arm.flow > AT_REST) {
      arm.phase += elapsed * arm.pace * arm.flow;
      pose(arm);
    }
  }
}
