/* ============================================================================
   proto2.ts - "The Highlighter" M-gate motion. Zero external libraries: native
   scroll + CSS transitions + IntersectionObserver + a touch of WAAPI. Crisp and
   fast IS the brand. All motion is additive over a fully readable base: no-JS
   and reduced-motion see every highlight painted and every block visible (the
   CSS forces that), so this file only ever ADDS the entrance + sweeps.
   Stripped/rebuilt into the real system at B2.
   ============================================================================ */

type El = HTMLElement;

const root = document.documentElement;
const reduced =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  root.hasAttribute('data-reduce');

const cfg = { stagger: 110, pace: 1 }; // JS-side dial state (CSS holds dur/band)

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
  // start the annotation pass after the hero has begun to rise
  window.setTimeout(() => sweepMarksIn(document.querySelector('.hero') as ParentNode), 480 * cfg.pace);
}

function wireScrollReveals() {
  const blocks = $('[data-in]');
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

/* ---- dial panel (stripped at B2) ------------------------------------------ */
function wireDials() {
  const toggle = document.getElementById('dials-toggle');
  const panel = document.getElementById('dials');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const open = panel.hasAttribute('hidden');
    if (open) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', String(open));
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

  bind('d-dur', 'd-dur-v', (v) => `${v}ms`, (v) => root.style.setProperty('--sweep-dur', `${v}ms`));
  bind('d-stagger', 'd-stagger-v', (v) => `${v}ms`, (v) => (cfg.stagger = v));
  bind('d-pace', 'd-pace-v', (v) => `${v.toFixed(1)}x`, (v) => {
    cfg.pace = v;
    root.style.setProperty('--entrance-pace', String(v));
  });
  bind('d-band', 'd-band-v', (v) => v.toFixed(2), (v) => root.style.setProperty('--band-intensity', String(v)));

  const replay = document.getElementById('d-replay');
  replay?.addEventListener('click', () => {
    $('.hero [data-hero-in], .hero [data-sweep]').forEach((el) => el.classList.remove('is-in', 'is-swept'));
    $('[data-hero-in]').forEach((el) => el.classList.remove('is-in'));
    void (document.querySelector('.hero') as El)?.offsetWidth; // reflow so the reset paints
    requestAnimationFrame(revealHero);
  });
}

/* ---- ground switcher (proto compare; stripped at B2) ---------------------- */
function wireTheme() {
  const btns = $('[data-theme-btn]');
  const sync = () => {
    const cur = root.getAttribute('data-theme') || 'charcoal';
    btns.forEach((x) => x.setAttribute('aria-pressed', String(x.getAttribute('data-theme-btn') === cur)));
  };
  btns.forEach((b) =>
    b.addEventListener('click', () => {
      root.setAttribute('data-theme', b.getAttribute('data-theme-btn') || 'charcoal');
      sync();
    })
  );
  sync();
}

/* ---- boot ----------------------------------------------------------------- */
function boot() {
  try {
    wireTheme();
    wireDials();
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
    console.error('[proto2] motion boot failed, revealed statically:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
