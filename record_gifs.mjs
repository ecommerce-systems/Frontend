import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { mkdirSync, rmSync, readdirSync } from 'fs';
import path from 'path';

const EDGE   = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const FFMPEG = 'C:\\Users\\creep\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';
const OUT    = 'C:\\Users\\creep\\Documents\\e-commerce-system\\Frontend\\public\\screenshots';
const BASE   = 'http://localhost:5174';

const FPS = 10;

async function captureGif(name, fn) {
  const TMP = `C:\\Users\\creep\\Documents\\e-commerce-system\\Frontend\\tmp_${name}`;
  mkdirSync(TMP, { recursive: true });

  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  let frameIdx = 0;
  let capturing = true;
  let lastError = null;

  const captureLoop = (async () => {
    while (capturing) {
      const num = String(frameIdx++).padStart(4, '0');
      try {
        await page.screenshot({ path: path.join(TMP, `frame${num}.png`), timeout: 3000 });
      } catch (e) {
        lastError = e.message;
      }
      await new Promise(r => setTimeout(r, 1000 / FPS));
    }
  })();

  await fn(page);
  capturing = false;
  await captureLoop;

  await ctx.close();
  await browser.close();

  const frames = readdirSync(TMP).filter(f => f.endsWith('.png'));
  console.log(`  frames: ${frames.length}, lastError: ${lastError || 'none'}`);

  if (frames.length === 0) {
    rmSync(TMP, { recursive: true, force: true });
    throw new Error(`No frames for ${name}`);
  }

  const gif = path.join(OUT, `${name}.gif`);
  execSync(
    `"${FFMPEG}" -y -framerate ${FPS} -i "${path.join(TMP, 'frame%04d.png')}" -vf "scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" -loop 0 "${gif}"`,
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );
  rmSync(TMP, { recursive: true, force: true });
  console.log(`✓ ${name}.gif`);
}

async function mockProducts(page) {
  await page.route('**/api/products/search/autocomplete**', async route => {
    const url = new URL(route.request().url());
    const kw = url.searchParams.get('keyword') || '';
    const all = ['무선 블루투스 이어폰', '무선 충전패드', '무선 마우스', '스마트워치 SE', '스마트폰 케이스'];
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify(all.filter(s => !kw || s.includes(kw))),
    });
  });
  await page.route('**/api/products/search**', async route => {
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        content: [
          { productId: 1, name: '무선 블루투스 이어폰', price: 59000, imageUrl: null },
          { productId: 2, name: '무선 충전패드',        price: 35000, imageUrl: null },
          { productId: 3, name: '무선 마우스',          price: 42000, imageUrl: null },
          { productId: 4, name: '스마트워치 SE',        price: 199000, imageUrl: null },
          { productId: 5, name: '스마트폰 케이스',      price: 12000, imageUrl: null },
          { productId: 6, name: '노트북 파우치',        price: 29000, imageUrl: null },
        ],
        totalPages: 3, number: 0, totalElements: 18,
      }),
    });
  });
}

// GIF 1: 검색 자동완성
console.log('Recording search.gif...');
await captureGif('search', async (page) => {
  await mockProducts(page);
  await page.goto(`${BASE}/products`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const input = page.locator('input[placeholder*="검색"]');
  await input.click();
  await page.waitForTimeout(500);

  for (const ch of '무선') {
    await input.type(ch, { delay: 350 });
  }
  await page.waitForTimeout(1500);

  const suggestion = page.locator('.suggest-item').first();
  await suggestion.waitFor({ timeout: 3000 }).catch(() => {});
  await suggestion.click().catch(() => {});
  await page.waitForTimeout(1500);
});

// GIF 2: 빠르게 시작하기
console.log('Recording quickstart.gif...');
await captureGif('quickstart', async (page) => {
  // block external fonts to avoid screenshot hang
  await page.route('https://fonts.googleapis.com/**', r => r.abort());
  await page.route('https://fonts.gstatic.com/**', r => r.abort());

  // navigate first so page is ready
  await page.goto(`${BASE}/auth`, { waitUntil: 'networkidle' });

  // setup mocks after page loads
  await page.route('**/api/member/**', async route => {
    const url = route.request().url();
    if (url.includes('login')) {
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'mock-token', refreshToken: 'mock-refresh' }),
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });
  await mockProducts(page);

  await page.waitForTimeout(1000);

  const btn = page.locator('button', { hasText: '빠르게 시작하기' }).first();
  await btn.click();
  await page.waitForTimeout(3000);
});

console.log('done');
