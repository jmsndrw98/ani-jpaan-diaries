# Ani’s Japan Diaries — Companions & Changing Skies Edition

An offline HTML5 adventure with Ani, Happy and Toti. This revision keeps the chunky pixel style and rebuilds movement, active character art, scenery and activities around it.

## Play

Extract the ZIP and open `index.html` in a modern browser, keeping the scripts and assets folders beside it. Alternatively open the separate **Anis-Japan-Diaries-Standalone.html** export. No account, installation, build step, network API or runtime library is required. The source folder can also be uploaded to a static host.

Browser execution could not be certified in this environment. See TEST_REPORT.md for the distinction between verified source/render tests and outstanding browser/device checks.

## Music for every place

| Destination | Default background music |
| --- | --- |
| Kyoto | Kawaranai Mono |
| Nara | secret base ～君がくれたもの～ feat えみい |
| Hakone | Sparkle — movie ver. |
| Tokyo | Grand Escape (Movie Edit) feat Toko Miura |

The four user-supplied M4A recordings are included locally and embedded in the single-file export. **BGM defaults to 40%**; old diaries adopt this once, then keep future volume changes. Songs loop using the browser’s native audio looping. Tracks switch on destination arrival with a short fade-in. Repeated clicks and walking do not restart the current track; there is only one song player.

In **Settings → Music for each place**, choose any included song (or No music here) for each destination. The current place switches immediately; other selections take effect on arrival. Choices and volume save automatically. Reset songs & BGM to 40% restores the table above. Muting and zero volume pause BGM. Switching tabs or minimizing keeps the song playing and looping; the short fade completes immediately if you leave before it finishes. Keep the game tab open—closing it or navigating away ends playback. Browser/OS background restrictions may still interrupt audio.

Browser audio begins after a user gesture, normally Begin. If a browser blocks it, use **Enable music** in Settings; the status line reports errors or blocked playback. The original synthesized melody is removed; quiet ambience and interaction effects remain independently adjustable. Actual audible playback, M4A codec compatibility, loop boundaries and device volume behavior still need browser/device verification. The standalone file is larger because it includes all four original recordings.

## Philippine and Japan clocks

The game’s lighting now follows **live Philippine time (Asia/Manila)** by default. The HUD displays both **PH** and **Japan (Asia/Tokyo)** in 12-hour AM/PM format; Japan is one hour ahead, with a next-day marker when needed. The Time & Weather panel shows both dates as well. Clocks use the device’s current time, with no network request or account required.

Real-time lighting catches up when you return to the game, including after menus or a hidden tab. Old saves automatically adopt PH sync. Selecting a time phase switches to a manual lighting preview; both live clocks keep running. Choose **Use Philippine time** to return to synchronization. The optional fast day cycle remains available. Weather is simulated, not a live forecast.

## Companions & changing skies update

- Click **Happy** or **Toti** to open that dog’s own menu. The Friends button / **P** also lets you choose a dog. Both support ear scratches, treats, fetch, **Give paw**, **Stay here** and **Follow me**.
- Give paw is an untimed interaction: the dog approaches and offers a paw; tap the dog, press **E**, or choose **Take paw** to respond. It gives 10 XP and 6 friendship once per dog per chapter. Repeating it stays available without repeat rewards.
- Happy can lead you to a resting spot. Toti follows his nose to an active quest item, or the chapter’s secret. They wait at the destination; walk over and press E to explore. Choose Follow me to call them back. Travel resets stay/lead commands.
- **Morning, Day, Afternoon, Evening, Night and Midnight** cycle continuously. The default follows the real Philippine day; the optional fast cycle takes 12 minutes of active exploration. Sky colors, world lighting and warm nighttime lights blend gradually.
- Every destination has its own automatic weather sequence, changing about every 90 active seconds: clear skies, clouds, breezes, rain and/or mist. Animated rain and leaves respect reduced-motion settings.
- Click the **time/weather badge** or press **T** to choose a time or weather. Selecting a phase opens a manual preview; choose Use Philippine time to restore sync, or Resume fast cycle for accelerated time. A manual weather choice applies across destinations. Automatic weather follows local profiles.
- Only the optional fast cycle and simulated weather pause in menus, during loading/cinematics and while the page is hidden. The real clocks resynchronize automatically. Time/weather settings save with the diary, including old-save migration. Photo lighting reflects the current time and atmosphere.

## Requests & railways update

