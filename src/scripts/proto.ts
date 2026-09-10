// proto.ts - B1 "The Shelf" moving mockup runtime.
// Base HTML is the complete vertical showroom; this script adds the pan, the
// springs, the plaque engrave, the flip, the cursor light, the composed opening,
// and the view-transition focus move. One shared reduced-motion branch gates all
// theater. Lenis rides the single gsap ticker (the Single Ticker Lock).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // bundled free in gsap >= 3.13
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const params = () => new URLSearchParams(location.search);
const forceReduce = () => params().has('reduce');
const motionOK = matchMedia('(prefers-reduced-motion: no-preference)').matches && !forceReduce();
const fine = () => matchMedia('(min-width: 861px) and (hover: hover) and (pointer: fine)').matches;

// Evidence surface (read by Playwright; never shown in UI).
const wproto: any = ((window as any).__proto = (window as any).__proto || {});
wproto.motionOK = motionOK;

// Live dial config (restored from localStorage; read back for the B2 handoff).
const DIAL_DEFAULTS = { panLen: 2.4, spring: 1.7, stagger: 90, light: 0.5 };
const dials = { ...DIAL_DEFAULTS };
try {
  const saved = JSON.parse(localStorage.getItem('proto-dials') || 'null');
  if (saved && typeof saved === 'object') Object.assign(dials, saved);
} catch (_) {}
(window as any).__protoDials = dials;
const persistDials = () => { try { localStorage.setItem('proto-dials', JSON.stringify(dials)); } catch (_) {} };
document.documentElement.style.setProperty('--light-intensity', String(dials.light));

// ---------------------------------------------------------------------------
// One-time: the Single Ticker Lock (gsap drives Lenis; lenis reports to ST).
// ---------------------------------------------------------------------------
let lenis: Lenis | null = null;
if (motionOK) {
  lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
  document.documentElement.classList.add('lenis');
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  wproto.lenis = lenis; // debug handle for Playwright pan sampling (invisible; no HUD)
}
wproto.ScrollTrigger = ScrollTrigger;

// Cursor-proximity light, consolidated into the one ticker (no second rAF).
const light = { el: null as HTMLElement | null, tx: 50, ty: 0, cx: 50, cy: 0 };
if (motionOK) {
  gsap.ticker.add(() => {
    if (!light.el) return;
    light.cx += (light.tx - light.cx) * 0.15;
    light.cy += (light.ty - light.cy) * 0.15;
    light.el.style.setProperty('--lx', light.cx.toFixed(2) + '%');
    light.el.style.setProperty('--ly', light.cy.toFixed(2) + '%');
  });
}

// ---------------------------------------------------------------------------
// Composed opening (runs wherever #proto-curtain exists = the shelf page).
// Masks real font + flagship-poster decode; never a spinner; sessionStorage skip.
// ---------------------------------------------------------------------------
function revealHero(staggered: boolean) {
  const els = gsap.utils.toArray<HTMLElement>('[data-hero-in]');
  if (!els.length) return;
  if (!staggered) { gsap.set(els, { opacity: 1, y: 0 }); return; }
  gsap.fromTo(els, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.11 });
}

function composedOpening() {
  const curtain = document.getElementById('proto-curtain') as HTMLElement | null;
  if (!curtain) return;
  const rule = document.getElementById('curtain-rule');
  const setRule = (p: number) => rule && rule.style.setProperty('--p', Math.min(100, p * 100).toFixed(1) + '%');
  const t0 = performance.now();
  const seen = sessionStorage.getItem('proto-open') && !params().has('fresh');

  if (!motionOK || seen) {
    curtain.hidden = true;
    revealHero(false);
    wproto.openPath = !motionOK ? 'reduced-instant' : 'session-skip';
    wproto.openMs = Math.round(performance.now() - t0);
    return;
  }
  sessionStorage.setItem('proto-open', '1');

  const flag = document.querySelector<HTMLImageElement>('.object--flagship img');
  const work = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    flag && flag.decode ? flag.decode().catch(() => {}) : Promise.resolve(),
  ]);
  const capped = Promise.race([work, new Promise((r) => setTimeout(r, 2400))]);

  const st = { p: 0.05 };
  setRule(st.p);
  const creep = gsap.to(st, { p: 0.9, duration: 2.4, ease: 'power1.out', onUpdate: () => setRule(st.p) });

  capped.then(() => {
    creep.kill();
    gsap.to(st, {
      p: 1, duration: 0.2, onUpdate: () => setRule(st.p),
      onComplete: () => {
        const lift = gsap.to(curtain, { yPercent: -100, duration: 0.55, ease: 'expo.out' });
        // hero enters before the curtain fully clears (kills the dead frame)
        gsap.delayedCall(0.12, () => revealHero(true));
        lift.then(() => {
          curtain.hidden = true;
          wproto.openPath = 'full-sequence';
          wproto.openMs = Math.round(performance.now() - t0);
          ScrollTrigger.refresh(); // font swap changed layout widths
        });
      },
    });
  });
}

