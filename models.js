/* Mathematical models are isolated from the UI for teaching and verification.
   Coordinates: x = propagation, y = up, z = horizontal transverse direction.
   All distances and times in the visualization are pedagogically scaled. */
(function (root) {
  'use strict';
  const TAU = 2 * Math.PI;
  const waterK = TAU / 3.6;
  const waterOmega = 2.1;
  function waterOrbit(depth, amplitude = 1, shallow = false) {
    const a = 0.24 * amplitude;
    if (!shallow) return { ax: a * Math.exp(-waterK * depth), ay: a * Math.exp(-waterK * depth) };
    const h = 0.75;
    const d = Math.max(0, Math.min(h, depth));
    return { ax: a * Math.cosh(waterK * (h - d)) / Math.sinh(waterK * h), ay: a * Math.sinh(waterK * (h - d)) / Math.sinh(waterK * h) };
  }
  function water(x, depth, t, amplitude = 1, shallow = false) {
    const {ax, ay} = waterOrbit(depth, amplitude, shallow);
    const phase = waterK * x - waterOmega * t;
    return { x: x - ax * Math.sin(phase), y: -depth + ay * Math.cos(phase), ux: -ax * Math.sin(phase), uy: ay * Math.cos(phase) };
  }
  function longitudinal(x, t, amplitude = 1, frequency = 0.65) {
    const omega = TAU * frequency, k = omega / 3.6;
    const phase = k * x - omega * t;
    // Keeps |du/dx| < 1 for every exposed slider value, so particles do not cross.
    const a = 0.17 * amplitude;
    return { x: x + a * Math.cos(phase), ux: a * Math.cos(phase), pressure: k * a * Math.sin(phase), phase };
  }
  function spring(x, t, amplitude = 1, type = 'transverse', frequency = 0.65) {
    if (type === 'longitudinal') return { ...longitudinal(x, t, amplitude, frequency), y: 0, uy: 0 };
    const phase = TAU * frequency * (x / 3.6 - t);
    return { x, y: 0.6 * amplitude * Math.cos(phase), ux: 0, uy: 0.6 * amplitude * Math.cos(phase), phase };
  }
  function em(x, t, amplitude = 1) {
    const value = amplitude * Math.sin(1.55 * x - 2.1 * t);
    return { e: [0, value, 0], b: [0, 0, value] };
  }
  const seismicSpeeds = { p: 3.1, s: 1.9, rayleigh: 1.65, love: 1.8 };
  function seismic(type, x, depth, z, t, amplitude = 1) {
    const phase = 2.4 * (x / seismicSpeeds[type] - t);
    const c = Math.cos(phase), s = Math.sin(phase);
    let ux = 0, uy = 0, uz = 0;
    if (type === 'p') ux = 0.30 * amplitude * c;
    if (type === 's') uy = 0.40 * amplitude * c;
    if (type === 'love') uz = 0.48 * amplitude * Math.exp(-depth * 1.25) * c;
    if (type === 'rayleigh') {
      // Near-surface retrograde motion: at the crest velocity points to -x.
      // This is a qualitative decay model, not a full elastic half-space solution.
      const decay = Math.exp(-depth * 1.25);
      ux = 0.28 * amplitude * decay * s;
      uy = 0.42 * amplitude * decay * c;
    }
    return { x: x + ux, y: -depth + uy, z: z + uz, ux, uy, uz };
  }
  const orbitalOmega = 0.9;
  function binary(t) {
    const a = orbitalOmega * t;
    return [{ x: Math.cos(a), y: Math.sin(a) }, { x: -Math.cos(a), y: -Math.sin(a) }];
  }
  function strain(t, amplitude = 1) {
    // Strain has twice the orbital frequency for this circular equal-mass binary.
    return 0.26 * amplitude * Math.sin(2 * orbitalOmega * (t - 1.7));
  }
  function detector(x, y, t, amplitude = 1, polarization = 'plus') {
    const h = strain(t, amplitude);
    return polarization === 'cross' ? {x: x + h * y / 2, y: y + h * x / 2} : {x: x * (1 + h / 2), y: y * (1 - h / 2)};
  }
  const api = { TAU, waterK, waterOmega, waterOrbit, water, longitudinal, spring, em, seismicSpeeds, seismic, orbitalOmega, binary, strain, detector };
  root.WaveModels = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
