/* ==========================================================================
   SailingX-Academy – Üben
   1) Wiederholungsstapel: falsch beantwortete Selbsttest-Fragen
   2) Trainer: Lichter (Nacht), Signalkörper (Tag), Seezeichen (IALA Region A)
   ========================================================================== */
(function(){
  'use strict';
  var $ = function(id){ return document.getElementById(id); };
  function el(tag, cls, txt){ var x = document.createElement(tag); if (cls) x.className = cls; if (txt != null) x.textContent = txt; return x; }
  function shuffle(a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------------- Tabs ---------------- */
  var TABS = ['wiederholen', 'lichter', 'signalkoerper', 'seezeichen'];
  function showTab(name){
    if (TABS.indexOf(name) < 0) name = 'wiederholen';
    TABS.forEach(function(t){
      $('tab-' + t).setAttribute('aria-selected', t === name ? 'true' : 'false');
      $('panel-' + t).classList.toggle('on', t === name);
    });
    if (name === 'wiederholen') stapelStart();
    else if (!trainers[name].started) trainers[name].start();
  }
  window.addEventListener('hashchange', function(){ showTab(location.hash.slice(1)); });

  /* ================================================================
     1) Wiederholungsstapel
     ================================================================ */
  var KEY = 'segelacademy_fehler_v1';
  var FR = window.FRAGEN || {};
  function laden(){ var st = {}; try { st = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
    // nur Fragen, die es (noch) gibt
    Object.keys(st).forEach(function(k){ var o = st[k]; if (!FR[o.p] || !FR[o.p].q[o.i]) delete st[k]; });
    return st; }
  function speichern(st){ try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function zaehlen(){ var n = Object.keys(laden()).length; $('stapelCnt').textContent = n; $('stapelCnt').style.display = n ? '' : 'none'; return n; }

  var queue = [], pos = 0, richtig = 0;
  function stapelStart(){
    var st = laden(), box = $('stapelBox');
    queue = shuffle(Object.keys(st)); pos = 0; richtig = 0;
    box.innerHTML = '';
    zaehlen();
    if (!queue.length) {
      var d = el('div', 'done-box');
      d.appendChild(el('div', 'big', '⚓'));
      d.appendChild(el('p', null, 'Dein Stapel ist leer – sehr gut! Sobald du in einem Selbsttest eine Frage falsch beantwortest, landet sie hier. Eine Frage verschwindet wieder, wenn du sie zweimal hintereinander richtig beantwortest.'));
      var r = el('div', 'row-btns'); var a = el('a', 'b b-primary', 'Zum Kurs →'); a.href = 'kurs.html'; r.appendChild(a);
      var a2 = el('a', 'b b-ghost', 'Lichter trainieren'); a2.href = '#lichter'; r.appendChild(a2);
      d.appendChild(r); box.appendChild(d);
      return;
    }
    // Übersicht nach Lektion
    var byL = {};
    queue.forEach(function(k){ var p = st[k].p; byL[p] = (byL[p] || 0) + 1; });
    var info = el('p', 'intro', queue.length + (queue.length === 1 ? ' Frage wartet' : ' Fragen warten') + ' auf dich. Beantworte jede zweimal hintereinander richtig, dann ist sie erledigt.');
    box.appendChild(info);
    var r = el('div', 'row-btns');
    var go = el('button', 'b b-primary', 'Stapel üben →'); go.type = 'button'; go.onclick = frage; r.appendChild(go);
    var clr = el('button', 'b b-ghost', 'Stapel leeren'); clr.type = 'button';
    clr.onclick = function(){ if (clr.getAttribute('data-sure')) { speichern({}); stapelStart(); } else { clr.setAttribute('data-sure', '1'); clr.textContent = 'Wirklich leeren?'; } };
    r.appendChild(clr); box.appendChild(r);
    var ul = el('ul', 'stapel-list');
    Object.keys(byL).sort(function(a, b){ return a < b ? -1 : 1; }).forEach(function(p){
      var li = el('li'); var a = el('a', null, FR[p].n + ' ' + FR[p].t); a.href = 'kurs.html#' + encodeURIComponent(p);
      li.appendChild(a); li.appendChild(el('span', null, byL[p] + (byL[p] === 1 ? ' Frage' : ' Fragen'))); ul.appendChild(li);
    });
    box.appendChild(ul);
  }

  function frage(){
    var box = $('stapelBox'), st = laden();
    while (pos < queue.length && !st[queue[pos]]) pos++;
    box.innerHTML = '';
    if (pos >= queue.length) {
      var d = el('div', 'done-box');
      d.appendChild(el('div', 'big', richtig + ' / ' + queue.length));
      d.appendChild(el('p', null, 'Runde beendet. Noch ' + Object.keys(st).length + ' Fragen im Stapel.'));
      var r = el('div', 'row-btns'); var b = el('button', 'b b-primary', 'Weiter üben'); b.type = 'button'; b.onclick = stapelStart; r.appendChild(b);
      d.appendChild(r); box.appendChild(d); zaehlen(); return;
    }
    var k = queue[pos], o = st[k], L = FR[o.p], Q = L.q[o.i];
    var m = el('div', 'meter'); var mi = el('i'); mi.style.width = Math.round(pos / queue.length * 100) + '%'; m.appendChild(mi); box.appendChild(m);
    var h = el('div', 'qhead'); h.appendChild(el('span', null, 'Frage ' + (pos + 1) + ' von ' + queue.length + (o.s ? ' · schon 1× richtig' : '')));
    var la = el('a', null, L.n + ' ' + L.t); la.href = 'kurs.html#' + encodeURIComponent(o.p); h.appendChild(la); box.appendChild(h);
    var qt = el('div', 'qtext'); qt.innerHTML = Q.q; box.appendChild(qt);
    var fb = el('div', 'feedback');
    var btns = [];
    Q.opts.forEach(function(txt, oi){
      var b = el('button', 'opt'); b.type = 'button'; b.innerHTML = txt; b.appendChild(el('span', 'mark'));
      b.onclick = function(){
        btns.forEach(function(x, xi){ x.disabled = true; if (xi === Q.correct) { x.classList.add('correct'); x.querySelector('.mark').textContent = '✓'; } });
        var ok = oi === Q.correct, st2 = laden();
        if (!ok) { b.classList.add('wrong'); b.querySelector('.mark').textContent = '✗'; }
        if (st2[k]) { if (ok) { st2[k].s = (st2[k].s || 0) + 1; if (st2[k].s >= 2) delete st2[k]; } else st2[k].s = 0; speichern(st2); }
        if (ok) richtig++;
        fb.innerHTML = '<b>' + (ok ? (st2[k] ? 'Richtig! Noch einmal richtig, dann ist die Frage erledigt.' : 'Richtig – erledigt! ✓') : 'Leider falsch.') + '</b> ' + (Q.expl || '');
        fb.classList.add('show'); nx.disabled = false; zaehlen();
      };
      btns.push(b); box.appendChild(b);
    });
    box.appendChild(fb);
    var r = el('div', 'row-btns'); var nx = el('button', 'b b-primary', 'Weiter →'); nx.type = 'button'; nx.disabled = true;
    nx.onclick = function(){ pos++; frage(); }; r.appendChild(nx); box.appendChild(r);
  }

  /* ================================================================
     2) Trainer – Zeichenhilfen (SVG)
     ================================================================ */
  var C = { W: '#fff6d8', R: '#ff3b30', G: '#2ee27a', Y: '#ffc72c' };
  function nacht(lights){
    var s = '<svg viewBox="0 0 400 230" role="img" aria-label="Nachtszene mit Lichtern">' +
      '<defs><linearGradient id="nh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05080c"/><stop offset="1" stop-color="#0d1a24"/></linearGradient>' +
      '<filter id="gl" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="5"/></filter></defs>' +
      '<rect width="400" height="230" fill="url(#nh)"/><rect y="176" width="400" height="54" fill="#071016"/>' +
      '<line x1="0" y1="176" x2="400" y2="176" stroke="#1b2d3a" stroke-width="1"/>';
    [[40,30],[92,58],[140,22],[300,40],[352,70],[260,18],[70,120],[330,130]].forEach(function(p){ s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r=".8" fill="#6b7c88"/>'; });
    lights.forEach(function(l){
      var c = C[l[0]];
      s += '<circle cx="' + l[1] + '" cy="' + l[2] + '" r="9" fill="' + c + '" opacity=".55" filter="url(#gl)"/>' +
           '<circle cx="' + l[1] + '" cy="' + l[2] + '" r="3.6" fill="' + c + '"/>' +
           '<circle cx="' + l[1] + '" cy="' + l[2] + '" r="1.6" fill="#fff" opacity=".7"/>';
    });
    return s + '</svg>';
  }
  // Signalkörper: Formen am Mast (schwarz)
  function form(t, cx, cy){
    var k = '#111';
    switch (t) {
      case 'ball': return '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="' + k + '"/>';
      case 'kegelOben': return '<polygon points="' + cx + ',' + (cy - 10) + ' ' + (cx - 10) + ',' + (cy + 9) + ' ' + (cx + 10) + ',' + (cy + 9) + '" fill="' + k + '"/>';
      case 'kegelUnten': return '<polygon points="' + cx + ',' + (cy + 10) + ' ' + (cx - 10) + ',' + (cy - 9) + ' ' + (cx + 10) + ',' + (cy - 9) + '" fill="' + k + '"/>';
      case 'rhombus': return '<polygon points="' + cx + ',' + (cy - 12) + ' ' + (cx + 9) + ',' + cy + ' ' + cx + ',' + (cy + 12) + ' ' + (cx - 9) + ',' + cy + '" fill="' + k + '"/>';
      case 'zylinder': return '<rect x="' + (cx - 8) + '" y="' + (cy - 12) + '" width="16" height="24" fill="' + k + '"/>';
      case 'stundenglas': return '<polygon points="' + (cx - 10) + ',' + (cy - 18) + ' ' + (cx + 10) + ',' + (cy - 18) + ' ' + cx + ',' + cy + '" fill="' + k + '"/>' +
                                 '<polygon points="' + (cx - 10) + ',' + (cy + 18) + ' ' + (cx + 10) + ',' + (cy + 18) + ' ' + cx + ',' + cy + '" fill="' + k + '"/>';
    }
    return '';
  }
  function tag(formen, segel){
    var s = '<svg viewBox="0 0 400 230" role="img" aria-label="Tagszene mit Signalkörpern">' +
      '<defs><linearGradient id="th" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f3"/><stop offset="1" stop-color="#e8f4fb"/></linearGradient></defs>' +
      '<rect width="400" height="230" fill="url(#th)"/><rect y="182" width="400" height="48" fill="#2f6f8f"/>' +
      '<path d="M0 190 Q50 186 100 190 T200 190 T300 190 T400 190" stroke="#5e97b3" stroke-width="2" fill="none"/>' +
      '<path d="M110 168 L300 168 L282 190 L126 190 Z" fill="#dfe5e9" stroke="#5b6770" stroke-width="2"/>' +
      '<rect x="150" y="150" width="70" height="18" fill="#c9d2d8" stroke="#5b6770" stroke-width="2"/>' +
      '<line x1="200" y1="36" x2="200" y2="168" stroke="#5b6770" stroke-width="3"/>' +
      '<line x1="200" y1="44" x2="120" y2="168" stroke="#8a969e" stroke-width="1.5"/>';
    if (segel) s += '<path d="M204 48 L204 160 L270 160 Z" fill="#fff" stroke="#8a969e" stroke-width="1.5"/>';
    // Signalkörper hängen am Vorstag/Mast (x ~ 176)
    var n = formen.length, y0 = 70;
    s += '<line x1="176" y1="' + (y0 - 20) + '" x2="176" y2="' + (y0 + n * 30) + '" stroke="#5b6770" stroke-width="1"/>';
    formen.forEach(function(f, i){ s += form(f, 176, y0 + i * 30); });
    return s + '</svg>';
  }
  // Seezeichen (IALA Region A)
  var BC = { r: '#d7263d', g: '#1f9d55', y: '#f4c20d', k: '#151515', w: '#ffffff' };
  function tonne(z){
    var s = '<svg viewBox="0 0 400 230" role="img" aria-label="Seezeichen">' +
      '<defs><linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6f3"/><stop offset="1" stop-color="#eef6fb"/></linearGradient>' +
      '<clipPath id="tk"><path d="' + koerper(z.form) + '"/></clipPath></defs>' +
      '<rect width="400" height="230" fill="url(#sh)"/><rect y="186" width="400" height="44" fill="#2f6f8f"/>';
    // Farbfelder im Körper
    s += '<g clip-path="url(#tk)">';
    if (z.senkrecht) { // rot-weiß senkrecht gestreift
      for (var i = 0; i < 8; i++) s += '<rect x="' + (160 + i * 10) + '" y="60" width="10" height="140" fill="' + (i % 2 ? BC.w : BC.r) + '"/>';
    } else {
      var n = z.baender.length, top = z.form === 'saeule' ? 92 : 112, bot = 196, h = (bot - top) / n;
      z.baender.forEach(function(c, i){ s += '<rect x="140" y="' + (top + i * h) + '" width="120" height="' + (h + .5) + '" fill="' + BC[c] + '"/>'; });
    }
    s += '</g><path d="' + koerper(z.form) + '" fill="none" stroke="#333" stroke-width="1.5"/>';
    s += '<path d="M130 196 Q200 204 270 196" stroke="#8fc0d6" stroke-width="3" fill="none"/>';
    // Toppzeichen
    var ty = z.form === 'saeule' ? 92 : 112;
    s += '<line x1="200" y1="' + ty + '" x2="200" y2="' + (ty - 16) + '" stroke="#333" stroke-width="3"/>';
    s += topp(z.topp, 200, ty - 16);
    return s + '</svg>';
  }
  function koerper(f){
    if (f === 'stumpf') return 'M172 112 L228 112 L234 196 L166 196 Z';
    if (f === 'spitz') return 'M200 106 L236 196 L164 196 Z';
    return 'M188 92 L212 92 L222 170 L236 196 L164 196 L178 170 Z'; // Leuchttonne / Säule
  }
  function topp(t, cx, y){ // y = Oberkante des Stabs
    var c = t.c ? BC[t.c] : BC.k, s = '';
    function kegel(up, cy){ return up ? '<polygon points="' + cx + ',' + (cy - 11) + ' ' + (cx - 11) + ',' + (cy + 9) + ' ' + (cx + 11) + ',' + (cy + 9) + '" fill="' + c + '"/>' :
                                         '<polygon points="' + cx + ',' + (cy + 11) + ' ' + (cx - 11) + ',' + (cy - 9) + ' ' + (cx + 11) + ',' + (cy - 9) + '" fill="' + c + '"/>'; }
    switch (t.t) {
      case 'zylinder': s = '<rect x="' + (cx - 9) + '" y="' + (y - 22) + '" width="18" height="22" fill="' + c + '" stroke="#333"/>'; break;
      case 'kegel': s = kegel(true, y - 11); break;
      case 'nord': s = kegel(true, y - 11) + kegel(true, y - 37); break;
      case 'sued': s = kegel(false, y - 11) + kegel(false, y - 37); break;
      case 'ost': s = kegel(false, y - 11) + kegel(true, y - 35); break;   // Basen zueinander
      case 'west': s = kegel(true, y - 11) + kegel(false, y - 35); break;  // Spitzen zueinander
      case 'baelle2': s = '<circle cx="' + cx + '" cy="' + (y - 9) + '" r="8" fill="' + BC.k + '"/><circle cx="' + cx + '" cy="' + (y - 28) + '" r="8" fill="' + BC.k + '"/>'; break;
      case 'ball': s = '<circle cx="' + cx + '" cy="' + (y - 10) + '" r="9" fill="' + c + '" stroke="#333"/>'; break;
      case 'kreuz': s = '<g stroke="' + c + '" stroke-width="5" stroke-linecap="round"><line x1="' + (cx - 10) + '" y1="' + (y - 24) + '" x2="' + (cx + 10) + '" y2="' + (y - 4) + '"/><line x1="' + (cx + 10) + '" y1="' + (y - 24) + '" x2="' + (cx - 10) + '" y2="' + (y - 4) + '"/></g>'; break;
    }
    return s;
  }

  /* ================================================================
     Szenarien (KVR / COLREGs, IALA Region A)
     Bildkoordinaten: Seitenlichter y≈160, Topplicht y≈110.
     Von vorn gesehen steht die Steuerbordseite (grün) LINKS.
     ================================================================ */
  var LICHTER = [
    { a: 'Maschinenfahrzeug unter 50 m – von vorn', l: [['W',200,110],['G',186,160],['R',214,160]],
      x: 'Ein Topplicht über beiden Seitenlichtern: Ein Maschinenfahrzeug kommt genau auf dich zu. Kommen sich zwei Maschinenfahrzeuge auf entgegengesetzten Kursen entgegen, weichen beide nach Steuerbord aus (KVR Regel 14).' },
    { a: 'Maschinenfahrzeug – Steuerbordseite', l: [['W',195,110],['G',222,160]],
      x: 'Topplicht und grünes Seitenlicht: Du siehst seine Steuerbordseite – es fährt in deinem Blickfeld von links nach rechts.' },
    { a: 'Maschinenfahrzeug – Backbordseite', l: [['W',205,110],['R',178,160]],
      x: 'Topplicht und rotes Seitenlicht: Du siehst seine Backbordseite – es fährt in deinem Blickfeld von rechts nach links.' },
    { a: 'Maschinenfahrzeug ab 50 m – Steuerbordseite', l: [['W',236,124],['W',164,94],['G',242,160]],
      x: 'Zwei Topplichter: Maschinenfahrzeug ab 50 m Länge. Das achtere Topplicht steht höher als das vordere. Grün sichtbar und das niedrigere (vordere) Licht rechts: Es fährt nach rechts.' },
    { a: 'Einzelnes weißes Licht: Hecklicht oder Ankerlieger unter 50 m', l: [['W',200,150]],
      x: 'Ein einzelnes weißes Licht ist nicht eindeutig: das Hecklicht (135°) eines Fahrzeugs, das du von hinten siehst, oder das Ankerlicht (Rundumlicht) eines Ankerliegers unter 50 m. Weiter beobachten!' },
    { a: 'Segelfahrzeug in Fahrt – von vorn', l: [['G',188,160],['R',212,160]],
      x: 'Nur Rot und Grün, kein Topplicht: Ein Segelfahrzeug kommt auf dich zu. Führt ein Segler zusätzlich ein Topplicht, fährt er unter Motor und gilt als Maschinenfahrzeug.' },
    { a: 'Segler unter 20 m mit Dreifarbenlaterne – von vorn', l: [['G',197,74],['R',203,74]],
      x: 'Rot und Grün dicht nebeneinander hoch oben im Mast: die Dreifarbenlaterne eines Seglers unter 20 m, von vorn gesehen.' },
    { a: 'Segelfahrzeug mit „rot über grün“ – Steuerbordseite', l: [['R',200,70],['G',200,86],['G',222,160]],
      x: '„Rot über grün“ als Rundumlichter im Topp kennzeichnet ein Segelfahrzeug (zusätzlich erlaubt, aber nicht zusammen mit der Dreifarbenlaterne). Dazu das grüne Seitenlicht: Du siehst seine Steuerbordseite.' },
    { a: 'Ankerlieger ab 50 m', l: [['W',246,96],['W',154,126]],
      x: 'Zwei weiße Rundumlichter, das vordere höher als das achtere: ein Ankerlieger ab 50 m Länge.' },
    { a: 'Manövrierunfähig – ohne Fahrt durchs Wasser', l: [['R',200,92],['R',200,110]],
      x: '„Rot über rot“: manövrierunfähig. Ohne Seiten- und Hecklicht macht es keine Fahrt durchs Wasser. Es kann nicht ausweichen – halte dich frei.' },
    { a: 'Manövrierunfähig – macht Fahrt, von vorn', l: [['R',200,80],['R',200,98],['G',186,160],['R',214,160]],
      x: '„Rot über rot“ plus beide Seitenlichter, aber kein Topplicht: manövrierunfähig und in Fahrt, von vorn gesehen. Freihalten!' },
    { a: 'Manövrierbehindert – ohne Fahrt', l: [['R',200,78],['W',200,96],['R',200,114]],
      x: '„Rot-weiß-rot“: manövrierbehindert, z. B. beim Baggern oder Kabellegen. Ohne weitere Lichter macht es keine Fahrt. Freihalten!' },
    { a: 'Tiefgangbehindert – von vorn', l: [['R',200,60],['R',200,76],['R',200,92],['W',200,118],['G',186,160],['R',214,160]],
      x: 'Drei rote Rundumlichter zusätzlich zu den Lichtern eines Maschinenfahrzeugs: tiefgangbehindert – es kann das Fahrwasser nicht verlassen. Nicht behindern!' },
    { a: 'Trawler beim Fischen – in Fahrt, von vorn', l: [['G',200,86],['W',200,104],['G',186,160],['R',214,160]],
      x: '„Grün über weiß“: ein Trawler (schleppt ein Netz). Mit Seitenlichtern macht er Fahrt – hier von vorn. Fischende Fahrzeuge sind freizuhalten.' },
    { a: 'Fischer, nicht schleppend – Backbordseite', l: [['R',200,86],['W',200,104],['R',176,160]],
      x: '„Rot über weiß“: ein Fischer, der nicht schleppt (z. B. mit Stellnetzen oder Leinen). Das rote Seitenlicht zeigt seine Backbordseite.' },
    { a: 'Lotsenfahrzeug im Dienst – von vorn', l: [['W',200,86],['R',200,104],['G',186,160],['R',214,160]],
      x: '„Weiß über rot“: ein Lotsenfahrzeug im Dienst (Merkhilfe: „weiße Mütze, rote Nase“). Mit Seitenlichtern in Fahrt, von vorn gesehen.' },
    { a: 'Auf Grund gelaufen (unter 50 m)', l: [['W',252,100],['R',176,90],['R',176,108]],
      x: 'Ankerlicht plus „rot über rot“: ein Fahrzeug, das auf Grund gelaufen ist. Hier ist es flach – Abstand halten!' },
    { a: 'Schleppverband – Schlepper von hinten', l: [['Y',200,132],['W',200,150]],
      x: 'Gelbes Schlepplicht über dem weißen Hecklicht: ein schleppendes Fahrzeug von hinten. Niemals zwischen Schlepper und Anhang durchfahren!' },
    { a: 'Schleppendes Maschinenfahrzeug (Schleppverband bis 200 m) – von vorn', l: [['W',200,92],['W',200,110],['G',186,160],['R',214,160]],
      x: 'Zwei Topplichter senkrecht übereinander plus Seitenlichter: ein Maschinenfahrzeug, das schleppt (Schleppverband bis 200 m; über 200 m drei Topplichter). Achtung: Von genau vorn kann auch ein Fahrzeug über 50 m ähnlich aussehen – dessen achteres Topplicht steht aber deutlich höher.' }
  ];
  var SIGNALE = [
    { a: 'Vor Anker', f: ['ball'], x: 'Ein schwarzer Ball im Vorschiff: Das Fahrzeug liegt vor Anker.' },
    { a: 'Manövrierunfähig', f: ['ball','ball'], x: 'Zwei Bälle senkrecht übereinander: manövrierunfähig – nachts „rot über rot“.' },
    { a: 'Manövrierbehindert', f: ['ball','rhombus','ball'], x: 'Ball – Rhombus – Ball: manövrierbehindert – nachts „rot-weiß-rot“.' },
    { a: 'Tiefgangbehindert', f: ['zylinder'], x: 'Ein Zylinder: tiefgangbehindert – nachts drei rote Rundumlichter.' },
    { a: 'Auf Grund gelaufen', f: ['ball','ball','ball'], x: 'Drei Bälle senkrecht übereinander: auf Grund gelaufen – nachts Ankerlicht plus „rot über rot“.' },
    { a: 'Segler unter Motor (gilt als Maschinenfahrzeug)', f: ['kegelUnten'], s: true, x: 'Ein Kegel mit der Spitze nach unten: Ein Segelfahrzeug fährt unter Motor und gilt als Maschinenfahrzeug.' },
    { a: 'Fischendes Fahrzeug', f: ['stundenglas'], x: 'Zwei Kegel mit den Spitzen zueinander (Stundenglas): ein fischendes Fahrzeug.' },
    { a: 'Schleppverband über 200 m', f: ['rhombus'], x: 'Ein Rhombus (auf Schlepper und Anhang): Der Schleppverband ist länger als 200 m.' }
  ];
  var ZEICHEN = [
    { a: 'Lateralzeichen Backbord – beim Einlaufen links lassen', z: { form: 'stumpf', baender: ['r'], topp: { t: 'zylinder', c: 'r' } },
      x: 'Rote Stumpftonne mit rotem Zylinder (Region A): Backbordseite des Fahrwassers. Beim Einlaufen an Backbord lassen. Befeuerung rot, gerade Nummern.' },
    { a: 'Lateralzeichen Steuerbord – beim Einlaufen rechts lassen', z: { form: 'spitz', baender: ['g'], topp: { t: 'kegel', c: 'g' } },
      x: 'Grüne Spitztonne mit grünem Kegel (Spitze oben): Steuerbordseite des Fahrwassers. Beim Einlaufen an Steuerbord lassen. Befeuerung grün, ungerade Nummern.' },
    { a: 'Nord-Kardinalzeichen – nördlich passieren', z: { form: 'saeule', baender: ['k','y'], topp: { t: 'nord' } },
      x: 'Beide Kegelspitzen nach oben, schwarz oben: Nordzeichen. Sicheres Wasser liegt nördlich. Befeuerung: ununterbrochenes weißes Funkeln.' },
    { a: 'Ost-Kardinalzeichen – östlich passieren', z: { form: 'saeule', baender: ['k','y','k'], topp: { t: 'ost' } },
      x: 'Kegel mit den Grundflächen zueinander, schwarz-gelb-schwarz: Ostzeichen. Sicheres Wasser liegt östlich. Befeuerung: Funkeln in Dreiergruppen.' },
    { a: 'Süd-Kardinalzeichen – südlich passieren', z: { form: 'saeule', baender: ['y','k'], topp: { t: 'sued' } },
      x: 'Beide Kegelspitzen nach unten, schwarz unten: Südzeichen. Sicheres Wasser liegt südlich. Befeuerung: sechs Funkelblitze und ein langer Blitz.' },
    { a: 'West-Kardinalzeichen – westlich passieren', z: { form: 'saeule', baender: ['y','k','y'], topp: { t: 'west' } },
      x: 'Kegelspitzen zueinander, gelb-schwarz-gelb: Westzeichen. Sicheres Wasser liegt westlich. Befeuerung: Funkeln in Neunergruppen.' },
    { a: 'Einzelgefahrenzeichen – rundum passierbar, aber Abstand halten', z: { form: 'saeule', baender: ['k','r','k'], topp: { t: 'baelle2' } },
      x: 'Schwarz-rot-schwarz mit zwei schwarzen Bällen: eine kleine, allseits umfahrbare Gefahr direkt unter dem Zeichen. Befeuerung: weiße Blitze in Zweiergruppen.' },
    { a: 'Zeichen für sicheres Wasser (Fahrwassermitte/Ansteuerung)', z: { form: 'saeule', senkrecht: true, topp: { t: 'ball', c: 'r' } },
      x: 'Rot-weiß senkrecht gestreift mit rotem Ball: sicheres Wasser rundum, z. B. Fahrwassermitte oder Ansteuerung. Befeuerung weiß (Gleichtakt, Unterbrechung, langer Blitz oder Morse „A“).' },
    { a: 'Sonderzeichen (z. B. Sperr- oder Übungsgebiet)', z: { form: 'saeule', baender: ['y'], topp: { t: 'kreuz', c: 'y' } },
      x: 'Gelb mit gelbem, liegendem Kreuz: Sonderzeichen für besondere Gebiete (Fischzucht, Übungsgebiet, Kabel …). Kein Navigationszeichen für das Fahrwasser; Befeuerung gelb.' }
  ];

  /* ---------------- Trainer-Logik ---------------- */
  function Trainer(key, pool, stem, draw, cap){
    this.key = key; this.pool = pool; this.stem = stem; this.draw = draw; this.cap = cap; this.started = false;
  }
  Trainer.prototype.start = function(){
    this.started = true;
    this.round = shuffle(this.pool).slice(0, Math.min(10, this.pool.length));
    this.pos = 0; this.ok = 0; this.show();
  };
  Trainer.prototype.show = function(){
    var self = this, box = $('box-' + this.key); box.innerHTML = '';
    if (this.pos >= this.round.length) {
      var d = el('div', 'done-box');
      d.appendChild(el('div', 'big', this.ok + ' / ' + this.round.length));
      d.appendChild(el('p', null, this.ok === this.round.length ? 'Perfekt – alles erkannt! ⚓' : (this.ok >= this.round.length * .6 ? 'Gut gemacht! Eine weitere Runde festigt es.' : 'Übung macht den Skipper – gleich noch eine Runde?')));
      var r = el('div', 'row-btns'); var b = el('button', 'b b-primary', 'Neue Runde'); b.type = 'button'; b.onclick = function(){ self.start(); }; r.appendChild(b);
      d.appendChild(r); box.appendChild(d); return;
    }
    var S = this.round[this.pos];
    var m = el('div', 'meter'); var mi = el('i'); mi.style.width = Math.round(this.pos / this.round.length * 100) + '%'; m.appendChild(mi); box.appendChild(m);
    var h = el('div', 'qhead'); h.appendChild(el('span', null, 'Bild ' + (this.pos + 1) + ' von ' + this.round.length)); h.appendChild(el('span', null, this.ok + ' richtig')); box.appendChild(h);
    var sc = el('div', 'scene'); sc.innerHTML = this.draw(S); box.appendChild(sc);
    if (this.cap) box.appendChild(el('p', 'scene-cap', this.cap));
    box.appendChild(el('div', 'qtext', this.stem));
    var opts = shuffle([S].concat(shuffle(this.pool.filter(function(x){ return x !== S; })).slice(0, 3)));
    var fb = el('div', 'feedback'), btns = [];
    opts.forEach(function(o){
      var b = el('button', 'opt', o.a); b.type = 'button'; b.appendChild(el('span', 'mark'));
      b.onclick = function(){
        btns.forEach(function(x, xi){ x.disabled = true; if (opts[xi] === S) { x.classList.add('correct'); x.querySelector('.mark').textContent = '✓'; } });
        var ok = o === S; if (ok) self.ok++; else { b.classList.add('wrong'); b.querySelector('.mark').textContent = '✗'; }
        fb.innerHTML = '<b>' + (ok ? 'Richtig!' : 'Nicht ganz.') + '</b> ' + S.x; fb.classList.add('show'); nx.disabled = false; nx.focus();
      };
      btns.push(b); box.appendChild(b);
    });
    box.appendChild(fb);
    var r = el('div', 'row-btns'); var nx = el('button', 'b b-primary', 'Weiter →'); nx.type = 'button'; nx.disabled = true;
    nx.onclick = function(){ self.pos++; self.show(); }; r.appendChild(nx); box.appendChild(r);
  };

  var trainers = {
    lichter: new Trainer('lichter', LICHTER, 'Nachts siehst du diese Lichter. Was ist das?', function(s){ return nacht(s.l); },
      'Vereinfachte Darstellung – Rumpf und Aufbauten sind nachts nicht zu sehen.'),
    signalkoerper: new Trainer('signalkoerper', SIGNALE, 'Tagsüber zeigt ein Fahrzeug diese Signalkörper. Was bedeuten sie?', function(s){ return tag(s.f, s.s); }),
    seezeichen: new Trainer('seezeichen', ZEICHEN, 'Welches Seezeichen ist das (IALA Region A)?', function(s){ return tonne(s.z); })
  };

  zaehlen();
  showTab(location.hash.slice(1));
})();
