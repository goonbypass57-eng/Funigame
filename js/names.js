/* ============================================================
   SOFIA BENNETT ONLY  —  content pack
   The list grows every level. Everything else is a filthy impostor.
   ============================================================ */

/* Level 1 always opens with her, alone. */
const FIRST_NAME = 'Sofia Bennett';

/* Levels 2-4 pull from the family, in random order. */
const FAMILY_POOL = ['Caspian Bennett', 'Justin Bennett', 'Beata Bennett'];

/* Level 5+ pulls from... whoever these people are. */
const WILD_POOL = ['Isabella Kapinska', 'baba yola', 'Mylo \u{1F436}', 'John Lennon'];

/* Hand-written impostors, per name. tier 1 = spot it from orbit,
   tier 2 = a whole word has gone wrong. Single-character cruelty is
   generated procedurally below, because there is no writing all of it. */
const JOKES = {
  'Sofia Bennett': {
    t1: ['Steve', 'Kevin', 'Gary', 'Barry Trumbull', 'Sophia Bennett', 'Sofia Bennington',
         'Dave Bennett', 'Sofia Rodriguez', 'Bennett Sofia', 'Sofia', 'Bennett', 'Guest', 'VIP',
         'Not Sofia Bennett', 'Definitely Sofia Bennett', 'Sofia Bennett’s Cousin',
         'Sofia Bennett’s Mom', 'The Sofia Bennett', 'Sofia Bennett Fan Club',
         'Sofia Bennett Tribute Act', 'Sofia Bennett Cover Band', 'Sofia Bennett Experience',
         'Sofia Bennett Municipal Airport', 'Sofia Bennett Long-Stay Parking',
         'Sofia Bennett & Guest', 'Sofia Bennett, Probably', 'Sofia Bennett (Unverified)',
         'Sofia Bennett (Legally Distinct)', 'Sofia Bennett (Retired)', 'DJ Sofia Bennett',
         'Lil Sofia Bennett', 'Sofia Bennett Jr.', 'Sofia Bennett III', 'Sofia Bennett, PhD',
         'Mrs. Sofia Bennett', 'Sofa Bed Bennett', 'Sofia Bennett Holdings LLC'],
    t2: ['Sofia Bennette', 'Sofia Benett', 'Sofie Bennett', 'Sofia Bennetta', 'Sofia Beennett',
         'Sofia Bennott', 'Sofla Bennett', 'Sofia Bennetts', 'Sophia Bennet', 'Sofya Bennett',
         'Sofia Benneth', 'Sofiaa Bennett', 'Sofia Bennitt', 'SofiaBennett', 'Sofia-Bennett',
         'Sofia Bennett-Bennett', 'Sofa Bennett', 'Sofia Bennettson', 'Sofia Benjamin',
         '"Sofia Bennett"', 'Sofia Bennett™', 'Sofia Bennett x2']
  },
  'Caspian Bennett': {
    t1: ['Caspian', 'Caspian Sea', 'The Caspian Bennett', 'Caspian Bennett & Sons',
         'Caspian Bennett (Boat)', 'Captain Caspian Bennett', 'Caspian Bennett Jr.',
         'Caspian Bennett Fan Club', 'Casper Bennett', 'Caspian Rodriguez',
         'Caspian Bennett, Probably', 'Not Caspian Bennett', 'Caspian Bennett Ferry Terminal'],
    t2: ['Caspien Bennett', 'Caspion Bennett', 'Caspain Bennett', 'Kaspian Bennett',
         'Caspiann Bennett', 'CaspianBennett', 'Caspian Benett', 'Caspian Bennette',
         'Caspian-Bennett', 'Caspian Bennnet', 'Caspian Bennott']
  },
  'Justin Bennett': {
    t1: ['Justin', 'Justin Case', 'Justin Time', 'Just Bennett', 'Justin Bennett Jr.',
         'Justin Bennett (Legally Distinct)', 'DJ Justin Bennett', 'Justin Bennett’s Dad',
         'Justin Rodriguez', 'Dustin Bennett', 'Not Justin Bennett', 'Justin Bennett & Guest',
         'Justin Bennett Tribute Act'],
    t2: ['Justine Bennett', 'Justen Bennett', 'Justyn Bennett', 'Jusin Bennett',
         'Justin Benett', 'Justin Bennette', 'JustinBennett', 'Justin-Bennett',
         'Justin Bennetts', 'Justin Bennott', 'Juston Bennett']
  },
  'Beata Bennett': {
    t1: ['Beata', 'Beta Bennett', 'Beata Bennett (Beta)', 'Beans Bennett', 'Beata Rodriguez',
         'Beata Bennett Jr.', 'The Beata Bennett', 'Not Beata Bennett', 'Beata Bennett & Guest',
         'Beatrice Bennett', 'Beata Bennett Fan Club'],
    t2: ['Beatta Bennett', 'Beeta Bennett', 'Beato Bennett', 'Beata Benett', 'Bata Bennett',
         'BeataBennett', 'Beata-Bennett', 'Beata Bennette', 'Beata Bennetts', 'Beata Bennott']
  },
  'Isabella Kapinska': {
    t1: ['Isabella', 'Kapinska', 'Isabella Kaminska', 'Bella Kapinska', 'Isabella Kapinski',
         'Isabella Kapinska Jr.', 'Not Isabella Kapinska', 'Isabella Kapinska & Guest',
         'Isabella Rodriguez', 'DJ Isabella Kapinska', 'Isabella Kapinska (Unverified)'],
    t2: ['Izabella Kapinska', 'Isabela Kapinska', 'Isabella Kapinsca', 'Isabella Kapniska',
         'Isabella Kapinskaa', 'IsabellaKapinska', 'Isabella-Kapinska', 'Isabella Kapinsky',
         'Isabella Kopinska', 'Isabella Kapinskia']
  },
  'baba yola': {
    /* lowercase on purpose. no case-only impostors are ever generated,
       so the difference is always something you can actually see. */
    t1: ['baba', 'yola', 'baba yoga', 'baba yaga', 'baba yola jr.', 'not baba yola',
         'the baba yola', 'baba yola & guest', 'baba yola fan club', 'baba cola',
         'baba yola (unverified)', 'papa yola'],
    t2: ['baba yoia', 'baba yolla', 'babba yola', 'baba yolo', 'babayola', 'baba-yola',
         'baba yolah', 'bada yola', 'baba yela', 'baba yolas']
  },
  'Mylo \u{1F436}': {
    /* the dog emoji is part of the name. losing it is a bounce. */
    t1: ['Mylo', 'Mylo \u{1F431}', 'Mylo \u{1F436}\u{1F436}', 'Mylo \u{1F32D}', 'Mylo \u{1F43A}',
         'Milo \u{1F436}', 'Mylo (dog)', 'Mylo the Dog', 'Mylo \u{1F436} Jr.', 'Not Mylo \u{1F436}',
         'Mylo \u{1F436} & Guest', 'Good Boy', 'Mylo \u{1F436}™'],
    t2: ['Mylo\u{1F436}', 'Myloo \u{1F436}', 'Mylon \u{1F436}', 'Myla \u{1F436}', 'Mvlo \u{1F436}',
         'Mylo \u{1F415}', 'Mylo \u{1F429}', 'Mylo- \u{1F436}', 'Mylos \u{1F436}']
  },
  'John Lennon': {
    t1: ['John', 'Lennon', 'John Lemon', 'John Lennon (Tribute)', 'Johnny Lennon',
         'John Lennon Cover Band', 'Not John Lennon', 'John Lennon & Guest', 'Jon Lennon',
         'John Lennon Fan Club', 'John Lennon Impersonator', 'Sean Lennon', 'John Bennett'],
    t2: ['John Lennnon', 'John Lenon', 'Johnn Lennon', 'John Lennen', 'John Lennons',
         'JohnLennon', 'John-Lennon', 'Jhon Lennon', 'John Lennan', 'John Lennonn']
  }
};

