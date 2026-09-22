/* ==========================================================================
   SailingX-Academy – Knoten-Animationen
   --------------------------------------------------------------------------
   Ein Knoten ist ein Tau (oder zwei), das entlang einer Spline-Bahn „wächst“.
   Kreuzungen werden automatisch erkannt; ob das Tau oben oder unten liegt,
   legt ein O/U-Code fest (je Durchgang entlang des Taus, in Laufrichtung).
   Hindernisse (Poller, Reling, Ring, Kette) werden genauso behandelt.
   Das Tau wird mit Kontur, Farbe, Schlagstreifen und Glanz gezeichnet.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.SX; if (!S) return;
  var f1 = S.f1, clamp = S.clamp;

  /* ---------- Geometrie ---------- */
  function catmull(P, schritt) { // centripetale Catmull-Rom-Spline, dicht abgetastet
    var out = [], n = P.length, marken = [];
    var pts = [P[0]].concat(P, [P[n - 1]]);
    for (var i = 1; i < pts.length - 2; i++) {
      marken.push(out.length);
      var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2];
      var d = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), k = Math.max(2, Math.ceil(d / schritt));
      for (var j = 0; j < k; j++) {
        var t = j / k, t2 = t * t, t3 = t2 * t;
        out.push([
          .5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    marken.push(out.length);
    out.push(P[n - 1].slice());
    out.marken = marken;
    return out;
  }
  function laengen(pts) { var L = [0]; for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; }
  function schnitt(a, b, c, d) { // Segment ab × cd → [u, v] oder null
    var r0 = b[0] - a[0], r1 = b[1] - a[1], s0 = d[0] - c[0], s1 = d[1] - c[1];
    var den = r0 * s1 - r1 * s0; if (Math.abs(den) < 1e-9) return null;
    var u = ((c[0] - a[0]) * s1 - (c[1] - a[1]) * s0) / den, v = ((c[0] - a[0]) * r1 - (c[1] - a[1]) * r0) / den;
    return (u >= 0 && u < 1 && v >= 0 && v < 1) ? [u, v] : null;
  }

  /* ---------- Tau zeichnen ---------- */
  var FARBEN = {
    sand: { k: '#6b4a24', f: '#d9a45f', s: '#b07c3c', g: '#f3d2a0' },
    blau: { k: '#163a5c', f: '#3f86c8', s: '#2a6aa6', g: '#a9d0f0' },
    rot: { k: '#6d1a1a', f: '#d9483b', s: '#b0322a', g: '#f4a79c' },
    gruen: { k: '#17492e', f: '#3aa56b', s: '#2a8352', g: '#a9e3c1' }
  };
  function pfad(pts, i0, i1) {
    var s = 'M' + f1(pts[i0][0]) + ' ' + f1(pts[i0][1]);
    for (var i = i0 + 1; i <= i1; i++) s += 'L' + f1(pts[i][0]) + ' ' + f1(pts[i][1]);
    return s;
  }
  function tauStueck(d, farbe, w, a, s0, s1, ohneUmriss) {
    var c = FARBEN[farbe] || FARBEN.sand;
    var g = (ohneUmriss ? '' : '<path d="' + d + '" fill="none" stroke="' + c.k + '" stroke-width="' + f1(w + 3.2) + '" stroke-linejoin="round"/>') +
      '<path d="' + d + '" fill="none" stroke="' + c.f + '" stroke-width="' + f1(w) + '" stroke-linejoin="round"/>';
    if (a) { // Schlag: schräge Kardeel-Striche, fest an der Bogenlänge verankert
      var sp = w * .52, m = '', k0 = Math.ceil((s0 + 1) / sp), k1 = Math.floor((s1 - 1) / sp);
      for (var k = k0; k <= k1; k++) {
        var sx = k * sp, p = punktBei(a, sx), q = punktBei(a, Math.min(a.len, sx + 1.5)), r = punktBei(a, Math.max(0, sx - 1.5));
        var tx = q[0] - r[0], ty = q[1] - r[1], l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
        var nx = -ty, ny = tx, h = w * .40, sl = w * .26;
        m += 'M' + f1(p[0] + nx * h - tx * sl) + ' ' + f1(p[1] + ny * h - ty * sl) + 'L' + f1(p[0] - nx * h + tx * sl) + ' ' + f1(p[1] - ny * h + ty * sl);
      }
      if (m) g += '<path d="' + m + '" stroke="' + c.s + '" stroke-width="' + f1(w * .17) + '" stroke-linecap="round" opacity=".8"/>';
    }
    g += '<path d="' + d + '" fill="none" stroke="' + c.g + '" stroke-width="' + f1(w * .16) + '" stroke-linejoin="round" opacity=".55" transform="translate(-.8 -1.6)"/>';
    return g;
  }
  function ende(p, q, farbe, w, takling) { // rundes Tauende mit Takling
    var c = FARBEN[farbe] || FARBEN.sand, dx = p[0] - q[0], dy = p[1] - q[1], l = Math.hypot(dx, dy) || 1;
    var ux = dx / l, uy = dy / l, s = '';
    s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + f1(w / 2 + 1.7) + '" fill="' + c.k + '"/>';
    s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + f1(w / 2) + '" fill="' + c.f + '"/>';
    if (takling) {
      var bx = p[0] - ux * w * .55, by = p[1] - uy * w * .55;
      s += '<line x1="' + f1(bx - uy * w * .62) + '" y1="' + f1(by + ux * w * .62) + '" x2="' + f1(bx + uy * w * .62) + '" y2="' + f1(by - ux * w * .62) + '" stroke="' + c.k + '" stroke-width="' + f1(w * .5) + '"/>';
    }
    return s;
  }

  /* ---------- Knoten vorbereiten ---------- */
  // Kreuzungen werden automatisch gefunden. Entschieden wird jede Kreuzung vom Durchgang,
  // der ZULETZT entsteht (das wandernde Ende): sein Code-Zeichen (O = drüber, U = drunter)
  // gilt, der ältere Durchgang bekommt das Gegenteil. Der Code eines Seils listet also nur die
  // Kreuzungen, die dieses Seil beim Wachsen neu bildet – in Laufrichtung.
  function Knoten(def) {
    this.def = def; this.w = def.dicke || 15;
    this.seile = def.seile.map(function (s) {
      var pts = catmull(s.punkte, 2.5), L = laengen(pts);
      return { id: s.id, farbe: s.farbe || 'sand', pts: pts, L: L, marken: pts.marken, len: L[L.length - 1], code: (s.code || '').replace(/\s/g, ''), vor: 0, vorRoh: s.vor || 0, takling: s.takling !== false, anfangEnde: !!s.anfangEnde, w: s.dicke || def.dicke || 15 };
    });
    this.seile.forEach(function (a) { a.vor = typeof a.vorRoh === 'string' ? a.L[a.marken[+a.vorRoh.slice(1)]] / a.len : a.vorRoh; });
    this.hind = (def.hindernisse || []).map(function (h) { return { pts: h.linie ? catmull(h.linie, 3) : null, svg: h.svg || '', vorn: h.vorn === true ? h.svg : (h.vorn || ''), breite: h.breite || 0 }; });
  }
  Knoten.prototype.kreuzungen = function (zeit) {
    var self = this, W = this.w, roh = [];
    this.seile.forEach(function (a) { a.w = a.w || W; });
    zeit = zeit || function (si, s) { return si * 1e6 + s; };
    function winkel(P, i, Q, j) {
      var ax = P[i + 1][0] - P[i][0], ay = P[i + 1][1] - P[i][1], bx = Q[j + 1][0] - Q[j][0], by = Q[j + 1][1] - Q[j][1];
      return Math.abs(ax * by - ay * bx) / ((Math.hypot(ax, ay) * Math.hypot(bx, by)) || 1);
    }
    this.seile.forEach(function (a, ai) {
      var P = a.pts;
      self.seile.forEach(function (b, bi) {
        if (bi < ai) return;
        var Q = b.pts;
        for (var i = 0; i < P.length - 1; i++) for (var j = (bi === ai ? i + 6 : 0); j < Q.length - 1; j++) {
          var x = schnitt(P[i], P[i + 1], Q[j], Q[j + 1]); if (!x) continue;
          roh.push({ a: ai, sa: a.L[i] + x[0] * (a.L[i + 1] - a.L[i]), b: bi, sb: b.L[j] + x[1] * (b.L[j + 1] - b.L[j]),
            p: [P[i][0] + x[0] * (P[i + 1][0] - P[i][0]), P[i][1] + x[0] * (P[i + 1][1] - P[i][1])], sin: winkel(P, i, Q, j) });
        }
      });
      self.hind.forEach(function (h, hi) {
        var Q = h.pts; if (!Q) return;
        for (var i = 0; i < P.length - 1; i++) for (var j = 0; j < Q.length - 1; j++) {
          var x = schnitt(P[i], P[i + 1], Q[j], Q[j + 1]);
          if (x) roh.push({ a: ai, sa: a.L[i] + x[0] * (a.L[i + 1] - a.L[i]), h: hi, p: [P[i][0] + x[0] * (P[i + 1][0] - P[i][0]), P[i][1] + x[0] * (P[i + 1][1] - P[i][1])], sin: winkel(P, i, Q, j) });
        }
      });
    });
    // Duplikate zusammenführen
    var kr = [];
    roh.forEach(function (c) {
      if (!kr.some(function (d) { return d.a === c.a && d.b === c.b && d.h === c.h && Math.abs(d.sa - c.sa) < 2 && (c.b == null || Math.abs(d.sb - c.sb) < 2); })) kr.push(c);
    });
    // Entscheider bestimmen und nach Entstehungszeit ordnen
    kr.forEach(function (c) {
      if (c.h != null) { c.ent = { si: c.a, s: c.sa }; c.alt = null; c.zeit = zeit(c.a, c.sa); }
      else {
        var ta = zeit(c.a, c.sa), tb = zeit(c.b, c.sb); c.zeit = Math.max(ta, tb);
        if (ta >= tb) { c.ent = { si: c.a, s: c.sa }; c.alt = { si: c.b, s: c.sb }; }
        else { c.ent = { si: c.b, s: c.sb }; c.alt = { si: c.a, s: c.sa }; }
      }
    });
    var zaehler = this.seile.map(function () { return 0; });
    var sortiert = kr.slice().sort(function (p, q) { return p.ent.si - q.ent.si || p.ent.s - q.ent.s; });
    sortiert.forEach(function (c) {
      var a = self.seile[c.ent.si], k = zaehler[c.ent.si]++;
      c.nr = c.ent.si * 100 + k + 1; c.lage = a.code[k] || 'O';
      var wu = c.alt ? self.seile[c.lage === 'O' ? c.alt.si : c.ent.si].w : W, wo = c.alt ? self.seile[c.lage === 'O' ? c.ent.si : c.alt.si].w : W;
      var halb = c.h != null && self.hind[c.h].breite ? (self.hind[c.h].breite / 2 + W * .35) / Math.max(.4, c.sin) : Math.min(wu * 2.4, (wu * .5 + wo * .12 + 3.5) / Math.max(.35, c.sin));
      // „Brücke“: das obere Seilstück wird über der Kreuzung noch einmal gezeichnet
      if (c.lage === 'O') c.bruecke = { si: c.ent.si, s: c.ent.s, halb: halb };
      else if (c.alt) c.bruecke = { si: c.alt.si, s: c.alt.s, halb: halb };
      else c.bruecke = null; // Seil liegt unter einem Hindernis
    });
    this.seile.forEach(function (a, si) {
      if (a.code.length !== zaehler[si] && window.console) console.warn('Knoten „' + self.def.titel + '“, Seil ' + (a.id || si) + ': ' + zaehler[si] + ' Kreuzungen, Code hat ' + a.code.length);
    });
    this.kr = sortiert;
  };
  function idx(L, s) { var lo = 0, hi = L.length - 1; while (lo < hi) { var m = (lo + hi) >> 1; if (L[m] < s) lo = m + 1; else hi = m; } return lo; }
  function punktBei(a, s) {
    var i = clamp(idx(a.L, s), 1, a.pts.length - 1), p = a.pts[i - 1], q = a.pts[i], d = a.L[i] - a.L[i - 1] || 1, u = clamp((s - a.L[i - 1]) / d, 0, 1);
    return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
  }

  function teilPfad(a, s0, s1) { // Pfad eines Seilabschnitts [s0, s1]
    var pts = [punktBei(a, s0)], i0 = idx(a.L, s0), i1 = idx(a.L, s1);
    for (var i = i0; i < i1; i++) if (a.L[i] > s0 + .2 && a.L[i] < s1 - .2) pts.push(a.pts[i]);
    pts.push(punktBei(a, s1));
    return pfad(pts, 0, pts.length - 1);
  }
  Knoten.prototype.zeichne = function (sichtbar, debug) { // sichtbar[si] = sichtbare Länge
    var self = this, W = this.w, basis = [], schatten = '', vorn = '', hinten = '', bruecken = '';
    this.hind.forEach(function (h) { hinten += h.svg; vorn += h.vorn; });
    var sv = this.seile.map(function (a, si) { return clamp(sichtbar[si], 0, a.len); });
    this.seile.forEach(function (a, si) {
      if (sv[si] < 1) return;
      var d = teilPfad(a, 0, sv[si]), tip = punktBei(a, sv[si]), zur = punktBei(a, Math.max(0, sv[si] - 6));
      schatten += '<path d="' + d + '" stroke-width="' + f1(a.w + 8) + '"/>';
      var g = tauStueck(d, a.farbe, a.w, a, 0, sv[si]) + ende(tip, zur, a.farbe, a.w, a.takling);
      if (a.anfangEnde) g = ende(a.pts[0], a.pts[3], a.farbe, a.w, a.takling) + g;
      basis.push({ z: a.t0 || 0, g: g });
      a._tip = tip;
    });
    basis.sort(function (p, q) { return p.z - q.z; });
    // Brücken: erst Brücken über Hindernissen, dann Seil-über-Seil in Entstehungsreihenfolge
    var liste = this.kr.filter(function (c) { return c.bruecke; }).sort(function (p, q) { return (q.h != null) - (p.h != null) || p.zeit - q.zeit; });
    liste.forEach(function (c) {
      var b = c.bruecke, a = self.seile[b.si], s0 = Math.max(0, b.s - b.halb), s1 = Math.min(sv[b.si], b.s + b.halb);
      if (s1 <= s0 + 1) return;
      var u = c.lage === 'O' ? c.alt : c.ent; // der untere Durchgang muss schon zu sehen sein
      if (c.h == null && u && sv[u.si] < u.s - 2) return;
      var dUmriss = teilPfad(a, Math.min(s1, s0 + (s0 > 0 ? 1.8 : 0)), Math.max(s0, s1 - (s1 < sv[b.si] ? 1.8 : 0)));
      var d = teilPfad(a, s0, s1), col = FARBEN[a.farbe] || FARBEN.sand;
      bruecken += '<path d="' + d + '" fill="none" stroke="#0b2230" stroke-opacity=".22" stroke-width="' + f1(a.w + 3.5) + '" transform="translate(1 2)"/>';
      bruecken += '<path d="' + dUmriss + '" fill="none" stroke="' + col.k + '" stroke-width="' + f1(a.w + 3.2) + '"/>';
      bruecken += tauStueck(d, a.farbe, a.w, a, s0, s1, true);
      if (s1 >= sv[b.si] - .01) bruecken += ende(punktBei(a, sv[b.si]), punktBei(a, Math.max(0, sv[b.si] - 6)), a.farbe, a.w, a.takling);
    });
    var s = hinten + '<g fill="none" stroke="#0b2230" stroke-opacity=".13" stroke-width="' + f1(W + 8) + '" stroke-linejoin="round" stroke-linecap="round" transform="translate(2 3)">' + schatten + '</g>' +
      basis.map(function (o) { return o.g; }).join('') + vorn + bruecken;
    if (debug) this.kr.forEach(function (c) {
      s += '<circle cx="' + f1(c.p[0]) + '" cy="' + f1(c.p[1]) + '" r="9" fill="' + (c.lage === 'U' ? '#c00' : '#070') + '" opacity=".8"/>' +
        '<text x="' + f1(c.p[0]) + '" y="' + f1(c.p[1] + 4) + '" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">' + (c.nr % 100) + (c.h != null ? 'h' : '') + '</text>';
    });
    return s;
  };

  /* ---------- Szene registrieren ---------- */
  // def: { titel, w, h, dicke, tempo (px/s), pause (s),
  //        seile:[{id, farbe, punkte:[[x,y]…], code:'OUOU', vor (Anteil schon sichtbar), anfangEnde}],
  //        hindernisse:[{linie:[[x,y]…], svg, vorn:true|svg}], bühne (SVG), labels:[{x,y,text,cls,ab}],
  //        schritte:[{seil, bis (Anteil 0..1), titel, text, dauer}] }
  var DEFS = {};
  function vorbereiten(def) {
    var K = new Knoten(def), tempo = def.tempo || 140, hold = def.pause == null ? 1 : def.pause;
    var plan = [], t = .8, stand = K.seile.map(function (a) { return a.len * a.vor; });
    K.seile.forEach(function (a) { a.t0 = a.vor > 0 ? -1 : 1e9; });
    def.schritte.forEach(function (st) {
      var si = st.seil || 0, a = K.seile[si], von = stand[si];
      var ziel = st.bis == null ? (st.nurText ? von : a.len) : typeof st.bis === 'string' ? a.L[a.marken[+st.bis.slice(1)]] : a.len * st.bis;
      var dauer = st.dauer || Math.max(.6, (ziel - von) / tempo);
      plan.push({ si: si, von: von, bis: ziel, t0: t, t1: t + dauer, titel: st.titel, text: st.text, pfeile: st.pfeile });
      if (ziel > von) a.t0 = Math.min(a.t0, t);
      stand[si] = Math.max(von, ziel); t += dauer + hold;
    });
    K.kreuzungen(function (si, s) {
      var a = K.seile[si]; if (s <= a.len * a.vor) return -1 + s / 1e6;
      for (var i = 0; i < plan.length; i++) { var p = plan[i]; if (p.si === si && s > p.von && s <= p.bis + .01) return p.t0 + (s - p.von) / (p.bis - p.von || 1) * (p.t1 - p.t0); }
      return 1e9;
    });
    return { K: K, plan: plan, total: t + 1.2 };
  }
  function bild(def, V, tt, debug, ohneDeko) {
    var K = V.K, w = def.w || 640, h = def.h || 380, akt = null;
    var sicht = K.seile.map(function (a) { return a.len * a.vor; });
    V.plan.forEach(function (p) {
      if (tt >= p.t1) sicht[p.si] = Math.max(sicht[p.si], p.bis);
      else if (tt > p.t0) { var u = S.EASE.inaus((tt - p.t0) / (p.t1 - p.t0)); sicht[p.si] = Math.max(sicht[p.si], p.von + (p.bis - p.von) * u); if (p.bis > p.von) akt = p; }
    });
    var s = '<rect width="' + w + '" height="' + h + '" fill="#f4f8fb"/>';
    s += '<g opacity=".55">' + raster(w, h) + '</g>';
    var z = def.zoom; // [cx, cy, k]
    if (z) s += '<g transform="translate(' + f1(w / 2 - z[0] * z[2]) + ' ' + f1(h / 2 - z[1] * z[2]) + ') scale(' + z[2] + ')">';
    if (def.bühne) s += def.bühne;
    s += K.zeichne(sicht, debug);
    V.plan.forEach(function (p) {
      if (ohneDeko || !p.pfeile || tt < p.t0) return;
      var u = clamp((tt - p.t0) / .5, 0, 1);
      p.pfeile.forEach(function (a) { s += '<g opacity="' + f1(u) + '">' + S.pfeil(a[0], a[1], a[2], a[3], a[4] || 'rot') + '</g>'; });
    });
    if (akt && !ohneDeko) { var tp = K.seile[akt.si]._tip; if (tp) s += '<circle cx="' + f1(tp[0]) + '" cy="' + f1(tp[1]) + '" r="' + f1(K.w * 1.15) + '" fill="none" stroke="#f39129" stroke-width="2.6" stroke-dasharray="5 4" opacity=".9"/>'; }
    if (def.labels && !ohneDeko) def.labels.forEach(function (l) { if (tt >= (l.ab || 0)) s += '<text x="' + l.x + '" y="' + l.y + '" class="sx-lbl ' + (l.cls || '') + '">' + S.esc(l.text) + '</text>'; });
    if (z) s += '</g>';
    return s;
  }
  function knoten(name, def) {
    DEFS[name] = def;
    S.szene(name, function () {
      var V = vorbereiten(def);
      var steps = V.plan.map(function (p) { return { t: Math.max(0, p.t0 - .4), titel: p.titel, text: p.text }; });
      return {
        titel: def.titel,
        shots: [S.einstellung({ dur: V.total, w: def.w || 640, h: def.h || 380, steps: steps, render: function (tt) { return bild(def, V, tt, window.KNOTEN_DEBUG); } })]
      };
    });
  }
  // fertiger Knoten als statisches SVG (für Übersicht / Vorschaubilder)
  function knotenBild(name, opt) {
    var def = DEFS[name]; if (!def) return '';
    var V = vorbereiten(def), w = def.w || 640, h = def.h || 380, vb = (opt && opt.viewBox) || def.ausschnitt || ('0 0 ' + w + ' ' + h);
    return '<svg viewBox="' + vb + '" role="img" aria-label="' + S.esc(def.titel) + '">' + bild(def, V, V.total, false, true).replace(/<g opacity=".55">.*?<\/g>/, '') + '</svg>';
  }
  function raster(w, h) {
    var s = '';
    for (var x = 20; x < w; x += 40) s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + h + '" stroke="#e3ebf1" stroke-width="1"/>';
    for (var y = 20; y < h; y += 40) s += '<line x1="0" y1="' + y + '" x2="' + w + '" y2="' + y + '" stroke="#e3ebf1" stroke-width="1"/>';
    return s;
  }

  // Bühnenbauteile
  function reling(y, r, x0, x1) {
    x0 = x0 == null ? -20 : x0; x1 = x1 == null ? 660 : x1;
    return '<rect x="' + x0 + '" y="' + (y - r - 1.6) + '" width="' + (x1 - x0) + '" height="' + (2 * r + 3.2) + '" fill="#56636c"/>' +
      '<rect x="' + x0 + '" y="' + (y - r) + '" width="' + (x1 - x0) + '" height="' + (2 * r) + '" fill="#b9c4cb"/>' +
      '<rect x="' + x0 + '" y="' + (y - r * .55) + '" width="' + (x1 - x0) + '" height="' + (r * .5) + '" fill="#e6ecef"/>' +
      '<rect x="' + x0 + '" y="' + (y + r * .45) + '" width="' + (x1 - x0) + '" height="' + (r * .45) + '" fill="#98a5ae"/>';
  }
  function kette(y, x0, x1, bg) {
    var s = '', i = 0;
    for (var x = x0; x < x1; x += 30, i++) {
      if (i % 2) s += '<rect x="' + (x - 22) + '" y="' + (y - 4.5) + '" width="44" height="9" rx="4.5" fill="#5b6770" stroke="#2f3a41" stroke-width="1.6"/>';
      else s += '<rect x="' + (x - 22) + '" y="' + (y - 13) + '" width="44" height="26" rx="12" fill="' + (bg || 'none') + '" stroke="#2f3a41" stroke-width="8"/><rect x="' + (x - 22) + '" y="' + (y - 13) + '" width="44" height="26" rx="12" fill="none" stroke="#8c99a2" stroke-width="4.4"/>';
    }
    return s;
  }
  function ring(cx, cy, r, bg) {
    return '<rect x="' + (cx - 22) + '" y="' + (cy - r - 40) + '" width="44" height="30" rx="6" fill="#6b7780" stroke="#3a454c" stroke-width="2"/>' +
      '<circle cx="' + (cx - 12) + '" cy="' + (cy - r - 25) + '" r="3" fill="#3a454c"/><circle cx="' + (cx + 12) + '" cy="' + (cy - r - 25) + '" r="3" fill="#3a454c"/>' +
      '<rect x="' + (cx - 7) + '" y="' + (cy - r - 16) + '" width="14" height="14" rx="3" fill="#56636c"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (bg || 'none') + '" stroke="#2f3a41" stroke-width="15"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#9aa6ae" stroke-width="10.5"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 1.5) + '" fill="none" stroke="#d3dadf" stroke-width="3" stroke-dasharray="30 12 60 400" transform="rotate(200 ' + cx + ' ' + cy + ')"/>';
  }
  S.knotenTeile = { reling: reling, kette: kette, ring: ring };
  // Knoten-Auswahl in der Lektion: <div class="knoten-wahl"> mit Buttons [data-knoten], Panels .knoten-panel[data-knoten]
  function knotenWahl() {
    Array.prototype.forEach.call(document.querySelectorAll('.knoten-wahl'), function (wahl) {
      var box = wahl.parentNode, knoepfe = wahl.querySelectorAll('button[data-knoten]'), panels = box.querySelectorAll('.knoten-panel');
      box.classList.add('knoten-js');
      function zeige(id, fokus) {
        Array.prototype.forEach.call(knoepfe, function (b) { var an = b.getAttribute('data-knoten') === id; b.setAttribute('aria-selected', an ? 'true' : 'false'); b.tabIndex = an ? 0 : -1; if (an && fokus) b.focus(); });
        Array.prototype.forEach.call(panels, function (p) { var an = p.getAttribute('data-knoten') === id; p.hidden = !an; var sz = p.querySelector('.szene'); if (sz && sz._sx && !an && sz._sx.playing) sz._sx.pause(true); });
      }
      Array.prototype.forEach.call(knoepfe, function (b, i) {
        var bild = b.querySelector('.knoten-bild'); if (bild && !bild.firstChild) bild.innerHTML = knotenBild(b.getAttribute('data-knoten'));
        b.addEventListener('click', function () { zeige(b.getAttribute('data-knoten')); });
        b.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!d) return;
          e.preventDefault(); var j = (i + d + knoepfe.length) % knoepfe.length; zeige(knoepfe[j].getAttribute('data-knoten'), true);
        });
      });
      if (knoepfe.length) zeige(knoepfe[0].getAttribute('data-knoten'));
    });
  }
  S.knoten = knoten; S.knotenBild = knotenBild;
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', knotenWahl) : setTimeout(knotenWahl, 0);
  S._Knoten = Knoten;
})();

