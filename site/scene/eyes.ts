// The creature's eyes blink slowly and seldom.

import { findPieces } from "./find.ts";
import type { Point } from "./limb.ts";

const BLINK_LASTS = 650;
const SHORTEST_WAIT = 6000;
const WAIT_SPREAD = 7000;
// The eyes blink a fraction of a second apart.
const EYE_LAG = 320;

/** How much of an eye its lid covers between blinks. */
export const LID_REST = 0.42;

/** One eye: its eyeball and its pupil. */
export interface Eye {
  readonly centre: Point;
  readonly radius: number;
  readonly pupil: Point;
  readonly pupilRadius: number;
}

/** The eyes, their lids, and when each next blinks. */
export interface Gaze {
  readonly eyes: readonly Eye[];
  readonly lids: readonly (readonly SVGPathElement[])[];
  starts: readonly number[];
}

/** Return the lid's outline when it covers part of an eye. */
export function lidPath(eye: Eye, cover: number): string {
  const radius = eye.radius + 3;
  const [across, down] = eye.centre;
  const chord = down - radius + 2 * radius * Math.min(cover, 0.985);
  const half = Math.sqrt(radius ** 2 - (chord - down) ** 2);
  const large = cover > 0.5 ? 1 : 0;
  return `M ${across - half} ${chord} A ${radius} ${radius} 0 ${large} 1 ${across + half} ${chord} Z`;
}

/** Return when each eye next starts to blink. */
function planBlink(eyes: readonly Eye[], time: number, random: () => number): number[] {
  const start = time + SHORTEST_WAIT + random() * WAIT_SPREAD;
  return eyes.map(() => start + random() * EYE_LAG);
}

/** Find each eye's lid, and plan the first blink. */
export function findEyes(scene: Element, eyes: readonly Eye[], random: () => number): Gaze {
  const lids = findPieces(scene, ".lid", eyes.length).map((lid) => findPieces<SVGPathElement>(lid, "path", 2));
  return { eyes, lids, starts: planBlink(eyes, 0, random) };
}

/** Set each lid for this moment, then plan the next blink. */
export function blink(gaze: Gaze, time: number, random: () => number): void {
  if (time > Math.max(...gaze.starts) + BLINK_LASTS) {
    gaze.starts = planBlink(gaze.eyes, time, random);
  }
  gaze.eyes.forEach((eye, eyeIndex) => {
    const beat = time - gaze.starts[eyeIndex];
    const shut = beat > 0 && beat < BLINK_LASTS ? Math.sin((Math.PI * beat) / BLINK_LASTS) : 0;
    const outline = lidPath(eye, LID_REST + (1 - LID_REST) * shut);
    for (const paper of gaze.lids[eyeIndex]) {
      paper.setAttribute("d", outline);
    }
  });
}
