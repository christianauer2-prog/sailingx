/* ==========================================================================
   SailingX-Academy – Szenen für Technik, Trimm, Ankern & Co.
   Baut auf szenen.js (window.SX) auf. Seitenansichten: Bug rechts.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.SX; if (!S) return;
  var F = S.F, f1 = S.f1, lerp = S.lerp, clamp = S.clamp, R = Math.PI / 180, esc = S.esc;
  var TAU = Math.PI * 2;

  function ez(u) { u = clamp(u, 0, 1); return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function ab(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function L(x, y, t, cls) { return S.label(x, y, t, cls); }
  function linie(x1, y1, x2, y2, c, w, extra) { return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="' + c + '" stroke-width="' + (w || 2) + '"' + (extra || '') + '/>'; }
  function kreis(x, y, r, fill, extra) { return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + r + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function poly(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + f1(p[0]) + ',' + f1(p[1]); }).join(' '); }

  // Seitenansicht: Himmel + See mit laufender Welle
  function welleY(x, wl, t, o) { o = o || {}; var a = o.amp == null ? 4 : o.amp, lam = o.lam || 90, sp = o.sp == null ? 40 : o.sp; return wl + Math.sin((x + t * sp) / lam * TAU) * a; }
  function see(W, H, wl, t, o) {
    o = o || {};
    var s = '<rect width="' + W + '" height="' + H + '" fill="url(#' + (o.nacht ? 'sxNacht' : 'sxHimmel') + ')"/>';
    var d = 'M0,' + H + ' L0,' + f1(welleY(0, wl, t, o));
    for (var x = 10; x <= W; x += 10) d += ' L' + x + ',' + f1(welleY(x, wl, t, o));
    d += ' L' + W + ',' + H + ' Z';
    return s + '<path d="' + d + '" fill="url(#' + (o.nacht ? 'sxSeeNacht' : 'sxSee') + ')"/>';
  }
  function seeVorne(W, H, wl, t, o) { // halbtransparente Wasserschicht vor dem Unterwasserschiff
    o = o || {};
    var d = 'M0,' + H + ' L0,' + f1(welleY(0, wl, t, o) + 1);
    for (var x = 10; x <= W; x += 10) d += ' L' + x + ',' + f1(welleY(x, wl, t, o) + 1);
    return '<path d="' + d + ' L' + W + ',' + H + ' Z" fill="url(#' + (o.nacht ? 'sxSeeNacht' : 'sxSee') + ')" opacity="' + (o.nacht ? .7 : .55) + '"/>';
  }
  function hinweis(x, y, text, farbe) {
    var w = text.length * 7.3 + 26;
    return '<g transform="translate(' + f1(x) + ',' + f1(y) + ')"><rect x="' + f1(-w / 2) + '" y="-16" width="' + f1(w) + '" height="30" rx="9" fill="' + (farbe || F.navy) + '"/><text x="0" y="4" class="sx-ruf-t">' + esc(text) + '</text></g>';
  }
  function achse(x, y, text, lx, ly) {
    return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="9" fill="#fff" stroke="' + F.rot + '" stroke-width="2.4"/>' + kreis(x, y, 3, F.rot) +
      (text ? L(x + (lx || 14), y + (ly || 4), text, 'sx-lbl-rot') : '');
  }
  function start() { S.start(); }

  /* ================================================================== */
  /*  A.2.1.10  Bewegungen des Rumpfes im Seegang                        */
  /* ================================================================== */
  S.szene('rumpf', function () {
    var gieren = S.einstellung({
      dur: 5, steps: [{ t: 0, titel: 'Gieren – Drehung um die Hochachse', text: 'Der Bug bricht von der Kurslinie nach Backbord oder Steuerbord aus.' }],
      render: function (t) {
        var h = Math.sin(t / 2.4 * TAU) * 13;
        var s = S.wasser(800, 460, t, null);
        s += '<line x1="400" y1="40" x2="400" y2="440" stroke="' + F.navy2 + '" stroke-dasharray="6 6" opacity=".6"/>' + L(408, 440, 'Kurslinie', 'sx-lbl-klein');
        s += S.zeichneBoot({ x: 400, y: 250, h: h, k: 2.6, ohneSegel: true, t: t });
        s += S.bogenPfeil(400, 250, 120, -6, -26, 'rot') + S.bogenPfeil(400, 250, 120, 6, 26, 'rot');
        s += achse(400, 250, 'Hochachse (senkrecht)', 18, -14);
        return s;
      }
    });
    var stampfen = S.einstellung({
      dur: 5, steps: [{ t: 0, titel: 'Stampfen – Bewegung um die Querachse', text: 'Bug und Heck heben und senken sich im Wechsel.' }],
      render: function (t) {
        var o = { amp: 10, lam: 260, sp: 90 }, wl = 300;
        var yb = welleY(510, wl, t, o), yh = welleY(290, wl, t, o), rot = Math.atan2(yb - yh, 220) / R;
        var s = see(800, 460, wl, t, o);
        s += S.seitenBoot(400, (yb + yh) / 2, .9, { rot: rot }) + seeVorne(800, 460, wl, t, o);
        s += achse(400, (yb + yh) / 2 - 8, 'Querachse (quer durchs Schiff)', 16, 32);
        s += S.pfeil(520, 150, 520, rot > 0 ? 190 : 110, 'rot') + S.pfeil(282, 150, 282, rot > 0 ? 110 : 190, 'rot');
        return s;
      }
    });
    var rollen = S.einstellung({
      dur: 5, steps: [{ t: 0, titel: 'Rollen – Bewegung um die Längsachse', text: 'Der Rumpf schaukelt seitlich (Ansicht von achtern).' }],
      render: function (t) {
        var o = { amp: 6, lam: 200, sp: 60 }, wl = 310, rot = Math.sin(t / 2.2 * TAU) * 15;
        var s = see(800, 460, wl, t, o);
        s += S.heckBoot(400, wl, .95, { rot: rot }) + seeVorne(800, 460, wl, t, o);
        s += achse(400, wl - 6, 'Längsachse (Bug–Heck)', 16, 36);
        s += S.bogenPfeil(400, wl, 180, -30, -46, 'rot') + S.bogenPfeil(400, wl, 180, 30, 46, 'rot');
        return s;
      }
    });
    var schlingern = S.einstellung({
      dur: 6, steps: [{ t: 0, titel: 'Schlingern – mehrere Bewegungen gleichzeitig', text: 'Gieren, Stampfen und Rollen überlagern sich. Stampfen vermindern: gegen den Wellenberg anluven, im Wellental abfallen.' }],
      render: function (t) {
        var o = { amp: 8, lam: 230, sp: 80 }, wl = 320;
        var s = see(800, 460, wl, t, o);
        var yb = welleY(310, wl, t, o), yh = welleY(170, wl, t, o), rot = Math.atan2(yb - yh, 140) / R;
        s += S.seitenBoot(240, (yb + yh) / 2, .58, { rot: rot });
        s += S.heckBoot(590, welleY(590, wl, t, o), .62, { rot: Math.sin(t / 1.7 * TAU) * 13 + Math.sin(t * 3.1) * 4 }) + seeVorne(800, 460, wl, t, o);
        s += L(240, 440, 'Seitenansicht: Stampfen', 'sx-lbl-c') + L(590, 440, 'von achtern: Rollen', 'sx-lbl-c');
        return s;
      }
    });
    return { titel: 'Bewegungen des Rumpfes im Seegang', shots: [gieren, stampfen, rollen, schlingern] };
  });

  /* ================================================================== */
  /*  A.2.3.0  Segeltrimm: killend vs. gut getrimmt (Seitenansicht)      */
  /* ================================================================== */
  function wehendeLinie(p0, p1, n, amp, phase, freq) {
    // Linie von p0 nach p1, senkrecht dazu wellig (flatterndes Liek)
    var dx = p1[0] - p0[0], dy = p1[1] - p0[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, pts = [];
    for (var i = 0; i <= n; i++) {
      var u = i / n, w = Math.sin(u * Math.PI) * amp * Math.sin(phase + u * (freq || 9));
      pts.push([p0[0] + dx * u + nx * w, p0[1] + dy * u + ny * w]);
    }
    return pts;
  }
  function faden(x, y, ang, len, zitter, t, farbe) {
    // Trimmfaden: ang = Richtung (0 = nach rechts), zitter = Flattern 0..1
    var pts = [[x, y]], a = ang;
    for (var i = 1; i <= 5; i++) {
      a += zitter * Math.sin(t * 17 + i * 1.9) * 26 * R + (zitter ? Math.sin(t * 7 + i) * .12 : Math.sin(t * 5 + i) * .03);
      pts.push([pts[i - 1][0] + Math.cos(a) * len / 5, pts[i - 1][1] + Math.sin(a) * len / 5]);
    }
    return '<path d="' + poly(pts) + '" fill="none" stroke="' + (farbe || F.rot) + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  S.szene('trimm', function () {
    return {
      titel: 'Segeltrimm: killend oder gut getrimmt', shots: [S.einstellung({
        dur: 12,
        steps: [
          { t: 0, titel: 'Die Segel killen', text: 'Die Schoten sind zu lose: Das Tuch schlägt, die Jacht verliert Fahrt. Längeres Killen beschädigt Tuch, Latten, Lattentaschen und Nähte.' },
          { t: 4.6, titel: 'Schoten dichtholen', text: 'Vorschot und Großschot so weit dichtholen, bis das Killen aufhört.' },
          { t: 7, titel: 'Gut getrimmt', text: 'Das Segel steht glatt: keine Falten, kaum Gegenbauch, es killt nicht – die Trimmfäden strömen.' }
        ],
        render: function (t) {
          var wl = 360, k = 1.12, bx = 470, u = ez(ab(t, 4.6, 6.8)), kill = 1 - u;
          var s = see(800, 460, wl, t, { amp: 3, lam: 120, sp: 30 });
          // Wind (von vorn, also von rechts)
          for (var i = 0; i < 6; i++) { var yy = 70 + i * 48, xx = 800 - ((t * 120 + i * 97) % 900); s += '<line x1="' + f1(xx) + '" y1="' + yy + '" x2="' + f1(xx + 46) + '" y2="' + yy + '" stroke="#8fb9cf" stroke-width="2" stroke-linecap="round" opacity=".7"/>'; }
          s += '<g transform="translate(' + bx + ',' + wl + ') scale(' + k + ')">';
          // Großsegel: Kopf (-8,-250), Schothorn (-86,-46), Hals (-8,-46)
          var ph = t * 16, gl = wehendeLinie([-8, -250], [-86 + kill * 6, -46], 18, kill * 9 + 1.5 * (1 - kill), ph, 11);
          var gd = poly(gl) + ' L-8,-46 Z';
          s += '<path d="' + gd + '" fill="#fff" stroke="#2a4452" stroke-width="1.8"/>';
          if (kill > .05) for (var j = 0; j < 5; j++) { var y0 = -220 + j * 36, sh = Math.sin(ph * 1.1 + j) * 7 * kill; s += '<path d="M-10,' + y0 + ' q' + f1(-14 - sh) + ',' + f1(8 + sh) + ' ' + f1(-26 - j * 10) + ',' + f1(14) + '" fill="none" stroke="#9fb0bb" stroke-width="1.4" opacity="' + f1(kill) + '"/>'; }
          s += linie(-10, -46, -90, -46, '#2a4452', 3.4, ' stroke-linecap="round"');
          // Fock: Kopf (-6,-236), Hals (88,-24), Schothorn (18,-26)
          var fl = wehendeLinie([-6, -236], [18 + kill * 10, -30], 16, kill * 12 + 1.5 * (1 - kill), ph + 1, 10);
          s += '<path d="' + poly(fl) + ' L88,-24 Z" fill="#fff" stroke="#2a4452" stroke-width="1.8"/>';
          if (kill > .05) for (j = 0; j < 4; j++) { var yf = -190 + j * 40, sf = Math.sin(ph + j * 1.3) * 6 * kill; s += '<path d="M' + f1(20 + j * 16) + ',' + yf + ' q' + f1(-10 + sf) + ',' + f1(14) + ' ' + f1(-18) + ',' + f1(26 + sf) + '" fill="none" stroke="#9fb0bb" stroke-width="1.4" opacity="' + f1(kill) + '"/>'; }
          // Schoten: lose (durchhängend) → dicht
          var sag = kill * 26;
          s += '<path d="M' + f1(18 + kill * 10) + ',-30 Q' + f1(0) + ',' + f1(-18 + sag) + ' -40,-22" fill="none" stroke="' + F.leine + '" stroke-width="1.6"/>';
          s += '<path d="M-80,-46 Q' + f1(-78) + ',' + f1(-32 + sag) + ' -72,-20" fill="none" stroke="' + F.leine + '" stroke-width="1.6"/>';
          // Trimmfäden (bei gutem Trimm)
          if (u > .6) {
            [.25, .5, .74].forEach(function (f) { s += faden(-6 + 94 * f - 12, -236 + 212 * f, 182 * R, 18, 0, t); });
            [[-44, -170], [-64, -110]].forEach(function (p) { s += faden(p[0], p[1], 176 * R, 16, 0, t); });
          }
          s += '</g>';
          s += S.seitenBoot(bx, wl, k, { segel: false }) + seeVorne(800, 460, wl, t, { amp: 3, lam: 120, sp: 30 });
          s += kill > .5 ? hinweis(170, 420, '✗ Segel killen – Schoten zu lose', F.rot) : u > .99 ? hinweis(170, 420, '✓ Gut getrimmt', F.gruen) : hinweis(170, 420, 'Schoten dichtholen …', F.navy);
          s += L(700, 80, 'Wind', 'sx-lbl-c') + S.pfeil(740, 96, 660, 96, 'blau');
          return s;
        }
      })]
    };
  });

  /* ================================================================== */
  /*  A.2.3.3  Trimmfäden lesen (Draufsicht auf das Vorsegelprofil)      */
  /* ================================================================== */
  function profil(P0, C, P1) {
    function pt(u) { var a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; return [a * P0[0] + b * C[0] + c * P1[0], a * P0[1] + b * C[1] + c * P1[1]]; }
    function tan(u) { var x = 2 * (1 - u) * (C[0] - P0[0]) + 2 * u * (P1[0] - C[0]), y = 2 * (1 - u) * (C[1] - P0[1]) + 2 * u * (P1[1] - C[1]), l = Math.hypot(x, y); return [x / l, y / l]; }
    function nor(u) { var tt = tan(u); return [tt[1], -tt[0]]; } // zeigt nach „oben“ = Lee (konvexe Seite)
    return { pt: pt, tan: tan, nor: nor };
  }
  function stroemung(pr, d, von, bis, flow, t, abriss) {
    // Stromlinie im Abstand d (+ = Lee, - = Luv) entlang des Profils
    var p0 = pr.pt(von), n0 = pr.nor(von), a = [p0[0] + n0[0] * d, p0[1] + n0[1] * d];
    var st = [a[0] - flow[0] * 260, a[1] - flow[1] * 260], pts = [st];
    for (var u = von; u <= bis + 1e-6; u += .05) { var p = pr.pt(u), n = pr.nor(u); pts.push([p[0] + n[0] * d, p[1] + n[1] * d]); }
    var e = pts[pts.length - 1], tg = pr.tan(bis);
    if (abriss) tg = [tg[0] * .7 + flow[0] * .3, tg[1] * .7 + flow[1] * .3 - .25];
    pts.push([e[0] + tg[0] * 220, e[1] + tg[1] * 220]);
    return '<path d="' + poly(pts) + '" fill="none" stroke="#6fa9c8" stroke-width="2" stroke-dasharray="10 8" stroke-dashoffset="' + f1(-t * 70) + '" opacity=".9"/>';
  }
  function wirbel(x, y, r, t) {
    var a = t * 5;
    return '<g transform="translate(' + f1(x) + ',' + f1(y) + ') rotate(' + f1(a / R) + ')"><path d="M' + r + ',0 A' + r + ',' + r + ' 0 1 1 0,' + (-r) + '" fill="none" stroke="' + F.rot + '" stroke-width="1.8" marker-end="url(#sxPfeilRot)" opacity=".8"/></g>';
  }
  S.szene('trimmfaeden', function () {
    var vorsegel = S.einstellung({
      dur: 17,
      steps: [
        { t: 0, titel: 'Beide Fäden strömen nach achtern', text: 'Luv- und Leefaden am Vorliek liegen ruhig an – die Anströmung ist optimal.' },
        { t: 3.6, titel: 'Luvfaden hebt sich: zu hoch am Wind', text: 'Der Wind trifft das Vorliek zu spitz, in Luv reißt die Strömung ab. Abfallen – oder die Vorschot etwas dichter holen.' },
        { t: 8, titel: 'Abgefallen – wieder optimal', text: 'Beide Fäden strömen wieder nach achtern.' },
        { t: 10.2, titel: 'Leefaden tanzt: Strömung reißt in Lee ab', text: 'Zu tief oder Vorschot zu dicht. Anluven – oder die Vorschot fieren.' },
        { t: 14.6, titel: 'Vorschot gefiert – wieder optimal', text: 'Merksatz: Der flatternde Faden zeigt, wohin das Segel „will“ – Luvfaden: abfallen, Leefaden: anluven.' }
      ],
      render: function (t) {
        // Anstellwinkel: optimal 16°, zu klein 3°, zu groß 32°
        var al = 16;
        al = lerp(al, 3, ez(ab(t, 3.6, 5))); al = lerp(al, 16, ez(ab(t, 8, 9.2))); al = lerp(al, 32, ez(ab(t, 10.2, 11.6))); al = lerp(al, 16, ez(ab(t, 14.6, 15.8)));
        var luv = clamp((9 - al) / 5, 0, 1), lee = clamp((al - 25) / 5, 0, 1);
        var P0 = [230, 275], P1 = [570, 245], C = [lerp(380, 350, luv * .6), lerp(185, 215, luv)];
        var pr = profil(P0, C, P1), sehne = Math.atan2(P1[1] - P0[1], P1[0] - P0[0]);
        var fw = [Math.cos(sehne - al * R), Math.sin(sehne - al * R)];
        var s = '<rect width="800" height="460" fill="#eef6fa"/>';
        s += L(400, 90, 'LEE', 'sx-lbl-c sx-lbl-kai') + L(400, 420, 'LUV', 'sx-lbl-c sx-lbl-kai');
        // Stromlinien
        [16, 38, 64].forEach(function (d) { s += stroemung(pr, d, lee > .5 ? 0 : 0, lee > .5 ? .22 : 1, fw, t, lee > .5); });
        [-16, -40, -66].forEach(function (d) { s += stroemung(pr, d, luv > .5 ? .25 : 0, 1, fw, t); });
        if (lee > .3) { s += wirbel(380, 190, 14, t) + wirbel(450, 180, 11, t + 1) + wirbel(520, 200, 12, t + 2); }
        if (luv > .3) { var q = pr.pt(.12), n = pr.nor(.12); s += wirbel(q[0] - n[0] * 22, q[1] - n[1] * 22, 11, t); }
        // Segelprofil (mit leichtem Einfallen am Vorliek bei zu hoch am Wind)
        var pts = [];
        for (var u = 0; u <= 1.0001; u += .04) { var p = pr.pt(u), nn = pr.nor(u), dent = luv * Math.max(0, .22 - u) * 60 * (.8 + .2 * Math.sin(t * 14)); pts.push([p[0] - nn[0] * dent, p[1] - nn[1] * dent]); }
        s += '<path d="' + poly(pts) + '" fill="none" stroke="' + F.navy + '" stroke-width="5" stroke-linecap="round"/>';
        s += kreis(P0[0], P0[1], 5, F.navy) + L(P0[0] - 20, P0[1] + 28, 'Vorliek', 'sx-lbl-c') + L(P1[0] + 10, P1[1] + 26, 'Achterliek', 'sx-lbl-c');
        // Trimmfäden am Vorliek (ca. 15 % der Profiltiefe)
        var b = pr.pt(.14), tg = pr.tan(.14), nr = pr.nor(.14), ta = Math.atan2(tg[1], tg[0]);
        var leeA = ta - lee * (100 + Math.sin(t * 9) * 50) * R, luvA = ta + luv * (105 + Math.sin(t * 11) * 40) * R;
        s += faden(b[0] + nr[0] * 7, b[1] + nr[1] * 7, leeA, 44, lee, t, '#1f9d55');
        s += faden(b[0] - nr[0] * 7, b[1] - nr[1] * 7, luvA, 44, luv, t, F.rot);
        s += L(b[0] + 44, b[1] - 38, 'Leefaden', 'sx-lbl-gruen') + L(b[0] + 46, b[1] + 44, 'Luvfaden', 'sx-lbl-rot');
        // scheinbarer Wind
        s += '<line x1="' + f1(90 - fw[0] * 50) + '" y1="' + f1(300 - fw[1] * 50) + '" x2="' + f1(90 + fw[0] * 30) + '" y2="' + f1(300 + fw[1] * 30) + '" stroke="' + F.accent + '" stroke-width="5" stroke-linecap="round" marker-end="url(#sxPfeilBlau)"/>';
        s += L(76, 350, 'scheinbarer Wind', 'sx-lbl-c');
        s += luv > .5 ? hinweis(620, 420, 'Luvfaden hebt → abfallen', F.rot) : lee > .5 ? hinweis(620, 420, 'Leefaden tanzt → anluven / fieren', F.rot) : hinweis(640, 420, '✓ beide strömen', F.gruen);
        return s;
      }
    });
    var gross = S.einstellung({
      dur: 11,
      steps: [
        { t: 0, titel: 'Achterliekfaden am Großsegel weht nach achtern', text: 'Die Luft strömt sauber vom Achterliek ab – das Groß ist richtig getrimmt.' },
        { t: 3.4, titel: 'Faden verschwindet nach Lee: Groß zu dicht', text: 'Das Achterliek ist geschlossen, die Strömung reißt ab.' },
        { t: 7.2, titel: 'Großschot fieren', text: 'Das Achterliek öffnet sich, der Faden weht wieder nach achtern.' }
      ],
      render: function (t) {
        var zu = ez(ab(t, 3.4, 4.6)) * (1 - ez(ab(t, 7.2, 8.6)));
        var P0 = [200, 230], P1 = [580, lerp(250, 300, zu)], C = [lerp(390, 440, zu), lerp(170, 175, zu)];
        var pr = profil(P0, C, P1), fw = [Math.cos(-12 * R), Math.sin(-12 * R)];
        var s = '<rect width="800" height="460" fill="#eef6fa"/>' + L(400, 90, 'LEE', 'sx-lbl-c sx-lbl-kai') + L(400, 420, 'LUV', 'sx-lbl-c sx-lbl-kai');
        [18, 42].forEach(function (d) { s += stroemung(pr, d, 0, zu > .5 ? .7 : 1, fw, t, zu > .5); });
        [-18, -44].forEach(function (d) { s += stroemung(pr, d, 0, 1, fw, t); });
        if (zu > .4) s += wirbel(610, 262, 12, t) + wirbel(560, 225, 10, t + 1);
        // Mast + Groß
        var pts = []; for (var u = 0; u <= 1.0001; u += .04) pts.push(pr.pt(u));
        s += '<circle cx="' + P0[0] + '" cy="' + P0[1] + '" r="11" fill="#3d4b55"/>';
        s += '<path d="' + poly(pts) + '" fill="none" stroke="' + F.navy + '" stroke-width="5" stroke-linecap="round"/>';
        s += L(P0[0], P0[1] + 36, 'Mast', 'sx-lbl-c') + L(P1[0] - 10, P1[1] + 30, 'Achterliek', 'sx-lbl-c');
        var tg = pr.tan(1), ta = Math.atan2(tg[1], tg[0]);
        s += faden(P1[0], P1[1], ta - zu * (130 + Math.sin(t * 8) * 30) * R, 48, zu, t, F.rot);
        s += zu > .5 ? hinweis(620, 420, 'Faden nach Lee → Groß fieren', F.rot) : hinweis(640, 420, '✓ Faden weht nach achtern', F.gruen);
        return s;
      }
    });
    return { titel: 'Trimmfäden lesen', shots: [vorsegel, gross] };
  });

  /* ================================================================== */
  /*  A.2.4.2  Ankern – Kettenlänge 3–5 × Wassertiefe                   */
  /* ================================================================== */
  function anker(x, y, rot, k) {
    return '<g transform="translate(' + f1(x) + ',' + f1(y) + ') rotate(' + f1(rot || 0) + ') scale(' + (k || 1) + ')">' +
      '<path d="M0,0 L-26,-4" stroke="#3d4b55" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M-2,-6 L14,-2 L6,6 L-6,4 Z" fill="#56656f" stroke="#2d3a44" stroke-width="1.2"/>' +
      '<circle cx="-27" cy="-4" r="3" fill="none" stroke="#2d3a44" stroke-width="1.6"/></g>';
  }
  function kette(B, T, A) {
    // B = Bug (Kettenaustritt), T = Aufsetzpunkt am Grund, A = Anker; hängender Teil als Parabel, waagrecht in T
    var pts = [], n = 26;
    for (var i = 0; i <= n; i++) { var u = i / n, x = lerp(T[0], B[0], u), y = T[1] - (T[1] - B[1]) * u * u; pts.push([x, y]); }
    var len = 0; for (i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    len += Math.abs(A[0] - T[0]);
    var d = 'M' + f1(A[0] - 26) + ',' + f1(A[1] - 4) + ' L' + f1(T[0]) + ',' + f1(T[1]) + ' ' + poly(pts.slice()).replace(/^M/, 'L');
    return { svg: '<path d="' + d + '" fill="none" stroke="#4a5761" stroke-width="3" stroke-dasharray="4 2" stroke-linejoin="round"/>', len: len };
  }
  S.szene('ankern', function () {
    var wl = 170, grund = 312, tiefe = grund - wl + 10, k = .46;
    function hinter(t, o) { o = o || {}; var s = see(800, 460, wl, t, { amp: 3, lam: 110, sp: 26 }); s += '<path d="M0,' + grund + ' Q200,' + (grund - 6) + ' 400,' + grund + ' T800,' + (grund + 2) + ' L800,460 L0,460 Z" fill="url(#sxGrund)"/>'; return s; }
    function tiefenMass(x) { return '<line x1="' + x + '" y1="' + (wl + 2) + '" x2="' + x + '" y2="' + (grund - 2) + '" stroke="' + F.navy + '" stroke-width="1.6" marker-start="url(#sxPfeil)" marker-end="url(#sxPfeil)"/>' + L(x - 8, (wl + grund) / 2 + 4, 'Tiefe', 'sx-lbl-r'); }
    function bugX(cx) { return cx + 116 * k; }
    var WIND = S.pfeil(770, 104, 680, 104, 'blau') + L(725, 94, 'Wind', 'sx-lbl-c');
    var falsch = S.einstellung({
      dur: 5.5,
      steps: [{ t: 0, titel: 'Zu wenig Kette: steiler Zug', text: 'Die Kette zieht schräg nach oben – der Anker wird aus dem Grund gehebelt und slippt.' }],
      render: function (t) {
        var u = ez(ab(t, .6, 4.2)), cx = lerp(600, 500, u), ax = lerp(700, 640, u), rot = u * 48;
        var s = hinter(t);
        var B = [bugX(cx), wl - 6], A = [ax, grund - 2];
        s += '<path d="M' + f1(B[0]) + ',' + f1(B[1]) + ' Q' + f1((B[0] + A[0]) / 2 + 8) + ',' + f1((B[1] + A[1]) / 2 + 10) + ' ' + f1(A[0] - 27 * Math.cos(rot * R)) + ',' + f1(A[1] - u * 8 - 27 * Math.sin(rot * R) * 1.2) + '" fill="none" stroke="#4a5761" stroke-width="3" stroke-dasharray="4 2"/>';
        s += anker(A[0], A[1] - u * 8, rot, 1.2);
        if (u > .2) s += '<ellipse cx="' + f1(ax + 10) + '" cy="' + (grund + 2) + '" rx="' + f1(20 * u) + '" ry="5" fill="#c2ad80" opacity=".8"/>';
        s += S.seitenBoot(cx, welleY(cx, wl, t, { amp: 3, lam: 110, sp: 26 }), k, {}) + seeVorne(800, 460, wl, t, { amp: 3, lam: 110, sp: 26 });
        s += tiefenMass(740) + WIND;
        s += hinweis(200, 410, '✗ Anker bricht aus', F.rot);
        return s;
      }
    });
    var richtig = S.einstellung({
      dur: 12,
      steps: [
        { t: 0, titel: 'Anker fallen lassen, Jacht treibt zurück', text: 'Gegen Wind bzw. Strom anlaufen, aufstoppen, Anker auf Grund – dann Kette stecken, während die Jacht langsam zurücktreibt.' },
        { t: 5.6, titel: 'Kettenlänge 3–5 × Wassertiefe', text: 'Auf gutem Grund mindestens die 3-fache, bei Wind mehr; mit Trosse entsprechend mehr.' },
        { t: 7.4, titel: 'Einfahren: kurz rückwärts mit Motor', text: 'Die Kette strafft sich, der Anker gräbt sich ein. Peilung prüfen: Hält der Anker?' },
        { t: 9.8, titel: 'Flacher Zug – der Anker hält', text: 'Die am Grund liegende Kette sorgt dafür, dass der Zug waagrecht am Anker angreift.' }
      ],
      render: function (t) {
        var u = ez(ab(t, .4, 5.6)), e = ez(ab(t, 7.4, 8.6)), cx = lerp(610, 190, u) - e * 14;
        var s = hinter(t);
        var B = [bugX(cx), wl - 6], A = [700, grund - 2];
        var tx = Math.min(A[0] - 26, B[0] + 200 + e * 50);
        var ch = kette(B, [tx, grund - 1], A);
        s += ch.svg + anker(A[0], A[1] + e * 3, 0, 1.2);
        if (e > 0 && e < 1) s += '<ellipse cx="' + (A[0] + 8) + '" cy="' + (grund + 1) + '" rx="' + f1(18 * Math.sin(e * Math.PI)) + '" ry="5" fill="#c2ad80" opacity=".8"/>';
        s += S.seitenBoot(cx, welleY(cx, wl, t, { amp: 3, lam: 110, sp: 26 }), k, {}) + seeVorne(800, 460, wl, t, { amp: 3, lam: 110, sp: 26 });
        s += tiefenMass(740);
        var fak = ch.len / tiefe;
        s += '<g transform="translate(560,396)"><rect x="-120" y="-20" width="240" height="34" rx="9" fill="rgba(255,255,255,.92)" stroke="#b8c4cc"/><text x="0" y="3" class="sx-lbl sx-lbl-c sx-lbl-gross">Kette ≈ ' + (Math.round(fak * 10) / 10).toString().replace('.', ',') + ' × Tiefe</text></g>';
        if (t > 9.8) s += S.pfeil(A[0] - 30, grund - 16, A[0] - 90, grund - 16, 'gruen') + L(A[0] - 60, grund - 26, 'Zug waagrecht', 'sx-lbl-c sx-lbl-gruen');
        if (e > 0 && t < 9.8) s += S.pfeil(cx - 60, wl - 30, cx - 110, wl - 30, 'rot') + L(cx - 84, wl - 40, 'rückwärts', 'sx-lbl-c sx-lbl-rot');
        s += WIND;
        return s;
      }
    });
    return { titel: 'Ankern: Kettenlänge', shots: [falsch, richtig] };
  });

  /* ================================================================== */
  /*  A.2.7  Beiboot auf der Heckwelle nachschleppen                     */
  /* ================================================================== */
  S.szene('beiboot', function () {
    var wl = 250, k = .62, cx = 560, heck = cx - 106 * k, lam = 170, A = 13, o = { amp: 2.5, lam: 70, sp: 120 };
    function fl(x, t) { var D = heck - x, y = welleY(x, wl, t, o); if (D > 0) y += A * Math.exp(-D / 420) * Math.cos(D / lam * TAU) * Math.min(1, D / 30); return y; }
    function flaeche(t, op) { var d = 'M0,460 L0,' + f1(fl(0, t)); for (var x = 8; x <= 800; x += 8) d += ' L' + x + ',' + f1(fl(x, t)); return '<path d="' + d + ' L800,460 Z" fill="url(#sxSee)"' + (op ? ' opacity="' + op + '"' : '') + '/>'; }
    function dinghi(x, t, wack) {
      var y = fl(x, t), sl = Math.atan2(fl(x + 12, t) - fl(x - 12, t), 24) / R + (wack || 0);
      return { y: y, rot: sl, svg: '<g transform="translate(' + f1(x) + ',' + f1(y - 2) + ') rotate(' + f1(sl) + ')"><path d="M-34,-10 L34,-12 Q30,4 18,8 L-28,8 Q-34,2 -34,-10 Z" fill="#f39129" stroke="#8a4a10" stroke-width="1.8"/><path d="M-30,-10 L30,-12" stroke="#fff" stroke-width="2"/></g>' };
    }
    return {
      titel: 'Beiboot nachschleppen', shots: [S.einstellung({
        dur: 16,
        steps: [
          { t: 0, titel: 'Leine zu kurz', text: 'Das Dinghi hängt direkt hinter dem Heck im Wellental und schlägt gegen den Spiegel.' },
          { t: 4.5, titel: 'Leine falsch gefiert', text: 'Im nächsten Wellental wird das Dinghi hin- und hergerissen, die Leine ruckt – es kann vollschlagen.' },
          { t: 9.6, titel: 'Richtig: das Dinghi reitet auf der Heckwelle', text: 'Die Schleppleine so einstellen, dass das Beiboot auf dem Wellenberg der Heckwelle läuft – dann folgt es ruhig. Riemen und Außenborder vorher sichern.' }
        ],
        render: function (t) {
          var D = 52;
          D = lerp(D, lam + Math.sin(t * 5) * 14, ez(ab(t, 4.5, 5.8)));
          D = lerp(D, lam * 1.5, ez(ab(t, 9.6, 11)));
          var x = heck - D, wack = t < 4.5 ? Math.sin(t * 6) * 7 : t < 9.6 ? Math.sin(t * 5) * 9 : 0;
          var s = '<rect width="800" height="460" fill="url(#sxHimmel)"/>' + flaeche(t);
          s += S.seitenBoot(cx, wl, k, {});
          var d = dinghi(x, t, wack);
          var bug = [x + Math.cos(d.rot * R) * 32, d.y - 12 + Math.sin(d.rot * R) * 32], klampe = [heck + 4, wl - 14];
          var straff = t >= 4.5 && t < 9.6 && Math.sin(t * 5) > .3;
          s += '<path d="M' + f1(bug[0]) + ',' + f1(bug[1]) + ' Q' + f1((bug[0] + klampe[0]) / 2) + ',' + f1(Math.max(bug[1], klampe[1]) + (straff ? 0 : 12)) + ' ' + f1(klampe[0]) + ',' + f1(klampe[1]) + '" fill="none" stroke="' + F.leine + '" stroke-width="2"/>';
          s += d.svg + flaeche(t, .5);
          // Heckwelle markieren
          s += L(heck - lam * 1.5, fl(heck - lam * 1.5, t) - 40, 'Wellenberg der Heckwelle', 'sx-lbl-c');
          s += S.pfeil(heck - lam * 1.5, fl(heck - lam * 1.5, t) - 34, heck - lam * 1.5, fl(heck - lam * 1.5, t) - 18);
          if (t < 4.5 && Math.sin(t * 6) > .8) s += '<text x="' + f1(heck - 10) + '" y="' + f1(wl - 30) + '" class="sx-lbl sx-lbl-rot sx-lbl-c">klonk!</text>';
          s += S.pfeil(720, 110, 790, 110) + L(755, 100, 'Fahrt', 'sx-lbl-c');
          s += t < 9.6 ? hinweis(170, 420, t < 4.5 ? '✗ Leine zu kurz' : '✗ Dinghi im Wellental', F.rot) : hinweis(220, 420, '✓ reitet auf der Heckwelle', F.gruen);
          return s;
        }
      })]
    };
  });

  /* ================================================================== */
  /*  A.1.1.3  Opferanode                                                */
  /* ================================================================== */
  S.szene('opferanode', function () {
    return {
      titel: 'Wie die Opferanode schützt', shots: [S.einstellung({
        dur: 14,
        steps: [
          { t: 0, titel: 'Metalle im Seewasser bilden ein galvanisches Element', text: 'Welle (Edelstahl), Propeller (Bronze) und Anode sind leitend verbunden; das Seewasser ist der Elektrolyt.' },
          { t: 3, titel: 'Das unedlere Zink löst sich auf', text: 'Die Anode gibt Metall-Ionen ins Wasser ab – sie wird „geopfert“. Die Elektronen fließen über die Welle zu Propeller und Welle.' },
          { t: 7.5, titel: 'Welle und Propeller bleiben geschützt', text: 'Solange genug Anodenmaterial da ist, greift die Korrosion nicht die edleren Metalle an.' },
          { t: 10.5, titel: 'Anode kontrollieren und rechtzeitig erneuern', text: 'Ist sie stark abgetragen, wird sie ersetzt. Anoden nie überstreichen – sonst wirken sie nicht.' }
        ],
        render: function (t) {
          var ab1 = ab(t, 3, 10.5), gr = 1 - ab1 * .5;
          var s = '<defs><linearGradient id="sxUW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f86a8"/><stop offset="1" stop-color="#153f55"/></linearGradient></defs><rect width="800" height="460" fill="url(#sxUW)"/>';
          // Rumpf oben
          s += '<path d="M0,0 L800,0 L800,70 Q400,120 0,96 Z" fill="#eef2f4" stroke="' + F.navy + '" stroke-width="3"/><path d="M0,90 Q400,112 800,66" fill="none" stroke="#8c2f2f" stroke-width="6" opacity=".55"/>';
          s += L(760, 40, 'Rumpf mit Antifouling', 'sx-lbl-r sx-lbl-klein');
          // Wellenbock & Welle
          s += '<path d="M150,100 L190,100 L180,212 L160,212 Z" fill="#8a969e"/>';
          s += '<rect x="40" y="206" width="560" height="22" rx="4" fill="#c9d3d9" stroke="#6f7f89" stroke-width="1.6"/>';
          for (var i = 0; i < 14; i++) { var xx = 40 + ((i * 40 + t * 120) % 560); s += '<line x1="' + f1(xx) + '" y1="208" x2="' + f1(xx + 12) + '" y2="226" stroke="#aebac1" stroke-width="3"/>'; }
          s += L(80, 250, 'Welle (Edelstahl)', 'sx-lbl-klein');
          // Propeller (Bronze) – drehend
          var ph = t * 9;
          s += '<g transform="translate(640,217)"><ellipse cx="0" cy="0" rx="16" ry="18" fill="#b08d3c" stroke="#6d5418" stroke-width="1.6"/>';
          for (var j = 0; j < 3; j++) { var a = ph + j * TAU / 3, h = Math.cos(a) * 88; s += '<ellipse cx="' + f1(Math.sin(a) * 6) + '" cy="' + f1(h / 2) + '" rx="' + f1(12 + Math.abs(Math.sin(a)) * 6) + '" ry="' + f1(Math.abs(h) / 2 + 2) + '" fill="#c9a24d" stroke="#6d5418" stroke-width="1.4" opacity=".95"/>'; }
          s += '</g>' + L(640, 340, 'Propeller (Bronze)', 'sx-lbl-c');
          // Anode (Zink)
          var aw = 70 * gr, ah = 58 * gr;
          var pk = ''; for (j = 0; j < 7; j++) pk += (j ? ' L' : 'M') + f1(440 - aw / 2 + j * aw / 6) + ',' + f1(217 - ah / 2 + (j % 2) * 4 * ab1);
          s += '<rect x="' + f1(440 - aw / 2) + '" y="' + f1(217 - ah / 2) + '" width="' + f1(aw) + '" height="' + f1(ah) + '" rx="' + f1(10 * gr) + '" fill="#aab4ba" stroke="#5b6770" stroke-width="2"/>';
          if (ab1 > .05) s += '<path d="' + pk + '" fill="none" stroke="#5b6770" stroke-width="1.2"/>';
          s += '<rect x="436" y="' + f1(217 - ah / 2 + 4) + '" width="8" height="' + f1(ah - 8) + '" fill="#8a969e"/>';
          s += L(440, 217 + ah / 2 + 22, 'Opferanode (Zink)', 'sx-lbl-c');
          // Ionen & Elektronen
          if (t > 3) {
            for (j = 0; j < 9; j++) {
              var u = ((t - 3) * .35 + j / 9) % 1, ang = -150 + j * 37, rr = 30 + u * 150;
              s += '<g opacity="' + f1(1 - u) + '"><circle cx="' + f1(440 + Math.cos(ang * R) * rr) + '" cy="' + f1(217 + Math.sin(ang * R) * rr * .8) + '" r="7" fill="#dfe6ea" stroke="#5b6770"/><text x="' + f1(440 + Math.cos(ang * R) * rr) + '" y="' + f1(217 + Math.sin(ang * R) * rr * .8 + 3.5) + '" class="sx-lbl sx-lbl-c" style="font-size:8.5px;stroke:none">Zn²⁺</text></g>';
            }
            for (j = 0; j < 5; j++) { var ue = ((t - 3) * .5 + j / 5) % 1; s += '<circle cx="' + f1(lerp(470, 620, ue)) + '" cy="217" r="4" fill="' + F.gelb + '" stroke="#8a6d00"/>'; }
            s += L(545, 196, 'e⁻', 'sx-lbl-c');
          }
          if (t > 7.5) s += hinweis(640, 400, '✓ Propeller & Welle geschützt', F.gruen);
          // Spannungsreihe
          s += '<g transform="translate(40,392)"><rect width="430" height="46" rx="9" fill="rgba(255,255,255,.92)"/><text x="12" y="18" class="sx-hud-t">SPANNUNGSREIHE IM SEEWASSER</text>' +
            '<text x="12" y="36" class="sx-lbl" style="stroke:none;font-size:11.5px">unedel: Magnesium · Zink · Alu · Stahl · Bronze · Edelstahl :edel</text></g>';
          return s;
        }
      })]
    };
  });

  /* ================================================================== */
  /*  A.1.3.3  Kranen – Gurte in Rumpfhöhe verbinden                     */
  /* ================================================================== */
  S.szene('kranen', function () {
    var wl = 300, k = 1.2, cx = 400;
    function lp(x, y, hub) { return [cx + x * k, wl - hub + y * k]; }
    return {
      titel: 'Kranen', shots: [S.einstellung({
        dur: 13,
        steps: [
          { t: 0, titel: 'Gurte unter den Rumpf führen', text: 'Das macht normalerweise das Fachpersonal der Marina. Beim Durchziehen Propeller, Ruder und die Geber von Log und Lot nicht beschädigen.' },
          { t: 3.8, titel: 'Gurte in Rumpfhöhe verbinden', text: 'Eine Verbindung zwischen vorderem und achterem Gurt verhindert, dass die Gurte auseinanderrutschen und die Jacht durchrutscht.' },
          { t: 6.6, titel: 'Langsam anheben', text: 'Die Jacht hängt waagrecht und sicher in den Gurten.' }
        ],
        render: function (t) {
          var hub = ez(ab(t, 6.6, 11.5)) * 96, gurt = ez(ab(t, .3, 3)), vb = ab(t, 3.8, 5.6);
          var s = see(800, 460, wl, t, { amp: 3, lam: 120, sp: 20 });
          var yb = lp(0, 0, hub)[1];
          // Kranseil + Traverse
          var trY = yb - 128 * k;
          s += linie(400, 0, 400, trY - 16, '#3d4b55', 3) + '<path d="M392,' + f1(trY - 18) + ' q8,14 16,0" fill="none" stroke="#3d4b55" stroke-width="3"/>';
          s += '<rect x="250" y="' + f1(trY - 6) + '" width="300" height="12" rx="3" fill="' + F.gelb + '" stroke="#8a6d00" stroke-width="1.5"/>';
          s += linie(400, trY - 14, 262, trY - 2, '#3d4b55', 1.8) + linie(400, trY - 14, 538, trY - 2, '#3d4b55', 1.8);
          // Boot
          s += S.seitenBoot(cx, wl - hub, k, { segel: false });
          // Propeller + Geber
          var pr = lp(-60, 24, hub), gb = lp(52, 16, hub);
          s += '<ellipse cx="' + f1(pr[0]) + '" cy="' + f1(pr[1]) + '" rx="4" ry="11" fill="#b08d3c" stroke="#6d5418"/>' + linie(pr[0] + 4, pr[1] - 2, pr[0] + 30, pr[1] - 12, '#6f7f89', 2.4);
          s += '<rect x="' + f1(gb[0] - 6) + '" y="' + f1(gb[1] - 2) + '" width="12" height="6" rx="2" fill="#3d4b55"/>';
          if (t < 6.6) {
            s += '<circle cx="' + f1(pr[0]) + '" cy="' + f1(pr[1]) + '" r="20" fill="none" stroke="' + F.rot + '" stroke-width="2.4" stroke-dasharray="5 4"/>' + L(pr[0] - 70, pr[1] + 42, 'Propeller & Ruder schonen', 'sx-lbl-rot');
            s += '<circle cx="' + f1(gb[0]) + '" cy="' + f1(gb[1]) + '" r="16" fill="none" stroke="' + F.rot + '" stroke-width="2.4" stroke-dasharray="5 4"/>' + L(gb[0] + 20, gb[1] + 40, 'Geber (Log/Lot)', 'sx-lbl-rot');
          }
          // Gurte (achtern x=-40, vorn x=82)
          [-40, 82].forEach(function (gx, i) {
            var top = [i ? 538 : 262, trY + 6], deck = lp(gx, -22, hub), bot = lp(gx + (i ? -6 : 4), 14, hub);
            var yy = lerp(deck[1] - 60, bot[1], gurt);
            s += '<path d="M' + f1(top[0]) + ',' + f1(top[1]) + ' L' + f1(deck[0]) + ',' + f1(Math.min(yy, deck[1])) + (gurt > .6 ? ' L' + f1(bot[0]) + ',' + f1(bot[1]) : '') + '" fill="none" stroke="#1f5a78" stroke-width="7" stroke-linejoin="round" opacity=".92"/>';
          });
          // Verbindung in Rumpfhöhe
          if (vb > 0) { var a = lp(-40, -8, hub), b = lp(82, -8, hub); s += linie(a[0], a[1], lerp(a[0], b[0], vb), lerp(a[1], b[1], vb), F.rot, 3.2, ' stroke-dasharray="7 4"'); if (vb > .9) s += L(b[0] + 70, b[1] + 4, '← in Rumpfhöhe verbunden', 'sx-lbl-c sx-lbl-rot'); }
          s += seeVorne(800, 460, wl, t, { amp: 3, lam: 120, sp: 20 });
          if (hub > 20) for (var j = 0; j < 6; j++) { var u = (t * 1.3 + j / 6) % 1, dx = lp(-90 + j * 38, 20, hub)[0]; s += kreis(dx, lp(0, 20, hub)[1] + u * (hub + 10), 2.2, '#6fa9c8'); }
          return s;
        }
      })]
    };
  });

  /* ================================================================== */
  /*  A.1.4.2  Winterlager: Frostschutz & Hinterlüftung                  */
  /* ================================================================== */
  function flocke(x, y, r) { var s = '<g stroke="#fff" stroke-width="1.4" stroke-linecap="round">'; for (var i = 0; i < 3; i++) { var a = i * 60 * R; s += linie(x - Math.cos(a) * r, y - Math.sin(a) * r, x + Math.cos(a) * r, y + Math.sin(a) * r, '#fff', 1.4); } return s + '</g>'; }
  function schnee(t, n) { var s = ''; for (var i = 0; i < (n || 26); i++) { var x = (i * 71 + Math.sin(t + i) * 12) % 800, y = ((i * 53) + t * 30) % 470 - 10; s += flocke(x, y, 3 + (i % 3)); } return s; }
  S.szene('winterlager', function () {
    var k = 2.1, cx = 420, gy = 400, wl = gy - 70 * k + 4;
    function w(x, y) { return [cx + x * k, wl + y * k]; }
    function landBoot(extra) {
      var s = '<rect width="800" height="460" fill="#dfe8ee"/><rect y="' + gy + '" width="800" height="60" fill="#b9b3a6"/>';
      s += S.seitenBoot(cx, wl, k, { segel: false });
      // Lagerbock
      var a = w(-70, 12), b = w(80, 10);
      s += linie(a[0], a[1], a[0] - 30, gy, '#56656f', 6) + linie(b[0], b[1], b[0] + 30, gy, '#56656f', 6) + '<rect x="' + f1(w(-14, 70)[0]) + '" y="' + f1(gy - 8) + '" width="' + f1(40 * k) + '" height="10" fill="#8a6d4a"/>';
      return s + (extra || '');
    }
    var frost = S.einstellung({
      dur: 11,
      steps: [
        { t: 0, titel: 'Frostgefahr: Restwasser gefriert', text: 'Eis dehnt sich aus und kann Leitungen, Wärmetauscher, Pumpen und Auspuff-Wassersammler sprengen.' },
        { t: 3.2, titel: 'Wasser entfernen', text: 'Kühlsystem, Auspuffsystem und Bilge vollständig entleeren.' },
        { t: 7.4, titel: 'Oder: Frostschutzmittel ins Kühlsystem', text: 'Alternativ wird das Kühlsystem mit Frostschutzmittel gefüllt.' }
      ],
      render: function (t) {
        var leer = ez(ab(t, 3.4, 6.8)), fs = ez(ab(t, 7.4, 9));
        var s = landBoot();
        // Schnitt: Innenraum
        s += '<path d="M' + w(-100, -18).join(',') + ' L' + w(100, -18).join(',') + ' Q' + w(92, 4).join(',') + ' ' + w(80, 12).join(',') + ' L' + w(-90, 12).join(',') + ' Q' + w(-100, 4).join(',') + ' ' + w(-100, -18).join(',') + ' Z" fill="#f6f1e6" opacity=".92"/>';
        // Motor
        var m = w(-58, -14); s += '<rect x="' + f1(m[0]) + '" y="' + f1(m[1]) + '" width="' + f1(34 * k) + '" height="' + f1(20 * k) + '" rx="6" fill="#56656f"/>' + L(m[0] + 17 * k, m[1] - 8, 'Motor', 'sx-lbl-c');
        // Kühlwasserleitung (Seeventil -> Motor)
        var c = fs > 0 ? '#e0529c' : '#2f8fd0', o1 = fs > 0 ? 1 : 1 - leer;
        var sv = w(-30, 12), mo = w(-34, 6);
        s += '<path d="M' + f1(sv[0]) + ',' + f1(sv[1]) + ' L' + f1(sv[0]) + ',' + f1(mo[1] - 4) + ' L' + f1(mo[0] - 10) + ',' + f1(mo[1] - 4) + '" fill="none" stroke="#9fb0bb" stroke-width="9"/>';
        s += '<path d="M' + f1(sv[0]) + ',' + f1(sv[1]) + ' L' + f1(sv[0]) + ',' + f1(mo[1] - 4) + ' L' + f1(mo[0] - 10) + ',' + f1(mo[1] - 4) + '" fill="none" stroke="' + c + '" stroke-width="5" opacity="' + f1(o1) + '"/>';
        s += L(sv[0] - 12, sv[1] + 30, fs > 0 ? 'Kühlsystem: Frostschutz' : 'Kühlsystem', fs > 0 ? 'sx-lbl-r sx-lbl-rot' : 'sx-lbl-r');
        // Auspuff mit Wassersammler
        var ws = w(-82, -4);
        s += '<path d="M' + w(-58, -6).join(',') + ' L' + f1(ws[0] + 10 * k) + ',' + f1(ws[1]) + ' M' + f1(ws[0]) + ',' + f1(ws[1] - 4) + ' L' + w(-104, -10).join(',') + '" fill="none" stroke="#3d4b55" stroke-width="5"/>';
        s += '<rect x="' + f1(ws[0]) + '" y="' + f1(ws[1] - 6) + '" width="' + f1(10 * k) + '" height="' + f1(14 * k) + '" rx="4" fill="#dfe5e9" stroke="#3d4b55" stroke-width="2"/>';
        s += '<rect x="' + f1(ws[0] + 2) + '" y="' + f1(ws[1] - 6 + 14 * k * (.4 + .6 * leer)) + '" width="' + f1(10 * k - 4) + '" height="' + f1(14 * k * .6 * (1 - leer)) + '" fill="#2f8fd0"/>';
        s += L(ws[0] + 5 * k, ws[1] - 16, 'Auspuff', 'sx-lbl-c');
        // Bilge
        var bl = w(-10, 8);
        s += '<path d="M' + f1(bl[0]) + ',' + f1(bl[1] + 8 - 6 * (1 - leer)) + ' L' + f1(bl[0] + 40 * k) + ',' + f1(bl[1] + 8 - 6 * (1 - leer)) + ' L' + f1(bl[0] + 36 * k) + ',' + f1(bl[1] + 10) + ' L' + f1(bl[0] + 4) + ',' + f1(bl[1] + 10) + ' Z" fill="#2f8fd0" opacity="' + f1(1 - leer) + '"/>';
        s += L(bl[0] + 30 * k, bl[1] + 36, 'Bilge', 'sx-lbl-c');
        // Tropfen beim Entleeren
        if (leer > 0 && leer < 1) for (var i = 0; i < 3; i++) { var u = (t * 1.6 + i / 3) % 1; s += kreis(sv[0], sv[1] + 6 + u * (gy - sv[1] - 10), 3, '#2f8fd0') + kreis(w(-104, -10)[0] - 4, w(-104, -10)[1] + u * (gy - w(-104, -10)[1] - 6), 3, '#2f8fd0') + kreis(bl[0] + 20 * k, bl[1] + 14 + u * (gy - bl[1] - 18), 3, '#2f8fd0'); }
        // Eis-Warnung
        if (t < 3.2) { s += flocke(mo[0] - 20, mo[1] - 16, 9) .replace(/#fff/g, '#2f8fd0') + '<path d="M' + f1(sv[0] - 8) + ',' + f1(sv[1] - 30) + ' l6,6 l-5,5 l7,7" fill="none" stroke="' + F.rot + '" stroke-width="2.4"/>'; s += hinweis(170, 60 + 370, '✗ Eis sprengt Leitungen', F.rot); }
        else s += hinweis(200, 430, fs > .5 ? '✓ Frostschutz im Kühlsystem' : '✓ Wasser abgelassen', F.gruen);
        s += schnee(t, 18);
        return s;
      }
    });
    var plane = S.einstellung({
      dur: 11,
      steps: [
        { t: 0, titel: 'Plane dicht bis zum Boden', text: 'Ohne Luftzirkulation sammelt sich Feuchtigkeit – Schimmel und Stockflecken entstehen.' },
        { t: 4.6, titel: 'Richtig: Plane hinterlüftet', text: 'Unten Luft einströmen lassen, oben Lüftungsöffnungen – die Plane liegt nicht direkt auf, die Luft kann zirkulieren.' }
      ],
      render: function (t) {
        var ok = ez(ab(t, 4.6, 6));
        var s = landBoot();
        var first = w(0, -150), l = w(-118, -8), r = w(124, -10);
        var unten = lerp(gy - 2, l[1] + 34, ok);
        s += '<path d="M' + f1(l[0] - 30) + ',' + f1(unten) + ' L' + f1(l[0] - 18) + ',' + f1(l[1] - 40) + ' Q' + f1(first[0]) + ',' + f1(first[1] - 30) + ' ' + f1(r[0] + 18) + ',' + f1(r[1] - 40) + ' L' + f1(r[0] + 30) + ',' + f1(unten) + ' Z" fill="#2f6f8f" opacity=".82" stroke="#1d4a60" stroke-width="2"/>';
        // Lüfter oben
        if (ok > .5) [-40, 50].forEach(function (x) { var p = w(x, -76); s += '<path d="M' + f1(p[0] - 14) + ',' + f1(p[1] + 6) + ' q14,-22 28,0" fill="#1d4a60"/>'; });
        // Feuchtigkeit / Luftströmung
        if (ok < .5) { for (var i = 0; i < 14; i++) { var x = l[0] + 10 + (i * 37) % (r[0] - l[0] - 20), y = l[1] - 34 + (i * 23) % 50, a = clamp((t - i * .2) / 2, 0, 1); s += '<path d="M' + f1(x) + ',' + f1(y) + ' q-4,7 0,10 q4,-3 0,-10" fill="#bfe3f5" opacity="' + f1(a) + '"/>'; } s += hinweis(180, 430, '✗ Feuchtigkeit staut sich', F.rot); }
        else {
          for (i = 0; i < 8; i++) {
            var u = (t * .4 + i / 8) % 1, sx = i % 2 ? r[0] + 40 : l[0] - 40, ex = w(i % 2 ? 50 : -40, -80)[0];
            var px = lerp(sx, ex, u), py = lerp(gy - 20, w(0, -84)[1], u * u);
            s += '<circle cx="' + f1(px) + '" cy="' + f1(py) + '" r="4" fill="#8fd0f0" opacity="' + f1(1 - Math.abs(u - .5)) + '"/>';
          }
          s += S.pfeil(l[0] - 70, gy - 20, l[0] - 36, gy - 20, 'blau') + S.pfeil(r[0] + 70, gy - 20, r[0] + 36, gy - 20, 'blau');
          s += S.pfeil(w(-40, -80)[0], w(-40, -80)[1], w(-40, -80)[0], w(-40, -80)[1] - 40, 'blau') + S.pfeil(w(50, -80)[0], w(50, -80)[1], w(50, -80)[0], w(50, -80)[1] - 40, 'blau');
          s += hinweis(180, 430, '✓ Luft zirkuliert', F.gruen);
        }
        s += schnee(t, 18);
        return s;
      }
    });
    return { titel: 'Winterlager', shots: [frost, plane] };
  });

  /* ================================================================== */
  /*  A.4.2  Bei Nacht & verminderter Sicht                               */
  /* ================================================================== */
  function sektor(cx, cy, r, a0, a1, farbe, op) {
    var p0 = [cx + Math.sin(a0 * R) * r, cy - Math.cos(a0 * R) * r], p1 = [cx + Math.sin(a1 * R) * r, cy - Math.cos(a1 * R) * r];
    return '<path d="M' + cx + ',' + cy + ' L' + f1(p0[0]) + ',' + f1(p0[1]) + ' A' + r + ',' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + f1(p1[0]) + ',' + f1(p1[1]) + ' Z" fill="' + farbe + '" opacity="' + op + '"/>';
  }
  function sterne(t) { var s = ''; for (var i = 0; i < 40; i++) s += kreis((i * 97) % 800, (i * 41) % 240, (i % 3) * .5 + .6, '#fff', ' opacity="' + f1(.4 + .4 * Math.sin(t * 2 + i)) + '"'); return s; }
  S.szene('nacht', function () {
    var lichter = S.einstellung({
      dur: 8,
      steps: [{ t: 0, titel: 'Nachts: Lichter führen', text: 'Segelfahrzeug in Fahrt: Seitenlichter rot (Backbord) und grün (Steuerbord) je 112,5°, Hecklicht weiß 135°. Unter Motor zusätzlich das Topplicht.' }],
      render: function (t) {
        var s = '<rect width="800" height="460" fill="#0e1d29"/>' + sterne(t);
        var a = ez(ab(t, .4, 2)), b = ez(ab(t, 2, 3.6)), c = ez(ab(t, 3.6, 5.2)), cx = 400, cy = 250;
        s += sektor(cx, cy, 190, 0, 112.5, '#2fe07a', f1(.28 * b)) + sektor(cx, cy, 190, -112.5, 0, '#ff3b30', f1(.28 * a)) + sektor(cx, cy, 190, 112.5, 247.5, '#fff6d8', f1(.22 * c));
        s += S.zeichneBoot({ x: cx, y: cy, h: 0, k: 1.8, ohneSegel: true, t: t });
        s += kreis(cx - 11, cy - 14, 4, '#ff3b30') + kreis(cx + 11, cy - 14, 4, '#2fe07a') + kreis(cx, cy + 56, 4, '#fff6d8');
        if (a > .5) s += L(cx - 150, cy - 110, 'Backbord rot · 112,5°', 'sx-lbl-hell sx-lbl-c');
        if (b > .5) s += L(cx + 150, cy - 110, 'Steuerbord grün · 112,5°', 'sx-lbl-hell sx-lbl-c');
        if (c > .5) s += L(cx, cy + 176, 'Hecklicht weiß · 135°', 'sx-lbl-hell sx-lbl-c');
        return s;
      }
    });
    var nebel = S.einstellung({
      dur: 14,
      steps: [
        { t: 0, titel: 'Verminderte Sicht: Schallsignal geben', text: 'Segelfahrzeug in Fahrt: ein langer und zwei kurze Töne (lang – kurz – kurz), mindestens alle 2 Minuten.' },
        { t: 5, titel: 'Radar einschalten und besetzen', text: 'Das Radarbild wird laufend beobachtet – dazu verstärkt Ausguck halten.' },
        { t: 9, titel: 'Rettungsmittel bereit, einpicken', text: 'Rettungswesten tragen; wer allein in der Plicht steht, trägt den Lifebelt und pickt sich ein.' }
      ],
      render: function (t) {
        var wl = 330, o = { amp: 3, lam: 110, sp: 50 };
        var s = see(800, 460, wl, t, o);
        s += S.seitenBoot(330, wl, .95, { lichter: true });
        // Person in der Plicht mit Lifebelt
        var PERSON = '';
        if (t > 9) { var px = 330 - 70 * .95, py = wl - 42; PERSON = '<circle cx="' + f1(px) + '" cy="' + f1(py - 20) + '" r="7" fill="#f2c9a0" stroke="#8a5a2b"/><rect x="' + f1(px - 7) + '" y="' + f1(py - 13) + '" width="14" height="20" rx="4" fill="' + F.orange + '"/>' + '<path d="M' + f1(px + 5) + ',' + f1(py - 4) + ' q20,10 40,-4" fill="none" stroke="' + F.gelb + '" stroke-width="2.4"/>' + L(px - 10, py - 40, 'Lifebelt, eingepickt', 'sx-lbl-r'); }
        s += seeVorne(800, 460, wl, t, o);
        // Nebel
        s += '<rect width="800" height="460" fill="#dfe6ea" opacity=".45"/>';
        s += '<circle cx="' + f1(330 + 108 * .95) + '" cy="' + f1(wl - 24 * .95) + '" r="9" fill="#2fe07a" opacity=".55"/>';
        if (t > 9) s += PERSON;
        // Horn: lang (0-2.4), kurz (2.8-3.4), kurz (3.8-4.4), dann Pause
        var tt = t % 7, on = (tt < 2.4) || (tt > 2.8 && tt < 3.4) || (tt > 3.8 && tt < 4.4);
        var hx = 330 + 30, hy = wl - 90;
        if (on) for (var i = 0; i < 3; i++) { var r = 20 + ((t * 60 + i * 22) % 66); s += '<path d="M' + f1(hx + r * .7) + ',' + f1(hy - r * .7) + ' A' + r + ',' + r + ' 0 0 1 ' + f1(hx + r * .7) + ',' + f1(hy + r * .7) + '" fill="none" stroke="' + F.navy + '" stroke-width="2.4" opacity="' + f1(1 - r / 90) + '"/>'; }
        s += '<g transform="translate(470,64)"><rect width="300" height="64" rx="10" fill="rgba(255,255,255,.92)" stroke="#b8c4cc"/><text x="14" y="20" class="sx-hud-t">SCHALLSIGNAL SEGELFAHRZEUG</text>';
        [[14, 110, 0, 2.4], [140, 34, 2.8, 3.4], [190, 34, 3.8, 4.4]].forEach(function (b) { var act = tt > b[2] && tt < b[3]; s += '<rect x="' + b[0] + '" y="32" width="' + b[1] + '" height="16" rx="8" fill="' + (act ? F.accent : '#c9d3d9') + '"/>'; });
        s += '<text x="236" y="45" class="sx-lbl" style="stroke:none;font-size:11px">≤ 2 min</text></g>';
        // Radar
        if (t > 5) {
          var ra = t * 2.2, rx = 640, ry = 290;
          s += '<g><circle cx="' + rx + '" cy="' + ry + '" r="78" fill="#0f2a1c" stroke="#3d4b55" stroke-width="5"/>';
          [26, 52].forEach(function (q) { s += '<circle cx="' + rx + '" cy="' + ry + '" r="' + q + '" fill="none" stroke="#2c6b45" stroke-width="1"/>'; });
          s += sektor(rx, ry, 76, (ra / R) % 360 - 40, (ra / R) % 360, '#39d17a', .35);
          s += kreis(rx + 30, ry - 36, 4, '#7dff9f') + kreis(rx - 44, ry + 16, 3, '#7dff9f', ' opacity=".7"') + kreis(rx, ry, 3, '#fff');
          s += '</g>' + L(rx, ry + 102, 'Radar: besetzt', 'sx-lbl-c');
        }
        return s;
      }
    });
    return { titel: 'Bei Nacht & verminderter Sicht', shots: [lichter, nebel] };
  });

  /* ================================================================== */
  /*  A.4.3  Reffen                                                       */
  /* ================================================================== */
  S.szene('reffen', function () {
    return {
      titel: 'Reffen', shots: [S.einstellung({
        dur: 15,
        steps: [
          { t: 0, titel: 'Der Wind nimmt zu', text: 'Die Jacht krängt stark, der Ruderdruck steigt (sie wird luvgierig) – Zeit zum Reffen, am besten früh.' },
          { t: 4, titel: 'Vorsegel teilweise einrollen', text: 'Beim Rollreff den Holepunkt der Vorschot nach vorne versetzen, damit das Segel gut steht.' },
          { t: 7.6, titel: 'Großsegel reffen', text: 'Bindereff (oder Rollreff): Fall fieren, Reffkausch einhaken, Fall durchsetzen, Reffleine dicht.' },
          { t: 11.4, titel: 'Weniger Segelfläche – aufrechter und gut steuerbar', text: 'Krängung und Ruderdruck gehen zurück.' }
        ],
        render: function (t) {
          var wind = ez(ab(t, 0, 3.4)), roll = ez(ab(t, 4, 7)), reff = ez(ab(t, 7.6, 11));
          var heel = 8 + wind * 22 - roll * 6 - reff * 9 + Math.sin(t * 2.3) * 1.5;
          var wl = 350, o = { amp: 4 + wind * 4, lam: 110, sp: 60 };
          var s = see(800, 460, wl, t, o);
          s += S.seitenBoot(250, wl, .95, { reff: reff, fockRoll: roll * .5 });
          // Holepunkt
          if (t > 4) { var hp = [250 + lerp(26, 44, roll) * .95, wl - 22 * .95]; s += kreis(hp[0], hp[1], 4, F.rot) + (t < 8 ? S.pfeil(hp[0] - 30, hp[1] - 18, hp[0] + 6, hp[1] - 18, 'rot') + L(hp[0] - 12, hp[1] - 28, 'Holepunkt vor', 'sx-lbl-c sx-lbl-rot') : ''); }
          // Heckansicht mit Krängung
          var top = -250 + reff * 70, fr = roll * .5;
          var ex = '<path d="M2,' + f1(top) + ' Q30,' + f1((top - 40) / 2) + ' 40,-42 L2,-42 Z" fill="#fff" stroke="#2a4452" stroke-width="1.8"/>' +
            '<path d="M2,' + f1(-236 + fr * 80) + ' Q' + f1(46 - fr * 20) + ',-120 ' + f1(56 - fr * 20) + ',-28 L4,-26 Z" fill="#fff" stroke="#2a4452" stroke-width="1.6" opacity=".9"/>';
          s += S.heckBoot(600, wl, .95, { rot: heel, extra: ex });
          s += seeVorne(800, 460, wl, t, o);
          s += L(600, 440, 'von achtern: Krängung ' + Math.round(heel) + '°', 'sx-lbl-c') + L(250, 440, 'Segelfläche', 'sx-lbl-c');
          // Windanzeige
          var bft = Math.round(4 + wind * 2);
          s += '<g transform="translate(470,64)"><rect width="150" height="44" rx="10" fill="rgba(255,255,255,.92)" stroke="#b8c4cc"/><text x="12" y="18" class="sx-hud-t">WIND</text><text x="12" y="36" class="sx-lbl" style="stroke:none;font-weight:700">' + bft + ' Bft</text>';
          for (var i = 0; i < 6; i++) s += '<rect x="' + (66 + i * 12) + '" y="' + (30 - i * 3) + '" width="8" height="' + (8 + i * 3) + '" rx="2" fill="' + (i < bft - 1 ? F.accent : '#dfe5e9') + '"/>';
          s += '</g>';
          for (i = 0; i < 5; i++) { var xx = ((t * 160 + i * 170) % 900) - 100, yy = 90 + i * 40; s += '<line x1="' + f1(xx) + '" y1="' + yy + '" x2="' + f1(xx + 40 + wind * 30) + '" y2="' + yy + '" stroke="#8fb9cf" stroke-width="2" stroke-linecap="round" opacity=".7"/>'; }
          return s;
        }
      })]
    };
  });

  /* ================================================================== */
  /*  A.5.3  Einklarieren mit der Q-Flagge                                */
  /* ================================================================== */
  function flagge(x, y, w, h, t, fill) {
    // an der Leine hängende, wehende Flagge (Liek links)
    var pts = [], n = 8, i;
    for (i = 0; i <= n; i++) { var u = i / n; pts.push([x + u * w, y + Math.sin(t * 6 + u * 4) * 3 * u]); }
    var d = 'M' + pts.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' L');
    for (i = n; i >= 0; i--) { var p = pts[i]; d += ' L' + f1(p[0]) + ',' + f1(p[1] + h); }
    return '<path d="' + d + ' Z" fill="' + fill + '" stroke="#3d4b55" stroke-width="1"/>';
  }
  S.szene('q-flagge', function () {
    return {
      titel: 'Einklarieren', shots: [S.einstellung({
        dur: 14,
        steps: [
          { t: 0, titel: 'Einreise in ein Drittland: Q-Flagge setzen', text: 'Die gelbe Flagge „Q“ wird unter der Backbordsaling gesetzt (die Gastlandflagge steht unter der Steuerbordsaling).' },
          { t: 3.6, titel: 'Direkt einen Einklarierungshafen anlaufen', text: 'Port of Entry – vor dem Einklarieren geht niemand an Land (außer dem Schiffsführer zum Einklarieren).' },
          { t: 7.2, titel: 'Der Schiffsführer erledigt die Formalitäten', text: 'Mit Crewliste, Schiffs- und Personaldokumenten bei Hafenamt, Zoll und Polizei.' },
          { t: 10.6, titel: 'Nach dem Einklarieren: Q-Flagge einholen', text: 'Beim Verlassen des Landes wird wieder ausklariert.' }
        ],
        render: function (t) {
          var wl = 360, o = { amp: 3, lam: 100, sp: 30 };
          var hoch = ez(ab(t, .4, 3)), runter = ez(ab(t, 10.6, 12.6)), qy = -30 - 112 * hoch + 112 * runter;
          var s = see(800, 460, wl, t, o);
          // Hafen im Hintergrund
          var hf = ez(ab(t, 3.6, 6));
          s += '<g opacity="' + f1(.3 + .7 * hf) + '"><rect x="0" y="' + (wl - 50) + '" width="800" height="50" fill="#cfc8b8"/>';
          [[40, 70, 60], [120, 50, 90], [520, 80, 70], [620, 60, 100], [700, 90, 60]].forEach(function (b) { s += '<rect x="' + b[0] + '" y="' + (wl - 50 - b[2]) + '" width="' + b[1] + '" height="' + b[2] + '" fill="#e9e2d2" stroke="#b9b09c"/>'; });
          s += '<g transform="translate(560,' + (wl - 130) + ')"><rect width="160" height="44" rx="6" fill="' + F.navy + '"/><text x="80" y="19" class="sx-ruf-t" style="font-size:12px">PORT OF ENTRY</text><text x="80" y="35" class="sx-ruf-t" style="font-size:10.5px;font-weight:500">Hafenamt · Zoll · Polizei</text></g></g>';
          // Schiffsführer mit Papieren
          if (t > 7.2) { var px = lerp(420, 600, ez(ab(t, 7.2, 10))), py = wl - 58; s += '<circle cx="' + f1(px) + '" cy="' + f1(py - 22) + '" r="7" fill="#f2c9a0" stroke="#8a5a2b"/><rect x="' + f1(px - 7) + '" y="' + f1(py - 15) + '" width="14" height="22" rx="4" fill="' + F.navy2 + '"/><rect x="' + f1(px + 6) + '" y="' + f1(py - 10) + '" width="12" height="15" fill="#fff" stroke="#8796a0"/>' + L(px, py + 22, 'Schiffsführer mit Dokumenten', 'sx-lbl-c sx-lbl-klein'); }
          var bx = 330, k = 1.02;
          var ex = '';
          // Flaggenleinen
          ex += linie(-44, -150, -44, -26, '#8796a0', .8) + linie(44, -150, 44, -26, '#8796a0', .8);
          ex += flagge(-44, qy, 30, 22, t, F.gelb) + '<text x="-29" y="' + f1(qy + 16) + '" style="font:700 12px Poppins,sans-serif;fill:#3d4b55;text-anchor:middle">Q</text>';
          ex += flagge(44, -146, 30, 20, t + 1, '#2a7fbf') + '<rect x="44" y="-139" width="30" height="6" fill="#fff" opacity=".9"/>';
          // Nationalflagge am Heck (Österreich rot-weiß-rot)
          ex += linie(24, -20, 34, -62, '#6f5a3a', 1.6) + '<g transform="translate(34,-62)">' + flagge(0, 0, 26, 6, t + 2, '#d7263d') + flagge(0, 6, 26, 6, t + 2, '#fff') + flagge(0, 12, 26, 6, t + 2, '#d7263d') + '</g>';
          s += S.heckBoot(bx, wl, k, { extra: ex, rot: Math.sin(t * 1.4) * 2 });
          s += seeVorne(800, 460, wl, t, o);
          s += L(bx - 60 * k, wl - 170 * k, 'Backbordsaling', 'sx-lbl-r') + L(bx + 86 * k, wl - 170 * k, 'Steuerbordsaling', '');
          s += L(bx - 88 * k, wl + qy * k + 14, runter > .9 ? '' : 'Q-Flagge (gelb)', 'sx-lbl-r') + L(bx + 88 * k, wl - 132 * k, 'Gastlandflagge', '');
          if (runter > .9) s += hinweis(bx, 430, '✓ einklariert – Q-Flagge eingeholt', F.gruen);
          return s;
        }
      })]
    };
  });

  /* ================================================================== */
  /*  B.4.1  Viertakt-Diesel                                              */
  /* ================================================================== */
  S.szene('viertakt', function () {
    var TAKT = ['1. Takt: Ansaugen', '2. Takt: Verdichten', '3. Takt: Arbeiten', '4. Takt: Ausstoßen'];
    return {
      titel: 'Der Viertakt-Diesel', shots: [S.einstellung({
        dur: 14,
        steps: [
          { t: 0, titel: TAKT[0], text: 'Der Kolben geht nach unten, das Einlassventil ist offen: Frische Luft strömt in den Zylinder.' },
          { t: 3.5, titel: TAKT[1], text: 'Beide Ventile geschlossen, der Kolben verdichtet die Luft sehr stark – sie wird dabei mehrere hundert Grad heiß.' },
          { t: 7, titel: TAKT[2], text: 'Diesel wird eingespritzt und entzündet sich an der heißen Luft (Selbstzünder – keine Zündkerze). Die Verbrennung drückt den Kolben nach unten.' },
          { t: 10.5, titel: TAKT[3], text: 'Das Auslassventil öffnet, der Kolben schiebt die Abgase hinaus. Danach beginnt alles von vorn.' }
        ],
        render: function (t) {
          var th = (t / 14) * 720, tk = Math.min(3, Math.floor(th / 180)), inT = (th % 180) / 180;
          var r = 52, l = 150, cxk = 330, cyk = 370, a = th * R;
          var pinY = cyk - (r * Math.cos(a) + Math.sqrt(l * l - Math.pow(r * Math.sin(a), 2))), pinX = cxk;
          var kop = pinY - 34, kurbel = [cxk + r * Math.sin(a), cyk - r * Math.cos(a)];
          var s = '<rect width="800" height="460" fill="#f2f5f7"/>';
          // Zylinderblock
          s += '<rect x="230" y="96" width="200" height="220" rx="8" fill="#c9d3d9" stroke="#6f7f89" stroke-width="2"/><rect x="260" y="100" width="140" height="216" fill="#eef2f4"/>';
          // Gasfüllung
          var col = tk === 0 ? '#bfe3f5' : tk === 1 ? ('rgb(' + Math.round(lerp(191, 246, inT)) + ',' + Math.round(lerp(227, 190, inT)) + ',' + Math.round(lerp(245, 120, inT)) + ')') : tk === 2 ? ('rgb(' + Math.round(lerp(240, 210, inT)) + ',' + Math.round(lerp(90, 170, inT)) + ',' + Math.round(lerp(40, 150, inT)) + ')') : '#aab3b8';
          s += '<rect x="260" y="130" width="140" height="' + f1(kop - 130) + '" fill="' + col + '"/>';
          // Kopf mit Kanälen
          s += '<path d="M180,70 L480,70 L480,130 L400,130 L400,128 L260,128 L260,130 L180,130 Z" fill="#aab4ba" stroke="#6f7f89" stroke-width="2"/>';
          s += '<path d="M150,84 L290,84 L300,128 L278,128 L272,106 L150,106 Z" fill="' + (tk === 0 ? '#bfe3f5' : '#e1e7ea') + '" stroke="#6f7f89"/>';
          s += '<path d="M510,84 L370,84 L360,128 L382,128 L388,106 L510,106 Z" fill="' + (tk === 3 ? '#aab3b8' : '#e1e7ea') + '" stroke="#6f7f89"/>';
          // Ventile
          var ein = tk === 0 ? Math.sin(inT * Math.PI) * 14 : 0, aus = tk === 3 ? Math.sin(inT * Math.PI) * 14 : 0;
          s += linie(289, 40, 289, 124 + ein, '#3d4b55', 4) + '<rect x="276" y="' + f1(124 + ein) + '" width="26" height="6" rx="2" fill="#3d4b55"/>';
          s += linie(371, 40, 371, 124 + aus, '#3d4b55', 4) + '<rect x="358" y="' + f1(124 + aus) + '" width="26" height="6" rx="2" fill="#3d4b55"/>';
          // Einspritzdüse
          s += '<rect x="324" y="40" width="12" height="90" rx="3" fill="#56656f"/>';
          if (tk === 2 && inT < .22) {
            for (var i = 0; i < 5; i++) s += linie(330, 130, 330 + (i - 2) * 18, 150 + Math.abs(i - 2) * -2, F.gelb, 2);
            s += '<circle cx="330" cy="' + f1(kop - 30) + '" r="' + f1(20 + inT * 90) + '" fill="#ffb347" opacity="' + f1(.8 - inT * 3) + '"/>';
          }
          // Partikel
          if (tk === 0) for (i = 0; i < 6; i++) { var u = (t * 1.2 + i / 6) % 1; s += kreis(lerp(160, 290, u), 95 + (i % 3) * 3 + (u > .8 ? (u - .8) * 150 : 0), 3, F.accent); }
          if (tk === 3) for (i = 0; i < 6; i++) { u = (t * 1.2 + i / 6) % 1; s += kreis(lerp(370, 510, u), 95 + (i % 3) * 3 - (u < .2 ? (.2 - u) * 100 : 0), 3.4, '#6f7f89'); }
          // Kolben + Pleuel + Kurbel
          s += '<rect x="262" y="' + f1(kop) + '" width="136" height="50" rx="4" fill="#8a969e" stroke="#56656f" stroke-width="2"/>';
          [8, 16].forEach(function (d) { s += linie(262, kop + d, 398, kop + d, '#56656f', 1.5); });
          s += '<circle cx="' + cxk + '" cy="' + cyk + '" r="' + (r + 18) + '" fill="#dfe5e9" stroke="#8796a0" stroke-width="2"/>';
          s += linie(pinX, pinY, kurbel[0], kurbel[1], '#3d4b55', 12) + kreis(pinX, pinY, 7, '#3d4b55') + linie(cxk, cyk, kurbel[0], kurbel[1], '#56656f', 16) + kreis(kurbel[0], kurbel[1], 8, '#8796a0') + kreis(cxk, cyk, 9, '#3d4b55');
          s += L(cxk + 80, cyk + 30, 'Kurbelwelle', '');
          s += L(150, 76, 'Einlass (Luft)', '') + L(510, 76, 'Auslass (Abgas)', 'sx-lbl-r') + L(342, 34, 'Einspritzdüse', '');
          // Taktanzeige
          s += '<g transform="translate(540,150)">';
          TAKT.forEach(function (tx, j) { var on = j === tk; s += '<rect x="0" y="' + (j * 50) + '" width="230" height="40" rx="10" fill="' + (on ? F.accent : '#fff') + '" stroke="' + (on ? F.accent : '#c9d3d9') + '"/><text x="16" y="' + (j * 50 + 25) + '" style="font:' + (on ? 700 : 500) + ' 14px Poppins,sans-serif;fill:' + (on ? '#fff' : '#5b6770') + '">' + tx + '</text>'; });
          s += '</g>';
          return s;
        }
      })]
    };
  });

  /* ================================================================== */
  /*  B.5.2  Welle & Stopfbüchse                                          */
  /* ================================================================== */
  S.szene('stopfbuechse', function () {
    var p0 = [170, 170], p1 = [700, 330], m = (p1[1] - p0[1]) / (p1[0] - p0[0]);
    function wy(x) { return p0[1] + (x - p0[0]) * m; }
    return {
      titel: 'Welle & Stopfbüchse', shots: [S.einstellung({
        dur: 16,
        steps: [
          { t: 0, titel: 'Die Welle führt vom Getriebe zur Schraube', text: 'Ein Drucklager nimmt den Schub der Schraube auf und überträgt ihn auf den Rumpf.' },
          { t: 3.6, titel: 'Die Stopfbüchse dichtet am Stevenrohr ab', text: 'Packungsringe werden mit der Überwurfmutter um die drehende Welle gepresst.' },
          { t: 7.2, titel: 'Richtig eingestellt: höchstens ein Tropfen pro Minute', text: 'Das Wasser schmiert und kühlt die Packung. Die Stopfbüchse darf nicht heiß werden (Zeitraffer).' },
          { t: 11, titel: 'Zu locker: Wasser läuft ein – zu fest: sie läuft heiß', text: 'Regelmäßig kontrollieren und vorsichtig nachstellen. Beim Saildrive gibt es keine Stopfbüchse.' }
        ],
        render: function (t) {
          var sb = 440;
          var s = '<rect width="800" height="460" fill="#f6f1e6"/>';
          s += '<path d="M0,306 L800,256 L800,460 L0,460 Z" fill="url(#sxSee)"/>';
          s += '<path d="M0,294 L800,244 L800,258 L0,308 Z" fill="#eef2f4" stroke="' + F.navy + '" stroke-width="2"/>';
          s += L(24, 350, 'außen: Wasser', 'sx-lbl-hell') + L(560, 200, 'innen: Motorraum / Bilge', '');
          // Motor + Getriebe + Drucklager
          s += '<rect x="30" y="90" width="110" height="100" rx="10" fill="#56656f"/>' + L(85, 80, 'Motor', 'sx-lbl-c');
          s += '<rect x="140" y="140" width="40" height="60" rx="6" fill="#8796a0"/>' + L(150, 222, 'Getriebe', 'sx-lbl-c');
          s += '<rect x="228" y="' + f1(wy(240) - 20) + '" width="26" height="40" rx="4" fill="#3d4b55"/>' + L(241, wy(240) - 28, 'Drucklager', 'sx-lbl-c');
          // Welle (drehend)
          var ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) / R;
          s += '<g transform="translate(' + p0[0] + ',' + p0[1] + ') rotate(' + f1(ang) + ')"><rect x="0" y="-7" width="' + f1(Math.hypot(p1[0] - p0[0], p1[1] - p0[1])) + '" height="14" fill="#c9d3d9" stroke="#6f7f89"/>';
          for (var i = 0; i < 26; i++) { var xx = (i * 22 + t * 90) % 560; s += linie(xx, -6, xx + 8, 6, '#aebac1', 2.4); }
          s += '</g>';
          // Stevenrohr
          s += '<g transform="translate(' + sb + ',' + f1(wy(sb)) + ') rotate(' + f1(ang) + ')"><rect x="20" y="-13" width="110" height="26" fill="#b08d3c" opacity=".55" stroke="#6d5418"/>';
          // Stopfbüchse
          s += '<rect x="-4" y="-18" width="26" height="36" rx="3" fill="#8a6d4a" stroke="#4a3920"/><rect x="-14" y="-15" width="12" height="30" rx="2" fill="#6d5418"/></g>';
          s += L(sb - 10, wy(sb) - 34, 'Stopfbüchse', 'sx-lbl-c') + L(sb + 80, wy(sb + 80) + 44, 'Stevenrohr', 'sx-lbl-c sx-lbl-hell');
          // Propeller
          var ph = t * 10;
          s += '<g transform="translate(' + p1[0] + ',' + p1[1] + ')"><ellipse rx="10" ry="12" fill="#b08d3c"/>';
          for (i = 0; i < 3; i++) { var a = ph + i * TAU / 3, h = Math.cos(a) * 60; s += '<ellipse cx="0" cy="' + f1(h / 2) + '" rx="' + f1(8 + Math.abs(Math.sin(a)) * 5) + '" ry="' + f1(Math.abs(h) / 2 + 2) + '" fill="#c9a24d" stroke="#6d5418"/>'; }
          s += '</g>' + L(p1[0], p1[1] + 64, 'Schraube', 'sx-lbl-c sx-lbl-hell');
          // Tropfen / Zustände
          var dy0 = wy(sb) + 18, zl = t > 11 && t < 13.5, zf = t >= 13.5;
          if (t > 7.2 && t < 11) { var u = ((t - 7.2) / 3.8) % 1; s += '<path d="M' + (sb + 8) + ',' + f1(dy0 + u * 18) + ' q-4,7 0,10 q4,-3 0,-10" fill="#2f8fd0"/>'; s += hinweis(620, 420 - 300, '✓ ≈ 1 Tropfen / Minute', F.gruen); }
          if (zl) { for (i = 0; i < 6; i++) { u = (t * 2 + i / 6) % 1; s += '<path d="M' + (sb + 4 + (i % 3) * 5) + ',' + f1(dy0 + u * 18) + ' q-4,7 0,10 q4,-3 0,-10" fill="#2f8fd0"/>'; } s += hinweis(620, 120, '✗ zu locker: Wasser läuft ein', F.rot); }
          if (zf) { s += '<circle cx="' + (sb + 6) + '" cy="' + f1(wy(sb)) + '" r="' + f1(26 + Math.sin(t * 8) * 3) + '" fill="' + F.rot + '" opacity=".28"/>'; s += hinweis(620, 120, '✗ zu fest: läuft heiß', F.rot); }
          return s;
        }
      })]
    };
  });

  /* ================================================================== */
  /*  B.5.3  Propeller & Radeffekt                                        */
  /* ================================================================== */
  function propVonAchtern(x, y, r, a, farbe) {
    var s = '<g transform="translate(' + x + ',' + y + ') rotate(' + f1(a) + ')">';
    for (var i = 0; i < 3; i++) s += '<path d="M0,0 C' + f1(r * .5) + ',' + f1(-r * .25) + ' ' + f1(r * .45) + ',' + f1(-r * .95) + ' 0,' + f1(-r) + ' C' + f1(-r * .3) + ',' + f1(-r * .8) + ' ' + f1(-r * .2) + ',' + f1(-r * .3) + ' 0,0 Z" fill="' + (farbe || '#c9a24d') + '" stroke="#6d5418" stroke-width="1.6" transform="rotate(' + (i * 120) + ')"/>';
    return s + '<circle r="' + f1(r * .16) + '" fill="#b08d3c" stroke="#6d5418" stroke-width="1.6"/></g>';
  }
  S.szene('propeller', function () {
    function shot(rechts) {
      var rs = rechts ? 1 : -1;
      return S.einstellung({
        dur: 10,
        steps: rechts ? [
          { t: 0, titel: 'Rechtsgängige Schraube: voraus im Uhrzeigersinn', text: 'Die Drehrichtung wird von achtern betrachtet. Voraus ist der Radeffekt gering.' },
          { t: 4, titel: 'Rückwärts: Drehung gegen den Uhrzeigersinn', text: 'Der Radeffekt versetzt das Heck nach Backbord – rückwärts ist er am stärksten.' }
        ] : [
          { t: 0, titel: 'Linksgängige Schraube: voraus gegen den Uhrzeigersinn', text: 'Genau umgekehrt wie bei der rechtsgängigen Schraube.' },
          { t: 4, titel: 'Rückwärts: Heck geht nach Steuerbord', text: 'Der Radeffekt ist umso stärker, je größer und langsamer drehend die Schraube ist.' }
        ],
        render: function (t) {
          var zur = t >= 4, rot = zur ? -rs * (t - 4) * 400 : rs * t * 400;
          var s = S.wasser(800, 460, t, null);
          s += '<rect x="30" y="70" width="300" height="330" rx="16" fill="rgba(255,255,255,.75)" stroke="#b8c4cc"/>';
          s += L(180, 100, 'Schraube von achtern gesehen', 'sx-lbl-c');
          s += propVonAchtern(180, 240, 100, rot);
          var cw = rs * (zur ? -1 : 1) > 0;
          s += S.bogenPfeil(180, 240, 124, cw ? 20 : -20, cw ? 80 : -80, 'rot') + L(180, 386, zur ? 'rückwärts' : 'voraus', 'sx-lbl-c sx-lbl-gross');
          // Draufsicht
          var u = ez(ab(t, 4.3, 9.6)), h = zur ? -rs * 0 : 0;
          var st = { x: 580, y: 240, h: 0, k: 2.1, ohneSegel: true, t: t, gang: zur ? 'zurueck' : 'voraus' };
          if (zur) { st.h = rs * 38 * u; st.y = 200 + 90 * u; st.x = 580 - rs * 30 * u; }
          else { st.y = 250 - ez(ab(t, .3, 3.8)) * 50; }
          s += S.zeichneBoot(st);
          if (zur && u > .1) { var hk = S.local2world(st, [0, 30 * st.k]); s += S.pfeil(hk[0], hk[1] + 14, hk[0] - rs * 60, hk[1] + 14, 'rot') + L(hk[0] - rs * 40, hk[1] + 44, rechts ? 'Heck nach Backbord' : 'Heck nach Steuerbord', 'sx-lbl-c sx-lbl-rot'); }
          s += L(580, 440, rechts ? 'rechtsgängige Schraube' : 'linksgängige Schraube', 'sx-lbl-c sx-lbl-gross');
          return s;
        }
      });
    }
    return { titel: 'Propeller & Radeffekt', shots: [shot(true), shot(false)] };
  });

  /* ================================================================== */
  /*  B.7.2  Be- & Entlüftung des Motorraums                              */
  /* ================================================================== */
  S.szene('lueftung', function () {
    var k = 2.7, cx = 480, wl = 300;
    function w(x, y) { return [cx + x * k, wl + y * k]; }
    return {
      titel: 'Be- & Entlüftung', shots: [S.einstellung({
        dur: 15,
        steps: [
          { t: 0, titel: 'Der Motor braucht viel Luft', text: 'Frische Verbrennungsluft strömt über die Lüftungsöffnungen in den Motorraum.' },
          { t: 3.2, titel: 'Warme Luft muss hinaus', text: 'Die Entlüftung führt die Wärme ab – sonst entsteht ein Hitzestau.' },
          { t: 6.8, titel: 'Öffnungen nie blockieren', text: 'Verstopfte oder zugestellte Lüfter: Die Leistung sinkt, der Motorraum überhitzt.' },
          { t: 10.6, titel: 'Benzin-Innenborder: vor dem Start entlüften', text: 'Benzindämpfe sind schwerer als Luft und sammeln sich unten – vor dem Start mit einem funkengeschützten Ventilator absaugen.' }
        ],
        render: function (t) {
          var zu = t >= 6.8 && t < 10.6, benzin = t >= 10.6;
          var s = see(800, 460, wl, t, { amp: 2, lam: 120, sp: 16 });
          s += S.seitenBoot(cx, wl, k, { segel: false }) + seeVorne(800, 460, wl, t, { amp: 2, lam: 120, sp: 16 });
          // Motorraum (Schnitt)
          var a = w(-66, -17), b = w(-12, 12);
          s += '<rect x="' + f1(a[0]) + '" y="' + f1(a[1]) + '" width="' + f1(b[0] - a[0]) + '" height="' + f1(b[1] - a[1]) + '" rx="8" fill="' + (zu ? '#f6d2c8' : '#f6f1e6') + '" stroke="#8796a0" stroke-width="2"/>';
          var m = w(-52, -10); s += '<rect x="' + f1(m[0]) + '" y="' + f1(m[1]) + '" width="' + f1(30 * k) + '" height="' + f1(16 * k) + '" rx="8" fill="#56656f"/>' + L(m[0] + 15 * k, m[1] + 8 * k + 4, 'Motor', 'sx-lbl-c sx-lbl-hell');
          // Lüfter: Zuluft achtern unten, Abluft oben
          var zl = w(-64, -14), al = w(-18, -30);
          s += '<rect x="' + f1(zl[0] - 10) + '" y="' + f1(zl[1] - 8) + '" width="20" height="16" rx="3" fill="#dfe5e9" stroke="#3d4b55"/>';
          s += '<path d="M' + f1(al[0] - 12) + ',' + f1(al[1] + 8) + ' L' + f1(al[0] - 12) + ',' + f1(al[1] - 10) + ' Q' + f1(al[0]) + ',' + f1(al[1] - 24) + ' ' + f1(al[0] + 14) + ',' + f1(al[1] - 12) + ' L' + f1(al[0] + 14) + ',' + f1(al[1] - 4) + ' Q' + f1(al[0] + 2) + ',' + f1(al[1] - 12) + ' ' + f1(al[0] + 4) + ',' + f1(al[1] + 8) + ' Z" fill="#dfe5e9" stroke="#3d4b55"/>';
          if (zu) s += '<rect x="' + f1(zl[0] - 18) + '" y="' + f1(zl[1] - 20) + '" width="34" height="34" rx="6" fill="#8a6d4a"/><rect x="' + f1(al[0] - 20) + '" y="' + f1(al[1] - 20) + '" width="38" height="30" rx="6" fill="#8a6d4a" opacity=".95"/>' + L(zl[0], zl[1] - 26, 'zugestellt', 'sx-lbl-c sx-lbl-rot');
          // Strömung
          if (!zu && !benzin) {
            for (var i = 0; i < 6; i++) {
              var u = (t * .5 + i / 6) % 1;
              var p = u < .5 ? [lerp(zl[0], m[0] + 10, u * 2), lerp(zl[1], b[1] - 10, u * 2)] : [lerp(m[0] + 10, al[0], (u - .5) * 2), lerp(b[1] - 10, al[1] - 16, (u - .5) * 2)];
              var warm = u > .5;
              s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="5" fill="' + (warm ? '#f3712b' : F.accent) + '" opacity=".9"/>';
            }
            s += L(zl[0] - 40, zl[1] + 36, 'Frischluft', 'sx-lbl-c') + L(al[0] + 50, al[1] - 30, 'warme Luft', 'sx-lbl-c');
          }
          if (zu) { s += '<circle cx="' + f1(m[0] + 15 * k) + '" cy="' + f1(m[1] + 8 * k) + '" r="' + f1(60 + Math.sin(t * 6) * 6) + '" fill="' + F.rot + '" opacity=".2"/>'; s += hinweis(210, 420, '✗ Leistung sinkt · Hitzestau', F.rot); }
          if (benzin) {
            var v = ez(ab(t, 12, 14.6));
            for (i = 0; i < 10; i++) { var x = a[0] + 12 + i * (b[0] - a[0] - 24) / 9, y = b[1] - 8 - Math.sin(t * 3 + i) * 3; s += '<ellipse cx="' + f1(x) + '" cy="' + f1(y) + '" rx="12" ry="4" fill="#7bc043" opacity="' + f1(.6 * (1 - v)) + '"/>'; }
            s += L((a[0] + b[0]) / 2, b[1] + 26, 'Benzindämpfe (schwerer als Luft)', 'sx-lbl-c');
            // Ventilator
            var fx = al[0] + 60, fy = al[1] - 50;
            s += '<circle cx="' + f1(fx) + '" cy="' + f1(fy) + '" r="18" fill="#fff" stroke="#3d4b55" stroke-width="2"/>';
            for (i = 0; i < 3; i++) { var aa = t * 12 + i * TAU / 3; s += linie(fx, fy, fx + Math.cos(aa) * 14, fy + Math.sin(aa) * 14, '#3d4b55', 4); }
            s += L(fx + 26, fy + 4, 'Ventilator (funkengeschützt)', '');
            s += hinweis(210, 420, v > .9 ? '✓ entlüftet – jetzt starten' : 'erst entlüften, dann starten', v > .9 ? F.gruen : F.navy);
          }
          return s;
        }
      })]
    };
  });

  /* ================================================================== */
  /*  C.3.3  Echolot                                                      */
  /* ================================================================== */
  S.szene('echolot', function () {
    var wl = 196, k = .55, cx = 320, PX = 20; // 20 px = 1 m
    function grund(x, t) { return 372 + Math.sin((x + t * 50) / 150) * 38 + Math.sin((x + t * 50) / 61) * 10; }
    return {
      titel: 'Das Echolot', shots: [S.einstellung({
        dur: 12,
        steps: [
          { t: 0, titel: 'Der Geber sendet einen Ultraschall-Impuls', text: 'Der Schwinger im Rumpfboden strahlt den Impuls senkrecht nach unten ab.' },
          { t: 1.2, titel: 'Der Meeresgrund wirft das Echo zurück', text: 'Das Echo läuft zum Geber zurück.' },
          { t: 2.4, titel: 'Aus der Laufzeit ergibt sich die Tiefe', text: 'Tiefe = Schallgeschwindigkeit im Wasser (rund 1.500 m/s) × Laufzeit ÷ 2.' },
          { t: 6.2, titel: 'Offset beachten', text: 'Das Lot misst ab dem Geber. Je nach Einstellung zeigt es die Tiefe unter dem Geber, unter dem Kiel oder ab der Wasseroberfläche.' }
        ],
        render: function (t) {
          var s = see(800, 460, wl, t, { amp: 2.5, lam: 90, sp: 40 });
          s += S.seitenBoot(cx, wl, k, {});
          var g = [cx + 30 * k, wl + 15 * k];
          s += seeVorne(800, 460, wl, t, { amp: 2.5, lam: 90, sp: 40 });
          var d = 'M0,460'; for (var x = 0; x <= 800; x += 10) d += ' L' + x + ',' + f1(grund(x, t)); s += '<path d="' + d + ' L800,460 Z" fill="url(#sxGrund)" stroke="#a88e5c" stroke-width="2"/>';
          s += '<rect x="' + f1(g[0] - 5) + '" y="' + f1(g[1] - 2) + '" width="10" height="6" rx="2" fill="' + F.gelb + '" stroke="#8a6d00"/>';
          // Impuls-Zyklus alle 3 s
          var zp = t % 3, gy = grund(g[0], t), tiefe = gy - g[1], lzt = Math.floor(t / 3), gyL = grund(g[0], lzt * 3);
          var down = clamp(zp / 1, 0, 1), up = clamp((zp - 1) / 1, 0, 1);
          if (zp < 1) { var yy = lerp(g[1], gy, down), w = 16 + down * 60; s += '<path d="M' + f1(g[0] - w) + ',' + f1(yy - 10) + ' Q' + f1(g[0]) + ',' + f1(yy + 8) + ' ' + f1(g[0] + w) + ',' + f1(yy - 10) + '" fill="none" stroke="' + F.accent + '" stroke-width="3"/>'; }
          else if (zp < 2) { yy = lerp(gy, g[1], up); w = 70 - up * 50; s += '<path d="M' + f1(g[0] - w) + ',' + f1(yy + 10) + ' Q' + f1(g[0]) + ',' + f1(yy - 8) + ' ' + f1(g[0] + w) + ',' + f1(yy + 10) + '" fill="none" stroke="' + F.orange + '" stroke-width="3"/>'; }
          s += '<line x1="' + f1(g[0]) + '" y1="' + f1(g[1] + 4) + '" x2="' + f1(g[0]) + '" y2="' + f1(gy) + '" stroke="' + F.navy + '" stroke-dasharray="3 5" opacity=".5"/>';
          if (zp < 1) s += L(g[0] + 90, lerp(g[1], gy, down), 'Impuls', 'sx-lbl-c'); else if (zp < 2) s += L(g[0] + 90, lerp(gy, g[1], up), 'Echo', 'sx-lbl-c');
          // Anzeige (aktualisiert nach Rückkehr des Echos)
          var shown = zp >= 2 ? tiefe : (grund(g[0], Math.max(0, lzt * 3 - 1)) - g[1]);
          if (t < 2) shown = null;
          var mt = shown == null ? '––' : (Math.round(shown / PX * 10) / 10).toFixed(1).replace('.', ',');
          s += '<g transform="translate(560,40)"><rect width="200" height="96" rx="14" fill="#10232e" stroke="#3d4b55" stroke-width="4"/><text x="16" y="24" style="font:700 10.5px Poppins,sans-serif;letter-spacing:.1em;fill:#7fb6d4">TIEFE UNTER GEBER</text><text x="16" y="70" style="font:700 40px Poppins,sans-serif;fill:#e9f4fa">' + mt + '</text><text x="150" y="70" style="font:600 18px Poppins,sans-serif;fill:#7fb6d4">m</text></g>';
          if (t > 6.2) { var kiel = wl + 70 * k; s += '<line x1="' + f1(cx - 30) + '" y1="' + f1(kiel) + '" x2="' + f1(cx + 70) + '" y2="' + f1(kiel) + '" stroke="' + F.rot + '" stroke-dasharray="5 4"/>' + L(cx - 36, kiel + 4, 'Kiel', 'sx-lbl-r sx-lbl-rot') + L(g[0] + 14, g[1] + 4, 'Geber', 'sx-lbl-rot'); }
          return s;
        }
      })]
    };
  });

  S.__technik = { see: see, welleY: welleY, hinweis: hinweis, achse: achse, ez: ez, ab: ab, L: L, linie: linie, kreis: kreis, poly: poly, anker: anker, faden: faden };

  if (document.readyState !== 'loading') start(); else document.addEventListener('DOMContentLoaded', start);
})();
