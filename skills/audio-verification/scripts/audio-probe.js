// Audio measurement harness — renders a Web Audio graph offline and turns it
// into numbers you can reason about without hearing it.
//
// This is a CLASSIC script (no import/export) so it can be pasted straight into
// page.evaluate(), a browser-MCP javascript_tool call, or a devtools console.
// Evaluating it defines globalThis.AudioProbe.
//
//   AudioProbe.render(build, {seconds, sampleRate}) -> {samples, sampleRate}
//   AudioProbe.metrics(samples, sampleRate)         -> {peak, flatness, ...}
//   AudioProbe.measure(build, opts)                 -> metrics (render + measure)
//   AudioProbe.compare(labelledBuilds, opts)        -> metrics per variant
//
// `build` receives (ctx, destination) and must wire its nodes to destination
// and start them. Anything you can build in a live AudioContext works here.

(function () {
  /** Render a graph offline. Deterministic and far faster than real time. */
  async function render(build, opts) {
    opts = opts || {};
    const sampleRate = opts.sampleRate || 48000;
    const seconds = opts.seconds || 1;
    const ctx = new OfflineAudioContext(1, Math.ceil(sampleRate * seconds), sampleRate);
    await build(ctx, ctx.destination);
    const buf = await ctx.startRendering();
    return { samples: buf.getChannelData(0), sampleRate };
  }

  /**
   * Power at one frequency (Goertzel). Cheaper than a full FFT and plenty for
   * a couple dozen bands, which is all the resolution these judgements need.
   */
  function bandPower(samples, freq, sampleRate) {
    const k = 2 * Math.cos((2 * Math.PI * freq) / sampleRate);
    let s1 = 0;
    let s2 = 0;
    for (let i = 0; i < samples.length; i++) {
      const s0 = samples[i] + k * s1 - s2;
      s2 = s1;
      s1 = s0;
    }
    return Math.max(s1 * s1 + s2 * s2 - k * s1 * s2, 1e-20);
  }

  function logBands(lo, hi, n) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(lo * Math.pow(hi / lo, i / (n - 1)));
    return out;
  }

  function metrics(samples, sampleRate, opts) {
    opts = opts || {};
    const loHz = opts.loHz || 150;
    const hiHz = opts.hiHz || 8000;
    const nBands = opts.bands || 28;
    const hissAboveHz = opts.hissAboveHz || 5000;

    let peak = 0;
    let sumSq = 0;
    let clipped = 0;
    for (let i = 0; i < samples.length; i++) {
      const a = Math.abs(samples[i]);
      if (a > peak) peak = a;
      if (a >= 0.999) clipped++;
      sumSq += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sumSq / samples.length);

    // Spectral shape over the portion that actually contains sound.
    const bands = logBands(loHz, hiHz, nBands);
    const energy = bands.map((f) => bandPower(samples, f, sampleRate));
    const total = energy.reduce((a, e) => a + e, 0);
    const logMean = energy.reduce((a, e) => a + Math.log(e), 0) / energy.length;
    // Flatness: geometric/arithmetic mean of band energies. 1.0 is white noise
    // (every band equally loud); a tone or a filtered sweep sits far below.
    const flatness = Math.exp(logMean) / (total / energy.length);
    const hissShare = energy.reduce((a, e, i) => a + (bands[i] >= hissAboveHz ? e : 0), 0) / total;
    const centroidHz = bands.reduce((a, f, i) => a + f * energy[i], 0) / total;

    // Onset shape: a cue that jumps straight to full amplitude ticks/pops.
    const floor = peak * 0.01;
    let startIdx = 0;
    while (startIdx < samples.length && Math.abs(samples[startIdx]) < floor) startIdx++;
    let riseIdx = startIdx;
    while (riseIdx < samples.length && Math.abs(samples[riseIdx]) < peak * 0.9) riseIdx++;
    const attackMs = ((riseIdx - startIdx) / sampleRate) * 1000;
    // How much of full level lands inside the first millisecond. Measure the
    // envelope over a window, not one sample — an oscillator starting at zero
    // phase reads ~0 on its first sample no matter how abrupt the cue is.
    let onsetPeak = 0;
    const onsetEnd = Math.min(startIdx + Math.floor(sampleRate * 0.001), samples.length);
    for (let i = startIdx; i < onsetEnd; i++) onsetPeak = Math.max(onsetPeak, Math.abs(samples[i]));
    const onsetRatio = peak > 0 ? onsetPeak / peak : 0;

    // Tail: a cue chopped off before it decays clicks on release.
    const tailN = Math.min(Math.floor(sampleRate * 0.01), samples.length);
    let tailSq = 0;
    let lastIdx = samples.length - 1;
    while (lastIdx > 0 && Math.abs(samples[lastIdx]) < floor) lastIdx--;
    for (let i = Math.max(0, lastIdx - tailN); i <= lastIdx; i++) tailSq += samples[i] * samples[i];
    const tailRms = Math.sqrt(tailSq / Math.max(tailN, 1));

    return {
      silent: peak < 1e-6,
      peak: +peak.toFixed(5),
      rms: +rms.toFixed(6),
      clippedSamples: clipped,
      flatness: +flatness.toFixed(3),
      hissShare: +hissShare.toFixed(3),
      centroidHz: Math.round(centroidHz),
      attackMs: +attackMs.toFixed(1),
      onsetRatio: +onsetRatio.toFixed(3),
      tailRms: +tailRms.toFixed(6),
      soundingMs: +(((lastIdx - startIdx) / sampleRate) * 1000).toFixed(1),
    };
  }

  async function measure(build, opts) {
    const r = await render(build, opts);
    return metrics(r.samples, r.sampleRate, opts);
  }

  /**
   * Measure several variants under identical conditions. Pass an object or an
   * array of {label, build} — the point is always relative: "is this one less
   * noisy / louder / clickier than that one", not an absolute score.
   */
  async function compare(variants, opts) {
    const list = Array.isArray(variants)
      ? variants
      : Object.keys(variants).map((label) => ({ label, build: variants[label] }));
    const out = {};
    for (const v of list) out[v.label] = await measure(v.build, opts);
    return out;
  }

  globalThis.AudioProbe = { render, metrics, measure, compare, bandPower };
})();
