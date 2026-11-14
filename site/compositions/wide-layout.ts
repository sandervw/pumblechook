// The signed-off wide layout, in a 960 by 540 frame.

import type { Eye } from "../scene/eyes.ts";
import type { Curve, Limb } from "../scene/limb.ts";
import type { Water } from "../scene/swarm.ts";
import type { Lettering } from "./rows.ts";

const ARM_TUCK = 90;

/** The five arms: centre curve, widths, and text sizes. */
const ARMS: readonly (Limb & Lettering)[] = [
  { curve: [[302, 61], [640, 20], [950, 75]], rootWidth: 112, tipWidth: 40, nameSize: 19, textSize: 13, textStart: 62, tuck: ARM_TUCK },
  { curve: [[280, 132], [600, 120], [880, 212]], rootWidth: 92, tipWidth: 32, nameSize: 16, textSize: 11, textStart: 62, tuck: ARM_TUCK },
  { curve: [[237, 194], [520, 240], [760, 330]], rootWidth: 100, tipWidth: 32, nameSize: 18, textSize: 12, textStart: 68, tuck: ARM_TUCK },
  { curve: [[173, 245], [330, 340], [560, 400]], rootWidth: 78, tipWidth: 26, nameSize: 15, textSize: 11, textStart: 88, tuck: ARM_TUCK },
  { curve: [[95, 277], [80, 500], [495, 496]], rootWidth: 118, tipWidth: 44, nameSize: 18, textSize: 12, textStart: 62, tuck: ARM_TUCK },
];

/** The whale's rib: its art, and the curve its text follows. */
const RIB: Lettering & { curve: Curve; art: { width: number; height: number; transform: string } } = {
  art: { width: 648, height: 431, transform: "translate(435.0 103.5) rotate(-1) scale(1.08)" },
  curve: [[442, 502], [929, 527], [1103, 103]],
  nameSize: 28,
  textSize: 14,
  textStart: 157,
};

/** The two uneven eyes. */
const EYES: readonly Eye[] = [
  { centre: [120, 94], radius: 80, pupil: [146, 118], pupilRadius: 18 },
  { centre: [249, 183], radius: 19, pupil: [251.5, 189.5], pupilRadius: 4.5 },
];

/** Where each tattoo sits on the skin, as a transform. */
export interface TattooPlaces {
  readonly tears: string;
  readonly ouroboros: string;
  readonly cross: string;
  readonly lovers: string;
  readonly profile: string;
}

const TATTOOS: TattooPlaces = {
  tears: "translate(229 206) rotate(12) scale(1.15)",
  ouroboros: "translate(250 44) rotate(-10) scale(1.15)",
  cross: "translate(21 118) scale(1.4)",
  lovers: "translate(218 102) rotate(-8)",
  profile: "translate(62 232) rotate(-7)",
};

/** The water the fish keep to, and where each one starts. */
const WATER: Water = {
  left: 730,
  right: 832,
  top: 238,
  bottom: 300,
  starts: [[744, 252], [815, 264], [761, 289], [803, 243], [736, 273], [826, 285], [753, 241], [797, 296]],
};

/** Where the wide composition puts every piece. */
export const WIDE = { arms: ARMS, rib: RIB, eyes: EYES, tattoos: TATTOOS, water: WATER };
