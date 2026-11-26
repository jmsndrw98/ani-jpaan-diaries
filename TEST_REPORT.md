# Verification — Companions & Changing Skies Edition

27 November 2026. **661 logic/interaction assertions passed**: 413 base assertions, 22 motion/fetch/activity regressions, 121 quest/train/loading checks 61 environment/companion checks 16 timezone/clock checks and 28 music checks. Game scripts pass Node syntax checks. This report distinguishes source-level and native-render evidence from browser execution.

## Background audio and AM/PM follow-up

- Verified hidden-page logic does not pause the music player; returning preserves position. Leaving during the fade sets the saved volume without waiting for further animation frames. Mute and per-place Off remain respected while hidden.
- Web Audio ambience suspends while hidden; native song looping continues. Closing/navigating away from the page ends playback. Browser/OS background-audio restrictions have not been tested on real devices.
- Both PH and Japan displays now include AM/PM. Midnight is 12:00 AM; noon is 12:00 PM. Numeric 24-hour values still drive lighting. Both dates and Japan’s next-day marker are retained.

## Music checks

- Compared all four copied recordings byte-for-byte with their supplied originals; recorded SHA-256 hashes, durations and `mp4a` sample entries.
- Mocked HTML audio tests cover gesture-gated start, per-place automatic selection, native loop enabled, 40% volume, fade completion, repeated clicks preserving position, current/future place selection, mute/unmute, zero volume, per-place Off, continued native playback while hidden and no restart on return and a single song player.
- Rejected autoplay produces an Enable music message without repeated frame-by-frame playback attempts. A new gesture retries. Actual settings dropdown and reset callbacks select tracks and restore defaults; destination loading completion dispatches the assigned track.
- Save validation preserves choices and new volume preferences, migrates old diaries once to 40%, and rejects invalid track IDs.
- Packaging validates source hashes, all four embedded single-file audio payloads, relative ZIP assets and archive integrity.
- Audible playback and decoding have not been checked in a live browser. Autoplay policy, M4A support, native loop boundaries and device volume behavior remain unverified. No seamless looping or mobile audio certification is claimed.

## Philippine/Japan clock checks

- Explicit IANA zones Asia/Manila and Asia/Tokyo; verified one-hour separation independently of the host timezone.
- Midnight, New Year and leap-day rollover, 12:00 AM/PM formatting at midnight and noon, separate dates and Japan’s next-day HUD marker.
- Real-time lighting uses wall time rather than accumulated frame delta, and catches up after the page is inactive.
- Manual preview does not change either real clock; both keep updating. The real PH sync button restores aligned lighting.
- Fresh and previous diaries default to PH sync; explicit manual preview choice round-trips through save validation.
- Live clock display and lighting use the user device’s clock. No network time service or real weather forecast is queried. Live browser layout remains unverified.

## Environment and companion checks

- Both dogs approach, wait for the untimed paw cue, complete the interaction and award XP once. Cancelling clears both character poses. Stay holds position; Follow resumes movement.
- Happy and Toti complete guidance routes in all four destinations. Toti prioritizes active quest parcels. Guidance grants no XP and travel resets commands. Explicit cancellation stops a guided walk.
- Midnight wrap, a complete optional 12-minute fast cycle, pause/resume, all six selectable time phases and matching time progression at 30/60/144 Hz.
- Four distinct local weather profiles each cycle through four conditions including rain. Midnight/rain and daylight/clear visual states settle correctly and blend between changes.
- Clock/weather persistence, old-save migration and malformed-state sanitization. Menus pause the optional fast cycle; reduced motion retains clock progression without moving weather particles.
- Actual mocked UI callbacks choose midnight, rain, cycle resume and the selected dog’s paw interaction.
- Native-Canvas render inspection of all four destinations in clear morning, rainy afternoon and misty midnight (12 renders at 768×432), plus both paw poses. The exported weather contact sheet has no HTML HUD.
- Browser UI layout, touch dispatch, pointer hit testing on actual devices, live audio and measured browser frame rates remain unverified.

## Earlier revision checks

