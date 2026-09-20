/* ==========================================================================
   SailingX-Academy – Szenen der Lektionen (nutzt assets/szenen.js)
   Koordinaten: Bühne 800 × 460 px, y nach unten. Kurse/Richtungen in Grad:
   0 = nach oben, 90 = nach rechts. „wind“ = Richtung, AUS der der Wind kommt.
   Ruder: + = Steuerbord (Boot dreht nach Stb), − = Backbord.
   Schiffsseiten in Bootskoordinaten: x + = Steuerbord, y + = achtern.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.SX; if (!S) return;
  var F = S.F, f1 = S.f1, lerp = S.lerp, clamp = S.clamp;
  var K = 1.6;                     // Bootsmaßstab Segelmanöver (Länge ≈ 102 px)
  var KM = 1.5;                    // Bootsmaßstab Hafenmanöver
  function boot(x, y, h, k, extra) { var st = { x: x, y: y, h: h, k: k || KM, t: 0 }; for (var e in extra || {}) st[e] = extra[e]; return S.zeichneBoot(st, { fremd: true }); }
  function kaiOben(poller, text) { return S.kai(0, 0, 800, 70, { kante: 'unten', poller: poller || [], text: text || '', tx: 14, ty: 22 }); }
  function rotesX(x, y) { return '<g stroke="' + F.rot + '" stroke-width="7" stroke-linecap="round" opacity=".9"><line x1="' + (x - 22) + '" y1="' + (y - 22) + '" x2="' + (x + 22) + '" y2="' + (y + 22) + '"/><line x1="' + (x + 22) + '" y1="' + (y - 22) + '" x2="' + (x - 22) + '" y2="' + (y + 22) + '"/></g>'; }
  function hinweisBox(x, y, text, farbe) {
    var w = text.length * 7.4 + 26;
    return '<g transform="translate(' + x + ',' + y + ')"><rect x="' + f1(-w / 2) + '" y="-16" width="' + f1(w) + '" height="30" rx="9" fill="' + (farbe || F.navy) + '"/><text x="0" y="4" class="sx-ruf-t">' + S.esc(text) + '</text></g>';
  }
  S.hinweisBox = hinweisBox; S.rotesX = rotesX; S.kaiOben = kaiOben; S.fremdBoot = boot;

  /* ================================================================ */
  /*  A.2.1.1  Anlegen unter Segel                                     */
  /* ================================================================ */
  S.szene('anlegen-segel', function () {
    var b = S.Bahn({ x: 720, y: 326, h: 315, props: { fock: 'weg' } })
      .fahr(235, 5.5, {})
      .kurve(-22, 230, 2.1, {})
      .kurve(-23, 230, 2.1, { gross: 'weg', fender: 'stb', fenderHeck: true })
      .fahr(52, 2.2, { zeige: { crew: 1 } }, 'lin')
      .fahr(18, 1.6, { leinen: [{ von: [5, 29], nach: [412, 62], label: 'Achterleine', ly: 14, lx: -10 }] }, 'aus')
      .warte(2.5, {});
    return {
      titel: 'Anlegen unter Segel', shots: [S.manoever({
        bahn: b, wind: 270, massstab: K, roseX: 748, roseY: 400,
        kulisse: function () {
          return kaiOben([[160, 58], [412, 62], [700, 58]]) + boot(160, 93, 270, K) + boot(700, 93, 270, K);
        },
        nachher: function (t, st) {
          if (!st.show || !st.show.crew || t > 13.4) return '';
          var p = S.local2world(st, [13 * K, -2]);
          return '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1] - 6) + '" r="6" fill="' + F.orange + '" stroke="#fff" stroke-width="1.5"/>' + S.label(p[0] - 44, p[1] + 58, 'Crew steigt über');
        },
        steps: [
          { t: 0, titel: 'Am Wind, mit wenig Segel und wenig Fahrt anlaufen', text: 'Nur mit kleiner Besegelung (hier nur das Groß) langsam auf die Lücke zuhalten – gegen den Wind.' },
          { t: 7.6, titel: 'Nahe genug: Segel blitzschnell bergen', text: 'Gelingt das nicht, das Segel killen lassen. Die Jacht gleitet mit der letzten Fahrt weiter.' },
          { t: 9.8, titel: 'Knapp an der Mauer vorbei – Crew steigt mittschiffs über', text: 'Die Fender hängen an der Mauerseite, das Heck ist gut abgefendert.' },
          { t: 11.9, titel: 'Achterleine belegen und „weich“ abstoppen', text: 'Das Crewmitglied legt die Achterleine um den Poller; an Bord wird über die Klampe weich abgestoppt.' },
          { t: 13.6, titel: 'Fest – restliche Leinen ausbringen', text: 'Grundsatz: gegen das stärker wirkende Element (Wind oder Strom) anlegen.' }
        ]
      })]
    };
  });

  /* ================================================================ */
  /*  A.2.1.2  Ablegen unter Segel – vier Windsituationen              */
  /* ================================================================ */
  S.szene('ablegen-segel', function () {
    var kulisse = function () { return kaiOben([[330, 58], [520, 58]]) + boot(120, 93, 270, K) + boot(690, 93, 270, K); };
    var fest = [{ von: [-5, -30], nach: [330, 58] }, { von: [5, 30], nach: [520, 58] }];
    var b1 = S.Bahn({ x: 420, y: 94, h: 270, props: { gross: 'killt', fock: 'weg', fender: 'stb', leinen: fest } })
      .warte(1.6, {})
      .bewege({ dy: 36, dh: -24, pivot: 10 }, 3.2, { leinen: null }, 'inaus')
      .kurve(-18, 160, 1.6, { gross: null, fock: null, fender: null })
      .fahr(150, 3.6, {});
    var b2 = S.Bahn({ x: 420, y: 94, h: 270, props: { gross: 'killt', fock: 'killt', fender: 'stb', fenderHeck: true, leinen: [{ von: [-5, -30], nach: [330, 58], label: 'Vorleine' }, { von: [5, 30], nach: [330, 58], label: 'Achterspring', ly: 22 }] } })
      .warte(1.8, { leinen: [{ von: [5, 30], nach: [330, 58], label: 'Achterspring', ly: 22 }] })
      .bewege({ dh: -36, pivot: 26 }, 3.4, { fockBack: -1 }, 'inaus')
      .warte(.8, { leinen: null, fockBack: null, fock: null, gross: null })
      .fahr(150, 3.6, { fender: null, fenderHeck: false });
    var b3 = S.Bahn({ x: 420, y: 94, h: 270, props: { gross: 'weg', fock: 'weg', fender: 'stb', leinen: fest } }).warte(6, {});
    var b4 = S.Bahn({ x: 420, y: 94, h: 270, props: { gross: 'weg', fock: 'weg', fender: 'stb', leinen: fest } }).warte(6, {});
    return {
      titel: 'Ablegen unter Segel', shots: [
        S.manoever({ bahn: b1, wind: 0, massstab: K, kulisse: kulisse, roseX: 748, roseY: 400,
          nachher: function () { return hinweisBox(400, 420, '✓ ablandig: leicht', F.gruen); },
          steps: [{ t: 0, titel: 'Ablandiger Wind – problemlos', text: 'Leinen los: Die Jacht treibt – Bug voran, weil er leichter ist – von der Mauer weg. Segel setzen, Fahrt aufnehmen.' }] }),
        S.manoever({ bahn: b2, wind: 270, massstab: K, kulisse: kulisse, roseX: 748, roseY: 400,
          nachher: function (t) { return hinweisBox(400, 420, '✓ Wind von vorne: machbar', F.gruen) + (t > 1.8 && t < 5.4 ? S.label(240, 200, 'Fock an der Außenseite backhalten') : ''); },
          steps: [
            { t: 0, titel: 'Wind von vorne – mit der Achterspring', text: 'Segel setzen, Heck gut abfendern, alle Leinen bis auf die Achterspring los.' },
            { t: 1.8, titel: 'Fock an der Außenseite backhalten', text: 'Der Winddruck auf die backstehende Fock dreht den Bug von der Mauer weg.' },
            { t: 6, titel: 'Achterspring los, Segel dicht, Fahrt aufnehmen', text: '' }] }),
        S.manoever({ bahn: b3, wind: 90, massstab: K, kulisse: kulisse, roseX: 748, roseY: 400,
          nachher: function () { return hinweisBox(400, 420, '⚠ achterlicher Wind: riskant', F.orange); },
          steps: [{ t: 0, titel: 'Achterlicher Wind parallel zur Mauer – riskant', text: 'Die Jacht vorher wenden (umdrehen) oder an eine günstigere Stelle verholen.' }] }),
        S.manoever({ bahn: b4, wind: 180, massstab: K, kulisse: kulisse, roseX: 748, roseY: 400,
          nachher: function () { return rotesX(420, 190) + hinweisBox(400, 420, '✗ auflandiger Wind: nicht möglich', F.rot); },
          steps: [{ t: 0, titel: 'Auflandiger Wind – nicht möglich', text: 'Der Wind drückt die Jacht an die Mauer. Unter Segel kommt sie nicht frei – an eine günstigere Stelle verholen.' }] })
      ]
    };
  });

  /* ================================================================ */
  /*  A.2.1.3  Die Wende                                               */
  /* ================================================================ */
  S.szene('wende', function () {
    var b = S.Bahn({ x: 250, y: 430, h: 45, props: { ruder: 0 } })
      .fahr(110, 3, {})
      .fahr(60, 1.8, { ruf: 'Klar zur Wende?' })
      .fahr(50, 1.5, { ruf: 'Ist klar!' })
      .kurve(-38, 70, 1.6, { ruf: 'Ree!', ruder: -25 }, 'ein')
      .kurve(-52, 70, 2.2, { ruf: null, ruder: -25 }, 'aus')
      .fahr(40, 1.6, { ruder: 0 })
      .fahr(190, 4.4, {});
    return {
      titel: 'Die Wende', shots: [S.manoever({
        bahn: b, wind: 0, massstab: K,
        kulisse: function () { return S.label(40, 416, 'Am Wind, Backbordbug') + S.label(90, 118, 'Am Wind, Steuerbordbug'); },
        steps: [
          { t: 0, titel: 'Am Wind auf Backbordbug', text: 'Der Wind kommt von Backbord, Groß und Fock stehen in Lee (Steuerbordseite).' },
          { t: 3, titel: '„Klar zur Wende?“ – „Ist klar!“', text: 'Der Rudergänger kündigt an, die Crew bereitet die Fockschoten vor und meldet klar.' },
          { t: 6.3, titel: '„Ree!“ – Ruder legen', text: 'Der Bug dreht in den Wind. Bei Jachten mit Backstagen folgt sofort „Backstagenwechsel“.' },
          { t: 7.6, titel: 'Im Wind: Segel killen, alte Fockschot los', text: 'Der Bug geht durch den Wind, die Segel verlieren kurz ihren Druck.' },
          { t: 9.2, titel: 'Fock auf der neuen Seite dichtholen', text: 'Groß und Fock gehen nach Lee – jetzt Backbord.' },
          { t: 11, titel: 'Am Wind auf Steuerbordbug', text: 'Der Bug ist durch den Wind gegangen – etwa 90° Kursänderung.' }
        ]
      })]
    };
  });

  /* ================================================================ */
  /*  A.2.1.4  Q-Wende (Boje-über-Bord)                                */
  /* ================================================================ */
  S.szene('q-wende', function () {
    var P0 = [126.5, 250], P1 = [126.5, 262];
    var b = S.Bahn({ x: 40, y: 250, h: 90 })
      .fahr(134, 2.62, {})
      .fahr(256, 4.98, { ruf: 'Boje über Bord!' })
      .kurve(-80, 58, 1.8, { ruf: null, ruder: -22 }, 'ein')
      .kurve(-155, 58, 3.7, {}, 'lin')
      .fahr(170, 3.4, { ruder: 0 })
      .kurve(65, 72, 2, { ruder: 20 })
      .kurve(62, 72, 2.2, { gross: 'killt', fock: 'killt' }, 'aus')
      .fahr(14, 1.3, { ruder: 0 }, 'aus')
      .warte(2);
    var fin = b.pose(b.t); P1 = S.local2world({ x: fin.x, y: fin.y, h: fin.h }, [15 * K, -19 * K]);
    function P(t) { var u = clamp((t - 2.62) / (b.t - 2 - 2.62), 0, 1); return [lerp(P0[0], P1[0], u), lerp(P0[1], P1[1], u)]; }
    return {
      titel: 'Q-Wende', shots: [S.manoever({
        bahn: b, wind: 0, massstab: K, roseX: 748, roseY: 400,
        vorher: function (t) { if (t < 2.62) return ''; var p = P(t); return S.person(p[0], p[1], t); },
        nachher: function (t) { return t > 2.62 && t < 8 ? S.label(P(t)[0] - 30, P(t)[1] + 32, 'Person / Boje') : ''; },
        steps: [
          { t: 0, titel: 'Halbwind-Kurs', text: 'Die Jacht segelt mit halbem Wind.' },
          { t: 2.62, titel: '„Boje über Bord!“', text: 'Rettungsring bzw. Boje nachwerfen, ein Crewmitglied beobachtet ständig.' },
          { t: 4.2, titel: 'Einige Bootslängen weitersegeln', text: 'Raum für das Manöver schaffen – die Person immer im Blick behalten.' },
          { t: 7.6, titel: 'Wenden', text: 'Die Jacht wendet und fällt anschließend auf einen raumen Kurs ab.' },
          { t: 13.1, titel: 'Zurück – in Lee der Person', text: 'Unterhalb (leewärts) der Person zurücksegeln.' },
          { t: 16.5, titel: 'Anluven zum Fast-Aufschießer', text: 'Auf Halbwind- bis Am-Wind-Kurs anluven, Schoten fieren – die Jacht läuft langsam aus.' },
          { t: 21.2, titel: 'Stopp: Person am Luvbug aufnehmen', text: 'Die Jacht steht fast im Wind; die Person ist in Luv am Bug und wird nicht überfahren.' }
        ]
      })]
    };
  });

  /* ================================================================ */
  /*  A.2.1.5  Die Halse                                               */
  /* ================================================================ */
  S.szene('halse', function () {
    var b = S.Bahn({ x: 50, y: 380, h: 57 })
      .fahr(100, 2.6, {})
      .fahr(70, 1.9, { ruf: 'Klar zur Halse?' })
      .fahr(50, 1.4, { ruf: 'Ist klar!' })
      .fahr(60, 2.4, { ruf: 'Großschot dicht!', gross: 'dicht' })
      .kurve(33, 90, 1.8, { ruf: 'Rund achtern!', ruder: 22 }, 'ein')
      .kurve(33, 90, 1.8, { ruf: null }, 'aus')
      .fahr(40, 1.6, { ruder: 0, ruf: 'Fieren!', gross: null })
      .fahr(200, 4.4, { ruf: null });
    return {
      titel: 'Die Halse', shots: [S.manoever({
        bahn: b, wind: 270, massstab: K, roseX: 748, roseY: 60,
        kulisse: function () { return S.label(20, 445, 'Raumschots, Backbordbug') + S.label(560, 445, 'Raumschots, Steuerbordbug'); },
        steps: [
          { t: 0, titel: 'Raumschots auf Backbordbug', text: 'Der Wind kommt schräg von achtern an Backbord, der Großbaum steht weit auf Steuerbord.' },
          { t: 2.6, titel: '„Klar zur Halse?“ – „Ist klar!“', text: 'Bei Backstagen: „Backstagenwechsel“ unmittelbar vor „Rund achtern“.' },
          { t: 5.9, titel: 'Großschot dichtholen', text: 'Der Baum kommt etwa mittschiffs – so kann er nicht schlagartig überkommen.' },
          { t: 8.3, titel: '„Rund achtern!“ – Heck durch den Wind', text: 'Der Baum geht kontrolliert auf die andere Seite.' },
          { t: 11.9, titel: 'Großschot fieren, Fock übernehmen', text: 'Das Groß wird auf dem neuen Bug wieder ausgelassen.' },
          { t: 13.5, titel: 'Raumschots auf Steuerbordbug', text: 'Das Heck ist durch den Wind gegangen.' }
        ]
      })]
    };
  });

  /* ================================================================ */
  /*  A.2.1.6  Schiften (vor dem Wind)                                 */
  /* ================================================================ */
  S.szene('schiften', function () {
    var b = S.Bahn({ x: -40, y: 250, h: 86 })
      .fahr(150, 3, {})
      .fahr(80, 2.2, { gross: 'dicht', ruf: 'Großschot dicht!' })
      .bewege({ dh: 8 }, 1.2, { ruf: 'Rüber!', grossSeite: -1 }, 'inaus')
      .fahr(40, 1.2, { ruf: null })
      .fahr(70, 2, { gross: null, ruf: 'Fieren!' })
      .fahr(260, 5.4, { ruf: null });
    return {
      titel: 'Schiften', shots: [S.manoever({
        bahn: b, wind: 270, massstab: K, roseX: 748, roseY: 400,
        steps: [
          { t: 0, titel: 'Vor dem Wind – Segel auf Steuerbord', text: 'Der Wind kommt genau von achtern.' },
          { t: 3, titel: 'Großschot dichtholen', text: 'Wie bei der Halse wird der Baum mittschiffs geholt.' },
          { t: 5.2, titel: 'Segel auf die andere Seite setzen', text: 'Der Baum geht kontrolliert über – der Kurs bleibt fast gleich.' },
          { t: 7.6, titel: 'Großschot fieren, Fock übernehmen', text: 'Die Segel stehen jetzt auf Backbord.' }
        ]
      })]
    };
  });

  /* ================================================================ */
  /*  A.2.1.7  Beidrehen & Beiliegen                                   */
  /* ================================================================ */
  S.szene('beidrehen', function () {
    var b = S.Bahn({ x: 250, y: 400, h: 45 })
      .fahr(130, 3.6, {})
      .kurve(-50, 60, 1.8, { fockBack: 1, gross: 'dicht', ruder: -25, ruf: 'Ree – Fock bleibt!' }, 'ein')
      .kurve(-45, 60, 1.8, { ruf: null }, 'aus')
      .bewege({ dx: -10, dy: 6, dh: 5 }, 2, { ruder: 30, ruf: 'Ruder auf Anluven' }, 'aus')
      .bewege({ dx: -12, dy: 44, dh: -6 }, 5, { ruf: null }, 'lin')
      .bewege({ dx: -8, dy: 40, dh: 5 }, 5, {}, 'lin');
    function wellen(t) {
      var s = '';
      for (var i = 0; i < 6; i++) {
        var y = ((t * 18 + i * 80) % 480) - 20;
        s += '<path d="M -20 ' + f1(y) + ' Q 100 ' + f1(y - 10) + ' 200 ' + f1(y) + ' T 420 ' + f1(y) + ' T 640 ' + f1(y) + ' T 860 ' + f1(y) + '" fill="none" stroke="#fff" stroke-width="2.4" opacity=".85"/>';
      }
      return s;
    }
    return {
      titel: 'Beidrehen', shots: [S.manoever({
        bahn: b, wind: 0, massstab: K, roseX: 748, roseY: 60,
        kulisse: function (t) { return t > 7 ? wellen(t) : ''; },
        vorher: function (t, st) {
          if (t < 9) return '';
          return '<ellipse cx="' + f1(st.x - 6) + '" cy="' + f1(st.y - 58) + '" rx="110" ry="30" fill="#eef7fb" opacity=".92"/>' + S.label(st.x - 60, st.y - 94, 'glattes Wasser in Luv');
        },
        nachher: function (t, st) { return t > 10 ? S.pfeil(st.x + 80, st.y - 10, st.x + 80, st.y + 50, 'blau') + S.label(st.x + 90, st.y + 30, 'treibt 1–3 kn nach Lee') : ''; },
        steps: [
          { t: 0, titel: 'Hart am Wind', text: 'Die Jacht geht hoch an den Wind.' },
          { t: 3.6, titel: 'Wie eine Wende einleiten – Fock bleibt', text: 'Nach dem Durchgehen durch den Wind wird die Fockschot nicht umgelegt: Die Fock steht back (orange).' },
          { t: 7.2, titel: 'Groß bleibt dicht – Ruder auf Anluven', text: 'Die backstehende Fock drückt den Bug weg, das Ruder hält dagegen – die Jacht kommt fast zum Stehen.' },
          { t: 9.2, titel: 'Beigedreht: fast quer zu Wind und See', text: 'Die Jacht treibt langsam nach Lee; die von Luv anrollenden Wellen brechen vor ihr.' }
        ]
      })]
    };
  });

  /* ================================================================ */
  /*  A.2.1.8  Ablegen von einer Boje (unter Segel)                    */
  /* ================================================================ */
  S.szene('boje-ablegen', function () {
    var B = [420, 170];
    var b = S.Bahn({ x: 420, y: 250, h: 0, props: { fock: 'weg', gross: 'killt', leinen: [{ von: [-4, -31], nach: B, slip: [4, -31] }] } })
      .warte(2.4, {})
      .warte(2, { fock: null, fockBack: 1, ruder: 25 })
      .bewege({ dh: -48, dy: 18, dx: -6 }, 3.6, { leinen: null }, 'inaus')
      .warte(.6, { fockBack: null, gross: null, ruder: 0 })
      .fahr(40, 1.4, {}, 'ein')
      .fahr(190, 4, {});
    return {
      titel: 'Ablegen von der Boje', shots: [S.manoever({
        bahn: b, wind: 0, massstab: K, roseX: 748, roseY: 60,
        vorher: function (t) { return S.boje(B[0], B[1], t); },
        nachher: function (t) { return t > 4.4 && t < 8.4 ? S.label(490, 230, 'Fock steht back → Bug dreht weg') : ''; },
        steps: [
          { t: 0, titel: 'Großsegel setzen, Absegelseite festlegen', text: 'Die Jacht liegt im Wind an der Boje, die Vorleine auf Slip.' },
          { t: 2.4, titel: 'Fock backsetzen, Ruder legen', text: 'Hier auf Steuerbord back – der Winddruck dreht den Bug nach Backbord.' },
          { t: 4.4, titel: 'Vorleine los', text: 'Die Leine auf Slip einholen; der Bug dreht von der Boje weg.' },
          { t: 8, titel: 'Frei: Segel dicht, Fahrt aufnehmen', text: 'Fock auf die Leeseite, Großsegel dicht – im Prinzip wie beim Anker-auf unter Segel.' }
        ]
      })]
    };
  });

  /* ================================================================ */
  /*  A.2.1.9  Mann über Bord – Quick-Stop                              */
  /* ================================================================ */
  S.szene('mob', function () {
    var b = S.Bahn({ x: 200, y: 300, h: 60 })
      .fahr(80, 2.4, {})
      .fahr(30, 1, { ruf: 'Mann über Bord!' })
      .kurve(-105, 55, 3, { ruf: null, fockSeite: 1, ruder: -25 }, 'ein')
      .kurve(-90, 65, 3, {})
      .fahr(140, 2.8, { ruder: 0 })
      .kurve(-40, 45, 1.5, { ruf: 'Halse!', ruder: -25 })
      .kurve(-140, 50, 3.4, { ruf: null })
      .fahr(30, 1.4, { gross: 'killt', fock: 'killt', ruder: 0 }, 'aus')
      .warte(2.2);
    var st0 = b.pose(2.4), P0 = S.local2world({ x: st0.x, y: st0.y, h: st0.h }, [0, 30 * K]);
    var fin = b.pose(b.t), P1 = S.local2world({ x: fin.x, y: fin.y, h: fin.h }, [-15 * K, -16 * K]);
    function P(t) { var u = clamp((t - 2.4) / (b.t - 2.2 - 2.4), 0, 1); return [lerp(P0[0], P1[0], u), lerp(P0[1], P1[1], u)]; }
    return {
      titel: 'Mann über Bord – Quick-Stop', shots: [S.manoever({
        bahn: b, wind: 0, massstab: K, roseX: 748, roseY: 60,
        vorher: function (t) { return t >= 2.4 ? S.person(P(t)[0], P(t)[1], t) : ''; },
        nachher: function (t) { return t > 2.4 && t < 6 ? S.label(P(t)[0] + 20, P(t)[1] + 32, 'Person im Wasser') : ''; },
        steps: [
          { t: 0, titel: 'Am Wind unterwegs', text: '' },
          { t: 2.4, titel: '„Mann über Bord!“', text: 'Rettungsmittel werfen, Beobachter einteilen, MOB-Taste am GPS drücken.' },
          { t: 3.4, titel: 'Sofort anluven und wenden – Fock bleibt back', text: 'Keine Schot wird bedient; die Jacht bleibt in der Nähe der Person.' },
          { t: 9.4, titel: 'Abfallen, raumschots ein Stück weg', text: 'Die backstehende Fock hilft beim Abfallen.' },
          { t: 12.2, titel: 'Halsen', text: 'Das Heck geht durch den Wind; die Fock steht danach wieder normal.' },
          { t: 13.7, titel: 'Aus Lee anluven', text: 'Schoten fieren, mit killenden Segeln langsam an die Person heran – sie kommt an die Luvseite.' },
          { t: 17.1, titel: 'Stopp neben der Person – aufnehmen', text: 'Motor erst neben der Person abstellen (Schraube!). Leine mit Schlaufe zuwerfen, über Badeleiter oder Talje an Bord holen.' }
        ]
      })]
    };
  });


  /* ================================================================ */
  /*  HAFENMANÖVER UNTER MOTOR – linksgängige Schraube wie im Lektionstext */
  /* ================================================================ */
  var LINKS = 'Beispiel: linksgängige Schraube';

  /* A.2.2.1  Anlegen an einer Boje */
  S.szene('boje-anlegen', function () {
    var B = [400, 118];
    var b = S.Bahn({ x: 400, y: 450, h: 0, props: { gang: 'voraus' } })
      .fahr(190, 5.2, {})
      .fahr(62, 3, { gang: 'neutral' }, 'aus')
      .fahr(16, 1.2, { gang: 'zurueck' }, 'aus')
      .warte(2.6, { gang: 'neutral', zeige: { haken: 1 } })
      .warte(3.2, { zeige: {}, leinen: [{ von: [-6, -29], nach: B, slip: [6, -29], label: 'Vorleine auf Slip', lx: 70, ly: 4 }] })
      .warte(2.4, {});
    return {
      titel: 'Anlegen an der Boje', shots: [S.manoever({
        bahn: b, wind: 0, motor: true, massstab: KM, roseX: 748, roseY: 60, hudX: 14, hudY: 372,
        vorher: function (t) { return S.boje(B[0], B[1], t); },
        nachher: function (t, st) {
          if (!st.show || !st.show.haken) return '';
          var a = S.local2world(st, [-6, -30]);
          return '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + B[0] + '" y2="' + (B[1] + 4) + '" stroke="#6d4c2f" stroke-width="3" stroke-linecap="round"/>' + S.label(B[0] + 18, B[1] - 12, 'Bootshaken');
        },
        steps: [
          { t: 0, titel: 'Langsam gegen Wind oder Strom anfahren', text: 'Die Boje liegt voraus – so bremst der Wind die Jacht, und sie bleibt steuerbar.' },
          { t: 5.2, titel: 'Auskuppeln und auslaufen lassen', text: 'Mit der letzten Fahrt heran; ein kurzer Schub rückwärts stoppt am Bug der Boje.' },
          { t: 9.4, titel: 'Boje mit dem Bootshaken aufnehmen', text: 'Wenn möglich die Boje herausheben.' },
          { t: 12, titel: 'Vorleine durch den Ring auf Slip', text: 'Beide Enden bleiben an Bord – später kann von Bord aus abgelegt werden.' }
        ]
      })]
    };
  });

  /* A.2.2.2  Anlegen längsseits unter Motor – Radeffekt nutzen */
  S.szene('anlegen-laengsseits', function () {
    var b = S.Bahn({ x: 620, y: 390, h: 0, props: { gang: 'voraus', fender: 'stb' } })
      .fahr(200, 5, {})
      .kurve(-80, 95, 4.2, { gang: 'neutral', ruder: -30 }, 'lin')
      .bewege({ dh: -10, pivot: -30 }, 1.8, { gang: 'zurueck', radeffekt: 1, ruder: 0 }, 'aus')
      .warte(1.2, { gang: 'neutral', radeffekt: 0 })
      .warte(3, { leinen: [{ von: [-5, -30], nach: [440, 58], label: 'Vorleine', ly: -6 }, { von: [5, 30], nach: [640, 58], label: 'Achterleine', ly: -6 }, { von: [4, -22], nach: [560, 58], label: 'Vorspring', lx: 6, ly: 16 }, { von: [4, 18], nach: [520, 58], label: 'Achterspring', lx: -40, ly: 16 }] });
    return {
      titel: 'Anlegen längsseits', shots: [S.manoever({
        bahn: b, motor: true, massstab: KM, schraube: LINKS,
        kulisse: function () { return kaiOben([[440, 58], [520, 58], [560, 58], [640, 58]]) + boot(260, 91, 270) + S.label(420, 440, 'Anlegen mit der Steuerbordseite'); },
        steps: [
          { t: 0, titel: 'Langsam, aber steuerbar, fast rechtwinklig anfahren', text: 'Hier wird mit der Steuerbordseite angelegt – bei linksgängiger Schraube die günstige Seite.' },
          { t: 5, titel: 'Etwa drei Bootslängen vorher: Leerlauf, Ruder legen', text: 'Die Jacht dreht parallel zur Mauer – nicht überdrehen!' },
          { t: 9.2, titel: 'Kurzer Schub rückwärts', text: 'Er stoppt die Jacht – und der Radeffekt zieht das Heck an die Mauer (roter Pfeil).' },
          { t: 11, titel: 'Auf den Fendern – Leinen ausbringen', text: 'Vor- und Achterleine sowie die Springs belegen.' }
        ]
      })]
    };
  });

  /* A.2.2.3  Rückwärts mit dem Heck zur Kaimauer */
  S.szene('heck-kaimauer', function () {
    var A = [400, 452];
    var ketteLose = [{ von: [0, -33], nach: A, lose: true, label: 'Ankerkette', lx: 12 }];
    var b = S.Bahn({ x: 400, y: 380, h: 180, props: { gang: 'neutral', fender: 'beide', fenderHeck: true, leinen: ketteLose } })
      .warte(1.2, {})
      .fahr(-180, 5.4, { gang: 'zurueck' }, 'inaus')
      .fahr(-58, 2.6, { gang: 'neutral' }, 'lin')
      .fahr(-16, 1.2, { gang: 'voraus' }, 'aus')
      .warte(1, { gang: 'neutral', leinen: [{ von: [0, -33], nach: A, label: 'Ankerkette steif', lx: 12 }] })
      .warte(3, { leinen: [{ von: [0, -33], nach: A, label: 'Ankerkette steif', lx: 12 }, { von: [-7, 32], nach: [440, 58], label: '' }, { von: [7, 32], nach: [360, 58], label: 'Heckleinen (gekreuzt)', lx: -140, ly: -2 }] });
    return {
      titel: 'Heck zur Kaimauer', shots: [S.manoever({
        bahn: b, motor: true, massstab: KM, schraube: LINKS, hudX: 596, hudY: 372,
        kulisse: function () {
          return kaiOben([[180, 58], [240, 58], [360, 58], [440, 58], [560, 58], [620, 58]]) +
            boot(190, 124, 180) + boot(290, 124, 180) + boot(510, 124, 180) + boot(610, 124, 180) +
            '<path d="M' + (A[0] - 7) + ',' + A[1] + ' l7,-8 l7,8 M' + A[0] + ',' + (A[1] - 8) + ' v-10" stroke="' + F.navy + '" stroke-width="2.4" fill="none"/>';
        },
        steps: [
          { t: 0, titel: 'Vor der Lücke: keine Fahrt, nicht drehen', text: 'Anker ist ausgebracht, Fender beidseitig, Heckleinen bereit.' },
          { t: 1.2, titel: 'Rückwärtsgang, sehr niedrige Drehzahl', text: 'Langsam achteraus in die Lücke, Kette nachstecken.' },
          { t: 6.6, titel: 'Einige Bootslängen vorher: Leerlauf', text: 'Die Jacht läuft aus. Ist sie zu schnell: kurz „Standgas voraus“.' },
          { t: 9.2, titel: 'Knapp vor der Mauer: kräftiger Schub voraus', text: 'Die Jacht stoppt. Nicht ständig die Drehzahl ändern!' },
          { t: 10.4, titel: 'Kette steif, Heckleinen ausbringen', text: 'Die Heckleinen auf Slip – gekreuzt wirken sie besser gegen seitliches Bewegen.' }
        ]
      })]
    };
  });

  /* A.2.2.4  Ablegen unter Motor – Derivation */
  S.szene('ablegen-motor', function () {
    var fest = [{ von: [-5, -30], nach: [300, 58] }, { von: [-5, 30], nach: [500, 58] }];
    var kulisse = function () { return kaiOben([[300, 58], [500, 58]]) + boot(150, 91, 90) + boot(660, 91, 90); };
    var b1 = S.Bahn({ x: 400, y: 91, h: 90, props: { gang: 'neutral', fender: 'bb', leinen: fest } })
      .warte(1.4, {})
      .warte(.6, { leinen: null, ruder: 30 })
      .bewege({ dh: 12, dx: 26, dy: 3 }, 2.4, { gang: 'voraus' }, 'inaus')
      .warte(2.4, { gang: 'neutral' });
    var b2 = S.Bahn({ x: 400, y: 91, h: 90, props: { gang: 'neutral', fender: 'bb', fenderBug: true, leinen: fest } })
      .warte(1.4, {})
      .warte(.6, { leinen: null, ruder: -30 })
      .bewege({ dh: -22, pivot: -40 }, 2.2, { gang: 'voraus' }, 'inaus')
      .bewege({ dh: -6, dx: -60, dy: 36 }, 2.6, { gang: 'zurueck', radeffekt: 1 }, 'ein')
      .bewege({ dh: -14, dx: -70, dy: 50 }, 2.6, { ruder: 25, radeffekt: 0 }, 'lin')
      .warte(1.4, { gang: 'neutral' });
    return {
      titel: 'Ablegen unter Motor', shots: [
        S.manoever({ bahn: b1, motor: true, massstab: KM, schraube: LINKS, kulisse: kulisse,
          nachher: function (t, st) {
            var s = t > 3.6 ? '' : S.label(st.x - 12, st.y + 42, '● Drehpunkt mittschiffs', 'sx-lbl-rot');
            if (t > 3.6) { var h = S.local2world(st, [-12, 32]); s += '<circle cx="' + f1(h[0]) + '" cy="' + f1(h[1]) + '" r="14" fill="none" stroke="' + F.rot + '" stroke-width="3"/>' + S.label(h[0] + 10, h[1] + 48, 'Heck schrammt an der Mauer!', 'sx-lbl-rot'); }
            return s + S.hinweisBox(400, 430, '✗ Falsch: Ruder von der Mauer weg', F.rot);
          },
          steps: [
            { t: 0, titel: 'Falsch: Ruder von der Mauer weg, Gas voraus', text: 'Der Drehpunkt liegt etwa mittschiffs (Derivation): Der Bug dreht zwar weg …' },
            { t: 3.4, titel: '… aber das Heck schwenkt zur Mauer', text: 'Daher: wenig Ruder, wenig Schub und gut abfendern – oder besser so wie im nächsten Schritt.' }] }),
        S.manoever({ bahn: b2, motor: true, massstab: KM, schraube: LINKS, kulisse: kulisse,
          nachher: function () { return S.hinweisBox(400, 430, '✓ Richtig: mit dem Radeffekt', F.gruen); },
          steps: [
            { t: 0, titel: 'Günstig: Backbordseite an der Mauer', text: 'Bei linksgängiger Schraube versetzt der Radeffekt rückwärts das Heck nach Steuerbord – von der Mauer weg.' },
            { t: 2, titel: 'Hart Ruder zur Landseite, kurz Gas voraus', text: 'Bug gut abfendern: Der Bug dreht zur Mauer, das Heck schwenkt weg.' },
            { t: 4.2, titel: 'Sofort Retourgang und Gas', text: 'Ohne Ruderänderung: Der Radeffekt dreht das Heck weiter weg (roter Pfeil).' },
            { t: 6.8, titel: 'Rückwärtsfahrt liegt an – jetzt Ruder legen', text: 'Die Jacht fährt frei.' }] })
      ]
    };
  });

  /* A.2.2.5  Ablegen mit Eindampfen in die Vorspring */
  S.szene('eindampfen', function () {
    var spring = [{ von: [4, -38], nach: [364, 58], slip: [7, -30], label: 'Vorspring auf Slip', lx: -40, ly: 54 }];
    var b = S.Bahn({ x: 400, y: 91, h: 270, props: { gang: 'neutral', fender: 'stb', fenderBug: true, leinen: [{ von: [-5, -30], nach: [300, 58] }, { von: [5, 30], nach: [500, 58] }].concat(spring) } })
      .warte(1.6, {})
      .warte(1, { leinen: spring, ruder: 32 })
      .bewege({ dh: 36, pivot: -46 }, 4, { gang: 'voraus' }, 'inaus')
      .warte(.8, { gang: 'neutral', leinen: null, ruder: 0 })
      .bewege({ dx: 110, dy: 56, dh: 4 }, 3.6, { gang: 'zurueck' }, 'ein')
      .warte(1.2, { gang: 'neutral' });
    return {
      titel: 'Eindampfen in die Vorspring', shots: [S.manoever({
        bahn: b, wind: 180, motor: true, massstab: KM, roseX: 724, roseY: 396, windText: '(auflandig)',
        kulisse: function () { return kaiOben([[300, 58], [364, 58], [500, 58]]) + boot(130, 91, 270) + boot(690, 91, 270); },
        steps: [
          { t: 0, titel: 'Kräftig auflandiger Wind', text: 'Der Wind drückt die Jacht an die Mauer. Bug gut abfendern.' },
          { t: 1.6, titel: 'Vorspring auf Slip, alle anderen Leinen los', text: 'Das Ruder zeigt ZUR Kaimauer – anders als beim Anlegen mit Eindampfen.' },
          { t: 2.6, titel: 'Langsam Gas voraus', text: 'Die Vorspring hält den Bug; der Schraubenstrom am Ruder drückt das Heck von der Mauer weg.' },
          { t: 7.4, titel: 'Vorspring einholen, rückwärts frei', text: 'Der Radeffekt spielt bei diesem Manöver keine Rolle.' }
        ]
      })]
    };
  });

  /* A.2.2.6  Drehen „am Teller“ */
  S.szene('teller', function () {
    var b = S.Bahn({ x: 400, y: 250, h: 0, props: { gang: 'neutral', ruder: 0 } }).warte(.6, {}).warte(1, { ruder: -35 });
    for (var i = 0; i < 4; i++) {
      b.bewege({ dh: -24, dy: -4 }, 1.6, { gang: 'voraus', radeffekt: 0 }, 'inaus');
      b.bewege({ dh: -20, dy: 3 }, 1.6, { gang: 'zurueck', radeffekt: 1 }, 'inaus');
    }
    b.warte(1.5, { gang: 'neutral', radeffekt: 0 });
    return {
      titel: 'Drehen am Teller', shots: [S.manoever({
        bahn: b, motor: true, massstab: KM, schraube: LINKS, spur: false,
        kulisse: function () {
          return S.kai(0, 0, 175, 460, { kante: 'rechts', text: '' }) + S.kai(625, 0, 175, 460, { kante: 'links', text: '' }) +
            boot(90, 120, 90) + boot(90, 330, 90) + boot(710, 120, 270) + boot(710, 330, 270) +
            '<circle cx="400" cy="250" r="66" fill="none" stroke="' + F.navy2 + '" stroke-dasharray="4 5" opacity=".5"/>';
        },
        steps: [
          { t: 0, titel: 'Hart Ruder nach Backbord – und so lassen', text: 'Bei linksgängiger Schraube nach der Seite ihres Drehsinns.' },
          { t: 1.6, titel: 'Kurzer Schub voraus', text: 'Der Schraubenstrom trifft das Ruder und drückt das Heck nach Steuerbord.' },
          { t: 3.2, titel: 'Kurzer Schub zurück', text: 'Der Radeffekt drückt das Heck ebenfalls nach Steuerbord (roter Pfeil).' },
          { t: 4.8, titel: 'Abwechselnd wiederholen', text: 'Beide Effekte drehen in dieselbe Richtung – die Jacht dreht fast auf der Stelle.' }
        ]
      })]
    };
  });

  /* A.2.6  Verholen */
  S.szene('verholen', function () {
    var b = S.Bahn({ x: 600, y: 91, h: 270, props: { gang: 'neutral', fender: 'stb', ruder: 0 } })
      .warte(1.5, {})
      .fahr(260, 9, { ruder: 3 }, 'inaus')
      .warte(2.5, { ruder: 0 });
    return {
      titel: 'Verholen', shots: [S.manoever({
        bahn: b, motor: true, massstab: KM, spur: false, hudX: 14, hudY: 372,
        kulisse: function () { return kaiOben([[180, 58], [720, 58]]); },
        nachher: function (t, st) {
          var bug = S.local2world(st, [6 * KM, -30 * KM]), heck = S.local2world(st, [6 * KM, 30 * KM]), s = '';
          var p1 = [bug[0] - 44, 54], p2 = [heck[0] + 34, 54];
          s += '<line x1="' + f1(bug[0]) + '" y1="' + f1(bug[1]) + '" x2="' + f1(p1[0]) + '" y2="' + p1[1] + '" stroke="' + F.leine + '" stroke-width="2.4"/>';
          s += '<line x1="' + f1(heck[0]) + '" y1="' + f1(heck[1]) + '" x2="' + f1(p2[0]) + '" y2="' + p2[1] + '" stroke="' + F.leine + '" stroke-width="2.4"/>';
          s += S.person(p1[0], p1[1], t) + S.person(p2[0], p2[1], t);
          if (t > 1.5 && t < 10.5) s += S.pfeil(p1[0] - 14, 54, p1[0] - 50, 54, 'rot');
          var hm = S.local2world(st, [0, 20 * KM]);
          s += '<circle cx="' + f1(hm[0]) + '" cy="' + f1(hm[1]) + '" r="6" fill="' + F.accent + '" stroke="#fff" stroke-width="1.5"/>';
          s += S.label(bug[0], 150, '↑ Vorleine: zieht', 'sx-lbl-c') + S.label(heck[0] + 30, 174, '↑ Achterleine: hält / stoppt', 'sx-lbl-c') + S.label(hm[0], 198, '↑ Rudergänger am Ruder', 'sx-lbl-c');
          return s;
        },
        steps: [
          { t: 0, titel: 'Ruder besetzt, gut abgefendert', text: 'Die Jacht wird ohne Motor von Land aus bewegt.' },
          { t: 1.5, titel: 'Mit Leinen von Land aus ziehen', text: 'Eine Person zieht vorne, eine führt achtern nach – die Jacht muss jederzeit abgestoppt werden können.' },
          { t: 10.5, titel: 'Am neuen Liegeplatz festmachen', text: 'Verholen = mit Leinen von Land aus. Schleppen = durch ein anderes Schiff. Verwarpen = mit einem Warpanker.' }
        ]
      })]
    };
  });

  S.start && document.readyState !== 'loading' ? S.start() : document.addEventListener('DOMContentLoaded', function () { S.start(); });
})();
