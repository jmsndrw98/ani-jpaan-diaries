# Test report — 26 November 2026

## Result

**413 automated logic assertions passed**, all game scripts passed syntax checks, and **10 actual Canvas scenes** were rendered at desktop/mobile sizes. This supports a playable prototype delivery, not a fully browser-tested release.

## Verified

- A* connectivity from arrival and between all interaction points in all chapters; walkable paths and no diagonal corner-cutting.
- Simulated continuous walking reaches every interaction target, including secrets and station.
- Representative building collision rejects entry.
- Once-only discovery and companion rewards prevent repetitive XP farming.
- Four chapter gates, stamps, keepsakes, travel transitions, ending and free travel.
- Opening skip returns to play; rest skip finishes the intended memory.
- Journal, inventory, friendship, photos and progress survive JSON validation and mocked storage round-trips.
- Malformed save versions rejected; non-image photo URLs removed; storage failure handled gracefully.
- Input clearing; projection/inverse-projection after resize at 360×800, 390×844, 768×1024, 1024×768, 1366×768 and 1920×1080.
- Actual native-Canvas renderer execution with atlas: Kyoto, Nara, Hakone, Tokyo and train, each at 1366×768 and 360×800.
- Visual inspection of game-scene renders. These omit HTML/CSS overlays and are not browser screenshots.
- RGBA atlas with transparent corner; original reference hashes match starter ZIP.
- Local script/style references exist; classic scripts, no fetch/CDN/import runtime dependency.

Logic tests use DOM/storage mocks. Photo assertions validate the flow with a mock image payload, not browser image security/downloads. Native Canvas inspection validates drawing code, not browser compatibility or DOM layout.

## Browser verification blocked

The local static server started, but HTTP requests and the in-app preview timed out. Direct file navigation in the in-app browser was rejected by its URL security policy. Desktop browser input did not load the game; another window detected concurrent user input, so interaction stopped. No Chrome/Brave, Edge, Firefox, Safari or iOS browser pass is claimed.

Still to verify in real browsers:

- Direct-file and HTTP execution; console errors and missing assets.
- Every button, focus/shortcuts, pointer/touch movement and pinch zoom.
- Six viewport sizes with HTML/CSS overlays, rotation, safe areas, modal scroll and joystick placement.
- Photo capture/download, save export/import, persistence after browser restart.
- Sound/volume/mute, fullscreen, reduced motion and background-tab suspension.
- Frame rate, memory, battery and storage quota on real devices.

## Known gaps versus the full brief

- Four character poses, not a finished eight-direction walk/idle/sit/rest set. Rear walking has no stride frames; horizontal directions use mirroring.
- AI-derived art rather than exact extraction; some sprite edge fringes.
- Compact procedural environments share interaction coordinates. Complex building-depth overlaps need testing.
- Hakone decoration is a saved vignette, not an explorable interior. Selection names are recorded; the visible vignette does not yet show every color/flower variant.
- Companion play is narrative plus following, not a separate fetch minigame. Care uses seated poses, not custom pet/feed animation.
- Level rewards are journal titles/accessory names, not equipped costumes.
- Simple synthesized audio, not a full destination-specific soundtrack.
- Latest 24 photos retained. Storage quota can be reached; JSON export is the fallback. Exact walking/camera positions are not saved.
- Manual quality selection with capped pixel density; no automatic performance tuning.
- Full-browser and mobile-hardware QA not completed.

## Reproduce logic tests

From this directory run `node tests/logic.cjs` if Node is available. This optional development test creates no browser progress; the game itself does not require Node. Test mocks are never loaded by index.html.
