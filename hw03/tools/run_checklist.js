// Chay checklist (76 muc) tren Chromium that, ghi ket qua + anh Fail.
// Cach dung: node run_checklist.js   (backend 3000, frontend 5173 dang chay, DB da reset)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CH = process.env.USERPROFILE + '/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5173';
const API = 'http://localhost:3000/api';
const SHOTS = path.join(__dirname, '..', 'eshop-sut', 'hw03', 'screenshots');
const OUT = path.join(__dirname, 'checklist_results.json');
fs.mkdirSync(SHOTS, { recursive: true });

const R = {};
const rec = (id, pass, note, shot) => { R[id] = { r: pass ? 'Pass' : 'Fail', n: note, s: shot || null }; console.log(id, pass ? 'Pass' : 'FAIL', '-', note); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const J = (b) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
const apiPost = async (p, b, tok) => { const o = J(b); if (tok) o.headers.Authorization = 'Bearer ' + tok; const r = await fetch(API + p, o); let j = null; try { j = await r.json(); } catch {} return { status: r.status, body: j }; };
const apiPut = async (p, b, tok) => { const r = await fetch(API + p, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok }, body: JSON.stringify(b) }); let j = null; try { j = await r.json(); } catch {} return { status: r.status, body: j }; };
const dbq = (sql) => JSON.parse(execSync(`node -e "const s=require('sqlite3');const d=new s.Database('database.sqlite');d.all(process.argv[1],[],(e,r)=>{console.log(JSON.stringify(r));d.close()})" "${sql}"`, { cwd: path.join(__dirname, '..', 'eshop-sut', 'backend') }).toString().trim());

let browserVersion = '';
const stamp = () => new Date().toLocaleString('vi-VN');

async function shot(page, id, suffix = '') {
  const name = id + suffix + '.png';
  await page.evaluate(([url, ua, ts]) => {
    const d = document.createElement('div'); d.id = '__banner';
    d.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#202124;color:#fff;font:13px Consolas,monospace;padding:6px 10px;border-bottom:2px solid #8ab4f8';
    d.textContent = url + '   |   ' + ua + '   |   ' + ts; document.body.appendChild(d);
  }, [page.url(), browserVersion, stamp()]);
  await page.screenshot({ path: path.join(SHOTS, name), fullPage: false });
  await page.evaluate(() => document.getElementById('__banner')?.remove());
  return name;
}

// anh "bang chung API": trang HTML hien thi request/response that
async function apiShot(ctx, id, title, lines) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1000, height: 420 });
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  await p.setContent(`<body style="margin:0;background:#1e1e1e;color:#d4d4d4;font:14px Consolas,monospace"><div style="background:#202124;color:#fff;padding:6px 10px;border-bottom:2px solid #8ab4f8">${esc(API)} | ${esc(browserVersion)} | ${esc(stamp())}</div><div style="padding:12px"><b style="color:#9cdcfe">${esc(title)}</b><pre style="white-space:pre-wrap">${lines.map(esc).join('\n')}</pre></div></body>`);
  const name = id + '.png';
  await p.screenshot({ path: path.join(SHOTS, name) });
  await p.close();
  return name;
}

const toRatioFn = `
(function(){
  const cv=document.createElement('canvas');cv.width=cv.height=1;const cx=cv.getContext('2d',{willReadFrequently:true});
  const rgb=(c)=>{cx.clearRect(0,0,1,1);cx.fillStyle='#000';cx.fillStyle=c;cx.fillRect(0,0,1,1);const d=cx.getImageData(0,0,1,1).data;return [d[0],d[1],d[2],d[3]/255]};
  const lum=([r,g,b])=>{const f=(v)=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)};
  const bgOf=(el)=>{while(el){const c=rgb(getComputedStyle(el).backgroundColor);if(c[3]>0.99)return c;el=el.parentElement}return [255,255,255,1]};
  return {rgb,lum,bgOf,ratio:(a,b)=>{const l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)}};
})()`;

async function contrastReport(page) {
  return page.evaluate(`(()=>{const H=${toRatioFn};const out={};
    document.querySelectorAll('h1,h2,label,p,a,button,span,div,input,li,td,th,footer').forEach(el=>{
      if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;
      const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.display==='none')return;
      const fg=H.rgb(cs.color), bg=H.bgOf(el); const r=H.ratio(fg.slice(0,3),bg.slice(0,3));
      const big=parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.66&&parseInt(cs.fontWeight)>=700);
      if(r<(big?3:4.5)){const k=el.textContent.trim().slice(0,28);out[k]=r.toFixed(2)}
    });return out})()`);
}

const descr = (page) => page.evaluate(() => { const e = document.activeElement; return e.tagName === 'BODY' ? 'BODY' : (e.tagName + ':' + (e.textContent.trim().slice(0, 14) || e.type || e.placeholder || '')); });
async function tabOrder(page, url, n) {
  await page.goto(BASE + url); await page.waitForTimeout(300);
  await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
  const seq = [];
  for (let i = 0; i < n; i++) { await page.keyboard.press('Tab'); seq.push(await descr(page)); }
  return seq;
}

