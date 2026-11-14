// Runs the scene's motion in the visitor's browser.

import { drift, findArms } from "./arms.ts";
import { blink, findEyes, type Eye } from "./eyes.ts";
import type { Limb } from "./limb.ts";
import { findSwarm, slideSwarm, type Water } from "./swarm.ts";

// A hidden tab can leave a long gap between frames.
const LONGEST_STEP = 100;

/** Where a composition puts the pieces that move. */
export interface MovingPieces {
  readonly arms: readonly Limb[];
  readonly eyes: readonly Eye[];
  readonly water: Water;
}

/** Move the scene, unless the visitor asked for stillness. */
export function runScene(scene: Element, pieces: MovingPieces): void {
  const stillness = matchMedia("(prefers-reduced-motion: reduce)");
  const arms = findArms(scene, pieces.arms);
  const gaze = findEyes(scene, pieces.eyes, Math.random);
  const swarm = findSwarm(scene, pieces.water, Math.random);
  let lastFrame = 0;

  /** Draw one frame and ask for the next. */
  function animate(time: number): void {
    const elapsed = Math.min(time - lastFrame, LONGEST_STEP);
    lastFrame = time;
    if (!stillness.matches) {
      drift(arms, elapsed);
      slideSwarm(swarm, pieces.water, elapsed, Math.random);
      blink(gaze, time, elapsed, Math.random);
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
