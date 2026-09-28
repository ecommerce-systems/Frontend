import { chromium } from 'playwright';
import path from 'path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT  = 'C:\\Users\\creep\\Documents\\e-commerce-system\\Frontend\\public\\screenshots';
const BASE = 'http://localhost:5174';

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const ctx     = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page    = await ctx.newPage();

const shot = async (url, name, waitMs = 1800) => {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(waitMs);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`✓ ${name}.png`);
};

import { mkdirSync } from 'fs';
mkdirSync(OUT, { recursive: true });

await shot(`${BASE}/`,         'home');
await shot(`${BASE}/auth`,     'auth');
await shot(`${BASE}/products`, 'products', 3000);
await shot(`${BASE}/user`,     'require_auth');

await browser.close();
console.log('done');
