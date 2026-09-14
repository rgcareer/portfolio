/* ============================================================================
   proto4.ts - "Open Book, live" motion. Zero external libraries (CSP blocks
   third-party origins): vanilla WebGL2 for the living daylight, rAF for the
   count-up, IntersectionObserver for the proof tally, CSS scroll-driven
   animation for the leaders, and a CSS-only hero entrance (this file does NOT
   reveal the hero - CSS does - so a module load failure never blanks it). All
   motion is ADDITIVE over a fully readable base: no-JS and reduced-motion show
   every block and every real number in place. Design authority: open-book-handoff.md.
   ============================================================================ */

type El = HTMLElement;

const root = document.documentElement;
const reduced =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  root.hasAttribute('data-reduce');

const cfg = { tallyDur: 1000 };

const $ = <T extends Element = El>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));

/* ---- count-up tally (real value already in the markup) --------------------
   On-register "the math computes": figures tot UP like a ledger column - never
   a digit-noise scramble (that reads slot-machine / terminal, off-brand). The
   hero receipts and the proof monuments use the SAME count-up for one voice. */
function tally(el: El) {
  const target = parseInt(el.getAttribute('data-count') || '', 10);
  if (isNaN(target)) return;
  if (el.dataset.tallied) return;
  el.dataset.tallied = '1';
  if (target === 0) return; // markup already reads "0" / "$0"
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
  el.textContent = '0';
  requestAnimationFrame(step);
}
function tallyHero() { $('.hero-math [data-count]').forEach(tally); }

/* ---- proof monuments count up when the section enters --------------------- */
function wireTally() {
  const nums = $('.proof [data-count]');
  if (!nums.length) return;
  if (!('IntersectionObserver' in window)) { nums.forEach(tally); return; }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        tally(e.target as El);
        obs.unobserve(e.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.4 }
  );
  nums.forEach((n) => io.observe(n));
}

/* ---- living daylight: ONE vanilla-WebGL2 sun-patch (warm, never neon) ------
   Full production discipline (foundry webgl checklist): DPR clamp, 30fps ambient
   throttle, pause off-screen + on hidden tab, highp float, getContext-null and
   any-error -> remove canvas so the static --sun fill shows. Reduced motion: the
   canvas is removed entirely and the flat sun-patch stands. */
function daylight() {
  const canvas = document.querySelector('.daylight') as HTMLCanvasElement | null;
  (window as any).__daylight = { mode: 'none', frames: 0 };
  if (!canvas) return;
  if (reduced) { canvas.remove(); (window as any).__daylight.mode = 'reduced-static'; return; }

  let gl: WebGL2RenderingContext | null = null;
  try { gl = canvas.getContext('webgl2', { antialias: false, alpha: false }); } catch (e) { gl = null; }
  if (!gl) { canvas.remove(); (window as any).__daylight.mode = 'static-fallback'; return; }

  const VS = `#version 300 es
  precision highp float; const vec2 P[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
  void main(){ gl_Position = vec4(P[gl_VertexID],0.,1.); }`;
  const FS = `#version 300 es
  precision highp float; out vec4 o; uniform vec2 R; uniform float T;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),u.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x), u.y); }
  float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.02; a*=.5; } return v; }
  void main(){
    vec2 uv = gl_FragCoord.xy / R; vec2 q = uv * vec2(R.x/R.y, 1.);
    // slow warm light moving like morning sun across paper
    float f = fbm(q*1.7 + vec2(T*.018, -T*.012) + fbm(q*3.0 - T*.01));
    vec3 warm  = vec3(0.949, 0.784, 0.604);   // #F2C89A deeper apricot
    vec3 sunny = vec3(1.000, 0.851, 0.690);   // #FFD9B0 the sun token
    vec3 bright= vec3(1.000, 0.945, 0.870);   // #FFF1DE near-white daylight
    vec3 rose  = vec3(1.000, 0.827, 0.788);   // #FFD3C9 rose hint
    vec3 c = mix(warm, sunny, smoothstep(0.22, 0.58, f));
    c = mix(c, bright, smoothstep(0.62, 0.96, f) * 0.85);
    c = mix(c, rose, smoothstep(0.30, 0.05, f) * 0.30);   // rose pools in the lows
    o = vec4(c, 1.0);
  }`;
  const sh = (type: number, src: string) => { const s = gl!.createShader(type)!; gl!.shaderSource(s, src); gl!.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); (window as any).__daylight.mode = 'link-fail-static'; return; }
  gl.useProgram(prog);
  const uR = gl.getUniformLocation(prog, 'R'), uT = gl.getUniformLocation(prog, 'T');

  const touch = window.matchMedia('(pointer: coarse)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2);
  const size = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * DPR));
    const hgt = Math.max(1, Math.round(canvas.clientHeight * DPR));
    if (canvas.width !== w || canvas.height !== hgt) { canvas.width = w; canvas.height = hgt; gl!.viewport(0, 0, w, hgt); }
  };
  const draw = (t: number) => { size(); gl!.uniform2f(uR, canvas.width, canvas.height); gl!.uniform1f(uT, t / 1000); gl!.drawArrays(gl!.TRIANGLES, 0, 3); (window as any).__daylight.frames++; };
  size();
  window.addEventListener('resize', size, { passive: true });
  draw(0); // first frame always paints
  (window as any).__daylight.mode = 'animated';

  let visible = true, raf: number | null = null, last = 0;
  const THROTTLE = 1000 / 30;
  const loop = (t: number) => {
    raf = null;
    if (!visible || document.hidden) return;
    if (t - last >= THROTTLE) { last = t; draw(t); }
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) start(); }, { threshold: 0.01 }).observe(hero);
  }
  document.addEventListener('visibilitychange', start);
  start();
}

