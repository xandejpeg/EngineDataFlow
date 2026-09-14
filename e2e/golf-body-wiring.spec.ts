import { expect, test, type Page } from '@playwright/test';

const fixture = String.raw`async () => {
  const refresh = (await import('/@react-refresh')).default;
  refresh.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => type => type;
  window.__vite_plugin_react_preamble_installed__ = true;
  const React = (await import('/node_modules/.vite/deps/react.js')).default;
  const { createRoot } = (await import('/node_modules/.vite/deps/react-dom_client.js')).default;
  const { Canvas, useFrame } = await import('/node_modules/.vite/deps/@react-three_fiber.js');
  const { OrbitControls } = await import('/node_modules/.vite/deps/@react-three_drei.js');
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const base = '/src/features/courses/lessons/scenes/golf/';
  const { GolfBodyShell } = await import(base + 'GolfBodyShell.tsx');
  const { GolfBodyDetails } = await import(base + 'GolfBodyDetails.tsx');
  const { initialBodyControl, advanceBodyControl } = await import(base + 'golfBodyControl.ts');
  const { initialClock } = await import(base + 'golfPhysics.ts');
  const { initialBrakes } = await import(base + 'golfBrakeHydraulics.ts');
  const { bodyPower } = await import(base + 'golfBodyWiring.ts');
  const bodyControl = { current: initialBodyControl() };
  const clock = { current: initialClock('key') };
  const brakes = { current: initialBrakes() };
  const state = window.bodyFixture = { bodyControl, clock, brakes, frames: 0, ghost: false };
  const element = React.createElement;
  function Probe() { useFrame(() => { state.frames++; }); return null; }
  state.step = seconds => { bodyControl.current = advanceBodyControl(bodyControl.current, bodyPower(clock.current, brakes.current), seconds); };
  state.snapshot = () => {
    state.scene.updateMatrixWorld(true);
    const names = ['golf-hood-motion', 'golf-hatch-motion', 'golf-hatch-details-motion', 'golf-hood-prop', 'golf-hatch-strut-left', 'golf-hatch-strut-right', 'golf-headlamp-left-low', 'golf-headlamp-left-high', 'golf-headlamp-right-low', 'golf-headlamp-right-high', 'golf-front-indicator--1', 'golf-rear-indicator--1', 'golf-front-indicator-1', 'golf-rear-indicator-1', 'golf-high-brake-lamp', 'golf-cabin-light', 'golf-cargo-light', 'golf-body-wiring', 'golf-fixed-rear-quarter-left', 'golf-fixed-rear-quarter-right', 'golf-rear-badge', 'golf-rear-wiper', 'golf-body-door-front-left', 'golf-body-wire-hatch-stop-feed', 'golf-body-wire-hatch-stop-return'];
    return Object.fromEntries(names.map(name => {
      const object = state.scene.getObjectByName(name);
      if (!object) return [name, null];
      const tip = object.getObjectByName('tip-joint');
      const baseJoint = object.getObjectByName('base-joint');
      return [name, { rotation: object.rotation.toArray().slice(0, 3), position: object.getWorldPosition(new THREE.Vector3()).toArray(), intensity: object.intensity ?? object.material?.emissiveIntensity ?? null, visible: object.visible, data: object.userData, tip: tip?.getWorldPosition(new THREE.Vector3()).toArray(), base: baseJoint?.getWorldPosition(new THREE.Vector3()).toArray(), matrix: object.matrixWorld.toArray() }];
    }));
  };
  state.project = (name, hoodSurface = false) => {
    state.scene.updateMatrixWorld(true);
    const object = state.scene.getObjectByName(name);
    let point;
    if (hoodSurface) {
      const mesh = object.children[0].children[0];
      point = new THREE.Vector3().fromBufferAttribute(mesh.geometry.attributes.position, 14 * 17 + 8).applyMatrix4(mesh.matrixWorld);
    } else point = object.getWorldPosition(new THREE.Vector3());
    point.project(state.camera);
    const rect = state.renderer.domElement.getBoundingClientRect();
    return { x: rect.left + (point.x + 1) * rect.width / 2, y: rect.top + (1 - point.y) * rect.height / 2 };
  };
  state.pixels = () => {
    const context = state.renderer.getContext();
    const width = context.drawingBufferWidth; const height = context.drawingBufferHeight;
    const bytes = new Uint8Array(width * height * 4);
    context.readPixels(0, 0, width, height, context.RGBA, context.UNSIGNED_BYTE, bytes);
    let colored = 0; let hash = 0;
    for (let offset = 0; offset < bytes.length; offset += 16) {
      if (Math.max(bytes[offset], bytes[offset + 1], bytes[offset + 2]) - Math.min(bytes[offset], bytes[offset + 1], bytes[offset + 2]) > 25) colored++;
      hash = (Math.imul(hash, 31) + bytes[offset]) | 0;
    }
    return { colored, hash, width, height };
  };
  const root = createRoot(document.getElementById('fixture'));
  const distanceScale = window.innerWidth < 600 ? 1.3 : 0.8;
  state.render = () => root.render(element(Canvas, { dpr: 1, gl: { preserveDrawingBuffer: true }, camera: { position: [4500 * distanceScale, 1050 + 1950 * distanceScale, 1200 - 7700 * distanceScale], near: 10, far: 40000, fov: 45 }, onCreated: ({ scene, camera, gl }) => { state.scene = scene; state.camera = camera; state.renderer = gl; } },
    element('color', { attach: 'background', args: ['#e5eaed'] }),
    element('ambientLight', { intensity: 0.8 }),
    element('directionalLight', { position: [2000, 6000, -4000], intensity: 2 }),
    element(GolfBodyShell, { ghost: state.ghost, bodyControl }),
    element(GolfBodyDetails, { ghost: state.ghost, bodyControl, clock, brakes }),
    element(OrbitControls, { target: [0, 1050, 1200], enableDamping: false }),
    element(Probe)));
  state.render();
}`;