/* ==========================================================================
   Die Knoten der Lektion A.3.1.1 – Koordinaten in einem 640×400-Feld.
   code: O = drüber, U = drunter – je Kreuzung, die das wachsende Ende neu bildet.
   Mit ?debug in der Test-Seite werden die Kreuzungen nummeriert angezeigt.
   ========================================================================== */
(function(){
var S = window.SX; if (!S || !S.knoten) return;
function K(n, d) { S.knoten(n, d); }
K('knoten-achtknoten',{titel:'Achtknoten',w:640,h:400,dicke:15,zoom:[235,212,1.3],
 seile:[{id:'a',farbe:'blau',vor:'p4',code:'OUOU',
  punkte:[[-30,220],[60,220],[160,220],[240,220],[300,220],[345,205],[360,160],[335,115],[285,100],[235,120],[205,165],[192,220],[180,265],[150,285],[118,265],[115,220],[125,180],[160,165],[205,172],[245,185],[262,220],[268,270],[285,330]]}],
 labels:[{x:4,y:204,text:'stehende Part'}],
 schritte:[
  {bis:'p12',titel:'Auge legen',text:'Das Ende über die stehende Part legen – es entsteht ein Auge.'},
  {bis:'p16',titel:'Hinter der stehenden Part herum',text:'Das Ende einmal hinter der stehenden Part herumführen.'},
  {titel:'Von vorne durch das Auge',text:'Das Ende von vorne durch das Auge stecken – die „Acht“ ist zu sehen.'},
  {nurText:1,dauer:1.6,titel:'Dichtholen',text:'An Ende und stehender Part ziehen, bis der Knoten fest sitzt.',pfeile:[[60,245,15,245],[275,300,285,345]]}
 ]});

K('knoten-palstek',{titel:'Palstek',w:640,h:400,dicke:14,zoom:[320,210,0.95],
 seile:[{id:'a',farbe:'sand',vor:'p3',code:'OUOUOOU',
  punkte:[[318,-40],[317,50],[315,105],[308,148],[272,190],[296,250],[348,252],[378,208],[364,160],[312,142],[262,136],[218,168],[200,270],[226,356],[292,392],[368,388],[424,352],[440,288],[420,244],[362,226],[344,190],[346,140],[350,102],[336,68],[316,60],[292,64],[272,92],[284,138],[295,170],[304,208],[312,256],[314,315]]}],
 labels:[{x:196,y:62,text:'stehende Part'}],
 schritte:[
  {bis:'p10',titel:'Auge legen',text:'Ein kleines Auge legen – der lose Teil liegt über der stehenden Part.'},
  {bis:'p22',titel:'Von unten durchs Auge',text:'Große Schlaufe bilden, das Ende von hinten durch das Auge stecken („das Kaninchen kommt aus dem Loch“).'},
  {bis:'p26',titel:'Hinter der stehenden Part herum',text:'Das Ende hinter der stehenden Part herumführen („läuft um den Baum“).'},
  {titel:'Zurück durchs Auge',text:'Das Ende wieder von vorne durch das Auge stecken („… und zurück ins Loch“).'},
  {nurText:1,dauer:1.6,titel:'Dichtholen',text:'Ende und Schlaufenpart zusammen halten und an der stehenden Part ziehen.',pfeile:[[300,50,300,8]]}
 ]});
K('knoten-webeleinstek',{titel:'Webeleinstek',w:640,h:400,dicke:13,zoom:[318,236,1.22],
 bühne:'<rect x="258" y="360" width="84" height="150" rx="38" fill="#1f5a78"/><rect x="266" y="372" width="10" height="120" rx="5" fill="#3f86b0"/><rect x="288" y="350" width="24" height="16" rx="5" fill="#173746"/>',
 hindernisse:[{linie:[[-200,148],[860,148]],breite:36,svg:S.knotenTeile.reling(148,18,-300,960),vorn:true}],
 seile:[{id:'a',farbe:'rot',vor:'p3',code:'OUOOUU',
  punkte:[[300,354],[300,320],[302,240],[306,190],[309,150],[304,126],[284,118],[266,128],[260,160],[260,196],[274,218],[320,206],[364,190],[374,150],[368,126],[350,118],[336,132],[334,165],[336,190],[342,240],[352,300]]}],
 labels:[{x:470,y:126,text:'Reling'},{x:350,y:380,text:'Fender'}],
 schritte:[
  {bis:'p9',titel:'Erster Törn',text:'Das Ende von vorne über die Reling legen und einmal herumführen.'},
  {bis:'p12',titel:'Über Kreuz',text:'Das Ende schräg über die stehende Part führen.'},
  {bis:'p18',titel:'Zweiter Törn',text:'Noch einmal von vorne um die Reling legen.'},
  {titel:'Unter der Kreuzung durch',text:'Das Ende unter dem schrägen Teil durchstecken – beide Enden zeigen nach unten.'},
  {nurText:1,dauer:1.6,titel:'Dichtholen',text:'An beiden Enden ziehen. Tipp: Mit einem halben Schlag zusätzlich sichern.',pfeile:[[372,250,378,290],[284,300,284,340]]}
 ]});
K('knoten-kreuzknoten',{titel:'Kreuzknoten',w:640,h:400,dicke:15,zoom:[320,220,1.12],
 seile:[
  {id:'blau',farbe:'blau',vor:'p2',code:'',
   punkte:[[-30,264],[80,264],[220,264],[340,264],[405,256],[438,220],[408,184],[340,176],[220,176],[120,176],[40,170]]},
  {id:'sand',farbe:'sand',vor:'p2',code:'UOUUOU',
   punkte:[[670,236],[590,236],[500,236],[400,236],[310,236],[268,248],[244,290],[204,284],[190,220],[204,156],[244,150],[268,192],[310,204],[400,204],[500,202],[590,196]]}],
 labels:[{x:54,y:292,text:'Ende A'},{x:540,y:262,text:'Ende B'}],
 schritte:[
  {seil:0,titel:'Bucht legen',text:'Mit Ende A eine Bucht legen.'},
  {seil:1,bis:'p6',titel:'Von unten in die Bucht',text:'Ende B unter dem Buchtende hindurch in die Bucht und über die untere Part wieder heraus.'},
  {seil:1,bis:'p10',titel:'Hinten um beide Parten',text:'Ende B hinter beiden Parten der Bucht herumführen.'},
  {seil:1,titel:'Auf derselben Seite zurück',text:'Über die obere Part zurück in die Bucht und unter dem Buchtende hinaus – parallel zur eigenen Part.'},
  {nurText:1,dauer:1.8,titel:'Dichtholen',text:'An beiden Seiten gleichzeitig ziehen. Merke: Die zwei Parten jedes Endes liegen nebeneinander – sonst ist es ein Altweiberknoten.',pfeile:[[120,300,60,300],[120,152,60,148],[520,272,580,272],[520,182,580,178]]}
 ]});
K('knoten-schotstek',{titel:'Schotstek',w:640,h:400,dicke:15,
 seile:[
  {id:'bucht',farbe:'blau',dicke:19,vor:0,code:'',
   punkte:[[-30,252],[80,252],[220,252],[380,252],[428,242],[446,208],[428,174],[380,164],[220,164],[110,164],[60,160]]},
  {id:'ende',farbe:'sand',dicke:13,vor:'p2',code:'UOUUOUO',
   punkte:[[690,208],[600,208],[520,208],[470,208],[400,212],[330,206],[302,176],[292,122],[262,92],[222,104],[206,165],[202,252],[216,306],[262,318],[304,284],[322,246],[346,208],[374,178],[394,140],[410,100],[424,62]]}],
 labels:[{x:16,y:282,text:'dickeres Tau'},{x:520,y:236,text:'dünneres Tau'}],
 schritte:[
  {seil:0,titel:'Bucht legen',text:'Mit dem dickeren Tau eine Bucht legen.'},
  {seil:1,bis:'p5',titel:'Von unten durch die Bucht',text:'Das dünnere Tau von unten durch die Bucht stecken.'},
  {seil:1,bis:'p15',titel:'Hinter beiden Parten herum',text:'Das Ende hinter beiden Parten der Bucht herumführen.'},
  {seil:1,titel:'Unter der eigenen Part durch',text:'Das Ende unter der eigenen stehenden Part durchstecken – beide kurzen Enden liegen auf derselben Seite.'},
  {nurText:1,dauer:1.8,titel:'Dichtholen',text:'An beiden stehenden Parten ziehen. Doppelter Schotstek: vor dem Durchstecken ein zweites Mal um die Bucht.',pfeile:[[90,228,20,228],[560,190,626,190]]}
 ]});
K('knoten-stopperstek',{titel:'Stopperstek',w:640,h:400,dicke:13,zoom:[330,215,1.18],
 hindernisse:[{linie:[[-200,190],[860,190]],breite:28,svg:S.knotenTeile.kette(190,-200,880),vorn:true}],
 seile:[{id:'a',farbe:'gruen',vor:'p3',code:'OUOOOUOOUU',
  punkte:[[-60,264],[60,258],[200,250],[330,240],[380,222],[394,188],[390,164],[372,156],[356,168],[354,206],[340,242],[318,262],[298,236],[296,190],[290,164],[272,156],[260,170],[258,210],[254,250],[272,284],[360,294],[450,286],[484,244],[490,190],[484,164],[466,156],[452,170],[450,214],[448,262],[450,300],[454,350]]}],
 labels:[{x:170,y:166,text:'Ankerkette'},{x:120,y:236,text:'Leine (Zug)'}],
 schritte:[
  {bis:'p10',titel:'Erster Törn',text:'Das Ende um die Kette legen und über die stehende Part führen.'},
  {bis:'p18',titel:'Zweiter Törn',text:'Einen zweiten Törn daneben legen – wieder über die stehende Part, zur Zugseite hin.'},
  {bis:'p27',titel:'Halber Schlag auf der anderen Seite',text:'Auf der anderen Seite der stehenden Part noch einmal um die Kette.'},
  {titel:'Unter sich selbst durch',text:'Das Ende unter dem eigenen Schlag durchstecken.'},
  {nurText:1,dauer:1.8,titel:'Dichtholen',text:'Zug auf der Leine nach links: Die beiden Törns klemmen sich an der Kette fest.',pfeile:[[170,276,100,282]]}
 ]});
K('knoten-rundtoern',{titel:'Rundtörn mit zwei halben Schlägen',w:640,h:400,dicke:14,
 hindernisse:[{linie:[[249,125],[248,137],[245,148],[241,159],[235,168],[227,177],[218,185],[209,191],[198,195],[187,198],[175,199],[163,198],[152,195],[141,191],[132,185],[123,177],[115,168],[109,159],[105,148],[102,137],[101,125],[102,113],[105,102],[109,91],[115,82],[123,73],[132,65],[141,59],[152,55],[163,52],[175,51],[187,52],[198,55],[209,59],[218,65],[227,73],[235,82],[241,91],[245,102],[248,113],[249,125]],breite:15,svg:S.knotenTeile.ring(175,125,74),vorn:'<circle cx="175" cy="125" r="74" fill="none" stroke="#2f3a41" stroke-width="15"/><circle cx="175" cy="125" r="74" fill="none" stroke="#9aa6ae" stroke-width="10.5"/>'}],
 seile:[{id:'a',farbe:'sand',vor:'p4',code:'UOUOOUOOUU',punkte:[[851,373],[625,291],[484,240],[371,199],[307,172],[273,153],[242,157],[204,146],[199,154],[214,188],[223,215],[204,225],[188,198],[175,161],[166,162],[147,194],[134,218],[153,251],[208,259],[273,266],[318,272],[367,257],[398,209],[403,181],[390,166],[371,171],[356,194],[344,221],[366,267],[429,286],[468,266],[486,241],[490,212],[476,197],[457,203],[443,225],[433,253],[425,285],[420,334],[431,380]]}],
 labels:[{x:268,y:52,text:'Festmacherring'},{x:520,y:250,text:'zum Boot'}],
 schritte:[
  {bis:'p10',titel:'Erster Törn',text:'Das Ende von hinten durch den Ring führen.'},
  {bis:'p16',titel:'Rundtörn',text:'Ein zweites Mal durch den Ring – der Rundtörn nimmt die Last auf.'},
  {bis:'p31',titel:'Erster halber Schlag',text:'Mit dem Ende einen halben Schlag um die stehende Part legen.'},
  {titel:'Zweiter halber Schlag',text:'Einen zweiten halben Schlag in gleicher Richtung – er sichert den ersten.'},
  {nurText:1,dauer:1.8,titel:'Dichtholen',text:'Die Schläge an die Törns heranschieben. Vorteil: Lässt sich auch unter Last lösen.',pfeile:[[550,300,620,324]]}
 ]});
})();
