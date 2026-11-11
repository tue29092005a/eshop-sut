// Dan vao DevTools Console (hoac tao bookmarklet) tren moi trang truoc khi chup anh Task 3.
// Hien khung co dinh: email sinh vien, ho ten, MSSV, URL hien tai, trinh duyet/OS (doc tu userAgent that), thoi gian.
(() => {
  const ID = '__hw03_overlay';
  document.getElementById(ID)?.remove();
  const ua = navigator.userAgent;
  const br = /Edg\//.test(ua) ? 'Edge ' + ua.match(/Edg\/([\d.]+)/)[1]
    : /Firefox\//.test(ua) ? 'Firefox ' + ua.match(/Firefox\/([\d.]+)/)[1]
    : /Chrome\//.test(ua) ? 'Chrome ' + ua.match(/Chrome\/([\d.]+)/)[1]
    : /Safari\//.test(ua) ? 'Safari ' + ((ua.match(/Version\/([\d.]+)/) || [])[1] || '') : ua;
  const os = /Windows NT 10/.test(ua) ? 'Windows 10/11' : /Mac OS X ([\d_]+)/.test(ua) ? 'macOS ' + ua.match(/Mac OS X ([\d_]+)/)[1].replace(/_/g, '.')
    : /Android ([\d.]+)/.test(ua) ? 'Android ' + ua.match(/Android ([\d.]+)/)[1] : /iPhone OS ([\d_]+)/.test(ua) ? 'iOS ' + ua.match(/iPhone OS ([\d_]+)/)[1].replace(/_/g, '.') : navigator.platform;
  const d = document.createElement('div');
  d.id = ID;
  d.style.cssText = 'position:fixed;right:8px;bottom:8px;z-index:2147483647;background:rgba(17,24,39,.92);color:#fff;font:12px/1.45 Consolas,monospace;padding:8px 10px;border-radius:6px;border:2px solid #f59e0b;max-width:92vw;pointer-events:none';
  const line = (t) => { const s = document.createElement('div'); s.textContent = t; d.appendChild(s); };
  line('23120398@student.hcmus.edu.vn');
  line('Võ Thành Minh Tuệ – 23120398');
  line(location.href);
  line(br + ' · ' + os + ' · ' + innerWidth + '×' + innerHeight);
  line(new Date().toLocaleString('vi-VN'));
  document.body.appendChild(d);
})();