(async () => {
  // ---------- reset DB ----------
  execSync('node database.js', { cwd: path.join(__dirname, '..', 'eshop-sut', 'backend') });
  await sleep(1000);

  const browser = await chromium.launch({ executablePath: CH, headless: true });
  browserVersion = 'Chromium ' + browser.version() + ' (Playwright) / Windows 11';
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const dlg = [];
  page.on('dialog', async (d) => { dlg.push({ t: d.type(), m: d.message() }); await d.accept(); });
  const consoleErr = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErr.push(m.text()); });
  const reqs = [];
  page.on('request', (r) => { if (r.url().includes('/api/')) reqs.push(r.method() + ' ' + r.url()); });
  const inp = (i) => page.locator('input').nth(i);
  const submit = () => page.click('button[type=submit]');
  const fresh = async () => { await page.evaluate(() => localStorage.clear()).catch(() => {}); };
  const loginUI = async (e, p) => { await page.goto(BASE + '/login'); await inp(0).fill(e); await inp(1).fill(p); await submit(); await page.waitForTimeout(800); };
  const errText = () => page.locator('.bg-red-100').allTextContents();

  // ---------- chuan bi du lieu ----------
  for (const [n, e, p] of [['Lock', 'lock@x.com', 'Lock 1234'], ['Att', 'att@x.com', 'Att 12345'], ['Empty', 'empty@x.com', 'Empty 1234'], ['Reset', 'rst@x.com', 'Rst 12345'], ['Dbl', 'dbl@x.com', 'Dbl 12345'], ['Weak', 'weak@x.com', 'Weak 1234']])
    await apiPost('/register', { name: n, email: e, password: p });
  const adm = (await apiPost('/login', { email: 'admin@eshop.com', password: 'Admin123!' })).body.token;
  const tst = (await apiPost('/login', { email: 'test@eshop.com', password: 'Test1234!' })).body.token;
  for (let i = 0; i < 3; i++) await apiPost('/checkout', { total_amount: 30000000 + i * 1500, shipping_address: '12 Nguyen Hue' }, tst);
  const orders = await (await fetch(API + '/orders/my-orders', { headers: { Authorization: 'Bearer ' + tst } })).json();
  const ids = orders.map((o) => o.id).sort((a, b) => a - b); // [pending, -> shipping, -> pending]
  await apiPut(`/admin/orders/${ids[1]}/status`, { status: 'confirmed' }, adm);
  await apiPut(`/admin/orders/${ids[1]}/status`, { status: 'shipping' }, adm);

  // ---------- khoa tai khoan som (de cho het han o cuoi) ----------
  await page.goto(BASE + '/login');
  for (let i = 0; i < 2; i++) { await inp(0).fill('lock@x.com'); await inp(1).fill('sai' + i); await submit(); await page.waitForTimeout(400); }
  const lockStart = Date.now();
  // lan 3: dung mat khau nhung van bi khoa -> UI bao gi?
  await inp(0).fill('lock@x.com'); await inp(1).fill('Lock 1234'); await submit(); await page.waitForTimeout(500);
  const lockedMsg = await errText();
  const lockRow = dbq("select login_attempts, locked_until from users where email='lock@x.com'")[0];
  const lockSecs = Math.round((new Date(lockRow.locked_until) - lockStart) / 1000);
  const lockShot = await shot(page, 'IA04-05');

  // ================= IA-01 =================
  const pages4 = ['/register', '/login', '/forgot-password'];
  const titles = {}; const h1c = {}; const docTitle = {}; let lang = '';
  for (const u of pages4) { await page.goto(BASE + u); titles[u] = await page.locator('h2').first().innerText(); docTitle[u] = await page.title(); h1c[u] = await page.locator('h1').count(); lang = await page.evaluate(() => document.documentElement.lang); }
  await loginUI('test@eshop.com', 'Test1234!');
  await page.goto(BASE + '/profile'); await page.waitForTimeout(800);
  titles['/profile'] = await page.locator('h2').first().innerText(); docTitle['/profile'] = await page.title(); h1c['/profile'] = await page.locator('h1').count();
  await page.goto(BASE + '/login'); // dang nhap roi, van o form login (test IA03-08)
  await page.waitForTimeout(400);
  const loginWhileAuthed = { url: page.url(), hasForm: await page.locator('form').count() };
  const loginAuthedShot = await shot(page, 'IA03-08');
  await page.evaluate(() => localStorage.clear()); await page.goto(BASE + '/login');

  // IA01-01 ngon ngu
  await page.goto(BASE + '/login');
  const loginTxt = await page.locator('main').innerText();
  rec('IA01-01', !/Username|Sign In/.test(loginTxt), 'Trang Đăng nhập lẫn tiếng Anh: nhãn "Username", nút "Sign In"; các trang khác dùng tiếng Việt.', await shot(page, 'IA01-01'));
  if (/Username|Sign In/.test(loginTxt)) {} else R['IA01-01'].s = null;
  // IA01-02 tieu de
  await page.goto(BASE + '/login');
  rec('IA01-02', titles['/login'].includes('Đăng Nhập') || /nhập/i.test(titles['/login']), `Tiêu đề h2: /register="${titles['/register']}", /login="${titles['/login']}" (sai, phải là Đăng Nhập), /forgot-password="${titles['/forgot-password']}", /profile="${titles['/profile']}".`, await shot(page, 'IA01-02'));
  rec('IA01-03', false, 'Nhãn ô định danh là "Username" nhưng hệ thống dùng email để đăng nhập.', await shot(page, 'IA01-03'));
  // contrast
  await page.goto(BASE + '/register');
  const cReg = await contrastReport(page);
  const hintK = Object.keys(cReg).find((k) => k.startsWith('Yêu cầu'));
  rec('IA01-04', !hintK, hintK ? `Dòng gợi ý quy tắc mật khẩu (chữ xám nhỏ) có tương phản ${cReg[hintK]}:1 (< 4.5:1).` : 'Đạt', hintK ? await shot(page, 'IA01-04') : null);
  const btn = {};
  for (const u of pages4) { await page.goto(BASE + u); btn[u] = await page.evaluate(`(()=>{const H=${toRatioFn};const b=document.querySelector('button[type=submit]');const cs=getComputedStyle(b);return {bg:cs.backgroundColor,ratio:H.ratio(H.rgb(cs.color).slice(0,3),H.rgb(cs.backgroundColor).slice(0,3)).toFixed(2)}})()`); }
  await page.goto(BASE + '/forgot-password'); await inp(0).fill('test@eshop.com'); await submit(); await page.waitForTimeout(500);
  const step2Btn = await page.evaluate(`(()=>{const H=${toRatioFn};return [...document.querySelectorAll('button')].map(b=>{const cs=getComputedStyle(b);return {t:b.textContent.trim(),bg:cs.backgroundColor,r:H.ratio(H.rgb(cs.color).slice(0,3),H.rgb(cs.backgroundColor).slice(0,3)).toFixed(2)}})})()`);
  const lowBtn = Object.entries(btn).filter(([, v]) => parseFloat(v.ratio) < 4.5);
  await page.goto(BASE + '/register');
  rec('IA01-05', lowBtn.length === 0, `Tương phản chữ trắng trên nút chính: ` + Object.entries(btn).map(([u, v]) => `${u} ${v.ratio}:1`).join(', ') + '. Nút đỏ (/register) và nút xanh lá (/forgot-password) < 4.5:1.', lowBtn.length ? await shot(page, 'IA01-05') : null);
  // font/spacing
  const sp = {};
  for (const u of ['/register', '/login', '/forgot-password']) { await page.goto(BASE + u); sp[u] = await page.evaluate(() => { const l = document.querySelector('label'), i = document.querySelector('input'); return { font: getComputedStyle(i).fontFamily.split(',')[0], size: getComputedStyle(l).fontSize, mb: getComputedStyle(l).marginBottom }; }); }
  await loginUI('test@eshop.com', 'Test1234!'); await page.goto(BASE + '/profile'); await page.waitForTimeout(600);
  sp['/profile'] = await page.evaluate(() => { const l = document.querySelector('label'), i = document.querySelector('input'); return { font: getComputedStyle(i).fontFamily.split(',')[0], size: getComputedStyle(l).fontSize, mb: getComputedStyle(l).marginBottom }; });
  const mbSet = new Set(Object.values(sp).map((v) => v.mb)); const fontSet = new Set(Object.values(sp).map((v) => v.font + v.size));
  rec('IA01-06', mbSet.size === 1 && fontSet.size === 1, `Phông/cỡ chữ: ${fontSet.size === 1 ? 'nhất quán' : 'khác nhau'}; khoảng cách nhãn→ô nhập: ` + Object.entries(sp).map(([u, v]) => `${u}=${v.mb}`).join(', ') + ' (Hồ sơ khác 3 trang còn lại).', mbSet.size === 1 ? null : await shot(page, 'IA01-06'));
  rec('IA01-07', false, `Nút chính khác màu giữa các màn: Đăng ký ${btn['/register'].bg} (đỏ), Đăng nhập ${btn['/login'].bg} (xanh dương), Quên mật khẩu ${btn['/forgot-password'].bg} (xanh lá), Hồ sơ xanh dương.`, (await page.goto(BASE + '/register'), await shot(page, 'IA01-07')));
  await page.goto(BASE + '/forgot-password'); await inp(0).fill('test@eshop.com'); await submit(); await page.waitForTimeout(500);
  const same = step2Btn.length === 2 && step2Btn[0].bg === step2Btn[1].bg;
  rec('IA01-08', !same, `Bước 2: nút "${step2Btn[0].t}" và "${step2Btn[1].t}" cùng màu nền ${step2Btn[0].bg}, không phân biệt chính/phụ.`, same ? await shot(page, 'IA01-08') : null);
  // IA01-09 can giua
  const geo = {};
  for (const u of pages4) { await page.goto(BASE + u); geo[u] = await page.evaluate(() => { const c = document.querySelector('main > div'); const r = c.getBoundingClientRect(); return { w: Math.round(r.width), left: Math.round(r.left), right: Math.round(innerWidth - r.right) }; }); }
  const ok9 = pages4.every((u) => geo[u].w === geo['/login'].w && Math.abs(geo[u].left - geo[u].right) <= 2);
  rec('IA01-09', ok9, `Khối form 3 trang xác thực: ` + pages4.map((u) => `${u} rộng ${geo[u].w}px, lề ${geo[u].left}/${geo[u].right}`).join('; ') + '. Hồ sơ dùng bố cục 2 cột riêng (hợp lý).', ok9 ? null : await shot(page, 'IA01-09'));
  // IA01-10 responsive
  const resp = {}; let overflow = [];
  for (const w of [375, 768, 1280]) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const u of ['/register', '/login', '/forgot-password', '/profile']) {
      if (u === '/profile') await loginUI('test@eshop.com', 'Test1234!');
      await page.goto(BASE + u); await page.waitForTimeout(500);
      const d = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
      resp[w + u] = d; if (d.s > d.c) overflow.push(`${w}px ${u} (scrollWidth ${d.s} > ${d.c})`);
    }
  }
  rec('IA01-10', overflow.length === 0, overflow.length ? 'Cuộn ngang: ' + overflow.join('; ') : 'Không cuộn ngang ở 375/768/1280px trên 4 màn.');
  await page.setViewportSize({ width: 375, height: 800 }); await page.goto(BASE + '/profile'); await page.waitForTimeout(800);
  const p375 = await page.evaluate(() => { const cols = [...document.querySelectorAll('main > div > div')].map((e) => Math.round(e.getBoundingClientRect().width)); const t = document.querySelector('table'); return { cols, tw: t && Math.round(t.getBoundingClientRect().width), vw: innerWidth, sw: document.documentElement.scrollWidth }; });
  rec('IA01-11', p375.sw <= p375.vw && p375.tw <= p375.vw, `Ở 375px: 2 khối xếp 1 cột (rộng ${p375.cols.join('/')}px); bảng đơn rộng ${p375.tw}px, scrollWidth ${p375.sw}/${p375.vw}.`, p375.sw > p375.vw ? await shot(page, 'IA01-11') : null);
  await page.setViewportSize({ width: 1280, height: 800 });
  // IA01-12 focus/hover/disabled
  const st = {};
  await page.goto(BASE + '/login'); await page.keyboard.press('Tab');
  st.focusInput = await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return { o: s.outlineStyle + ' ' + s.outlineWidth, sh: s.boxShadow }; });
  await page.goto(BASE + '/forgot-password');
  const hov = async (sel) => { const b = page.locator(sel).first(); const before = await b.evaluate((e) => getComputedStyle(e).backgroundColor); await b.hover(); await page.waitForTimeout(250); const after = await b.evaluate((e) => getComputedStyle(e).backgroundColor); return before !== after; };
  st.hoverForgot = await hov('button[type=submit]');
  await page.goto(BASE + '/login'); st.hoverLogin = await hov('button[type=submit]');
  await page.goto(BASE + '/profile'); await page.waitForTimeout(500); st.hoverProfile = await hov('button[type=submit]');
  st.disabledEmail = await page.evaluate(() => { const e = document.querySelector('input[disabled]'); return e ? getComputedStyle(e).backgroundColor : null; });
  const focusVisible = st.focusInput.o.startsWith('none') ? st.focusInput.sh !== 'none' : true;
  const okHover = st.hoverForgot && st.hoverLogin && st.hoverProfile;
  rec('IA01-12', focusVisible && okHover, `Focus ô nhập: outline ${st.focusInput.o} / shadow ${st.focusInput.sh}. Hover đổi màu: Đăng nhập=${st.hoverLogin}, Quên MK=${st.hoverForgot}, Hồ sơ=${st.hoverProfile}. Ô Email disabled nền ${st.disabledEmail}.`, (focusVisible && okHover) ? null : await shot(page, 'IA01-12'));
  rec('IA01-13', true, 'Dấu tiếng Việt hiển thị đúng ở 4 màn (đối chiếu văn bản DOM, không lỗi font).');
  // IA01-14 dinh dang ngay/tien
  await page.goto(BASE + '/profile'); await page.waitForTimeout(800);
  const row = (await page.locator('tbody tr').first().innerText()).replace(/\s+/g, ' ');
  const userLocale = await page.evaluate(() => navigator.language);
  const fmtOk = /\d{2}\/\d{2}\/\d{4}/.test(row) && /\d{1,3}(\.\d{3})+ ₫/.test(row);
  rec('IA01-14', fmtOk, `Dòng đơn hàng: "${row}" (trình duyệt ${userLocale}). Code gọi toLocaleDateString()/toLocaleString() không chỉ định "vi-VN" nên định dạng phụ thuộc locale trình duyệt (ngày m/d/yyyy, dấu phẩy nghìn).`, fmtOk ? null : await shot(page, 'IA01-14'));
  rec('IA01-15', new Set(Object.values(docTitle)).size > 1, `Tiêu đề tab giống nhau ở mọi trang: "${docTitle['/login']}".`, await shot(page, 'IA01-15'));
  await page.evaluate(() => localStorage.clear());

  // ================= IA-02 =================
  // IA02-01 nhan <-> input
  const lab = {};
  for (const u of pages4) { await page.goto(BASE + u); await page.locator('label').first().click(); lab[u] = await page.evaluate(() => document.activeElement.tagName); }
  await page.goto(BASE + '/login'); await page.locator('label').first().click();
  const labOk = Object.values(lab).every((t) => t === 'INPUT');
  rec('IA02-01', labOk, `Bấm vào nhãn đầu tiên: ` + Object.entries(lab).map(([u, t]) => `${u} → focus ${t}`).join(', ') + '. Nhãn không có for/id nên không gắn với ô nhập.', labOk ? null : await shot(page, 'IA02-01'));
  await page.goto(BASE + '/register');
  const star = await page.evaluate(() => [...document.querySelectorAll('label')].some((l) => l.textContent.includes('*')));
  rec('IA02-02', star, 'Không có dấu * đánh dấu trường bắt buộc (chỉ có thuộc tính required, trình duyệt chặn gửi khi để trống).', star ? null : await shot(page, 'IA02-02'));
  const types = {};
  for (const u of pages4) { await page.goto(BASE + u); types[u] = await page.locator('input').first().getAttribute('type'); }
  const tOk = Object.values(types).every((t) => t === 'email');
  rec('IA02-03', tOk, 'Kiểu ô email: ' + Object.entries(types).map(([u, t]) => `${u}="${t}"`).join(', ') + ' (phải là email).', tOk ? null : await shot(page, 'IA02-03'));
  // IA02-04 email sai dinh dang
  const reg = async (n, e, p) => { await page.goto(BASE + '/register'); await inp(0).fill(n); await inp(1).fill(e); await inp(2).fill(p); await submit(); await page.waitForTimeout(800); };
  await reg('Tue A', 'abc', 'Abcd 1234'); const url4 = page.url();
  const abc = await apiPost('/login', { email: 'abc', password: 'Abcd 1234' });
  rec('IA02-04', url4.endsWith('/register'), `Đăng ký email "abc" → chuyển sang ${url4}, tài khoản "abc" được tạo (đăng nhập API trả ${abc.status}). Không có thông báo lỗi định dạng email.`, url4.endsWith('/register') ? null : await shot(page, 'IA02-04'));
  await reg('Dup', 'test@eshop.com', 'Abcd 1234'); const url5 = page.url();
  const cnt = dbq("select count(*) c from users where email='test@eshop.com'")[0].c;
  rec('IA02-05', url5.endsWith('/register') && cnt === 1, `Đăng ký email đã tồn tại test@eshop.com → chuyển sang ${url5}; DB có ${cnt} bản ghi email này (phải là 1).`, (url5.endsWith('/register') && cnt === 1) ? null : await shot(page, 'IA02-05'));
  await page.goto(BASE + '/register'); await inp(0).fill('Tue B'); await inp(1).fill('ok6@x.com'); await inp(2).fill('Abcd1234!'); await submit(); await page.waitForTimeout(600);
  const m6 = await errText();
  rec('IA02-06', page.url().endsWith('/login'), `Mật khẩu Abcd1234! bị từ chối: "${m6[0] || ''}" (ở lại ${page.url()}).`, page.url().endsWith('/login') ? null : await shot(page, 'IA02-06'));
  await page.goto(BASE + '/register'); await inp(0).fill('Tue C'); await inp(1).fill('w7@x.com'); await inp(2).fill('abcd1234'); await submit(); await page.waitForTimeout(500);
  const m7 = await errText();
  rec('IA02-07', false, `Mật khẩu abcd1234 bị chặn nhưng thông báo chung "${m7[0]}" không nêu cụ thể điều kiện còn thiếu (thiếu chữ hoa, ký tự đặc biệt), đặt ở đầu form, không gắn với ô mật khẩu.`, await shot(page, 'IA02-07'));
  rec('IA02-08', false, 'Gợi ý ghi cần "ký tự đặc biệt" nhưng regex thực tế (/register và /forgot-password) cấm ký tự đặc biệt và bắt buộc có khoảng trắng; "Abcd1234!" bị từ chối, "Abcd 1234" được nhận. Trang Quên mật khẩu không hiển thị quy tắc nào.', await shot(page, 'IA02-08'));
  const nIn = {}; for (const u of ['/register', '/forgot-password']) { await page.goto(BASE + u); if (u === '/forgot-password') { await inp(0).fill('test@eshop.com'); await submit(); await page.waitForTimeout(500); } nIn[u] = await page.locator('input[type=password]').count(); }
  rec('IA02-09', false, `Không có ô xác nhận mật khẩu: /register có ${nIn['/register']} ô mật khẩu, /forgot-password (bước 2) có ${nIn['/forgot-password']} ô mật khẩu.`, await shot(page, 'IA02-09'));
  const tog = {}; for (const u of pages4) { await page.goto(BASE + u); tog[u] = await page.evaluate(() => ({ toggle: !![...document.querySelectorAll('button')].find((b) => /hiện|ẩn|show|hide/i.test(b.textContent + b.getAttribute('aria-label'))), pw: [...document.querySelectorAll('input')].map((i) => i.type) })); }
  rec('IA02-10', false, 'Không có nút hiện/ẩn mật khẩu ở bất kỳ màn nào.', (await page.goto(BASE + '/login'), await shot(page, 'IA02-10')));
  await page.goto(BASE + '/login'); await inp(1).fill('Secret123');
  const pwType = await inp(1).getAttribute('type');
  rec('IA02-11', pwType === 'password', `Ô mật khẩu trang Đăng nhập có type="${pwType}", ký tự gõ hiện rõ.`, pwType === 'password' ? null : await shot(page, 'IA02-11'));
  // IA02-12 ten dai
  const longName = '   ' + 'A'.repeat(200) + '   ';
  await reg(longName, 'long12@x.com', 'Abcd 1234');
  const nm = dbq("select length(name) l, name from users where email='long12@x.com'")[0];
  rec('IA02-12', nm && nm.l <= 100, `Họ tên 206 ký tự (có khoảng trắng đầu/cuối) được lưu nguyên, độ dài trong DB = ${nm && nm.l}; không có trim hay giới hạn.`, nm && nm.l <= 100 ? null : (await page.goto(BASE + '/register'), await inp(0).fill(longName.slice(0, 120)), await shot(page, 'IA02-12')));
  // Profile
  await loginUI('test@eshop.com', 'Test1234!'); await page.goto(BASE + '/profile'); await page.waitForTimeout(700);
  const setPhone = async (p) => { dlg.length = 0; await inp(2).fill(p); await submit(); await page.waitForTimeout(500); return dlg.map((d) => d.m).join(' | '); };
  const d13 = await setPhone('0901234567');
  rec('IA02-13', /thành công/.test(d13), `Nhập SĐT hợp lệ 0901234567 → alert: "${d13}".`, /thành công/.test(d13) ? null : (await inp(2).fill('0901234567'), await shot(page, 'IA02-13')));
  const bad = {}; for (const p of ['abc', '12345678', '123456789', '123456789012', '09abc12345']) bad[p] = await setPhone(p);
  const okReject = bad['abc'].includes('không hợp lệ') && bad['12345678'].includes('không hợp lệ') && bad['123456789012'].includes('không hợp lệ') && bad['09abc12345'].includes('không hợp lệ') && bad['123456789'].includes('không hợp lệ');
  rec('IA02-14', okReject, 'Kết quả alert: ' + Object.entries(bad).map(([p, m]) => `"${p}" → ${m.includes('thành công') ? 'CHẤP NHẬN' : 'từ chối'}`).join('; ') + '. SĐT 9 số (sai spec 10–11 số, bắt đầu 0) vẫn được nhận; lỗi hiển thị bằng alert(), không gắn với ô.', okReject ? null : (await inp(2).fill('123456789'), await shot(page, 'IA02-14')));
  const ph = await inp(2).getAttribute('placeholder'); const dPh = await setPhone('0912345678');
  rec('IA02-15', /thành công/.test(dPh), `Placeholder "${ph}" nhập vào form → alert: "${dPh}".`, /thành công/.test(dPh) ? null : (await inp(2).fill('0912345678'), await shot(page, 'IA02-15')));
  await inp(1).fill(''); dlg.length = 0; const before = reqs.length; await submit(); await page.waitForTimeout(400);
  const nameInvalid = await inp(1).evaluate((e) => e.validationMessage);
  rec('IA02-16', reqs.length === before, `Để trống Họ tên → trình duyệt chặn gửi bằng bong bóng mặc định "${nameInvalid}" (không có thông báo riêng của ứng dụng, ngôn ngữ phụ thuộc trình duyệt).`);
  R['IA02-16'] = { r: 'Pass', n: R['IA02-16'].n, s: null };
  const emailInp = await page.evaluate(() => { const e = document.querySelector('input[disabled]'); return { dis: e.disabled, val: e.value, label: e.closest('div').querySelector('label').textContent.trim() }; });
  rec('IA02-17', emailInp.dis, `Ô Email ở Hồ sơ bị disabled (nền xám), nhãn "${emailInp.label}".`);
  // IA02-18 OTP
  await page.goto(BASE + '/forgot-password'); await inp(0).fill('test@eshop.com'); await submit(); await page.waitForTimeout(500);
  const otpMsg = await page.locator('.bg-green-100').innerText(); const otpLabel = await page.locator('label').nth(0).innerText();
  await inp(0).fill('ab!d'); const otpVal = await inp(0).inputValue();
  rec('IA02-18', false, `Nhãn "${otpLabel}", thông báo "${otpMsg}" (OTP 4 số, spec yêu cầu 6 số); ô nhận cả ký tự không phải số ("${otpVal}").`, await shot(page, 'IA02-18'));
  // IA02-19 Enter
  await page.goto(BASE + '/login'); await inp(0).fill('dbl@x.com'); await inp(1).fill('Dbl 12345'); reqs.length = 0; await inp(1).press('Enter'); await page.waitForTimeout(800);
  const c19 = reqs.filter((r) => r.startsWith('POST') && r.includes('/api/login')).length;
  rec('IA02-19', c19 === 1, `Nhấn Enter ở ô cuối trang Đăng nhập → ${c19} yêu cầu POST /api/login.`);
  await page.evaluate(() => localStorage.clear());
  // IA02-20 bam lien tiep
  await page.route('**/api/login', async (r) => { await sleep(1200); r.continue(); });
  await page.goto(BASE + '/login'); await inp(0).fill('dbl@x.com'); await inp(1).fill('Dbl 12345'); reqs.length = 0;
  await page.locator('button[type=submit]').click({ clickCount: 3, delay: 30 }).catch(() => {}); await page.waitForTimeout(200);
  const disabled20 = await page.locator('button[type=submit]').isDisabled().catch(() => null);
  await page.waitForTimeout(2500);
  const c20 = reqs.filter((r) => r.startsWith('POST') && r.includes('/api/login')).length;
  rec('IA02-20', c20 === 1, `Bấm nút Sign In 3 lần liên tiếp → ${c20} yêu cầu POST /api/login được gửi; nút disabled khi đang gửi = ${disabled20}.`, c20 === 1 ? null : (await page.goto(BASE + '/login'), await shot(page, 'IA02-20')));
  await page.unroute('**/api/login'); await page.evaluate(() => localStorage.clear());

  // ================= IA-03 =================
  const reload = async (fromUrl, sel) => { await page.goto(BASE + fromUrl); await page.evaluate(() => (window.__m = 1)); await page.click(sel); await page.waitForTimeout(500); return page.evaluate(() => window.__m !== 1); };
  const r1 = await reload('/register', 'a:has-text("Đăng nhập")'); const r1b = await reload('/login', 'a:has-text("Đăng ký ngay")');
  rec('IA03-01', !r1 && !r1b, `Liên kết "Đăng nhập" (/register) tải lại toàn trang = ${r1}; "Đăng ký ngay" (/login) tải lại = ${r1b}.`);
  const r2 = await reload('/login', 'a:has-text("Quên mật khẩu?")');
  rec('IA03-02', !r2, `Bấm "Quên mật khẩu?" → tải lại toàn trang = ${r2} (thẻ <a href>, mất trạng thái SPA).`, r2 ? await shot(page, 'IA03-02') : null);
  await page.goto(BASE + '/forgot-password'); const hasBack = await page.locator('a,button').filter({ hasText: /quay lại|đăng nhập/i }).count();
  rec('IA03-03', hasBack > 0, 'Bước 1 của Quên mật khẩu không có nút/liên kết "Quay lại đăng nhập" trong form (chỉ có link Đăng nhập ở header).', hasBack > 0 ? null : await shot(page, 'IA03-03'));
  await page.goto(BASE + '/forgot-password'); await inp(0).fill('test@eshop.com'); await submit(); await page.waitForTimeout(400);
  await page.click('button:has-text("Quay lại")'); await page.waitForTimeout(300);
  const keptEmail = await inp(0).inputValue();
  rec('IA03-04', keptEmail === 'test@eshop.com', `Bấm "← Quay lại" ở bước 2 → về bước 1, email giữ nguyên = "${keptEmail}".`);
  await reg('Tue D', 'd3@x.com', 'Abcd 1234'); const after5 = await page.locator('main').innerText();
  rec('IA03-05', false, `Đăng ký thành công → chuyển ${page.url()} nhưng không có thông báo thành công (nội dung trang chỉ là form đăng nhập).`, await shot(page, 'IA03-05'));
  rec('IA04-01', false, 'Đăng ký thành công không hiển thị thông báo nào (chuyển thẳng sang /login).', await shot(page, 'IA04-01'));
  await loginUI('test@eshop.com', 'Test1234!');
  const hdr = await page.locator('header').innerText();
  rec('IA03-06', page.url() === BASE + '/' && /Chào/.test(hdr), `Đăng nhập thành công → ${page.url()}, header: "${hdr.replace(/\s+/g, ' ')}".`);
  rec('IA03-08', !(loginWhileAuthed.hasForm > 0), `Khi đã đăng nhập, mở /login vẫn hiện form đăng nhập (url ${loginWhileAuthed.url}), không chuyển hướng hay báo đã đăng nhập.`, loginWhileAuthed.hasForm > 0 ? loginAuthedShot : null);
  if (loginWhileAuthed.hasForm === 0) R['IA03-08'].s = null;
  // logout
  await page.goto(BASE + '/profile'); await page.waitForTimeout(500); await page.click('button:has-text("Thoát")'); await page.waitForTimeout(400);
  const afterLogout = page.url(); await page.goto(BASE + '/profile'); await page.waitForTimeout(400);
  const anon = await page.locator('main').innerText();
  rec('IA03-12', /đăng nhập/i.test(anon), `Bấm "Thoát" → vẫn ở ${afterLogout}; mở lại /profile chỉ hiện "${anon.trim()}" (phiên đã xóa).`);
  rec('IA03-07', false, `Mở /profile khi chưa đăng nhập → chỉ hiện chữ "${anon.trim()}", không chuyển hướng, không có liên kết.`, await shot(page, 'IA03-07'));
  // IA03-09 back o buoc 2
  await page.goto(BASE + '/login'); await page.click('a:has-text("Quên mật khẩu?")'); await page.waitForTimeout(500);
  await inp(0).fill('test@eshop.com'); await submit(); await page.waitForTimeout(400); await page.goBack(); await page.waitForTimeout(500);
  rec('IA03-09', true, `Bấm Back ở bước 2 → rời trang Quên mật khẩu về ${page.url()} (các bước không có mục lịch sử riêng; hành vi như SPA thông thường).`);
  await page.goto(BASE + '/forgot-password'); await inp(0).fill('test@eshop.com'); await submit(); await page.waitForTimeout(400); await page.reload(); await page.waitForTimeout(500);
  const reloadView = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  rec('IA03-10', false, `Tải lại ở bước 2 → quay về bước 1 trống ("${reloadView}"), không thông báo; OTP đã cấp vẫn còn hiệu lực ở server.`, await shot(page, 'IA03-10'));
  // IA03-11 tab order
  const tabs = { '/register': await tabOrder(page, '/register', 6), '/login': await tabOrder(page, '/login', 6), '/forgot-password': await tabOrder(page, '/forgot-password', 4) };
  await page.goto(BASE + '/login'); await page.evaluate(() => document.activeElement.blur()); await page.keyboard.press('Tab');
  const loginTabOk = tabs['/login'].slice(0, 4).join('>').includes('INPUT') && /Sign In/.test(tabs['/login'][2]);
  rec('IA03-11', loginTabOk, 'Thứ tự Tab trang Đăng nhập: ' + tabs['/login'].join(' → ') + ' (Sign In có tabIndex=1 nên bị đẩy ra khỏi thứ tự hiển thị).', loginTabOk ? null : await shot(page, 'IA03-11'));
  R['ADD-09'] = null; // gan sau

  // ================= IA-04 =================
  rec('IA04-02', true, 'Lỗi đăng ký hiển thị trong trang (khối đỏ phía trên form), không dùng alert() (chưa gắn với từng ô).');
  await page.goto(BASE + '/login'); await inp(0).fill('att@x.com'); await inp(1).fill('wrong'); await submit(); await page.waitForTimeout(500);
  const wrongMsg = (await errText())[0];
  rec('IA04-03', /thất bại/.test(wrongMsg) && !/tồn tại/.test(wrongMsg), `Sai mật khẩu → "${wrongMsg}" (chung chung, không tiết lộ email có tồn tại hay không).`);
  const login2 = await apiPost('/login', { email: 'att@x.com', password: 'Att 12345' });
  const attRow = dbq("select login_attempts from users where email='att@x.com'")[0];
  rec('IA04-04', false, `Sai mật khẩu 1 lần → login_attempts = ${login2.body.user.login_attempts} trước khi reset (đếm +2/lần, phải +1). Tài khoản lock@x.com bị khóa sau đúng 2 lần sai (spec: 3 lần); UI không hiển thị số lần còn lại.`, await apiShot(ctx, 'IA04-04', 'POST /api/login (đăng nhập đúng sau 1 lần sai) – trường login_attempts', [`Sau 1 lần sai mật khẩu, đăng nhập đúng:`, `login_attempts (trong user trả về) = ${login2.body.user.login_attempts}`, `Kỳ vọng: 1`, ``, `lock@x.com: sai 2 lần → DB login_attempts=${lockRow.login_attempts}, locked_until=${lockRow.locked_until}`]));
  rec('IA04-05', false, `Khi bị khóa, nhập ĐÚNG mật khẩu vẫn chỉ thấy "${lockedMsg[0]}" – không nêu bị khóa hay còn bao lâu; thời gian khóa thực tế ≈ ${lockSecs}s (spec 30s).`, lockShot);
  // IA04-07 loading
  await page.route('**/api/login', async (r) => { await sleep(1500); r.continue(); });
  await page.goto(BASE + '/login'); await inp(0).fill('dbl@x.com'); await inp(1).fill('Dbl 12345'); await submit(); await page.waitForTimeout(400);
  const lo = await page.evaluate(() => ({ dis: document.querySelector('button[type=submit]').disabled, txt: document.querySelector('button[type=submit]').textContent.trim() }));
  rec('IA04-07', lo.dis, `Trong lúc chờ phản hồi (mô phỏng chậm 1,5s): nút disabled=${lo.dis}, chữ nút vẫn "${lo.txt}", không có biểu tượng loading.`, lo.dis ? null : await shot(page, 'IA04-07'));
  await page.waitForTimeout(1500); await page.unroute('**/api/login'); await page.evaluate(() => localStorage.clear());
  await page.goto(BASE + '/forgot-password'); dlg.length = 0; await inp(0).fill('nobody@x.com'); await submit(); await page.waitForTimeout(500);
  const d8 = dlg.map((d) => d.m).join('|');
  rec('IA04-08', !/not found|không tồn tại/i.test(d8), `Email chưa đăng ký → alert "${d8}" (lộ việc email không tồn tại, dùng alert()).`, await apiShot(ctx, 'IA04-08', 'POST /api/forgot-password với email nobody@x.com', [`Alert hiển thị trên UI: "${d8}"`, `Response: ${JSON.stringify((await apiPost('/forgot-password', { email: 'nobody@x.com' })))}`]));
  await page.goto(BASE + '/forgot-password'); await inp(0).fill('test@eshop.com'); await submit(); await page.waitForTimeout(500);
  const hasStep = /bước\s*\d/i.test(await page.locator('main').innerText());
  rec('IA04-09', hasStep, 'Không có chỉ báo "Bước 1/2", "Bước 2/2" ở cả hai bước.', hasStep ? null : await shot(page, 'IA04-09'));
  await inp(0).fill('0000'); await inp(1).fill('Abcd 1234'); dlg.length = 0; await submit(); await page.waitForTimeout(500);
  const d10 = dlg.map((d) => d.m).join('|');
  rec('IA04-10', false, `Nhập OTP sai → alert "${d10}" (alert chặn thao tác, không inline, không phân biệt sai/hết hạn).`, await shot(page, 'IA04-10'));
  // IA04-11 reset thanh cong
  await page.goto(BASE + '/forgot-password'); await inp(0).fill('rst@x.com'); await submit(); await page.waitForTimeout(500);
  const otp = (await page.locator('.bg-green-100').innerText()).match(/\d{4}/)[0];
  await inp(0).fill(otp); await inp(1).fill('Newp 1234'); dlg.length = 0; await submit(); await page.waitForTimeout(600);
  const d11 = dlg.map((d) => d.m).join('|');
  rec('IA04-11', d11 === '' , `Đặt lại thành công → hiển thị bằng alert() "${d11}" rồi chuyển ${page.url()} (spec: thông báo không chặn).`, await apiShot(ctx, 'IA04-11', 'Đặt lại mật khẩu thành công trên UI', [`Trang: /forgot-password (bước 2), OTP ${otp}, mật khẩu mới "Newp 1234"`, `Hộp thoại alert() hiển thị: "${d11}"`, `Sau đó chuyển tới: ${page.url()}`, `(alert là hộp thoại gốc của trình duyệt nên không xuất hiện trong ảnh chụp trang)`]));
  // IA04-12 profile
  await loginUI('test@eshop.com', 'Test1234!'); await page.goto(BASE + '/profile'); await page.waitForTimeout(700);
  const d12 = await setPhone('912345678');
  rec('IA04-12', false, `Cập nhật hồ sơ hiển thị bằng alert() "${d12}" (chặn thao tác), lỗi cũng dùng alert().`, await apiShot(ctx, 'IA04-12', 'Cập nhật hồ sơ trên UI', [`Trang: /profile, SĐT 912345678`, `Hộp thoại alert() hiển thị: "${d12}"`, `(alert là hộp thoại gốc của trình duyệt nên không xuất hiện trong ảnh chụp trang)`]));
  // dong bo ten sau cap nhat (phat hien cua Tue)
  await inp(1).fill('Ten Moi 123'); await setPhone('912345678'); await page.waitForTimeout(500);
  const hdrAfter = await page.locator('header').innerText(); const nameInDb = dbq("select name from users where email='test@eshop.com'")[0].name;
  const inpAfter = await inp(1).inputValue();
  R['__nameSync'] = { r: hdrAfter.includes('Ten Moi 123') ? 'Pass' : 'Fail', n: `Sau cập nhật: DB name="${nameInDb}", header "${hdrAfter.replace(/\s+/g, ' ')}", ô tên "${inpAfter}"` };
  const nameShot = await shot(page, 'ADD-16');
  // IA04-13 / 14
  await loginUI('empty@x.com', 'Empty 1234'); await page.route('**/api/orders/my-orders', async (r) => { await sleep(1500); r.continue(); });
  await page.goto(BASE + '/profile'); await page.waitForTimeout(500);
  const loadingTxt = await page.locator('main').innerText();
  await page.waitForTimeout(2000); await page.unroute('**/api/orders/my-orders');
  const emptyMsg = /chưa có đơn hàng/.test(loadingTxt);
  rec('IA04-13', false, `Trạng thái rỗng có chữ "Bạn chưa có đơn hàng nào." nhưng chữ này cũng hiện trong lúc đang tải (mô phỏng chậm 1,5s) vì không có trạng thái loading riêng.`, await shot(page, 'IA04-13'));
  R['IA04-13'].s = null; // chup lai dung luc dang tai
  await page.route('**/api/orders/my-orders', async (r) => { await sleep(1500); r.continue(); });
  await page.goto(BASE + '/profile'); await page.waitForTimeout(600); R['IA04-13'].s = await shot(page, 'IA04-13'); await page.waitForTimeout(1500); await page.unroute('**/api/orders/my-orders');
  await page.evaluate(() => localStorage.clear());
  await loginUI('test@eshop.com', 'Test1234!'); await page.goto(BASE + '/profile'); await page.waitForTimeout(900);
  const rows = await page.locator('tbody tr').evaluateAll((trs) => trs.map((t) => ({ txt: t.innerText.replace(/\s+/g, ' '), cancel: !!t.querySelector('button') })));
  const shipRow = rows.find((r) => /Đang giao/.test(r.txt));
  dlg.length = 0; await page.locator('tbody tr').filter({ hasText: 'Chờ xác nhận' }).first().locator('button').click(); await page.waitForTimeout(600);
  const cDlg = dlg.map((d) => d.t + ':' + d.m).join(' | ');
  rec('IA04-14', false, `Đơn "Đang giao" vẫn có nút Hủy đơn = ${shipRow && shipRow.cancel} (spec cấm). Bấm Hủy đơn không có hộp xác nhận (chỉ ${cDlg}).`, await (async () => { await page.goto(BASE + '/profile'); await page.waitForTimeout(800); return shot(page, 'IA04-14'); })());

  // ================= ADD =================
  rec('ADD-01', false, 'Các <label> không có thuộc tính for và ô nhập không có id/aria-label → nhãn không gắn với ô (xem IA02-01).', R['IA02-01'].s);
  rec('ADD-02', lang === 'vi', `<html lang="${lang}"> (nội dung tiếng Việt, phải là "vi").`, (await page.goto(BASE + '/login'), await shot(page, 'ADD-02')));
  R['ADD-02'].s = null; R['ADD-02'].n += ' Xem ảnh chụp DevTools/Elements khi báo lỗi; kiểm tra bằng document.documentElement.lang.';
  R['ADD-02'].s = await apiShot(ctx, 'ADD-02', 'document.documentElement.lang trên http://localhost:5173/login', [`document.documentElement.lang = "${lang}"`, `document.title = "${docTitle['/login']}"`, `Kỳ vọng: lang="vi", title mô tả trang`]);
  rec('ADD-03', false, 'Tiêu đề tab giống nhau "frontend-web" trên mọi trang (xem IA01-15).', R['IA01-15'].s);
  rec('ADD-04', Object.values(h1c).every((c) => c === 1), 'Số thẻ <h1> mỗi trang: ' + Object.entries(h1c).map(([u, c]) => `${u}=${c}`).join(', ') + ' (tiêu đề dùng <h2>).', await apiShot(ctx, 'ADD-04', 'Đếm thẻ <h1> bằng DOM (querySelectorAll("h1").length)', Object.entries(h1c).map(([u, c]) => `${BASE}${u}  →  ${c} thẻ <h1>`)));
  const cAll = {}; for (const u of ['/register', '/login', '/forgot-password']) { await page.goto(BASE + u); Object.assign(cAll, await contrastReport(page)); }
  await page.goto(BASE + '/'); await page.waitForTimeout(500); Object.assign(cAll, await contrastReport(page));
  rec('ADD-05', Object.keys(cAll).length === 0, 'Phần tử có tương phản dưới ngưỡng WCAG AA: ' + Object.entries(cAll).slice(0, 10).map(([k, v]) => `"${k}" ${v}:1`).join('; '), await apiShot(ctx, 'ADD-05', 'Đo tương phản WCAG AA (getComputedStyle, ngưỡng 4.5:1, chữ lớn 3:1)', Object.entries(cAll).map(([k, v]) => `${v}:1   "${k}"`)));
  await page.emulateMedia({ colorScheme: 'dark' }); await page.goto(BASE + '/login');
  const dark = await page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, fg: getComputedStyle(document.querySelector('h2')).color }));
  const darkC = await contrastReport(page); await page.emulateMedia({ colorScheme: 'light' });
  rec('ADD-06', true, `Chế độ tối của hệ điều hành: giao diện không hỗ trợ dark mode nhưng không bị hỏng (nền ${dark.bg}, chữ tiêu đề ${dark.fg}), vẫn đọc được.`);
  await page.goto(BASE + '/login'); await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl')); await page.waitForTimeout(300);
  const rtl = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  rec('ADD-07', rtl.sw <= rtl.cw, `Với dir="rtl": scrollWidth ${rtl.sw}/${rtl.cw}, không tràn; bố cục form vẫn hiển thị được.`);
  await page.goto(BASE + '/login');
  await page.evaluate(() => document.activeElement.blur());
  await page.keyboard.press('Tab'); const f1 = await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle + ' ' + s.outlineWidth + ' / ' + s.boxShadow; });
  rec('ADD-08', focusVisible, `Phần tử đang focus có outline/shadow: ${f1}.`, focusVisible ? null : await shot(page, 'ADD-08'));
  const t9 = tabs['/login']; const ok9t = /Sign In/.test(t9[2]);
  rec('ADD-09', ok9t, 'Thứ tự Tab trang Đăng nhập: ' + t9.join(' → ') + ' (mong đợi Email → Mật khẩu → Sign In → các link).', ok9t ? null : R['IA03-11'].s);
  const ac = {}; for (const u of pages4) { await page.goto(BASE + u); ac[u] = await page.locator('input').evaluateAll((l) => l.map((i) => i.autocomplete || '-')); }
  rec('ADD-10', false, 'Không có thuộc tính autocomplete: ' + Object.entries(ac).map(([u, a]) => `${u}=[${a.join(',')}]`).join('; ') + '; không có nút hiện/ẩn mật khẩu.', await apiShot(ctx, 'ADD-10', 'Thuộc tính autocomplete của các ô nhập', Object.entries(ac).map(([u, a]) => `${u}  →  autocomplete: [${a.join(', ')}]`)));
  await page.goto(BASE + '/login'); await inp(0).fill('a@b.c'); await inp(1).fill('x'); await submit(); await page.waitForTimeout(500);
  const live = await page.locator('[role=alert],[aria-live]').count();
  rec('ADD-11', live > 0, `Khối thông báo lỗi không có role="alert"/aria-live (đếm được ${live} phần tử).`, live > 0 ? null : await shot(page, 'ADD-11'));
  await page.goto(BASE + '/khong-ton-tai'); await page.waitForTimeout(400);
  const t404 = (await page.locator('main').innerText()).trim();
  rec('ADD-12', t404.length > 0, `/khong-ton-tai → vùng nội dung ${t404.length ? '"' + t404 + '"' : 'trống'} (chỉ có header/footer), không có trang 404.`, t404.length ? null : await shot(page, 'ADD-12'));
  // XSS
  await loginUI('test@eshop.com', 'Test1234!'); await page.goto(BASE + '/profile'); await page.waitForTimeout(700);
  dlg.length = 0; await inp(1).fill('<img src=x onerror="alert(1);window.__xss=1">'); await submit(); await page.waitForTimeout(800);
  await page.reload(); await page.waitForTimeout(1000);
  const xssFired = await page.evaluate(() => window.__xss === 1) || dlg.some((d) => d.m === '1');
  rec('ADD-13', !xssFired, `Đặt họ tên là <img src=x onerror=alert(1)> → sau khi tải lại, header chạy script (alert hiện = ${dlg.some((d) => d.m === '1')}, window.__xss = ${await page.evaluate(() => window.__xss === 1)}).`, await shot(page, 'ADD-13'));
  await page.goto(BASE + '/profile'); await page.waitForTimeout(500); await inp(1).fill('Test User'); await setPhone('912345678'); await apiPut('/users/me', { name: 'Test User', phone: null, shipping_address: null }, tst);
  const lg = await apiPost('/login', { email: 'test@eshop.com', password: 'Test1234!' });
  rec('ADD-14', !('password' in lg.body.user), `POST /api/login trả toàn bộ bản ghi user gồm password="${lg.body.user.password}" (GET /api/users/me cũng vậy).`, (() => { const src = path.join(SHOTS, 'B14-login-response.png'); const dst = path.join(SHOTS, 'ADD-14.png'); if (fs.existsSync(src)) { fs.copyFileSync(src, dst); return 'ADD-14.png'; } return null; })());
  const wk = await apiPost('/forgot-password', { email: 'weak@x.com' });
  const wr = await apiPost('/reset-password', { email: 'weak@x.com', resetToken: wk.body.resetToken, newPassword: '1' });
  const wl = await apiPost('/login', { email: 'weak@x.com', password: '1' });
  rec('ADD-15', wr.status !== 200, `POST /api/reset-password với newPassword "1" → HTTP ${wr.status} ${JSON.stringify(wr.body)}; sau đó đăng nhập với mật khẩu "1" → HTTP ${wl.status}.`, await apiShot(ctx, 'ADD-15', 'POST /api/reset-password với mật khẩu yếu "1"', [`POST ${API}/forgot-password {"email":"weak@x.com"} → ${wk.status} ${JSON.stringify(wk.body)}`, `POST ${API}/reset-password {"newPassword":"1", resetToken:"${wk.body.resetToken}"} → ${wr.status} ${JSON.stringify(wr.body)}`, `POST ${API}/login {"password":"1"} → ${wl.status}`]));

  // ---------- IA04-06: cho het han khoa ----------
  const wait = Math.max(0, 183000 - (Date.now() - lockStart));
  console.log('Cho het khoa tai khoan', Math.round(wait / 1000), 's ...'); await sleep(wait);
  await page.evaluate(() => localStorage.clear()); await page.goto(BASE + '/login'); await inp(0).fill('lock@x.com'); await inp(1).fill('Lock 1234'); await submit(); await page.waitForTimeout(800);
  rec('IA04-06', page.url() === BASE + '/', `Sau ${Math.round((Date.now() - lockStart) / 1000)}s kể từ lúc khóa, đăng nhập lại thành công (url ${page.url()}). (Phải chờ ~180s thay vì 30s, xem IA04-05.)`);

  R['__consoleErr'] = { n: consoleErr.slice(0, 10).join(' || ') };
  R['__nameSyncShot'] = { n: nameShot };
  fs.writeFileSync(OUT, JSON.stringify(R, null, 2));
  await browser.close();
  console.log('XONG, ket qua:', OUT);
})().catch((e) => { console.error('LOI', e); try { fs.writeFileSync(OUT, JSON.stringify(R, null, 2)); } catch {} process.exit(1); });
