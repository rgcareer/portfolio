// Site-wide motion for v3 "IMMERSION". Works with Astro View Transitions:
// one-time chrome (Lenis, custom cursor, preloader, wipe lifecycle) is set up on
// module load; per-page systems (reveals, kinetic titles, counters, HUD, parallax,
// the lazy WebGL hero) are (re)built on every astro:page-load. No-JS / reduced-motion
// / touch all degrade to fully visible, still content.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const motionOK = matchMedia('(prefers-reduced-motion: no-preference)').matches;
const fine = matchMedia('(min-width: 860px) and (hover: hover) and (pointer: fine)').matches;
const canWipe = motionOK && matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------------------------------------------------------------------------
// One-time: Lenis smooth scroll
// ---------------------------------------------------------------------------
let lenis: Lenis | null = null;
if (motionOK) {
  lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
  document.documentElement.classList.add('lenis');
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ---------------------------------------------------------------------------
// One-time: custom cursor (fine pointer + motion). Hover targets via delegation
// so they keep working after View-Transition page swaps.
// ---------------------------------------------------------------------------
if (fine && motionOK) {
  document.documentElement.classList.add('has-cursor');
  const cursor = document.getElementById('cursor')!;
  const label = document.getElementById('cursor-label')!;
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  const cx = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3' });
  const cy = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3' });
  let shown = false;
  window.addEventListener('pointermove', (e) => {
    cx(e.clientX); cy(e.clientY);
    if (!shown) { gsap.to(cursor, { opacity: 1, duration: 0.3 }); shown = true; }
  });
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as HTMLElement).closest?.('[data-cursor]');
    if (t) { cursor.classList.add('is-hover'); label.textContent = t.getAttribute('data-cursor') || 'View'; }
  });
  document.addEventListener('pointerout', (e) => {
    const t = (e.target as HTMLElement).closest?.('[data-cursor]');
    if (t && !t.contains((e as PointerEvent).relatedTarget as Node)) {
      cursor.classList.remove('is-hover'); label.textContent = '';
    }
  });
}

// ---------------------------------------------------------------------------
// One-time: branded preloader (first load only; reduced-motion skips it)
// ---------------------------------------------------------------------------
let preloaderDone = !motionOK;
(function preloader() {
  const pre = document.getElementById('preloader');
  if (!pre) { preloaderDone = true; return; }
  if (!motionOK) { pre.classList.add('is-done'); preloaderDone = true; return; }
  const count = document.getElementById('preloader-count');
  const fill = document.getElementById('preloader-fill');
  const st = { n: 0 };
  gsap.to(st, {
    n: 100, duration: 1.1, ease: 'power2.inOut',
    onUpdate: () => { const v = Math.round(st.n); if (count) count.textContent = String(v); if (fill) (fill as HTMLElement).style.width = v + '%'; },
    onComplete: () => { pre.classList.add('is-done'); preloaderDone = true; playHeroIntro(); },
  });
})();

// ---------------------------------------------------------------------------
// Hero entrance (coordinated with the preloader on first load)
// ---------------------------------------------------------------------------
let heroIntroPlayed = false;
function playHeroIntro() {
  if (heroIntroPlayed) return;
  const els = document.querySelectorAll('[data-hero-in]');
  if (!els.length) return;
  heroIntroPlayed = true;
  if (!motionOK) { gsap.set(els, { opacity: 1, y: 0 }); return; }
  gsap.fromTo(els, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.09 });
}

// ---------------------------------------------------------------------------
// Page-transition wipe, driven by the Astro lifecycle (desktop only)
// ---------------------------------------------------------------------------
const wipe = document.getElementById('wipe');
function wipeCover(): Promise<void> {
  return new Promise((res) => {
    if (!canWipe || !wipe) return res();
    gsap.timeline({ onComplete: () => res() })
      .set(wipe, { scaleY: 0, transformOrigin: '50% 100%' })
      .to(wipe, { scaleY: 1, duration: 0.45, ease: 'power4.inOut' });
  });
}
function wipeReveal() {
  if (!canWipe || !wipe) return;
  gsap.timeline()
    .set(wipe, { transformOrigin: '50% 0%' })
    .to(wipe, { scaleY: 0, duration: 0.55, ease: 'power4.inOut' });
}

