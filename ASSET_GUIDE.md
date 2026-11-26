# Asset guide

## Character artwork

The three original PNGs under `assets/references/` are unchanged. SHA-256 hashes were compared with files inside the supplied ZIP. Reference sheets are not animation atlases.

`assets/characters-clean.png`: generated and background-extracted derivative, 1086 × 1448 RGBA. Three columns and four rows, each cell 362 × 362. Columns: Ani, Happy, Toti. Rows: front standing, rear standing, one front stride, seated. Nominal foot anchor: center X, 96% cell height. Minor pose-specific anchor differences remain. The renderer mirrors horizontal orientation and adds a small walking bob. This is not a complete directional animation atlas.

`assets/characters-inline.js` embeds the same PNG as a data URI, keeping photo capture independent of external image origins during local-file use. CSS uses the PNG for companion portraits. Original references are not loaded during play.

The built-in image_gen tool produced both passes. Final prompt set:

### Atlas generation

> Use case: identity-preserve. Asset type: transparent game character sprite atlas. References in order Ani, Happy, Toti. Preserve exact distinctive identities, voxel pixel texture, costumes and accessories. Create ONE sprite atlas on fully transparent background with exactly 3 columns and 4 rows, evenly sized cells, no borders or text. Column 1 Ani in sakura kimono glasses parasol, column 2 Happy golden retriever samurai costume straw hat, column 3 Toti small tan upright-eared dog brown leather armor curled tail. Row 1 front three-quarter standing; row 2 back three-quarter standing; row 3 front three-quarter walking left leg forward with actual bent limb poses; row 4 seated restful poses. Every full character stays inside its own cell with generous transparent margins, centered horizontally, feet on consistent baseline at 90% cell height. Ani taller, Happy medium, Toti smaller. Crisp chunky warm voxel pixel art, no background or ground shadows. Output portrait 1536x2048 if possible. Consistent character scale across all rows. No extra characters.

The first result had a mostly opaque light background and was not used.

### Background extraction

> Use case: background-extraction. Remove ONLY the white/checkered background from this exact sprite atlas. The background must be fully transparent alpha=0, NOT white, NOT a baked checkerboard, NOT semiopaque. Preserve every character pixel, identity, pose, layout, and 3-column 4-row grid. Output clean fully isolated game sprites on true transparent background. No shadow. Keep the complete atlas composition unchanged.

The final image was visually inspected; corner alpha is zero. Some colored fringe pixels remain around detailed accessories.

## Environments

Artwork is authored in `scripts/render.js` and placed by `scripts/world.js`. No runtime image generation. Tile size: 58 × 29 logical pixels before camera scaling. Each destination is a 24 × 24 grid, generated when entered. Terrain, roofs, timber, windows, bamboo, trees, flowers, lamps, fences, benches, stalls, deer, bridge and station are drawn from code. Kyoto uses sakura/timber; Nara forest/river; Hakone pine/lake/rain; Tokyo a darker palette, skyline and lanterns. Compact layouts share interaction coordinates.

Water, petals, bamboo, steam and rain animate procedurally. Reduced motion disables these and train background movement. Characters and trees sort by foot position; buildings use footprint centers, so complex overlaps still need live testing.

UI icons use inline SVG and monochrome ornaments. Stamps use text/CSS. System fonts require no web requests.

## Audio

`scripts/audio.js` synthesizes a short original melody, filtered-noise ambience and triangle-wave chimes. Audio begins after a user gesture. No recordings or third-party samples. This is a small sound bed, with shared ambience across chapters.

## Website favicon

`favicon.svg` is an original vector sakura blossom in the game’s pink, warm gold and forest-green palette, drawn for this website. `favicon.ico` contains 16, 32 and 48 pixel versions. PNG exports in `assets/icons/` include those sizes plus 180 (Apple touch icon), 192 and 512 pixels. The standalone HTML embeds the favicon assets. These are code-authored vectors and raster exports; no image-generation model or external artwork was used for the favicon.

## Editing character artwork

Keep atlas dimensions/layout when replacing art. Regenerate `characters-inline.js` and the standalone HTML from any replacement PNG. Preserve original references.