- Press **Q** or choose **Requests** to accept the current destination’s optional errand. Find three illustrated cards/pages, then return them at the station. Use **Guide me** to walk to the next item automatically.
- Four stories: Kyoto’s lost postcards, Nara’s field guide, Hakone’s weather sketches and Tokyo’s wish cards. Each gives 60 XP and a journal keepsake once. Progress and delivery status save with your diary; old saves remain compatible.
- Train scenery accelerates gently, with independently moving mountain, village and tree layers. **Pause scenery** freezes the view without skipping the story. Reduced-motion settings keep it still.
- A loading screen features Ani, Happy and Toti’s faces. Its progress reflects scenery, prop and animation preparation, spread over frames. It stays visible for at least 2.2 seconds, then fades out over 0.32 seconds (no fade with reduced motion). Slower preparation finishes before revealing the game. It also appears on destination changes, and prevents input until preparation finishes.
- The request archive records collected keepsakes across all four destinations. Requests never block chapter progression.

## Previous visual improvements

- A unified set of code-authored pixel character rigs replaces the generated four-pose atlas in active gameplay. Ani’s glasses, sakura kimono and parasol, Happy’s straw hat and armor, and Toti’s upright ears, leather armor and curled tail remain the defining cues.
- Distance-driven articulated walking, eased starts/stops, resting transitions, arm movement, tail motion and stable foot origins.
- Path traversal no longer pauses at every tile. Safe path lookahead, collision padding, exact exponential keyboard-velocity integration, continuous camera following and eased zoom.
- More detailed roofs, shoji windows, timber, stone paths, sakura canopies, forest foliage, Hakone pines, riverbanks and lantern lighting.
- Cached terrain/props, tightly sized prop buffers, off-screen culling and bounded animation caches reduce drawing work.
- Click an interaction marker or checklist item to walk there and interact automatically. Hover a marker for its name. Click a tree for falling petals/leaves. Click a dog to open companion care.
- Petting and feeding happen in the world. Fetch waits for your throw, then the dog retrieves and returns the toy before receiving a once-only reward.
- Matcha whisking by dragging or keyboard button, movable picnic dishes, live room decoration preview and an untimed visual/audio lantern melody.
- Cleaner menus, larger controls, reduced-motion handling, photo capture without route/interaction markers, and the existing sakura favicon.

## Controls

- **WASD / arrows:** walk; click/tap a path for automatic movement.
- **E:** interact; during fetch aiming, toss the toy ahead.
- **C:** take a photo; **J:** journal; **M:** travel; **P:** companions; **Q:** requests; **T:** time & weather.
- **+ / −**, wheel, on-screen buttons or pinch: zoom.
- **Escape:** close a dialog or skip a cinematic.
- Settings: touch joystick, independent sound volumes, reduced motion, quality and save export/import.

Complete a landmark, local activity, keepsake, photo and rest in each chapter to unlock the next train. The four destinations, passport, journal, independent friendships and local saves remain. Existing version-1 saves are accepted. Care rewards are granted on completion, never on cancellation. There are no combat, energy restrictions or forced timers.

## Files

`game.js` coordinates play. `scripts/motion.js` handles continuous movement. `scripts/art.js` draws pixel rigs. `scripts/renderer.js` renders/caches the world. `scripts/play.js` handles world interaction and companion care/fetch. `scripts/activities.js` implements the four activities. `scripts/world.js` handles collision and A*. `scripts/quests.js` manages optional errands and `scripts/loading.js` prepares assets in frame-sized batches. `scripts/environment.js` handles the shared clock, local weather sequences and atmospheric rendering. UI, chapter data, saving and sound have their own scripts.

The source ZIP includes unchanged original references, icon files, portrait PNGs, source code and tests. The standalone export embeds all runtime files and portraits. The separate weather contact sheet (rows: Kyoto, Nara, Hakone, Tokyo; columns: clear morning, rainy afternoon, misty midnight) and motion/train preview GIFs are native-Canvas simulations without HTML menus or narration, not browser recordings.

## Remaining scope limits

Characters are stylized pixel interpretations, not exact raster extractions. Front/rear drawings are mirrored for lateral directions; this is not eight separately illustrated directional sprite sheets. Hakone’s room is an interactive activity preview rather than a walkable interior. Level accessories are journal rewards, not equipped costumes. Ambience and effects are synthesized; BGM uses the supplied recordings. Latest 24 photos are retained; browser storage limits still apply. Browser/mobile behavior and performance need live verification.

The original GAME_DESIGN.md remains the target brief, not a claim that every target has been certified. See ASSET_GUIDE.md, LICENSES.md and TEST_REPORT.md.
