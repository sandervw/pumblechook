// Rows of real text that run along a limb.

import type { OwnerMark, Project } from "../../core/portfolio/index.ts";
import type { Measure } from "./measure.ts";

const CODE_WORD = "(code)";
const ROW_GAP = 2;
// A row's baseline sits this share of its size below centre.
const BASELINE_DROP = 0.32;
const GAP_AFTER_NAME = 14;

/** A limb's text sizes, and where its text starts. */
export interface Lettering {
  readonly nameSize: number;
  readonly textSize: number;
  readonly textStart: number;
}

/** One row of text: how far along and how far below. */
export interface Row {
  readonly text: string;
  readonly start: number;
  readonly drop: number;
}

/** Rows of one kind of text, read as one piece. */
export interface Block {
  readonly kind: "name" | "tag" | "plain" | "code";
  readonly size: number;
  readonly rows: readonly Row[];
  readonly url?: string;
  readonly label?: string;
}

/** Split a sentence into rows no longer than the room. */
function wrapWords(sentence: string, widthOf: (text: string) => number, room: number): string[] {
  const rows: string[] = [];
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
function stack(texts: readonly string[], start: number, size: number): Row[] {
  return texts.map((text, rowIndex) => ({
    text,
    start,
    drop: (rowIndex - (texts.length - 1) / 2) * (size + ROW_GAP) + size * BASELINE_DROP,
  }));
}

/** Place a project's linked name and logline along a limb. */
export function layOutProject(project: Project, lettering: Lettering, room: number, measure: Measure): Block[] {
  const { nameSize, textSize, textStart } = lettering;
  const loglineStart = textStart + measure(project.name, "name", nameSize) + GAP_AFTER_NAME;
  const words = project.repositoryLink ? `${project.logline} ${CODE_WORD}` : project.logline;
  const texts = wrapWords(words, (text) => measure(text, "sentence", textSize), room - loglineStart);
  const name: Block = {
    kind: "name",
    size: nameSize,
    url: project.liveSiteLink,
    rows: [{ text: project.name, start: textStart, drop: nameSize * BASELINE_DROP }],
  };
  if (!project.repositoryLink) {
    return [name, { kind: "plain", size: textSize, rows: stack(texts, loglineStart, textSize) }];
  }
  // The code word leaves the last row and becomes its own link.
  texts[texts.length - 1] = texts[texts.length - 1].slice(0, -CODE_WORD.length);
  const rows = stack(texts, loglineStart, textSize);
  const lastRow = rows[rows.length - 1];
  const codeStart = lastRow.start + measure(lastRow.text, "sentence", textSize);
  const code: Block = {
    kind: "code",
    size: textSize,
    url: project.repositoryLink,
    label: `${project.name} ${CODE_WORD}`,
    rows: [{ text: CODE_WORD, start: codeStart, drop: lastRow.drop }],
  };
  return [name, { kind: "plain", size: textSize, rows }, code];
}

/** Place the owner's name with the tag beside it, on one line. */
export function layOutOwner(ownerMark: OwnerMark, lettering: Lettering, measure: Measure): Block[] {
  const { nameSize, textSize, textStart } = lettering;
  const tagStart = textStart + measure(ownerMark.name, "name", nameSize) + GAP_AFTER_NAME;
  return [
    { kind: "name", size: nameSize, rows: [{ text: ownerMark.name, start: textStart, drop: nameSize * BASELINE_DROP }] },
    { kind: "tag", size: textSize, rows: [{ text: ownerMark.tag, start: tagStart, drop: nameSize * BASELINE_DROP }] },
  ];
}
