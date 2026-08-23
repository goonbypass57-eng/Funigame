/* ============================================================
   SOFIA BENNETT ONLY
   You are the door. The list has one name on it. Good luck.
   ============================================================ */
(function () {
  'use strict';

  const C = window.SB_CONTENT;
  const SFX = window.SB_SFX;
  const TRUE_NAME = C.TRUE_NAME;

  /* ---------- tiny helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const rand = (a) => a[(Math.random() * a.length) | 0];
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const buzz = (ms) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

  const REDUCED = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- persistence ---------- */
  const KEY = 'sofia-bennett-only.v1';
  function loadSave() {
    try {
      return Object.assign(
        { best: 0, bestStreak: 0, admitted: 0, bounced: 0, shifts: 0, muted: false, seenHow: false },
        JSON.parse(localStorage.getItem(KEY) || '{}')
      );
    } catch (e) {
      return { best: 0, bestStreak: 0, admitted: 0, bounced: 0, shifts: 0, muted: false, seenHow: false };
    }
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} }
  const save = loadSave();

  /* ---------- game state ---------- */
  const S = {
    running: false,
    frozen: false,
    locked: false,
    score: 0,
    combo: 0,
    bestCombo: 0,
    strikes: 0,
    seen: 0,
    admitted: 0,
    bounced: 0,
    realTurnedAway: 0,
    impostorsLetIn: 0,
    wave: 1,
    guest: null,
    lastName: '',
    roundMs: 5000,
    endsAt: 0,
    raf: 0
  };
  const MAX_STRIKES = 3;

  /* ---------- difficulty ---------- */
  function waveFor(seen) { return Math.floor(seen / 8) + 1; }
  function roundMsFor(wave) { return Math.max(1550, 5000 - (wave - 1) * 330); }

  const recentNames = [];
  const recentFaces = [];
  function fresh(pool, memory, depth) {
    let choices = pool;
    if (memory.length) {
      const avail = pool.filter((x) => memory.indexOf(x) === -1);
      if (avail.length) choices = avail;
    }
    const pick = rand(choices);
    memory.push(pick);
    while (memory.length > depth) memory.shift();
    return pick;
  }

  function pickImpostor(wave) {
    // Early waves are gentle. Later ones are personal.
    const r = Math.random();
    let pool;
    if (wave <= 2)      pool = r < 0.80 ? C.TIER1 : C.TIER2;
    else if (wave <= 4) pool = r < 0.35 ? C.TIER1 : (r < 0.85 ? C.TIER2 : C.TIER3);
    else if (wave <= 6) pool = r < 0.15 ? C.TIER1 : (r < 0.60 ? C.TIER2 : C.TIER3);
    else                pool = r < 0.08 ? C.TIER1 : (r < 0.38 ? C.TIER2 : C.TIER3);
    return fresh(pool, recentNames, 14);
  }

  function nextGuest() {
    const wave = S.wave;
    let name, valid;
    // Keep it near a coin flip so guessing never pays.
    for (let i = 0; i < 12; i++) {
      valid = Math.random() < 0.47;
      name = valid ? TRUE_NAME : pickImpostor(wave);
      if (name !== S.lastName || valid) break;
    }
    S.lastName = name;
    const [face, flavour] = fresh(C.GUESTS, recentFaces, 9);
    // A gold tag is still just a tag. Same rule. Free upside.
    const golden = valid && wave >= 2 && Math.random() < 0.09;
    return { name, valid, face, flavour, golden };
  }

  /* ---------- character-level diff, for the teaching moment ---------- */
  function diffMarkup(wrong, right) {
    const a = Array.from(wrong), b = Array.from(right);
    let p = 0;
    while (p < a.length && p < b.length && a[p] === b[p]) p++;
    let s = 0;
    while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
    let from = p, to = a.length - s;
    if (from >= to) { // pure deletion — mark the seam so the eye lands there
      from = clamp(p - 1, 0, a.length - 1);
      to = clamp(p + 1, from + 1, a.length);
    }
    return esc(a.slice(0, from).join('')) +
           '<mark>' + esc(a.slice(from, to).join('') || ' ') + '</mark>' +
           esc(a.slice(to).join(''));
  }

  /* ---------- DOM ---------- */
  const el = {
    screens:   document.querySelectorAll('.screen'),
    title:     $('screen-title'),
    how:       $('screen-how'),
    game:      $('screen-game'),
    over:      $('screen-over'),
    stage:     $('stage'),
    card:      $('card'),
    face:      $('face'),
    tag:       $('tagname'),
    flavour:   $('flavour'),
    stampIn:   $('stamp-in'),
    stampOut:  $('stamp-out'),
    score:     $('score'),
    combo:     $('combo'),
    wave:      $('wave'),
    strikes:   $('strikes'),
    fuse:      $('fuse'),
    pops:      $('pops'),
    banner:    $('banner'),
    verdict:   $('verdict'),
    vTitle:    $('v-title'),
    vTag:      $('v-tag'),
    vNote:     $('v-note'),
    btnIn:     $('btn-in'),
    btnOut:    $('btn-out'),
    bestTitle: $('best-title'),
    mute:      $('mute'),
    oScore:    $('o-score'),
    oRank:     $('o-rank'),
    oQuip:     $('o-quip'),
    oStats:    $('o-stats'),
    oNew:      $('o-new')
  };

  function show(screen) {
    el.screens.forEach((s) => s.classList.toggle('on', s === screen));
  }

  /* ---------- HUD ---------- */
  function renderHud() {
    el.score.textContent = S.score.toLocaleString();
    el.wave.textContent = 'WAVE ' + S.wave;
    let dots = '';
    for (let i = 0; i < MAX_STRIKES; i++) {
      dots += '<i class="' + (i < MAX_STRIKES - S.strikes ? 'life' : 'life dead') + '"></i>';
    }
    el.strikes.innerHTML = dots;
    if (S.combo >= 3) {
      el.combo.textContent = '×' + S.combo + ' STREAK';
      el.combo.classList.add('on');
    } else {
      el.combo.classList.remove('on');
    }
  }

  function pop(text, kind) {
    const n = document.createElement('div');
    n.className = 'pop ' + (kind || '');
    n.textContent = text;
    el.pops.appendChild(n);
    setTimeout(() => n.remove(), 900);
  }

  function banner(text, sub) {
    el.banner.innerHTML = '<b>' + esc(text) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : '');
    el.banner.classList.remove('on');
    void el.banner.offsetWidth;
    el.banner.classList.add('on');
  }

  /* ---------- round flow ---------- */
  function deal() {
    S.guest = nextGuest();
    S.locked = false;
    S.frozen = false;

    el.face.textContent = S.guest.face;
    el.tag.textContent = S.guest.name;
    el.tag.classList.toggle('long', Array.from(S.guest.name).length > 17);
    el.flavour.textContent = S.guest.flavour;
    el.card.classList.toggle('golden', !!S.guest.golden);

    el.card.className = 'card' + (S.guest.golden ? ' golden' : '') + ' dealing';
    el.card.style.transform = '';
    el.card.style.opacity = '';
    el.stampIn.style.opacity = 0;
    el.stampOut.style.opacity = 0;

    S.roundMs = roundMsFor(S.wave);
    S.endsAt = performance.now() + S.roundMs;
    if (!S.raf) S.raf = requestAnimationFrame(tick);
  }

  let lastTickWarn = 0;
  function tick(now) {
    S.raf = 0;
    if (!S.running) return;
    if (!S.frozen) {
      const left = S.endsAt - now;
      const frac = clamp(left / S.roundMs, 0, 1);
      el.fuse.style.transform = 'scaleX(' + frac + ')';
      el.fuse.classList.toggle('hot', frac < 0.3);
      if (frac < 0.3 && now - lastTickWarn > 260) { lastTickWarn = now; SFX.tick(); }
      if (left <= 0 && !S.locked) { timeUp(); return; }
    }
    S.raf = requestAnimationFrame(tick);
  }

  function timeUp() {
    S.locked = true;
    resolve(null);
  }

  /* ---------- the judgement ---------- */
  function decide(letIn) {
    if (!S.running || S.locked || S.frozen) return;
    S.locked = true;
    resolve(letIn);
  }

  function resolve(letIn) {
    const g = S.guest;
    const timedOut = letIn === null;
    const right = !timedOut && (letIn === g.valid);
    const timeFrac = clamp((S.endsAt - performance.now()) / S.roundMs, 0, 1);

    S.seen++;
    if (!timedOut) {
      if (letIn) S.admitted++; else S.bounced++;
      if (letIn && !g.valid) S.impostorsLetIn++;
      if (!letIn && g.valid) S.realTurnedAway++;
    }

    if (right) {
      S.combo++;
      S.bestCombo = Math.max(S.bestCombo, S.combo);
      let pts = Math.round((100 + 20 * Math.min(S.combo, 15)) * (1 + timeFrac));
      if (g.golden) pts *= 3;
      S.score += pts;
      pop('+' + pts.toLocaleString(), g.golden ? 'gold' : 'good');
      if (g.golden) {
        SFX.golden();
        if (S.strikes > 0) { S.strikes--; pop('STRIKE FORGIVEN', 'gold'); }
      } else {
        SFX.good(S.combo);
      }
      buzz(12);
      if (S.combo > 0 && S.combo % 10 === 0) banner('×' + S.combo + ' STREAK', rand(['the rope respects you', 'nobody is getting past you', 'flawless door work']));
      flyOff(letIn, true);
      afterCorrect();
    } else {
      S.combo = 0;
      S.strikes++;
      SFX.bad();
      buzz([40, 30, 60]);
      flyOff(timedOut ? null : letIn, false);
      showVerdict(g, letIn, timedOut);
    }
    renderHud();
  }

  function afterCorrect() {
    const nw = waveFor(S.seen);
    const wait = REDUCED ? 120 : 260;
    if (nw > S.wave) {
      S.wave = nw;
      SFX.wave();
      banner('WAVE ' + S.wave, rand([
        'they are arriving faster',
        'the spelling gets worse from here',
        'management is watching',
        'more tags. less time.',
        'squint harder'
      ]));
      setTimeout(deal, wait + 380);
    } else {
      setTimeout(deal, wait);
    }
  }

  function flyOff(letIn, right) {
    const dir = letIn === null ? 0 : (letIn ? 1 : -1);
    el.card.classList.remove('dealing');
    if (dir > 0) el.stampIn.style.opacity = 1;
    if (dir < 0) el.stampOut.style.opacity = 1;
    if (dir === 0) {
      el.card.classList.add('shake');
    } else {
      el.card.style.transition = 'transform .28s cubic-bezier(.4,0,.9,.4), opacity .28s linear';
      el.card.style.transform = 'translateX(' + dir * 130 + '%) rotate(' + dir * 22 + 'deg)';
      el.card.style.opacity = '0';
    }
    el.stage.classList.add(right ? 'flash-good' : 'flash-bad');
    setTimeout(() => el.stage.classList.remove('flash-good', 'flash-bad'), 220);
  }

  function showVerdict(g, letIn, timedOut) {
    S.frozen = true;
    const dead = S.strikes >= MAX_STRIKES;

    if (timedOut) {
      el.vTitle.textContent = 'TOO SLOW';
      el.vNote.textContent = 'They wandered off. The queue is judging you.';
      el.vTag.innerHTML = esc(g.name);
    } else if (g.valid) {
      el.vTitle.textContent = 'THAT WAS HER';
      el.vNote.textContent = 'Spelled perfectly. You bounced her anyway. ' + rand(BAD_NOTES_REAL);
      el.vTag.innerHTML = esc(g.name);
    } else {
      el.vTitle.textContent = 'IMPOSTOR';
      el.vNote.textContent = rand(BAD_NOTES_FAKE);
      el.vTag.innerHTML = diffMarkup(g.name, TRUE_NAME);
    }
    el.verdict.classList.add('on');

    const go = () => {
      el.verdict.classList.remove('on');
      el.verdict.removeEventListener('pointerdown', go);
      clearTimeout(vTimer);
      if (dead) gameOver(); else { S.frozen = false; deal(); }
    };
    const vTimer = setTimeout(go, dead ? 1500 : 1700);
    setTimeout(() => el.verdict.addEventListener('pointerdown', go, { once: true }), 320);
  }

  const BAD_NOTES_REAL = [
    'She is telling everyone.',
    'She had the receipts.',
    'That one is going in a review.',
    'You had ONE name to learn.'
  ];
  const BAD_NOTES_FAKE = [
    'That is not how she spells it. Look.',
    'Off by that much. Straight past you.',
    'They are already at the bar. Well done.',
    'The list said one thing. One.'
  ];

  /* ---------- game over ---------- */
  function rankFor(score) {
    let r = C.RANKS[0];
    for (const row of C.RANKS) if (score >= row[0]) r = row;
    return r;
  }

  function gameOver() {
    S.running = false;
    S.frozen = true;
    cancelAnimationFrame(S.raf); S.raf = 0;
    SFX.over();
    buzz([70, 50, 70, 50, 140]);

    const isNew = S.score > save.best;
    save.best = Math.max(save.best, S.score);
    save.bestStreak = Math.max(save.bestStreak, S.bestCombo);
    save.admitted += S.admitted;
    save.bounced += S.bounced;
    save.shifts += 1;
    persist();

    const r = rankFor(S.score);
    el.oScore.textContent = S.score.toLocaleString();
    el.oRank.textContent = r[1];
    el.oQuip.textContent = r[2];
    el.oNew.classList.toggle('on', isNew);

    const rows = [
      ['Guests judged', S.seen],
      ['Let in', S.admitted],
      ['Bounced', S.bounced],
      ['Best streak', '×' + S.bestCombo],
      ['Impostors who got past you', S.impostorsLetIn],
      ['Real Sofia Bennetts turned away', S.realTurnedAway],
      ['Personal best', save.best.toLocaleString()]
    ];
    el.oStats.innerHTML = rows.map((row) =>
      '<div class="row"><span>' + esc(row[0]) + '</span><b>' + esc(row[1]) + '</b></div>'
    ).join('');

    show(el.over);
  }

  /* ---------- start ---------- */
  function startGame() {
    SFX.unlock();
    Object.assign(S, {
      running: true, frozen: false, locked: false,
      score: 0, combo: 0, bestCombo: 0, strikes: 0, seen: 0,
      admitted: 0, bounced: 0, realTurnedAway: 0, impostorsLetIn: 0,
      wave: 1, lastName: ''
    });
    recentNames.length = 0;
    recentFaces.length = 0;
    renderHud();
    el.verdict.classList.remove('on');
    show(el.game);
    banner('SHIFT START', 'one name. one spelling.');
    setTimeout(deal, REDUCED ? 200 : 620);
  }

  /* ---------- input: buttons ---------- */
  el.btnIn.addEventListener('click', () => decide(true));
  el.btnOut.addEventListener('click', () => decide(false));

  document.addEventListener('keydown', (e) => {
    if (el.game.classList.contains('on')) {
      if (e.key === 'ArrowRight') { e.preventDefault(); decide(true); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); decide(false); }
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (el.title.classList.contains('on')) { e.preventDefault(); startGame(); }
      else if (el.over.classList.contains('on')) { e.preventDefault(); startGame(); }
    }
  });

  /* ---------- input: swipe the guest ---------- */
  let drag = null;
  el.card.addEventListener('pointerdown', (e) => {
    if (!S.running || S.locked || S.frozen) return;
    drag = { id: e.pointerId, x: e.clientX, dx: 0 };
    el.card.setPointerCapture(e.pointerId);
    el.card.classList.remove('dealing');
    el.card.style.transition = 'none';
  });
  el.card.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x;
    const t = clamp(drag.dx / 110, -1, 1);
    el.card.style.transform = 'translateX(' + drag.dx + 'px) rotate(' + t * 11 + 'deg)';
    el.stampIn.style.opacity = clamp(t, 0, 1);
    el.stampOut.style.opacity = clamp(-t, 0, 1);
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const dx = drag.dx;
    drag = null;
    el.card.style.transition = '';
    if (Math.abs(dx) > 80) {
      decide(dx > 0);
    } else {
      el.card.style.transform = '';
      el.stampIn.style.opacity = 0;
      el.stampOut.style.opacity = 0;
    }
  }
  el.card.addEventListener('pointerup', endDrag);
  el.card.addEventListener('pointercancel', endDrag);

  /* ---------- menus ---------- */
  $('btn-play').addEventListener('click', () => {
    SFX.unlock(); SFX.ui();
    if (!save.seenHow) { save.seenHow = true; persist(); show(el.how); }
    else startGame();
  });
  $('btn-how').addEventListener('click', () => { SFX.ui(); show(el.how); });
  $('btn-how-go').addEventListener('click', () => { SFX.ui(); startGame(); });
  $('btn-how-back').addEventListener('click', () => { SFX.ui(); show(el.title); });
  $('btn-again').addEventListener('click', () => { SFX.ui(); startGame(); });
  $('btn-menu').addEventListener('click', () => { SFX.ui(); refreshTitle(); show(el.title); });
  $('btn-quit').addEventListener('click', () => {
    if (!S.running) return;
    S.running = false;
    cancelAnimationFrame(S.raf); S.raf = 0;
    refreshTitle();
    show(el.title);
  });

  el.mute.addEventListener('click', () => {
    save.muted = !save.muted;
    SFX.setMuted(save.muted);
    persist();
    renderMute();
    if (!save.muted) SFX.ui();
  });
  function renderMute() {
    el.mute.textContent = save.muted ? '\u{1F507}' : '\u{1F50A}';
    el.mute.setAttribute('aria-label', save.muted ? 'Unmute' : 'Mute');
    el.mute.setAttribute('aria-pressed', String(save.muted));
  }

  function refreshTitle() {
    el.bestTitle.innerHTML = save.best > 0
      ? 'BEST <b>' + save.best.toLocaleString() + '</b> · STREAK <b>×' + save.bestStreak + '</b>'
      : 'no shifts worked yet';
  }

  /* ---------- pause when backgrounded ---------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && S.running && !S.frozen) {
      S.frozen = true;
      S.pausedLeft = S.endsAt - performance.now();
      banner('PAUSED', 'the queue is not amused');
    } else if (!document.hidden && S.running && S.frozen && S.pausedLeft != null) {
      S.endsAt = performance.now() + S.pausedLeft;
      S.pausedLeft = null;
      S.frozen = false;
      if (!S.raf) S.raf = requestAnimationFrame(tick);
    }
  });

  /* ---------- boot ---------- */
  SFX.setMuted(save.muted);
  renderMute();
  refreshTitle();
  $('true-name').textContent = TRUE_NAME;
  document.querySelectorAll('.js-truename').forEach((n) => { n.textContent = TRUE_NAME; });
  show(el.title);

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
