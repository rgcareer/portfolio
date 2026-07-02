import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------------------------------------------------------------------------
// Typewriter (folio + field note). Text lives in markup (no-JS safe); with
// motion we clear and retype it.
// ---------------------------------------------------------------------------
function typewrite(el: HTMLElement, delayMs: number, speed = 30, caret?: HTMLElement) {
  const txt = el.dataset.type ?? el.textContent ?? '';
  if (reduce) return;
  el.textContent = '';
  if (caret) caret.hidden = false;
  let i = 0;
  setTimeout(function tick() {
    el.textContent = txt.slice(0, i);
    if (i++ <= txt.length) setTimeout(tick, speed);
    else if (caret) setTimeout(() => (caret.hidden = true), 1400);
  }, delayMs);
}

// ---------------------------------------------------------------------------
// Cover print sequence — the one orchestrated load the brand register earns.
// Story: the manual assembles — registration marks, folio types, the name is
// pressed then inked, the stamp approves it, the spec table rules itself.
// ---------------------------------------------------------------------------
const coverMarks = document.getElementById('cover-marks');
const masks = gsap.utils.toArray<HTMLElement>('.mask__in');
const sweep = document.querySelector<HTMLElement>('.ink-sweep');
const stamp = document.querySelector<HTMLElement>('[data-stamp]');
const specRows = gsap.utils.toArray<HTMLElement>('[data-specrow]');
const folio = document.getElementById('folio-type');
const note = document.getElementById('fieldnote');
const noteCaret = document.getElementById('fieldnote-caret');

if (reduce) {
  gsap.set(masks, { y: 0 });
  if (sweep) gsap.set(sweep, { clipPath: 'none' });
  if (stamp) gsap.set(stamp, { opacity: 1 });
  coverMarks?.classList.add('in');
} else if (masks.length) {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.add(() => coverMarks?.classList.add('in'), 0);
  if (folio) typewrite(folio, 150, 26);
  tl.to(masks[0], { y: 0, duration: 0.9 }, 0.3);
  if (sweep) {
    tl.set(sweep, { y: 0 }, 0.55); // rises with clip still closed
    tl.to(sweep, { clipPath: 'inset(-2% -2% -2% -2%)', duration: 0.85, ease: 'power2.inOut' }, 0.62);
  }
  if (stamp) {
    tl.fromTo(
      stamp,
      { opacity: 0, scale: 1.9, rotate: -2 },
      { opacity: 1, scale: 1, rotate: -7, duration: 0.4, ease: 'power4.in', clearProps: 'scale' },
      1.15
    );
    // ink soak: one quick settle pulse
    tl.to(stamp, { opacity: 0.82, duration: 0.07, yoyo: true, repeat: 1 }, 1.56);
  }
  if (specRows.length) {
    tl.fromTo(
      specRows,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' },
      1.2
    );
  }
  if (note) typewrite(note, 1900, 24, noteCaret ?? undefined);
}

// Entrance for remaining [data-anim] (tagline, blurb, CTAs, folio row).
const anim = gsap.utils.toArray<HTMLElement>('[data-anim]');
if (anim.length) {
  if (reduce) {
    gsap.set(anim, { opacity: 1 });
  } else {
    gsap.fromTo(
      anim,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: masks.length ? 0.5 : 0.06 }
    );
  }
}

// ---------------------------------------------------------------------------
// Magnetic pull on CTAs (hover physics).
// ---------------------------------------------------------------------------
if (!reduce && fine) {
  gsap.utils.toArray<HTMLElement>('.magnetic').forEach((el) => {
    const strength = el.classList.contains('magnetic--soft') ? 0.16 : 0.28;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * strength,
        y: (e.clientY - (r.top + r.height / 2)) * strength,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' }));
  });
}

