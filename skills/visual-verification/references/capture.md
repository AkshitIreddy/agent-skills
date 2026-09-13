# Capture examples

Use an available image-viewing tool to inspect captures.


Prefer an existing harness in the project. Otherwise adapt this Playwright
example with the app URL and a selector for the changed surface. Add software
WebGL flags only when needed by the renderer and label that environment.

```js
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
try {
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('[err]', m.text()); });
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.locator(targetSelector).waitFor({ state: 'visible' });
// Also await the app's relevant data/render readiness condition when needed.
await page.screenshot({ path: 'shot.png' });                    // whole viewport
await page.locator(targetSelector).screenshot({ path: 'detail.png' });
} finally {
  await browser.close();
}
```

Software rendering and background scheduling may alter frame cadence. Poll
for readiness rather than sleeping a fixed time. If the project has a degraded
headless path, distinguish that output from its normal renderer; use existing
renderer controls for diagnosis when appropriate.

For procedural/generated art (textures, icons, charts, sprites), render a **specimen board**: many variants in a grid, in one image, so you can judge variety and consistency at a glance.
