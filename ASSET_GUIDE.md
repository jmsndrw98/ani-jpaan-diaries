# Asset guide — Pixel & Motion Edition

## Characters

The reference PNGs in `assets/references/` are unchanged and their SHA-256 hashes match the supplied ZIP. They are references, not animation atlases.

Active gameplay now uses original code-authored pixel rigs in `scripts/art.js`. The previous generated atlas has been removed from the runtime/export. No image-generation tool was used for this revision’s new artwork. The characters reinterpret the supplied identities at a consistent pixel density; they are not pixel-exact extractions.

Each rendered pose uses a transparent 128×128 buffer and nominal foot anchor (64,108). Walking uses 32 quantized gait phases, driven by traveled distance, with independent feet/legs and sleeve movement. Rest blends lower the body while preserving the ground anchor. Dogs have articulated legs, tail movement, care poses and mirrored front/rear orientations. Buffers are cached with a 300-entry cap. This is procedural articulation, not a claim of eight separately authored directional atlases. Distinct left/right side portraits and custom full back-view quadruped geometry remain outside this revision.

`assets/portraits/ani.png`, `happy.png` and `toti.png` are 256×256 transparent exports of the same rigs for UI use. The standalone build embeds the portraits. Character game art itself requires no image loading.

## Environments

`scripts/renderer.js` contains the environment artwork and `scripts/world.js` its placement/collision. Every chapter is a 24×24 map; one tile projects to 58×29 logical pixels. The terrain is cached once per entered world. Props use tightly sized image buffers and are skipped outside the viewport. Pose caches are bounded.

Kyoto: pink layered canopies, red gate, shoji buildings and bamboo. Nara: broad green foliage, deer, river and picnic. Hakone: cool water, pine branches, rain and viewpoint. Tokyo: evening palette, food stalls, distant buildings, paper lanterns and warm light pools. Layouts remain compact and share interaction coordinates. Textures, ornaments and props are code-authored, not stock or generated-image assets.

Camera/actor coordinates remain fractional for smooth movement; local art retains hard pixel edges. Water, foliage, weather and steam animate separately. Trees can be clicked to shed petals/leaves. Occluding trees/buildings become translucent near the player. Photo capture omits route dots, interaction markers and screen-space weather.

## Favicon

Original sakura vector in `favicon.svg`; multi-resolution `favicon.ico` (16/32/48); PNGs under `assets/icons/` (16/32/48/180/192/512). The 180 PNG is the Apple touch icon. Pink, warm gold and forest green match the game. Icons are embedded in the standalone file.

## UI and audio

UI icons are inline SVG with system fonts. Activities render their own Canvas illustrations; their loops are disposed when dialogs close. Ambience and chimes use the original small Web Audio synthesis implementation. Background music now uses the four user-supplied local recordings described below; no network dependencies are required.

## Updating

Edit rigs in art.js and scenery in renderer.js. Re-export portrait PNGs when changing character designs. Rebuild the standalone HTML and ZIP together; their runtime code should match the folder build. Preserve supplied reference originals.

## Requests & railways revision

`assets/faces/ani.png`, `happy.png` and `toti.png` are 128×128 transparent head crops rendered from the original code-authored rigs. They appear in the loading screen and are embedded in the standalone export. No new external or generated-image assets were used.

Quest envelopes and train scenery are original Canvas drawings in `scripts/renderer.js`. Train layers use fixed repeating spans and fractional canvas translations; a scene-local elapsed clock drives an analytic acceleration curve. Pausing stops that clock, and reduced motion renders a still view. Portrait/landscape compositions reserve space for narration, but browser overlay layout still requires live verification.

## Companions & changing skies revision

`scripts/art.js` adds a raised front paw and Ani’s responding arm pose using the existing code-authored rigs. No new third-party imagery is used. Stay uses the existing simplified resting pose.

`scripts/environment.js` renders interpolated sky colors, sun/moon/stars, passing clouds, nighttime tint and localized light glows, rain strokes, mist and drifting leaves/petals. All artwork is procedural. Atmosphere is composited over cached terrain, so gradual lighting changes do not rebuild world assets. Reduced motion keeps the sky/particles still while allowing the time cycle to continue. Weather ambience audio remains the existing synthesized sound bed, not separate recorded rain effects.

## User-supplied music revision

`assets/audio/` contains the four original M4A recordings, renamed to portable ASCII filenames only. SHA-256 hashes, container durations, original filenames and default destination mappings are in `assets/manifest.json`. Byte identity was checked against the supplied files. MP4 container inspection found `mp4a` audio sample entries in all four files; this is a container inspection, not an audible browser decode test.

The standalone export embeds each file once as an audio/mp4 data URL. The folder export uses relative local sources. A single HTML audio element loops the selected track; the BGM slider sets its volume (40% by default). A brief fade-in uses the existing game loop. The code does not fetch music remotely, alter the supplied audio, strip vocals, or transcode the recordings. These are full songs used as quiet BGM. No gapless-loop guarantee is made.
