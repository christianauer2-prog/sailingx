/* ==========================================================================
   SailingX-Academy – Logbuch (Etappe 1)
   Alles bleibt im Browser dieses Geräts (localStorage). Kein Server, keine Konten.
   Ein gespeicherter Eintrag wird nicht mehr verändert; Fehler werden mit einer
   Berichtigung richtiggestellt. Über alle Einträge läuft eine Prüfkette.
   ========================================================================== */
(function () {
  'use strict';
  var KEY = 'sx-logbuch-v1';

  /* ---------- kleine Helfer ---------- */
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function $(id) { return document.getElementById(id); }
  function z2(n) { return (n < 10 ? '0' : '') + n; }
  function zahl(v) { if (v == null || v === '') return null; var n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; }
  function dez(n, k) { return n == null ? '' : n.toFixed(k == null ? 1 : k).replace('.', ','); }
  function heute(d) { d = d || new Date(); return d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate()); }
  function jetztZeit(d) { d = d || new Date(); return z2(d.getHours()) + ':' + z2(d.getMinutes()); }
  var WOCHE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  var MONAT = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  function datumLang(iso) {
    var p = (iso || '').split('-'); if (p.length !== 3) return iso || '';
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return WOCHE[d.getDay()] + ', ' + (+p[2]) + '. ' + MONAT[+p[1] - 1] + ' ' + p[0];
  }
  function datumKurz(iso) { var p = (iso || '').split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : (iso || ''); }
  function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* ---------- Daten ---------- */
  var db = { v: 1, toerns: [] };
  try { var roh = localStorage.getItem(KEY); if (roh) db = JSON.parse(roh); } catch (e) { }
  if (!db.toerns) db.toerns = [];
  var warnung = false;
  function sichern() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) {
      if (!warnung) { warnung = true; alert('Das Logbuch konnte nicht gespeichert werden – vermutlich ist der Speicher des Browsers voll oder blockiert.\n\nBitte sichere den Törn als Datei („Sichern“).'); }
    }
  }
  function toern(tid) { for (var i = 0; i < db.toerns.length; i++) if (db.toerns[i].id === tid) return db.toerns[i]; return null; }

  /* ---------- Prüfkette ---------- */
  function einfachHash(s) { // Rückfallebene, wenn der Browser kein SHA-256 anbietet
    var h1 = 0x811c9dc5, h2 = 0x1000193;
    for (var i = 0; i < s.length; i++) { h1 = (h1 ^ s.charCodeAt(i)) >>> 0; h1 = (h1 * 16777619) >>> 0; h2 = (h2 + h1 * 31) >>> 0; }
    return ('00000000' + h1.toString(16)).slice(-8) + ('00000000' + h2.toString(16)).slice(-8);
  }
  function hash(text) {
    try {
      if (window.crypto && crypto.subtle && window.TextEncoder && location.protocol !== 'file:') {
        return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
          var b = new Uint8Array(buf), s = '';
          for (var i = 0; i < b.length; i++) s += ('0' + b[i].toString(16)).slice(-2);
          return s.slice(0, 24);
        }, function () { return einfachHash(text); });
      }
    } catch (e) { }
    return Promise.resolve(einfachHash(text));
  }
  function eintragText(e) {
    return [e.nr, e.datum, e.zeit, e.art, e.ort, e.pos, e.kurs, e.kompass, e.log, e.fahrt, e.windRi, e.windBft, e.boeen,
      e.see, e.sicht, e.druck, e.wolken, e.temp, e.segel, e.motor ? 1 : 0, e.motorStd, e.bemerkung, e.verfasser, e.erstellt, e.berichtigungZu || ''].join('|');
  }

  /* ---------- Listen ---------- */
  var EREIGNISSE = [
    { id: '', name: 'laufender Eintrag', icon: '📝', knopf: false },
    { id: 'ablegen', name: 'Ablegen', icon: '🚢', vor: { segel: 'Maschine', motor: true } },
    { id: 'anlegen', name: 'Anlegen', icon: '🧷', vor: { segel: 'im Hafen', motor: true, kurs: '', fahrt: '' } },
    { id: 'ankern', name: 'Anker fällt', icon: '⚓', vor: { segel: 'vor Anker', kurs: '', fahrt: '' } },
    { id: 'ankerauf', name: 'Anker auf', icon: '⛓️', vor: { motor: true } },
    { id: 'wache', name: 'Wachwechsel', icon: '🕐' },
    { id: 'reff', name: 'Reff', icon: '🪢' },
    { id: 'motorwechsel', name: 'Motor an/aus', icon: '🔧' },
    { id: 'bunkern', name: 'Bunkern', icon: '⛽' },
    { id: 'funk', name: 'Funkverkehr', icon: '📻' },
    { id: 'vorkommnis', name: 'Besonderes Vorkommnis', icon: '⚠️', warn: true },
    { id: 'notfall', name: 'Notfall / MOB', icon: '🆘', warn: true },
    { id: 'berichtigung', name: 'Berichtigung', icon: '✎', knopf: false, warn: true }
  ];
  function ereignis(idd) { for (var i = 0; i < EREIGNISSE.length; i++) if (EREIGNISSE[i].id === idd) return EREIGNISSE[i]; return EREIGNISSE[0]; }
  var STRICHE = ['', 'N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  var SEE = ['', '0 – spiegelglatt', '1 – ruhig', '2 – schwach bewegt', '3 – leicht bewegt', '4 – mäßig bewegt', '5 – grob', '6 – sehr grob', '7 – hoch', '8 – sehr hoch', '9 – außergewöhnlich'];
  var SICHT = [['', '–'], ['gut', 'gut (über 5 sm)'], ['mäßig', 'mäßig (2–5 sm)'], ['schlecht', 'schlecht (unter 2 sm)'], ['Nebel', 'Nebel']];

  /* ---------- Ansichtssteuerung ---------- */
  var ansichten = ['v-liste', 'v-stamm', 'v-buch', 'v-druck'], aktiv = null, stammModus = 'neu';
  function zeige(v) {
    ansichten.forEach(function (a) { $(a).hidden = a !== v; });
    window.scrollTo(0, 0);
  }

  /* ================= Törnliste ================= */
  function listeZeichnen() {
    var box = $('toernListe'); box.innerHTML = '';
    if (!db.toerns.length) {
      var leer = el('div', 'lb-leer');
      leer.appendChild(el('p', null, 'Noch kein Törn angelegt.'));
      leer.appendChild(el('p', null, 'Lege deinen ersten Törn an – du brauchst nur eine Bezeichnung, alles Weitere lässt sich später ergänzen.'));
      box.appendChild(leer); return;
    }
    var grid = el('div', 'lb-karten');
    db.toerns.slice().sort(function (a, b) { return (b.erstellt || '').localeCompare(a.erstellt || ''); }).forEach(function (t) {
      var k = el('div', 'lb-karte');
      k.appendChild(el('h3', null, t.name));
      var m = el('p', 'meta');
      var teile = [];
      if (t.schiffName) teile.push(t.schiffName);
      if (t.von || t.bis) teile.push((t.von ? datumKurz(t.von) : '?') + ' – ' + (t.bis ? datumKurz(t.bis) : '?'));
      if (t.revier) teile.push(t.revier);
      teile.push('Skipper: ' + (t.skipper || '–'));
      m.innerHTML = teile.join('<br>');
      k.appendChild(m);
      var z = el('div', 'zahlen');
      z.appendChild(wert(t.eintraege.length, 'Einträge'));
      z.appendChild(wert(dez(gesamtMeilen(t)), 'Seemeilen'));
      z.appendChild(wert(tageVon(t).length, 'Tage'));
      k.appendChild(z);
      var r = el('div', 'row-btns');
      r.appendChild(knopf('Öffnen', 'b b-primary sm', function () { buchOeffnen(t.id); }));
      r.appendChild(knopf('Drucken', 'b b-ghost sm', function () { aktiv = t.id; druckZeichnen(); zeige('v-druck'); }));
      r.appendChild(knopf('Sichern', 'b b-ghost sm', function () { exportieren(t); }));
      k.appendChild(r);
      grid.appendChild(k);
    });
    box.appendChild(grid);
  }
  function wert(v, t) { var d = el('div'); d.appendChild(el('b', null, String(v))); d.appendChild(el('span', null, t)); return d; }
  function knopf(text, cls, fn) { var b = el('button', cls, text); b.type = 'button'; b.onclick = fn; return b; }

  function tageVon(t) {
    var tage = [], gesehen = {};
    t.eintraege.forEach(function (e) { if (!gesehen[e.datum]) { gesehen[e.datum] = 1; tage.push(e.datum); } });
    tage.sort(); return tage;
  }
  function tagesWerte(t, tag) {
    var logs = [], std = [], n = 0;
    t.eintraege.forEach(function (e) {
      if (e.datum !== tag) return; n++;
      if (zahl(e.log) != null) logs.push(zahl(e.log));
      if (zahl(e.motorStd) != null) std.push(zahl(e.motorStd));
    });
    return {
      n: n,
      meilen: logs.length > 1 ? Math.max.apply(null, logs) - Math.min.apply(null, logs) : null,
      motor: std.length > 1 ? Math.max.apply(null, std) - Math.min.apply(null, std) : null
    };
  }
  function gesamtMeilen(t) {
    var s = 0; tageVon(t).forEach(function (tag) { var w = tagesWerte(t, tag); if (w.meilen) s += w.meilen; }); return s;
  }

  /* ================= Stammdaten ================= */
  function crewZeile(c) {
    c = c || {};
    var r = el('div', 'lb-zeile');
    var n = el('input'); n.placeholder = 'Name'; n.value = c.name || ''; n.maxLength = 60; n.setAttribute('data-f', 'name');
    var ro = el('input'); ro.placeholder = 'Rolle (z. B. Crew)'; ro.value = c.rolle || ''; ro.maxLength = 40; ro.setAttribute('data-f', 'rolle');
    var v = el('input'); v.type = 'date'; v.title = 'an Bord ab'; v.value = c.von || ''; v.setAttribute('data-f', 'von');
    var b = el('input'); b.type = 'date'; b.title = 'an Bord bis'; b.value = c.bis || ''; b.setAttribute('data-f', 'bis');
    var w = el('button', 'weg', '×'); w.type = 'button'; w.title = 'Zeile entfernen'; w.onclick = function () { r.parentNode.removeChild(r); };
    [n, ro, v, b, w].forEach(function (x) { r.appendChild(x); });
    return r;
  }
  function wqZeile(q) {
    q = q || {};
    var r = el('div', 'lb-zeile'); r.style.gridTemplateColumns = '1fr 2fr auto';
    var n = el('input'); n.placeholder = 'Name (z. B. DHMZ)'; n.value = q.name || ''; n.maxLength = 40; n.setAttribute('data-f', 'name');
    var u = el('input'); u.placeholder = 'https://…'; u.value = q.url || ''; u.maxLength = 300; u.setAttribute('data-f', 'url');
    var w = el('button', 'weg', '×'); w.type = 'button'; w.onclick = function () { r.parentNode.removeChild(r); };
    [n, u, w].forEach(function (x) { r.appendChild(x); });
    return r;
  }
  function zeilenLesen(box) {
    return Array.prototype.map.call(box.children, function (r) {
      var o = {};
      Array.prototype.forEach.call(r.querySelectorAll('[data-f]'), function (i) { o[i.getAttribute('data-f')] = i.value.trim(); });
      return o;
    }).filter(function (o) { return (o.name || '').length || (o.url || '').length; });
  }
  function stammOeffnen(modus, t) {
    stammModus = modus;
    var f = $('stammForm');
    f.reset();
    $('stammTitel').textContent = modus === 'neu' ? 'Neuer Törn' : 'Stammdaten';
    $('stammSpeichern').textContent = modus === 'neu' ? 'Logbuch starten' : 'Speichern';
    $('crewRows').innerHTML = ''; $('wqRows').innerHTML = '';
    if (modus === 'neu') {
      f.von.value = heute();
      [{}, {}].forEach(function (c) { $('crewRows').appendChild(crewZeile(c)); });
      [{ name: 'Windy', url: 'https://www.windy.com' }, { name: 'DHMZ (HR)', url: 'https://meteo.hr/index_en.php' }].forEach(function (q) { $('wqRows').appendChild(wqZeile(q)); });
    } else {
      ['name', 'revier', 'start', 'ziel', 'von', 'bis', 'schiffName', 'schiffTyp', 'flagge', 'rufzeichen', 'mmsi', 'charter', 'skipper', 'fuehrer'].forEach(function (k) {
        if (f[k]) f[k].value = t[k] || '';
      });
      (t.crew || []).forEach(function (c) { $('crewRows').appendChild(crewZeile(c)); });
      if (!(t.crew || []).length) $('crewRows').appendChild(crewZeile());
      (t.wetterquellen || []).forEach(function (q) { $('wqRows').appendChild(wqZeile(q)); });
      if (!(t.wetterquellen || []).length) $('wqRows').appendChild(wqZeile());
      var alt = $('toernWeg'); if (alt) alt.parentNode.removeChild(alt);
      var weg = knopf('Törn löschen', 'b b-ghost sm', function () {
        if (!confirm('Törn „' + t.name + '“ mit allen Einträgen endgültig löschen?\n\nDas lässt sich nicht rückgängig machen. Lege vorher besser eine Sicherung an.')) return;
        db.toerns = db.toerns.filter(function (x) { return x.id !== t.id; }); sichern(); aktiv = null; listeZeichnen(); zeige('v-liste');
      });
      weg.id = 'toernWeg'; weg.style.marginLeft = 'auto'; weg.style.color = '#c0392b';
      f.querySelector('.row-btns').appendChild(weg);
    }
    zeige('v-stamm');
  }
  $('stammForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = this, daten = {};
    ['name', 'revier', 'start', 'ziel', 'von', 'bis', 'schiffName', 'schiffTyp', 'flagge', 'rufzeichen', 'mmsi', 'charter', 'skipper', 'fuehrer'].forEach(function (k) {
      daten[k] = f[k] ? f[k].value.trim() : '';
    });
    daten.crew = zeilenLesen($('crewRows'));
    daten.wetterquellen = zeilenLesen($('wqRows'));
    if (!daten.fuehrer) daten.fuehrer = daten.skipper;
    if (stammModus === 'neu') {
      var t = { id: id(), erstellt: new Date().toISOString(), eintraege: [], tage: {} };
      for (var k in daten) t[k] = daten[k];
      db.toerns.push(t); sichern(); buchOeffnen(t.id);
    } else {
      var tt = toern(aktiv); if (!tt) return;
      for (var k2 in daten) tt[k2] = daten[k2];
      sichern(); buchOeffnen(tt.id);
    }
  });
  $('stammAbbrechen').onclick = $('stammZurueck').onclick = function () {
    if (stammModus === 'neu' || !aktiv) { listeZeichnen(); zeige('v-liste'); } else buchOeffnen(aktiv);
  };
  $('crewPlus').onclick = function () { $('crewRows').appendChild(crewZeile()); };
  $('wqPlus').onclick = function () { $('wqRows').appendChild(wqZeile()); };
  $('btnNeuerToern').onclick = function () { stammOeffnen('neu'); };

  /* ================= Logbuch ================= */
  function buchOeffnen(tid) {
    aktiv = tid; var t = toern(tid); if (!t) { zeige('v-liste'); return; }
    location.hash = 't=' + tid;
    $('buchTitel').textContent = t.name;
    var sub = [];
    if (t.schiffName) sub.push(t.schiffName + (t.flagge ? ' · ' + t.flagge : '') + (t.rufzeichen ? ' · ' + t.rufzeichen : ''));
    sub.push('Schiffsführer: ' + (t.skipper || '–'));
    if (t.revier) sub.push(t.revier);
    $('buchSub').textContent = sub.join('  ·  ');
    fuehrerFuellen(t);
    eintragFormSchliessen();
    eintraegeZeichnen(t);
    zeige('v-buch');
  }
  function personen(t) {
    var p = [];
    if (t.skipper) p.push(t.skipper);
    (t.crew || []).forEach(function (c) { if (c.name && p.indexOf(c.name) < 0) p.push(c.name); });
    if (t.fuehrer && p.indexOf(t.fuehrer) < 0) p.unshift(t.fuehrer);
    return p;
  }
  function fuehrerFuellen(t) {
    var s = $('fuehrerWahl'); s.innerHTML = '';
    personen(t).forEach(function (n) { var o = el('option', null, n); o.value = n; s.appendChild(o); });
    if (!s.options.length) { var o2 = el('option', null, '–'); o2.value = ''; s.appendChild(o2); }
    s.value = t.fuehrer || t.skipper || '';
    s.onchange = function () { t.fuehrer = s.value; sichern(); };
  }
  $('buchZurueck').onclick = function () { aktiv = null; location.hash = ''; listeZeichnen(); zeige('v-liste'); };
  $('btnStamm').onclick = function () { var t = toern(aktiv); if (t) stammOeffnen('bearbeiten', t); };
  $('btnExport').onclick = function () { var t = toern(aktiv); if (t) exportieren(t); };
  $('btnDruck').onclick = function () { druckZeichnen(); zeige('v-druck'); };
  $('druckZurueck').onclick = function () { buchOeffnen(aktiv); };
  $('btnDruckJetzt').onclick = function () { window.print(); };

  /* ---------- Eintragsmaske ---------- */
  var form = $('eintragForm'), berichtigt = null;
  (function auswahlenFuellen() {
    var a = $('artWahl');
    EREIGNISSE.forEach(function (e) { if (e.id === 'berichtigung') return; var o = el('option', null, e.id ? e.icon + '  ' + e.name : e.name); o.value = e.id; a.appendChild(o); });
    var w = $('windRiWahl');
    STRICHE.forEach(function (s) { var o = el('option', null, s || '–'); o.value = s; w.appendChild(o); });
    var s2 = $('seeWahl');
    SEE.forEach(function (s) { var o = el('option', null, s || '–'); o.value = s ? s.charAt(0) : ''; s2.appendChild(o); });
    var s3 = $('sichtWahl');
    SICHT.forEach(function (s) { var o = el('option', null, s[1]); o.value = s[0]; s3.appendChild(o); });
    var box = $('ereignisKnoepfe');
    EREIGNISSE.forEach(function (e) {
      if (e.knopf === false) return;
      box.appendChild(knopf(e.icon + ' ' + e.name, '', function () { eintragFormOeffnen(e.id); }));
    });
  })();

  function letzterEintrag(t) { return t.eintraege.length ? t.eintraege[t.eintraege.length - 1] : null; }

  function eintragFormOeffnen(art, vorlage, berichtigungVon) {
    var t = toern(aktiv); if (!t) return;
    berichtigt = berichtigungVon || null;
    var l = vorlage || letzterEintrag(t) || {}, e = ereignis(art || '');
    form.hidden = false;
    form.datum.value = (vorlage && vorlage.datum) || heute();
    form.uhrzeit.value = (vorlage && vorlage.zeit) || jetztZeit();
    form.art.value = berichtigt ? (vorlage && vorlage.art !== 'berichtigung' ? vorlage.art || '' : '') : (art || '');
    if (!form.art.value && art) form.art.value = '';
    // Träge Werte werden vorbelegt. Position, Log, Fahrt, Motorzähler und Ort nicht –
    // die gehören zu DIESEM Zeitpunkt und würden sonst einen alten Wert als Tatsache festschreiben.
    var UEBERNEHMEN = ['kurs', 'kompass', 'windRi', 'windBft', 'boeen', 'see', 'sicht', 'druck', 'wolken', 'temp', 'segel'];
    var FRISCH = ['ort', 'pos', 'log', 'fahrt', 'motorStd'];
    UEBERNEHMEN.forEach(function (k) { form[k].value = (vorlage ? vorlage[k] : l[k]) != null ? (vorlage ? vorlage[k] : l[k]) : ''; });
    FRISCH.forEach(function (k) { form[k].value = vorlage && vorlage[k] != null ? vorlage[k] : ''; });
    form.bemerkung.value = vorlage ? (vorlage.bemerkung || '') : '';
    form.motor.checked = !!l.motor;
    if (!vorlage && e.vor) for (var k in e.vor) { if (k === 'motor') form.motor.checked = e.vor[k]; else if (form[k]) form[k].value = e.vor[k]; }
    $('eintragTitel').textContent = berichtigt ? 'Berichtigung zu Nr. ' + berichtigt : (art ? e.icon + ' ' + e.name : 'Neuer Eintrag');
    $('eintragHinweis').textContent = berichtigt ? 'Der ursprüngliche Eintrag bleibt stehen und wird als berichtigt gekennzeichnet.'
      : 'Werte aus dem letzten Eintrag sind vorbelegt – ändere nur, was sich geändert hat.';
    wacheFeld(t, form.art.value);
    form.scrollIntoView({ block: 'nearest' });
    (berichtigt ? form.bemerkung : form.pos).focus();
    if (!vorlage) autoGps();
  }
  function eintragFormSchliessen() { form.hidden = true; berichtigt = null; }
  function wacheFeld(t, art) {
    var f = $('wacheFeld'), s = $('wacheWahl');
    f.hidden = art !== 'wache';
    if (f.hidden) return;
    s.innerHTML = '';
    personen(t).forEach(function (n) { var o = el('option', null, n); o.value = n; s.appendChild(o); });
    var jetzt = $('fuehrerWahl').value;
    for (var i = 0; i < s.options.length; i++) if (s.options[i].value !== jetzt) { s.selectedIndex = i; break; }
  }
  $('artWahl').addEventListener('change', function () { var t = toern(aktiv); if (t) wacheFeld(t, this.value); });
  function autoGps() { // nur wenn die Ortsfreigabe schon erteilt ist – sonst käme ungefragt ein Dialog
    if (!navigator.geolocation || !navigator.permissions || !navigator.permissions.query) return;
    try {
      navigator.permissions.query({ name: 'geolocation' }).then(function (st) {
        if (st.state !== 'granted' || form.hidden || form.pos.value) return;
        navigator.geolocation.getCurrentPosition(function (p) {
          if (!form.hidden && !form.pos.value) form.pos.value = posFormat(p.coords.latitude, p.coords.longitude);
        }, function () { }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 });
      }, function () { });
    } catch (e) { }
  }
  $('btnNeuerEintrag').onclick = function () { eintragFormOeffnen(''); };
  $('eintragAbbrechen').onclick = eintragFormSchliessen;
  $('btnJetzt').onclick = function () { var d = new Date(); form.datum.value = heute(d); form.uhrzeit.value = jetztZeit(d); };

  $('btnGps').onclick = function () {
    if (!navigator.geolocation) { alert('Dieses Gerät gibt keine Position heraus. Bitte von Hand eintragen.'); return; }
    var b = $('btnGps'), alt = b.textContent; b.textContent = '…'; b.disabled = true;
    navigator.geolocation.getCurrentPosition(function (p) {
      form.pos.value = posFormat(p.coords.latitude, p.coords.longitude);
      if (p.coords.speed != null && !isNaN(p.coords.speed) && p.coords.speed > 0 && !form.fahrt.value) form.fahrt.value = dez(p.coords.speed * 1.94384);
      if (p.coords.heading != null && !isNaN(p.coords.heading) && !form.kurs.value) form.kurs.value = String(Math.round(p.coords.heading));
      b.textContent = alt; b.disabled = false;
    }, function (err) {
      b.textContent = alt; b.disabled = false;
      alert('Position nicht verfügbar (' + (err && err.message ? err.message : 'abgelehnt') + ').\nBitte von Hand eintragen, z. B. 43°12,4\' N  016°23,8\' E');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 });
  };
  function posFormat(lat, lon) {
    function g(w, pos, neg, stellen) {
      var r = w < 0 ? neg : pos, a = Math.abs(w), d = Math.floor(a), m = (a - d) * 60;
      var ds = String(d); while (ds.length < stellen) ds = '0' + ds;
      return ds + '°' + (m < 10 ? '0' : '') + m.toFixed(1).replace('.', ',') + "' " + r;
    }
    return g(lat, 'N', 'S', 2) + '  ' + g(lon, 'E', 'W', 3);
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var t = toern(aktiv); if (!t) return;
    var e = {
      id: id(),
      nr: (t.eintraege.reduce(function (m, x) { return Math.max(m, x.nr || 0); }, 0) || 0) + 1,
      datum: form.datum.value, zeit: form.uhrzeit.value,
      art: berichtigt ? 'berichtigung' : form.art.value,
      berichtigungZu: berichtigt || null,
      ort: form.ort.value.trim(), pos: form.pos.value.trim(),
      kurs: form.kurs.value.trim(), kompass: form.kompass.value.trim(),
      log: form.log.value.trim(), fahrt: form.fahrt.value.trim(),
      windRi: form.windRi.value, windBft: form.windBft.value.trim(), boeen: form.boeen.value.trim(),
      see: form.see.value, sicht: form.sicht.value, druck: form.druck.value.trim(),
      wolken: form.wolken.value.trim(), temp: form.temp.value.trim(),
      segel: form.segel.value.trim(), motor: form.motor.checked, motorStd: form.motorStd.value.trim(),
      bemerkung: form.bemerkung.value.trim(),
      verfasser: $('fuehrerWahl').value || t.fuehrer || t.skipper || '',
      erstellt: new Date().toISOString()
    };
    if (e.art === 'wache') {
      var neu = $('wacheWahl').value;
      if (neu) {
        if (!e.bemerkung) e.bemerkung = 'Wache und Logbuchführung übernommen von ' + neu + '.';
        t.fuehrer = neu;
      }
    }
    var vor = letzterEintrag(t);
    hash((vor && vor.pruef ? vor.pruef : '') + '|' + eintragText(e)).then(function (h) {
      e.pruef = h;
      if (e.berichtigungZu) {
        t.eintraege.forEach(function (x) { if (x.nr === e.berichtigungZu) x.korrigiertDurch = e.nr; });
      }
      t.eintraege.push(e);
      if (!t.von || e.datum < t.von) t.von = e.datum;
      if (!t.bis || e.datum > t.bis) t.bis = e.datum;
      sichern();
      eintragFormSchliessen();
      fuehrerFuellen(t);
      eintraegeZeichnen(t);
      var zeile = document.querySelector('[data-eid="' + e.id + '"]');
      if (zeile) zeile.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  });

  /* ---------- Einträge anzeigen ---------- */
  function werteZeile(e) {
    var s = [];
    if (e.pos) s.push(e.pos);
    if (e.kurs) s.push('Kurs ' + e.kurs + '°' + (e.kompass ? ' (MgK ' + e.kompass + '°)' : ''));
    if (e.log) s.push('Log ' + e.log + ' sm');
    if (e.fahrt) s.push(e.fahrt + ' kn');
    if (e.windRi || e.windBft) s.push('Wind ' + (e.windRi || '') + (e.windBft ? ' ' + e.windBft + ' Bft' : '') + (e.boeen ? ', Böen ' + e.boeen : ''));
    if (e.see) s.push('See ' + e.see);
    if (e.sicht) s.push('Sicht ' + e.sicht);
    if (e.druck) s.push(e.druck + ' hPa');
    if (e.wolken) s.push(e.wolken + '/8');
    if (e.temp) s.push(e.temp + ' °C');
    if (e.segel) s.push(e.segel);
    if (e.motor) s.push('Motor läuft' + (e.motorStd ? ' (' + e.motorStd + ' h)' : ''));
    else if (e.motorStd) s.push('Motorzähler ' + e.motorStd + ' h');
    return s.join(' · ');
  }
  function eintraegeZeichnen(t) {
    var box = $('eintraege'); box.innerHTML = '';
    var tage = tageVon(t);
    if (!tage.length) {
      var leer = el('div', 'lb-leer');
      leer.appendChild(el('p', null, 'Noch kein Eintrag. Beim Ablegen geht es los – tippe auf „🚢 Ablegen“.'));
      box.appendChild(leer); return;
    }
    tage.slice().reverse().forEach(function (tag) {
      var w = tagesWerte(t, tag), blk = el('section', 'lb-tag');
      var h = el('h3');
      var zus = [w.n + (w.n === 1 ? ' Eintrag' : ' Einträge')];
      if (w.meilen) zus.push(dez(w.meilen) + ' sm');
      if (w.motor) zus.push('Motor ' + dez(w.motor) + ' h');
      h.appendChild(el('b', null, datumLang(tag)));
      h.appendChild(el('span', null, zus.join(' · ')));
      blk.appendChild(h);

      // Tageswetter
      var tg = t.tage[tag] || (t.tage[tag] = {});
      var wet = el('div', 'lb-wetter');
      if ((t.wetterquellen || []).length) {
        var q = el('div', 'wq');
        q.appendChild(el('span', 'lb-klein', 'Wetterquellen:'));
        t.wetterquellen.forEach(function (x) {
          if (!x.url) return;
          var a = el('a', null, x.name || x.url); a.href = x.url; a.target = '_blank'; a.rel = 'noopener'; q.appendChild(a);
        });
        wet.appendChild(q);
      }
      var ta = el('textarea'); ta.rows = 2; ta.placeholder = 'Wetterbericht des Tages (Vorhersage, Warnungen, Quelle)'; ta.value = tg.wetter || '';
      ta.oninput = function () { tg.wetter = ta.value; spaeterSichern(); };
      wet.appendChild(ta);
      blk.appendChild(wet);

      var ul = el('ul', 'lb-eintraege');
      t.eintraege.filter(function (e) { return e.datum === tag; })
        .sort(function (a, b) { return (a.zeit || '').localeCompare(b.zeit || '') || a.nr - b.nr; })
        .forEach(function (e) { ul.appendChild(eintragZeile(t, e)); });
      blk.appendChild(ul);

      var fuss = el('div', 'lb-tagfuss');
      var sum = el('div', 'summe');
      sum.appendChild(wert(w.meilen ? dez(w.meilen) : '–', 'Tagesmeilen'));
      sum.appendChild(wert(w.motor ? dez(w.motor) : '–', 'Motorstunden'));
      sum.appendChild(wert(w.n, 'Einträge'));
      fuss.appendChild(sum);
      var tb = el('textarea'); tb.rows = 2; tb.placeholder = 'Tagesbericht (Strecke, Besonderheiten, Zustand von Schiff und Crew)'; tb.value = tg.bericht || '';
      tb.oninput = function () { tg.bericht = tb.value; spaeterSichern(); };
      fuss.appendChild(tb);
      blk.appendChild(fuss);
      box.appendChild(blk);
    });
  }
  var sichernTimer = null;
  function spaeterSichern() { clearTimeout(sichernTimer); sichernTimer = setTimeout(sichern, 600); }

  function eintragZeile(t, e) {
    var li = el('li', 'lb-e'); li.setAttribute('data-eid', e.id);
    if (e.korrigiertDurch) li.classList.add('korrigiert');
    if (e.art === 'berichtigung') li.classList.add('berichtigung');
    var z = el('div', 'zeit', e.zeit);
    z.appendChild(el('span', 'nr', 'Nr. ' + e.nr));
    li.appendChild(z);
    var rechts = el('div');
    var kopf = el('div', 'kopf');
    var er = ereignis(e.art);
    if (e.art) {
      var badge = el('span', 'ereignis' + (er.warn ? ' warn' : ''), e.art === 'berichtigung' ? '✎ Berichtigung zu Nr. ' + e.berichtigungZu : er.icon + ' ' + er.name);
      kopf.appendChild(badge);
    }
    if (e.ort) kopf.appendChild(el('b', null, e.ort));
    if (kopf.childNodes.length) rechts.appendChild(kopf);
    var w = werteZeile(e);
    if (w) rechts.appendChild(el('div', 'werte', w));
    if (e.bemerkung) rechts.appendChild(el('div', 'bem', e.bemerkung));
    var fuss = el('div', 'fuss');
    var zeitpunkt = e.erstellt ? new Date(e.erstellt) : null;
    fuss.appendChild(el('span', null, 'eingetragen ' + (zeitpunkt ? jetztZeit(zeitpunkt) + ' Uhr' : '') + (e.verfasser ? ' von ' + e.verfasser : '')));
    if (e.korrigiertDurch) fuss.appendChild(el('span', null, '→ berichtigt mit Nr. ' + e.korrigiertDurch));
    else fuss.appendChild(knopf('Berichtigen', '', function () { eintragFormOeffnen(e.art, e, e.nr); }));
    rechts.appendChild(fuss);
    li.appendChild(rechts);
    return li;
  }

  /* ================= Druckansicht ================= */
  var SPALTEN = ['Nr.', 'Zeit', 'Position', 'Kurs rw / MgK', 'Log (sm)', 'Fahrt (kn)', 'Wind', 'See', 'Sicht', 'Druck', 'Besegelung / Antrieb', 'Ereignis und Bemerkung', 'Eintrag von'];
  function td(text, cls, span) { var d = el('td', cls, text == null ? '' : String(text)); if (span) d.colSpan = span; return d; }
  function druckZeichnen() {
    var t = toern(aktiv); if (!t) return;
    var blatt = $('druckBlatt'); blatt.innerHTML = '';
    var tab = el('table', 'lb-tabelle');
    var cg = el('colgroup');
    [3, 4, 11.5, 6, 5.5, 4.5, 5, 3.5, 4.5, 4.5, 11, 28, 8.5].forEach(function (w) { var c = el('col'); c.style.width = w + '%'; cg.appendChild(c); });
    tab.appendChild(cg);

    var thead = el('thead');
    var kopf = el('tr', 'lb-kopfzeile');
    var kz = el('div', 'kz');
    kz.appendChild(el('span', 't', t.name));
    function paar(label, wert) { if (!wert) return; var s = el('span', 'p'); s.innerHTML = label + ': <b>' + String(wert).replace(/[<&]/g, ' ') + '</b>'; kz.appendChild(s); }
    paar('Schiff', (t.schiffName || '') + (t.schiffTyp ? ' (' + t.schiffTyp + ')' : ''));
    paar('Flagge', t.flagge); paar('Rufzeichen', t.rufzeichen); paar('MMSI', t.mmsi);
    paar('Schiffsführer', t.skipper); paar('Logbuchführer', t.fuehrer);
    var crew = (t.crew || []).filter(function (c) { return c.name; }).map(function (c) { return c.name + (c.rolle ? ' (' + c.rolle + ')' : ''); }).join(', ');
    paar('Crew', crew);
    var kzTd = td('', null, SPALTEN.length); kzTd.appendChild(kz); kopf.appendChild(kzTd);
    thead.appendChild(kopf);
    var tr = el('tr');
    SPALTEN.forEach(function (s) { tr.appendChild(el('th', null, s)); });
    thead.appendChild(tr);
    tab.appendChild(thead);

    var tbody = el('tbody');
    tageVon(t).forEach(function (tag) {
      var tg = t.tage[tag] || {}, w = tagesWerte(t, tag);
      var tz = el('tr', 'lb-tagzeile');
      var c = td('', null, SPALTEN.length);
      c.appendChild(el('span', null, datumLang(tag)));
      if (tg.wetter) c.appendChild(el('span', 'wb', '   Wetterbericht: ' + tg.wetter));
      tz.appendChild(c); tbody.appendChild(tz);

      t.eintraege.filter(function (e) { return e.datum === tag; })
        .sort(function (a, b) { return (a.zeit || '').localeCompare(b.zeit || '') || a.nr - b.nr; })
        .forEach(function (e) {
          var r = el('tr'), durch = e.korrigiertDurch ? 'lb-durch' : null;
          var er = ereignis(e.art);
          var ereignisText = (e.art === 'berichtigung' ? 'Berichtigung zu Nr. ' + e.berichtigungZu : (e.art ? er.name : ''));
          if (e.ort) ereignisText += (ereignisText ? ' – ' : '') + e.ort;
          if (e.bemerkung) ereignisText += (ereignisText ? ': ' : '') + e.bemerkung;
          if (e.korrigiertDurch) ereignisText += '   [berichtigt mit Nr. ' + e.korrigiertDurch + ']';
          [e.nr, e.zeit, e.pos, (e.kurs ? e.kurs + '°' : '') + (e.kompass ? ' / ' + e.kompass + '°' : ''), e.log, e.fahrt,
            (e.windRi || '') + (e.windBft ? ' ' + e.windBft : '') + (e.boeen ? ' (' + e.boeen + ')' : ''), e.see, e.sicht, e.druck,
            (e.segel || '') + (e.motor ? (e.segel ? ', ' : '') + 'Motor' : '') + (e.motorStd ? ' ' + e.motorStd + ' h' : ''),
            ereignisText, e.verfasser].forEach(function (v, i) { r.appendChild(td(v, i >= 2 && i <= 11 ? durch : null)); });
          tbody.appendChild(r);
        });

      var sz = el('tr', 'lb-summe');
      var st = td('', null, SPALTEN.length);
      st.textContent = 'Tagesabschluss ' + datumKurz(tag) + ' – Tagesmeilen: ' + (w.meilen ? dez(w.meilen) + ' sm' : '–') +
        ' · Motorstunden: ' + (w.motor ? dez(w.motor) + ' h' : '–') + (tg.bericht ? ' · ' + tg.bericht : '');
      sz.appendChild(st); tbody.appendChild(sz);
    });
    tab.appendChild(tbody);

    var tfoot = el('tfoot'), ftr = el('tr'), ftd = td('', null, SPALTEN.length);
    var u = el('div', 'lb-unterschrift');
    var letzter = letzterEintrag(t);
    var links = el('div');
    links.appendChild(el('div', null, 'Ausdruck aus dem digitalen Logbuch der SailingX-Academy · erstellt am ' + datumKurz(heute()) + ', ' + jetztZeit() + ' Uhr'));
    links.appendChild(el('div', null, 'Prüfwert des letzten Eintrags: ' + (letzter && letzter.pruef ? letzter.pruef : '–') + ' · Einträge gesamt: ' + t.eintraege.length));
    u.appendChild(links);
    u.appendChild(el('div', 'sig', 'Schiffsführer'));
    u.appendChild(el('div', 'sig', 'Logbuchführer'));
    ftd.appendChild(u); ftr.appendChild(ftd); tfoot.appendChild(ftr); tab.appendChild(tfoot);

    blatt.appendChild(tab);
  }

  /* ================= Sichern / Einlesen ================= */
  function exportieren(t) {
    var daten = { typ: 'sailingx-logbuch', v: 1, erzeugt: new Date().toISOString(), toern: t };
    var name = 'logbuch-' + (t.name || 'toern').toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-|-$/g, '') + '-' + heute() + '.json';
    var a = el('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(daten, null, 1)], { type: 'application/json' }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 400);
  }
  $('btnImport').onclick = function () { $('importFile').click(); };
  $('importFile').onchange = function () {
    var f = this.files && this.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        var liste = d.toern ? [d.toern] : (d.toerns || []);
        if (!liste.length) throw new Error('keine Törndaten');
        var neu = 0, ersetzt = 0;
        liste.forEach(function (t) {
          if (!t.id) t.id = id();
          if (!t.eintraege) t.eintraege = []; if (!t.tage) t.tage = {};
          var vorhanden = toern(t.id);
          if (vorhanden) {
            if (!confirm('„' + (t.name || 'Törn') + '“ ist bereits vorhanden.\n\nOK = durch die Sicherung ersetzen, Abbrechen = als zweiten Törn hinzufügen.')) { t.id = id(); t.name = (t.name || 'Törn') + ' (eingelesen)'; db.toerns.push(t); neu++; return; }
            db.toerns = db.toerns.map(function (x) { return x.id === t.id ? t : x; }); ersetzt++;
          } else { db.toerns.push(t); neu++; }
        });
        sichern(); listeZeichnen(); zeige('v-liste');
        alert('Eingelesen: ' + neu + ' neu, ' + ersetzt + ' ersetzt.');
      } catch (e) { alert('Die Datei konnte nicht gelesen werden. Bitte eine Sicherung aus diesem Logbuch wählen.'); }
    };
    r.readAsText(f); this.value = '';
  };

  /* ================= Start ================= */
  var h = (location.hash || '').replace('#', '');
  if (h.indexOf('t=') === 0 && toern(h.slice(2))) buchOeffnen(h.slice(2));
  else { listeZeichnen(); zeige('v-liste'); }
})();
