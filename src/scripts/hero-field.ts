// Reactive WebGL name hero — OGL flowmap displacement on "RYAN GARVER" over a
// slow atmosphere flow-noise field. Idle = still (rAF freezes when flow decays
// and the pointer rests). Lazy-imported by motion.ts on the home page only, so
// ogl stays out of the main bundle. Fixed dials = the values approved at the gate.
import { Renderer, Program, Mesh, Triangle, Texture, Flowmap, Vec2 } from 'ogl';

const DIALS = { disp: 0.12, diss: 0.94, tint: 0.55, amb: 0.5 } as const;

let started = false;

export function initHeroField() {
  // Guard: one live field per session; fine-pointer + motion only (DOM name is the fallback).
  if (started) return;
  const fine = matchMedia('(min-width: 860px) and (hover: hover) and (pointer: fine)').matches;
  const motionOK = matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const fieldHost = document.getElementById('hero-field');
  const hero = document.getElementById('hero');
  const heroName = document.getElementById('hero-name');
  if (!fine || !motionOK || !fieldHost || !hero || !heroName) return;
  started = true;

  let renderer: any;
  try { renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: false }); }
  catch { return; }
  const gl = renderer.gl;
  fieldHost.appendChild(gl.canvas);

  Promise.all([(document as any).fonts.load('800 100px Anybody'), (document as any).fonts.ready])
    .catch(() => {})
    .then(build);

  function build() {
    let flowmap = new Flowmap(gl, { falloff: 0.3, dissipation: DIALS.diss, size: 128 });

    const vertex = /* glsl */ `
      attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position, 0, 1); }`;
    const fragment = /* glsl */ `
      precision highp float;
      uniform sampler2D tText; uniform sampler2D tFlow;
      uniform float uTime, uStretch, uDisp, uTint; uniform vec2 uRes;
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p), f=fract(p); float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.)); vec2 u=f*f*(3.-2.*f); return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y; }
      float fbm(vec2 p){ float v=0.,a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }
      void main(){
        vec3 flow = texture2D(tFlow, vUv).rgb;
        vec2 uv = vUv; uv.x = 0.5 + (uv.x-0.5)/(1.0+uStretch); uv -= flow.xy * uDisp;
        vec2 p = vUv * vec2(uRes.x/max(uRes.y,1.0), 1.0);
        float field = fbm(p*2.3 + vec2(uTime*0.018, uTime*0.012) + flow.xy*2.2);
        vec3 ink = vec3(0.055,0.055,0.063), elev = vec3(0.105,0.105,0.12);
        vec3 orange = vec3(0.910,0.294,0.047);
        vec3 bg = mix(ink, elev, smoothstep(0.4,0.85,field)*0.7);
        float veins = smoothstep(0.7,0.96,field);
        bg = mix(bg, orange*0.55, veins*0.12*uTint);
        float a = texture2D(tText, uv).a;
        float f = clamp(length(flow.xy)*1.6,0.0,1.0);
        vec3 nameCol = mix(vec3(0.941,0.929,0.902), orange, f*uTint);
        vec3 col = mix(bg, nameCol, a);
        col += orange * f * uTint * 0.05;
        col += (hash(vUv*913.0 + fract(uTime)*7.0)-0.5)*0.035;
        gl_FragColor = vec4(col,1.0);
      }`;

    const textCanvas = document.createElement('canvas');
    const ctx = textCanvas.getContext('2d')!;
    const texture = new Texture(gl, { generateMipmaps: false });
    function drawText() {
      const rect = hero!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      textCanvas.width = rect.width * dpr; textCanvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = '#F0EDE6'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      heroName!.querySelectorAll('[data-line]').forEach((line) => {
        const el = line as HTMLElement; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        ctx.font = `800 ${parseFloat(cs.fontSize)}px Anybody`;
        try { (ctx as any).fontStretch = 'extra-expanded'; } catch {}
        ctx.fillText(el.textContent || '', r.left - rect.left, r.top - rect.top + r.height / 2);
      });
      texture.image = textCanvas;
    }

    const program = new Program(gl, {
      vertex, fragment,
      uniforms: {
        tText: { value: texture }, tFlow: flowmap.uniform,
        uTime: { value: 0 }, uStretch: { value: 0 }, uDisp: { value: DIALS.disp },
        uTint: { value: DIALS.tint }, uRes: { value: [1, 1] },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    function resize() {
      const rect = hero!.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      flowmap.aspect = rect.width / rect.height;
      program.uniforms.uRes.value = [rect.width, rect.height];
      drawText();
    }
    window.addEventListener('resize', resize); resize();

    const mouse = new Vec2(-1); const velocity: any = new Vec2(); const lastMouse = new Vec2();
    let lastTime: number | null = null; let lastActive = performance.now();
    hero!.addEventListener('pointermove', (e) => {
      const rect = hero!.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      mouse.set(x / rect.width, 1 - y / rect.height);
      if (lastTime === null) { lastTime = performance.now(); lastMouse.set(x, y); }
      const dx = x - lastMouse.x, dy = y - lastMouse.y; lastMouse.set(x, y);
      const now = performance.now(); const delta = Math.max(10, now - lastTime); lastTime = now;
      velocity.x = dx / delta; velocity.y = dy / delta; velocity.needsUpdate = true;
      lastActive = now; wake();
    });

    let running = false; let rafId = 0; const t0 = performance.now();
    function frame(t: number) {
      (window as any).__protoFrames = ((window as any).__protoFrames || 0) + 1;
      if (!velocity.needsUpdate) { mouse.set(-1); velocity.set(0); }
      velocity.needsUpdate = false;
      flowmap.mouse.copy(mouse);
      flowmap.velocity.lerp(velocity, velocity.len() ? 0.5 : 0.1);
      flowmap.update();
      program.uniforms.uTime.value = (t - t0) * 0.001;
      renderer.render({ scene: mesh });
      // idle = still: settle to a frozen frame once flow decays and the pointer rests.
      if (performance.now() - lastActive > 1600) { running = false; return; }
      rafId = requestAnimationFrame(frame);
    }
    function wake() { if (!running) { running = true; rafId = requestAnimationFrame(frame); } }

    new IntersectionObserver((en) => {
      if (en[0].isIntersecting) wake();
      else { cancelAnimationFrame(rafId); running = false; }
    }, { threshold: 0.02 }).observe(hero!);
    wake();
    fieldHost!.classList.add('is-on');
  }
}
