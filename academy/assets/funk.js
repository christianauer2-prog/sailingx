/* ==========================================================================
   SailingX-Academy – Funk-Trainer
   Theorieansicht + Simulator: Funkgerät, Bausteine, Protokoll, Auswertung.
   Fortschritt und Einstellungen liegen im Browser dieses Geräts.
   ========================================================================== */
(function () {
  'use strict';
  var D = window.FUNK; if (!D) return;
  var KEY = 'sx-funk-v1';

  /* ---------- Helfer ---------- */
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function $(id) { return document.getElementById(id); }
  function knopf(text, cls, fn) { var b = el('button', cls, text); b.type = 'button'; b.onclick = fn; return b; }
  function mischen(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function txt(o, sp) { return o == null ? '' : (typeof o === 'string' ? o : (o[sp] || o.de || '')); }
  function zeit(sek) { var m = Math.floor(sek / 60); return m ? m + ':' + (sek % 60 < 10 ? '0' : '') + (sek % 60) + ' Min.' : sek + ' Sek.'; }

  /* ---------- Speicher ---------- */
  var st = { sprache: 'de', ton: true, erg: {} };
  try { var roh = localStorage.getItem(KEY); if (roh) st = JSON.parse(roh); } catch (e) { }
  if (!st.erg) st.erg = {};
  function sichern() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } }

  /* ---------- Sprachausgabe ---------- */
  function sprich(text, lang) {
    if (!st.ton || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    try {
      var u = new SpeechSynthesisUtterance(String(text).replace(/–/g, ',').replace(/\s+/g, ' '));
      u.lang = lang === 'en' ? 'en-GB' : 'de-DE';
      u.rate = 0.95; u.pitch = 1;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) { }
  }
  function stillLegen() { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { } }

  /* ---------- Reiter ---------- */
  function reiter() {
    var ziel = (location.hash || '#simulator').replace('#', '');
    if (ziel !== 'theorie') ziel = 'simulator';
    ['simulator', 'theorie'].forEach(function (n) {
      $('panel-' + n).classList.toggle('on', n === ziel);
      var t = $('tab-' + n); t.setAttribute('aria-selected', n === ziel ? 'true' : 'false');
    });
  }
  window.addEventListener('hashchange', reiter);

  /* ======================= Eigene Grafiken =======================
     Alle Zeichnungen sind als SVG hier im Code entstanden – keine
     fremden Bilder, keine eingebetteten Dateien.
  ================================================================ */
  var F = {
    navy: '#173746', akzent: '#2289c6', wasser: '#cfe3ef', hell: '#e7f1f7',
    linie: '#9fb6c2', sand: '#efe7d8', land: '#dcd2bd',
    not: '#b53229', dring: '#d98014', sich: '#2289c6', ok: '#1d8a5a'
  };
  function svgRahmen(vb, inhalt) {
    return '<svg class="fk-svg" viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      + '<defs>'
      + '<marker id="fkPfeil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
      + '<path d="M0,0 L10,5 L0,10 z" fill="' + F.navy + '"/></marker>'
      + '</defs>' + inhalt + '</svg>';
  }
  function t(x, y, s, cls) { return '<text x="' + x + '" y="' + y + '" class="' + (cls || 'tx') + '">' + s + '</text>'; }
  function kasten(x, y, w, h, fuell, rand) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + fuell + '"'
      + (rand ? ' stroke="' + rand + '" stroke-width="1.5"' : '') + '/>';
  }
  function jacht(x, y, mast) {
    // Rumpf, Mast und Antenne – schematisch
    var s = '<path d="M' + (x - 22) + ',' + y + ' L' + (x + 22) + ',' + y + ' L' + (x + 14) + ',' + (y + 10) + ' L' + (x - 14) + ',' + (y + 10) + ' Z" fill="' + F.navy + '"/>';
    s += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y - mast) + '" stroke="' + F.navy + '" stroke-width="2.5"/>';
    s += '<path d="M' + (x + 2) + ',' + (y - mast + 8) + ' L' + (x + 2) + ',' + (y - 4) + ' L' + (x + 26) + ',' + (y - 4) + ' Z" fill="' + F.akzent + '" opacity=".35"/>';
    s += '<circle cx="' + x + '" cy="' + (y - mast) + '" r="4" fill="' + F.akzent + '"/>';
    return s;
  }
  function turm(x, y, h) {
    var s = '<path d="M' + (x - 14) + ',' + y + ' L' + (x - 5) + ',' + (y - h) + ' L' + (x + 5) + ',' + (y - h) + ' L' + (x + 14) + ',' + y + ' Z" fill="none" stroke="' + F.navy + '" stroke-width="2.5"/>';
    s += '<line x1="' + (x - 10) + '" y1="' + (y - h * 0.45) + '" x2="' + (x + 10) + '" y2="' + (y - h * 0.45) + '" stroke="' + F.navy + '" stroke-width="1.5"/>';
    s += '<circle cx="' + x + '" cy="' + (y - h - 6) + '" r="4.5" fill="' + F.akzent + '"/>';
    s += '<line x1="' + x + '" y1="' + (y - h) + '" x2="' + x + '" y2="' + (y - h - 6) + '" stroke="' + F.navy + '" stroke-width="2"/>';
    return s;
  }

  var GRAFIK = {

    /* Reichweite: nicht die Watt, die Antennenhöhe entscheidet */
    reichweite: function () {
      var s = '';
      s += '<path d="M0,210 Q310,150 620,210 L620,250 L0,250 Z" fill="' + F.wasser + '"/>';
      s += '<path d="M0,210 Q310,150 620,210" fill="none" stroke="' + F.akzent + '" stroke-width="2"/>';
      s += '<path d="M0,250 L0,215 Q30,208 60,206 L60,250 Z" fill="' + F.land + '"/>';
      s += '<path d="M560,250 L560,205 Q590,208 620,215 L620,250 Z" fill="' + F.land + '"/>';
      s += jacht(95, 196, 118);
      s += turm(520, 196, 120);
      s += '<line x1="95" y1="78" x2="520" y2="70" stroke="' + F.akzent + '" stroke-width="2" stroke-dasharray="7 5"/>';
      s += t(205, 60, 'Masttopp-Antenne, 25 W', 'tx b');
      s += t(205, 44, 'bis etwa 60 sm zur Küstenfunkstelle', 'tx sm');
      s += '<circle cx="118" cy="188" r="4" fill="' + F.dring + '"/>';
      s += '<line x1="122" y1="188" x2="330" y2="179" stroke="' + F.dring + '" stroke-width="2" stroke-dasharray="4 4"/>';
      s += '<line x1="330" y1="172" x2="330" y2="186" stroke="' + F.dring + '" stroke-width="2"/>';
      s += t(150, 152, 'Handfunke 5 W auf Augenhöhe', 'tx b');
      s += t(150, 167, 'nur wenige Seemeilen – der Horizont', 'tx sm');
      s += t(345, 182, 'Horizont', 'tx sm');
      s += t(470, 232, 'Küstenfunkstelle', 'tx sm');
      return svgRahmen('0 0 620 250', s);
    },

    /* Simplex und Duplex */
    simplex: function () {
      var s = '';
      s += t(14, 22, 'Simplex – eine Frequenz, abwechselnd', 'tx b');
      s += kasten(14, 34, 150, 52, F.hell, F.linie) + t(89, 65, 'Sailing X', 'tx mid');
      s += kasten(456, 34, 150, 52, F.hell, F.linie) + t(531, 65, 'Alberta', 'tx mid');
      s += '<line x1="176" y1="60" x2="444" y2="60" stroke="' + F.navy + '" stroke-width="2" marker-start="url(#fkPfeil)" marker-end="url(#fkPfeil)"/>';
      s += t(310, 50, 'eine Frequenz', 'tx mid sm');
      s += t(310, 80, 'Kanal 16, 06, 08, 13, 67, 72, 77', 'tx mid sm');

      s += t(14, 124, 'Duplex – zwei Frequenzen gleichzeitig', 'tx b');
      s += kasten(14, 136, 150, 72, F.hell, F.linie) + t(89, 178, 'Sailing X', 'tx mid');
      s += kasten(456, 136, 150, 72, F.hell, F.linie) + t(531, 168, 'Küstenfunk-', 'tx mid') + t(531, 186, 'stelle', 'tx mid');
      s += '<line x1="176" y1="158" x2="444" y2="158" stroke="' + F.akzent + '" stroke-width="2" marker-end="url(#fkPfeil)"/>';
      s += t(310, 150, 'Frequenz 1 – du sendest', 'tx mid sm');
      s += '<line x1="444" y1="190" x2="176" y2="190" stroke="' + F.ok + '" stroke-width="2" marker-end="url(#fkPfeil)"/>';
      s += t(310, 206, 'Frequenz 2 – du hörst', 'tx mid sm');
      s += t(310, 232, 'Zwei Yachten können auf einem Duplexkanal nicht miteinander sprechen.', 'tx mid sm');
      return svgRahmen('0 0 620 244', s);
    },

    /* Die drei Stufen */
    stufen: function () {
      var reihen = [
        ['MAYDAY', F.not, 'Not · unmittelbare Gefahr für Schiff oder Leben', 'Kanal 16 · der Schiffsführer ordnet an'],
        ['PAN PAN', F.dring, 'Dringlichkeit · Hilfe nötig, keine akute Gefahr', 'Kanal 16 · auch funkärztliche Beratung'],
        ['SÉCURITÉ', F.sich, 'Sicherheit · Warnung für die Schifffahrt', 'auf 16 ankündigen, auf Arbeitskanal durchgeben']
      ], s = '';
      s += '<line x1="18" y1="26" x2="18" y2="196" stroke="' + F.linie + '" stroke-width="2" marker-end="url(#fkPfeil)"/>';
      s += '<text x="12" y="112" class="tx sm" transform="rotate(-90 12 112)" text-anchor="middle">Vorrang</text>';
      reihen.forEach(function (r, i) {
        var y = 20 + i * 62;
        s += kasten(34, y, 150, 50, r[1], null);
        s += '<text x="109" y="' + (y + 31) + '" class="tx mid stufe">' + r[0] + '</text>';
        s += t(200, y + 22, r[2], 'tx b');
        s += t(200, y + 40, r[3], 'tx sm');
      });
      return svgRahmen('0 0 620 206', s);
    },

    /* DSC-Notalarm: vier Schritte */
    dscablauf: function () {
      var schritte = [
        ['Klappe auf, rote Taste halten', 'wenn Zeit bleibt: Art des Notfalls wählen'],
        ['Kanal 70 – der Datensatz geht raus', 'MMSI, Art des Rufs, Position vom GPS'],
        ['Die Leitstelle quittiert', 'andere Schiffe antworten per Sprechfunk'],
        ['Kanal 16 – MAYDAY sprechen', 'das Gerät schaltet selbst um']
      ], s = '', zeilen = schritte.map(function (sc) { return [umbruch(sc[0], 14), umbruch(sc[1], 17)]; });
      var hoch = 0;
      zeilen.forEach(function (z) { hoch = Math.max(hoch, 56 + z[0].length * 18 + 8 + z[1].length * 16); });
      schritte.forEach(function (sc, i) {
        var x = 10 + i * 152, z = zeilen[i];
        s += kasten(x, 30, 140, hoch, i === 0 ? '#f7e3e0' : F.hell, F.linie);
        s += '<circle cx="' + (x + 22) + '" cy="54" r="13" fill="' + (i === 0 ? F.not : F.navy) + '"/>';
        s += '<text x="' + (x + 22) + '" y="59" class="tx mid nr">' + (i + 1) + '</text>';
        z[0].forEach(function (zz, j) { s += t(x + 12, 88 + j * 18, zz, 'tx b'); });
        z[1].forEach(function (zz, j) { s += t(x + 12, 88 + z[0].length * 18 + 10 + j * 16, zz, 'tx sm'); });
        if (i < 3) s += '<line x1="' + (x + 142) + '" y1="' + (30 + hoch / 2) + '" x2="' + (x + 158) + '" y2="' + (30 + hoch / 2) + '" stroke="' + F.navy + '" stroke-width="2" marker-end="url(#fkPfeil)"/>';
      });
      return svgRahmen('0 0 620 ' + (hoch + 48), s);
    },

    /* Seegebiete A1 bis A4 */
    gmdss: function () {
      var g = [
        ['A1', '#cfe3ef', ['UKW mit DSC', 'rund 20–30 sm', 'unser Revier']],
        ['A2', '#b7d6e7', ['Grenzwelle', 'bis etwa 150 sm']],
        ['A3', '#93bcd4', ['Satellit', 'etwa 70° N bis 70° S']],
        ['A4', '#6f9cb8', ['Kurzwelle', 'Polargebiete']]
      ], s = '', x = 56;
      s += '<path d="M0,0 L56,0 Q44,110 56,230 L0,230 Z" fill="' + F.land + '"/>';
      g.forEach(function (b, i) {
        var w = i === 0 ? 120 : 148;
        s += '<rect x="' + x + '" y="0" width="' + w + '" height="230" fill="' + b[1] + '"/>';
        s += '<text x="' + (x + w / 2) + '" y="40" class="tx mid gross">' + b[0] + '</text>';
        b[2].forEach(function (z, j) { s += '<text x="' + (x + w / 2) + '" y="' + (66 + j * 17) + '" class="tx mid band">' + z + '</text>'; });
        x += w;
      });
      s += turm(28, 206, 86);
      s += jacht(118, 196, 54);
      s += t(14, 226, 'Küste', 'tx sm');
      return svgRahmen('0 0 620 230', s);
    },

    /* SART: Punkte, Bögen, Kreise – und das AIS-Symbol */
    sart: function () {
      var s = '', mitten = [[72, 'Punkte', 'weit entfernt'], [196, 'Bögen', 'näher dran'], [320, 'Kreise', 'sehr nah']];
      mitten.forEach(function (m, k) {
        var cx = m[0], cy = 92, r = 54;
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#11242d"/>';
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.55) + '" fill="none" stroke="#2f5566" stroke-width="1"/>';
        s += '<line x1="' + cx + '" y1="' + (cy - r) + '" x2="' + cx + '" y2="' + (cy + r) + '" stroke="#2f5566" stroke-width="1"/>';
        s += '<line x1="' + (cx - r) + '" y1="' + cy + '" x2="' + (cx + r) + '" y2="' + cy + '" stroke="#2f5566" stroke-width="1"/>';
        var i, a = -0.9;
        for (i = 0; i < 12; i++) {
          var d = 8 + i * 4.0;
          var px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d;
          if (k === 0) s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="2.4" fill="#58d68d"/>';
          else if (k === 1) s += '<path d="' + bogen(cx, cy, d, a, 0.5) + '" fill="none" stroke="#58d68d" stroke-width="2.2"/>';
          else s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + d.toFixed(1) + '" fill="none" stroke="#58d68d" stroke-width="1.4" opacity="' + (0.35 + i * 0.05).toFixed(2) + '"/>';
        }
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="#f5f7f8"/>';
        s += '<text x="' + cx + '" y="172" class="tx mid b">' + m[1] + '</text>';
        s += '<text x="' + cx + '" y="188" class="tx mid sm">' + m[2] + '</text>';
      });
      s += t(72, 24, 'Radar-SART auf dem Radarschirm', 'tx b');
      s += kasten(400, 38, 208, 108, '#e9f3ea', F.linie);
      var i2;
      for (i2 = 1; i2 < 4; i2++) s += '<line x1="' + (400 + i2 * 52) + '" y1="38" x2="' + (400 + i2 * 52) + '" y2="146" stroke="#cfe0d2" stroke-width="1"/>';
      for (i2 = 1; i2 < 3; i2++) s += '<line x1="400" y1="' + (38 + i2 * 36) + '" x2="608" y2="' + (38 + i2 * 36) + '" stroke="#cfe0d2" stroke-width="1"/>';
      s += '<circle cx="504" cy="92" r="16" fill="none" stroke="' + F.not + '" stroke-width="3"/>';
      s += '<line x1="493" y1="81" x2="515" y2="103" stroke="' + F.not + '" stroke-width="3"/>';
      s += '<line x1="515" y1="81" x2="493" y2="103" stroke="' + F.not + '" stroke-width="3"/>';
      s += t(504, 24, 'AIS-SART auf dem Plotter', 'tx mid b');
      s += t(504, 172, 'Symbol mit echter Position', 'tx mid b');
      s += t(504, 188, 'Kurs und Abstand ablesbar', 'tx mid sm');
      return svgRahmen('0 0 620 200', s);
    }
  };
  function bogen(cx, cy, r, mitte, breite) {
    var a1 = mitte - breite / 2, a2 = mitte + breite / 2;
    return 'M' + (cx + Math.cos(a1) * r).toFixed(1) + ',' + (cy + Math.sin(a1) * r).toFixed(1)
      + ' A' + r.toFixed(1) + ',' + r.toFixed(1) + ' 0 0 1 '
      + (cx + Math.cos(a2) * r).toFixed(1) + ',' + (cy + Math.sin(a2) * r).toFixed(1);
  }
  function umbruch(s, n) {
    var w = String(s).split(' '), z = [], akt = '';
    w.forEach(function (x) {
      if ((akt + ' ' + x).trim().length > n) { if (akt) z.push(akt); akt = x; }
      else akt = (akt ? akt + ' ' : '') + x;
    });
    if (akt) z.push(akt);
    return z;
  }

  /* ======================= Theorie ======================= */
  function theorieZeichnen() {
    var box = $('fkTheorie'); box.innerHTML = '';
    D.THEORIE.forEach(function (t) {
      var k = el('section', 'fk-th');
      var h = el('h2'); h.appendChild(el('span', 'ic', t.icon)); h.appendChild(el('span', null, t.titel));
      k.appendChild(h);
      if (t.kurz) k.appendChild(el('p', 'kurz', t.kurz));
      t.bloecke.forEach(function (b) {
        if (b.h) k.appendChild(el('h3', null, b.h));
        if (b.ul) { var u = el('ul'); b.ul.forEach(function (x) { var li = el('li'); li.innerHTML = x; u.appendChild(li); }); k.appendChild(u); }
        if (b.ol) { var o = el('ol'); b.ol.forEach(function (x) { var li = el('li'); li.innerHTML = x; o.appendChild(li); }); k.appendChild(o); }
        if (b.tabelle) {
          var tb = el('table');
          b.tabelle.forEach(function (r) { var tr = el('tr'); r.forEach(function (c) { var td = el('td'); td.innerHTML = c; tr.appendChild(td); }); tb.appendChild(tr); });
          k.appendChild(tb);
        }
        if (b.beispiel) {
          var bs = el('div', 'bsp');
          b.beispiel.forEach(function (r) { var d = el('div'); d.appendChild(el('b', null, r[0])); d.appendChild(el('span', null, r[1])); bs.appendChild(d); });
          k.appendChild(bs);
        }
        if (b.abc) {
          var g = el('div', 'fk-abc');
          D.ABC.forEach(function (p) {
            var s = el('span');
            s.appendChild(el('b', null, p[0]));
            s.appendChild(el('span', null, p[1]));
            if (p[2]) s.appendChild(el('i', null, p[2]));
            g.appendChild(s);
          });
          k.appendChild(g);
        }
        if (b.grafik && GRAFIK[b.grafik]) {
          var fig = el('figure', 'fk-grafik');
          var huelle = el('div', 'fk-svg-box');
          huelle.innerHTML = GRAFIK[b.grafik]();
          fig.appendChild(huelle);
          if (b.legende) fig.appendChild(el('figcaption', null, b.legende));
          k.appendChild(fig);
        } else if (b.legende && !b.grafik) {
          k.appendChild(el('p', 'fk-legende', b.legende));
        }
      });
      if (t.uebung) {
        var r = el('div', 'fk-knoepfe');
        r.appendChild(knopf('Dazu üben →', 'b b-primary sm', function () { location.hash = 'simulator'; reiter(); uebungStarten(t.uebung); }));
        k.appendChild(r);
      }
      box.appendChild(k);
    });
  }

  /* ======================= Vokabel-Einheit =======================
     Die Schritte werden bei jedem Start neu zusammengestellt.
  ================================================================ */
  function vokabelSchritte(anzahl) {
    var alle = D.VOKABELN || [];
    if (!alle.length) return [];
    return mischen(alle).slice(0, anzahl).map(function (v) {
      var gleiche = alle.filter(function (x) { return x !== v && x.gruppe === v.gruppe; });
      var ablenker = mischen(gleiche).slice(0, 3);
      while (ablenker.length < 3) {
        var z = alle[Math.floor(Math.random() * alle.length)];
        if (z !== v && ablenker.indexOf(z) < 0) ablenker.push(z);
      }
      return {
        typ: 'wahl',
        frage: {
          de: '„' + v.de + '“ – wie sagst du das auf Englisch?',
          en: '“' + v.en + '” – what does that mean in German?'
        },
        optionen: [{ de: v.en, en: v.de, ok: true }].concat(ablenker.map(function (x) {
          return { de: x.en, en: x.de };
        })),
        erklaerung: {
          de: '<b>' + v.en + '</b> = ' + v.de + ' · ' + v.gruppe,
          en: '<b>' + v.de + '</b> = ' + v.en + ' · ' + v.gruppe
        }
      };
    });
  }
  function generatorenFuellen(nurId) {
    D.EINHEITEN.forEach(function (e) {
      if (e.generator === 'vokabel' && (!nurId || e.id === nurId)) e.schritte = vokabelSchritte(e.anzahl || 8);
    });
  }

  /* ======================= Einheitenliste ======================= */
  function ergebnis(id) { return st.erg[id + '|' + st.sprache]; }
  function listeZeichnen() {
    var box = $('fkEinheiten'); box.innerHTML = '';
    var gruppen = [], nach = {};
    D.EINHEITEN.forEach(function (e) { if (!nach[e.gruppe]) { nach[e.gruppe] = []; gruppen.push(e.gruppe); } nach[e.gruppe].push(e); });
    var fertig = 0;
    gruppen.forEach(function (g) {
      box.appendChild(el('h2', 'fk-gruppe', g));
      var grid = el('div', 'fk-karten');
      nach[g].forEach(function (e) {
        var erg = ergebnis(e.id); if (erg) fertig++;
        var b = el('button', 'fk-karte' + (erg ? ' fertig' : '')); b.type = 'button';
        b.appendChild(el('span', 'ic', erg ? '✓' : e.icon));
        var tx = el('span');
        tx.appendChild(el('b', null, txt(e.titel, st.sprache)));
        tx.appendChild(el('small', null, txt(e.lage, st.sprache)));
        var meta = el('small', null, e.dauer + ' · ' + e.schritte.length + ' Schritte');
        tx.appendChild(meta);
        if (erg) tx.appendChild(el('span', 'erg', erg.fehler === 0 ? 'ohne Fehler · ' + zeit(erg.sek) : erg.fehler + (erg.fehler === 1 ? ' Fehler' : ' Fehler') + ' · ' + zeit(erg.sek)));
        b.appendChild(tx);
        b.onclick = function () { uebungStarten(e.id); };
        grid.appendChild(b);
      });
      box.appendChild(grid);
    });
    $('fkFortschritt').textContent = fertig + ' von ' + D.EINHEITEN.length + ' Einheiten geschafft' + (st.sprache === 'en' ? ' (englisch)' : '');
  }

  /* ======================= Funkgerät ======================= */
  var KANAELE = [6, 8, 9, 10, 12, 13, 16, 24, 26, 67, 68, 69, 70, 71, 72, 73, 74, 77];
  var geraet = { kanal: 16, aktiv: false };
  function kanalZeigen() {
    $('fgKanal').textContent = geraet.kanal < 10 ? '0' + geraet.kanal : String(geraet.kanal);
    $('fgStatus').textContent = geraet.kanal === 70 ? 'DSC · nur Daten' : (geraet.kanal === 16 ? 'ANRUF & NOT' : (geraet.kanal === 24 || geraet.kanal === 26 ? 'KÜSTENFUNKSTELLE' : 'ARBEITSKANAL'));
    $('fgLeistung').textContent = geraet.kanal === 16 ? '25 W' : '1 W / 25 W';
  }
  function kanalSetzen(k) { geraet.kanal = k; kanalZeigen(); }
  function kanalSchritt(d) {
    var i = KANAELE.indexOf(geraet.kanal);
    if (i < 0) i = KANAELE.indexOf(16);
    i = (i + d + KANAELE.length) % KANAELE.length;
    kanalSetzen(KANAELE[i]);
  }
  $('chAuf').onclick = function () { kanalSchritt(1); };
  $('chAb').onclick = function () { kanalSchritt(-1); };
  $('ch16').onclick = function () { kanalSetzen(16); };

  function lautsprecher(von, text) {
    var ls = $('fgLautsprecher'); ls.innerHTML = '';
    if (!text) { ls.appendChild(el('span', 'fg-ls-leer', 'Lautsprecher')); ls.classList.remove('aktiv'); return; }
    ls.appendChild(el('b', null, von));
    ls.appendChild(el('span', null, text));
    ls.classList.add('aktiv');
  }

  /* ======================= Übung ======================= */
  var U = null; // {einheit, i, fehler, start, sprache}

  function uebungStarten(id, sprache) {
    var e = null;
    D.EINHEITEN.forEach(function (x) { if (x.id === id) e = x; });
    if (!e) return;
    if (e.generator) generatorenFuellen(e.id);
    if (sprache) { st.sprache = sprache; sichern(); spracheZeigen(); }
    U = { e: e, i: 0, fehler: 0, start: Date.now(), sp: st.sprache };
    $('fk-liste').hidden = true; $('fk-uebung').hidden = false;
    $('uebungTitel').textContent = txt(e.titel, U.sp);
    $('uebungLage').textContent = txt(e.lage, U.sp);
    $('fgSchiff').textContent = D.SCHIFF.name;
    $('fgDaten').textContent = D.SCHIFF.rufzeichen + ' · MMSI ' + D.SCHIFF.mmsi;
    $('fkProtokoll').innerHTML = '';
    lautsprecher(null, null);
    dscZu();
    kanalSetzen(16);
    window.scrollTo(0, 0);
    schrittZeigen();
  }
  function uebungBeenden() {
    stillLegen(); U = null;
    $('fk-uebung').hidden = true; $('fk-liste').hidden = false;
    listeZeichnen(); window.scrollTo(0, 0);
  }
  $('uebungZurueck').onclick = uebungBeenden;

  function protokoll(art, von, text) {
    var li = el('li', art);
    if (von) li.appendChild(el('b', null, von));
    li.appendChild(el('span', null, text));
    $('fkProtokoll').appendChild(li);
    li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function schrittZeigen() {
    var e = U.e, s = e.schritte[U.i], box = $('fkAufgabe');
    box.innerHTML = '';
    if (!s) { auswertung(); return; }
    box.appendChild(el('p', 'fk-schrittzahl', 'Schritt ' + (U.i + 1) + ' von ' + e.schritte.length));
    if (s.typ === 'kanal' && s.start != null) kanalSetzen(s.start);
    else if (s.kanal != null && s.typ !== 'kanal') kanalSetzen(s.kanal);

    if (s.typ === 'funkspruch') return funkspruch(s, box);
    if (s.typ === 'wahl') return wahl(s, box);
    if (s.typ === 'kanal') return kanalAufgabe(s, box);
    if (s.typ === 'dsc') return dscAufgabe(s, box);
    if (s.typ === 'info') return infoAufgabe(s, box);
  }
  function weiter() { U.i++; schrittZeigen(); }
  function fehler() { U.fehler++; }

  function rueckmeldung(box, text, warn) {
    var alt = box.querySelector('.fk-rueck'); if (alt) alt.parentNode.removeChild(alt);
    var r = el('div', 'fk-rueck' + (warn ? ' warn' : ''));
    r.innerHTML = text;
    box.appendChild(r);
    return r;
  }

  /* --- Funkspruch zusammensetzen --- */
  function funkspruch(s, box) {
    var sp = U.sp, pos = 0;
    box.appendChild(el('p', 'fk-frage', txt(s.hinweis, sp)));
    var zaehler = el('p', 'fk-zaehler', (sp === 'en' ? 'Part 1 of ' : 'Baustein 1 von ') + s.teile.length);
    box.appendChild(zaehler);
    var zeile = el('div', 'fk-spruch');
    zeile.setAttribute('data-leer', sp === 'en' ? 'Tap the parts in the right order …' : 'Bausteine in der richtigen Reihenfolge antippen …');
    box.appendChild(zeile);
    var chips = el('div', 'fk-chips');
    box.appendChild(chips);

    var alle = mischen(s.teile.map(function (t, k) { return { t: t, k: k }; }).concat((s.stoerer || []).map(function (t) { return { t: t, k: -1 }; })));
    var knoepfeNachIndex = {};
    alle.forEach(function (o) {
      var b = el('button', null, txt(o.t, sp)); b.type = 'button';
      if (o.k >= 0) knoepfeNachIndex[o.k] = b;
      b.onclick = function () {
        if (o.k === pos) {
          b.disabled = true;
          zeile.appendChild(el('span', null, txt(o.t, sp)));
          pos++;
          zaehler.textContent = pos < s.teile.length
            ? (sp === 'en' ? 'Part ' : 'Baustein ') + (pos + 1) + (sp === 'en' ? ' of ' : ' von ') + s.teile.length
            : (sp === 'en' ? 'Call complete – read it once more, then send.' : 'Spruch vollständig – noch einmal lesen, dann senden.');
          var r = box.querySelector('.fk-rueck'); if (r) r.parentNode.removeChild(r);
          if (pos === s.teile.length) senden(s, box, chips);
        } else {
          fehler();
          b.classList.add('falsch');
          setTimeout(function () { b.classList.remove('falsch'); }, 300);
          var warum = o.k < 0 ? txt(o.t.warum, sp) : '';
          if (!warum) {
            warum = o.k >= 0
              ? (sp === 'en' ? 'Right phrase, wrong moment. The next part is something else.' : 'Richtiger Baustein, falscher Zeitpunkt – es fehlt noch etwas davor.')
              : (sp === 'en' ? 'That phrase does not belong in this call.' : 'Dieser Baustein gehört nicht in diesen Spruch.');
          }
          rueckmeldung(box, '<b>' + (sp === 'en' ? 'Not yet.' : 'Noch nicht.') + '</b> ' + warum, true);
        }
      };
      chips.appendChild(b);
    });
  }
  function senden(s, box, chips) {
    var sp = U.sp;
    Array.prototype.forEach.call(chips.children, function (b) { b.disabled = true; });
    var voll = s.teile.map(function (t) { return txt(t, sp); }).join(' – ');
    var r = el('div', 'fk-knoepfe');
    r.appendChild(knopf(sp === 'en' ? '📡 Press the PTT and send' : '📡 Sprechtaste drücken und senden', 'b b-primary', function () {
      r.parentNode.removeChild(r);
      protokoll('ich', D.SCHIFF.name + ' · Kanal ' + geraet.kanal, voll);
      sprich(voll, sp);
      var wartet = s.antwort ? 1400 : 500;
      var hinw = el('p', 'fk-schrittzahl', sp === 'en' ? 'transmitting …' : 'sendet …');
      box.appendChild(hinw);
      setTimeout(function () {
        hinw.parentNode && hinw.parentNode.removeChild(hinw);
        if (s.antwort) {
          var a = txt(s.antwort, sp), von = a.split(/hier ist |this is /i)[1];
          von = von ? von.split(/[.,]/)[0].trim() : (sp === 'en' ? 'Station' : 'Gegenstelle');
          protokoll('fremd', von + ' · Kanal ' + geraet.kanal, a);
          lautsprecher(von, a);
          sprich(a, sp);
          box.appendChild(antwortKnopf(a));
        } else {
          weiter();
        }
      }, wartet);
    }));
    box.appendChild(r);
  }
  function antwortKnopf(wiederholen) {
    var r = el('div', 'fk-knoepfe');
    r.appendChild(knopf(U.sp === 'en' ? 'Continue' : 'Weiter', 'b b-primary', weiter));
    if (wiederholen) r.appendChild(knopf(U.sp === 'en' ? '🔁 Play again' : '🔁 Noch einmal hören', 'b b-ghost', function () { sprich(wiederholen, U.sp); }));
    return r;
  }

  /* --- Entscheidungsfrage --- */
  function wahl(s, box) {
    var sp = U.sp;
    box.appendChild(el('p', 'fk-frage', txt(s.frage, sp)));
    var liste = el('div', 'fk-optionen');
    box.appendChild(liste);
    mischen(s.optionen).forEach(function (o) {
      var b = el('button', null, txt(o, sp)); b.type = 'button';
      b.onclick = function () {
        if (o.ok) {
          b.classList.add('richtig');
          Array.prototype.forEach.call(liste.children, function (x) { x.disabled = true; });
          if (s.geraet === 'dsc') {
            $('fgStatus').textContent = 'DSC-MENÜ';
            lautsprecher(sp === 'en' ? 'DSC menu' : 'DSC-Menü', txt(o, sp));
            protokoll('hinweis', null, (sp === 'en' ? 'DSC menu: ' : 'DSC-Menü: ') + txt(o, sp));
          }
          rueckmeldung(box, '<b>' + (sp === 'en' ? 'Correct.' : 'Richtig.') + '</b> ' + txt(s.erklaerung, sp));
          box.appendChild(antwortKnopf());
        } else {
          fehler(); b.classList.add('falsch'); b.disabled = true;
          rueckmeldung(box, '<b>' + (sp === 'en' ? 'Not that one.' : 'Das nicht.') + '</b> ' + (sp === 'en' ? 'Try again.' : 'Versuch es noch einmal.'), true);
        }
      };
      liste.appendChild(b);
    });
  }

  /* --- Kanal einstellen --- */
  function kanalAufgabe(s, box) {
    var sp = U.sp;
    box.appendChild(el('p', 'fk-frage', txt(s.hinweis, sp)));
    box.appendChild(el('p', 'fk-schrittzahl', sp === 'en' ? 'Use ▲ ▼ or the 16 key on the set, then confirm.' : 'Mit ▲ ▼ oder der Taste 16 am Gerät einstellen, dann bestätigen.'));
    var r = el('div', 'fk-knoepfe');
    r.appendChild(knopf(sp === 'en' ? '✓ Confirm channel' : '✓ Kanal bestätigen', 'b b-primary', function () {
      if (geraet.kanal === s.ziel) {
        protokoll('hinweis', null, (sp === 'en' ? 'Set to channel ' : 'Gerät auf Kanal ') + s.ziel);
        if (s.erklaerung) { rueckmeldung(box, '<b>' + (sp === 'en' ? 'Correct.' : 'Richtig.') + '</b> ' + txt(s.erklaerung, sp)); r.parentNode.removeChild(r); box.appendChild(antwortKnopf()); }
        else weiter();
      } else {
        fehler();
        rueckmeldung(box, '<b>' + (sp === 'en' ? 'Not that channel.' : 'Nicht dieser Kanal.') + '</b> ' + (sp === 'en' ? 'Have another look at the task.' : 'Schau noch einmal auf die Aufgabe.'), true);
      }
    }));
    box.appendChild(r);
  }

  /* --- DSC-Notalarm --- */
  function dscZu() { $('fgKlappe').hidden = false; $('fgRot').hidden = true; $('fgRotRing').style.width = '0'; }
  function dscAufgabe(s, box) {
    var sp = U.sp, halten = null, fertig = false;
    box.appendChild(el('p', 'fk-frage', txt(s.hinweis, sp)));
    box.appendChild(el('p', 'fk-schrittzahl', sp === 'en' ? 'Open the red cover on the set, then press and hold.' : 'Am Gerät die rote Klappe öffnen, dann drücken und halten.'));
    dscZu();
    $('fgKlappe').onclick = function () { $('fgKlappe').hidden = true; $('fgRot').hidden = false; };
    var rot = $('fgRot'), ring = $('fgRotRing'), t0 = 0, timer = null;
    function los() {
      if (fertig) return;
      t0 = Date.now();
      timer = setInterval(function () {
        var p = Math.min(1, (Date.now() - t0) / 3000);
        ring.style.width = (p * 100) + '%';
        if (p >= 1) { stop(true); }
      }, 60);
    }
    function stop(ok) {
      clearInterval(timer); timer = null;
      if (ok) {
        fertig = true; ring.style.width = '100%';
        protokoll('hinweis', null, sp === 'en' ? 'DSC distress alert sent on channel 70 – MMSI and position transmitted' : 'DSC-Notalarm auf Kanal 70 gesendet – MMSI und Position übertragen');
        kanalSetzen(16);
        rueckmeldung(box, '<b>' + (sp === 'en' ? 'Alert sent.' : 'Alarm abgesetzt.') + '</b> ' + txt(s.erklaerung, sp));
        box.appendChild(antwortKnopf());
      } else if (!fertig) {
        ring.style.width = '0';
        fehler();
        rueckmeldung(box, '<b>' + (sp === 'en' ? 'Too short.' : 'Zu kurz.') + '</b> ' + (sp === 'en' ? 'Keep holding until the set confirms.' : 'Weiterhalten, bis das Gerät quittiert – mehrere Sekunden.'), true);
      }
    }
    rot.onmousedown = los; rot.ontouchstart = function (ev) { ev.preventDefault(); los(); };
    rot.onmouseup = function () { stop(false); }; rot.onmouseleave = function () { if (timer) stop(false); };
    rot.ontouchend = function () { stop(false); };
  }

  /* --- Hinweis --- */
  function infoAufgabe(s, box) {
    var sp = U.sp;
    if (s.text) box.appendChild(el('p', 'fk-frage', txt(s.text, sp)));
    if (s.kanal != null) kanalSetzen(s.kanal);
    if (s.durchsage) {
      var von = txt(s.durchsage.von, sp), was = txt(s.durchsage.text, sp);
      protokoll('fremd', von + ' · Kanal ' + geraet.kanal, was);
      lautsprecher(von, was);
      sprich(was, sp);
      box.appendChild(antwortKnopf(was));
      return;
    }
    box.appendChild(antwortKnopf());
  }

  /* --- Auswertung --- */
  function auswertung() {
    var sp = U.sp, e = U.e, sek = Math.max(1, Math.round((Date.now() - U.start) / 1000));
    var key = e.id + '|' + sp, alt = st.erg[key];
    if (!alt || U.fehler < alt.fehler || (U.fehler === alt.fehler && sek < alt.sek)) st.erg[key] = { fehler: U.fehler, sek: sek, datum: new Date().toISOString().slice(0, 10) };
    sichern();
    var box = $('fkAufgabe'); box.innerHTML = '';
    var erg = el('div', 'fk-ergebnis');
    erg.appendChild(el('div', 'gross', U.fehler === 0 ? (sp === 'en' ? 'Clean run' : 'Ohne Fehler') : U.fehler + (sp === 'en' ? ' slips' : ' Fehler')));
    erg.appendChild(el('div', 'zeile', (sp === 'en' ? 'Unit completed in ' : 'Einheit geschafft in ') + zeit(sek)));
    var m = el('div', 'fk-merke');
    m.innerHTML = '<b>' + (sp === 'en' ? 'Remember: ' : 'Merke: ') + '</b>' + txt(e.merke, sp);
    erg.appendChild(m);
    box.appendChild(erg);
    var r = el('div', 'fk-knoepfe');
    r.appendChild(knopf(sp === 'en' ? 'Run it again' : 'Noch einmal', 'b b-primary', function () { uebungStarten(e.id, sp); }));
    r.appendChild(knopf(sp === 'en' ? 'Üben auf Deutsch' : 'Dieselbe Lage auf Englisch', 'b b-ghost', function () { uebungStarten(e.id, sp === 'en' ? 'de' : 'en'); }));
    var i = D.EINHEITEN.indexOf(e);
    if (i >= 0 && i + 1 < D.EINHEITEN.length) r.appendChild(knopf(sp === 'en' ? 'Next unit' : 'Nächste Einheit', 'b b-ghost', function () { uebungStarten(D.EINHEITEN[i + 1].id); }));
    r.appendChild(knopf(sp === 'en' ? 'All units' : 'Alle Einheiten', 'b b-ghost', uebungBeenden));
    box.appendChild(r);
    protokoll('hinweis', null, sp === 'en' ? 'End of exercise' : 'Ende der Übung');
  }

  /* ======================= Einstellungen ======================= */
  function spracheZeigen() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-sprache]'), function (b) {
      b.classList.toggle('an', b.getAttribute('data-sprache') === st.sprache);
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-sprache]'), function (b) {
    b.onclick = function () { st.sprache = b.getAttribute('data-sprache'); sichern(); spracheZeigen(); listeZeichnen(); };
  });
  function tonZeigen() {
    var b = $('tonSchalter');
    b.textContent = st.ton ? '🔊 Ton an' : '🔇 Ton aus';
    b.setAttribute('aria-pressed', st.ton ? 'true' : 'false');
  }
  $('tonSchalter').onclick = function () { st.ton = !st.ton; if (!st.ton) stillLegen(); sichern(); tonZeigen(); };

  /* ======================= Start ======================= */
  generatorenFuellen(); spracheZeigen(); tonZeigen(); kanalZeigen(); theorieZeichnen(); listeZeichnen(); reiter();
})();