// ---------------------------------------------------------------------------
// Plates: cinematic filing (desktop). The outgoing sheet lifts, tilts with
// paper physics, and takes a FILED stamp; each figure drifts inside its frame.
// Mobile keeps the CSS sticky stack untouched.
// ---------------------------------------------------------------------------
if (!reduce) {
  const mm = gsap.matchMedia();
  mm.add('(hover: hover) and (pointer: fine) and (min-width: 880px)', () => {
    const plates = gsap.utils.toArray<HTMLElement>('.plate');

    plates.forEach((plate, i) => {
      const sheet = plate.querySelector<HTMLElement>('.plate__in');
      const filed = plate.querySelector<HTMLElement>('.filed');
      const fig = plate.querySelector<HTMLElement>('[data-parallax]');
      const next = plates[i + 1];

      // Figure drifts inside its frame while the plate crosses the viewport.
      if (fig) {
        gsap.fromTo(
          fig,
          { yPercent: -6, scale: 1.06 },
          {
            yPercent: 6,
            scale: 1.06,
            ease: 'none',
            scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
          }
        );
      }

      if (!next || !sheet) return;

      // Outgoing sheet files itself as the next one slides over.
      gsap.to(sheet, {
        scale: 0.962,
        y: -10,
        rotate: i % 2 ? 0.55 : -0.55,
        opacity: 0.75,
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom-=120',
          end: 'top top+=140',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      // FILED stamp thunks onto the sheet as it's put away (once).
      if (filed) {
        ScrollTrigger.create({
          trigger: next,
          start: 'top 45%',
          once: true,
          onEnter: () =>
            gsap.fromTo(
              filed,
              { opacity: 0, scale: 1.8, rotate: -14 },
              { opacity: 1, scale: 1, rotate: -6, duration: 0.28, ease: 'power4.in' }
            ),
        });
      }
    });

    return () => {};
  });
}

// ---------------------------------------------------------------------------
// Metric counters (numbers are measured, not asserted). Once, on view.
// ---------------------------------------------------------------------------
gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target) || reduce) return;
  const state = { v: 0 };
  gsap.to(state, {
    v: target,
    duration: 1.4,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    onUpdate: () => {
      el.textContent = Math.round(state.v).toLocaleString('en-US');
    },
  });
});

// ---------------------------------------------------------------------------
// Drafting-machine layer: straightedge hairlines + coordinate readout.
// Fine pointers on wide viewports only (Readout.astro gates display via CSS).
// ---------------------------------------------------------------------------
if (!reduce && fine) {
  const dx = document.getElementById('draft-x');
  const dy = document.getElementById('draft-y');
  const xy = document.getElementById('readout-xy');
  const secEl = document.getElementById('readout-sec');

  if (dx && dy && xy) {
    let px = 0, py = 0, queued = false;
    const paint = () => {
      queued = false;
      dx.style.transform = `translateY(${py}px)`;
      dy.style.transform = `translateX(${px}px)`;
      xy.textContent = `X ${String(px).padStart(4, '0')} · Y ${String(py).padStart(4, '0')}`;
    };
    addEventListener(
      'pointermove',
      (e) => {
        px = Math.round(e.clientX);
        py = Math.round(e.clientY);
        if (!queued) { queued = true; requestAnimationFrame(paint); }
      },
      { passive: true }
    );
  }

  // Current-section tracking for the readout.
  if (secEl) {
    const secs = document.querySelectorAll<HTMLElement>('[data-sec]');
    if (secs.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) secEl.textContent = (e.target as HTMLElement).dataset.sec!.toUpperCase();
          });
        },
        { rootMargin: '-40% 0px -50% 0px' }
      );
      secs.forEach((s) => io.observe(s));
    } else {
      // Inner pages: label by document title's first word segment.
      secEl.textContent = (document.body.dataset.page || document.title.split('·')[0] || 'PAGE').trim().toUpperCase().slice(0, 12);
    }
  }
}

// ---------------------------------------------------------------------------
// Rule-draw + crop-mark triggers reuse the global IO (elements carry .reveal),
// which only decorates — content is never visibility-gated. (See BaseLayout.)
// ---------------------------------------------------------------------------
