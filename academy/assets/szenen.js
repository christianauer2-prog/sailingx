/* ==========================================================================
   SailingX-Academy – Animations-Engine für Lektionsgrafiken
   --------------------------------------------------------------------------
   Eine Szene besteht aus „Einstellungen“ (shots). Jede Einstellung hat eine
   Dauer, Schritte (mit Titel/Text/Kommando) und eine Zeichenfunktion.
   Für Manöver gibt es SX.manoever(): Das Boot folgt einer Bahn, die Segel-
   stellung wird aus dem Wind berechnet (Segel immer in Lee, Baum/Fock
   wechseln physikalisch richtig), Leinen/Fender/Gas/Ruder werden mitgezeigt.
   Szenen werden mit SX.szene(name, def) registriert und in der Lektion über
   <div class="szene" data-szene="name"></div> eingebunden.
   ========================================================================== */
(function () {
  'use strict';
  var R = Math.PI / 180;
  function norm(a) { a = ((a + 180) % 360 + 360) % 360 - 180; return a; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function f1(v) { return Math.round(v * 10) / 10; }
  var EASE = {
    lin: function (u) { return u; },
    ein: function (u) { return u * u; },
    aus: function (u) { return 1 - (1 - u) * (1 - u); },
    inaus: function (u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  };
  function fwd(h) { return [Math.sin(h * R), -Math.cos(h * R)]; }   // Bug-Richtung
  function stb(h) { return [Math.cos(h * R), Math.sin(h * R)]; }    // Steuerbord-Richtung
  function local2world(s, p) { // Bootskoordinaten (x = Stb, y = achtern) -> Welt
    var c = Math.cos(s.h * R), n = Math.sin(s.h * R);
    return [s.x + p[0] * c - p[1] * n, s.y + p[0] * n + p[1] * c];
  }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ------------------------------------------------------------------ */
  /*  Farben (Markenfarben + Seekarten-Töne)                              */
  /* ------------------------------------------------------------------ */
  var F = {
    navy: '#173746', navy2: '#1f5a78', accent: '#2289c6', ink: '#2b2b2b', muted: '#5b6770',
    wasser1: '#dcedf5', wasser2: '#c9e2ef', welle: '#b6d6e6', rot: '#d7263d', gruen: '#1f9d55',
    gelb: '#f4c20d', orange: '#f39129', kai: '#cfc8b8', kaiKante: '#a89f8a', segel: '#fbfbf8',
    segelRand: '#6f7f89', rumpf: '#ffffff', fremd: '#b9c6ce', leine: '#8a5a2b'
  };

  /* ------------------------------------------------------------------ */
  /*  Bahn-Baukasten für das eigene Boot                                  */
  /* ------------------------------------------------------------------ */
  function Bahn(start) {
    this.s = { x: start.x, y: start.y, h: start.h };
    this.t = 0; this.segs = []; this.propSet = [];
    if (start.props) this.props(start.props);
  }
  Bahn.prototype._push = function (dur, fn, props, ease) {
    var s0 = { x: this.s.x, y: this.s.y, h: this.s.h }, e = EASE[ease || 'lin'];
    var seg = { t0: this.t, t1: this.t + dur, f: function (u) { return fn(s0, e(u)); } };
    this.segs.push(seg);
    if (props) this.propSet.push({ t: this.t, p: props });
    var end = fn(s0, 1); this.s = { x: end.x, y: end.y, h: end.h }; this.t += dur;
    return this;
  };
  // geradeaus fahren (dist > 0 voraus, < 0 achteraus)
  Bahn.prototype.fahr = function (dist, dur, props, ease) {
    return this._push(dur, function (s, u) { var f = fwd(s.h); return { x: s.x + f[0] * dist * u, y: s.y + f[1] * dist * u, h: s.h }; }, props, ease);
  };
  // Bogen: winkel > 0 = nach Steuerbord drehen; radius in px; rueck = Achterausfahrt
  Bahn.prototype.kurve = function (winkel, radius, dur, props, ease, rueck) {
    var sg = winkel >= 0 ? 1 : -1, rv = rueck ? -1 : 1;
    return this._push(dur, function (s, u) {
      var S = stb(s.h), c = [s.x + S[0] * radius * sg * rv, s.y + S[1] * radius * sg * rv];
      var h = s.h + winkel * u, S2 = stb(h);
      return { x: c[0] - S2[0] * radius * sg * rv, y: c[1] - S2[1] * radius * sg * rv, h: h };
    }, props, ease);
  };
  // freie Bewegung: Versatz in Welt (dx, dy) und Drehung dh um Punkt pivot (Bootskoord. y, 0 = Mitte)
  Bahn.prototype.bewege = function (o, dur, props, ease) {
    var dx = o.dx || 0, dy = o.dy || 0, dh = o.dh || 0, pv = o.pivot || 0;
    return this._push(dur, function (s, u) {
      var P = local2world(s, [0, pv]); var h = s.h + dh * u;
      var back = local2world({ x: 0, y: 0, h: h }, [0, pv]);
      return { x: P[0] - back[0] + dx * u, y: P[1] - back[1] + dy * u, h: h };
    }, props, ease);
  };
  Bahn.prototype.warte = function (dur, props) { return this.bewege({}, dur, props); };
  Bahn.prototype.props = function (p) { this.propSet.push({ t: this.t, p: p }); return this; };
  Bahn.prototype.pose = function (t) {
    var sg = null;
    for (var i = 0; i < this.segs.length; i++) { sg = this.segs[i]; if (t <= sg.t1) break; }
    if (!sg) return { x: this.s.x, y: this.s.y, h: this.s.h };
    var u = sg.t1 > sg.t0 ? clamp((t - sg.t0) / (sg.t1 - sg.t0), 0, 1) : 1;
    return sg.f(u);
  };
  Bahn.prototype.propsAt = function (t) {
    var p = {};
    this.propSet.forEach(function (ps) { if (ps.t <= t + 1e-6) for (var k in ps.p) p[k] = ps.p[k]; });
    return p;
  };

  /* ------------------------------------------------------------------ */
  /*  Segelstellung aus dem Wind                                          */
  /* ------------------------------------------------------------------ */
  function segelZiel(a, p, prevSide) {
    // a = Windeinfall relativ zum Bug (-180..180, + = Wind von Steuerbord)
    var abs = Math.abs(a), side = a > 0 ? -1 : 1;           // Segel nach Lee
    if (abs > 168 && prevSide) side = prevSide;              // platt vor dem Wind: Seite halten
    var main = { side: side, ang: clamp(abs * 0.52 - 9, 12, 84), luff: abs < 32 };
    var jib = { side: side, ang: clamp(abs * 0.34 - 2, 12, 50), luff: abs < 34 };
    if (p.gross === 'dicht') { main.ang = 6; main.luff = abs < 32; }
    if (p.gross === 'mitte') { main.ang = 1; }
    if (typeof p.gross === 'number') { main.side = p.gross < 0 ? -1 : 1; main.ang = Math.abs(p.gross); main.luff = false; }
    if (p.gross === 'killt') { main.luff = true; main.ang = clamp(abs * .5 - 5, 10, 70); }
    if (p.fock === 'dicht') { jib.ang = 8; }
    if (p.fock === 'killt') { jib.luff = true; }
    if (p.fockSeite) { jib.side = p.fockSeite; jib.back = jib.side !== side; if (jib.back) { jib.ang = 18; jib.luff = false; } }
    if (p.fockBack) { jib.side = p.fockBack; jib.back = true; jib.ang = 22; jib.luff = false; }
    if (p.grossSeite) { main.side = p.grossSeite; }
    return { main: main, jib: jib };
  }

  /* ------------------------------------------------------------------ */
  /*  Zeichnen: Boote                                                     */
  /* ------------------------------------------------------------------ */
  var L = 64; // Bootslänge in px
  function rumpfPfad(l, b) {
    var h = l / 2, w = b / 2;
    return 'M0,' + (-h) + ' C' + (w * .78) + ',' + (-h * .7) + ' ' + w + ',' + (-h * .2) + ' ' + w + ',' + (h * .25) +
      ' L' + (w * .82) + ',' + h + ' L' + (-w * .82) + ',' + h + ' L' + (-w) + ',' + (h * .25) +
      ' C' + (-w) + ',' + (-h * .2) + ' ' + (-w * .78) + ',' + (-h * .7) + ' 0,' + (-h) + ' Z';
  }
  function segelPfad(x0, y0, x1, y1, bauch) {
    // Segel als Kurve vom Hals (x0,y0) zum Schothorn (x1,y1) mit Bauch nach Lee
    var mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
    var nx = -dy / len, ny = dx / len; // Normale
    var cx = mx + nx * bauch * len, cy = my + ny * bauch * len;
    return 'M' + f1(x0) + ',' + f1(y0) + ' Q' + f1(cx) + ',' + f1(cy) + ' ' + f1(x1) + ',' + f1(y1) + ' Z';
  }
  function segel(a, b, luff, bauch, ang, t, back) {
    var sg = ang >= 0 ? 1 : -1;
    if (luff) { // killendes Segel: flatternde Kante
      var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, d = 'M' + f1(a[0]) + ',' + f1(a[1]);
      for (var i = 1; i <= 4; i++) {
        var u = i / 4, amp = Math.sin(t * 34 + i * 1.9) * 3.4 * Math.sin(u * Math.PI * .9 + .3);
        var px = a[0] + dx * (u - .125) + nx * amp, py = a[1] + dy * (u - .125) + ny * amp;
        d += ' Q' + f1(px) + ',' + f1(py) + ' ' + f1(a[0] + dx * u) + ',' + f1(a[1] + dy * u);
      }
      return '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#3d5361" stroke-width="1.3" stroke-linecap="round"/>';
    }
    var pth = segelPfad(a[0], a[1], b[0], b[1], bauch * sg);
    return '<path d="' + pth + '" fill="rgba(23,55,70,.22)" transform="translate(2.5,3)"/>' +
      '<path d="' + pth + '" fill="' + (back ? '#fde3c0' : '#ffffff') + '" stroke="' + (back ? '#c9731a' : '#2a4452') + '" stroke-width="1.9" stroke-linejoin="round"/>';
  }
  function zeichneBoot(st, o) {
    o = o || {};
    var s = '<g transform="translate(' + f1(st.x) + ',' + f1(st.y) + ') rotate(' + f1(st.h) + ') scale(' + (st.k || 1) + ')">';
    var col = o.fremd ? F.fremd : F.rumpf, rand = o.fremd ? '#8796a0' : F.navy;
    // Schatten
    s += '<path d="' + rumpfPfad(L, 22) + '" fill="rgba(23,55,70,.14)" transform="translate(2.5,3)"/>';
    // Fender
    var fd = st.fender;
    if (fd) {
      var fx = 12.3, ys = [-8, 4, 16];
      if (fd === 'stb' || fd === 'beide') ys.forEach(function (y) { s += '<rect x="' + (fx - 1) + '" y="' + (y - 4) + '" width="4.5" height="8" rx="2.2" fill="#2d3a44"/>'; });
      if (fd === 'bb' || fd === 'beide') ys.forEach(function (y) { s += '<rect x="' + (-fx - 3.5) + '" y="' + (y - 4) + '" width="4.5" height="8" rx="2.2" fill="#2d3a44"/>'; });
      if (st.fenderBug) s += '<rect x="-3" y="-35" width="6" height="5" rx="2.4" fill="#2d3a44"/>';
      if (st.fenderHeck) s += '<rect x="-4" y="30.5" width="8" height="4.5" rx="2.2" fill="#2d3a44"/>';
    }
    // Ruderblatt
    var rd = (st.rudder || 0);
    s += '<line x1="0" y1="' + (L / 2 - 1) + '" x2="' + f1(Math.sin(rd * R) * 9) + '" y2="' + f1(L / 2 - 1 + Math.cos(rd * R) * 9) + '" stroke="' + rand + '" stroke-width="2.6" stroke-linecap="round"/>';
    // Rumpf + Deck
    s += '<path d="' + rumpfPfad(L, 22) + '" fill="' + (o.fremd ? col : '#eef2f4') + '" stroke="' + rand + '" stroke-width="1.6"/>';
    s += '<path d="' + rumpfPfad(L - 8, 15) + '" fill="none" stroke="' + (o.fremd ? '#a7b3ba' : '#dfe5e9') + '" stroke-width="1"/>';
    s += '<rect x="-7" y="9" width="14" height="17" rx="3" fill="' + (o.fremd ? '#a7b3ba' : '#e9eef1') + '" stroke="' + (o.fremd ? '#8796a0' : '#b8c4cc') + '" stroke-width=".8"/>';
    if (!o.fremd) s += '<rect x="-4.5" y="-2" width="9" height="8" rx="2" fill="#dfe6ea"/>';
    // Segel
    if (!o.fremd && !st.ohneSegel) {
      var mast = [0, -8];
      if (st.jibShow) {
        var ja = st.jib * R, jl = 28, clew = [Math.sin(ja) * jl, -31 + Math.cos(ja) * jl];
        s += segel([0, -31], clew, st.jibLuff, st.jibBack ? .2 : -.25, st.jib, st.t, st.jibBack);
      }
      if (st.mainShow) {
        var ma = st.boom * R, bl = 30, end = [Math.sin(ma) * bl, mast[1] + Math.cos(ma) * bl];
        s += segel(mast, end, st.mainLuff, -.24, st.boom, st.t + 1.3, false);
        s += '<line x1="' + mast[0] + '" y1="' + mast[1] + '" x2="' + f1(end[0]) + '" y2="' + f1(end[1]) + '" stroke="' + F.navy + '" stroke-width="2.3" stroke-linecap="round"/>';
      }
      s += '<circle cx="0" cy="-8" r="2.6" fill="' + F.navy + '"/>';
    } else if (o.fremd) {
      s += '<circle cx="0" cy="-8" r="2" fill="#6d7c86"/><line x1="0" y1="-8" x2="0" y2="16" stroke="#6d7c86" stroke-width="1.6"/>';
    }
    s += '</g>';
    return s;
  }

  /* Schraubenwasser & Radeffekt */
  function zeichneSchraube(st, t, o) {
    if (!st.gang || st.gang === 'neutral') return '';
    var s = '<g transform="translate(' + f1(st.x) + ',' + f1(st.y) + ') rotate(' + f1(st.h) + ') scale(' + (st.k || 1) + ')">';
    var n = 7;
    for (var i = 0; i < n; i++) {
      var ph = ((t * 1.6 + i / n) % 1);
      if (st.gang === 'voraus') {
        var y = 32 + ph * 34, x = Math.sin(i * 2.1 + t * 3) * (2 + ph * 7) + Math.sin((st.rudder || 0) * R) * ph * 22;
        s += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(2.6 - ph * 1.6) + '" fill="#fff" opacity="' + f1(.9 - ph * .8) + '"/>';
      } else {
        var y2 = 30 - ph * 30, x2 = Math.sin(i * 2.1 + t * 3) * (3 + ph * 6);
        s += '<circle cx="' + f1(x2) + '" cy="' + f1(y2) + '" r="' + f1(2.4 - ph * 1.4) + '" fill="#fff" opacity="' + f1(.85 - ph * .75) + '"/>';
      }
    }
    if (st.gang === 'zurueck' && st.radeffekt) {
      var d = st.radeffekt; // +1 = Heck nach Steuerbord
      s += '<path d="M' + (d * 6) + ',40 Q' + (d * 20) + ',42 ' + (d * 26) + ',30" fill="none" stroke="' + F.rot + '" stroke-width="2.4" marker-end="url(#sxPfeilRot)"/>';
    }
    s += '</g>';
    return s;
  }

  function zeichneLeinen(st, leinen) {
    if (!leinen) return '';
    var s = '';
    leinen.forEach(function (ln) {
      var k = st.k || 1, a = local2world(st, [ln.von[0] * k, ln.von[1] * k]), b = ln.nach;
      if (ln.slip) { // auf Slip: Leine zum Punkt und zurück
        var a2 = local2world(st, [ln.slip[0] * k, ln.slip[1] * k]);
        s += '<path d="M' + f1(a[0]) + ',' + f1(a[1]) + ' L' + f1(b[0]) + ',' + f1(b[1]) + ' L' + f1(a2[0]) + ',' + f1(a2[1]) + '" fill="none" stroke="' + F.leine + '" stroke-width="2" stroke-linejoin="round"/>';
      } else if (ln.lose) {
        var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 10;
        s += '<path d="M' + f1(a[0]) + ',' + f1(a[1]) + ' Q' + f1(mx) + ',' + f1(my) + ' ' + f1(b[0]) + ',' + f1(b[1]) + '" fill="none" stroke="' + F.leine + '" stroke-width="1.8" stroke-dasharray="4 3"/>';
      } else {
        s += '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '" stroke="' + F.leine + '" stroke-width="2.2"/>';
      }
      if (ln.label) {
        var lx = (a[0] + b[0]) / 2 + (ln.lx || 0), ly = (a[1] + b[1]) / 2 + (ln.ly || 0);
        s += '<text x="' + f1(lx) + '" y="' + f1(ly) + '" class="sx-lbl sx-lbl-leine">' + esc(ln.label) + '</text>';
      }
    });
    return s;
  }

  /* ------------------------------------------------------------------ */
  /*  Gemeinsame Kulissen                                                 */
  /* ------------------------------------------------------------------ */
  var DEFS = '<defs>' +
    '<marker id="sxPfeil" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + F.navy + '"/></marker>' +
    '<marker id="sxPfeilRot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + F.rot + '"/></marker>' +
    '<marker id="sxPfeilBlau" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + F.accent + '"/></marker>' +
    '<marker id="sxPfeilGruen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + F.gruen + '"/></marker>' +
    '<linearGradient id="sxWasser" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + F.wasser1 + '"/><stop offset="1" stop-color="' + F.wasser2 + '"/></linearGradient>' +
    '<pattern id="sxWellen" width="60" height="26" patternUnits="userSpaceOnUse"><path d="M4 14 q6 -5 12 0 M34 4 q6 -5 12 0" fill="none" stroke="' + F.welle + '" stroke-width="1.2" stroke-linecap="round"/></pattern>' +
    '<pattern id="sxStein" width="22" height="12" patternUnits="userSpaceOnUse"><rect width="22" height="12" fill="' + F.kai + '"/><path d="M0 11.5 H22 M11 0 V6 M0 6 H22 M5 6 V12 M16 6 V12" stroke="#bdb5a3" stroke-width="1"/></pattern>' +
    '<linearGradient id="sxHimmel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaf4fa"/><stop offset="1" stop-color="#f8fbfd"/></linearGradient>' +
    '<linearGradient id="sxSee" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fcbe0"/><stop offset="1" stop-color="#4f8fb0"/></linearGradient>' +
    '<linearGradient id="sxNacht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1622"/><stop offset="1" stop-color="#1c3346"/></linearGradient>' +
    '<linearGradient id="sxSeeNacht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16303f"/><stop offset="1" stop-color="#08141c"/></linearGradient>' +
    '<pattern id="sxGrund" width="16" height="10" patternUnits="userSpaceOnUse"><rect width="16" height="10" fill="#d9c79f"/><circle cx="4" cy="3" r="1.2" fill="#c2ad80"/><circle cx="12" cy="7" r="1" fill="#c2ad80"/></pattern>' +
    '<radialGradient id="sxBoje" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#ffb46a"/><stop offset="1" stop-color="#e2711d"/></radialGradient>' +
    '</defs>';

  function wasser(w, h, t, wind) {
    var dx = 0, dy = 0;
    if (wind != null) { var v = fwd(wind + 180); dx = (v[0] * t * 6) % 60; dy = (v[1] * t * 6) % 26; }
    return '<rect width="' + w + '" height="' + h + '" fill="url(#sxWasser)"/>' +
      '<rect x="-60" y="-26" width="' + (w + 120) + '" height="' + (h + 52) + '" fill="url(#sxWellen)" transform="translate(' + f1(dx) + ',' + f1(dy) + ')"/>';
  }
  function windRose(x, y, wind, kn) {
    // Pfeil zeigt, WOHIN der Wind weht; wind = Richtung, AUS der er kommt
    var v = fwd(wind + 180), a = [x - v[0] * 20, y - v[1] * 20], b = [x + v[0] * 18, y + v[1] * 18];
    return '<g class="sx-wind"><circle cx="' + x + '" cy="' + y + '" r="31" fill="rgba(255,255,255,.82)" stroke="#b8c4cc"/>' +
      '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '" stroke="' + F.accent + '" stroke-width="4" stroke-linecap="round" marker-end="url(#sxPfeilBlau)"/>' +
      '<text x="' + x + '" y="' + (y + 45) + '" class="sx-lbl sx-lbl-c">Wind' + (kn ? ' ' + kn : '') + '</text></g>';
  }
  function windStreifen(w, h, t, wind) {
    var v = fwd(wind + 180), s = '';
    for (var i = 0; i < 9; i++) {
      var ph = (t * .22 + i * .37) % 1, bx = ((i * 97) % w), by = ((i * 53) % h);
      var x = (bx + v[0] * ph * w * .9 + w) % w, y = (by + v[1] * ph * h * .9 + h) % h;
      s += '<line x1="' + f1(x) + '" y1="' + f1(y) + '" x2="' + f1(x + v[0] * 26) + '" y2="' + f1(y + v[1] * 26) + '" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity="' + f1(Math.sin(ph * Math.PI) * .75) + '"/>';
    }
    return s;
  }
  function kai(x, y, w, h, o) {
    o = o || {};
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#sxStein)"/>';
    var edge = o.kante || 'unten';
    if (edge === 'unten') s += '<rect x="' + x + '" y="' + (y + h - 4) + '" width="' + w + '" height="4" fill="' + F.kaiKante + '"/>';
    if (edge === 'oben') s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="4" fill="' + F.kaiKante + '"/>';
    if (edge === 'links') s += '<rect x="' + x + '" y="' + y + '" width="4" height="' + h + '" fill="' + F.kaiKante + '"/>';
    if (edge === 'rechts') s += '<rect x="' + (x + w - 4) + '" y="' + y + '" width="4" height="' + h + '" fill="' + F.kaiKante + '"/>';
    (o.poller || []).forEach(function (p) { s += poller(p[0], p[1]); });
    if (o.text) s += '<text x="' + (o.tx != null ? o.tx : x + 10) + '" y="' + (o.ty != null ? o.ty : y + 17) + '" class="sx-lbl sx-lbl-kai">' + esc(o.text) + '</text>';
    return s;
  }
  function poller(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.2" fill="#3c4a54"/><circle cx="' + (x - 1) + '" cy="' + (y - 1) + '" r="1.6" fill="#7b8a94"/>'; }
  function boje(x, y, t, o) {
    o = o || {}; var b = Math.sin((t || 0) * 2.2) * .6;
    return '<circle cx="' + x + '" cy="' + (y + b) + '" r="' + (o.r || 7) + '" fill="url(#sxBoje)" stroke="#b5561b" stroke-width="1"/>' +
      '<circle cx="' + x + '" cy="' + (y + b) + '" r="' + ((o.r || 7) + 5) + '" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>';
  }
  function person(x, y, t) {
    var b = Math.sin(t * 3) * 1.2;
    return '<g><circle cx="' + x + '" cy="' + y + '" r="13" fill="none" stroke="#fff" stroke-width="1.4" opacity="' + f1(.4 + .3 * Math.sin(t * 2)) + '"/>' +
      '<circle cx="' + x + '" cy="' + (y + b) + '" r="9" fill="none" stroke="' + F.orange + '" stroke-width="3.2"/>' +
      '<circle cx="' + x + '" cy="' + (y + b) + '" r="4.6" fill="#f2c9a0" stroke="#8a5a2b" stroke-width=".8"/></g>';
  }
  function label(x, y, text, cls) { return '<text x="' + f1(x) + '" y="' + f1(y) + '" class="sx-lbl ' + (cls || '') + '">' + esc(text) + '</text>'; }
  function pfeil(x1, y1, x2, y2, farbe, dash) {
    var m = farbe === 'rot' ? 'sxPfeilRot' : farbe === 'gruen' ? 'sxPfeilGruen' : farbe === 'blau' ? 'sxPfeilBlau' : 'sxPfeil';
    var c = farbe === 'rot' ? F.rot : farbe === 'gruen' ? F.gruen : farbe === 'blau' ? F.accent : F.navy;
    return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="' + c + '" stroke-width="2.2" ' + (dash ? 'stroke-dasharray="5 4" ' : '') + 'marker-end="url(#' + m + ')"/>';
  }
  function bogenPfeil(cx, cy, r, a0, a1, farbe) {
    var p0 = [cx + Math.sin(a0 * R) * r, cy - Math.cos(a0 * R) * r], p1 = [cx + Math.sin(a1 * R) * r, cy - Math.cos(a1 * R) * r];
    var large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
    var m = farbe === 'rot' ? 'sxPfeilRot' : farbe === 'blau' ? 'sxPfeilBlau' : 'sxPfeil', c = farbe === 'rot' ? F.rot : farbe === 'blau' ? F.accent : F.navy;
    return '<path d="M' + f1(p0[0]) + ',' + f1(p0[1]) + ' A' + r + ',' + r + ' 0 ' + large + ' ' + sweep + ' ' + f1(p1[0]) + ',' + f1(p1[1]) + '" fill="none" stroke="' + c + '" stroke-width="2.2" marker-end="url(#' + m + ')"/>';
  }
  function sprechblase(x, y, text) {
    var w = text.length * 7.3 + 22;
    return '<g class="sx-ruf" transform="translate(' + f1(x) + ',' + f1(y) + ')"><rect x="' + f1(-w / 2) + '" y="-30" width="' + f1(w) + '" height="24" rx="12" fill="' + F.navy + '"/>' +
      '<path d="M-6,-7 L0,2 L6,-7 Z" fill="' + F.navy + '"/><text x="0" y="-13.5" class="sx-ruf-t">' + esc(text) + '</text></g>';
  }
  function hudMotor(x, y, st, o) {
    o = o || {};
    var g = st.gang || 'neutral', lev = g === 'voraus' ? -14 : g === 'zurueck' ? 14 : 0, rd = st.rudder || 0;
    var s = '<g class="sx-hud" transform="translate(' + x + ',' + y + ')"><rect width="196" height="80" rx="12" fill="rgba(255,255,255,.9)" stroke="#b8c4cc"/>';
    s += '<text x="12" y="18" class="sx-hud-t">GANG</text>';
    s += '<rect x="20" y="24" width="6" height="40" rx="3" fill="#dfe5e9"/><circle cx="23" cy="' + (44 + lev) + '" r="7" fill="' + (g === 'neutral' ? '#8a969e' : F.accent) + '"/>';
    s += '<text x="36" y="34" class="sx-hud-s' + (g === 'voraus' ? ' on' : '') + '">voraus</text><text x="36" y="48" class="sx-hud-s' + (g === 'neutral' ? ' on' : '') + '">neutral</text><text x="36" y="62" class="sx-hud-s' + (g === 'zurueck' ? ' on' : '') + '">zurück</text>';
    s += '<text x="104" y="18" class="sx-hud-t">RUDER</text>';
    s += '<path d="M114,62 A34,34 0 0 1 182,62" fill="none" stroke="#dfe5e9" stroke-width="6" stroke-linecap="round"/>';
    var a = clamp(rd, -40, 40) * 1.6; // Anzeige: + = Steuerbord
    s += '<line x1="148" y1="64" x2="' + f1(148 + Math.sin(a * R) * 28) + '" y2="' + f1(64 - Math.cos(a * R) * 28) + '" stroke="' + F.navy + '" stroke-width="3.4" stroke-linecap="round"/><circle cx="148" cy="64" r="4" fill="' + F.navy + '"/>';
    s += '<text x="100" y="75" class="sx-hud-s">Bb</text><text x="178" y="75" class="sx-hud-s">Stb</text>';
    if (o.schraube) s += '<text x="98" y="-6" class="sx-lbl sx-lbl-c" style="font-size:11px">' + esc(o.schraube) + '</text>';
    return s + '</g>';
  }

  /* ------------------------------------------------------------------ */
  /*  Manöver-Einstellung (Draufsicht)                                    */
  /* ------------------------------------------------------------------ */
  function manoever(o) {
    var W = o.w || 800, H = o.h || 460, bahn = o.bahn, dur = o.dur || bahn.t, fps = 30, n = Math.ceil(dur * fps) + 1;
    var frames = [], boom = null, jib = null, side = null;
    for (var i = 0; i < n; i++) {
      var t = i / fps, pz = bahn.pose(t), p = bahn.propsAt(t);
      var st = { t: t, x: pz.x, y: pz.y, h: pz.h, k: o.massstab || 1 };
      var wind = p.wind != null ? p.wind : o.wind;
      if (wind != null && !o.motor) {
        var a = norm(wind - pz.h), z = segelZiel(a, p, side);
        side = z.main.side;
        var tb = z.main.side * z.main.ang, tj = z.jib.side * z.jib.ang;
        if (boom === null) { boom = tb; jib = tj; }
        var rb = p.baumSchnell ? 900 : 190, rj = 320;
        boom += clamp(tb - boom, -rb / fps, rb / fps); jib += clamp(tj - jib, -rj / fps, rj / fps);
        st.boom = boom; st.jib = jib; st.mainLuff = z.main.luff && !p.grossSeite; st.jibLuff = z.jib.luff && !z.jib.back; st.jibBack = !!z.jib.back;
        st.mainShow = p.gross !== 'weg'; st.jibShow = p.fock !== 'weg';
      } else { st.ohneSegel = !!o.motor || p.gross === 'weg'; }
      st.rudder = p.ruder || 0; st.gang = p.gang; st.radeffekt = p.radeffekt; st.fender = p.fender; st.fenderBug = p.fenderBug; st.fenderHeck = p.fenderHeck;
      st.leinen = p.leinen; st.ruf = p.ruf; st.hinweis = p.hinweis; st.show = p.zeige || {};
      frames.push(st);
    }
    var spur = [];
    frames.forEach(function (st, i) { if (i % 3 === 0) { var s = local2world(st, [0, 30 * st.k]); spur.push(f1(s[0]) + ',' + f1(s[1])); } });
    return {
      dur: dur, w: W, h: H, steps: o.steps || [],
      render: function (t) {
        var i = clamp(Math.round(t * fps), 0, frames.length - 1), st = frames[i];
        st.t = t;
        var s = wasser(W, H, t, o.motor ? null : o.wind);
        if (o.wind != null && !o.ohneWindStreifen) s += windStreifen(W, H, t, o.wind);
        if (o.kulisse) s += typeof o.kulisse === 'function' ? o.kulisse(t, st) : o.kulisse;
        if (o.spur !== false) {
          var k = Math.floor(i / 3) + 1;
          s += '<polyline points="' + spur.slice(0, k).join(' ') + '" fill="none" stroke="' + F.navy2 + '" stroke-width="1.6" stroke-dasharray="3 5" opacity=".55"/>';
        }
        if (o.vorher) s += o.vorher(t, st);
        s += zeichneLeinen(st, st.leinen);
        s += zeichneSchraube(st, t);
        s += zeichneBoot(st);
        if (o.nachher) s += o.nachher(t, st);
        if (st.ruf) { var ry = st.y - (Math.abs(Math.cos(st.h * R)) * 30 + 14) * st.k - 4; s += sprechblase(clamp(st.x, 90, W - 90), clamp(ry, 44, H), st.ruf); }
        if (o.wind != null && o.windrose !== false) s += windRose(o.roseX || W - 52, o.roseY || 52, o.wind, o.windText);
        if (o.motor) s += hudMotor(o.hudX != null ? o.hudX : 14, o.hudY != null ? o.hudY : H - 88, st, { schraube: o.schraube });
        return s;
      }
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Player (Steuerung, Schritte, Autoplay)                              */
  /* ------------------------------------------------------------------ */
  var SZENEN = {};
  function Player(el, def) {
    var self = this;
    this.el = el; this.def = def;
    this.shots = def.shots; this.W = def.w || this.shots[0].w || 800; this.H = def.h || this.shots[0].h || 460;
    var t0 = 0; this.steps = [];
    this.shots.forEach(function (sh, si) {
      sh.start = t0;
      (sh.steps || []).forEach(function (st) { self.steps.push({ t: t0 + st.t, titel: st.titel, text: st.text, shot: si }); });
      t0 += sh.dur;
    });
    this.total = t0; this.t = 0; this.playing = false; this.speed = 1;
    el.classList.add('sx-szene');
    el.innerHTML =
      '<div class="sx-buehne"><svg viewBox="0 0 ' + this.W + ' ' + this.H + '" role="img" aria-label="' + esc(def.titel || 'Animation') + '">' + DEFS + '<g class="sx-dyn"></g></svg>' +
      '<div class="sx-cap" aria-live="polite"><span class="sx-cap-n"></span><span class="sx-cap-t"></span></div></div>' +
      '<div class="sx-ctrl">' +
      '<button type="button" class="sx-b sx-prev" aria-label="Vorheriger Schritt">⏮</button>' +
      '<button type="button" class="sx-b sx-play" aria-label="Abspielen">▶</button>' +
      '<button type="button" class="sx-b sx-next" aria-label="Nächster Schritt">⏭</button>' +
      '<div class="sx-bar" role="slider" aria-label="Zeitleiste" tabindex="0"><i></i><span class="sx-marks"></span></div>' +
      '<button type="button" class="sx-b sx-speed" aria-label="Geschwindigkeit">1×</button>' +
      '</div>' +
      '<ol class="sx-steps"></ol>';
    this.dyn = el.querySelector('.sx-dyn');
    this.bar = el.querySelector('.sx-bar i');
    this.cap = el.querySelector('.sx-cap');
    var marks = el.querySelector('.sx-marks'), ol = el.querySelector('.sx-steps');
    this.steps.forEach(function (st, i) {
      var m = document.createElement('b'); m.style.left = (st.t / self.total * 100) + '%'; marks.appendChild(m);
      var li = document.createElement('li'); li.innerHTML = '<button type="button"><span class="sx-sn">' + (i + 1) + '</span><span><b>' + esc(st.titel) + '</b>' + (st.text ? '<br>' + esc(st.text) : '') + '</span></button>';
      li.querySelector('button').addEventListener('click', function () { self.seek(st.t + .01); self.play(); });
      ol.appendChild(li);
    });
    this.lis = ol.children;
    el.querySelector('.sx-play').addEventListener('click', function () { self.playing ? self.pause() : self.play(); });
    el.querySelector('.sx-prev').addEventListener('click', function () { self.stepJump(-1); });
    el.querySelector('.sx-next').addEventListener('click', function () { self.stepJump(1); });
    el.querySelector('.sx-speed').addEventListener('click', function () {
      self.speed = self.speed === 1 ? .5 : self.speed === .5 ? 2 : 1; this.textContent = (self.speed === .5 ? '½' : self.speed) + '×';
    });
    var barEl = el.querySelector('.sx-bar');
    var seekEv = function (e) { var r = barEl.getBoundingClientRect(); var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left; self.seek(clamp(x / r.width, 0, 1) * self.total); };
    barEl.addEventListener('mousedown', function (e) { seekEv(e); var mv = function (ev) { seekEv(ev); }; document.addEventListener('mousemove', mv); document.addEventListener('mouseup', function up() { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); }); });
    barEl.addEventListener('touchstart', seekEv, { passive: true });
    barEl.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') self.stepJump(1); if (e.key === 'ArrowLeft') self.stepJump(-1); if (e.key === ' ') { e.preventDefault(); self.playing ? self.pause() : self.play(); } });
    this.draw();
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (x.isIntersecting && x.intersectionRatio > .45) { if (!self.userPaused) self.play(); }
          else if (self.playing) { self.pause(true); }
        });
      }, { threshold: [0, .45, .8] }).observe(el);
    }
  }
  Player.prototype.stepIndex = function (t) { var k = -1; for (var i = 0; i < this.steps.length; i++) if (this.steps[i].t <= t + 1e-3) k = i; return k; };
  Player.prototype.stepJump = function (d) {
    var k = this.stepIndex(this.t);
    if (d < 0 && k >= 0 && this.t - this.steps[k].t > .8) k += 1; // erst an den Schrittanfang
    var j = clamp(k + d, 0, this.steps.length - 1);
    this.seek(this.steps[j].t + .01);
  };
  Player.prototype.seek = function (t) { this.t = clamp(t, 0, this.total); this.draw(); };
  Player.prototype.play = function () {
    var self = this; if (this.playing) return;
    if (this.t >= this.total - .05) this.t = 0;
    this.playing = true; this.userPaused = false; this.el.querySelector('.sx-play').textContent = '⏸'; this.el.querySelector('.sx-play').setAttribute('aria-label', 'Pause');
    var last = performance.now(), hold = 0;
    var loop = function (now) {
      if (!self.playing) return;
      var dt = Math.min(.05, (now - last) / 1000) * self.speed; last = now;
      if (self.t >= self.total) { hold += dt; if (hold > 2.2) { self.t = 0; hold = 0; } }
      else self.t = Math.min(self.total, self.t + dt);
      self.draw(); self.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  };
  Player.prototype.pause = function (auto) {
    this.playing = false; if (!auto) this.userPaused = true;
    cancelAnimationFrame(this.raf);
    var b = this.el.querySelector('.sx-play'); b.textContent = '▶'; b.setAttribute('aria-label', 'Abspielen');
  };
  Player.prototype.draw = function () {
    var t = this.t, sh = this.shots[0];
    for (var i = 0; i < this.shots.length; i++) { if (t >= this.shots[i].start) sh = this.shots[i]; }
    var lt = Math.min(t - sh.start, sh.dur);
    this.dyn.innerHTML = sh.render(lt);
    this.bar.style.width = (t / this.total * 100) + '%';
    var k = this.stepIndex(t);
    if (k !== this.k) {
      this.k = k;
      for (var j = 0; j < this.lis.length; j++) this.lis[j].classList.toggle('on', j === k);
      var st = this.steps[k] || this.steps[0];
      this.cap.querySelector('.sx-cap-n').textContent = st ? (this.steps.indexOf(st) + 1) : '';
      this.cap.querySelector('.sx-cap-t').textContent = st ? st.titel : '';
    }
  };

  function einstellung(o) { // freie Einstellung mit eigener Zeichenfunktion
    return { dur: o.dur, w: o.w || 800, h: o.h || 460, steps: o.steps || [], render: o.render };
  }

  /* ------------------------------------------------------------------ */
  /*  Seitenansicht einer Segeljacht (Bug rechts)                         */
  /* ------------------------------------------------------------------ */
  function seitenBoot(x, y, k, o) {
    // x,y = Wasserlinie Mitte; k = Maßstab (1 = ca. 220 px Länge); o.rot = Stampfen (Grad), o.reff 0..1, o.fockRoll 0..1
    o = o || {}; k = k || 1;
    var s = '<g transform="translate(' + f1(x) + ',' + f1(y) + ') rotate(' + f1(o.rot || 0) + ') scale(' + k + ')">';
    if (o.segel !== false) {
      var reff = o.reff || 0, top = -250 + reff * 70, fr = o.fockRoll || 0;
      s += '<line x1="-10" y1="-18" x2="-10" y2="-252" stroke="#3d4b55" stroke-width="3.2"/>';            // Mast
      s += '<line x1="-10" y1="-250" x2="96" y2="-16" stroke="#8796a0" stroke-width="1.2"/>';             // Vorstag
      s += '<line x1="-10" y1="-250" x2="-104" y2="-20" stroke="#8796a0" stroke-width="1.2"/>';           // Achterstag
      if (o.gross !== false) {
        var bm = -46 + reff * 10;
        s += '<path d="M-8,' + f1(top) + ' Q' + f1(-42 - reff * 6) + ',' + f1((top + bm) / 2) + ' -86,' + f1(bm) + ' L-8,' + f1(bm) + ' Z" fill="#fff" stroke="#2a4452" stroke-width="1.8"/>';
        if (reff > 0.05) s += '<path d="M-8,' + f1(bm + 2) + ' L-86,' + f1(bm + 2) + '" stroke="#b8c4cc" stroke-width="7"/>' + (function () { var r = ''; for (var i = 0; i < 6; i++) r += '<circle cx="' + (-16 - i * 12) + '" cy="' + f1(bm + 2) + '" r="1.6" fill="#2a4452"/>'; return r; })();
        s += '<line x1="-10" y1="' + f1(bm) + '" x2="-90" y2="' + f1(bm) + '" stroke="#2a4452" stroke-width="3.4" stroke-linecap="round"/>';
      }
      if (o.fock !== false) { // Rollreff: das Schothorn wandert zum Vorstag, der Rest ist um das Vorstag gerollt
        var cl = [lerp(18, 59, fr), lerp(-26, -98, fr)];
        s += '<path d="M-6,-236 Q' + f1(lerp(26, 40, fr)) + ',' + f1(lerp(-110, -150, fr)) + ' ' + f1(cl[0]) + ',' + f1(cl[1]) + ' L88,-24 Z" fill="#fff" stroke="#2a4452" stroke-width="1.8"/>';
        if (fr > .02) s += '<line x1="-6" y1="-236" x2="90" y2="-26" stroke="#2a4452" stroke-width="' + f1(2 + fr * 5) + '" stroke-linecap="round"/>';
      }
    }
    // Rumpf
    s += '<path d="M-110,-20 L118,-20 Q108,6 88,16 L-96,14 Q-108,4 -110,-20 Z" fill="#ffffff" stroke="' + F.navy + '" stroke-width="2.4"/>';
    s += '<path d="M-104,-6 L110,-6" stroke="' + F.accent + '" stroke-width="3"/>';
    s += '<path d="M-20,15 L-10,70 L22,70 L26,15 Z" fill="' + F.navy + '"/>';                                // Kiel
    s += '<path d="M-78,13 L-84,52 L-70,52 L-66,13 Z" fill="' + F.navy + '"/>';                                // Ruder
    s += '<path d="M-60,-20 L-54,-34 L10,-34 L22,-20 Z" fill="#eef2f4" stroke="' + F.navy + '" stroke-width="1.6"/>';  // Aufbau
    s += '<rect x="-40" y="-31" width="10" height="5" rx="1.5" fill="#9fb6c2"/><rect x="-24" y="-31" width="10" height="5" rx="1.5" fill="#9fb6c2"/>';
    if (o.lichter) { // Blick auf die Steuerbordseite (Bug rechts): grünes Seitenlicht + Hecklicht; Topplicht nur unter Motor
      if (o.lichter === 'motor') s += '<circle cx="-8" cy="-170" r="4" fill="#fff6d8"/><circle cx="-8" cy="-170" r="11" fill="#fff6d8" opacity=".25"/>';
      s += '<circle cx="108" cy="-24" r="3.5" fill="#2fe07a"/><circle cx="108" cy="-24" r="10" fill="#2fe07a" opacity=".3"/>';
      s += '<circle cx="-108" cy="-22" r="3.5" fill="#fff6d8"/><circle cx="-108" cy="-22" r="9" fill="#fff6d8" opacity=".28"/>';
    }
    return s + '</g>';
  }
  function heckBoot(x, y, k, o) {
    // Ansicht von achtern; Backbord = links. o.rot = Rollen (Grad)
    o = o || {}; k = k || 1;
    var s = '<g transform="translate(' + f1(x) + ',' + f1(y) + ') rotate(' + f1(o.rot || 0) + ') scale(' + k + ')">';
    s += '<line x1="0" y1="-20" x2="0" y2="-250" stroke="#3d4b55" stroke-width="3.4"/>';
    s += '<line x1="-44" y1="-150" x2="44" y2="-150" stroke="#3d4b55" stroke-width="2.4"/>';            // Saling
    s += '<path d="M0,-250 L-44,-150 L-46,-18 M0,-250 L44,-150 L46,-18" fill="none" stroke="#8796a0" stroke-width="1.2"/>';
    s += '<path d="M-52,-20 L52,-20 L46,6 Q0,26 -46,6 Z" fill="#fff" stroke="' + F.navy + '" stroke-width="2.4"/>';
    s += '<path d="M-7,18 L-5,74 L5,74 L7,18 Z" fill="' + F.navy + '"/>';
    s += '<path d="M-26,-20 L-22,-34 L22,-34 L26,-20 Z" fill="#eef2f4" stroke="' + F.navy + '" stroke-width="1.6"/>';
    if (o.extra) s += o.extra;
    return s + '</g>';
  }

  window.SX = {
    F: F, R: R, norm: norm, clamp: clamp, lerp: lerp, EASE: EASE, f1: f1, esc: esc, fwd: fwd, stb: stb, local2world: local2world,
    Bahn: function (s) { return new Bahn(s); }, manoever: manoever, einstellung: einstellung,
    zeichneBoot: zeichneBoot, wasser: wasser, windRose: windRose, windStreifen: windStreifen, kai: kai, poller: poller,
    boje: boje, person: person, label: label, pfeil: pfeil, bogenPfeil: bogenPfeil, sprechblase: sprechblase, hudMotor: hudMotor,
    segelPfad: segelPfad, rumpfPfad: rumpfPfad, seitenBoot: seitenBoot, heckBoot: heckBoot, DEFS: DEFS,
    szene: function (name, fn) { SZENEN[name] = fn; },
    start: function () {
      Array.prototype.forEach.call(document.querySelectorAll('.szene[data-szene]'), function (el) {
        var fn = SZENEN[el.getAttribute('data-szene')];
        if (!fn || el._sx) return;
        try { el._sx = new Player(el, fn()); } catch (e) { if (window.console) console.error('Szene', el.getAttribute('data-szene'), e); }
      });
    }
  };
})();
