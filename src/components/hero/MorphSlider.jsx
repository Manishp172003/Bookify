import { useEffect, useRef, useState, useCallback } from 'react';
import { Renderer, Triangle, Program, Mesh, Texture } from 'ogl';
import { gsap } from 'gsap';

import './MorphSlider.css';

const TRANSITIONS = { melt: 0, ripple: 1, shear: 2, swirl: 3 };

const DEFAULT_ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=1600&auto=format&fit=crop',
    caption: 'One'
  },
  {
    image: 'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=1600&auto=format&fit=crop',
    caption: 'Two'
  },
  {
    image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=1600&auto=format&fit=crop',
    caption: 'Three'
  },
  {
    image: 'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=1600&auto=format&fit=crop',
    caption: 'Four'
  }
];

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uDir;
uniform int uMode;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform float uReduce;
uniform vec2 uPointer;
uniform vec3 uOverlay;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 coverUV(vec2 uv, vec2 res, vec2 img) {
  float rA = res.x / max(res.y, 1.0);
  float iA = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  float ratio = rA / max(iA, 0.0001);
  if (ratio > 1.0) {
    s.y = 1.0 / ratio;
  } else {
    s.x = ratio;
  }
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);

  vec2 uv = vUv;

  uv += vec2(sin(uTime * 0.25 + uv.y * 4.0), cos(uTime * 0.22 + uv.x * 4.0)) * uDrift * 0.008;
  uv = (uv - 0.5) * (1.0 - uDrift * 0.02 * sin(uTime * 0.4)) + 0.5;

  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uReduce < 0.5) {
    if (uMode == 3) {
      vec2 c = uv - 0.5;
      float r = length(c);
      float ang = env * uIntensity * 3.5 * (1.0 - r);
      uvC = rot(ang) * c + 0.5;
      uvN = rot(-ang) * c + 0.5;
      m = smoothstep(0.0, 1.0, p);
    } else if (uMode == 1) {
      float d = distance(uv, uPointer);
      float ring = p * 1.6;
      float wave = sin((d - ring) * 30.0) * env;
      vec2 dir = normalize(uv - uPointer + 1e-4);
      vec2 disp = dir * wave * uIntensity * 0.25;
      uvC = uv + disp;
      uvN = uv + disp * 0.6;
      m = 1.0 - smoothstep(ring - 0.03, ring + 0.03, d);
    } else if (uMode == 2) {
      float slices = 14.0;
      float row = floor(uv.y * slices);
      float rnd = hash11(row);
      vec2 disp = vec2((rnd - 0.5) * env * uIntensity * 0.6, 0.0);
      uvC = uv + disp;
      uvN = uv + disp;
      float localX = uDir > 0.0 ? uv.x : 1.0 - uv.x;
      float th = p * 1.5 - 0.25 + (rnd - 0.5) * 0.25;
      m = 1.0 - smoothstep(th - 0.06, th + 0.06, localX);
    } else {
      float nn = fbm(uv * uScale + uTime * 0.03);
      float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
      vec2 g = vec2(nn, warp) - 0.5;
      uvC = uv + g * uIntensity * 0.5 * p;
      uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
      m = smoothstep(nn - 0.15, nn + 0.15, p);
    }
  }

  vec2 sC = coverUV(uvC, uResolution, uCurrentSize);
  vec2 sN = coverUV(uvN, uResolution, uNextSize);

  float ca = uReduce < 0.5 ? uAberration * env * 0.03 : 0.0;

  vec3 colC = vec3(
    texture2D(tCurrent, sC + vec2(ca, 0.0)).r,
    texture2D(tCurrent, sC).g,
    texture2D(tCurrent, sC - vec2(ca, 0.0)).b
  );
  vec3 colN = vec3(
    texture2D(tNext, sN + vec2(ca, 0.0)).r,
    texture2D(tNext, sN).g,
    texture2D(tNext, sN - vec2(ca, 0.0)).b
  );

  vec3 col = mix(colC, colN, m);

  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col = mix(col, uOverlay, (1.0 - vig) * 0.28);

  gl_FragColor = vec4(col, 1.0);
}
`;

function makeFallbackTexture(gl) {
  const size = 4;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = 24;
    data[i * 4 + 1] = 24;
    data[i * 4 + 2] = 28;
    data[i * 4 + 3] = 255;
  }
  return new Texture(gl, { image: data, width: size, height: size, generateMipmaps: false });
}

function hexToRgb(hex) {
  let h = (hex || '#000000').replace('#', '');
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

class MorphEngine {
  constructor(container, { items, startIndex, reducedMotion, getOptions, onIndexChange, dprCap }) {
    this.container = container;
    this.items = items;
    this.getOptions = getOptions;
    this.onIndexChange = onIndexChange;
    this.reducedMotion = reducedMotion;

    this.current = startIndex;
    this.animating = false;
    this.dragging = false;
    this.dragDir = 0;
    this.shownIndex = startIndex;
    this.tween = null;

    this.renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, dprCap)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0.05, 0.05, 0.06, 1);

    this.canvas = this.gl.canvas;
    this.canvas.className = 'morph-slider-canvas';
    container.appendChild(this.canvas);

    this.geometry = new Triangle(this.gl);

    this.textures = this.items.map(() => makeFallbackTexture(this.gl));
    this.sizes = this.items.map(() => [1, 1]);

    const opts = this.getOptions();
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tCurrent: { value: this.textures[this.current] },
        tNext: { value: this.textures[this.current] },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: this.sizes[this.current] },
        uNextSize: { value: this.sizes[this.current] },
        uProgress: { value: 0 },
        uDir: { value: 1 },
        uMode: { value: TRANSITIONS[opts.transition] ?? 0 },
        uIntensity: { value: opts.intensity },
        uScale: { value: opts.scale },
        uAberration: { value: opts.aberration },
        uDrift: { value: opts.drift },
        uTime: { value: 0 },
        uReduce: { value: reducedMotion ? 1 : 0 },
        uPointer: { value: [0.5, 0.5] },
        uOverlay: { value: hexToRgb(opts.overlayColor) }
      }
    });

    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program });

    this.boundContextLost = this.onContextLost.bind(this);
    this.canvas.addEventListener('webglcontextlost', this.boundContextLost, false);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    this.loadTextures();

    this.boundLoop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.boundLoop);
  }

  loadTextures() {
    this.items.forEach((item, index) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = item.image;
      img.onload = () => {
        const texture = new Texture(this.gl, { generateMipmaps: false });
        texture.image = img;
        this.textures[index] = t
