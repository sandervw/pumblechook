// A few painted fish that slide back and forth.

import { findPieces } from "./find.ts";
import type { Point } from "./limb.ts";

const SLOWEST_PACE = 0.004;
const PACE_SPREAD = 0.005;
const TURN_RATE = 0.06;
const LEFT = -1;
const RIGHT = 1;

/** The water the swarm keeps to, and where each fish starts. */
export interface Water {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  readonly starts: readonly Point[];
}

/** One fish: its piece, its place, and where it is going. */
export interface Fish {
  readonly piece: SVGGElement;
  readonly pace: number;
  place: Point;
  goal: Point;
  side: number;
  facing: number;
}

/** Return the side of the water a fish starts on. */
export function startSide(fishIndex: number): number {
  return fishIndex % 2 === 0 ? LEFT : RIGHT;
}

/** Return a fish's place and facing as a transform. */
export function fishPlace(place: Point, facing: number): string {
  // The art faces left, so a fish heading right is flipped.
  return `translate(${place[0].toFixed(1)} ${place[1].toFixed(1)}) scale(${facing.toFixed(2)} 1)`;
}

/** Return a random spot on one side of the water. */
function spotOn(water: Water, side: number, random: () => number): Point {
  const middle = (water.left + water.right) / 2;
  const edge = side === LEFT ? water.left : water.right;
  return [middle + (edge - middle) * (0.25 + random() * 0.75), water.top + random() * (water.bottom - water.top)];
}

/** Find the fish, and give each somewhere to go. */
export function findSwarm(scene: Element, water: Water, random: () => number): Fish[] {
  const pieces = findPieces<SVGGElement>(scene, ".fish", water.starts.length);
  return pieces.map((piece, fishIndex) => {
    const side = startSide(fishIndex);
    return {
      piece,
      pace: SLOWEST_PACE + random() * PACE_SPREAD,
      place: water.starts[fishIndex],
      goal: spotOn(water, -side, random),
      side: -side,
      facing: side,
    };
  });
}

/** Slide each fish toward its goal, and turn it at the end. */
export function slideSwarm(swarm: readonly Fish[], water: Water, elapsed: number, random: () => number): void {
  for (const fish of swarm) {
    const gap = Math.hypot(fish.goal[0] - fish.place[0], fish.goal[1] - fish.place[1]);
    if (gap < 1) {
      fish.side = -fish.side;
      fish.goal = spotOn(water, fish.side, random);
    } else {
      const stride = Math.min(fish.pace * elapsed, gap) / gap;
      fish.place = [
        fish.place[0] + (fish.goal[0] - fish.place[0]) * stride,
        fish.place[1] + (fish.goal[1] - fish.place[1]) * stride,
      ];
    }
    fish.facing += (-fish.side - fish.facing) * TURN_RATE;
    fish.piece.setAttribute("transform", fishPlace(fish.place, fish.facing));
  }
}
