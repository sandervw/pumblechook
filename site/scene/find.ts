// Finds the pieces a composition printed into the scene.

/** Return exactly the expected count of pieces, or fail. */
export function findPieces<Piece extends Element>(scene: Element, selector: string, count: number): Piece[] {
  const pieces = [...scene.querySelectorAll<Piece>(selector)];
  if (pieces.length !== count) {
    throw new Error(`The scene has ${pieces.length} pieces matching "${selector}", not ${count}.`);
  }
  return pieces;
}
