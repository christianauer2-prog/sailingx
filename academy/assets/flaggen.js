/* ==========================================================================
   SailingX-Academy – Signalflaggen: Tafel, Theorie und Übungen
   Die Flaggen werden als SVG gezeichnet, das Morsezeichen über die Web-Audio-API
   gespielt. Fortschritt und Einstellungen bleiben im Browser dieses Geräts.
   ========================================================================== */
(function () {
  'use strict';
  var D = window.FLAGGEN; if (!D) return;
  var KEY = 'sx-flaggen-v1';

  /* ---------- Helfer ---------- */
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function $(id) { return document.getElementById(id); }
  function knopf(text, cls, fn) { var b = el('button', cls, text); b.type = 'button'; b.onclick = fn; return b; }
  function mischen(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function zufall(a, n) { return mischen(a).slice(0, n); }
  function norm(s) { return (s || '').toLowerCase().replace(/[äöüß]/g, function (c) { return { 'ä': 'a', 'ö': 'o', 'ü': 'u', 'ß': 's' }[c]; }); }

  var ALLE = [];
  D.BUCHSTABEN.forEach(function (f) { f.gruppe = 'buchstaben'; ALLE.push(f); });
  D.ZAHLEN.forEach(function (f) { f.gruppe = 'zahlen'; f.bedeutung = f.bedeutung || 'Zahlenwimpel – wird für Zahlen in Signalgruppen verwendet. Als Einzelflagge hat er keine Bedeutung.'; ALLE.push(f); });
  D.SONDER.forEach(function (f) { f.gruppe = 'sonder'; ALLE.push(f); });
  function finde(z) { for (var i = 0; i < ALLE.length; i++) if (ALLE[i].z === z) return ALLE[i]; return null; }

  /* ---------- Speicher ---------- */
  var st = { erg: {} };
  try { var roh = localStorage.getItem(KEY); if (roh) st = JSON.parse(roh); } catch (e) { }
  if (!st.erg) st.erg = {};
  function sichern() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } }

  /* ---------- Flagge zeichnen ---------- */
  var FORMEN = {
    rechteck: '0,0 90,0 90,60 0,60',
    schwalbe: '0,0 90,0 66,30 90,60 0,60',
    wimpel: '0,0 90,25 90,35 0,60',
    dreieck: '0,0 90,30 0,60'
  };
  var nr = 0;
  function bild(f, titel) {
    var id = 'flc' + (++nr), form = FORMEN[f.form] || FORMEN.rechteck;
    return '<svg viewBox="-1 -1 92 62" role="img" aria-label="' + (titel || ('Flagge ' + f.z)) + '">' +
      '<defs><clipPath id="' + id + '"><polygon points="' + form + '"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' + f.malen + '</g>' +
      '<polygon points="' + form + '" fill="none" stroke="#9fb0bb" stroke-width="1.1" stroke-linejoin="round"/>' +
      '</svg>';
  }
  function bildBox(f, cls) {
    var d = el('div', 'fl-bild' + (cls ? ' ' + cls : ''));
    d.innerHTML = bild(f);
    return d;
  }
  function morseBalken(code) {
    var d = el('span', 'fl-morse');
    (code || '').split('').forEach(function (c) { d.appendChild(el('i', c === '.' ? 'p' : 's')); });
    return d;
  }

  /* ---------- Morse hörbar ---------- */
  var ac = null;
  function ton(dauer, start) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = 680;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(.22, start + .008);
    g.gain.setValueAtTime(.22, start + dauer - .008);
    g.gain.linearRampToValueAtTime(0, start + dauer);
    o.connect(g); g.connect(ac.destination);
    o.start(start); o.stop(start + dauer + .02);
  }
  function morseSpielen(code, tempo) {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
    } catch (e) { return; }
    var e1 = tempo || .11, t = ac.currentTime + .08;
    code.split('').forEach(function (c) {
      var d = c === '.' ? e1 : e1 * 3;
      ton(d, t); t += d + e1;
    });
    return (code.length * 4 + 2) * e1;
  }
  function tonKnopf(code) {
    return knopf('🔊 Morse hören', 'fl-ton', function () { morseSpielen(code); });
  }

  /* ---------- Reiter ---------- */
  function reiter() {
    var ziel = (location.hash || '#tafel').replace('#', '');
    if (['tafel', 'ueben', 'theorie'].indexOf(ziel) < 0) ziel = 'tafel';
    ['tafel', 'ueben', 'theorie'].forEach(function (n) {
      $('panel-' + n).classList.toggle('on', n === ziel);
      $('tab-' + n).setAttribute('aria-selected', n === ziel ? 'true' : 'false');
    });
  }
  window.addEventListener('hashchange', reiter);

  /* ======================= Tafel ======================= */
  var gruppe = 'alle', suche = '';
  function tafelZeichnen() {
    var box = $('flGitter'); box.innerHTML = '';
    var q = norm(suche);
    ALLE.filter(function (f) {
      if (gruppe !== 'alle' && f.gruppe !== gruppe) return false;
      if (!q) return true;
      return norm(f.z + ' ' + f.name + ' ' + (f.kurz || '') + ' ' + (f.bedeutung || '')).indexOf(q) >= 0;
    }).forEach(function (f) {
      var b = el('button', 'fl-kachel'); b.type = 'button';
      b.appendChild(bildBox(f));
      var z = el('div', 'z');
      z.appendChild(el('b', null, f.gruppe === 'sonder' ? '⚑' : f.z));
      z.appendChild(el('span', null, f.gruppe === 'sonder' ? f.kurz : f.name));
      b.appendChild(z);
      if (f.morse) b.appendChild(morseBalken(f.morse));
      b.appendChild(el('p', 'be', f.bedeutung || ''));
      b.onclick = function () { karteZeigen(f); };
      box.appendChild(b);
    });
    if (!box.children.length) box.appendChild(el('p', 'lb-hinweis', 'Nichts gefunden – versuch es mit einem Buchstaben, einem Namen wie „Quebec“ oder einem Stichwort wie „Taucher“.'));
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-gruppe]'), function (b) {
    b.onclick = function () {
      gruppe = b.getAttribute('data-gruppe');
      Array.prototype.forEach.call(document.querySelectorAll('[data-gruppe]'), function (x) { x.classList.toggle('an', x === b); });
      tafelZeichnen();
    };
  });
  $('flSuche').addEventListener('input', function () { suche = this.value; tafelZeichnen(); });

  /* ---------- Detailkarte ---------- */
  var karte = null;
  function karteZeigen(f) {
    karteSchliessen();
    karte = el('div', 'fl-karte');
    var inh = el('div', 'fl-kinhalt');
    var zu = el('button', 'zu', '×'); zu.type = 'button'; zu.setAttribute('aria-label', 'Schließen'); zu.onclick = karteSchliessen;
    inh.appendChild(zu);
    var kopf = el('div', 'fl-kkopf');
    var bb = el('div', 'bildbox'); bb.appendChild(bildBox(f)); kopf.appendChild(bb);
    var tx = el('div');
    tx.appendChild(el('h3', null, f.gruppe === 'sonder' ? f.kurz : f.z));
    tx.appendChild(el('div', 'nm', f.gruppe === 'sonder' ? 'Signalbuch' : f.name));
    if (f.morse) {
      var mz = el('div', 'mz');
      mz.appendChild(morseBalken(f.morse));
      mz.appendChild(tonKnopf(f.morse));
      tx.appendChild(mz);
    }
    kopf.appendChild(tx);
    inh.appendChild(kopf);
    inh.appendChild(el('p', 'haupt', f.bedeutung || ''));
    if (f.zusatz && f.zusatz.length) {
      var zs = el('div', 'fl-zusatz');
      f.zusatz.forEach(function (x) { var d = el('div'); d.appendChild(el('b', null, x.a)); d.appendChild(el('span', null, x.t)); zs.appendChild(d); });
      inh.appendChild(zs);
    }
    if (f.merk) { var m = el('p', 'fl-merk'); m.innerHTML = '<b>Eselsbrücke:</b> ' + f.merk; inh.appendChild(m); }
    karte.appendChild(inh);
    karte.onclick = function (e) { if (e.target === karte) karteSchliessen(); };
    document.body.appendChild(karte);
    document.addEventListener('keydown', escSchliessen);
  }
  function escSchliessen(e) { if (e.key === 'Escape') karteSchliessen(); }
  function karteSchliessen() {
    if (karte && karte.parentNode) karte.parentNode.removeChild(karte);
    karte = null; document.removeEventListener('keydown', escSchliessen);
  }

  /* ======================= Theorie ======================= */
  function theorieZeichnen() {
    var box = $('flTheorie'); box.innerHTML = '';
    D.THEORIE.forEach(function (t) {
      var k = el('section', 'fl-th');
      var h = el('h2'); h.appendChild(el('span', 'ic', t.icon)); h.appendChild(el('span', null, t.titel)); k.appendChild(h);
      if (t.kurz) k.appendChild(el('p', 'kurz', t.kurz));
      t.bloecke.forEach(function (b) {
        if (b.ul) { var u = el('ul'); b.ul.forEach(function (x) { var li = el('li'); li.innerHTML = x; u.appendChild(li); }); k.appendChild(u); }
        if (b.tabelle) {
          var tb = el('table');
          b.tabelle.forEach(function (r) {
            var tr = el('tr'), f = finde(r[0]);
            var td1 = el('td');
            if (f) { var mini = el('div', 'mini'); mini.innerHTML = bild(f); td1.appendChild(mini); }
            else td1.textContent = r[0];
            tr.appendChild(td1);
            var td2 = el('td'); td2.innerHTML = '<b>' + r[0] + '</b> – ' + r[1]; tr.appendChild(td2);
            tb.appendChild(tr);
          });
          k.appendChild(tb);
        }
      });
      box.appendChild(k);
    });
  }

  /* ======================= Übungen ======================= */
  var MODI = [
    { id: 'erkennen', icon: '🚩', titel: 'Flagge erkennen', text: 'Welche Flagge ist das? Buchstabe und Funkname.', n: 10 },
    { id: 'bedeutung', icon: '📖', titel: 'Was bedeutet sie?', text: 'Flagge zeigen, Bedeutung als Einzelflagge wählen.', n: 10 },
    { id: 'rueck', icon: '🔁', titel: 'Welche Flagge setze ich?', text: 'Bedeutung lesen, die richtige Flagge heraussuchen.', n: 10 },
    { id: 'morse', icon: '🔊', titel: 'Morse hören', text: 'Zeichen anhören und den Buchstaben erkennen.', n: 10 },
    { id: 'zahlen', icon: '🔢', titel: 'Zahlen & Wimpel', text: 'Zahlenwimpel, Antwortwimpel und die drei Ersatzwimpel.', n: 10 },
    { id: 'buchstabieren', icon: '🔤', titel: 'Buchstabieren', text: 'Namen mit Flaggen hissen – mit Ersatzwimpel-Regel.', n: 4 },
    { id: 'pruefung', icon: '🎓', titel: 'Prüfung', text: 'Fünfzehn gemischte Fragen quer durch alles.', n: 15 }
  ];

  function modiZeichnen() {
    var box = $('flModi'); box.innerHTML = '';
    var fertig = 0;
    MODI.forEach(function (m) {
      var e = st.erg[m.id]; if (e) fertig++;
      var b = el('button', 'fl-modi' + (e ? ' fertig' : '')); b.type = 'button';
      b.appendChild(el('span', 'ic', e ? '✓' : m.icon));
      var tx = el('span');
      tx.appendChild(el('b', null, m.titel));
      tx.appendChild(el('small', null, m.text));
      if (e) tx.appendChild(el('span', 'erg', 'bestes Ergebnis: ' + e.richtig + ' von ' + e.gesamt));
      b.appendChild(tx);
      b.onclick = function () { rundeStarten(m); };
      box.appendChild(b);
    });
    $('flFortschritt').textContent = fertig + ' von ' + MODI.length + ' Übungen gemacht';
  }

  /* ---------- Fragen bauen ---------- */
  function kurzeBedeutung(f) {
    var s = f.bedeutung || '';
    return s.length > 96 ? s.slice(0, 94).replace(/[\s,;:–-]+\S*$/, '') + ' …' : s;
  }
  function mcFlaggeBuchstabe(f) {
    var falsche = zufall(D.BUCHSTABEN.filter(function (x) { return x.z !== f.z; }), 3);
    return {
      typ: 'mc', flagge: f, text: 'Welche Flagge ist das?',
      optionen: mischen([f].concat(falsche)).map(function (x) { return { z: x.z, label: x.z + ' – ' + x.name, ok: x.z === f.z }; }),
      erklaerung: f.z + ' – ' + f.name + ': ' + f.bedeutung
    };
  }
  function mcFlaggeBedeutung(f) {
    var falsche = zufall(D.BUCHSTABEN.filter(function (x) { return x.z !== f.z; }), 3);
    return {
      typ: 'mc', flagge: f, text: 'Was bedeutet diese Flagge als Einzelflagge?', breit: true,
      optionen: mischen([f].concat(falsche)).map(function (x) { return { label: kurzeBedeutung(x), ok: x.z === f.z }; }),
      erklaerung: f.z + ' – ' + f.name + ': ' + f.bedeutung
    };
  }
  function mcBedeutungFlagge(f) {
    var falsche = zufall(D.BUCHSTABEN.filter(function (x) { return x.z !== f.z; }), 3);
    return {
      typ: 'mc', text: '„' + f.bedeutung + '“ – welche Flagge?',
      optionen: mischen([f].concat(falsche)).map(function (x) { return { flagge: x, label: x.z, ok: x.z === f.z }; }),
      erklaerung: f.z + ' – ' + f.name + ': ' + f.bedeutung
    };
  }
  function mcMorse(f) {
    var falsche = zufall(D.BUCHSTABEN.filter(function (x) { return x.z !== f.z; }), 3);
    return {
      typ: 'mc', hoeren: f.morse, text: 'Welcher Buchstabe wird gemorst?',
      optionen: mischen([f].concat(falsche)).map(function (x) { return { z: x.z, label: x.z + ' – ' + x.name, ok: x.z === f.z }; }),
      erklaerung: f.z + ' – ' + f.name + ' (' + f.morse.replace(/\./g, '·').replace(/-/g, '–') + '): ' + f.bedeutung
    };
  }
  function mcZahlen(f) {
    var pool = D.ZAHLEN.concat(D.SONDER).filter(function (x) { return x.z !== f.z; });
    var frage = f.gruppe === 'zahlen' ? 'Welcher Zahlenwimpel ist das?' : 'Welcher Wimpel ist das?';
    return {
      typ: 'mc', flagge: f, text: frage,
      optionen: mischen([f].concat(zufall(pool, 3))).map(function (x) { return { label: x.gruppe === 'zahlen' ? x.z + ' – ' + x.name : x.kurz, ok: x.z === f.z }; }),
      erklaerung: (f.gruppe === 'zahlen' ? 'Zahlenwimpel ' + f.z + ' (' + f.name + '). ' : f.kurz + '. ') + (f.bedeutung || '')
    };
  }
  function mcSzenario(s) {
    var f = finde(s.z);
    var falsche = zufall(D.BUCHSTABEN.filter(function (x) { return x.z !== s.z; }), 3);
    return {
      typ: 'mc', text: s.frage,
      optionen: mischen([f].concat(falsche)).map(function (x) { return { flagge: x, label: x.z, ok: x.z === s.z }; }),
      erklaerung: f.z + ' – ' + f.name + ': ' + f.bedeutung
    };
  }

  // Buchstabieren: Ersatzwimpel-Regel anwenden
  function hissfolge(wort) {
    var folge = [], gezeigt = [];
    wort.split('').forEach(function (c) {
      var pos = gezeigt.indexOf(c);
      if (pos >= 0 && pos < 3) folge.push('E' + (pos + 1));
      else { folge.push(c); }
      gezeigt.push(c);
    });
    return folge;
  }
  function fragenBauen(m) {
    var f = [];
    if (m.id === 'erkennen') zufall(D.BUCHSTABEN, m.n).forEach(function (x) { f.push(mcFlaggeBuchstabe(x)); });
    if (m.id === 'bedeutung') zufall(D.BUCHSTABEN, m.n).forEach(function (x) { f.push(mcFlaggeBedeutung(x)); });
    if (m.id === 'rueck') zufall(D.BUCHSTABEN, m.n).forEach(function (x) { f.push(mcBedeutungFlagge(x)); });
    if (m.id === 'morse') zufall(D.BUCHSTABEN, m.n).forEach(function (x) { f.push(mcMorse(x)); });
    if (m.id === 'zahlen') zufall(D.ZAHLEN.concat(D.SONDER), m.n).forEach(function (x) { f.push(mcZahlen(x)); });
    if (m.id === 'buchstabieren') zufall(D.WOERTER, m.n).forEach(function (w) { f.push({ typ: 'buchstabieren', wort: w.wort, hinweis: w.hinweis, folge: hissfolge(w.wort) }); });
    if (m.id === 'pruefung') {
      zufall(D.BUCHSTABEN, 5).forEach(function (x) { f.push(mcFlaggeBedeutung(x)); });
      zufall(D.BUCHSTABEN, 3).forEach(function (x) { f.push(mcFlaggeBuchstabe(x)); });
      zufall(D.SZENARIEN, 4).forEach(function (s) { f.push(mcSzenario(s)); });
      zufall(D.ZAHLEN.concat(D.SONDER), 2).forEach(function (x) { f.push(mcZahlen(x)); });
      zufall(D.BUCHSTABEN, 1).forEach(function (x) { f.push(mcMorse(x)); });
      f = mischen(f);
    }
    return f;
  }

  /* ---------- Runde ---------- */
  var R = null;
  function rundeStarten(m, fragen) {
    R = { m: m, fragen: fragen || fragenBauen(m), i: 0, richtig: 0, fehler: [], start: Date.now() };
    $('fl-modi').hidden = true; $('fl-runde').hidden = false;
    $('rundeTitel').textContent = m.titel;
    window.scrollTo(0, 0);
    frageZeigen();
  }
  function rundeBeenden() {
    R = null; $('fl-runde').hidden = true; $('fl-modi').hidden = false;
    modiZeichnen(); window.scrollTo(0, 0);
  }
  $('rundeZurueck').onclick = rundeBeenden;

  function standZeigen() {
    var n = R.fragen.length;
    $('rundeBalken').style.width = (R.i / n * 100) + '%';
    $('rundeStand').textContent = 'Frage ' + Math.min(R.i + 1, n) + ' von ' + n + ' · richtig: ' + R.richtig;
  }
  function frageZeigen() {
    var box = $('rundeFrage'); box.innerHTML = '';
    if (R.i >= R.fragen.length) return auswertung();
    standZeigen();
    var q = R.fragen[R.i];
    if (q.typ === 'mc') return frageMc(q, box);
    if (q.typ === 'buchstabieren') return frageBuchstabieren(q, box);
  }
  function weiterKnopf(box) {
    var r = el('div', 'fl-knoepfe');
    r.appendChild(knopf(R.i + 1 >= R.fragen.length ? 'Auswertung' : 'Weiter', 'b b-primary', function () { R.i++; frageZeigen(); }));
    box.appendChild(r);
    return r;
  }

  function frageMc(q, box) {
    box.appendChild(el('p', 'fl-fragetext', q.text));
    if (q.flagge) {
      var zf = el('div', 'fl-zeigefl');
      zf.appendChild(bildBox(q.flagge));
      box.appendChild(zf);
    }
    if (q.hoeren) {
      var hr = el('div', 'fl-knoepfe');
      hr.style.justifyContent = 'center';
      hr.appendChild(knopf('🔊 Zeichen abspielen', 'b b-ghost', function () { morseSpielen(q.hoeren); }));
      box.appendChild(hr);
      setTimeout(function () { morseSpielen(q.hoeren); }, 350);
    }
    var liste = el('div', 'fl-opt' + (q.breit ? ' breit' : ''));
    box.appendChild(liste);
    var beantwortet = false;
    q.optionen.forEach(function (o) {
      var b = el('button'); b.type = 'button';
      if (o.flagge) { var fb = el('span', 'fbild'); fb.appendChild(bildBox(o.flagge)); b.appendChild(fb); }
      else if (o.z) b.appendChild(el('span', 'fz', o.z));
      b.appendChild(el('span', null, o.flagge ? '' : (o.z ? o.label.replace(o.z + ' – ', '') : o.label)));
      b.onclick = function () {
        if (beantwortet) return;
        beantwortet = true;
        Array.prototype.forEach.call(liste.children, function (x) { x.disabled = true; });
        b.classList.add(o.ok ? 'richtig' : 'falsch');
        if (!o.ok) {
          Array.prototype.forEach.call(liste.children, function (x, i) { if (q.optionen[i].ok) x.classList.add('richtig'); });
          R.fehler.push(q);
        } else R.richtig++;
        var rr = el('div', 'fl-rueck' + (o.ok ? '' : ' warn'));
        rr.innerHTML = '<b>' + (o.ok ? 'Richtig.' : 'Leider nicht.') + '</b> ' + q.erklaerung;
        box.appendChild(rr);
        weiterKnopf(box);
        standZeigen();
      };
      liste.appendChild(b);
    });
  }

  function frageBuchstabieren(q, box) {
    var pos = 0;
    box.appendChild(el('p', 'fl-fragetext', 'Hisse dieses Signal – Flagge für Flagge von oben nach unten.'));
    box.appendChild(el('p', 'fl-wort', q.wort));
    box.appendChild(el('p', 'fl-worthinweis', q.hinweis || 'Achtung: Jede Flagge gibt es nur einmal an Bord.'));
    var hiss = el('div', 'fl-hissen');
    q.folge.forEach(function (_, i) {
      var p = el('div', 'platz'); p.setAttribute('data-platz', i);
      p.appendChild(el('div', 'leer'));
      p.appendChild(el('div', 'nr', String(i + 1)));
      hiss.appendChild(p);
    });
    box.appendChild(hiss);
    var pal = el('div', 'fl-palette');
    box.appendChild(pal);
    var vorrat = D.BUCHSTABEN.slice();
    if (/[0-9]/.test(q.wort)) vorrat = vorrat.concat(D.ZAHLEN);
    vorrat = vorrat.concat(D.SONDER.filter(function (x) { return x.z !== 'AW'; }));
    vorrat.forEach(function (f) {
      var b = el('button'); b.type = 'button';
      b.appendChild(bildBox(f));
      b.appendChild(el('span', 'pz', f.gruppe === 'sonder' ? f.z.replace('E', '') + '. Ersatz' : f.z));
      b.onclick = function () {
        if (pos >= q.folge.length) return;
        if (f.z === q.folge[pos]) {
          var platz = hiss.querySelector('[data-platz="' + pos + '"]');
          platz.innerHTML = '';
          platz.appendChild(bildBox(f));
          platz.appendChild(el('div', 'nr', String(pos + 1)));
          pos++;
          var alt = box.querySelector('.fl-rueck'); if (alt) alt.parentNode.removeChild(alt);
          if (pos === q.folge.length) {
            Array.prototype.forEach.call(pal.children, function (x) { x.disabled = true; });
            var ok = !box.querySelector('[data-fehler]');
            if (ok) R.richtig++; else R.fehler.push(q);
            var rr = el('div', 'fl-rueck');
            rr.innerHTML = '<b>Signal steht.</b> ' + erklaerungHissen(q);
            box.appendChild(rr);
            weiterKnopf(box);
            standZeigen();
          }
        } else {
          b.classList.add('falsch');
          setTimeout(function () { b.classList.remove('falsch'); }, 300);
          box.setAttribute('data-fehler', '1');
          var soll = finde(q.folge[pos]);
          var warum = soll && soll.gruppe === 'sonder'
            ? 'An dieser Stelle steht ein <b>Ersatzwimpel</b>: Der Buchstabe wurde in dieser Gruppe schon verwendet, und jede Flagge gibt es nur einmal.'
            : 'Diese Flagge passt hier nicht – gesucht ist Position ' + (pos + 1) + ' von „' + q.wort + '“.';
          var alt2 = box.querySelector('.fl-rueck'); if (alt2) alt2.parentNode.removeChild(alt2);
          var rr2 = el('div', 'fl-rueck warn');
          rr2.innerHTML = '<b>Noch nicht.</b> ' + warum;
          box.appendChild(rr2);
        }
      };
      pal.appendChild(b);
    });
  }
  function erklaerungHissen(q) {
    var ersatz = q.folge.filter(function (c) { return c.charAt(0) === 'E'; }).length;
    if (!ersatz) return 'In „' + q.wort + '“ kommt kein Zeichen doppelt vor – es werden nur die Buchstabenflaggen gehisst.';
    return 'In „' + q.wort + '“ wiederholen sich Zeichen, deshalb ' + (ersatz === 1 ? 'steht ein Ersatzwimpel' : 'stehen ' + ersatz + ' Ersatzwimpel') +
      ' an ihrer Stelle: Der erste Ersatzwimpel wiederholt die erste Flagge der Gruppe, der zweite die zweite, der dritte die dritte.';
  }

  /* ---------- Auswertung ---------- */
  function auswertung() {
    var box = $('rundeFrage'); box.innerHTML = '';
    $('rundeBalken').style.width = '100%';
    var n = R.fragen.length, sek = Math.max(1, Math.round((Date.now() - R.start) / 1000));
    var alt = st.erg[R.m.id];
    if (!alt || R.richtig / n > alt.richtig / alt.gesamt) st.erg[R.m.id] = { richtig: R.richtig, gesamt: n, datum: new Date().toISOString().slice(0, 10) };
    sichern();
    var erg = el('div', 'fl-ergebnis');
    erg.appendChild(el('div', 'gross', R.richtig + ' von ' + n));
    erg.appendChild(el('div', 'zeile', R.richtig === n ? 'Alles richtig – sauber!' : 'In ' + (sek < 60 ? sek + ' Sekunden' : Math.round(sek / 60) + ' Minuten') + ' geschafft.'));
    if (R.fehler.length) {
      erg.appendChild(el('div', 'zeile', 'Diese hast du dir noch nicht gemerkt:'));
      var li = el('div', 'fl-liste');
      var gezeigt = {};
      R.fehler.forEach(function (q) {
        var f = q.flagge || (q.optionen && (function () { for (var i = 0; i < q.optionen.length; i++) if (q.optionen[i].ok && q.optionen[i].flagge) return q.optionen[i].flagge; return null; })());
        if (!f || gezeigt[f.z]) return;
        gezeigt[f.z] = 1;
        var m = el('div', 'mini');
        m.appendChild(bildBox(f));
        m.appendChild(el('div', 'nr', f.gruppe === 'sonder' ? f.kurz : f.z + ' – ' + f.name));
        li.appendChild(m);
      });
      if (li.children.length) erg.appendChild(li);
    }
    box.appendChild(erg);
    var r = el('div', 'fl-knoepfe');
    r.style.justifyContent = 'center';
    if (R.fehler.length) {
      var wiederholen = R.fehler.slice();
      r.appendChild(knopf('Fehler wiederholen (' + wiederholen.length + ')', 'b b-primary', function () { rundeStarten(R.m, mischen(wiederholen)); }));
    }
    r.appendChild(knopf('Neue Runde', R.fehler.length ? 'b b-ghost' : 'b b-primary', function () { rundeStarten(R.m); }));
    r.appendChild(knopf('Alle Übungen', 'b b-ghost', rundeBeenden));
    box.appendChild(r);
  }

  /* ======================= Start ======================= */
  tafelZeichnen(); theorieZeichnen(); modiZeichnen(); reiter();
})();
