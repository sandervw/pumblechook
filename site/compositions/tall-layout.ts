// The tall layout for phones, in a 390 by 844 frame.

import type { Eye } from "../scene/eyes.ts";
import type { Curve, Limb, Point } from "../scene/limb.ts";
import type { Water } from "../scene/swarm.ts";
import type { Lettering } from "./rows.ts";

const ARM_TUCK = 60;
const NAME_SIZE = 23;
const CODE_SIZE = 16;

/** Five arms cross from the left; the third stops short. */
const ARMS: readonly (Limb & Lettering)[] = [
  { curve: [[-10, 262], [170, 200], [420, 250]], rootWidth: 86, tipWidth: 44, nameSize: NAME_SIZE, textSize: CODE_SIZE, textStart: 30, tuck: ARM_TUCK },
  { curve: [[-10, 330], [230, 375], [420, 300]], rootWidth: 60, tipWidth: 30, nameSize: 24, textSize: CODE_SIZE, textStart: 190, tuck: ARM_TUCK },
  { curve: [[-10, 425], [150, 380], [320, 445]], rootWidth: 80, tipWidth: 26, nameSize: NAME_SIZE, textSize: CODE_SIZE, textStart: 55, tuck: ARM_TUCK },
  { curve: [[-10, 585], [200, 520], [420, 565]], rootWidth: 74, tipWidth: 38, nameSize: 24, textSize: CODE_SIZE, textStart: 170, tuck: ARM_TUCK },
  { curve: [[-10, 650], [230, 690], [420, 625]], rootWidth: 88, tipWidth: 44, nameSize: NAME_SIZE, textSize: CODE_SIZE, textStart: 95, tuck: ARM_TUCK },
];

/** The body's outline: upside down, along the top of the screen. */
const BODY = { x: -400, y: -218, width: 800, height: 435, transform: "translate(185 -10) rotate(180)" };

/** The whale's rib along the bottom; art and text share a place. */
const RIB: Lettering & { curve: Curve; place: string; art: { width: number; height: number } } = {
  art: { width: 620, height: 413 },
  place: "translate(-40 446)",
  curve: [[6, 346], [438, 370], [592, 0]],
  nameSize: 26,
  textSize: 15,
  textStart: 70,
};

/** The weed that rises from the bottom over the rib's far end. */
const WEED: { x: number; y: number; width: number; height: number } = { x: 232, y: 670, width: 172, height: 181 };

/** One giant eye, right of centre. */
const EYES: readonly Eye[] = [{ centre: [258, 92], radius: 58, pupil: [272, 108], pupilRadius: 13 }];

/** Where each tattoo sits on the skin, as a transform. */
const TATTOOS = {
  tears: "translate(198 158) rotate(12) scale(1.3)",
  cross: "translate(130 58) scale(1.6)",
  profile: "translate(34 132) rotate(-7)",
};

/** The water between the third and fourth arms. */
const WATER: Water = {
  left: 60,
  right: 320,
  top: 474,
  bottom: 504,
  starts: [[90, 486], [296, 500], [150, 504], [244, 482]],
};

/** The frame, and where its glow is brightest. */
const FRAME: Point = [390, 844];
const GLOW = { centre: [200, 70] as Point, radius: 700 };

/** Where the tall composition puts every piece. */
export const TALL = { frame: FRAME, glow: GLOW, arms: ARMS, body: BODY, rib: RIB, weed: WEED, eyes: EYES, tattoos: TATTOOS, water: WATER };