/* ---- magnetic CTAs (pointer:fine only; disabled under reduced motion) ------ */
function magnetic() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduced || !fine) return;
  const btns = $('[data-magnetic]').map((el) => ({ el, tx: 0, ty: 0, x: 0, y: 0 }));
  if (!btns.length) return;
  const R = 130, S = 0.22; // gentle lean; enough to feel, not a trendy yank
  let raf: number | null = null;
  const tick = () => {
    raf = null;
    let moving = false;
    for (const b of btns) {
      b.x += (b.tx - b.x) * 0.18;
      b.y += (b.ty - b.y) * 0.18;
      if (Math.abs(b.tx - b.x) > 0.1 || Math.abs(b.ty - b.y) > 0.1) moving = true;
      if (b.tx === 0 && b.ty === 0 && Math.abs(b.x) < 0.1 && Math.abs(b.y) < 0.1) { b.el.style.transform = ''; b.x = 0; b.y = 0; }
      else b.el.style.transform = `translate(${b.x.toFixed(2)}px, ${b.y.toFixed(2)}px)`;
    }
    if (moving) raf = requestAnimationFrame(tick);
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener('pointermove', (e) => {
    for (const b of btns) {
      const r = b.el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < R) { b.tx = dx * S; b.ty = dy * S; } else { b.tx = 0; b.ty = 0; }
    }
    schedule();
  }, { passive: true });
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

  const bind = (id: string, vId: string, fmt: (v: number) => string, apply: (v: number) => void) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    const out = document.getElementById(vId);
    if (!input || !out) return;
    const run = () => { const v = parseFloat(input.value); out.textContent = fmt(v); apply(v); };
    input.addEventListener('input', run);
    run();
  };

  bind('d-pace', 'd-pace-v', (v) => `${v.toFixed(1)}x`, (v) => root.style.setProperty('--enter-dur', `${Math.round(640 / v)}ms`));
  bind('d-stagger', 'd-stagger-v', (v) => `${v}ms`, (v) => root.style.setProperty('--stagger', `${v}ms`));
  bind('d-tally', 'd-tally-v', (v) => `${v}ms`, (v) => (cfg.tallyDur = v));
  bind('d-drift', 'd-drift-v', (v) => `${v}s`, (v) => root.style.setProperty('--drift-dur', `${v}s`));
  bind('d-daylight', 'd-daylight-v', (v) => `${v}%`, (v) => root.style.setProperty('--daylight', String(v / 100)));

  document.getElementById('d-replay')?.addEventListener('click', () => {
    const els = $('.hero .eyebrow, .hero h1 .line-in, .hero .hero-sub, .hero .hero-math, .hero .cta-row, .hero .chip');
    els.forEach((el) => (el.style.animation = 'none'));
    void (document.querySelector('.hero') as El)?.offsetWidth; // reflow so the reset paints
    els.forEach((el) => (el.style.animation = ''));
    $('.hero-math [data-count]').forEach((el) => { delete el.dataset.tallied; });
    window.setTimeout(tallyHero, 300);
  });
}

/* ---- boot ----------------------------------------------------------------- */
function revealAllStatic() {
  // hero + scroll content are visible at rest via CSS; only finalize the numbers
  $('[data-count]').forEach((el) => {
    const t = parseInt(el.getAttribute('data-count') || '', 10);
    if (!isNaN(t) && t !== 0) el.textContent = t.toLocaleString('en-US');
  });
}

function boot() {
  try {
    wireDials();
    try { daylight(); } catch (e) { const c = document.querySelector('.daylight'); if (c) c.remove(); }
    if (reduced) return; // CSS shows everything; numbers already SSR'd
    magnetic();
    wireTally();
    window.setTimeout(tallyHero, 300); // count the hero receipts as they arrive
  } catch (err) {
    revealAllStatic(); // never let a motion bug hide a number
    // eslint-disable-next-line no-console
    console.error('[proto4] motion boot failed, finalized statically:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
