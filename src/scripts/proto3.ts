/* ============================================================================
   proto3.ts - "Open Book" motion. Zero external libraries: native scroll + CSS
   transitions + IntersectionObserver + a touch of rAF for the tally. All motion
   is additive over a fully readable base: no-JS and reduced-motion see every
   block visible and every real number in place (the CSS forces that), so this
   file only ever ADDS the entrance, the leader draw, and the count-up.
   Rebuilt into the real system at B2'. Design authority: open-book-handoff.md.
   ============================================================================ */

type El = HTMLElement;

const root = document.documentElement;
const reduced =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  root.hasAttribute('data-reduce');

const cfg = { stagger: 90, pace: 1, tallyDur: 900 };

const $ = <T extends Element = El>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));

/* ---- count-up tally (real value is already in the markup) ----------------- */
function tally(el: El) {
  const target = parseInt(el.getAttribute('data-count') || '', 10);
  if (isNaN(target)) return;
  if (el.dataset.tallied) return;
  el.dataset.tallied = '1';
  if (target === 0) return; // nothing to animate; markup already reads "0"
  let t0: number | null = null;
  const dur = cfg.tallyDur;
  const step = (t: number) => {
    if (t0 === null) t0 = t;
    const p = Math.min((t - t0) / dur, 1);
    const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toLocaleString('en-US');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('en-US');
  };
  // start from 0 (block is still hidden/fading, so no flash of the final value)
  el.textContent = '0';
  requestAnimationFrame(step);
}

/* ---- hero entrance -------------------------------------------------------- */
function revealHero() {
  $('[data-hero-in]').forEach((el, i) => {
    window.setTimeout(() => el.classList.add('is-in'), i * cfg.stagger);
  });
}

/* ---- scroll reveals + tally trigger --------------------------------------- */
function wireScrollReveals() {
  const blocks = $('[data-in]');
  const fire = (b: El) => {
    b.classList.add('is-in');
    $('[data-count]', b).forEach(tally);
  };
  if (!('IntersectionObserver' in window)) {
    blocks.forEach(fire);
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        fire(e.target as El);
        obs.unobserve(e.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.2 }
  );
  blocks.forEach((b) => io.observe(b));
}

/* ---- dial panel (proto chrome; stripped at B2') --------------------------- */
function wireDials() {
  const toggle = document.getElementById('dials-toggle');
  const panel = document.getElementById('dials');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const opening = panel.hasAttribute('hidden');
    if (opening) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', String(opening));
  });

  const bind = (
    id: string,
    vId: string,
    fmt: (v: number) => string,
    apply: (v: number) => void
  ) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    const out = document.getElementById(vId);
    if (!input || !out) return;
    const run = () => {
      const v = parseFloat(input.value);
      out.textContent = fmt(v);
      apply(v);
    };
    input.addEventListener('input', run);
    run();
  };

  bind('d-pace', 'd-pace-v', (v) => `${v.toFixed(1)}x`, (v) => {
    cfg.pace = v;
    root.style.setProperty('--enter-dur', `${Math.round(700 / v)}ms`);
  });
  bind('d-stagger', 'd-stagger-v', (v) => `${v}ms`, (v) => (cfg.stagger = v));
  bind('d-tally', 'd-tally-v', (v) => `${v}ms`, (v) => (cfg.tallyDur = v));
  bind('d-drift', 'd-drift-v', (v) => `${v}s`, (v) => root.style.setProperty('--drift-dur', `${v}s`));

  document.getElementById('d-replay')?.addEventListener('click', () => {
    $('[data-hero-in]').forEach((el) => el.classList.remove('is-in'));
    void (document.querySelector('.hero') as El)?.offsetWidth; // reflow so the reset paints
    requestAnimationFrame(revealHero);
  });
}

/* ---- boot ----------------------------------------------------------------- */
function boot() {
  try {
    wireDials();
    if (reduced) return; // CSS already shows everything; nothing to animate
    requestAnimationFrame(() => {
      revealHero();
      wireScrollReveals();
    });
  } catch (err) {
    // never let a motion bug hide content: reveal everything, tally to final
    $('[data-hero-in], [data-in]').forEach((el) => el.classList.add('is-in'));
    $('[data-count]').forEach((el) => {
      const t = parseInt(el.getAttribute('data-count') || '', 10);
      if (!isNaN(t)) el.textContent = t.toLocaleString('en-US');
    });
    // eslint-disable-next-line no-console
    console.error('[proto3] motion boot failed, revealed statically:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
