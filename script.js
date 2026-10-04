(() => {
  const $ = (s) => document.querySelector(s);
  const intro = $('#intro'), seal = $('#seal'), extras = $('#extras');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* تجهيز عناصر الدعوة للظهور بالترتيب */
  const items = [...document.querySelectorAll('.card > :is(p, h1, img, span.rule)')];
  items.forEach((el, i) => { el.classList.add('r'); el.style.setProperty('--d', (0.3 + i * 0.2).toFixed(2) + 's'); });
  const total = 0.3 + items.length * 0.2;

  function start() {
    document.body.classList.add('go');
    setTimeout(() => extras.classList.add('show'), (total + 0.6) * 1000);
    if (!reduce) petals();
  }
  function open() {
    if (intro.classList.contains('open')) return;
    intro.classList.add('open');
    setTimeout(() => { intro.classList.add('gone'); start(); }, reduce ? 50 : 2100);
    setTimeout(() => intro.remove(), reduce ? 200 : 3200);
  }
  seal.addEventListener('click', open);
  intro.addEventListener('click', (e) => { if (e.target.closest('.env')) open(); });

  /* ---------- العد التنازلي (15 أكتوبر 2026 - 5 م بتوقيت القاهرة) ---------- */
  const target = new Date('2026-10-15T17:00:00+03:00').getTime();
  const set = (id, v) => ($('#cd-' + id).textContent = v);
  function tick() {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    set('d', Math.floor(s / 86400)); s %= 86400;
    set('h', Math.floor(s / 3600)); s %= 3600;
    set('m', Math.floor(s / 60)); set('s', s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- إضافة للتقويم (ملف ICS) ---------- */
  $('#btn-cal').addEventListener('click', () => {
    const ev = (uid, start, end, title, loc) => ['BEGIN:VEVENT', `UID:${uid}@wedding`, 'DTSTAMP:20260101T000000Z',
      `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${title}`, `LOCATION:${loc}`, 'END:VEVENT'].join('\r\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding//AR//',
      ev('church', '20261015T140000Z', '20261015T153000Z', 'صلاة إكليل بيتر ومايفل', 'كنيسة السيدة العذراء مريم - العاشر من رمضان'),
      ev('hall', '20261015T160000Z', '20261015T200000Z', 'حفل زفاف بيتر ومايفل', 'قاعة رويال هاوس - العاشر من رمضان'),
      'END:VCALENDAR'].join('\r\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })), download: 'wedding.ics' });
    a.click(); URL.revokeObjectURL(a.href);
  });

  /* ---------- مشاركة ---------- */
  $('#btn-share').addEventListener('click', async () => {
    const data = { title: 'دعوة زفاف بيتر & مايفل', url: location.href };
    try { navigator.share ? await navigator.share(data) : (await navigator.clipboard.writeText(location.href), alert('تم نسخ الرابط')); } catch (_) {}
  });

  /* ---------- بتلات دهبية بتنزل ---------- */
  function petals() {
    const c = $('#petals'), x = c.getContext('2d');
    let w, h, dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => { w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); addEventListener('resize', resize);
    const cols = ['201,161,91', '226,190,120', '236,214,170'];
    const mk = (top) => ({ x: Math.random() * w, y: top ? -20 : Math.random() * h, s: 4 + Math.random() * 7, vy: 0.4 + Math.random() * 0.8,
      sw: Math.random() * 6.28, sv: 0.01 + Math.random() * 0.02, r: Math.random() * 6.28, rv: (Math.random() - 0.5) * 0.04, c: cols[Math.random() * 3 | 0], a: 0.35 + Math.random() * 0.45 });
    const ps = Array.from({ length: w < 600 ? 22 : 40 }, () => mk(false));
    (function loop() {
      if (document.hidden) return requestAnimationFrame(loop);
      x.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y += p.vy; p.sw += p.sv; p.r += p.rv; p.x += Math.sin(p.sw) * 0.6;
        if (p.y > h + 20) Object.assign(p, mk(true));
        x.save(); x.translate(p.x, p.y); x.rotate(p.r);
        x.fillStyle = `rgba(${p.c},${p.a})`;
        x.beginPath(); x.ellipse(0, 0, p.s, p.s * 0.45, 0, 0, 6.283); x.fill(); x.restore();
      }
      requestAnimationFrame(loop);
    })();
  }
})();
