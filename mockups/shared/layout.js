// The signed-off wide layout, in a 960 by 540 frame.

/** The five arms: centre curve, widths, and text sizes. */
export const ARMS = [
  { curve: [[302, 61], [640, 20], [950, 75]], rootWidth: 112, tipWidth: 40, nameSize: 19, textSize: 13, tuck: 90 },
  { curve: [[280, 132], [600, 120], [900, 215]], rootWidth: 92, tipWidth: 32, nameSize: 16, textSize: 11, tuck: 90 },
  { curve: [[237, 194], [520, 240], [760, 330]], rootWidth: 100, tipWidth: 32, nameSize: 18, textSize: 12, tuck: 90 },
  { curve: [[173, 245], [330, 340], [560, 400]], rootWidth: 78, tipWidth: 26, nameSize: 15, textSize: 11, tuck: 90 },
  { curve: [[95, 277], [80, 500], [495, 496]], rootWidth: 118, tipWidth: 44, nameSize: 18, textSize: 12, tuck: 90 },
];

/** The whale's rib that carries the owner's mark. */
export const RIB = {
  curve: [[545, 512], [850, 522], [935, 285]],
  rootWidth: 72,
  tipWidth: 36,
  nameSize: 20,
  textSize: 13,
  tuck: 0,
};

/** The two uneven eyes, with the blink delay of each. */
export const EYES = [
  { centre: [120, 94], radius: 80, pupil: [146, 118], pupilRadius: 18, delay: 0 },
  { centre: [249, 183], radius: 19, pupil: [251.5, 189.5], pupilRadius: 4.5, delay: 140 },
];

/** Return a steady scattered fraction for one fish. */
function scatter(count, seed) {
  const wave = Math.sin((count + 1) * seed) * 43758.5;
  return wave - Math.floor(wave);
}

/** Return where each fish of the swarm sits. */
export function fishSpots() {
  const spots = [];
  for (let count = 0; count < 24; count += 1) {
    const across = 768 + scatter(count, 12.9) * 126;
    spots.push({
      across,
      down: 262 + scatter(count, 78.2) * 72 - (across - 768) * 0.12,
      scale: 0.55 + scatter(count, 37.7) * 0.45,
      tilt: scatter(count, 5.3) * 18 - 9,
    });
  }
  return spots;
}
