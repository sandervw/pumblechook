# Art making

## Question

How are the painted pieces of the scene produced, so that nothing looks flat and an arm can still wriggle?

## Recommendation

Cut paper: paint texture sheets as images, and cut every shape out of them with vector outlines. It is how a collage artist works: paint a sheet of mottled green first, then take scissors to it; here the sheets are image files and the scissors are outlines the browser can bend. The paint stays real paint, and a wriggle moves the cut, not the pixels.

## Comparison

| | Cut paper (texture sheets + vector cuts) | Finished painted pieces | Hand-made and scanned | Code only |
|---|---|---|---|---|
| Fits the need | Real paint grain; arms bend smoothly | Richest single pieces; arms bend stiffly or need warping | Truest collage | Looks digital; grain is synthetic |
| Connected tools | Image model or scans for sheets; SVG for cuts | Image model; background removal | Paint, scanner, photo editor | SVG filters only |
| Development flow | Change a shape in code, see it at once | Regenerate a piece to change it | Repaint and rescan to change it | Fastest loop |
| Cost | Image generation, or none with scans | More generation; many retries per piece | CEO's time and materials | None |
| Maintenance and license | Sheets are abstract textures: no likeness to any book art | Each piece risks echoing a specific illustration | Wholly original | Wholly original |
| Reversibility | High: swap sheets or shapes separately | Low: pieces bake shape and paint together | Low | High |
| Rules out | Painted detail inside a shape, unless added as its own piece | Smooth bending without a warp engine | Quick iteration | A painted look |

## Per option

**Cut paper**

- A shape is an SVG outline filled with an image pattern, with a gradient laid over it, so the "no flat colour" rule holds by construction.
- Rough, hand-cut edges come from a displacement filter on the outline. See [feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence) and [feDisplacementMap](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap). Not re-checked this session.
- Small painted details (an eye, a tooth, a label) can still be whole pieces placed on top. The two approaches mix.
- Risk: shapes drawn in code can look stiff. Mockup rounds with the CEO are the check.

**Finished painted pieces**

- An image model paints each creature or object whole; the background is removed and the piece is placed as a layer.
- An arm is one rigid picture. Bending it needs slicing into segments or a mesh warp, which adds a rendering engine.
- Consistency across separately generated pieces is hard to hold.

**Hand-made and scanned**

- The CEO paints and cuts; scans become layers. Nothing is more authentic.
- Every change is a repaint. It also mixes with cut paper: scanned sheets can replace generated sheets at any time.

**Code only**

- Gradients plus procedural noise. No image files, smallest page.
- Synthetic noise reads as a filter, not as paint.

## Style and rights

Lane Smith's picture-book painting is the defining style. Every image prompt, agent brief, and spec names him, alongside his traits (mottled paint, dark vignettes, cut-paper edges, off-kilter type). No page, character, or composition from his books is copied, traced, or used as an image-model input.
