/* ============================================================================
   motion.ts - Overvolt x Aurora motion runtime (getsmartai.ai). Zero external
   libraries: native scroll + CSS transitions + IntersectionObserver + WAAPI.
   Sharp and cinematic: the billboard headline rises out of a clip, the gold
   key-phrase underlines "charge" (draw 0 -> 100%), and the evidence number
   counts up as it enters view (the proof assembling). All motion is ADDITIVE
   over a fully readable base: no-JS and reduced-motion see the final numbers,
   drawn underlines, and every block visible (the CSS forces that). A try/catch
   boot reveals everything on error. A no-op on pages with no hooks.
   ============================================================================ */

type El = HTMLElement;

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cfg = { stagger: 120, pace: 1 };

const $ = <T extends Element = El>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));

/* ---- underline charge ----------------------------------------------------- */
function chargeIn(container: ParentNode, base = 0) {
  $('.zap[data-charge]', container).forEach((m, i) => {
    if (m.classList.contains('is-charged')) return;
    window.setTimeout(() => m.classList.add('is-charged'), base + i * cfg.stagger);
  });
}

/* ---- count-up on the evidence number (the proof assembling) ---------------- */
function countUp(el: El) {
  const target = parseInt(el.getAttribute('data-count') || '0', 10);
  if (!target || el.dataset.counted) return;
  el.dataset.counted = '1';
  const dur = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = Math.round(target * e).toLocaleString('en-US');
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---- hero entrance -------------------------------------------------------- */
function revealHero() {
  $('[data-hero-in]').forEach((el) => el.classList.add('is-in'));
  $('.head-clip').forEach((el) => el.classList.add('is-in'));
  const hero = document.querySelector('.hero');
  if (hero) window.setTimeout(() => chargeIn(hero), 560 * cfg.pace);
}

/* ---- scroll reveals ------------------------------------------------------- */
function wireScrollReveals() {
  const blocks = $('[data-in]');
  if (!blocks.length) return;
  if (!('IntersectionObserver' in window)) {
    blocks.forEach((b) => {
      b.classList.add('is-in');
      chargeIn(b);
      $('[data-count]', b).forEach(countUp);
    });
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const b = e.target as El;
        b.classList.add('is-in');
        chargeIn(b, 150);
        $('[data-count]', b).forEach(countUp);
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

/* ---- the circuit: a gold spine drawn by scroll, terminating at the CTA ------ */
function wireSpine() {
  const spine = document.querySelector('.spine') as El | null;
  const main = document.querySelector('main');
  if (!spine || !main) return;
  const cta = document.querySelector('.close .btn') as El | null;
  let live = false;
  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = main.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    const p = total > 0 ? scrolled / total : 1;
    spine.style.transform = `scaleY(${p.toFixed(4)})`;
    if (!live && p > 0.97 && cta) { live = true; cta.classList.add('is-live'); }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* ---- boot ----------------------------------------------------------------- */
function boot() {
  try {
    if (reduced) return; // CSS already shows everything; nothing to animate
    // zero the count-up targets before they scroll into view (they are below the fold)
    $('[data-count]').forEach((el) => (el.textContent = '0'));
    requestAnimationFrame(() => {
      revealHero();
      wireScrollReveals();
      wireMagnetic();
      wireSpine();
    });
  } catch (err) {
    $('[data-in], [data-hero-in], .head-clip').forEach((el) => el.classList.add('is-in'));
    $('.zap[data-charge]').forEach((el) => el.classList.add('is-charged'));
    $('[data-count]').forEach((el) => { const t = el.getAttribute('data-count'); if (t) el.textContent = parseInt(t, 10).toLocaleString('en-US'); });
    // eslint-disable-next-line no-console
    console.error('[motion] boot failed, revealed statically:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