document.addEventListener('astro:before-preparation', (e: any) => {
  const original = e.loader;
  e.loader = async () => { await wipeCover(); await original(); };
});
document.addEventListener('astro:after-swap', () => {
  window.scrollTo(0, 0);
  lenis?.scrollTo(0, { immediate: true });
});

// ---------------------------------------------------------------------------
// Per-page: (re)build everything tied to swapped <main> content
// ---------------------------------------------------------------------------
let pageMM: ReturnType<typeof gsap.matchMedia> | null = null;
function initPage() {
  // clear stale triggers + matchMedia context from the previous page
  ScrollTrigger.getAll().forEach((t) => t.kill());
  pageMM?.revert();
  heroIntroPlayed = false;

  // scroll progress
  const progressFill = document.getElementById('progress-fill');
  if (progressFill && motionOK) {
    const setProg = gsap.quickSetter(progressFill, 'scaleX');
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => setProg(self.progress) });
  }

  pageMM = gsap.matchMedia();
  const mm = pageMM;
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // reveal groups (scene stagger). fromTo (not from): the CSS base is opacity:0
    // for no-FOUC, so we must set the end state explicitly or it animates 0 -> 0.
    document.querySelectorAll('.scene').forEach((scene) => {
      const ins = scene.querySelectorAll('[data-in]');
      if (ins.length) gsap.fromTo(ins, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: scene, start: 'top 68%', once: true } });
    });
    // simple reveals (inner pages)
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => el.classList.add('in') });
    });
    // kinetic type: display titles assemble their width axis on entry
    document.querySelectorAll<HTMLElement>('.scene__title, .contact__big, [data-stretch]').forEach((title) => {
      gsap.fromTo(title, { '--wdth': 74 }, { '--wdth': 118, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: title, start: 'top 82%', once: true } });
    });
    // count-ups (init to 0 on the motion path; reduced-motion keeps the real value)
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((counter) => {
      const target = Number(counter.dataset.count);
      if (!Number.isFinite(target)) return;
      const obj = { n: 0 };
      counter.textContent = '0';
      ScrollTrigger.create({ trigger: counter, start: 'top 85%', once: true, onEnter: () => {
        gsap.to(obj, { n: target, duration: 1.8, ease: 'power2.out', onUpdate: () => { counter.textContent = Math.round(obj.n).toLocaleString('en-US'); } });
      }});
    });
  });

  // parallax (desktop + motion only)
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 860px)', () => {
    document.querySelectorAll<HTMLElement>('[data-par]').forEach((el) => {
      const amt = parseFloat(el.dataset.par || '0');
      gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.closest('.scene') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  // section HUD (home)
  const idxEl = document.getElementById('hud-idx');
  const labelEl = document.getElementById('hud-label');
  if (fine && idxEl && labelEl) {
    const ticks = Array.from(document.querySelectorAll<HTMLElement>('[data-tick]'));
    document.querySelectorAll<HTMLElement>('.scene[data-scene]').forEach((scene) => {
      const i = Number(scene.dataset.scene);
      ScrollTrigger.create({ trigger: scene, start: 'top center', end: 'bottom center',
        onToggle: (self) => { if (self.isActive) {
          idxEl.textContent = String(i + 1).padStart(2, '0');
          labelEl.textContent = scene.dataset.label || '';
          ticks.forEach((tk, j) => tk.classList.toggle('is-on', j === i));
        }},
      });
    });
  }

  // lazy WebGL hero (home only; keeps ogl out of the main bundle)
  if (document.getElementById('hero-field')) {
    import('./hero-field').then((m) => m.initHeroField()).catch(() => {});
  }

  // no-JS-parity: if reduced motion, ensure reveals are shown (CSS already does, belt-and-braces)
  if (!motionOK) document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));

  if (preloaderDone) playHeroIntro();
  lenis?.resize();
  ScrollTrigger.refresh();
}

// in-page anchor links: smooth-scroll via Lenis (no wipe)
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
  if (!a) return;
  const id = a.getAttribute('href') || '';
  if (id.length < 2) return;
  const target = document.querySelector(id) as HTMLElement | null;
  if (!target) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(target, { offset: -10 });
  else target.scrollIntoView({ behavior: motionOK ? 'smooth' : 'auto' });
});

document.addEventListener('astro:page-load', () => { initPage(); wipeReveal(); });
