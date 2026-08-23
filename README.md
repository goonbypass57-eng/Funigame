# SOFIA BENNETT ONLY

**A door policy simulator.** You are the bouncer at the most exclusive party in town.
Tonight's guest list has exactly one name on it:

> ### Sofia Bennett

Everyone in the queue is wearing a name tag. Most of them are lying.

<p align="center">
  <img src="icons/icon-512.png" width="120" alt="Sofia Bennett Only">
</p>

---

## The joke

The rule is about **the tag**, not the person.

A raccoon with a perfectly spelled `Sofia Bennett` tag? **In.** Enjoy the party.
An actual human woman whose tag says `Sofia Bennet`? **Out.** One T short. Not tonight.

That is the entire game, and it stays funny for a surprisingly long time — because the
impostors get sneakier as the night goes on. `Sofia Bennett™`. `Sofa Bennett`.
`DJ Sofia Bennett`. `Sofia Bennett Long-Stay Parking`. And eventually, at speed,
with 1.5 seconds on the clock: `Sofia Bennet`.

## How to play

- **Swipe the guest right** (or tap **LET IN**) if the tag reads *exactly* `Sofia Bennett`.
- **Swipe left** (or tap **BOUNCE**) if it is off by so much as a letter, a comma, or a `™`.
- Three mistakes and your shift is over.
- Correct calls build a streak; the faster you call it, the more it scores.
- **Gold tags** are worth triple and forgive a strike. Same rule, free upside.
- Get it wrong and the game shows you exactly which character betrayed you.

The correct spelling is pinned to the top of the screen the whole time. This is not a
memory test — it is a *staring* test, under time pressure, while a duck yells at you.

Desktop players can use ← and → arrow keys.

## Play it

It is a single static page with no build step and no dependencies.

```bash
git clone https://github.com/goonbypass57-eng/Funigame.git
cd Funigame
python3 -m http.server 8000
```

Then open `http://localhost:8000` — on your phone, use your machine's LAN IP
(`http://192.168.x.x:8000`) so you get real touch controls.

Opening `index.html` directly from disk works too; you just lose offline caching.

### Install it to your home screen

It ships as a PWA — manifest, icons, and a service worker that caches the whole game.
Open it in mobile Safari or Chrome and choose **Add to Home Screen**. After the first
load it runs fullscreen and completely offline, on a plane, in a basement, anywhere.

### Deploy it

`.github/workflows/pages.yml` publishes the repo root to GitHub Pages. Enable it under
**Settings → Pages → Source: GitHub Actions**, and every push deploys.

### One file, no server

If you just want something you can email, drop on a USB stick, or open by
double-clicking:

```bash
node tools/build-standalone.js
```

That inlines the CSS, the content pack, and the game into a single ~48 KB
`dist/sofia-bennett-only.html` with no external references at all. It works from
`file://`, offline, forever. (`--artifact` emits the same thing as a body fragment,
for hosts that supply their own page skeleton.)

## Project layout

```
index.html               screens: title, rules, game, shift report
css/styles.css           the whole look — velvet rope after midnight
js/names.js              content pack: the true name, the impostors, the guests
js/audio.js              WebAudio bleeps, synthesised — no audio files
js/game.js               game loop, scoring, waves, swipe input, the diff highlighter
sw.js                    offline cache
manifest.webmanifest     PWA install metadata
icons/                   generated app icons
tools/build-standalone.js  inlines everything into one portable HTML file
```

## Make it about someone else

Open `js/names.js`, change `TRUE_NAME`, and rewrite the three impostor tiers to be
typos of the new name. `TIER1` should be obvious, `TIER2` wrong by a word, and `TIER3`
wrong by a single character. Everything else — the strip at the top of the HUD, the
rules screen, the "should have read" line on the verdict card — reads from that one
constant and updates itself.

Two rules keep it fair: never make **case** the difference (players read at speed and
tag text is rendered verbatim), and never make **invisible whitespace** the difference.
Every impostor should be something a person could actually spot.

## Tech notes

- Vanilla HTML/CSS/JS. No frameworks, no bundler, no `node_modules`.
- Portrait-first, thumb-zone controls, safe-area insets, no page scroll.
- Pointer Events for swipe, so mouse and touch share one code path.
- `prefers-reduced-motion` is respected; audio can be muted and the choice persists.
- High score, best streak, and lifetime door stats live in `localStorage`.
