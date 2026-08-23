/* ============================================================
   SOFIA BENNETT ONLY  —  content pack
   The one true name. Everything else is a filthy impostor.
   ============================================================ */

const TRUE_NAME = 'Sofia Bennett';

/* Guests are just flavour. The RULE only ever cares about the tag.
   A raccoon with a perfect tag gets in. That is the whole joke. */
const GUESTS = [
  ['\u{1F9D1}‍\u{1F3A4}', 'insists she is "the original"'],
  ['\u{1F57A}',                'has been practising this walk all week'],
  ['\u{1F99D}',                'found this tag in a dumpster. so what.'],
  ['\u{1FAB4}',                'photosynthesising aggressively'],
  ['\u{1F415}',                'very good. extremely good.'],
  ['\u{1F469}‍⚖️', 'will litigate if bounced'],
  ['\u{1F9DB}',                'legally requires an invitation'],
  ['\u{1F35E}',                'is bread. is wearing a tag.'],
  ['\u{1F47D}',                'learned English 20 minutes ago'],
  ['\u{1F916}',                'BEEP. PARTY. BEEP.'],
  ['\u{1F9D9}',                'conjured this tag out of fog'],
  ['\u{1F419}',                'wearing eight tags, showing one'],
  ['\u{1F475}',                'is 94 and ready to rave'],
  ['\u{1F6B4}',                'has not stopped pedalling'],
  ['\u{1F988}',                'somehow'],
  ['\u{1F9D1}‍\u{1F680}', 'just got back, wants a drink'],
  ['\u{1F46F}',                'there are two of her, one tag'],
  ['\u{1F414}',                'clucking the bassline already'],
  ['\u{1F9D1}‍\u{1F373}', 'brought a small quiche, uninvited'],
  ['\u{1F385}',                'off-season, extremely bored'],
  ['\u{1F408}',                'knocked the guest list off the table'],
  ['\u{1F986}',                'loud. so loud.'],
  ['\u{1F9DF}',                'shambling, but polite about it'],
  ['\u{1F41D}',                'brought 40,000 friends (waiting outside)'],
  ['\u{1F9D1}‍\u{1F4BC}', 'says she "knows the owner"'],
  ['\u{1F984}',                'refuses to explain the horn'],
  ['\u{1F3A9}',                'it is just the hat. there is no one here.'],
  ['\u{1F9A5}',                'took four hours to reach the rope'],
  ['\u{1F42E}',                'has a plus one, also a cow'],
  ['\u{1F47B}',                'technically already inside'],
  ['\u{1F9DC}',                'dripping on the carpet'],
  ['\u{1F420}',                'in a small bowl, held aloft'],
  ['\u{1F92B}',                'whispering the name over and over'],
  ['\u{1F9D1}‍\u{1F692}', 'parked the truck on the red carpet'],
  ['\u{1F995}',                'ducked under the rope. tore the rope.'],
  ['\u{1F412}',                'stole three phones on the way here']
];

/* -------- IMPOSTORS, by how mean they are -------- */

/* Tier 1: you can spot these from orbit */
const TIER1 = [
  'Steve',
  'Kevin',
  'Gary',
  'Barry Trumbull',
  'Sophia Bennett',
  'Sofia Bennington',
  'Dave Bennett',
  'Sofia Rodriguez',
  'Chad Bennett',
  'Bennett Sofia',
  'Sofia',
  'Bennett',
  'Guest',
  'VIP',
  'Not Sofia Bennett',
  'Definitely Sofia Bennett',
  'Sofia Bennett’s Cousin',
  'Sofia Bennett’s Mom',
  'The Sofia Bennett',
  'Sofia Bennett Fan Club',
  'Sofia Bennett Tribute Act',
  'Sofia Bennett Cover Band',
  'Sofia Bennett Experience',
  'Sofia Bennett Municipal Airport',
  'Sofia Bennett Long-Stay Parking',
  'Sofia Bennett & Guest',
  'Sofia Bennett, Probably',
  'Sofia Bennett (Unverified)',
  'Sofia Bennett (Legally Distinct)',
  'Sofia Bennett (Retired)',
  'Sofia Bennett (Parody)',
  'DJ Sofia Bennett',
  'Lil Sofia Bennett',
  'Sofia Bennett Jr.',
  'Sofia Bennett Sr.',
  'Sofia Bennett III',
  'Sofia Bennett, PhD',
  'Sofia Bennett, Esq.',
  'Mrs. Sofia Bennett',
  'Sofa Bed Bennett',
  'Sofia Bennett Holdings LLC'
];

/* Tier 2: a whole word has gone wrong */
const TIER2 = [
  'Sofia Bennette',
  'Sofia Benett',
  'Sofie Bennett',
  'Sofia Bennetta',
  'Sofia Beennett',
  'Sofia Bennott',
  'Sofla Bennett',
  'Sofia Bennetts',
  'Sophia Bennet',
  'Sofya Bennett',
  'Sofia Benneth',
  'Sofiaa Bennett',
  'Sofia Bennitt',
  'Sofia Bennety',
  'SofiaBennett',
  'Sofia-Bennett',
  'Sofia Bennett-Bennett',
  'Sofia Bennett Bennett',
  'Sofa Bennett',
  'Sofia Bennettson',
  'Sofia Benjamin',
  'Sofia Bennettes',
  'Sofias Bennett',
  'Sofia Bennett x2',
  'Sofia Bennett — Plus One',
  '"Sofia Bennett"',
  'Sofia Bennett™'
];

/* Tier 3: one character. one lousy character. */
const TIER3 = [
  'Sofia Bennet',
  'Sofia Bennettt',
  'Sofia Bennnett',
  'Sofia Bemnett',
  'Sofia Benneft',
  'Sofia Bennett.',
  'Sofia Bennett,',
  'Sofia Bennett!',
  'Sofia Bennett?',
  'S0fia Bennett',
  'Sofia 8ennett',
  'Sof1a Bennett',
  'Sofia Bennetl',
  'Sofia Rennett',
  'Sofia Bennett ',
  'Sofía Bennett',
  'Sofia Bennétt',
  'Sofia Bennëtt',
  'Sofia Bennelt',
  'Sotia Bennett',
  'Sofia Bennctt',
  'Sofia Bermett'
];

/* Bouncer barks */
const BARKS_IN  = ['Enjoy the party.', 'Right this way.', 'She checks out.', 'Go on then.', 'Legend.', 'Clean tag. Clean soul.', 'In you go.'];
const BARKS_OUT = ['Nice try.', 'Not tonight.', 'Absolutely not.', 'Read your own tag.', 'Bounced.', 'Take a walk.', 'Denied, friend.'];

/* End-of-shift ratings, worst to best */
const RANKS = [
  [0,    'Unpaid Intern',        'You let a sofa in.'],
  [1500, 'Coat Check',           'Adjacent to the door. Not the door.'],
  [4000, 'Junior Rope Handler',  'You have been trusted with one rope.'],
  [8000, 'Door Supervisor',      'The clipboard is yours.'],
  [14000,'Head of Vibes',        'Impostors fear your squint.'],
  [22000,'Velvet Legend',        'They spell it right just for you.'],
  [35000,'The Bennett Authority','Sofia Bennett asks YOU for ID.']
];

window.SB_CONTENT = { TRUE_NAME, GUESTS, TIER1, TIER2, TIER3, BARKS_IN, BARKS_OUT, RANKS };
