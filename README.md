# SOFIA BENNETT ONLY

**A door policy simulator.** You are the bouncer at the most exclusive party in town.
Level 1's guest list has exactly one name on it:

> ### Sofia Bennett

Every level adds another name. Everyone in the queue is wearing a name tag.
Most of them are lying.

<p align="center">
  <img src="icons/icon-512.png" width="120" alt="Sofia Bennett Only">
</p>

---

## The joke

The rule is about **the tag**, not the person.

A raccoon with a perfectly spelled `Sofia Bennett` tag? **In.** Enjoy the party.
An actual human whose tag says `Sofia Bennet`? **Out.** One T short. Not tonight.

The impostors get sneakier as the night goes on: `Sofia Bennett™`, `Sofa Bennett`,
`DJ Sofia Bennett`, `Sofia Bennett Long-Stay Parking`. And eventually, at speed,
`Sofia Bennet`.

### The list grows

That would get old with one name, so the guest list expands every level:

| Level | The list gains | Who |
|---|---|---|
| 1 | opens with one name | `Sofia Bennett` |
| 2–4 | the rest of the family, shuffled | `Caspian Bennett`, `Justin Bennett`, `Beata Bennett` |
| 5–8 | whoever these people are, shuffled | `Isabella Kapinska`, `baba yola`, `Mylo 🐶`, `John Lennon` |
| 9+ | nothing new — the clock tightens instead | all eight |

By level 8 you are scanning eight names, one of which is a dog, under a shrinking
timer, while an impostor called `Mylo 🐱` walks up to the rope. A longer list buys you
a little more time per guest and pays more per correct call — then the deep levels
take the time back.

## How to play

- **Swipe the guest right** (or tap **LET IN**) if the tag matches *any* name on tonight's list, exactly.
- **Swipe left** (or tap **BOUNCE**) if it is off by so much as a letter, a comma, or a `™`.
- Three mistakes and your shift is over.
- Correct calls build a streak; the faster you call it, the more it scores.
- **Gold tags** are worth triple and forgive a strike. Same rule, free upside.
- Get it wrong and the game shows you exactly which character betrayed you.

The full list stays pinned to the top of the screen the whole time. This is not a
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

### Deploy it — this is the link you can actually send people

`.github/workflows/pages.yml` publishes the repo root to GitHub Pages, which gives you
an ordinary public URL anyone can tap:

```
https://goonbypass57-eng.github.io/Funigame/
```

**Pages has to be switched on once by hand** — Settings → Pages → Source: **GitHub
Actions**. The workflow cannot do this for you: `GITHUB_TOKEN` can *deploy* to Pages
but not *create* the Pages site, so the first run fails with "Resource not accessible
by integration" until a repo admin flips that setting. After that, every push deploys
and the URL keeps working.

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

## Make it about your own people

Everything lives in `js/names.js`:

- `FIRST_NAME` — who level 1 opens with.
- `FAMILY_POOL` — added over levels 2–4, in random order.
- `WILD_POOL` — added over levels 5–8, in random order.
- `JOKES` — per-name hand-written impostors: `t1` spottable from orbit, `t2` wrong by
  a whole word. Single-character cruelty is generated procedurally, so a name works
  even with no `JOKES` entry at all.

The HUD list, the rules screen, and the verdict card all read from these, so adding a
name is a one-line change.

**Two fairness rules the generator enforces for you**, in `mutate()` and
`makeImpostor()`:

1. Never a **case-only** or **whitespace-only** difference — unspottable at speed.
   This is why `baba yola` can sit on the list in lowercase safely.
2. **Never an impostor that equals a name currently on the list.** Without this,
   mutating `Justin Bennett` could produce `Sofia Bennett` and punish a correct call.
   `makeImpostor()` takes the live list and checks every candidate against it.

`node tools/fairness-check.js` asserts both across every roster configuration.

## Tech notes

- Vanilla HTML/CSS/JS. No frameworks, no bundler, no `node_modules`.
- Portrait-first, thumb-zone controls, safe-area insets, no page scroll.
- Pointer Events for swipe, so mouse and touch share one code path.
- `prefers-reduced-motion` is respected; audio can be muted and the choice persists.
- High score, best streak, and lifetime door stats live in `localStorage`.
