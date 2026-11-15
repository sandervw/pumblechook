// The painted fish every swarm is made of.

import fishOne from "../art/fish-1.webp";
import fishTwo from "../art/fish-2.webp";
import fishThree from "../art/fish-3.webp";

/** Each painted fish: its art, its size, and its eye. */
export const FISH_KINDS = [
  { art: fishOne, width: 24, height: 11, eye: [4.8, 4.6], eyeRadius: 1.7, lidShift: 3.6 },
  { art: fishTwo, width: 34, height: 4.3, eye: [4.4, 2.2], eyeRadius: 0.9, lidShift: 1.8 },
  { art: fishThree, width: 22, height: 13.8, eye: [4.6, 6.2], eyeRadius: 1.5, lidShift: 3.3 },
].map((kind) => ({ ...kind, left: -kind.width / 2, top: -kind.height / 2 }));
