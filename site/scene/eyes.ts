// The creature's eyes blink unevenly, and stare back at a pointer.

import { findPieces } from "./find.ts";
import type { Point } from "./limb.ts";

// A lid falls, rests shut a moment, then lifts.
const CLOSING = 420;
const SHUT = 60;
const OPENING = 330;
const BLINK_LASTS = CLOSING + SHUT + OPENING;
const SHORTEST_WAIT = 2500;
const WAIT_SPREAD = 9500;
// Now and then a blink follows hard on the last.
const SECOND_BLINK_CHANCE = 0.25;
const SECOND_BLINK_WAIT = 180;
// The eyes blink a fraction of a second apart.
const EYE_LAG = 320;
// A staring eye: lid almost gone, eyeball swollen, shaking.
const LID_WIDE = 0.04;
const STARE_SWELL = 0.14;
const SHUDDER_SHARE = 0.03;
const SETTLE_TIME = 160;
const REACHED = ":hover";

/** How much of an eye its lid covers between blinks. */
export const LID_REST = 0.42;

/** One eye: its eyeball and its pupil. */
export interface Eye {
  readonly centre: Point;
  readonly radius: number;
  readonly pupil: Point;
  readonly pupilRadius: number;
}

/** The eyes, their lids, their next blinks, and their stares. */
export interface Gaze {
  readonly eyes: readonly Eye[];
  readonly pieces: readonly Element[];
  readonly lids: readonly (readonly SVGPathElement[])[];
  readonly stares: number[];
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

/** Return how shut a lid is; it slows as it shuts. */
export function shutAt(beat: number): number {
  if (beat <= 0 || beat >= BLINK_LASTS) {
    return 0;
  }
  if (beat < CLOSING) {
    return 1 - (1 - beat / CLOSING) ** 3;
  }
  const rise = Math.max(beat - CLOSING - SHUT, 0) / OPENING;
  return 1 - rise * rise * (3 - 2 * rise);
}

/** Return a long wait before a blink. */
function longWait(random: () => number): number {
  return SHORTEST_WAIT + random() * WAIT_SPREAD;
}

/** Return the wait after a blink: long, or now and then short. */
function nextWait(random: () => number): number {
  return random() < SECOND_BLINK_CHANCE ? SECOND_BLINK_WAIT : longWait(random);
}

/** Return when each eye starts its blink, slightly apart. */
function planBlink(eyes: readonly Eye[], start: number, random: () => number): number[] {
  return eyes.map(() => start + random() * EYE_LAG);
}

/** Return the transform that swells and shakes a staring eye. */
function stareTransform(eye: Eye, stare: number, time: number): string {
  const reach = eye.radius * SHUDDER_SHARE * stare;
  const [across, down] = eye.centre;
  const shakeAcross = reach * (Math.sin(time * 0.083) + 0.5 * Math.sin(time * 0.191));
  const shakeDown = reach * (Math.sin(time * 0.071 + 1) + 0.5 * Math.sin(time * 0.167));
  const scale = 1 + STARE_SWELL * stare;
  return `translate(${across + shakeAcross} ${down + shakeDown}) scale(${scale}) translate(${-across} ${-down})`;
}

/** Find each eye and its lid, and plan the first blink. */
export function findEyes(scene: Element, eyes: readonly Eye[], random: () => number): Gaze {
  const pieces = findPieces(scene, ".eye", eyes.length);
  const lids = pieces.map((piece) => findPieces<SVGPathElement>(piece, ".lid path", 2));
  return { eyes, pieces, lids, stares: eyes.map(() => 0), starts: planBlink(eyes, longWait(random), random) };
}

/** Set each eye for this moment: blinking, or staring at a pointer. */
export function blink(gaze: Gaze, time: number, elapsed: number, random: () => number): void {
  if (time > Math.max(...gaze.starts) + BLINK_LASTS) {
    gaze.starts = planBlink(gaze.eyes, time + nextWait(random), random);
  }
  gaze.eyes.forEach((eye, eyeIndex) => {
    const piece = gaze.pieces[eyeIndex];
    const target = piece.matches(REACHED) ? 1 : 0;
    gaze.stares[eyeIndex] += (target - gaze.stares[eyeIndex]) * Math.min(elapsed / SETTLE_TIME, 1);
    const stare = gaze.stares[eyeIndex];
    const blinkCover = LID_REST + (1 - LID_REST) * shutAt(time - gaze.starts[eyeIndex]);
    const outline = lidPath(eye, blinkCover + (LID_WIDE - blinkCover) * stare);
    for (const paper of gaze.lids[eyeIndex]) {
      paper.setAttribute("d", outline);
    }
    piece.setAttribute("transform", stareTransform(eye, stare, time));
  });
}
