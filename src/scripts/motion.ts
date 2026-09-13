/* ============================================================================
   motion.ts - Green Light motion runtime (getsmartai.ai). Zero external
   libraries: native scroll + CSS transitions + IntersectionObserver + a touch
   of WAAPI. Crisp and fast IS the brand. All motion is ADDITIVE over a fully
   readable base: no-JS and reduced-motion see every highlight painted and every
   block visible (the CSS forces that), so this file only ever ADDS the hero
   entrance, the annotation-pass sweeps, and scroll reveals. A try/catch boot
   reveals everything on error: a motion bug must never hide content.
   Runs site-wide via BaseLayout; a no-op on pages with no [data-in] markers.
   Rebuilt from the approved /proto2 mockup (dials + ground-switcher stripped).
   ============================================================================ */

type El = HTMLElement;

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// baked motion values (approved dials from the M-gate; CSS holds dur + band).
const cfg = { stagger: 110, pace: 1 };

const $ = <T extends Element = El>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));

/* ---- reveals + sweeps ----------------------------------------------------- */
function sweepMarksIn(container: ParentNode, base = 0) {
  $('[data-sweep]', container).forEach((m, i) => {
    if (m.classList.contains('is-swept')) return;
    window.setTimeout(() => m.classList.add('is-swept'), base + i * cfg.stagger);
  });
}

function revealHero() {
  $('[data-hero-in]').forEach((el) => el.classList.add('is-in'));
  // start the annotation pass after the hero has begun to rise (home only)
  const hero = document.querySelector('.hero');
  if (hero) window.setTimeout(() => sweepMarksIn(hero), 480 * cfg.pace);
}

function wireScrollReveals() {
  const blocks = $('[data-in]');
  if (!blocks.length) return;
  if (!('IntersectionObserver' in window)) {
    blocks.forEach((b) => {
      b.classList.add('is-in');
      sweepMarksIn(b);
    });
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const b = e.target as El;
        b.classList.add('is-in');
        // let the block's own reveal begin, then sweep any marks it holds
        sweepMarksIn(b, 140);
        obs.unobserve(b);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
  );
  blocks.forEach((b) => io.observe(b));
}

/* ---- magnetic primary buttons (pointer:fine only) ------------------------- */
function wireMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $('.btn').forEach((btn) => {
    const pull = 8;
    btn.addEventListener('pointermove', (ev) => {
      const r = btn.getBoundingClientRect();
      const dx = (ev.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (ev.clientY - (r.top + r.height / 2)) / (r.height / 2);
      btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ---- boot ----------------------------------------------------------------- */
function boot() {
  try {
    if (reduced) return; // CSS already shows everything; nothing to animate
    requestAnimationFrame(() => {
      revealHero();
      wireScrollReveals();
      wireMagnetic();
    });
  } catch (err) {
    // never let a motion bug hide content: reveal everything
    $('[data-in], [data-hero-in]').forEach((el) => el.classList.add('is-in'));
    $('[data-sweep]').forEach((el) => el.classList.add('is-swept'));
    // eslint-disable-next-line no-console
    console.error('[motion] boot failed, revealed statically:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
