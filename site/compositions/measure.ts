// Measures text with the hosted fonts' own metrics.

import { openSync, type Font } from "fontkit";

/** The scene's two faces: one for names, one for sentences. */
export type Face = "name" | "sentence";

/** Returns the width of text set in a face at a size. */
export type Measure = (text: string, face: Face, size: number) => number;

const FONT_FILES: Record<Face, string> = {
  name: "public/fonts/grenze-gotisch-latin-600-normal.woff2",
  sentence: "public/fonts/im-fell-dw-pica-latin-400-normal.woff2",
};

/** Read one hosted font file. */
function readFont(file: string): Font {
  const font = openSync(file);
  if ("fonts" in font) {
    throw new Error(`${file} holds a font collection, not one font.`);
  }
  return font;
}

/** Read the hosted fonts and return a text measurer. */
export function loadMeasure(): Measure {
  const fonts: Record<Face, Font> = { name: readFont(FONT_FILES.name), sentence: readFont(FONT_FILES.sentence) };
  return (text, face, size) => {
    const font = fonts[face];
    return (font.layout(text).advanceWidth * size) / font.unitsPerEm;
  };
}
