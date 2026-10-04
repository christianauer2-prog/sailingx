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
          D.ABC.forEach(function (p) { var s = el('span'); s.appendChild(el('b', null, p[0])); s.appendChild(el('span', null, p[1])); g.appendChild(s); });
          k.appendChild(g);
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
  var KANAELE = [6, 8, 9, 10, 12, 13, 16, 67, 68, 69, 70, 71, 72, 73, 74, 77];
  var geraet = { kanal: 16, aktiv: false };
  function kanalZeigen() {
    $('fgKanal').textContent = geraet.kanal < 10 ? '0' + geraet.kanal : String(geraet.kanal);
    $('fgStatus').textContent = geraet.kanal === 70 ? 'DSC · nur Daten' : (geraet.kanal === 16 ? 'ANRUF & NOT' : 'ARBEITSKANAL');
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
          box.appendChild(antwortKnopf());
        } else {
          weiter();
        }
      }, wartet);
    }));
    box.appendChild(r);
  }
  function antwortKnopf() {
    var r = el('div', 'fk-knoepfe');
    r.appendChild(knopf(U.sp === 'en' ? 'Continue' : 'Weiter', 'b b-primary', weiter));
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
    box.appendChild(el('p', 'fk-frage', txt(s.text, sp)));
    if (s.kanal != null) kanalSetzen(s.kanal);
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
  spracheZeigen(); tonZeigen(); kanalZeigen(); theorieZeichnen(); listeZeichnen(); reiter();
})();