// ---------------------------------------------------------------------------
// Plaque engrave: split each title into chars and fade them in on shelf enter.
// ---------------------------------------------------------------------------
function splitCharsFallback(el: HTMLElement): HTMLElement[] {
  const text = el.textContent || '';
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const spans: HTMLElement[] = [];
  for (const ch of text) {
    const s = document.createElement('span');
    s.textContent = ch;
    s.style.display = 'inline-block';
    s.style.whiteSpace = 'pre';
    s.setAttribute('aria-hidden', 'true');
    el.appendChild(s);
    spans.push(s);
  }
  return spans;
}
function engrave(title: HTMLElement) {
  let chars: HTMLElement[];
  if (SplitText && typeof (SplitText as any).create === 'function') {
    const split = (SplitText as any).create(title, { type: 'chars', charsClass: 'engrave-char' });
    chars = split.chars;
  } else {
    chars = splitCharsFallback(title);
  }
  gsap.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'none', stagger: 0.012 });
}

// ---------------------------------------------------------------------------
// Per-page build (fires on first load AND after every ClientRouter swap).
// ---------------------------------------------------------------------------
let pageMM: ReturnType<typeof gsap.matchMedia> | null = null;
let panST: ScrollTrigger | null = null;

function initShelf() {
  const track = document.getElementById('shelf-track');
  const pin = document.getElementById('shelf-pin');
  const shelf = document.getElementById('shelf');
  if (!track || !pin || !shelf) return;
  const objectsEls = gsap.utils.toArray<HTMLElement>('.object');
  const progress = document.getElementById('shelf-progress');

  // spring settle (the ONE spring) + plaque engrave, on shelf enter
  let played = false;
  const playSettle = () => {
    if (!motionOK) { gsap.set(objectsEls, { opacity: 1, y: 0 }); return; }
    gsap.fromTo(
      objectsEls,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: `back.out(${dials.spring})`, stagger: dials.stagger / 1000 }
    );
  };
  const playEngrave = () => {
    if (!motionOK) return;
    document.querySelectorAll<HTMLElement>('[data-engrave]').forEach(engrave);
  };
  wproto.replaySettle = playSettle;

  if (!motionOK) {
    gsap.set(objectsEls, { opacity: 1, y: 0 });
  } else {
    ScrollTrigger.create({
      trigger: shelf, start: 'top 75%', once: true,
      onEnter: () => { if (played) return; played = true; playSettle(); playEngrave(); wproto.settlePlayed = true; },
    });
  }

  // per-object depth: as the track pans, each object turns to face the viewer,
  // lifts toward the lamp (its colored gallery light rises), and its poster parallaxes.
  const bodies = objectsEls.map((o) => o.querySelector<HTMLElement>('.object__body'));
  const imgs = objectsEls.map((o) => o.querySelector<HTMLElement>('.object__frame img'));
  const chipColors = objectsEls.map((o) => getComputedStyle(o).getPropertyValue('--chip').trim());
  const spotlight = document.getElementById('shelf-spotlight');
  const paintDepth = () => {
    const cx = window.innerWidth / 2;
    const centers = objectsEls.map((o) => { const r = o.getBoundingClientRect(); return r.left + r.width / 2; });
    let maxFocus = 0, maxIdx = 0;
    objectsEls.forEach((o, i) => {
      const dx = Math.max(-1, Math.min(1, (centers[i] - cx) / (window.innerWidth * 0.55)));
      const focus = Math.max(0, 1 - Math.abs(dx));
      if (focus > maxFocus) { maxFocus = focus; maxIdx = i; }
      o.style.setProperty('--focus', focus.toFixed(3));
      const b = bodies[i];
      if (b) b.style.transform = `translateY(${(-focus * 16).toFixed(1)}px) scale(${(1 + focus * 0.05).toFixed(3)}) rotateY(${(-dx * 13).toFixed(2)}deg) translateZ(${(-Math.abs(dx) * 110).toFixed(0)}px)`;
      const im = imgs[i];
      if (im) im.style.transform = `translateX(${(-dx * 22).toFixed(1)}px) scale(1.06)`;
    });
    if (spotlight) {
      spotlight.style.setProperty('--spot-color', chipColors[maxIdx] || '');
      spotlight.style.setProperty('--spot-strength', maxFocus.toFixed(3));
    }
  };
  const clearDepth = () => {
    objectsEls.forEach((o, i) => {
      o.style.removeProperty('--focus');
      if (bodies[i]) bodies[i]!.style.transform = '';
      if (imgs[i]) imgs[i]!.style.transform = '';
    });
    if (spotlight) { spotlight.style.removeProperty('--spot-color'); spotlight.style.removeProperty('--spot-strength'); }
  };
  wproto.paintDepth = paintDepth;

  // horizontal pan: ONLY >=861px + motion. One ScrollTrigger, pin the wrapper,
  // translate the track; the root never scrolls sideways (pin has overflow:hidden).
  // motionOK also folds in ?reduce=1 (which the media query alone cannot see).
  pageMM = gsap.matchMedia();
  if (motionOK) pageMM.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
    const maxX = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -maxX(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + dials.panLen * window.innerWidth,
        pin: true,
        scrub: true, // contract 7: scroll IS the timeline; Lenis provides the smoothing (no double-smooth)
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progress) progress.style.width = (self.progress * 100).toFixed(2) + '%';
          paintDepth();
        },
      },
    });
    panST = tween.scrollTrigger as ScrollTrigger;
    wproto.panST = panST; // debug handle for pan sampling
    ScrollTrigger.addEventListener('refresh', paintDepth);
    paintDepth(); // initial paint (objects should not read flat before the first scroll)
    return () => {
      ScrollTrigger.removeEventListener('refresh', paintDepth);
      clearDepth();
      panST = null; wproto.panST = null;
    };
  });

  // keyboard parity: focusing an object scrolls the track to reveal it.
  const scrollObjectIntoView = (obj: HTMLElement) => {
    if (!panST || !motionOK) { obj.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' }); return; }
    const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
    if (maxX === 0) return;
    const objCenter = obj.offsetLeft + obj.offsetWidth / 2;
    let T = window.innerWidth / 2 - objCenter;      // desired track translate
    T = Math.max(-maxX, Math.min(0, T));
    const p = -T / maxX;                             // 0..1 progress
    const y = panST.start + p * (panST.end - panST.start);
    (lenis ? lenis.scrollTo(y, { immediate: false }) : window.scrollTo(0, y));
  };
  objectsEls.forEach((obj) => {
    obj.addEventListener('focusin', () => scrollObjectIntoView(obj));
  });
  track.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const i = objectsEls.indexOf(document.activeElement?.closest('.object') as HTMLElement);
    if (i < 0) return;
    const next = objectsEls[i + (e.key === 'ArrowRight' ? 1 : -1)];
    if (next) {
      e.preventDefault();
      (next.querySelector('a,button,[tabindex]') as HTMLElement | null)?.focus() ?? next.focus();
    }
  });

  // cursor-proximity light per frame (pointer:fine + >=861 + motion)
  if (motionOK && fine()) {
    document.querySelectorAll<HTMLElement>('.object').forEach((obj) => {
      const frame = obj.querySelector<HTMLElement>('.object__frame');
      if (!frame) return;
      obj.addEventListener('pointerenter', () => { obj.classList.add('is-lit'); light.el = frame; });
      obj.addEventListener('pointerleave', () => { obj.classList.remove('is-lit'); if (light.el === frame) light.el = null; });
      obj.addEventListener('pointermove', (e) => {
        const r = frame.getBoundingClientRect();
        light.tx = ((e.clientX - r.left) / r.width) * 100;
        light.ty = ((e.clientY - r.top) / r.height) * 100;
      });
    });
  }

  wireFlips();
  wireSound();
  wireDials(playSettle);
  wireAnchors();
}

