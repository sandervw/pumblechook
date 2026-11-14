// The signed-off wide layout, in a 960 by 540 frame.

/** The five arms: centre curve, widths, and text sizes. */
export const ARMS = [
  { curve: [[302, 61], [640, 20], [950, 75]], rootWidth: 112, tipWidth: 40, nameSize: 19, textSize: 13, textStart: 62 },
  { curve: [[280, 132], [600, 120], [880, 212]], rootWidth: 92, tipWidth: 32, nameSize: 16, textSize: 11, textStart: 62 },
  { curve: [[237, 194], [520, 240], [760, 330]], rootWidth: 100, tipWidth: 32, nameSize: 18, textSize: 12, textStart: 68 },
  { curve: [[173, 245], [330, 340], [560, 400]], rootWidth: 78, tipWidth: 26, nameSize: 15, textSize: 11, textStart: 88 },
  { curve: [[95, 277], [80, 500], [495, 496]], rootWidth: 118, tipWidth: 44, nameSize: 18, textSize: 12, textStart: 62 },
].map((arm) => ({ ...arm, tuck: 90 }));

/** The painted whale's rib: its art, and the curve along it. */
export const RIB = {
  art: { width: 648, height: 420, transform: "translate(435.0 103.5) rotate(-1) scale(1.08)" },
  curve: [[442, 502], [929, 527], [1103, 103]],
  nameSize: 28,
  textSize: 14,
  textStart: 157,
  textEnd: 544,
};

/** The two uneven eyes. */
export const EYES = [
  { centre: [120, 94], radius: 80, pupil: [146, 118], pupilRadius: 18 },
  { centre: [249, 183], radius: 19, pupil: [251.5, 189.5], pupilRadius: 4.5 },
];

/** The water the fish swarm keeps to. */
export const SWARM_BOX = { left: 730, right: 832, top: 238, bottom: 300 };
