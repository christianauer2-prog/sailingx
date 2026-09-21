/* ==========================================================================
   SailingX-Academy – „Was fährt da?“ – Das wertvollste Kartenspiel für Segler*innen
   Zeichnen (Nacht/Tag), Töne (Web Audio), Lernkartei, Prüfung, Nachtwache.
   Rein statisch, Fortschritt nur im Browser (localStorage).
   ========================================================================== */
(function () {
  'use strict';
  var KARTEN = window.WFD_KARTEN || [], KAT = window.WFD_KAT || [], WACHE = window.WFD_WACHE || [];
  var BY = {}; KARTEN.forEach(function (c) { BY[c.id] = c; });
  var KATNAME = {}; KAT.forEach(function (k) { KATNAME[k.id] = k.name; });
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var uid = 0;

  /* ------------------------------------------------------------------ */
  /*  Seiten einer Karte                                                 */
  /* ------------------------------------------------------------------ */
  var NACHT_SZENEN = { sos: 1, rakete: 1, flammen: 1 }, TAG_SZENEN = { rauch: 1, arme: 1, nc: 1, ballquad: 1 };
  function faces(c) {
    if (c.only) return [c.only];
    var f = [];
    if ((c.night && c.night.length) || NACHT_SZENEN[c.scene]) f.push('nacht');
    if ((c.day && c.day.length) || TAG_SZENEN[c.scene]) f.push('tag');
    if (c.schall) f.push('schall');
    return f;
  }
  var ALL_ASP = ['vorn', 'stb', 'bb', 'achtern'];
  var ASP_NAME = { vorn: 'von vorn', stb: 'Steuerbordseite', bb: 'Backbordseite', achtern: 'von achtern' };
  function aspects(c) { return c.asp || ALL_ASP; }

  /* ------------------------------------------------------------------ */
  /*  Geometrie: Seitenansicht Steuerbord (Bug rechts), W 400 · H 240,   */
  /*  Wasserlinie y 178. Vorn = Blick auf den Bug.                       */
  /* ------------------------------------------------------------------ */
  var G = {
    motor:   { mast: 140, topp: [262, 100], seite: [160, 142], heck: [64, 160], ankerV: [320, 136], ankerH: [70, 150],
               v: { sdx: 44, sy: 150, topp: 104, heck: 154, ankerV: 134, ankerH: 150 } },
    gross:   { mast: 100, topp: [250, 112], topp2: [100, 92], seite: [112, 140], heck: [34, 162], ankerV: [352, 136], ankerH: [42, 154],
               v: { sdx: 60, sy: 146, topp: 122, topp2: 92, heck: 156, ankerV: 134, ankerH: 150 } },
    klein:   { mast: 176, rundW: [176, 112], seite: [248, 158], heck: [150, 162],
               v: { sdx: 18, sy: 160, rundW: 112, heck: 160 } },
    segel:   { mast: 208, toppS: [208, 112], seite: [292, 160], heck: [116, 160], kopf: [208, 44],
               v: { sdx: 16, sy: 164, toppS: 112, heck: 162, kopf: 44 } },
    jolle:   { mast: 205, lampe: [216, 164], v: { lampe: 164 } },
    fischer: { mast: 232, seite: [236, 146], heck: [74, 158], v: { sdx: 40, sy: 150, heck: 156 } },
    schlepp: { mast: 296, seite: [252, 146], heck: [196, 158], schlepp: [196, 138], toppY: [122, 100, 78], anhangSeite: [146, 162],
               v: { sdx: 34, sy: 150, heck: 156 } }
  };
  var LC = { w: '#fff6d8', r: '#ff3b30', g: '#2ee27a', y: '#ffc72c' };

  function lichter(c, asp) {
    var g = G[c.sil], n = c.night || [], L = [], side = asp === 'stb' || asp === 'bb', front = asp === 'vorn', back = asp === 'achtern';
    function X(x) { return asp === 'bb' ? 400 - x : x; }
    var stack = n.filter(function (t) { return /^rund[RWG]$/.test(t); }).map(function (t) { return t.slice(4).toLowerCase(); });
    var mastX = side ? X(g.mast) : 200;
    var top = 44;
    if (n.indexOf('topp2') > -1 && c.sil === 'gross') top = g.topp2[1] - 24 - 20 * (stack.length - 1);
    stack.forEach(function (col, i) { L.push([mastX, top + i * 20, col]); });
    n.forEach(function (t) {
      switch (t) {
        case 'topp':
          if (back) break;
          if (side) L.push([X(g.topp[0]), g.topp[1], 'w']);
          else L.push([200, stack.length && c.sil !== 'gross' ? Math.max(g.v.topp, top + stack.length * 20 + 12) : g.v.topp, 'w']);
          break;
        case 'topp2':
          if (back) break;
          L.push(side ? [X(g.topp2[0]), g.topp2[1], 'w'] : [200, g.v.topp2, 'w']);
          break;
        case 'toppS':
          if (!back) L.push(side ? [X(g.toppS[0]), g.toppS[1], 'w'] : [200, g.v.toppS, 'w']);
          break;
        case 'topp2v': case 'topp3v':
          if (back) break;
          var k = t === 'topp2v' ? 2 : 3;
          for (var i = 0; i < k; i++) L.push([side ? X(g.mast) : 200, g.toppY[i], 'w']);
          break;
        case 'seite':
          if (front) { L.push([200 - g.v.sdx, g.v.sy, 'g']); L.push([200 + g.v.sdx, g.v.sy, 'r']); }
          if (asp === 'stb') L.push([g.seite[0], g.seite[1], 'g']);
          if (asp === 'bb') L.push([400 - g.seite[0], g.seite[1], 'r']);
          break;
        case 'heck': if (back) L.push([200, g.v.heck, 'w']); break;
        case 'schlepp': if (back) L.push([200, g.v.heck - 20, 'y']); break;
        case 'anhang': if (side) L.push([X(g.anhangSeite[0]), g.anhangSeite[1], asp === 'stb' ? 'g' : 'r']); break;
        case 'weissRund':
          if (c.sil === 'klein') L.push(side ? [X(g.rundW[0]), g.rundW[1], 'w'] : [200, g.v.rundW, 'w']);
          break;
        case 'ankerV': L.push(side ? [X(g.ankerV[0]), g.ankerV[1], 'w'] : [200, g.v.ankerV, 'w']); break;
        case 'ankerH': L.push(side ? [X(g.ankerH[0]), g.ankerH[1], 'w'] : [200, g.v.ankerH, 'w']); break;
        case 'dreifarben':
          if (front) { L.push([195, g.v.kopf, 'g']); L.push([205, g.v.kopf, 'r']); }
          else if (asp === 'stb') L.push([g.kopf[0], g.kopf[1], 'g']);
          else if (asp === 'bb') L.push([400 - g.kopf[0], g.kopf[1], 'r']);
          else L.push([200, g.v.kopf, 'w']);
          break;
        case 'rotgruen':
          L.push([side ? X(g.kopf[0]) : 200, g.kopf[1], 'r']); L.push([side ? X(g.kopf[0]) : 200, g.kopf[1] + 20, 'g']);
          break;
        case 'lampe': L.push([side ? X(g.lampe[0]) : 200, g.lampe[1], 'w', 'weak']); break;
        case 'funkel': L.push([side ? X(g.mast) : 200, 30, 'y', 'blink']); break;
        case 'fang': if (side) L.push([X(g.mast - 64), 100, 'w']); break;
        case 'hindernisBb':
          // Bb-Seite gesperrt (rot-rot), Stb-Seite passierbar (grün-grün). Von vorn liegt Bb rechts.
          var rx = front ? 248 : 152, gx = front ? 152 : 248;
          L.push([rx, 100, 'r']); L.push([rx, 122, 'r']); L.push([gx, 100, 'g']); L.push([gx, 122, 'g']);
          break;
        case 'minen':
          L.push([200, 34, 'g']); L.push([152, 66, 'g']); L.push([248, 66, 'g']);
          break;
      }
    });
    return L;
  }

  /* ------------------------------------------------------------------ */
  /*  Silhouetten                                                        */
  /* ------------------------------------------------------------------ */
  function rumpf(sil, asp, f, st, sw) {
    var s = '', side = asp === 'stb' || asp === 'bb';
    sw = sw || 1.2;
    var A = ' fill="' + f + '" stroke="' + st + '" stroke-width="' + sw + '"';
    function mast(x, y1, y2, w) { return '<line x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + y2 + '" stroke="' + st + '" stroke-width="' + (w || 2.4) + '"/>'; }
    if (!side) {
      if (sil === 'segel') return '<path d="M176 178 L224 178 L232 162 L168 162 Z"' + A + '/>' + mast(200, 162, 40);
      if (sil === 'jolle') return '<path d="M186 178 L214 178 L220 168 L180 168 Z"' + A + '/>' + mast(200, 168, 118, 2);
      if (sil === 'klein') return '<path d="M178 178 L222 178 L230 162 L170 162 Z"' + A + '/><rect x="186" y="146" width="28" height="16"' + A + '/>' + mast(200, 146, 110, 2);
      var w = sil === 'gross' ? 72 : sil === 'schlepp' ? 44 : 58;
      s += '<path d="M' + (200 - w + 10) + ' 178 L' + (200 + w - 10) + ' 178 L' + (200 + w) + ' 154 L' + (200 - w) + ' 154 Z"' + A + '/>';
      s += '<rect x="' + (200 - w * .55) + '" y="' + (sil === 'schlepp' ? 118 : 126) + '" width="' + (w * 1.1) + '" height="' + (sil === 'schlepp' ? 36 : 28) + '"' + A + '/>';
      s += mast(200, 126, 30);
      return s;
    }
    var tr = asp === 'bb' ? ' transform="translate(400,0) scale(-1,1)"' : '';
    s += '<g' + tr + '>';
    switch (sil) {
      case 'segel':
        s += '<path d="M112 164 L300 164 Q292 176 276 180 L128 180 Q116 174 112 164 Z"' + A + '/>' + mast(208, 164, 40);
        s += '<line x1="208" y1="42" x2="298" y2="164" stroke="' + st + '" stroke-width="1"/>';
        s += '<path d="M204 48 L204 154 L134 156 Z"' + A + '/><path d="M212 50 L290 158 L214 156 Z"' + A + '/>';
        break;
      case 'jolle':
        s += '<path d="M168 170 L246 170 Q240 178 230 180 L176 180 Z"' + A + '/>' + mast(205, 170, 118, 2) + '<path d="M202 122 L202 164 L176 166 Z"' + A + '/>';
        break;
      case 'klein':
        s += '<path d="M140 164 L268 164 L276 156 L264 180 L150 180 Z"' + A + '/><rect x="160" y="140" width="46" height="24"' + A + '/>' + mast(176, 140, 108, 2);
        break;
      case 'fischer':
        s += '<path d="M70 162 L318 162 L334 146 L322 180 L84 180 Z"' + A + '/><rect x="200" y="126" width="62" height="36"' + A + '/>' + mast(232, 126, 40);
        s += '<path d="M86 162 L86 110 L128 110 L128 162" fill="none" stroke="' + st + '" stroke-width="3"/><line x1="86" y1="112" x2="30" y2="178" stroke="' + st + '" stroke-width="1" stroke-dasharray="3 3"/>';
        break;
      case 'gross':
        s += '<path d="M30 160 L352 160 L374 140 L362 180 L42 180 Z"' + A + '/><rect x="50" y="118" width="74" height="42"' + A + '/><rect x="62" y="102" width="28" height="16"' + A + '/>';
        s += mast(100, 118, 26) + mast(250, 160, 108);
        break;
      case 'schlepp':
        s += '<path d="M190 160 L318 160 L334 146 L324 180 L198 180 Z"' + A + '/><rect x="232" y="124" width="48" height="36"' + A + '/>' + mast(296, 160, 70);
        s += '<path d="M20 164 L150 164 L154 180 L24 180 Z"' + A + '/>';
        s += '<path d="M196 170 Q172 176 152 170" fill="none" stroke="' + st + '" stroke-width="1.2" stroke-dasharray="4 3"/>';
        break;
      default:
        s += '<path d="M60 160 L318 160 L338 144 L326 180 L72 180 Z"' + A + '/><rect x="90" y="120" width="70" height="40"' + A + '/><rect x="104" y="104" width="22" height="16"' + A + '/>';
        s += mast(140, 120, 34) + mast(262, 160, 98);
    }
    return s + '</g>';
  }

  /* ------------------------------------------------------------------ */
  /*  Nachtszene                                                         */
  /* ------------------------------------------------------------------ */
  function sterne() {
    var s = '', p = [[28, 24], [80, 52], [130, 18], [176, 40], [240, 14], [300, 36], [352, 62], [372, 20], [60, 96], [330, 104], [210, 70], [110, 80]];
    p.forEach(function (q, i) { s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (i % 3 ? .8 : 1.1) + '" fill="#7c8e9a" opacity="' + (i % 2 ? .7 : .45) + '"/>'; });
    return s;
  }
  function glow(x, y, c, id, mod) {
    var col = LC[c], weak = mod === 'weak', cls = mod === 'blink' ? ' class="wfd-blink"' : '';
    return '<g' + cls + '><circle cx="' + x + '" cy="' + y + '" r="' + (weak ? 7 : 12) + '" fill="' + col + '" opacity="' + (weak ? .3 : .45) + '" filter="url(#gl' + id + ')"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (weak ? 2.8 : 4.2) + '" fill="' + col + '"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (weak ? 1.2 : 1.8) + '" fill="#fff" opacity=".8"/></g>';
  }
  function defsNacht(id) {
    return '<defs><linearGradient id="nh' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03070a"/><stop offset=".72" stop-color="#0b1823"/><stop offset="1" stop-color="#050c11"/></linearGradient>' +
      '<filter id="gl' + id + '" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="5"/></filter></defs>';
  }
  function nacht(c, asp, opt) {
    opt = opt || {};
    if (c.scene && NACHT_SZENEN[c.scene]) return szene(c.scene);
    var id = ++uid, s = '<svg viewBox="0 0 400 240" role="img" aria-label="Nachtszene – Lichter eines Fahrzeugs">' + defsNacht(id);
    if (!opt.nurLichter) {
      s += '<rect width="400" height="240" fill="url(#nh' + id + ')"/>' + sterne();
      s += '<rect y="178" width="400" height="62" fill="#050b10"/><line x1="0" y1="178" x2="400" y2="178" stroke="#17293a"/>';
      s += rumpf(c.sil, asp, opt.sil ? '#1a2f3e' : '#0c1822', opt.sil ? '#2c4a5e' : '#101f2a');
    }
    lichter(c, asp).forEach(function (l) { s += glow(l[0], l[1], l[2], id, l[3]); });
    return s + '</svg>';
  }

  /* ------------------------------------------------------------------ */
  /*  Tagszene (Signalkörper)                                            */
  /* ------------------------------------------------------------------ */
  var K = '#101417';
  function form(t, cx, cy) {
    switch (t) {
      case 'ball': return '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="' + K + '"/>';
      case 'kegelU': return '<polygon points="' + cx + ',' + (cy + 11) + ' ' + (cx - 10) + ',' + (cy - 9) + ' ' + (cx + 10) + ',' + (cy - 9) + '" fill="' + K + '"/>';
      case 'kegelO': return '<polygon points="' + cx + ',' + (cy - 11) + ' ' + (cx - 10) + ',' + (cy + 9) + ' ' + (cx + 10) + ',' + (cy + 9) + '" fill="' + K + '"/>';
      case 'rhombus': return '<polygon points="' + cx + ',' + (cy - 12) + ' ' + (cx + 9) + ',' + cy + ' ' + cx + ',' + (cy + 12) + ' ' + (cx - 9) + ',' + cy + '" fill="' + K + '"/>';
      case 'zylinder': return '<rect x="' + (cx - 8) + '" y="' + (cy - 12) + '" width="16" height="24" fill="' + K + '"/>';
      case 'stunde': return '<polygon points="' + (cx - 10) + ',' + (cy - 18) + ' ' + (cx + 10) + ',' + (cy - 18) + ' ' + cx + ',' + cy + '" fill="' + K + '"/><polygon points="' + (cx - 10) + ',' + (cy + 18) + ' ' + (cx + 10) + ',' + (cy + 18) + ' ' + cx + ',' + cy + '" fill="' + K + '"/>';
      case 'flagH': return '<rect x="' + (cx + 1) + '" y="' + (cy - 12) + '" width="16" height="24" fill="#fff" stroke="#5b6770" stroke-width=".8"/><rect x="' + (cx + 17) + '" y="' + (cy - 12) + '" width="16" height="24" fill="#d7263d" stroke="#5b6770" stroke-width=".8"/>';
      case 'flagA': return '<path d="M' + (cx + 1) + ' ' + (cy - 16) + ' h20 v32 h-20 Z" fill="#fff" stroke="#5b6770" stroke-width=".8"/><path d="M' + (cx + 21) + ' ' + (cy - 16) + ' h22 l-10 16 l10 16 h-22 Z" fill="#1f5fbf" stroke="#5b6770" stroke-width=".8"/>';
    }
    return '';
  }
  function tagHimmel(id) {
    return '<defs><linearGradient id="th' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9dcf0"/><stop offset="1" stop-color="#eef7fc"/></linearGradient></defs>' +
      '<rect width="400" height="240" fill="url(#th' + id + ')"/><rect y="178" width="400" height="62" fill="#2f6f8f"/>' +
      '<path d="M0 184 Q40 180 80 184 T160 184 T240 184 T320 184 T400 184" stroke="#6aa3bf" stroke-width="2" fill="none"/>';
  }
  function tag(c) {
    if (c.scene && TAG_SZENEN[c.scene]) return szene(c.scene);
    var id = ++uid, s = '<svg viewBox="0 0 400 240" role="img" aria-label="Tagszene – Signalkörper">' + tagHimmel(id);
    var vorn = c.dayView === 'vorn', g = G[c.sil];
    s += rumpf(c.sil, vorn ? 'vorn' : 'stb', c.sil === 'segel' || c.sil === 'jolle' ? '#f3f6f8' : '#c3ccd2', '#5b6770', 1.5);
    var items = c.day || [];
    if (vorn) {
      if (c.dayExtra === 'hindernisBb' || c.day[0] === 'minen') s += '<line x1="146" y1="82" x2="254" y2="82" stroke="#5b6770" stroke-width="2.4"/>';
      if (items[0] === 'minen') { s += form('ball', 200, 40) + form('ball', 152, 94) + form('ball', 248, 94); }
      else {
        items.forEach(function (t, i) { s += form(t, 200, 40 + i * 24); });
        if (c.dayExtra === 'hindernisBb') { s += form('ball', 248, 100) + form('ball', 248, 122) + form('rhombus', 152, 102) + form('rhombus', 152, 128); }
      }
      return s + '</svg>';
    }
    var x = c.dayMast === 'vorn' ? (g.ankerV ? g.ankerV[0] - 6 : g.mast) : g.mast - (c.sil === 'segel' ? -38 : 0);
    if (c.sil === 'klein') x = 176;
    var y0 = c.dayMast === 'vorn' ? 104 : (c.sil === 'segel' ? 84 : 52);
    if (items.length === 1 && (items[0] === 'flagA' || items[0] === 'flagH')) {
      s += '<line x1="' + x + '" y1="' + (y0 - 22) + '" x2="' + x + '" y2="' + (y0 + 26) + '" stroke="#5b6770" stroke-width="1.4"/>' + form(items[0], x, y0);
      return s + '</svg>';
    }
    if (c.dayMast === 'vorn') s += '<line x1="' + x + '" y1="' + (y0 - 14) + '" x2="' + x + '" y2="160" stroke="#5b6770" stroke-width="2"/>';
    s += '<line x1="' + x + '" y1="' + (y0 - 16) + '" x2="' + x + '" y2="' + (y0 + (items.length - 1) * 28 + 16) + '" stroke="#5b6770" stroke-width="1"/>';
    items.forEach(function (t, i) { s += form(t, x, y0 + i * 28); });
    if (c.dayExtra === 'fang') s += '<line x1="' + x + '" y1="' + (y0 + 44) + '" x2="' + (x - 64) + '" y2="' + (y0 + 44) + '" stroke="#5b6770" stroke-width="1"/>' + form('kegelO', x - 64, y0 + 58);
    return s + '</svg>';
  }

  /* ------------------------------------------------------------------ */
  /*  Sonderszenen (Notsignale)                                          */
  /* ------------------------------------------------------------------ */
  function szene(n) {
    var id = ++uid, s;
    var boot = '<path d="M150 164 L262 164 Q256 176 244 180 L160 180 Z" fill="#0c1822" stroke="#1d3446"/><line x1="206" y1="164" x2="206" y2="70" stroke="#1d3446" stroke-width="2.4"/>';
    var bootTag = '<path d="M150 164 L262 164 Q256 176 244 180 L160 180 Z" fill="#f3f6f8" stroke="#5b6770" stroke-width="1.5"/><line x1="206" y1="164" x2="206" y2="60" stroke="#5b6770" stroke-width="2.4"/>';
    if (n === 'sos' || n === 'rakete' || n === 'flammen') {
      s = '<svg viewBox="0 0 400 240" role="img" aria-label="Nachtszene">' + defsNacht(id) + '<rect width="400" height="240" fill="url(#nh' + id + ')"/>' + sterne() +
        '<rect y="178" width="400" height="62" fill="#050b10"/><line x1="0" y1="178" x2="400" y2="178" stroke="#17293a"/>' + boot;
      if (n === 'sos') s += '<g class="wfd-sos">' + glow(206, 120, 'w', id) + '</g>';
      if (n === 'rakete') {
        s += '<path d="M120 178 Q118 110 130 58" fill="none" stroke="#ff8a7a" stroke-width="1.2" opacity=".5" stroke-dasharray="2 4"/>';
        s += '<circle cx="130" cy="52" r="26" fill="#ff3b30" opacity=".25" filter="url(#gl' + id + ')"/><circle cx="130" cy="52" r="6" fill="#ff3b30"/><circle cx="130" cy="52" r="2.4" fill="#fff"/>';
        s += '<path d="M122 40 Q130 30 138 40" fill="none" stroke="#6b7c88" stroke-width="1"/>';
      }
      if (n === 'flammen') {
        s += '<g class="wfd-flicker"><path d="M226 164 C220 140 236 138 232 116 C248 132 252 146 246 164 Z" fill="#ff7a1a"/><path d="M232 164 C229 150 238 146 236 132 C244 144 246 154 242 164 Z" fill="#ffd23f"/></g>';
        s += '<circle cx="236" cy="140" r="30" fill="#ff7a1a" opacity=".25" filter="url(#gl' + id + ')"/><rect x="226" y="160" width="22" height="8" fill="#3a2a1a"/>';
      }
      return s + '</svg>';
    }
    s = '<svg viewBox="0 0 400 240" role="img" aria-label="Tagszene">' + tagHimmel(id);
    if (n === 'rauch') {
      s += bootTag + '<g class="wfd-smoke">';
      [[236, 150, 10], [246, 128, 16], [260, 100, 22], [280, 72, 28], [306, 46, 32]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="#ff8c1a" opacity=".75"/>'; });
      s += '</g><rect x="230" y="156" width="10" height="8" fill="#e05a00"/>';
    }
    if (n === 'arme') {
      s += '<path d="M150 164 L262 164 Q256 176 244 180 L160 180 Z" fill="#f3f6f8" stroke="#5b6770" stroke-width="1.5"/>';
      s += '<circle cx="206" cy="112" r="9" fill="#f2c9a0" stroke="#8a5a2b"/><rect x="198" y="122" width="16" height="30" rx="4" fill="#f39129"/><rect x="198" y="150" width="16" height="14" fill="#1f5a78"/>';
      s += '<g class="wfd-arms"><line x1="200" y1="128" x2="160" y2="116" stroke="#f39129" stroke-width="6" stroke-linecap="round"/><line x1="212" y1="128" x2="252" y2="116" stroke="#f39129" stroke-width="6" stroke-linecap="round"/></g>';
      s += '<path d="M146 92 v-18 m0 0 l-5 7 m5 -7 l5 7 M146 132 v18 m0 0 l-5 -7 m5 7 l5 -7" stroke="#1f5a78" stroke-width="2" fill="none"/>';
      s += '<path d="M266 92 v-18 m0 0 l-5 7 m5 -7 l5 7 M266 132 v18 m0 0 l-5 -7 m5 7 l5 -7" stroke="#1f5a78" stroke-width="2" fill="none"/>';
    }
    if (n === 'nc') {
      s += bootTag + '<line x1="206" y1="60" x2="180" y2="164" stroke="#5b6770" stroke-width="1"/>';
      var fx = 212, fy = 64;
      for (var r = 0; r < 4; r++) for (var q = 0; q < 4; q++) s += '<rect x="' + (fx + q * 9) + '" y="' + (fy + r * 6.5) + '" width="9" height="6.5" fill="' + ((r + q) % 2 ? '#fff' : '#1f3f9f') + '"/>';
      s += '<rect x="' + fx + '" y="' + fy + '" width="36" height="26" fill="none" stroke="#5b6770" stroke-width=".8"/>';
      var cy = 96, cols = ['#1f3f9f', '#fff', '#d7263d', '#fff', '#1f3f9f'];
      cols.forEach(function (col, i) { s += '<rect x="' + fx + '" y="' + (cy + i * 5.2) + '" width="36" height="5.2" fill="' + col + '"/>'; });
      s += '<rect x="' + fx + '" y="' + cy + '" width="36" height="26" fill="none" stroke="#5b6770" stroke-width=".8"/>';
    }
    if (n === 'ballquad') {
      s += bootTag + '<rect x="212" y="66" width="30" height="30" fill="#101417"/><circle cx="227" cy="114" r="9" fill="#101417"/>';
    }
    return s + '</svg>';
  }

  /* ------------------------------------------------------------------ */
  /*  Schall: Darstellung und Web-Audio                                  */
  /* ------------------------------------------------------------------ */
  var BELL = '<svg viewBox="0 0 26 28" aria-hidden="true"><path d="M13 3 C7 3 6 9 6 14 L3 21 L23 21 L20 14 C20 9 19 3 13 3 Z" fill="currentColor"/><circle cx="13" cy="24" r="2.6" fill="currentColor"/></svg>';
  var GONG = '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="14" cy="14" r="4" fill="currentColor"/></svg>';
  function muster(p, cls) {
    var h = '';
    p.split('').forEach(function (ch) {
      if (ch === 'S') h += '<i class="t-s" title="kurz"></i>';
      else if (ch === 'L') h += '<i class="t-l" title="lang"></i>';
      else if (ch === 'D') h += '<i class="t-d" title="Dauerton"></i>';
      else if (ch === '.') h += '<i class="t-p" title="Morse kurz"></i>';
      else if (ch === '-') h += '<i class="t-m" title="Morse lang"></i>';
      else if (ch === '_') h += '<i class="t-gap"></i>';
      else if (ch === 'B') h += '<i class="t-b" title="Glockenschlag">' + BELL + '</i>';
      else if (ch === 'R') h += '<i class="t-r" title="Glocke läuten">' + BELL + BELL + BELL + '</i>';
      else if (ch === 'G') h += '<i class="t-g" title="Gong">' + GONG + '</i>';
    });
    return '<div class="' + (cls || 'muster') + '">' + h + '</div>';
  }
  var AC = null, stopAll = [];
  function ctx() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } return AC; }
  function horn(a, t, d) {
    var g = a.createGain(), lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100;
    [155, 157.5, 310].forEach(function (f, i) { var o = a.createOscillator(); o.type = i === 2 ? 'square' : 'sawtooth'; o.frequency.value = f; var og = a.createGain(); og.gain.value = i === 2 ? .12 : .3; o.connect(og); og.connect(lp); o.start(t); o.stop(t + d + .1); stopAll.push(o); });
    lp.connect(g); g.connect(a.destination);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.32, t + .05); g.gain.setValueAtTime(.32, t + Math.max(.06, d - .08)); g.gain.linearRampToValueAtTime(0, t + d);
  }
  function bell(a, t, v, base) {
    base = base || 880;
    [[1, 1], [2.3, .45], [3.5, .25], [4.7, .12]].forEach(function (p) {
      var o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = base * p[0];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.2 * p[1] * (v || 1), t + .005); g.gain.exponentialRampToValueAtTime(.0005, t + 1.3);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + 1.4); stopAll.push(o);
    });
  }
  function gong(a, t, d) {
    for (var k = 0; k < d; k += .5) {
      [[118, 1], [192, .5], [277, .35], [401, .2]].forEach(function (p) {
        var o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = p[0];
        g.gain.setValueAtTime(0, t + k); g.gain.linearRampToValueAtTime(.16 * p[1], t + k + .02); g.gain.exponentialRampToValueAtTime(.0005, t + k + 1.6);
        o.connect(g); g.connect(a.destination); o.start(t + k); o.stop(t + k + 1.7); stopAll.push(o);
      });
    }
  }
  function spielen(p, box) {
    var a = ctx(); if (!a) return;
    if (a.state === 'suspended') a.resume();
    stopAll.forEach(function (o) { try { o.stop(); } catch (e) {} }); stopAll = [];
    var t = a.currentTime + .08, t0 = t, marks = [], KU = .7, LA = 2.6, PA = .5, MU = .2;
    p.split('').forEach(function (ch) {
      if (ch === 'S') { horn(a, t, KU); marks.push([t, KU]); t += KU + PA; }
      else if (ch === 'L') { horn(a, t, LA); marks.push([t, LA]); t += LA + PA; }
      else if (ch === 'D') { horn(a, t, 6); marks.push([t, 6]); t += 6.3; }
      else if (ch === '.') { horn(a, t, MU); marks.push([t, MU]); t += MU * 2; }
      else if (ch === '-') { horn(a, t, MU * 3); marks.push([t, MU * 3]); t += MU * 4; }
      else if (ch === '_') { t += .5; marks.push(null); }
      else if (ch === 'B') { bell(a, t, 1); marks.push([t, .35]); t += .6; }
      else if (ch === 'R') { var r0 = t; for (var i = 0; i < 26; i++) { bell(a, t, .7); t += .16; } marks.push([r0, t - r0]); t += .4; }
      else if (ch === 'G') { gong(a, t, 4); marks.push([t, 4.5]); t += 5; }
    });
    if (!box) return;
    var els = box.querySelectorAll('i'), now = a.currentTime;
    marks.forEach(function (m, i) {
      var el = els[i]; if (!el || !m) return;
      setTimeout(function () { el.classList.add('on'); }, (m[0] - now) * 1000);
      setTimeout(function () { el.classList.remove('on'); }, (m[0] - now + m[1]) * 1000);
    });
  }
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 L20 12 L7 20 Z" fill="currentColor"/></svg>';
  function schallBox(c, gross) {
    return '<div class="schall-box' + (gross ? ' gross' : '') + '">' + muster(c.schall) +
      '<button type="button" class="wfd-play" data-p="' + esc(c.schall) + '" aria-label="Signal anhören">' + PLAY + '</button>' +
      (gross ? '<div class="schall-leg"><span><i class="t-s"></i>kurz</span><span><i class="t-l"></i>lang</span><span class="bl">' + BELL + 'Glocke</span></div><p class="schall-note">Zeitlich verkürzt – im Original: kurz etwa 1 s, lang 4–6 s.</p>' : '') + '</div>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.wfd-play');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var root = b.parentNode.querySelector('.muster, .muster-mini');
    spielen(b.getAttribute('data-p'), root);
  });

  /* ------------------------------------------------------------------ */
  /*  Kartenrückseite / Detail                                           */
  /* ------------------------------------------------------------------ */
  function detail(c, opts) {
    opts = opts || {};
    var f = faces(c), h = '<div class="d-head"><div class="d-cat">' + esc(KATNAME[c.cat]) + '</div><h3>' + esc(c.name) + '</h3><div class="d-rule">' + esc(c.rule) + '</div></div><div class="d-body">';
    if (opts.ohneTrio) {} else if (f.length > 1 || opts.voll) {
      h += '<div class="d-trio d-n' + f.length + '">';
      if (f.indexOf('nacht') > -1) h += '<div class="mini m-nacht"><div class="mh">Nacht</div><div class="mv">' + nacht(c, aspects(c)[0], { sil: true }) + '</div><div class="mt">' + (c.scene ? 'bei Nacht' : ASP_NAME[aspects(c)[0]]) + '</div></div>';
      if (f.indexOf('tag') > -1) h += '<div class="mini m-tag"><div class="mh">Tag</div><div class="mv">' + tag(c) + '</div><div class="mt">' + esc(c.dayText || 'am Tag') + '</div></div>';
      if (f.indexOf('schall') > -1) h += '<div class="mini m-schall"><div class="mh">Schall</div><div class="mv">' + muster(c.schall, 'muster-mini') + '<button type="button" class="wfd-play mini-play" data-p="' + esc(c.schall) + '">' + PLAY + ' anhören</button></div><div class="mt">' + (c.only ? 'Signal' : 'im Nebel') + '</div></div>';
      h += '</div>';
    } else if (f[0] === 'schall') {
      h += '<div class="d-solo">' + muster(c.schall, 'muster-mini') + '<button type="button" class="wfd-play mini-play" data-p="' + esc(c.schall) + '">' + PLAY + ' anhören</button></div>';
    }
    if (c.schallText) h += '<p class="d-fact"><b>Schall:</b> ' + esc(c.schallText) + '</p>';
    if (c.dayText && f.indexOf('tag') > -1 && f.length === 1) h += '<p class="d-fact"><b>Tag:</b> ' + esc(c.dayText) + '</p>';
    h += '<p class="d-memo"><b>Merkhilfe:</b> ' + esc(c.memo) + '</p>';
    h += '<p class="d-todo"><b>Als Segler:</b> ' + esc(c.todo) + '</p>';
    return h + '</div>';
  }

  /* ------------------------------------------------------------------ */
  /*  Frageseite                                                         */
  /* ------------------------------------------------------------------ */
  var FRAGE = { nacht: 'Nachts siehst du diese Lichter. Was ist das?', tag: 'Tagsüber siehst du dieses Zeichen. Was bedeutet es?', schall: 'Du hörst dieses Signal. Was bedeutet es?' };
  function frageSeite(c, face, asp, opt) {
    opt = opt || {};
    var h = '<div class="q-top"><span class="face face-' + face + '">' + { nacht: 'Nacht', tag: 'Tag', schall: 'Schall' }[face] + '</span><b>' + { nacht: 'Was siehst du?', tag: 'Was bedeutet das?', schall: 'Was hörst du?' }[face] + '</b></div>';
    if (face === 'nacht') {
      h += '<div class="q-scene">' + nacht(c, asp) + '</div>';
      if (!c.scene && opt.aspektwahl !== false && aspects(c).length > 1) h += '<div class="q-asp" role="group" aria-label="Blickwinkel">' + aspects(c).map(function (a) { return '<button type="button" data-asp="' + a + '" aria-pressed="' + (a === asp) + '">' + ASP_NAME[a] + '</button>'; }).join('') + '</div>';
    } else if (face === 'tag') {
      h += '<div class="q-scene">' + tag(c) + '</div>';
    } else {
      h += '<div class="q-scene q-schall">' + schallBox(c, true) + '</div>';
    }
    h += '<p class="q-text">' + FRAGE[face] + (face === 'nacht' && !c.scene ? ' <span>Blickwinkel: ' + ASP_NAME[asp] + '</span>' : '') + '</p>';
    return h;
  }

  /* ------------------------------------------------------------------ */
  /*  Fortschritt (Lernkartei)                                           */
  /* ------------------------------------------------------------------ */
  var KEY = 'segelacademy_wfd_v1', TAG_MS = 864e5, INTERVALL = [0, 0, 1, 2, 4, 8];
  function laden() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  var ST = laden();
  function speichern() { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} }
  function alleSeiten(filter) {
    var r = [];
    KARTEN.forEach(function (c) { if (filter && !filter(c)) return; faces(c).forEach(function (f) { r.push(c.id + ':' + f); }); });
    return r;
  }
  function fach(k) { return ST[k] ? ST[k].b : 0; }
  function bewerten(k, r) {
    var b = fach(k) || 1;
    if (r === 3) b = Math.min(5, (fach(k) || 0) + 1); else if (r === 1) b = 1;
    ST[k] = { b: b, d: Date.now() + INTERVALL[b] * TAG_MS * (r === 3 ? 1 : 0) };
    speichern();
  }
  function faellig(k) { var s = ST[k]; return !s || s.d <= Date.now(); }

  /* ------------------------------------------------------------------ */
  /*  Filter (Kategorie, Lektion)                                        */
  /* ------------------------------------------------------------------ */
  var SETS = {
    d24: { name: 'Lektion D.2.4', f: function (c) { return ['m50', 'm50plus', 'segel', 'dreifarben', 'rotgruen', 'm12', 'motorsegler'].indexOf(c.id) > -1; } },
    d25: { name: 'Lektion D.2.5', f: function (c) { return ['maschine', 'segel', 'schlepp', 'behindert', 'fischer', 'anker'].indexOf(c.cat) > -1 && !c.only; } },
    d26: { name: 'Lektion D.2.6', f: function (c) { return !!c.schall && c.cat !== 'not'; } },
    f9: { name: 'Lektion F.9', f: function (c) { return c.cat === 'not'; } }
  };
  var filterKat = 'alle', filterSet = null;
  function passt(c) { if (filterSet && SETS[filterSet] && !SETS[filterSet].f(c)) return false; return filterKat === 'alle' || c.cat === filterKat; }
  function filterLeiste(ziel, onchange) {
    var box = $(ziel); if (!box) return;
    var h = '<button type="button" data-kat="alle" aria-pressed="' + (filterKat === 'alle') + '">Alle</button>';
    KAT.forEach(function (k) { h += '<button type="button" data-kat="' + k.id + '" aria-pressed="' + (filterKat === k.id) + '">' + esc(k.name) + '</button>'; });
    if (filterSet) h = '<span class="set-chip">' + esc(SETS[filterSet].name) + ' <button type="button" data-set-off aria-label="Filter aufheben">×</button></span>' + h;
    box.innerHTML = h;
    box.querySelectorAll('[data-kat]').forEach(function (b) { b.onclick = function () { filterKat = b.getAttribute('data-kat'); onchange(); }; });
    var off = box.querySelector('[data-set-off]'); if (off) off.onclick = function () { filterSet = null; onchange(); };
  }
  function alleFilter() { ['lern-filter', 'tr-filter', 'pr-filter'].forEach(function (id) { filterLeiste(id, alleFilterNeu); }); }
  function alleFilterNeu() { lernen(); if (aktiv === 'trainer') trainerStart(); else trainerDirty = true; if (aktiv === 'pruefung') pruefungStart(); else pr = null; alleFilter(); }

  /* ------------------------------------------------------------------ */
  /*  Modus 1: Kartendeck – Lernen                                       */
  /* ------------------------------------------------------------------ */
  function lernen() {
    var grid = $('lern-grid'); if (!grid) return;
    var list = KARTEN.filter(passt), h = '';
    list.forEach(function (c) {
      var f = faces(c), vis;
      if (f[0] === 'nacht') vis = nacht(c, aspects(c)[0], { sil: true });
      else if (f[0] === 'tag') vis = tag(c);
      else vis = '<div class="tile-schall">' + muster(c.schall, 'muster-mini') + '</div>';
      var s5 = f.filter(function (x) { return fach(c.id + ':' + x) === 5; }).length;
      h += '<button type="button" class="tile' + (f[0] === 'tag' ? ' tile-tag' : f[0] === 'schall' ? ' tile-schall-b' : '') + '" data-id="' + c.id + '"><span class="tile-v">' + vis + '</span><span class="tile-t"><b>' + esc(c.name) + '</b><small>' +
        f.map(function (x) { return '<i class="fdot fd-' + x + (fach(c.id + ':' + x) === 5 ? ' ok' : '') + '" title="' + x + '"></i>'; }).join('') + (s5 === f.length ? ' sicher' : '') + '</small></span></button>';
    });
    grid.innerHTML = h || '<p class="leer">Keine Karten in dieser Auswahl.</p>';
    grid.querySelectorAll('.tile').forEach(function (t) { t.onclick = function () { oeffnen(t.getAttribute('data-id')); }; });
    $('lern-count').textContent = list.length + (list.length === 1 ? ' Karte' : ' Karten');
  }
  var detAsp = 'vorn';
  function oeffnen(id) {
    var c = BY[id], box = $('lern-detail'); detAsp = aspects(c)[0];
    function zeichnen() {
      var f = faces(c), h = '<div class="det-wrap"><div class="det-vis">';
      if (f.indexOf('nacht') > -1) {
        h += '<div class="det-scene dark">' + nacht(c, detAsp, { sil: true }) + '</div>';
        if (!c.scene && aspects(c).length > 1) h += '<div class="q-asp light" role="group" aria-label="Blickwinkel">' + aspects(c).map(function (a) { return '<button type="button" data-asp="' + a + '" aria-pressed="' + (a === detAsp) + '">' + ASP_NAME[a] + '</button>'; }).join('') + '</div>';
      }
      if (f.indexOf('tag') > -1) h += '<div class="det-scene">' + tag(c) + '</div>';
      if (f.indexOf('schall') > -1) h += '<div class="det-scene q-schall">' + schallBox(c, true) + '</div>';
      h += '</div><div class="det-text">' + detail(c, { ohneTrio: true }) + '<div class="row-btns"><button type="button" class="b b-ghost" id="det-zu">← Zurück zur Übersicht</button><button type="button" class="b b-primary" id="det-ueben">Diese Kategorie üben</button></div></div></div>';
      box.innerHTML = h; box.hidden = false; $('lern-grid').hidden = true; $('lern-filter').hidden = true; $('lern-count').hidden = true;
      box.querySelectorAll('[data-asp]').forEach(function (b) { b.onclick = function () { detAsp = b.getAttribute('data-asp'); zeichnen(); }; });
      $('det-zu').onclick = zu;
      $('det-ueben').onclick = function () { filterKat = c.cat; zu(); alleFilterNeu(); location.hash = 'trainer'; };
    }
    function zu() { box.hidden = true; $('lern-grid').hidden = false; $('lern-filter').hidden = false; $('lern-count').hidden = false; }
    zeichnen();
    box.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------ */
  /*  Modus 2: Trainer mit Lernkartei                                    */
  /* ------------------------------------------------------------------ */
  var trMode = 'mix', trQueue = [], trPos = 0, trTurned = false, trAsp = 'vorn', trDirty = false, trainerDirty = false, trStats = { r: 0, n: 0 };
  function trainerStart() {
    trainerDirty = false;
    var keys = alleSeiten(passt).filter(function (k) { var f = k.split(':')[1]; return trMode === 'mix' || f === trMode; });
    var due = keys.filter(faellig);
    due.sort(function (a, b) { return (fach(a) || 0.5) - (fach(b) || 0.5) || Math.random() - .5; });
    // gemischt, aber Fach 1 zuerst
    var f1 = shuffle(due.filter(function (k) { return fach(k) === 1; })), neu = shuffle(due.filter(function (k) { return !fach(k); })), rest = shuffle(due.filter(function (k) { return fach(k) > 1; }));
    trQueue = f1.concat(rest, neu).slice(0, 20);
    trPos = 0; trStats = { r: 0, n: 0 };
    trainerZeigen();
    boxenZeichnen();
  }
  function trainerZeigen() {
    var card = $('tr-card'), front = $('tr-front'), back = $('tr-back'), done = $('tr-done');
    trTurned = false; card.classList.remove('turned'); $('tr-turn').textContent = 'Karte umdrehen';
    if (trPos >= trQueue.length) {
      $('tr-stage').hidden = true; done.hidden = false;
      var mehr = alleSeiten(passt).filter(function (k) { var f = k.split(':')[1]; return (trMode === 'mix' || f === trMode) && faellig(k); }).length;
      done.innerHTML = '<div class="done-box"><div class="big">⚓</div><p>' + (trQueue.length ? 'Runde geschafft: ' + trStats.r + ' von ' + trStats.n + ' auf Anhieb gewusst.' : 'In dieser Auswahl ist gerade nichts fällig – sehr gut!') + '</p>' +
        '<p class="muted">' + (mehr ? 'Noch ' + mehr + ' Kartenseiten sind heute fällig.' : 'Gewusste Karten kommen nach 1, 2, 4 und 8 Tagen wieder.') + '</p><div class="row-btns" style="justify-content:center">' +
        (mehr ? '<button type="button" class="b b-primary" id="tr-again">Nächste Runde</button>' : '') + '<a class="b b-ghost" href="#pruefung">Prüfungsmodus</a></div></div>';
      var ag = $('tr-again'); if (ag) ag.onclick = trainerStart;
      $('tr-count').textContent = '';
      return;
    }
    $('tr-stage').hidden = false; done.hidden = true;
    var k = trQueue[trPos], c = BY[k.split(':')[0]], face = k.split(':')[1], as = aspects(c);
    trAsp = as[Math.floor(Math.random() * as.length)];
    function vorne() {
      front.className = 'side front f-' + face;
      front.innerHTML = frageSeite(c, face, trAsp);
      front.querySelectorAll('[data-asp]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); trAsp = b.getAttribute('data-asp'); vorne(); }; });
    }
    vorne();
    back.innerHTML = detail(c, { voll: true }) + '<div class="rate"><button type="button" data-r="1" class="r1">Nicht gewusst<small>zurück in Fach 1</small></button><button type="button" data-r="2" class="r2">Unsicher<small>bleibt im Fach</small></button><button type="button" data-r="3" class="r3">Gewusst<small>ein Fach weiter</small></button></div>';
    back.querySelectorAll('[data-r]').forEach(function (b) { b.onclick = function () { trainerBewerten(+b.getAttribute('data-r')); }; });
    $('tr-count').textContent = 'Karte ' + (trPos + 1) + ' von ' + trQueue.length + ' · Fach ' + (fach(k) || 'neu');
  }
  function trainerDrehen() { trTurned = !trTurned; $('tr-card').classList.toggle('turned', trTurned); $('tr-turn').textContent = trTurned ? 'Zurück zur Frage' : 'Karte umdrehen'; }
  function trainerBewerten(r) {
    var k = trQueue[trPos];
    if (!k._wdh) { trStats.n++; if (r === 3) trStats.r++; }
    bewerten(k, r);
    if (r < 3 && trQueue.indexOf(k, trPos + 1) < 0 && !(trQueue._rep && trQueue._rep[k])) { trQueue._rep = trQueue._rep || {}; trQueue._rep[k] = 1; trQueue.push(k); }
    boxenZeichnen();
    trTurned = false; $('tr-card').classList.remove('turned');
    setTimeout(function () { trPos++; trainerZeigen(); }, 350);
  }
  function boxenZeichnen() {
    var keys = alleSeiten(), n = [0, 0, 0, 0, 0, 0];
    keys.forEach(function (k) { n[fach(k)]++; });
    var max = Math.max.apply(null, n.slice(1).concat([1]));
    var box = $('tr-boxes'); if (!box) return;
    box.innerHTML = [1, 2, 3, 4, 5].map(function (i) { return '<div class="bx bx' + i + '" style="height:' + (6 + 30 * n[i] / max) + 'px" title="Fach ' + i + ': ' + n[i] + '"><span>' + n[i] + '</span></div>'; }).join('') + '<div class="bx-neu" title="neu">neu ' + n[0] + '</div>';
  }

  /* ------------------------------------------------------------------ */
  /*  Modus 3: Prüfung                                                   */
  /* ------------------------------------------------------------------ */
  var pr = null;
  function pruefungStart() {
    var keys = shuffle(alleSeiten(passt)).slice(0, 20);
    pr = { q: keys, i: 0, ok: 0, wrong: [], byCat: {} };
    pruefungFrage();
  }
  function optionen(c, face) {
    var pool = KARTEN.filter(function (x) { return x.id !== c.id && faces(x).indexOf(face) > -1 && x.name !== c.name; });
    var same = shuffle(pool.filter(function (x) { return x.cat === c.cat; })), other = shuffle(pool.filter(function (x) { return x.cat !== c.cat; }));
    return shuffle([c].concat(same.concat(other).slice(0, 3)));
  }
  function pruefungFrage() {
    var box = $('pr-box');
    if (pr.i >= pr.q.length) return pruefungEnde();
    var k = pr.q[pr.i], c = BY[k.split(':')[0]], face = k.split(':')[1], as = aspects(c), asp = as[Math.floor(Math.random() * as.length)];
    var opts = optionen(c, face);
    var h = '<div class="qhead"><span>Frage ' + (pr.i + 1) + ' von ' + pr.q.length + '</span><span>' + esc(KATNAME[c.cat]) + '</span></div><div class="meter"><i style="width:' + (pr.i / pr.q.length * 100) + '%"></i></div>';
    h += '<div class="pr-q f-' + face + '">' + frageSeite(c, face, asp, { aspektwahl: false }) + '</div><div class="pr-opts">';
    opts.forEach(function (o, i) { h += '<button type="button" class="opt" data-i="' + i + '">' + esc(o.name) + '</button>'; });
    h += '</div><div class="feedback" id="pr-fb"></div><div class="row-btns"><button type="button" class="b b-primary" id="pr-next" disabled>Weiter →</button></div>';
    box.innerHTML = h;
    box.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        var o = opts[+b.getAttribute('data-i')], right = o.id === c.id;
        box.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; if (opts[+x.getAttribute('data-i')].id === c.id) x.classList.add('correct'); });
        if (!right) b.classList.add('wrong');
        var bc = pr.byCat[c.cat] = pr.byCat[c.cat] || [0, 0]; bc[1]++;
        if (right) { pr.ok++; bc[0]++; bewerten(k, 3); } else { pr.wrong.push(c); bewerten(k, 1); }
        var fb = $('pr-fb'); fb.className = 'feedback show';
        fb.innerHTML = (right ? '<b>Richtig.</b> ' : '<b>Nicht ganz – richtig ist: ' + esc(c.name) + '.</b> ') + esc(c.memo);
        $('pr-next').disabled = false; $('pr-next').focus();
      };
    });
    $('pr-next').onclick = function () { pr.i++; pruefungFrage(); };
  }
  function pruefungEnde() {
    var p = Math.round(pr.ok / pr.q.length * 100), box = $('pr-box');
    var h = '<div class="done-box"><div class="big">' + pr.ok + ' / ' + pr.q.length + '</div><p>' + (p >= 90 ? 'Ausgezeichnet – das sitzt.' : p >= 70 ? 'Gut! Die Fehler findest du jetzt im Trainer in Fach 1.' : 'Da geht noch was. Die Fehler liegen jetzt im Trainer in Fach 1.') + '</p></div>';
    h += '<div class="pr-res">';
    Object.keys(pr.byCat).forEach(function (cat) { var v = pr.byCat[cat]; h += '<div class="cat-row"><span>' + esc(KATNAME[cat]) + '</span><span class="v">' + v[0] + ' / ' + v[1] + '</span><div class="cmeter"><i style="width:' + (v[0] / v[1] * 100) + '%"></i></div></div>'; });
    h += '</div><div class="row-btns"><button type="button" class="b b-primary" id="pr-neu">Neue Prüfung</button><a class="b b-ghost" href="#trainer">Fehler im Trainer üben</a></div>';
    box.innerHTML = h;
    $('pr-neu').onclick = pruefungStart;
    trainerDirty = true;
  }

  /* ------------------------------------------------------------------ */
  /*  Modus 4: Nachtwache                                                */
  /* ------------------------------------------------------------------ */
  var nw = null;
  function wacheStart() { nw = { q: shuffle(WACHE), i: 0, ok: 0, step: 1 }; wacheZeigen(); }
  function horizont(sz) {
    var c = BY[sz.card], id = ++uid, s = '<svg viewBox="0 0 640 300" role="img" aria-label="Nachtwache: Lichter am Horizont">';
    s += '<defs><linearGradient id="wh' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020507"/><stop offset=".62" stop-color="#0a1620"/><stop offset="1" stop-color="#03080b"/></linearGradient></defs>';
    s += '<rect width="640" height="300" fill="url(#wh' + id + ')"/>';
    for (var i = 0; i < 30; i++) s += '<circle cx="' + ((i * 97) % 640) + '" cy="' + ((i * 53) % 150) + '" r="' + (i % 4 ? .7 : 1.1) + '" fill="#7c8e9a" opacity=".6"/>';
    s += '<rect y="192" width="640" height="108" fill="#03090d"/><line x1="0" y1="192" x2="640" y2="192" stroke="#152736"/>';
    var w = 400 * sz.s, hgt = 240 * sz.s, x = sz.x - w / 2, y = 192 - hgt * (178 / 240);
    s += '<svg x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + hgt.toFixed(1) + '" viewBox="0 0 400 240" overflow="visible">' + nacht(c, sz.asp, { nurLichter: true }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</svg>';
    s += '<path d="M268 300 Q320 224 372 300 Z" fill="#0d1b25" stroke="#1d3446"/><line x1="320" y1="244" x2="320" y2="300" stroke="#1d3446"/>';
    s += '<text x="320" y="292" text-anchor="middle" font-size="11" fill="#6f8ea0" font-family="Poppins,sans-serif">dein Bug</text>';
    return s + '</svg>';
  }
  function wacheZeigen() {
    var box = $('nw-box');
    if (nw.i >= nw.q.length) {
      box.innerHTML = '<div class="done-box"><div class="big">' + nw.ok + ' / ' + (nw.q.length * 2) + '</div><p>Wache beendet. Jede Situation hatte zwei Fragen: erkennen und richtig handeln.</p><div class="row-btns" style="justify-content:center"><button type="button" class="b b-primary" id="nw-neu">Neue Wache</button></div></div>';
      $('nw-neu').onclick = wacheStart; return;
    }
    var sz = nw.q[nw.i], c = BY[sz.card];
    var h = '<div class="qhead"><span>Situation ' + (nw.i + 1) + ' von ' + nw.q.length + '</span><span>' + nw.ok + ' Punkte</span></div><div class="meter"><i style="width:' + (nw.i / nw.q.length * 100) + '%"></i></div>';
    h += '<div class="nw-scene">' + horizont(sz) + '</div><p class="nw-lage">' + esc(sz.lage) + '</p>';
    if (nw.step === 1) {
      var opts = optionen(c, 'nacht');
      h += '<p class="qtext">1 · Was ist das?</p><div class="pr-opts">' + opts.map(function (o, i) { return '<button type="button" class="opt" data-i="' + i + '">' + esc(o.name) + '</button>'; }).join('') + '</div><div class="feedback" id="nw-fb"></div><div class="row-btns"><button type="button" class="b b-primary" id="nw-next" disabled>Weiter →</button></div>';
      box.innerHTML = h;
      box.querySelectorAll('.opt').forEach(function (b) {
        b.onclick = function () {
          var o = opts[+b.getAttribute('data-i')], right = o.id === c.id;
          box.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; if (opts[+x.getAttribute('data-i')].id === c.id) x.classList.add('correct'); });
          if (!right) b.classList.add('wrong'); else nw.ok++;
          var fb = $('nw-fb'); fb.className = 'feedback show'; fb.innerHTML = (right ? '<b>Richtig erkannt.</b> ' : '<b>Das ist: ' + esc(c.name) + '.</b> ') + esc(c.memo);
          $('nw-next').disabled = false; $('nw-next').focus();
        };
      });
      $('nw-next').onclick = function () { nw.step = 2; wacheZeigen(); };
    } else {
      var A = window.WFD_WACHE_ANTW;
      h += '<p class="qtext">2 · Es ist: ' + esc(c.name) + '. Wer muss ausweichen?</p><div class="pr-opts">' + A.map(function (o, i) { return '<button type="button" class="opt" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div><div class="feedback" id="nw-fb"></div><div class="row-btns"><button type="button" class="b b-primary" id="nw-next" disabled>Nächste Situation →</button></div>';
      box.innerHTML = h;
      box.querySelectorAll('.opt').forEach(function (b) {
        b.onclick = function () {
          var i = +b.getAttribute('data-i'), right = i === sz.a;
          box.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; if (+x.getAttribute('data-i') === sz.a) x.classList.add('correct'); });
          if (!right) b.classList.add('wrong'); else nw.ok++;
          var fb = $('nw-fb'); fb.className = 'feedback show'; fb.innerHTML = (right ? '<b>Richtig.</b> ' : '<b>Nicht ganz.</b> ') + esc(sz.x2);
          $('nw-next').disabled = false; $('nw-next').focus();
        };
      });
      $('nw-next').onclick = function () { nw.step = 1; nw.i++; wacheZeigen(); };
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Fortschritt                                                        */
  /* ------------------------------------------------------------------ */
  function fortschritt() {
    var keys = alleSeiten(), n = [0, 0, 0, 0, 0, 0];
    keys.forEach(function (k) { n[fach(k)]++; });
    var max = Math.max.apply(null, n.concat([1]));
    var lbl = ['neu', 'Fach 1<br>jedes Mal', 'Fach 2<br>nach 1 Tag', 'Fach 3<br>nach 2 Tagen', 'Fach 4<br>nach 4 Tagen', 'Fach 5<br>sicher'];
    $('fs-leitner').innerHTML = [0, 1, 2, 3, 4, 5].map(function (i) { return '<div class="lb lb' + i + '"><b>' + n[i] + '</b><div class="bar" style="height:' + Math.max(4, n[i] / max * 100) + '%"></div><span>' + lbl[i] + '</span></div>'; }).join('');
    var sicher = n[5], total = keys.length;
    $('fs-sum').textContent = sicher + ' von ' + total + ' Kartenseiten sicher · ' + (total - n[0]) + ' schon geübt';
    $('fs-cats').innerHTML = KAT.map(function (k) {
      var ks = alleSeiten(function (c) { return c.cat === k.id; }), s = ks.filter(function (x) { return fach(x) === 5; }).length, a = ks.filter(function (x) { var f = fach(x); return f > 0 && f < 5; }).length;
      return '<div class="cat-row"><span>' + esc(k.name) + '</span><span class="v">' + s + ' / ' + ks.length + ' sicher</span><div class="cmeter"><i style="width:' + (s / ks.length * 100) + '%;background:var(--ok)"></i><i style="width:' + (a / ks.length * 100) + '%"></i></div></div>';
    }).join('');
  }
  // Übertragen: WFD1.<Fach je Kartenseite als Ziffer, feste Reihenfolge>
  function kodieren() { return 'WFD1.' + alleSeiten().map(function (k) { return fach(k); }).join('').replace(/0+$/, ''); }
  function uebernehmen(code) {
    code = (code || '').trim().replace(/^.*#import=/, '');
    var m = code.match(/^WFD1\.([0-5]*)$/); if (!m) return -1;
    var keys = alleSeiten(), neu = 0;
    m[1].split('').forEach(function (d, i) { d = +d; var k = keys[i]; if (k && d > fach(k)) { ST[k] = { b: d, d: Date.now() }; neu++; } });
    speichern(); return neu;
  }
  function uebertragen() {
    var code = kodieren(), link = location.href.split('#')[0] + '#import=' + code;
    $('fs-code').value = code;
    var q = $('fs-qr'); q.innerHTML = '';
    if (window.qrcode) { var qr = qrcode(0, 'M'); qr.addData(link); qr.make(); q.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); }
    $('fs-trans').hidden = false;
  }

  /* ------------------------------------------------------------------ */
  /*  Tabs & Start                                                       */
  /* ------------------------------------------------------------------ */
  var TABS = ['lernen', 'trainer', 'pruefung', 'nachtwache', 'fortschritt'], aktiv = null;
  function tab(name) {
    if (TABS.indexOf(name) < 0) name = 'trainer';
    aktiv = name;
    TABS.forEach(function (t) { $('tab-' + t).setAttribute('aria-selected', t === name); $('panel-' + t).classList.toggle('on', t === name); });
    if (name === 'lernen') lernen();
    if (name === 'trainer' && (trainerDirty || !trQueue.length)) trainerStart();
    if (name === 'pruefung' && !pr) pruefungStart();
    if (name === 'nachtwache' && !nw) wacheStart();
    if (name === 'fortschritt') fortschritt();
  }
  function hashLesen() {
    var h = location.hash.slice(1);
    var im = h.match(/^import=(.+)$/);
    if (im) {
      var n = uebernehmen(decodeURIComponent(im[1]));
      $('wfd-msg').textContent = n >= 0 ? '✓ Fortschritt übernommen (' + n + ' Kartenseiten aktualisiert).' : 'Der Code ist ungültig.';
      $('wfd-msg').hidden = false;
      history.replaceState(null, '', location.pathname + '#fortschritt'); h = 'fortschritt';
    }
    var sm = h.match(/^set=([a-z0-9]+)$/);
    if (sm && SETS[sm[1]]) { filterSet = sm[1]; filterKat = 'alle'; trainerDirty = true; alleFilter(); h = 'trainer'; history.replaceState(null, '', location.pathname + '#trainer'); }
    tab(h);
  }
  function init() {
    if (!$('wfd-app')) return;
    // Kopfzahlen
    var nF = alleSeiten().length, nS = KARTEN.filter(function (c) { return !!c.schall; }).length;
    $('st-karten').textContent = KARTEN.length; $('st-seiten').textContent = nF; $('st-schall').textContent = nS;
    // Trainer-Schalter
    document.querySelectorAll('[data-trmode]').forEach(function (b) {
      b.onclick = function () { trMode = b.getAttribute('data-trmode'); document.querySelectorAll('[data-trmode]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); trainerStart(); };
    });
    $('tr-turn').onclick = trainerDrehen;
    $('tr-front').onclick = function (e) { if (!e.target.closest('button')) trainerDrehen(); };
    document.addEventListener('keydown', function (e) {
      if (aktiv !== 'trainer' || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
      if (e.code === 'Space' && !(e.target && e.target.closest && e.target.closest('button,a'))) { e.preventDefault(); trainerDrehen(); }
      if (trTurned && /^Digit[123]$/.test(e.code)) trainerBewerten(+e.code.slice(5));
    });
    $('fs-share').onclick = uebertragen;
    $('fs-copy').onclick = function () { var i = $('fs-code'); i.select(); try { navigator.clipboard.writeText(i.value); } catch (e) { try { document.execCommand('copy'); } catch (e2) {} } this.textContent = 'Kopiert ✓'; };
    $('fs-import').onclick = function () { var n = uebernehmen($('fs-in').value); $('fs-imsg').textContent = n >= 0 ? '✓ Übernommen: ' + n + ' Kartenseiten aktualisiert.' : 'Der Code ist ungültig.'; fortschritt(); boxenZeichnen(); };
    $('fs-reset').onclick = function () { if (this.getAttribute('data-sure')) { ST = {}; speichern(); fortschritt(); boxenZeichnen(); trainerDirty = true; this.textContent = 'Zurückgesetzt'; } else { this.setAttribute('data-sure', 1); this.textContent = 'Wirklich alles zurücksetzen?'; } };
    // SOS-Blinken
    var u = .25, seq = [1, 1, 1, 1, 1, 3, 3, 1, 3, 1, 3, 3, 1, 1, 1, 1, 1, 7], on = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], tot = seq.reduce(function (a, b) { return a + b; }, 0), acc = 0, kf = '';
    seq.forEach(function (d, i) { kf += (acc / tot * 100).toFixed(2) + '%{opacity:' + (on[i] ? 1 : .08) + '}'; acc += d; if (i < seq.length - 1) kf += ((acc / tot * 100) - .01).toFixed(2) + '%{opacity:' + (on[i] ? 1 : .08) + '}'; });
    var st = document.createElement('style'); st.textContent = '@keyframes wfdSos{' + kf + '100%{opacity:.08}}.wfd-sos{animation:wfdSos ' + (tot * u) + 's steps(1,end) infinite}'; document.head.appendChild(st);
    alleFilter(); boxenZeichnen();
    window.addEventListener('hashchange', hashLesen);
    hashLesen();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // für andere Seiten (Startseite)
  window.WFD = { nacht: nacht, tag: tag, BY: BY };
})();
