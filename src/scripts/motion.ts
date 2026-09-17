/* ============================================================================
   motion.ts - Open Book sitewide runtime. Zero external libraries (CSP blocks
   third-party origins): rAF count-up, IntersectionObserver reveal-tally, vanilla
   WebGL2 daylight, magnetic CTAs, and the buyer-computed estimator. All motion is
   ADDITIVE over a fully readable base - the hero entrance is CSS-only, so a module
   failure never blanks it, and no-JS / reduced-motion show every block and every
   real number in place. Authority: docs/design/open-book-handoff.md (+ s0 addendum).
   ============================================================================ */

type El = HTMLElement;

const root = document.documentElement;
const reduced =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches || root.hasAttribute('data-reduce');

const $ = <T extends Element = El>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));

/* ---- count-up tally (real value already in the markup) --------------------
   Any [data-count] element tots UP like a ledger column when it enters view -
   never a digit-noise scramble (off-brand). data-count holds the real target;
   $0 / 0 stays literal (target 0 returns early). */
function tally(el: El) {
  const target = parseInt(el.getAttribute('data-count') || '', 10);
  if (isNaN(target) || el.dataset.tallied) return;
  el.dataset.tallied = '1';
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  if (target === 0 || reduced) { el.textContent = prefix + target.toLocaleString('en-US') + suffix; return; }
  const dur = 900;
  let t0: number | null = null;
  const step = (t: number) => {
    if (t0 === null) t0 = t;
    const p = Math.min((t - t0) / dur, 1);
    const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
    el.textContent = prefix + v.toLocaleString('en-US') + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = prefix + target.toLocaleString('en-US') + suffix;
  };
  el.textContent = prefix + '0' + suffix;
  requestAnimationFrame(step);
}
function wireTally() {
  const nums = $('[data-count]');
  if (!nums.length) return;
  if (reduced || !('IntersectionObserver' in window)) { nums.forEach(tally); return; }
  const io = new IntersectionObserver(
    (entries, obs) => entries.forEach((e) => { if (e.isIntersecting) { tally(e.target as El); obs.unobserve(e.target); } }),
    { rootMargin: '0px 0px -10% 0px', threshold: 0.4 }
  );
  nums.forEach((n) => io.observe(n));
}

/* ---- buyer-computed estimator: the ONE poster-scale figure (addendum s0.D) --
   Every input is the buyer's; nothing here is our estimate. no-JS shows the
   static worked example instead (never a bare asserted number). */
function estimator() {
  const box = document.querySelector('[data-estimator]') as El | null;
  if (!box) return;
  const live = box.querySelector<El>('[data-est-live]');
  const stat = box.querySelector<El>('[data-est-static]');
  const out = box.querySelector<El>('[data-est-out]');
  const calls = box.querySelector<HTMLInputElement>('#est-calls');
  const value = box.querySelector<HTMLInputElement>('#est-value');
  const real = box.querySelector<HTMLInputElement>('#est-real');
  if (!live || !out || !calls || !value || !real) return;
  if (stat) stat.hidden = true;
  live.hidden = false;
  const n = (el: HTMLInputElement) => { const v = parseFloat(el.value); return isFinite(v) && v >= 0 ? v : 0; };
  const compute = () => {
    const monthly = n(calls) * 4.33 * (Math.min(n(real), 10) / 10) * n(value);
    out.textContent = '$' + Math.round(monthly).toLocaleString('en-US');
  };
  [calls, value, real].forEach((el) => el.addEventListener('input', compute));
  compute();
}

/* ---- living daylight: ONE vanilla-WebGL2 sun-patch (warm, never neon) ------
   DPR clamp, 30fps throttle, pause off-screen + hidden tab, and every failure
   path removes the canvas so the flat --sun fill stands. Reduced motion: removed.
   The context is alpha:true so a GL that links but never rasterizes (software
   renderers, flaky drivers) composites as TRANSPARENT and the warm --sun fill
   shows through - never an opaque-black clear. On success the shader is opaque. */
