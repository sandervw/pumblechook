// A few painted fish that slide back and forth.

import { SWARM_BOX } from "./layout.js";
import { addShape } from "./svg.js";

const FISH_COUNT = 8;
// Each painted fish: art file, width, and height.
const KINDS = [
  { art: "fish-1.webp", width: 24, height: 11 },
  { art: "fish-2.webp", width: 34, height: 4.3 },
  { art: "fish-3.webp", width: 22, height: 13.8 },
];

/** Return a random spot on one side of the swarm's water. */
function spotOn(side) {
  const middle = (SWARM_BOX.left + SWARM_BOX.right) / 2;
  const edge = side < 0 ? SWARM_BOX.left : SWARM_BOX.right;
  return {
    across: middle + (edge - middle) * (0.25 + Math.random() * 0.75),
    down: SWARM_BOX.top + Math.random() * (SWARM_BOX.bottom - SWARM_BOX.top),
  };
}

/** Add the fish to the scene, each with somewhere to go. */
export function buildSwarm(parent) {
  const swarm = [];
  for (let count = 0; count < FISH_COUNT; count += 1) {
    const kind = KINDS[count % KINDS.length];
    const side = count % 2 === 0 ? -1 : 1;
    const image = addShape(parent, "image", {
      href: `../painted-pieces/art/${kind.art}`,
      x: -kind.width / 2,
      y: -kind.height / 2,
      width: kind.width,
      height: kind.height,
    });
    swarm.push({ image, ...spotOn(side), goal: spotOn(-side), side: -side, facing: side, pace: 0.004 + Math.random() * 0.005 });
  }
  return swarm;
}

/** Slide each fish toward its goal, and turn it at the end. */
export function slideSwarm(swarm, elapsed) {
  for (const fish of swarm) {
    const gap = Math.hypot(fish.goal.across - fish.across, fish.goal.down - fish.down);
    if (gap < 1) {
      fish.side = -fish.side;
      fish.goal = spotOn(fish.side);
    } else {
      const stride = Math.min(fish.pace * elapsed, gap) / gap;
      fish.across += (fish.goal.across - fish.across) * stride;
      fish.down += (fish.goal.down - fish.down) * stride;
    }
    // The art faces left, so a fish heading right is flipped.
    fish.facing += (-fish.side - fish.facing) * 0.06;
    fish.image.setAttribute("transform", `translate(${fish.across.toFixed(1)} ${fish.down.toFixed(1)}) scale(${fish.facing.toFixed(2)} 1)`);
  }
}
