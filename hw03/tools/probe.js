// Probe 4 man hinh cua Tue tren Chromium that, ghi ket qua JSON + anh vao ../screenshots/_probe
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const CH = process.env.USERPROFILE + '/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const OUT = path.join(__dirname, '..', 'screenshots', '_probe');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:5173';
const res = {};
const R = (k, v) => { res[k] = v; console.log(k, JSON.stringify(v)); };

async function domFacts(page) {
  return page.evaluate(() => {
    const q = (s) => [...document.querySelectorAll(s)];
    return {
      title: document.title,
      lang: document.documentElement.lang,
      h1: q('h1').length,
      h2: q('h2').map((e) => e.textContent.trim()),
      inputs: q('input,textarea,select').map((e) => ({
        type: e.type, label: e.labels && e.labels[0] ? e.labels[0].textContent.trim() : null,
        id: e.id || null, name: e.name || null, ac: e.autocomplete || null, ph: e.placeholder || null,
        req: e.required, disabled: e.disabled, aria: e.getAttribute('aria-label'),
      })),
      buttons: q('button,a[href]').map((e) => e.textContent.trim()),
      ariaLive: q('[aria-live],[role=alert],[role=status]').length,
      scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
    };
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: CH, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const dialogs = [];
  page.on('dialog', async (d) => { dialogs.push(d.message()); await d.accept(); });
  const shot = (n) => page.screenshot({ path: path.join(OUT, n + '.png'), fullPage: true });

  // ---- Register
  await page.goto(BASE + '/register'); await shot('register');
  R('register.dom', await domFacts(page));
  const f = page.locator('input');
  await f.nth(0).fill('Tue Test'); await f.nth(1).fill('probe1@test.com'); await f.nth(2).fill('Test1234!');
  await page.click('button[type=submit]'); await page.waitForTimeout(500);
  R('register.validPwdTest1234!.url', page.url());
  R('register.validPwd.errorText', await page.locator('.bg-red-100').allTextContents());
  await shot('register_valid_pwd_rejected');
  // regex dung khoang trang, khong ky tu dac biet
  await f.nth(2).fill('Test 1234'); await page.click('button[type=submit]'); await page.waitForTimeout(800);
  R('register.pwdWithSpaceNoSpecial.url', page.url());

  // ---- Login
  await page.goto(BASE + '/login'); await shot('login');
  R('login.dom', await domFacts(page));
  const li = page.locator('input');
  await li.nth(1).fill('abc123'); await shot('login_pwd_visible');
  await li.nth(0).fill('test@eshop.com'); await li.nth(1).fill('wrong');
  await page.click('button[type=submit]'); await page.waitForTimeout(500);
  R('login.wrong.err', await page.locator('.bg-red-100').allTextContents());
  R('login.focusOrder', await (async () => {
    await page.goto(BASE + '/login'); const seq = [];
    for (let i = 0; i < 5; i++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(() => document.activeElement.textContent.trim() || document.activeElement.type || document.activeElement.tagName)); }
    return seq;
  })());
  // forgot link full reload?
  await page.goto(BASE + '/login');
  await page.evaluate(() => (window.__marker = 1));
  await page.click('text=Quên mật khẩu?'); await page.waitForTimeout(500);
  R('login.forgotLinkFullReload', await page.evaluate(() => window.__marker !== 1));

  // ---- Forgot
  await page.goto(BASE + '/forgot-password'); await shot('forgot_step1');
  R('forgot1.dom', await domFacts(page));
  await page.locator('input').first().fill('nobody@x.com'); await page.click('button[type=submit]'); await page.waitForTimeout(500);
  R('forgot.unknownEmailDialog', dialogs.slice());
  await page.locator('input').first().fill('test@eshop.com'); await page.click('button[type=submit]'); await page.waitForTimeout(600);
  await shot('forgot_step2'); R('forgot2.dom', await domFacts(page));
  R('forgot2.otpMsg', await page.locator('.bg-green-100').allTextContents());

  // ---- Profile (chua dang nhap)
  await page.goto(BASE + '/profile'); await page.waitForTimeout(400);
  R('profile.anon', await page.locator('main').innerText()); await shot('profile_anon');
  // dang nhap test@eshop.com
  await page.goto(BASE + '/login');
  await page.locator('input').nth(0).fill('test@eshop.com'); await page.locator('input').nth(1).fill('Test1234!');
  await page.click('button[type=submit]'); await page.waitForTimeout(800);
  R('login.ok.url', page.url());
  await page.goto(BASE + '/profile'); await page.waitForTimeout(800); await shot('profile');
  R('profile.dom', await domFacts(page));
  const pi = page.locator('input'); // email,name,phone
  dialogs.length = 0;
  await pi.nth(2).fill('0912345678'); await page.click('button[type=submit]'); await page.waitForTimeout(500);
  R('profile.phone0912345678.dialog', dialogs.slice());
  dialogs.length = 0;
  await pi.nth(2).fill('912345678'); await page.click('button[type=submit]'); await page.waitForTimeout(500);
  R('profile.phone912345678.dialog', dialogs.slice());
  // XSS header
  dialogs.length = 0;
  await pi.nth(1).fill('<img src=x onerror=alert("xss")>'); await page.click('button[type=submit]'); await page.waitForTimeout(500);
  await page.reload(); await page.waitForTimeout(1000);
  R('profile.xssDialogs', dialogs.slice()); await shot('profile_xss');
  await pi.nth(1).fill('Test User').catch(() => {});
  // restore ten
  await page.locator('input').nth(1).fill('Test User'); await page.locator('input').nth(2).fill('912345678');
  await page.click('button[type=submit]').catch(() => {}); await page.waitForTimeout(400);

  // ---- Global: 404, responsive, dark, rtl
  await page.goto(BASE + '/khong-ton-tai'); await page.waitForTimeout(400);
  R('route404.main', await page.locator('main').innerText()); await shot('route404');
  for (const w of [375, 768]) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const p of ['/register', '/login', '/forgot-password', '/profile']) {
      await page.goto(BASE + p); await page.waitForTimeout(300);
      const d = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
      R(`responsive.${w}${p}`, d);
    }
    await page.goto(BASE + '/login'); await shot('login_' + w);
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ colorScheme: 'dark' }); await page.goto(BASE + '/login'); await shot('login_dark');
  R('dark.bg', await page.evaluate(() => getComputedStyle(document.body).backgroundColor));
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(BASE + '/login'); await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl')); await shot('login_rtl');
  // focus visible outline
  await page.goto(BASE + '/login'); await page.keyboard.press('Tab');
  R('focus.outline', await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return { outline: s.outlineStyle + ' ' + s.outlineWidth, shadow: s.boxShadow }; }));
  // contrast cua text-gray-400 hint (#9ca3af tren trang trang) ~2.54:1
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(res, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
