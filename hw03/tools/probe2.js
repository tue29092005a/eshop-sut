const { chromium } = require('playwright');
const CH = process.env.USERPROFILE + '/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const B='http://localhost:5173';
(async()=>{
 const br=await chromium.launch({executablePath:CH,headless:true}); const p=await (await br.newContext({viewport:{width:1280,height:800}})).newPage();
 p.on('dialog',d=>d.accept());
 const btn=async(url,sel='button[type=submit]')=>{await p.goto(B+url);return p.evaluate(s=>{const e=document.querySelector(s);const c=getComputedStyle(e);return [c.backgroundColor,c.color]},sel)};
 console.log('reg',await btn('/register')); console.log('login',await btn('/login')); console.log('forgot',await btn('/forgot-password'));
 console.log('hint',await (async()=>{await p.goto(B+'/register');return p.evaluate(()=>{const c=getComputedStyle(document.querySelector('p.text-xs'));return [c.color,c.fontSize]})})());
 console.log('link',await (async()=>{await p.goto(B+'/login');return p.evaluate(()=>{const c=getComputedStyle(document.querySelector('a[href="/forgot-password"]'));return [c.color,c.fontSize]})})());
 // lock via UI
 await p.goto(B+'/login');
 for(let i=0;i<3;i++){await p.locator('input').nth(0).fill('test@eshop.com');await p.locator('input').nth(1).fill('bad'+i);await p.click('button[type=submit]');await p.waitForTimeout(400);
  console.log('try',i+1,await p.locator('.bg-red-100').allTextContents());}
 await p.screenshot({path:'../screenshots/_probe/login_locked_ui.png'});
 // loading/disabled on submit: slow network
 await p.route('**/api/login',async r=>{await new Promise(x=>setTimeout(x,1500));r.continue()});
 await p.goto(B+'/login');await p.locator('input').nth(0).fill('admin@eshop.com');await p.locator('input').nth(1).fill('Admin123!');
 await p.click('button[type=submit]');await p.waitForTimeout(300);
 console.log('btn disabled during submit:',await p.evaluate(()=>document.querySelector('button[type=submit]').disabled));
 await br.close();
})();