/* Guests are flavour only. The rule is always, only, the tag. */
const GUESTS = [
  ['\u{1F9D1}‍\u{1F3A4}', 'insists she is "the original"'],
  ['\u{1F57A}', 'has been practising this walk all week'],
  ['\u{1F99D}', 'found this tag in a dumpster. so what.'],
  ['\u{1FAB4}', 'photosynthesising aggressively'],
  ['\u{1F415}', 'very good. extremely good.'],
  ['\u{1F469}‍⚖️', 'will litigate if bounced'],
  ['\u{1F9DB}', 'legally requires an invitation'],
  ['\u{1F35E}', 'is bread. is wearing a tag.'],
  ['\u{1F47D}', 'learned English 20 minutes ago'],
  ['\u{1F916}', 'BEEP. PARTY. BEEP.'],
  ['\u{1F9D9}', 'conjured this tag out of fog'],
  ['\u{1F419}', 'wearing eight tags, showing one'],
  ['\u{1F475}', 'is 94 and ready to rave'],
  ['\u{1F6B4}', 'has not stopped pedalling'],
  ['\u{1F988}', 'somehow'],
  ['\u{1F9D1}‍\u{1F680}', 'just got back, wants a drink'],
  ['\u{1F46F}', 'there are two of her, one tag'],
  ['\u{1F414}', 'clucking the bassline already'],
  ['\u{1F9D1}‍\u{1F373}', 'brought a small quiche, uninvited'],
  ['\u{1F385}', 'off-season, extremely bored'],
  ['\u{1F408}', 'knocked the guest list off the table'],
  ['\u{1F986}', 'loud. so loud.'],
  ['\u{1F9DF}', 'shambling, but polite about it'],
  ['\u{1F41D}', 'brought 40,000 friends (waiting outside)'],
  ['\u{1F9D1}‍\u{1F4BC}', 'says she "knows the owner"'],
  ['\u{1F984}', 'refuses to explain the horn'],
  ['\u{1F3A9}', 'it is just the hat. there is no one here.'],
  ['\u{1F9A5}', 'took four hours to reach the rope'],
  ['\u{1F42E}', 'has a plus one, also a cow'],
  ['\u{1F47B}', 'technically already inside'],
  ['\u{1F9DC}', 'dripping on the carpet'],
  ['\u{1F420}', 'in a small bowl, held aloft'],
  ['\u{1F92B}', 'whispering the name over and over'],
  ['\u{1F9D1}‍\u{1F692}', 'parked the truck on the red carpet'],
  ['\u{1F995}', 'ducked under the rope. tore the rope.'],
  ['\u{1F412}', 'stole three phones on the way here'],
  ['\u{1F994}', 'bristling with anticipation'],
  ['\u{1F9D1}‍\u{1F3A8}', 'painted this tag on the way over'],
  ['\u{1F427}', 'dressed for a much smarter party'],
  ['\u{1F996}', 'the tag is very small on him']
];

