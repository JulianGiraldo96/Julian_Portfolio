"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/* Liquid wordmark: the name rendered as a gooey light-gray fluid that smears
   toward the pointer and slowly settles back. Pure WebGL1, no dependencies.
   Decorative only: the wrapper carries role="img" + aria-label, and users with
   prefers-reduced-motion (or without WebGL) get a static text fallback. */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/* Flowmap update: decay previous velocity, add a gaussian splat at the pointer. */
const FLOW_FRAG = `
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uPoint;
uniform vec2 uVel;
uniform float uAspect;
uniform float uDiss;
uniform float uRadius;
varying vec2 vUv;
void main() {
  vec2 v = (texture2D(uPrev, vUv).rg - 0.5) * 2.0;
  v *= uDiss;
  if (length(v) < 0.004) v = vec2(0.0);
  vec2 d = vUv - uPoint;
  d.x *= uAspect;
  v += uVel * exp(-dot(d, d) / uRadius);
  v = clamp(v, -1.0, 1.0);
  gl_FragColor = vec4(v * 0.5 + 0.5, 0.0, 1.0);
}`;

/* Display: displace the text texture by the flowmap, threshold the blurred
   alpha into a gooey shape, shade edges from the alpha gradient. */
const DRAW_FRAG = `
precision highp float;
uniform sampler2D uFlow;
uniform sampler2D uText;
uniform vec2 uTexel;
uniform float uStrength;
varying vec2 vUv;
float field(vec2 uv) { return texture2D(uText, uv).a; }
void main() {
  vec2 flow = (texture2D(uFlow, vUv).rg - 0.5) * 2.0;
  vec2 uv = vUv - flow * uStrength;
  float a = field(uv);
  float goo = smoothstep(0.38, 0.62, a);
  float ax = field(uv + vec2(uTexel.x * 2.0, 0.0)) - field(uv - vec2(uTexel.x * 2.0, 0.0));
  float ay = field(uv + vec2(0.0, uTexel.y * 2.0)) - field(uv - vec2(0.0, uTexel.y * 2.0));
  float shade = clamp((ax + ay) * 1.4, -0.055, 0.055);
  float mag = length(flow);
  vec3 ink = vec3(0.925) + shade - mag * 0.05;
  vec3 col = mix(vec3(1.0), ink, goo);
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

function program(gl: WebGLRenderingContext, frag: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  return p;
}

export function FluidName({ text = "JulianG" }: { text?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();
  const [webglFailed, setWebglFailed] = useState(false);
  const fallback = Boolean(prefersReduced) || webglFailed;

  useEffect(() => {
    if (fallback) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
    });
    if (!gl) {
      const id = requestAnimationFrame(() => setWebglFailed(true));
      return () => cancelAnimationFrame(id);
    }

    const flowProg = program(gl, FLOW_FRAG);
    const drawProg = program(gl, DRAW_FRAG);
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const loc = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const fU = {
      prev: loc(flowProg, "uPrev"),
      point: loc(flowProg, "uPoint"),
      vel: loc(flowProg, "uVel"),
      aspect: loc(flowProg, "uAspect"),
      diss: loc(flowProg, "uDiss"),
      radius: loc(flowProg, "uRadius"),
    };
    const dU = {
      flow: loc(drawProg, "uFlow"),
      text: loc(drawProg, "uText"),
      texel: loc(drawProg, "uTexel"),
      strength: loc(drawProg, "uStrength"),
    };

    const bindQuad = (p: WebGLProgram) => {
      const a = gl.getAttribLocation(p, "aPos");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    };

    let simW = 0;
    let simH = 0;
    let flowTexA: WebGLTexture | null = null;
    let flowTexB: WebGLTexture | null = null;
    let fboA: WebGLFramebuffer | null = null;
    let fboB: WebGLFramebuffer | null = null;
    let textTex: WebGLTexture | null = null;
    let texelX = 0;
    let texelY = 0;

    const makeFlowTex = (w: number, h: number) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      const data = new Uint8Array(w * h * 4);
      for (let i = 0; i < w * h; i++) {
        data[i * 4] = 128;
        data[i * 4 + 1] = 128;
        data[i * 4 + 3] = 255;
      }
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    };

    const makeFbo = (tex: WebGLTexture) => {
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return fbo;
    };

    const drawText = (w: number, h: number) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d")!;
      const family = getComputedStyle(canvas).fontFamily || "sans-serif";
      let size = h * 0.72;
      ctx.font = `700 ${size}px ${family}`;
      const tw = ctx.measureText(text).width;
      const maxW = w * 0.94;
      if (tw > maxW) size *= maxW / tw;
      ctx.font = `700 ${size}px ${family}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      const blur = Math.max(4, size * 0.035);
      if ("filter" in ctx) ctx.filter = `blur(${blur}px)`;
      ctx.fillText(text, w / 2, h / 2);
      ctx.fillText(text, w / 2, h / 2);
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      texelX = 1 / w;
      texelY = 1 / h;
      return tex;
    };

    const rebuild = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      simW = 216;
      simH = Math.max(24, Math.round((simW * rect.height) / rect.width));
      flowTexA = makeFlowTex(simW, simH);
      flowTexB = makeFlowTex(simW, simH);
      fboA = makeFbo(flowTexA);
      fboB = makeFbo(flowTexB);
      textTex = drawText(canvas.width, canvas.height);
    };
    rebuild();

    /* pointer state (uv space, y up) */
    let px = 0.5;
    let py = 0.5;
    let vx = 0;
    let vy = 0;
    let hasPointer = false;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1 - (e.clientY - rect.top) / rect.height;
      if (hasPointer) {
        vx += (nx - px) * 14;
        vy += (ny - py) * 14;
      }
      px = nx;
      py = ny;
      hasPointer = true;
    };
    const onLeave = () => {
      hasPointer = false;
    };
    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave, { passive: true });

    let raf = 0;
    let running = true;
    let start = 0;

    const frame = (t: number) => {
      if (!running || !flowTexA || !flowTexB || !fboA || !fboB || !textTex) {
        raf = requestAnimationFrame(frame);
        return;
      }
      if (!start) start = t;

      /* intro: a virtual pointer sweeps once through the name */
      const intro = (t - start) / 1600;
      let sx = px;
      let sy = py;
      let svx = vx;
      let svy = vy;
      if (intro < 1 && !hasPointer) {
        sx = 0.12 + 0.76 * intro;
        sy = 0.5 + 0.2 * Math.sin(intro * Math.PI * 2);
        svx = 0.35;
        svy = Math.cos(intro * Math.PI * 2) * 0.4;
      }

      const mag = Math.hypot(svx, svy);
      if (mag > 1) {
        svx /= mag;
        svy /= mag;
      }

      gl.useProgram(flowProg);
      bindQuad(flowProg);
      gl.viewport(0, 0, simW, simH);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, flowTexA);
      gl.uniform1i(fU.prev, 0);
      gl.uniform2f(fU.point, sx, sy);
      gl.uniform2f(fU.vel, svx, svy);
      gl.uniform1f(fU.aspect, simW / simH);
      gl.uniform1f(fU.diss, 0.985);
      gl.uniform1f(fU.radius, 0.011);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      [flowTexA, flowTexB] = [flowTexB, flowTexA];
      [fboA, fboB] = [fboB, fboA];
      vx = 0;
      vy = 0;

      gl.useProgram(drawProg);
      bindQuad(drawProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, flowTexA);
      gl.uniform1i(dU.flow, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textTex);
      gl.uniform1i(dU.text, 1);
      gl.uniform2f(dU.texel, texelX, texelY);
      gl.uniform1f(dU.strength, 0.09);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    /* pause off-screen */
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
    });
    io.observe(wrap);

    const ro = new ResizeObserver(() => rebuild());
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [text, fallback]);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={text}
      className="relative h-[30vw] max-h-[420px] min-h-[170px] w-full select-none overflow-hidden"
    >
      {fallback ? (
        // readable gray, not the fluid's near-white: the static version has to
        // carry the name on its own, at 3:1 for large text
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[19vw] font-bold leading-none tracking-[-0.03em] text-[#909096]"
        >
          {text}
        </span>
      ) : (
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
