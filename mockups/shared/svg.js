const SVG_SPACE = "http://www.w3.org/2000/svg";

/** Create one SVG element, set its attributes, and append it. */
export function addShape(parent, name, attributes) {
  const shape = document.createElementNS(SVG_SPACE, name);
  for (const [key, value] of Object.entries(attributes)) {
    shape.setAttribute(key, value);
  }
  parent.append(shape);
  return shape;
}
