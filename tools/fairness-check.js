#!/usr/bin/env node
/* Guards the two rules that keep the game fair to play. Run after editing the
 * name lists in js/names.js:
 *
 *   node tools/fairness-check.js
 *
 * 1. An impostor must never equal a name currently on the list. Mutating
 *    "Justin Bennett" could otherwise produce "Sofia Bennett", and the player
 *    gets a strike for a correct call.
 * 2. A difference must be visible: never case-only, never whitespace-only.
 *    This is what lets "baba yola" sit on the list in lowercase safely.
 */
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'names.js'), 'utf8');
const win = {};
new Function('window', src)(win);
const C = win.SB_CONTENT;

const ROSTER = [C.FIRST_NAME, ...C.FAMILY_POOL, ...C.WILD_POOL];
const PER_CASE = Number(process.env.SAMPLES || 400);

let failures = 0;
const fail = (msg) => { console.log('  FAIL  ' + msg); failures++; };

console.log('roster (' + ROSTER.length + '): ' + ROSTER.map((n) => JSON.stringify(n)).join(', '));

// Every prefix of the roster is a list the player can actually face.
let generated = 0;
const distinct = new Set();
for (let size = 1; size <= ROSTER.length; size++) {
  const active = ROSTER.slice(0, size);
  for (const target of active) {
    for (let tier = 1; tier <= 3; tier++) {
      for (let i = 0; i < PER_CASE; i++) {
        const imp = C.makeImpostor(target, active, tier);
        generated++;
        distinct.add(imp);
        const lower = imp.toLowerCase();

        if (active.some((a) => a === imp)) {
          fail('impostor equals a listed name: ' + JSON.stringify(imp));
        }
        for (const a of active) {
          if (imp !== a && lower === a.toLowerCase()) {
            fail('case-only difference from ' + JSON.stringify(a) + ': ' + JSON.stringify(imp));
          }
        }
        if (imp.trim() !== imp) fail('leading/trailing space: ' + JSON.stringify(imp));
        if (/\s\s/.test(imp))   fail('collapsed double space: ' + JSON.stringify(imp));
        if (imp === target)     fail('identical to its target: ' + JSON.stringify(imp));
      }
    }
  }
}

// Every listed name needs enough distinct impostors that the pool never feels stale.
for (const name of ROSTER) {
  const s = new Set();
  for (let i = 0; i < 600; i++) {
    const m = C.mutate(name);
    if (m) s.add(m);
  }
  if (s.size < 12) fail('only ' + s.size + ' procedural variants for ' + JSON.stringify(name));
}

console.log('checked ' + generated.toLocaleString() + ' impostors, ' + distinct.size + ' distinct');
console.log(failures ? '\n' + failures + ' FAIRNESS FAILURE(S)' : '\nfairness OK');
process.exit(failures ? 1 : 0);