function daylight() {
  const canvas = document.querySelector('.daylight') as HTMLCanvasElement | null;
  (window as any).__daylight = { mode: 'none', frames: 0 };
  if (!canvas) return;
  if (reduced) { canvas.remove(); (window as any).__daylight.mode = 'reduced-static'; return; }
  // Full-page living light is desktop-only: a fixed, continuously-repainting layer is the
  // known iOS momentum-scroll jank. Touch/coarse keeps the static .sky gradient.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    canvas.remove(); (window as any).__daylight.mode = 'touch-static'; return;
  }

  let gl: WebGL2RenderingContext | null = null;
  try { gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true }); } catch (e) { gl = null; }
  if (!gl) { canvas.remove(); (window as any).__daylight.mode = 'static-fallback'; return; }

  const VS = `#version 300 es
  precision highp float; const vec2 P[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
  void main(){ gl_Position = vec4(P[gl_VertexID],0.,1.); }`;
  // The daylight JOURNEYS with scroll (uniform S, 0..1 over doc height): a warm sun glow
  // that crosses from dawn (top-right) to a high wide wash to a settled low gold, over a
  // LIGHT warm ground so text contrast holds. Stays in the ground/sun/amber family: no new
  // hues, no blue night, no aurora mesh (the project OFF-TABLE list).
  const FS = `#version 300 es
  precision highp float; out vec4 o; uniform vec2 R; uniform float T; uniform float S;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),u.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x), u.y); }
  float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.02; a*=.5; } return v; }
  void main(){
    vec2 uv = gl_FragCoord.xy / R; float ar = R.x / R.y; vec2 q = uv * vec2(ar, 1.);
    float f = fbm(q*1.7 + vec2(T*.018, -T*.012) + fbm(q*3.0 - T*.01));
    vec3 base = vec3(0.988, 0.973, 0.945);
    vec2 sunA = vec2(0.84, 0.90), sunB = vec2(0.60, 0.82), sunC = vec2(0.34, 0.24);
    vec2 sun = mix(mix(sunA, sunB, smoothstep(0.0,0.5,S)), mix(sunB, sunC, smoothstep(0.5,1.0,S)), step(0.5,S));
    float rad = mix(0.5, 0.95, S);
    float glow = smoothstep(rad, 0.0, distance(q, sun * vec2(ar,1.)));
    vec3 dawn = vec3(1.000,0.858,0.772), day = vec3(1.000,0.914,0.796), gold = vec3(1.000,0.859,0.639);
    vec3 g = mix(mix(dawn, day, smoothstep(0.0,0.5,S)), mix(day, gold, smoothstep(0.5,1.0,S)), step(0.5,S));
    vec3 c = mix(base, g, glow * (0.55 + 0.35*f));
    c = mix(c, vec3(1.0,0.94,0.86), f*0.05);
    o = vec4(c, 1.0);
  }`;
  const sh = (type: number, src: string) => { const s = gl!.createShader(type)!; gl!.shaderSource(s, src); gl!.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); (window as any).__daylight.mode = 'link-fail-static'; return; }
  gl.useProgram(prog);
  const uR = gl.getUniformLocation(prog, 'R'), uT = gl.getUniformLocation(prog, 'T'), uS = gl.getUniformLocation(prog, 'S');

  const DPR = Math.min(window.devicePixelRatio || 1, 1.5), RES = 0.75; // low-frequency glow: CSS upscales, halves fill
  const size = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * DPR * RES));
    const hgt = Math.max(1, Math.round(canvas.clientHeight * DPR * RES));
    if (canvas.width !== w || canvas.height !== hgt) { canvas.width = w; canvas.height = hgt; gl!.viewport(0, 0, w, hgt); }
  };
  // scroll progress: passive cache, read by the EXISTING rAF (no second ticker). range
  // recomputed on resize + once after fonts/layout settle (the page grows post-load).
  let sy = window.scrollY;
  let range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const recomputeRange = () => { range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
  window.addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });
  window.addEventListener('resize', () => { size(); recomputeRange(); }, { passive: true });
  setTimeout(recomputeRange, 1200);
  const draw = (t: number) => {
    size();
    gl!.uniform2f(uR, canvas.width, canvas.height);
    gl!.uniform1f(uT, t / 1000);
    gl!.uniform1f(uS, Math.min(sy / range, 1));
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    (window as any).__daylight.frames++;
  };
  size();
  draw(0);
  (window as any).__daylight.mode = 'animated';
  root.classList.add('gl');

  let raf: number | null = null, last = 0;
  const THROTTLE = 1000 / 30;
  const loop = (t: number) => {
    raf = null;
    if (document.hidden) return;
    if (t - last >= THROTTLE) { last = t; draw(t); }
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(loop); };
  document.addEventListener('visibilitychange', start);
  start();
}

