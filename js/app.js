/* Site behavior: page switching, member cards, details pop-up and QR codes.
   Reads MEMBERS and SITE_URL from members.js. */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  function parseDate(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmtDate(iso) {
    try { return parseDate(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch (e) { return iso; }
  }
  function ageOf(iso) {
    var b = parseDate(iso), n = new Date();
    var a = n.getFullYear() - b.getFullYear();
    var m = n.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && n.getDate() < b.getDate())) a--;
    return a;
  }
  function initials(name) {
    var p = name.trim().split(/\s+/);
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }
  var PAIRS = [['#17335F', '#1B6B78'], ['#0F1D36', '#9A6F0A'], ['#1B6B78', '#17335F'], ['#2E2A63', '#17335F'], ['#7C5300', '#0F1D36'], ['#0E4D57', '#223454'], ['#2B3A67', '#9A6F0A'], ['#16406B', '#0E4D57']];
  function avatarUri(m, i) {
    var c = PAIRS[i % PAIRS.length];
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs>' +
      '<rect width="200" height="200" fill="url(#g)"/>' +
      '<g fill="none" stroke="#E2A71B" stroke-opacity=".28" stroke-width="1.5"><circle cx="150" cy="40" r="40"/><circle cx="150" cy="40" r="62"/><circle cx="150" cy="40" r="84"/><circle cx="40" cy="170" r="30"/><circle cx="40" cy="170" r="52"/></g>' +
      '<text x="100" y="104" text-anchor="middle" dominant-baseline="central" font-family="Arial Narrow, Arial, sans-serif" font-weight="800" font-size="78" fill="#EEF2F8" letter-spacing="2">' + initials(m.name) + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function portrait(m, i, alt) {
    var img = document.createElement('img');
    img.alt = alt || '';
    img.decoding = 'async';
    var fallback = avatarUri(m, i);
    img.addEventListener('error', function () { img.onerror = null; img.src = fallback; });
    img.src = m.photo || fallback;
    return img;
  }

  /* ---------- QR codes and member links ---------- */
  var inViewer = !!window.claude; // the preview frame blocks printing and downloads
  function slug(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  (function ensureIds() {
    var seen = {};
    MEMBERS.forEach(function (m) {
      var id = slug(m.id || m.name) || 'member', base = id, n = 2;
      while (seen[id]) { id = base + '-' + n++; }
      seen[id] = true; m.id = id;
    });
  })();
  function baseUrl() { return SITE_URL || (location.origin + location.pathname); }
  function memberUrl(m) { return baseUrl().replace(/#.*$/, '') + '#member-' + m.id; }
  function qrDataUrl(text, target) {
    if (typeof qrcode !== 'function') return '';
    var qr = qrcode(0, 'M'); qr.addData(text); qr.make();
    var n = qr.getModuleCount(), quiet = 4, cell = Math.max(2, Math.ceil(target / (n + quiet * 2)));
    var size = (n + quiet * 2) * cell;
    var c = document.createElement('canvas'); c.width = c.height = size;
    var x = c.getContext('2d');
    x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, size, size);
    x.fillStyle = '#0B1730';
    for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (qr.isDark(r, k)) x.fillRect((k + quiet) * cell, (r + quiet) * cell, cell, cell);
    return c.toDataURL('image/png');
  }
  function indexOfId(id) { for (var i = 0; i < MEMBERS.length; i++) if (MEMBERS[i].id === id) return i; return -1; }

  /* ---------- tick marks for the compass ---------- */
  (function ticks() {
    var g = $('#ticks'); if (!g) return;
    var NS = 'http://www.w3.org/2000/svg', out = '';
    for (var i = 0; i < 72; i++) {
      var a = i * 5 * Math.PI / 180, major = i % 6 === 0;
      var r1 = major ? 164 : 174, r2 = 186;
      var x1 = 200 + Math.sin(a) * r1, y1 = 200 - Math.cos(a) * r1;
      var x2 = 200 + Math.sin(a) * r2, y2 = 200 - Math.cos(a) * r2;
      out += '<line x1="' + x1.toFixed(2) + '" y1="' + y1.toFixed(2) + '" x2="' + x2.toFixed(2) + '" y2="' + y2.toFixed(2) +
        '" stroke="' + (major ? '#E2A71B' : 'rgba(238,242,248,.35)') + '" stroke-width="' + (major ? 2 : 1) + '"/>';
    }
    g.innerHTML = out;
  })();

  /* ---------- topographic lines (hero canvas) ---------- */
  var topoCanvas = $('#topo');
  function drawTopo() {
    if (!topoCanvas) return;
    var host = topoCanvas.parentElement;
    var w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    topoCanvas.width = Math.round(w * dpr);
    topoCanvas.height = Math.round(h * dpr);
    var ctx = topoCanvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var hills = [
      { x: 0.80, y: 0.30, ph: 0.4, ph2: 1.7, step: 28, n: 26 },
      { x: 0.10, y: 0.95, ph: 2.1, ph2: 0.3, step: 30, n: 22 },
      { x: 0.46, y: 1.12, ph: 4.0, ph2: 2.6, step: 26, n: 18 }
    ];
    ctx.lineWidth = 1;
    hills.forEach(function (c) {
      var cx = c.x * w, cy = c.y * h;
      for (var k = 1; k <= c.n; k++) {
        var r = k * c.step;
        ctx.beginPath();
        for (var t = 0; t <= Math.PI * 2 + 0.05; t += 0.05) {
          var rad = r * (1 + 0.09 * Math.sin(3 * t + c.ph + k * 0.22) + 0.05 * Math.sin(5 * t + c.ph2 + k * 0.13));
          var x = cx + Math.cos(t) * rad, y = cy + Math.sin(t) * rad;
          if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        var alpha = Math.max(0.04, 0.24 - k * 0.008);
        ctx.strokeStyle = 'rgba(226,167,27,' + alpha.toFixed(3) + ')';
        ctx.stroke();
      }
    });
  }
  var rsT;
  window.addEventListener('resize', function () { clearTimeout(rsT); rsT = setTimeout(drawTopo, 150); });

  /* ---------- stats ---------- */
  function countUp(el, to) {
    if (reduce || to === 0) { el.textContent = to; return; }
    var start = null, dur = 1200;
    el.textContent = '0';
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(step); else el.textContent = to;
    }
    requestAnimationFrame(step);
  }
  function runStats() {
    var totals = {
      members: MEMBERS.length,
      achievements: MEMBERS.reduce(function (s, m) { return s + m.achievements.length; }, 0),
      certificates: MEMBERS.reduce(function (s, m) { return s + m.certificates.length; }, 0)
    };
    $$('[data-count]').forEach(function (el) { el.textContent = totals[el.dataset.count]; countUp(el, totals[el.dataset.count]); });
  }

  /* ---------- roster ---------- */
  var grid = $('#grid'), emptyMsg = $('#empty'), countLabel = $('#countLabel'), search = $('#q');
  var visible = MEMBERS.map(function (m, i) { return i; });
  var lastFocus = null;

  var ICON_GO = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>';

  function renderGrid() {
    grid.innerHTML = '';
    visible.forEach(function (idx, pos) {
      var m = MEMBERS[idx];
      var li = document.createElement('li');
      li.style.setProperty('--i', pos);
      li.innerHTML =
        '<button class="card" type="button" data-idx="' + idx + '">' +
          '<span class="avatar"></span>' +
          '<span>' +
            '<span class="role">' + esc(m.role) + '</span>' +
            '<span class="name">' + esc(m.name) + '</span>' +
            '<span class="meta">' +
              '<span class="k">Born</span><span>' + esc(fmtDate(m.dob)) + '</span>' +
              '<span class="k">Address</span><span>' + esc(m.address) + '</span>' +
            '</span>' +
          '</span>' +
          '<span class="go" aria-hidden="true">' + ICON_GO + '</span>' +
        '</button>';
      $('.avatar', li).appendChild(portrait(m, idx, 'Portrait of ' + m.name));
      grid.appendChild(li);
    });
    emptyMsg.hidden = visible.length !== 0;
    countLabel.textContent = visible.length === MEMBERS.length
      ? MEMBERS.length + ' members'
      : visible.length + ' of ' + MEMBERS.length + ' members';
  }

  function applySearch() {
    var q = search.value.trim().toLowerCase();
    visible = [];
    MEMBERS.forEach(function (m, i) {
      var hay = (m.name + ' ' + m.role + ' ' + m.address).toLowerCase();
      if (!q || hay.indexOf(q) !== -1) visible.push(i);
    });
    renderGrid();
  }
  search.addEventListener('input', applySearch);

  /* ---------- modal ---------- */
  var dlg = $('#dlg');
  var ICON_CHECK = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="M6.5 10.2l2.4 2.4 4.6-5"/></svg>';
  var ICON_SEAL = '<svg viewBox="0 0 44 44" aria-hidden="true"><path d="M14 29l-3 12 11-5 11 5-3-12" fill="#9A6F0A"/><circle cx="22" cy="19" r="15" fill="#E2A71B"/><circle cx="22" cy="19" r="10.5" fill="none" stroke="#101A30" stroke-width="1.6" stroke-dasharray="2.2 2.2"/><path d="M22 13l1.9 4 4.4.5-3.2 3 .9 4.3-4-2.2-4 2.2.9-4.3-3.2-3 4.4-.5z" fill="#101A30"/></svg>';

  function fillDialog(idx) {
    var m = MEMBERS[idx];
    var av = $('#dlgAvatar'); av.innerHTML = '';
    av.appendChild(portrait(m, idx, 'Portrait of ' + m.name));
    $('#dlgRole').textContent = m.role;
    $('#dlgName').textContent = m.name;
    $('#dlgDob').textContent = fmtDate(m.dob);
    $('#dlgAge').textContent = ageOf(m.dob) + ' years old';
    $('#dlgAddr').textContent = m.address;
    $('#dlgAch').innerHTML = m.achievements.map(function (a, n) {
      return '<li style="--n:' + n + '">' + ICON_CHECK + '<span>' + esc(a) + '</span></li>';
    }).join('');
    $('#dlgCert').innerHTML = m.certificates.map(function (c, n) {
      return '<li style="--n:' + n + '">' + ICON_SEAL + '<span><b>' + esc(c.title) + '</b><small>' + esc(c.issuer) + ' · ' + esc(c.year) + '</small></span></li>';
    }).join('');
    var url = memberUrl(m), png = qrDataUrl(url, 640);
    var qrImg = $('#dlgQr');
    qrImg.src = png;
    qrImg.alt = 'QR code that opens the profile of ' + m.name;
    $('#dlgQrUrl').textContent = url;
    $('#pcQr').src = png; $('#pcName').textContent = m.name; $('#pcRole').textContent = m.role; $('#pcUrl').textContent = url;
    $('#qrHint').textContent = inViewer ? 'Press and hold the QR code to save the image, or take a screenshot to print it.' : '';
    $('#printBtn').hidden = $('#saveBtn').hidden = inViewer || !png;
    $('#copyBtn').textContent = 'Copy link';
    dlg.dataset.idx = idx;
  }
  function openMember(idx, trigger) {
    lastFocus = trigger || null;
    fillDialog(idx);
    try { history.replaceState(null, '', '#member-' + MEMBERS[idx].id); } catch (e) {}
    if (!dlg.open) {
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      document.documentElement.classList.add('lock');
    }
    dlg.scrollTop = 0;
  }
  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.card');
    if (btn) openMember(+btn.dataset.idx, btn);
  });
  $('#dlgClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  $('#copyBtn').addEventListener('click', function () {
    var btn = this, url = $('#dlgQrUrl').textContent;
    function done(ok) { btn.textContent = ok ? 'Link copied' : 'Press and hold the link to copy'; }
    try { navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); }); }
    catch (e) { done(false); }
  });
  $('#printBtn').addEventListener('click', function () { window.print(); });
  $('#saveBtn').addEventListener('click', function () {
    var m = MEMBERS[+dlg.dataset.idx], a = document.createElement('a');
    a.href = $('#dlgQr').src; a.download = 'masterguide-qr-' + m.id + '.png';
    document.body.appendChild(a); a.click(); a.remove();
  });
  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('lock');
    try { if (location.hash.indexOf('#member-') === 0) history.replaceState(null, '', '#members'); } catch (e) {}
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  });

  /* ---------- router (two views, hash based) ---------- */
  var views = { home: $('#view-home'), members: $('#view-members') };
  var navLinks = $$('nav a[data-view-link]');
  function show(name) {
    if (!views[name]) name = 'home';
    if (dlg.open) dlg.close();
    Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
    navLinks.forEach(function (a) {
      if (a.dataset.viewLink === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (name === 'home') { drawTopo(); }
    if (name === 'members') { renderGrid(); }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-view-link]');
    if (a) {
      e.preventDefault();
      var name = a.dataset.viewLink;
      show(name);
      try { if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name); } catch (err) {}
      return;
    }
    var s = e.target.closest('a[data-scroll]');
    if (s) {
      e.preventDefault();
      var t = document.getElementById(s.dataset.scroll);
      if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  });
  function route() {
    var h = location.hash.replace('#', '');
    if (h.indexOf('member-') === 0) {
      show('members');
      var idx = indexOfId(h.slice(7));
      if (idx > -1) openMember(idx, null);
      return;
    }
    show(h);
  }
  window.addEventListener('hashchange', route);

  /* ---------- start ---------- */
  route();
  runStats();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawTopo);
})();