// ---------------------------------------------------------------------------
// Plaque flip: both faces in DOM; aria-pressed on the button; hidden face inert.
// ---------------------------------------------------------------------------
function wireFlips() {
  document.querySelectorAll<HTMLElement>('[data-flip]').forEach((flip) => {
    const btn = flip.querySelector<HTMLButtonElement>('.flip__toggle');
    const front = flip.querySelector<HTMLElement>('.flip__face--front');
    const back = flip.querySelector<HTMLElement>('.flip__face--back');
    if (!btn || !front || !back) return;
    (back as any).inert = true; // starts on the front face
    btn.addEventListener('click', () => {
      const flipped = flip.classList.toggle('is-flipped');
      btn.setAttribute('aria-pressed', String(flipped));
      (front as any).inert = flipped;
      (back as any).inert = !flipped;
    });
  });
}

// ---------------------------------------------------------------------------
// Sound toggle stub (off by default; dies under reduced motion). No audio wired.
// ---------------------------------------------------------------------------
function wireSound() {
  const btn = document.getElementById('sound-toggle');
  const label = document.getElementById('sound-label');
  if (!btn || !label) return;
  if (!motionOK) { btn.hidden = true; return; } // dies under reduced motion
  btn.addEventListener('click', () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    label.textContent = on ? 'Sound on' : 'Sound off'; // stub: no room-tone wired in B1
  });
}

