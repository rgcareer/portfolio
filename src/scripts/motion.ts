import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// Cover: line-mask reveal for the display name (storytelling: the manual's
// cover "prints" first), then the rest of the page enters.
// ---------------------------------------------------------------------------
const masks = gsap.utils.toArray<HTMLElement>('.mask__in');
if (masks.length) {
  if (reduce) {
    gsap.set(masks, { y: 0 });
  } else {
    gsap.to(masks, { y: 0, duration: 1.0, ease: 'power4.out', stagger: 0.09, delay: 0.1 });
  }
}

// Entrance choreography for [data-anim] (hidden by CSS under .js to avoid FOUC).
const anim = gsap.utils.toArray<HTMLElement>('[data-anim]');
if (anim.length) {
  if (reduce) {
    gsap.set(anim, { opacity: 1 });
  } else {
    gsap.fromTo(
      anim,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: masks.length ? 0.35 : 0.06 }
    );
  }
}

// Stamp thunk (feedback/storytelling: the document gets approved). Once.
const stamp = document.querySelector<HTMLElement>('[data-stamp]');
if (stamp) {
  if (reduce) {
    gsap.set(stamp, { opacity: 1 });
  } else {
    gsap.fromTo(
      stamp,
      { opacity: 0, scale: 1.9, rotate: -2 },
      { opacity: 1, scale: 1, rotate: -7, duration: 0.45, ease: 'power4.in', delay: 0.85, clearProps: 'scale' }
    );
  }
}

// ---------------------------------------------------------------------------
// Magnetic pull on .magnetic elements (hover physics on CTAs).
// ---------------------------------------------------------------------------
if (!reduce) {
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
// Plates: as the next sheet slides over, the covered sheet settles back
// (state transition: "this plate is filed"). Desktop pointers only — sticky
// stacking itself is CSS and works everywhere; the scrub is enhancement.
// ---------------------------------------------------------------------------
if (!reduce) {
  const mm = gsap.matchMedia();
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const plates = gsap.utils.toArray<HTMLElement>('.plate');
    plates.forEach((plate, i) => {
      const next = plates[i + 1];
      if (!next) return;
      const sheet = plate.querySelector<HTMLElement>('.plate__in');
      if (!sheet) return;
      gsap.to(sheet, {
        scale: 0.965,
        opacity: 0.72,
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom-=120',
          end: 'top top+=140',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Metric counters (storytelling: the numbers are measured, not asserted).
// Runs once per element when it scrolls into view.
// ---------------------------------------------------------------------------
gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  if (reduce) return; // static final value is already in the markup
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