/* ---------- procedural single-character cruelty ----------
   Generates tier-3 impostors for any name. Two rules keep it fair:
   never a case-only change, never a whitespace-only change. */
const LOOKALIKE = { o: '0', O: '0', l: '1', i: 'l', I: 'l', S: '5', s: '5',
                    B: '8', b: '6', g: '9', E: 'F', c: 'e', n: 'm', m: 'n',
                    u: 'v', v: 'u', r: 'f', t: 'f', a: 'o', e: 'c' };

function mutate(name) {
  const ch = Array.from(name);
  const idx = [];
  for (let i = 0; i < ch.length; i++) if (ch[i] !== ' ') idx.push(i);
  if (!idx.length) return null;
  const at = idx[(Math.random() * idx.length) | 0];
  const pick = Math.random();
  let out;

  if (pick < 0.3) {                              // drop a character
    out = ch.slice(0, at).concat(ch.slice(at + 1));
  } else if (pick < 0.6) {                       // double a character
    out = ch.slice(0, at).concat([ch[at]], ch.slice(at));
  } else if (pick < 0.8) {                       // lookalike substitution
    const sub = LOOKALIKE[ch[at]];
    if (!sub) return null;
    out = ch.slice(); out[at] = sub;
  } else {                                       // swap with its neighbour
    if (at + 1 >= ch.length || ch[at + 1] === ' ' || ch[at] === ch[at + 1]) return null;
    out = ch.slice();
    out[at] = ch[at + 1]; out[at + 1] = ch[at];
  }

  const s = out.join('');
  // no invisible differences, and no accidental no-ops
  if (s.trim() !== s || s === name || /\s\s/.test(s)) return null;
  return s;
}

/* An impostor must not collide with ANY name currently on the list, or the
   player gets punished for a correct call. Callers pass the live list. */
function makeImpostor(target, active, tier) {
  const pack = JOKES[target];
  const isActive = (s) => active.some((n) => n.toLowerCase() === s.toLowerCase());

  if (tier < 3 && pack) {
    const pool = tier === 1 ? pack.t1 : pack.t2;
    for (let i = 0; i < 30; i++) {
      const c = pool[(Math.random() * pool.length) | 0];
      if (!isActive(c)) return c;
    }
  }
  for (let i = 0; i < 40; i++) {
    const c = mutate(target);
    if (c && !isActive(c)) return c;
  }
  // last resort: a tier-2 joke, then anything at all that is not on the list
  if (pack) {
    for (const c of pack.t2.concat(pack.t1)) if (!isActive(c)) return c;
  }
  return target + '.';
}

const BARKS_IN  = ['Enjoy the party.', 'Right this way.', 'Checks out.', 'Go on then.', 'Legend.'];
const BARKS_OUT = ['Nice try.', 'Not tonight.', 'Absolutely not.', 'Bounced.', 'Take a walk.'];

/* scaled for the longer list — a full eight names pays nearly double */
const RANKS = [
  [0,      'Unpaid Intern',         'You let a sofa in.'],
  [3000,   'Coat Check',            'Adjacent to the door. Not the door.'],
  [9000,   'Junior Rope Handler',   'You have been trusted with one rope.'],
  [20000,  'Door Supervisor',       'The clipboard is yours.'],
  [40000,  'Head of Vibes',         'Impostors fear your squint.'],
  [70000,  'Velvet Legend',         'They spell it right just for you.'],
  [110000, 'The Bennett Authority', 'Sofia Bennett asks YOU for ID.']
];

window.SB_CONTENT = {
  FIRST_NAME, FAMILY_POOL, WILD_POOL, GUESTS, JOKES,
  makeImpostor, mutate, BARKS_IN, BARKS_OUT, RANKS
};