// ---------------------------------------------------------------------------
// Dial panel: live tuning; values persist and are read back for the handoff.
// ---------------------------------------------------------------------------
function wireDials(replaySettle: () => void) {
  const toggle = document.getElementById('dials-toggle');
  const panel = document.getElementById('dials-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = panel.hasAttribute('hidden');
      if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  const bind = (id: string, key: 'panLen' | 'spring' | 'stagger' | 'light', fmt: (v: number) => string, after: () => void) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    const out = document.getElementById('v-' + id.slice(2));
    if (!input) return;
    input.value = String(dials[key]);
    if (out) out.textContent = fmt(dials[key]);
    input.addEventListener('input', () => {
      dials[key] = parseFloat(input.value);
      if (out) out.textContent = fmt(dials[key]);
      (window as any).__protoDials = dials;
      persistDials();
      after();
    });
  };
  bind('d-pan', 'panLen', (v) => v.toFixed(1) + 'x', () => ScrollTrigger.refresh());
  bind('d-spring', 'spring', (v) => v.toFixed(2), () => replaySettle());
  bind('d-stagger', 'stagger', (v) => Math.round(v) + 'ms', () => replaySettle());
  bind('d-light', 'light', (v) => v.toFixed(2), () => document.documentElement.style.setProperty('--light-intensity', String(dials.light)));

  const reset = document.getElementById('dials-reset');
  reset?.addEventListener('click', () => {
    Object.assign(dials, DIAL_DEFAULTS);
    persistDials();
    document.documentElement.style.setProperty('--light-intensity', String(dials.light));
    (['pan', 'spring', 'stagger', 'light'] as const).forEach((k) => {
      const map = { pan: 'panLen', spring: 'spring', stagger: 'stagger', light: 'light' } as const;
      const input = document.getElementById('d-' + k) as HTMLInputElement | null;
      const out = document.getElementById('v-' + k);
      if (input) input.value = String(dials[map[k]]);
      if (out) out.textContent = k === 'pan' ? dials.panLen.toFixed(1) + 'x' : k === 'stagger' ? Math.round(dials.stagger) + 'ms' : dials[map[k]].toFixed(2);
    });
    ScrollTrigger.refresh();
    replaySettle();
  });
}

// in-page anchors via Lenis (skip link, "Walk the shelves")
function wireAnchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute('href') || '';
    if (id.length < 2) return;
    const target = document.querySelector(id) as HTMLElement | null;
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -8 });
    else target.scrollIntoView({ behavior: motionOK ? 'smooth' : 'auto' });
  });
}

// case-study target: move focus to the h1 after the view transition
function initCase() {
  const h1 = document.getElementById('case-h1');
  if (!h1) return;
  window.scrollTo(0, 0);
  lenis?.scrollTo(0, { immediate: true });
  h1.focus();
}

// ---------------------------------------------------------------------------
// Lifecycle: (re)build per page; clean up stale triggers on ClientRouter swaps.
// ---------------------------------------------------------------------------
function initPage() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  pageMM?.revert();
  pageMM = null;
  panST = null;
  light.el = null;

  composedOpening();
  initShelf();
  initCase();

  lenis?.resize();
  ScrollTrigger.refresh();
}

document.addEventListener('astro:page-load', initPage);
document.addEventListener('astro:after-swap', () => { window.scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true }); });
