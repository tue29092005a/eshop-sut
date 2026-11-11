// Chup anh bang chung API cho cac bug khong co trong checklist UI (BUG-03, BUG-04, BUG-23).
// Cach dung: reset DB (node database.js), chay backend 3000, roi: node evidence_api.js
const { chromium } = require('playwright');
const path = require('path');

const CH = process.env.USERPROFILE + '/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const API = 'http://localhost:3000/api';
const SHOTS = path.join(__dirname, '..', 'eshop-sut', 'hw03', 'screenshots');

const call = async (method, p, body, tok) => {
  const h = { 'Content-Type': 'application/json' };
  if (tok) h.Authorization = 'Bearer ' + tok;
  const r = await fetch(API + p, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  let j = null; try { j = await r.json(); } catch {}
  return { status: r.status, body: j };
};
const show = (method, p, body, res) => [
  `> ${method} ${API}${p}` + (body ? `\n  body: ${JSON.stringify(body)}` : ''),
  `< HTTP ${res.status}  ${JSON.stringify(res.body)}`, ''];

(async () => {
  const browser = await chromium.launch({ executablePath: CH });
  const ver = 'Chromium ' + browser.version() + ' / Windows 11';
  const ctx = await browser.newContext();
  const shot = async (name, title, lines) => {
    const p = await ctx.newPage();
    await p.setViewportSize({ width: 1100, height: 460 });
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    await p.setContent(`<body style="margin:0;background:#1e1e1e;color:#d4d4d4;font:14px Consolas,monospace"><div style="background:#202124;color:#fff;padding:6px 10px;border-bottom:2px solid #8ab4f8">${esc(API)} | ${esc(ver)} | ${esc(new Date().toLocaleString('vi-VN'))}</div><div style="padding:12px"><b style="color:#9cdcfe">${esc(title)}</b><pre style="white-space:pre-wrap">${lines.map(esc).join('\n')}</pre></div></body>`);
    await p.screenshot({ path: path.join(SHOTS, name), fullPage: true });
    await p.close();
    console.log('saved', name);
  };

  // BUG-03: backend khong validate
  const b3 = { name: 'x', email: 'notanemail', password: '1' };
  const r3 = await call('POST', '/register', b3);
  await shot('BUG-03-api.png', 'BUG-03: backend chap nhan email sai dinh dang va mat khau "1"', show('POST', '/register', b3, r3));

  // BUG-04: email trung
  const b4 = { name: 'Trung Email', email: 'test@eshop.com', password: 'Abc 1234' };
  const r4 = await call('POST', '/register', b4);
  await shot('BUG-04-api.png', 'BUG-04: dang ky lai email da ton tai test@eshop.com', show('POST', '/register', b4, r4));

  // BUG-23: nang quyen qua truong role
  const lb = { email: 'test@eshop.com', password: 'Test1234!' };
  const login = await call('POST', '/login', lb);
  const tok = login.body && login.body.token;
  const before = await call('GET', '/users/me', null, tok);
  const pb = { name: 'Test User', role: 'admin' };
  const put = await call('PUT', '/users/me', pb, tok);
  const after = await call('GET', '/users/me', null, tok);
  const pick = (r) => ({ status: r.status, body: r.body && { id: r.body.id, email: r.body.email, role: r.body.role } });
  await shot('BUG-23-api.png', 'BUG-23: user thuong tu doi role thanh admin qua PUT /api/users/me', [
    `> POST ${API}/login  (test@eshop.com)  -> HTTP ${login.status}, token nhan duoc`, '',
    `> GET ${API}/users/me (truoc)`, `< ${JSON.stringify(pick(before))}`, '',
    ...show('PUT', '/users/me', pb, put),
    `> GET ${API}/users/me (sau)`, `< ${JSON.stringify(pick(after))}`]);

  await browser.close();
})();