async function snapshot(page: Page) { return page.evaluate('window.bodyFixture.snapshot()'); }
async function change(page: Page, body: Record<string, unknown>, clock: Record<string, unknown> = {}, brakes: Record<string, unknown> = {}) {
  await page.evaluate(`Object.assign(window.bodyFixture.bodyControl.current, ${JSON.stringify(body)}); Object.assign(window.bodyFixture.clock.current, ${JSON.stringify(clock)}); Object.assign(window.bodyFixture.brakes.current, ${JSON.stringify(brakes)});`);
}

test('owned body panels, lights and wiring follow real frame state', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/__body-fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body,#fixture{margin:0;width:100%;height:100%;overflow:hidden}</style></head><body><div id="fixture"></div></body></html>' }));
  await page.goto('/__body-fixture');
  await page.evaluate(`(${fixture})()`);
  await expect.poll(() => page.evaluate('window.bodyFixture.frames'), { timeout: 20000 }).toBeGreaterThan(3);
  const closed = await snapshot(page);
  expect(closed['golf-hood-motion'].rotation[0]).toBe(0);
  expect(closed['golf-hatch-motion'].rotation[0]).toBe(0);
  expect(closed['golf-body-wiring'].visible).toBe(false);
  const initialPixels = await page.evaluate('window.bodyFixture.pixels()');
  expect(initialPixels.colored).toBeGreaterThan(1000);
  await page.screenshot({ path: testInfo.outputPath('body-closed.png') });

  const hoodPoint = await page.evaluate("window.bodyFixture.project('golf-hood-motion', true)");
  await page.mouse.click(hoodPoint.x, hoodPoint.y);
  expect(await page.evaluate('window.bodyFixture.bodyControl.current.hoodTarget')).toBe(0);
  await change(page, { hoodReleased: true });
  await page.mouse.click(hoodPoint.x, hoodPoint.y);
  expect(await page.evaluate('window.bodyFixture.bodyControl.current.hoodTarget')).toBe(1);
  await page.evaluate('window.bodyFixture.step(2)');
  await expect.poll(async () => (await snapshot(page))['golf-hood-motion'].rotation[0], { timeout: 20000 }).toBeCloseTo(1.05);
  await change(page, { prop: true, hatch: 1, lights: 'high', indicator: 'hazard', showWiring: true }, {}, { pedal: 0.7 });
  await expect.poll(async () => (await snapshot(page))['golf-hatch-motion'].rotation[0], { timeout: 20000 }).toBeCloseTo(-1.25);
  const opened = await snapshot(page);
  expect(opened['golf-hatch-details-motion'].matrix).toEqual(opened['golf-hatch-motion'].matrix);
  for (const name of ['golf-hood-prop', 'golf-hatch-strut-left', 'golf-hatch-strut-right']) {
    for (let axis = 0; axis < 3; axis++) {
      expect(opened[name].tip[axis]).toBeCloseTo(opened[name].data.tip[axis], 5);
      expect(opened[name].base[axis]).toBeCloseTo(opened[name].data.base[axis], 5);
    }
  }
  for (const name of ['golf-fixed-rear-quarter-left', 'golf-fixed-rear-quarter-right']) expect(opened[name].matrix).toEqual(closed[name].matrix);
  expect(opened['golf-rear-badge'].position).not.toEqual(closed['golf-rear-badge'].position);
  expect(opened['golf-rear-wiper'].matrix).not.toEqual(closed['golf-rear-wiper'].matrix);
  for (const side of ['left', 'right']) for (const beam of ['low', 'high']) expect(opened[`golf-headlamp-${side}-${beam}`].intensity).toBeGreaterThan(0);
  expect(opened['golf-high-brake-lamp'].intensity).toBeGreaterThan(0);
  expect(opened['golf-cabin-light'].intensity).toBeGreaterThan(0);
  expect(opened['golf-cargo-light'].intensity).toBeGreaterThan(0);
  expect(opened['golf-body-wiring'].visible).toBe(true);
  expect(opened['golf-body-door-front-left'].data.voltage).toBe(12);
  expect(opened['golf-body-wire-hatch-stop-feed'].data.points.at(-1)).toEqual(opened['golf-body-wire-hatch-stop-return'].data.points[0]);
  await page.screenshot({ path: testInfo.outputPath('body-open.png') });

  await change(page, { elapsed: 0 });
  await expect.poll(async () => (await snapshot(page))['golf-front-indicator--1'].data.on).toBe(true);
  for (const name of ['golf-front-indicator--1', 'golf-rear-indicator--1', 'golf-front-indicator-1', 'golf-rear-indicator-1']) expect((await snapshot(page))[name].data.on).toBe(true);
  await change(page, { elapsed: 0.5 });
  await expect.poll(async () => (await snapshot(page))['golf-front-indicator--1'].data.on).toBe(false);
  for (const name of ['golf-front-indicator--1', 'golf-rear-indicator--1', 'golf-front-indicator-1', 'golf-rear-indicator-1']) expect((await snapshot(page))[name].data.on).toBe(false);
  await change(page, { fault: 'left-lamp-open' });
  await expect.poll(async () => (await snapshot(page))['golf-headlamp-left-high'].intensity).toBe(0);
  expect((await snapshot(page))['golf-headlamp-left-low'].intensity).toBe(0);
  expect((await snapshot(page))['golf-headlamp-right-high'].intensity).toBeGreaterThan(0);
  await change(page, { fault: 'lighting-fuse' });
  await expect.poll(async () => (await snapshot(page))['golf-headlamp-right-high'].intensity).toBe(0);
  expect((await snapshot(page))['golf-high-brake-lamp'].intensity).toBe(0);
  expect((await snapshot(page))['golf-cargo-light'].intensity).toBeGreaterThan(0);
  await change(page, { fault: 'comfort-fuse' });
  await expect.poll(async () => (await snapshot(page))['golf-cargo-light'].intensity).toBe(0);
  expect((await snapshot(page))['golf-headlamp-right-high'].intensity).toBeGreaterThan(0);
  await change(page, { fault: 'none' }, { openFuse: 'main' });
  await expect.poll(async () => (await snapshot(page))['golf-headlamp-right-high'].intensity).toBe(0);
  expect((await snapshot(page))['golf-body-door-front-left'].data.voltage).toBe(0);

  await change(page, { lights: 'off', hatch: 0, prop: false, hood: 0, indicator: 'off', showWiring: true }, { openFuse: null }, { pedal: 0 });
  await page.evaluate('window.bodyFixture.ghost = true; window.bodyFixture.render()');
  await expect.poll(async () => (await snapshot(page))['golf-hood-motion'].rotation[0]).toBe(0);
  const ghostPixels = await page.evaluate('window.bodyFixture.pixels()');
  expect(ghostPixels.colored).toBeGreaterThan(200);
  expect(ghostPixels.hash).not.toBe(initialPixels.hash);
  await page.screenshot({ path: testInfo.outputPath('body-wiring-ghost.png') });
  const viewport = page.viewportSize()!;
  const beforeOrbit = await page.evaluate('window.bodyFixture.camera.position.toArray()');
  await page.mouse.move(viewport.width * 0.5, viewport.height * 0.65);
  await page.mouse.down();
  await page.mouse.move(viewport.width * 0.7, viewport.height * 0.65, { steps: 8 });
  await page.mouse.up();
  expect(await page.evaluate('window.bodyFixture.camera.position.toArray()')).not.toEqual(beforeOrbit);
  expect(errors).toEqual([]);
});