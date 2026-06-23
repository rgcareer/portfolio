import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Entrance choreography for [data-anim] (hidden by CSS under .js to avoid FOUC).
const anim = gsap.utils.toArray<HTMLElement>('[data-anim]');
if (anim.length) {
  if (reduce) {
    gsap.set(anim, { opacity: 1 });
  } else {
    gsap.fromTo(
      anim,
      { opacity: 0, y: 28, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05, ease: 'power3.out', stagger: 0.08, delay: 0.06 }
    );
  }
}

// Magnetic pull on .magnetic elements.
if (!reduce) {
  gsap.utils.toArray<HTMLElement>('.magnetic').forEach((el) => {
    const strength = el.classList.contains('magnetic--soft') ? 0.18 : 0.3;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * strength,
        y: (e.clientY - (r.top + r.height / 2)) * strength,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }));
  });
}

// Scroll-driven parallax: background layers drift at different rates; the hero lifts away.
if (!reduce) {
  gsap.to('.bg-grid', { yPercent: 16, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.6 } });
  gsap.to('.bg-field', { yPercent: -10, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.6 } });

  const hero = document.querySelector('.hero');
  if (hero) {
    gsap.to(hero, {
      yPercent: -6,
      opacity: 0.55,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.4 },
    });
  }
}