- Accepted and completed all four quests through actual route traversal and arrival interactions; all 12 item coordinates are walkable. Tested station delivery through the real button callback.
- Duplicate acceptance, repeated collection, remote collection, remote delivery and repeated rewards are rejected. All four rewards total 240 XP and four journal entries.
- Quest progress survives save validation after every item. Completed items stay removed on revisiting. Old saves without quest fields migrate; malformed progress is sanitized.
- Movement is blocked during loading; progress reaches 100% after real preparation jobs. Interrupting one destination load with another prepares the newest world.
- Train acceleration starts at zero. Integrated distance agrees at 30, 60 and 144 Hz. Pause/resume preserves position; reduced motion stops the train scenery clock.
- Eight native-Canvas renders: quest scenery and train at 1366×768, 360×800, 768×1024 and 844×390. Inspected face crops and train/world images. Train preview: 180 frames at 30 fps, without HTML narration/HUD.
- Standalone script execution, embedded portrait/face/icon paths, ZIP integrity and original reference hashes checked during packaging.

## Previous checks

- All chapter interaction routes and continuous arrivals; blocked buildings and diagonal corner safety.
- No zero-motion frame at intermediate waypoints on the regression route.
- Keyboard movement remains within 0.05 world units after one second at 30 versus 144 Hz. Exact integration fixed a real frame-rate-dependent acceleration error found during testing.
- Automatic interaction on arrival at a clicked/selected destination.
- Happy and Toti retrieve and return a thrown toy; repeat fetch does not farm XP. Cancelling care awards no XP. Held velocity is cleared on blur.
- Tea’s accessible whisk/pour callback flow, picnic placement/sharing callbacks, saved decoration selections and the complete lantern melody sequence.
- Activity animation cleanup when the dialog closes.
- Four chapter gates, stamps, souvenirs, ending/free travel, journal data and independent friendship state.
- Save validation and mocked storage round-trip; malformed version rejection; unsafe photo URL removal; quota failure handling.
- Coordinate projection/inverse projection at all six specified viewport sizes.
- Native-Canvas scene renders for all four worlds and train at desktop, phone and tablet dimensions (1366×768, 360×800, 768×1024). Actual rig/portrait pixels and a walking-pose contact sheet inspected.
- A six-second, 180-frame motion preview produced from the real movement/renderer code. It omits the HTML/CSS HUD and is not a browser recording.
- Source references and export contents checked; original reference hashes unchanged; favicon retained.

## Drawing performance evidence

The previous visual revision’s 180-frame native-Canvas simulation at 768×432 measured approximately **4.9 ms average / 7.2 ms p95 drawing time** after warm-up. An earlier version of this revision measured roughly 34/50 ms. Tight prop buffers, off-screen culling and reusable gait-pose caches removed that bottleneck. These measurements cover the native drawing call only: they are not browser FPS, input latency, audio, battery, GPU or low-end mobile certification.

## Verification limits

Logic/interaction checks use DOM and storage mocks. Native drawing uses a development Canvas implementation. These do not test browser layout, pointer dispatch, file permissions, audio output or the exact browser Canvas implementation.

The earlier in-app HTTP preview timed out, direct-file browser navigation was rejected by the browser URL policy, and native browser interaction encountered concurrent user input. Those limits were not bypassed. No Chrome/Brave, Edge, Firefox, Safari or iOS browser pass is claimed for this revision.

Still requiring real browser/device checks: direct-file and HTTP launch; full HTML/CSS layouts at all six viewport sizes; all touch/pinch/rotation/safe-area behavior; visible focus; photo/download/import dialogs; persistence across restart; audio/fullscreen; reduced-motion preferences; and actual frame rate/memory usage on target hardware.

## Remaining scope gaps

- Pixel rigs preserve recognizable design cues but are not exact reference extractions. Four mirrored front/rear orientation combinations are used, not eight separately illustrated directions. Seated/feeding poses remain simplified.
- Environment maps remain small and share interaction coordinates. Occlusion fading helps visibility; complex structure-depth overlap cases need browser inspection.
- Hakone’s room is an interactive preview rather than a separately walkable interior.
- Accessory rewards remain journal items, not equipment. Procedural audio remains a short sound bed.
- Latest 24 photos are retained. LocalStorage quota can be reached; JSON export is the fallback. Exact position/camera state is not saved.

## Reproduce

Optional development check: `node tests/music.cjs` from the extracted folder. It includes all earlier suites. Node and development Canvas/image tools are not required to play. Test-only mocks are not loaded by index.html.
