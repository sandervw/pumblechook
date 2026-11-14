// Rows of real text that run along a limb.

import { addShape } from "./svg.js";

const TEXT_START = 62;
const NAME_FACE = '"Pirata One", "Old English Text MT", serif';
const TEXT_FACE = '"IM Fell English", Georgia, serif';

/** Wait for the fonts, then return a text measurer. */
export async function loadMeasure() {
  await Promise.all([document.fonts.load(`20px ${NAME_FACE}`), document.fonts.load(`13px ${TEXT_FACE}`)]);
  const brush = document.createElement("canvas").getContext("2d");
  return (text, row) => {
    brush.font = `${row.size}px ${row.face}`;
    return brush.measureText(text).width;
  };
}

/** Split a sentence into rows no longer than the room. */
function wrapWords(sentence, widthOf, room) {
  const rows = [];
  for (const word of sentence.split(" ")) {
    const longer = rows.length > 0 ? `${rows.at(-1)} ${word}` : word;
    if (rows.length > 0 && widthOf(longer) <= room) {
      rows[rows.length - 1] = longer;
    } else {
      rows.push(word);
    }
  }
  return rows;
}

/** Stack rows of small text around the centre line. */
function stack(entries, start, size) {
  return entries.map((entry, index) => ({
    ...entry,
    start,
    size,
    face: TEXT_FACE,
    offset: (index - (entries.length - 1) / 2) * (size + 2),
  }));
}

/** Place a name, a sentence, and links along a limb. */
export function layOutRows(content, limb, room, measure) {
  const name = { text: content.name, start: TEXT_START, size: limb.nameSize, face: NAME_FACE, offset: 0 };
  const small = { size: limb.textSize, face: TEXT_FACE };
  const nameEnd = TEXT_START + measure(content.name, name);
  const linksWidth = Math.max(...content.links.map((link) => measure(link.label, small)));
  const linksStart = room - linksWidth - 16;
  const sentenceRows = wrapWords(content.sentence, (text) => measure(text, small), linksStart - nameEnd - 26);
  const links = content.links.map((link) => ({ text: link.label, url: link.url }));
  return [
    name,
    ...stack(sentenceRows.map((text) => ({ text })), nameEnd + 14, limb.textSize),
    ...stack(links, linksStart + 4, limb.textSize),
  ];
}

/** Draw rows of text along the path with the given id. */
export function drawRows(group, rows, lineId) {
  for (const row of rows) {
    const parent = row.url ? addShape(group, "a", { href: row.url }) : group;
    const text = addShape(parent, "text", {
      dy: (row.offset + row.size * 0.32).toFixed(1),
      style: `font: ${row.size}px ${row.face}`,
    });
    addShape(text, "textPath", { href: `#${lineId}`, startOffset: row.start.toFixed(1) }).textContent = row.text;
  }
}
