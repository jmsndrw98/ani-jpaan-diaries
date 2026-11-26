# Ani’s Japan Diaries

A playable HTML5 adventure prototype with Ani, Happy and Toti. Four small destinations, a train journey, and a journal that fills with your own memories.

## Play

Extract the ZIP, then open `index.html` in a modern browser. Keep the `scripts/` and `assets/` folders beside it. There is no installation, build step, account, or runtime network dependency.

The separate `Anis-Japan-Diaries-Standalone.html` deliverable bundles the same game into one file. The source ZIP retains the original reference sheets and editable code.

Static hosting is also supported by the relative asset layout. Upload this folder’s contents to a static host; no server-side code is used. Direct-file and HTTP browser execution could not be verified in this session; see TEST_REPORT.md.

## Controls

- WASD / arrows, click a path, or tap a path to walk.
- E or the interaction prompt to explore a nearby object.
- Tap a checklist item to walk toward it automatically.
- C: camera; J: journal; M: travel map; P: companions.
- + / −, on-screen buttons, mouse wheel, or pinch to zoom.
- Settings: virtual joystick, sound, reduced motion, save export/import.
- Escape closes dialogs or skips cinematics. Scenes also have visible skip/continue controls.

Visit a landmark, try an activity, choose a keepsake, take a photo, and rest to finish each chapter. A passport stamp unlocks the next destination. Optional discoveries and pet/feed/play actions earn XP once per destination. Happy and Toti have independent friendship scores. No grinding is required.

## Included

- Kyoto: shrine, matcha ritual, sakura charm, cherry-tree rest and hidden fox carving.
- Nara: deer grove, picnic, forest keepsake, river rest and hidden flower trail.
- Hakone: viewpoint, decoration choices, woodcraft keepsake, tea/rain and haiku discovery.
- Tokyo: festival, untimed lantern melody, wind chime, waterfront lights and final wish.
- Opening, travel, rest, companion and ending scenes; opening replay; free travel.
- Local saves, validated JSON import/export, Canvas photo capture and a 24-photo album.
- Procedural audio with separate music, ambience and effects controls.

## Status and limits

This is a playable prototype, not a fully verified release of every item in the original brief. The full eight-direction animation set is incomplete. The generated atlas has four poses per character; side directions are mirrored, walking alternates standing and one stride pose, and rear walking lacks stride frames. Art is derived from the references rather than pixel-exact extraction. Procedural environments share a compact layout. Hakone decoration changes a small vignette rather than a separately explorable interior. Level accessories are named journal rewards rather than equippable costume changes. Audio is a small synthesized loop. Browser UI, mobile gestures, sound and cross-browser compatibility still need hands-on verification.

See TEST_REPORT.md for evidence and outstanding checks, ASSET_GUIDE.md for atlas layout and prompts, and LICENSES.md for provenance.

## Source map

`game.js`: input, movement, companions, scenes, photos, progression. `scripts/world.js`: collision and A*. `scripts/render.js`: worlds, characters, weather, train. `scripts/ui.js`: dialogs, journal, map, activities. `scripts/save.js`: validation/storage. `scripts/audio.js`: synthesized sound. `scripts/data.js`: chapter content. `style.css`: responsive UI.

GAME_DESIGN.md, AGENTS.md and CODEX_PROMPT.txt are retained as the original brief. They describe target features, not proof that all features shipped.
