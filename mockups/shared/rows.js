// Rows of real text that run along a limb.

import { addShape } from "./svg.js";

const NAME_FACE = '"Pirata One", "Old English Text MT", serif';
const TEXT_FACE = '"IM Fell English", Georgia, serif';
const CODE_WORD = "(code)";

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

/** Place a project's linked name and logline along a limb. */
export function layOutProject(project, limb, room, measure) {
  const name = { text: project.name, start: limb.textStart, size: limb.nameSize, face: NAME_FACE, offset: 0, kind: "name", url: project.liveSite };
  const small = { size: limb.textSize, face: TEXT_FACE };
  const loglineStart = limb.textStart + measure(project.name, name) + 14;
  const words = project.repository ? `${project.logline} ${CODE_WORD}` : project.logline;
  const rows = stack(wrapWords(words, (text) => measure(text, small), room - loglineStart).map((text) => ({ text })), loglineStart, limb.textSize);
  if (project.repository) {
    const last = rows.at(-1);
    last.text = last.text.slice(0, -CODE_WORD.length);
    last.tail = { text: CODE_WORD, url: project.repository };
  }
  return [name, ...rows];
}

/** Place the owner's name, tag, bio, and links along a limb. */
export function layOutOwner(owner, limb, room, measure) {
  const name = { text: owner.name, start: limb.textStart, size: limb.nameSize, face: NAME_FACE, offset: -limb.textSize * 1.1, kind: "name" };
  const tag = { text: owner.tag, start: limb.textStart + 2, size: limb.textSize, face: TEXT_FACE, offset: limb.nameSize * 0.5 - limb.textSize * 0.4, kind: "tag" };
  const small = { size: limb.textSize, face: TEXT_FACE };
  const bioStart = limb.textStart + measure(owner.name, name) + 16;
  const linksStart = room - Math.max(...owner.links.map((link) => measure(link.label, small)));
  const bioRows = wrapWords(`“${owner.bio}”`, (text) => measure(text, small), linksStart - bioStart - 14);
  const links = owner.links.map((link) => ({ text: link.label, url: link.url, kind: "link" }));
  return [name, tag, ...stack(bioRows.map((text) => ({ text })), bioStart, limb.textSize), ...stack(links, linksStart, limb.textSize)];
}

/** Draw rows of text along the path with the given id. */
export function drawRows(group, rows, lineId) {
  for (const row of rows) {
    const parent = row.url ? addShape(group, "a", { href: row.url }) : group;
    const text = addShape(parent, "text", {
      class: row.kind ?? "plain",
      dy: (row.offset + row.size * 0.32).toFixed(1),
      style: `font: ${row.size}px ${row.face}`,
    });
    const line = addShape(text, "textPath", { href: `#${lineId}`, startOffset: row.start.toFixed(1) });
    line.textContent = row.text;
    if (row.tail) {
      addShape(addShape(line, "a", { href: row.tail.url }), "tspan", { class: "code" }).textContent = row.tail.text;
    }
  }
}