/* ---- magnetic CTAs (pointer:fine only; off under reduced motion) ----------- */
function magnetic() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduced || !fine) return;
  const btns = $('[data-magnetic]').map((el) => ({ el, tx: 0, ty: 0, x: 0, y: 0 }));
  if (!btns.length) return;
  const R = 130, S = 0.22;
  let raf: number | null = null;
  const tick = () => {
    raf = null;
    let moving = false;
    for (const b of btns) {
      b.x += (b.tx - b.x) * 0.18; b.y += (b.ty - b.y) * 0.18;
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
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < R) { b.tx = dx * S; b.ty = dy * S; } else { b.tx = 0; b.ty = 0; }
    }
    schedule();
  }, { passive: true });
}

/* ---- intake: progressive enhancement over a plain mailto link -------------
   No-JS: the anchor is already a working mailto (subject prefilled). With JS:
   validate the 3 fields, then compose the body from what the buyer typed. A
   navigation (location via href), never a form POST - CSP form-action forbids
   a mailto form; the real Worker POST is wired at the machinery gate. */
function intake() {
  const form = document.querySelector('[data-intake]') as El | null;
  if (!form) return;
  const btn = form.querySelector<HTMLAnchorElement>('[data-intake-submit]');
  const name = form.querySelector<HTMLInputElement>('#f-name');
  const email = form.querySelector<HTMLInputElement>('#f-email');
  const slow = form.querySelector<HTMLInputElement>('#f-slow');
  if (!btn || !name || !email) return;
  const base = btn.getAttribute('href') || '';
  const mailto = base.split('?')[0]; // mailto:<address>
  const setErr = (el: HTMLInputElement, on: boolean) => el.closest('.field')?.toggleAttribute('data-error', on);
  btn.addEventListener('click', (e) => {
    let ok = true;
    if (!name.value.trim()) { setErr(name, true); ok = false; } else setErr(name, false);
    const emailOk = /.+@.+\..+/.test(email.value.trim());
    if (!emailOk) { setErr(email, true); ok = false; } else setErr(email, false);
    if (!ok) { e.preventDefault(); (name.value.trim() ? email : name).focus(); return; }
    const subject = 'What is slow in my business';
    const body =
      `Name: ${name.value.trim()}\n` +
      `Email: ${email.value.trim()}\n` +
      `What is slow: ${(slow && slow.value.trim()) || '(I will explain)'}\n` +
      storedUtmLine();
    btn.setAttribute('href', `${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  });
}

/* ---- UTM capture: first-party, session-only, no cookie. Reads campaign tags on
   landing so a lead's own email carries its source; nothing is sent until the
   visitor sends their message. Cloudflare Web Analytics does not do UTM. */
const UTM_KEY = 'gsai_utm';
function captureUtm() {
  try {
    const p = new URLSearchParams(location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    if (!keys.some((k) => p.has(k))) return;
    const utm: Record<string, string> = {};
    keys.forEach((k) => { const v = p.get(k); if (v) utm[k] = v; });
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  } catch (e) { /* private mode / storage disabled: skip silently */ }
}
function storedUtmLine(): string {
  try {
    const utm = JSON.parse(sessionStorage.getItem(UTM_KEY) || '{}') as Record<string, string>;
    const entries = Object.entries(utm);
    return entries.length ? `Source: ${entries.map(([k, v]) => `${k}=${v}`).join(', ')}\n` : '';
  } catch (e) { return ''; }
}

/* ---- back-to-top: shows only past ~1 viewport (self-gating to long pages).
   Passive + rAF-throttled boolean toggle, not per-frame animation. The scroll is
   the native #top anchor, which honors prefers-reduced-motion via scroll-behavior. */
function backToTop() {
  const btn = document.querySelector('.to-top') as El | null;
  if (!btn) return;
  const top = document.getElementById('top');
  let ticking = false;
  const update = () => { ticking = false; btn.classList.toggle('is-in', window.scrollY > window.innerHeight); };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  btn.addEventListener('click', () => { if (top) requestAnimationFrame(() => (top as HTMLElement).focus()); });
}

/* ---- condensed header (mobile): past ~96px the sticky header collapses to a slim
   brand + "Menu" bar so it stops eating a third of the screen; tapping Menu drops the
   nav + CTAs back in, scrolling dismisses it, and returning near the top restores the
   full header. Same contract as backToTop: passive + rAF-throttled boolean class toggle,
   never a per-frame scroll-scrub (the iOS momentum-scroll lesson). All show/hide is CSS
   (<=640 + html.js), so this runs fine under reduced motion, and no-JS simply never
   condenses (the full header stays). Hysteresis (96 enter / 24 exit) kills top-edge flicker. */
function condenseHeader() {
  const bar = document.querySelector('.topbar') as El | null;
  if (!bar) return;
  const toggle = bar.querySelector('.topbar__toggle') as El | null;
  const ENTER = 96, EXIT = 24;
  let ticking = false;
  const close = () => {
    if (!bar.classList.contains('is-open')) return;
    bar.classList.remove('is-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; }
  };
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    if (!bar.classList.contains('is-condensed')) { if (y > ENTER) bar.classList.add('is-condensed'); }
    else if (y < EXIT) { bar.classList.remove('is-condensed'); close(); }
  };
  window.addEventListener('scroll', () => {
    close(); // scrolling dismisses an open menu
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  if (toggle) toggle.addEventListener('click', () => {
    const open = bar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  update();
}

/* ---- copy-to-clipboard: progressive enhancement on [data-copy]. Hidden until we
   confirm the Clipboard API exists (secure context), so no dead button appears.
   Success is announced via an aria-live [data-copy-status] region for screen readers. */
function copyToClipboard() {
  if (!navigator.clipboard) return;
  const live = document.querySelector('[data-copy-status]');
  $('[data-copy]').forEach((el) => {
    el.classList.add('copy-enabled');
    el.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(el.getAttribute('data-copy') || '');
        const prev = el.textContent;
        el.textContent = 'Copied';
        if (live) live.textContent = 'Email address copied';
        setTimeout(() => { el.textContent = prev; if (live) live.textContent = ''; }, 2000);
      } catch (e) { /* clipboard blocked: the mailto link still works */ }
    });
  });
}

/* ---- chapter rail: highlight the section the reader is in (wayfinding). IO-driven;
   sets .is-active + aria-current on the matching rail link. No-op if the rail is absent
   (home only) or IO is unsupported. Works under reduced motion too (it is not motion). */
function chapterRail() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-rail]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const pairs: { sec: Element; link: HTMLAnchorElement }[] = []; // document order
  links.forEach((a) => {
    const id = a.getAttribute('href')?.slice(1);
    const sec = id ? document.getElementById(id) : null;
    if (sec) pairs.push({ sec, link: a });
  });
  if (!pairs.length) return;
  const inBand = new Set<Element>();
  const render = () => {
    // active = the topmost section in the center band; none if we are above/below all of them
    const active = pairs.find((p) => inBand.has(p.sec))?.link || null;
    links.forEach((l) => {
      const on = l === active;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? inBand.add(e.target) : inBand.delete(e.target)));
      render();
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  );
  pairs.forEach((p) => io.observe(p.sec));
}

/* ---- boot ----------------------------------------------------------------- */
function revealAllStatic() {
  $('[data-count]').forEach((el) => {
    const t = parseInt(el.getAttribute('data-count') || '', 10);
    if (!isNaN(t)) {
      const prefix = el.getAttribute('data-prefix') || '', suffix = el.getAttribute('data-suffix') || '';
      el.textContent = prefix + t.toLocaleString('en-US') + suffix;
    }
  });
}

function boot() {
  try {
    try { daylight(); } catch (e) { const c = document.querySelector('.daylight'); if (c) c.remove(); }
    estimator();
    captureUtm();
    intake();
    backToTop();
    condenseHeader();
    copyToClipboard();
    chapterRail();
    if (reduced) { revealAllStatic(); return; }
    magnetic();
    wireTally();
  } catch (err) {
    revealAllStatic();
    // eslint-disable-next-line no-console
    console.error('[motion] boot failed, finalized statically:', err);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
