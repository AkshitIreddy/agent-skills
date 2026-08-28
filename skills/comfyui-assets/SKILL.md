---
name: comfyui-assets
description: Generate game/app art assets locally with ComfyUI and SDXL — seamless tileable textures, transparent-background cutouts, ornament stamps, wallpaper patterns. Use when producing material textures or sprite elements for a rendering pipeline, or when asked to create art assets with a local image model.
---

# Generating assets with a local ComfyUI

Drive ComfyUI through its HTTP API. You do not need a plugin or MCP server — there are three endpoints.

## Talking to it

ComfyUI listens on `127.0.0.1:8188` by default. Start it headless from its venv:

```
python main.py --listen 127.0.0.1 --port 8188
```

The API takes a **workflow in "API format"** — a flat object of node-id → `{class_type, inputs}`. Export it from the UI with *Workflow → Export (API)*, or hand-author it; it is plain JSON.

```js
// queue
const { prompt_id } = await (await fetch('http://127.0.0.1:8188/prompt', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ prompt: workflow, client_id: clientId }),
})).json();

// poll until it appears in history
let out;
while (!out) {
  const hist = await (await fetch(`http://127.0.0.1:8188/history/${prompt_id}`)).json();
  out = hist[prompt_id];
  if (!out) await new Promise((r) => setTimeout(r, 700));
}

// fetch the produced files
for (const node of Object.values(out.outputs)) {
  for (const img of node.images ?? []) {
    const url = `http://127.0.0.1:8188/view?filename=${encodeURIComponent(img.filename)}`
      + `&subfolder=${encodeURIComponent(img.subfolder)}&type=${img.type}`;
    // save the bytes
  }
}
```

Batch by looping the queue call with a different seed/prompt each time — ComfyUI queues them and works through the list. Keep a modest concurrency (queue depth of a few) rather than firing hundreds at once.

## Model choice

For **stylised** assets (illustration, painterly, game art), prefer **SDXL**: seconds per image, the deepest LoRA/ControlNet ecosystem. Reserve FLUX for when prompt adherence or legible text really matters — quantised it is roughly an order of magnitude slower per image, which dominates when you are generating and re-rolling a large library.

VRAM guide: SDXL ~8GB, FLUX fp8 ~12GB, FLUX GGUF Q4/Q5 ~6–8GB.

## Seamless tiling

Use **circular padding** in the sampler (ComfyUI: a "seamless"/tiling option or the `CircularVAEDecode`-style nodes; several tiling custom nodes expose it). Do **not** fake it by mirroring — mirrored tiles read as obviously symmetrical.

Verify by compositing the result 3×3 and looking for a seam or an obvious repetition rhythm. Reject and re-roll rather than shipping a tile with a visible join.

Prompt hygiene for tiles: say *seamless tileable texture*, *top-down*, *flat even lighting*, *no shadows*, *no objects*. Negative-prompt vignettes, borders, frames and watermarks — models love adding them and they destroy tiling.

## Flat lighting is a hard rule

If the asset will be lit at runtime (any real-time shader, normal-mapped surface, or scene light), generate it **unlit**: flat even illumination, no baked highlight, no drop shadow. Baked lighting fights the scene light and instantly reads as pasted-on. Say so in the prompt and negative-prompt "dramatic lighting, shadows, highlights, rim light".

## Cutouts with alpha

Generate the subject centred on a plain flat background (pure white or chroma green), then remove it. `rembg` is the pragmatic choice; for hard cases use SAM-based segmentation. Afterwards: trim to the alpha bounding box, and check edges for a halo of the old background colour — despill or erode a pixel if present.

Generate several rotations/variants of anything that will be scattered, or cloning becomes visible.

## Style coherence across a library

- Hold a **constant style suffix** in every prompt (medium, palette, lighting, edge quality) and vary only the subject.
- Keep the **same model, sampler, steps and CFG** for the whole library.
- Vary seeds, not settings — settings drift shows up as a foreign-looking asset.
- Save the workflow JSON and prompts next to the output so any asset can be reproduced or re-rolled.

## Quality gate before anything ships

1. Tiles seamlessly (3×3 check) — if applicable.
2. No baked lighting.
3. Sits beside its siblings without looking foreign.
4. Sensible file weight (downscale, webp, trim alpha).
5. Real value range — not mid-tone mush, since lighting sculpts from this base.

**Look at every asset.** Generation is cheap and lossy in quality terms; the gate is your eye, not the prompt.

## If you want a full toolkit instead

`artokun/comfyui-mcp` (MIT, actively maintained) ships an MCP server plus Claude Code plugin with a large tool surface and model-specific skills — install with `/plugin marketplace add artokun/comfyui-mcp` then `/plugin install comfy`. It runs third-party code locally, so treat it as a deliberate choice; for a fixed, repeated workflow the three endpoints above are usually enough.
