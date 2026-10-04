/* ==========================================================================
   SailingX-Academy – Internationale Signalflaggen: Daten
   Jede Flagge: Buchstabe/Zahl, Funkname, Morsezeichen, Bedeutung als Einzelflagge
   sowie Zusatzbedeutungen (Regatta, Marine, Praxis). Die Flaggen werden als SVG
   gezeichnet: form = Umriss, malen = Flächen im Feld 90 × 60.
   ========================================================================== */
window.FLAGGEN = (function () {
  'use strict';
  var R = '#d8232a', B = '#0082ca', G = '#ffd400', S = '#141414', W = '#ffffff';

  function rect(x, y, w, h, f) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"/>'; }
  function poly(p, f) { return '<polygon points="' + p + '" fill="' + f + '"/>'; }
  function kreis(cx, cy, r, f) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"/>'; }
  function streifenH(farben) { // waagrechte Streifen gleicher Höhe
    var h = 60 / farben.length, s = '';
    farben.forEach(function (f, i) { s += rect(0, i * h, 90, h + .4, f); });
    return s;
  }
  function streifenV(farben) {
    var b = 90 / farben.length, s = '';
    farben.forEach(function (f, i) { s += rect(i * b, 0, b + .4, 60, f); });
    return s;
  }
  function schach(a, b, n) { // n × n Felder
    var s = rect(0, 0, 90, 60, a), bx = 90 / n, by = 60 / n;
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) if ((i + j) % 2) s += rect(i * bx, j * by, bx + .3, by + .3, b);
    return s;
  }
  function kreuz(farbeFeld, farbeKreuz, d) { // stehendes Kreuz
    return rect(0, 0, 90, 60, farbeFeld) + rect(45 - d / 2, 0, d, 60, farbeKreuz) + rect(0, 30 - d / 2, 90, d, farbeKreuz);
  }
  function andreas(farbeFeld, farbeKreuz, d) { // Schrägkreuz
    return rect(0, 0, 90, 60, farbeFeld) +
      '<path d="M0 0 L90 60 M90 0 L0 60" stroke="' + farbeKreuz + '" stroke-width="' + d + '"/>';
  }

  /* ---------- Buchstaben A–Z ---------- */
  var BUCHSTABEN = [
    { z: 'A', name: 'Alfa', morse: '.-', form: 'schwalbe', malen: rect(0, 0, 45, 60, W) + rect(45, 0, 45, 60, B),
      bedeutung: 'Unter mir befinden sich Taucher. Halten Sie sich mit langsamer Fahrt gut frei von mir.',
      zusatz: [{ a: 'Praxis', t: 'Wird beim Tauchen vom Boot aus gesetzt – auch beim Ankern mit Tauchern im Wasser.' }],
      merk: '„A wie Aqualunge“ – Taucher unten.' },
    { z: 'B', name: 'Bravo', morse: '-...', form: 'schwalbe', malen: rect(0, 0, 90, 60, R),
      bedeutung: 'Ich lade, lösche oder befördere gefährliche Güter.',
      zusatz: [{ a: 'Praxis', t: 'An Tankern und beim Bunkern zu sehen – offenes Feuer und Rauchen sind dann tabu.' }],
      merk: 'Ganz rot – Gefahr an Bord.' },
    { z: 'C', name: 'Charlie', morse: '-.-.', form: 'rechteck', malen: streifenH([B, W, R, W, B]),
      bedeutung: 'Zustimmung – Ja.',
      zusatz: [{ a: 'Regatta', t: 'Kursänderung; dazu sich wiederholende Schallsignale.' }],
      merk: 'C = „confirm“ – ja.' },
    { z: 'D', name: 'Delta', morse: '-..', form: 'rechteck', malen: rect(0, 0, 90, 60, G) + rect(0, 12, 90, 36, B),
      bedeutung: 'Halten Sie sich frei von mir – ich bin manövrierbehindert.',
      zusatz: [], merk: 'D = „difficult“ – ich kann nicht ausweichen.' },
    { z: 'E', name: 'Echo', morse: '.', form: 'rechteck', malen: rect(0, 0, 90, 30, B) + rect(0, 30, 90, 30, R),
      bedeutung: 'Ich ändere meinen Kurs nach Steuerbord.',
      zusatz: [{ a: 'Merkhilfe', t: 'Ein Punkt im Morsezeichen – ein kurzer Ton: ein Schallsignal bedeutet ebenfalls „Ich drehe nach Steuerbord“.' }],
      merk: 'E wie Echo – ein Ton, Steuerbord.' },
    { z: 'F', name: 'Foxtrot', morse: '..-.', form: 'rechteck', malen: rect(0, 0, 90, 60, W) + poly('45,4 86,30 45,56 4,30', R),
      bedeutung: 'Ich bin manövrierunfähig – nehmen Sie Verbindung mit mir auf.',
      zusatz: [{ a: 'Marine', t: 'Flüge finden statt.' }], merk: 'F = „failure“ – nichts geht mehr.' },
    { z: 'G', name: 'Golf', morse: '--.', form: 'rechteck', malen: streifenV([G, B, G, B, G, B]),
      bedeutung: 'Ich benötige einen Lotsen.',
      zusatz: [{ a: 'Fischerei', t: 'Beim Fischen: Ich hole meine Netze ein.' }], merk: 'G = „give me a pilot“.' },
    { z: 'H', name: 'Hotel', morse: '....', form: 'rechteck', malen: rect(0, 0, 45, 60, W) + rect(45, 0, 45, 60, R),
      bedeutung: 'Ich habe einen Lotsen an Bord.',
      zusatz: [], merk: 'H = „have a pilot“ – der Lotse ist schon da.' },
    { z: 'I', name: 'India', morse: '..', form: 'rechteck', malen: rect(0, 0, 90, 60, G) + kreis(45, 30, 15, S),
      bedeutung: 'Ich ändere meinen Kurs nach Backbord.',
      zusatz: [{ a: 'Regatta', t: 'Ein-Minuten-Regel; mit der schwarzen Flagge: 4 Minuten bis zum Start, wenn oben – 1 Minute, wenn gesenkt.' },
        { a: 'Merkhilfe', t: 'Zwei Punkte – zwei kurze Töne: „Ich drehe nach Backbord“.' }],
      merk: 'I = zwei Punkte, zwei Töne, Backbord.' },
    { z: 'J', name: 'Juliett', morse: '.---', form: 'rechteck', malen: streifenH([B, W, B]),
      bedeutung: 'Ich habe Feuer an Bord und gefährliche Ladung – halten Sie sich gut frei von mir.',
      zusatz: [], merk: 'J wie „Jesses, es brennt“.' },
    { z: 'K', name: 'Kilo', morse: '-.-', form: 'rechteck', malen: rect(0, 0, 45, 60, G) + rect(45, 0, 45, 60, B),
      bedeutung: 'Ich möchte mit Ihnen Verbindung aufnehmen.',
      zusatz: [], merk: 'K = „kommunizieren“.' },
    { z: 'L', name: 'Lima', morse: '.-..', form: 'rechteck', malen: rect(0, 0, 45, 30, G) + rect(45, 0, 45, 30, S) + rect(0, 30, 45, 30, S) + rect(45, 30, 45, 30, G),
      bedeutung: 'Bringen Sie Ihr Fahrzeug sofort zum Stehen.',
      zusatz: [{ a: 'Regatta', t: 'In Rufweite kommen bzw. mir folgen; ein Schallsignal, wenn oben.' },
        { a: 'Praxis', t: 'Im Hafen von der Hafenbehörde gesetzt – dann sofort stoppen.' }],
      merk: 'L wie „Lima – stopp“.' },
    { z: 'M', name: 'Mike', morse: '--', form: 'rechteck', malen: andreas(B, W, 11),
      bedeutung: 'Meine Maschine ist gestoppt – ich mache keine Fahrt durchs Wasser.',
      zusatz: [{ a: 'Regatta', t: 'Ersatz für eine Bahnmarke; sich wiederholende Schallsignale.' }],
      merk: 'M = „Maschine aus“.' },
    { z: 'N', name: 'November', morse: '-.', form: 'rechteck', malen: schach(W, B, 4),
      bedeutung: 'Ablehnung – Nein.',
      zusatz: [{ a: 'Regatta', t: 'Abbruch der Wettfahrt, zurück zum Start; 3 Schallsignale, wenn oben, 1 beim Senken.' },
        { a: 'Praxis', t: 'N über C ist das Notzeichen aus dem Signalbuch.' }],
      merk: 'N = „nein“.' },
    { z: 'O', name: 'Oscar', morse: '---', form: 'rechteck', malen: rect(0, 0, 90, 60, R) + poly('0,0 0,60 90,60', G),
      bedeutung: 'Mann über Bord!',
      zusatz: [{ a: 'Praxis', t: 'Wird beim MOB-Manöver gesetzt – zusammen mit dem Alarm auf Kanal 16 und dem DSC-Notalarm.' }],
      merk: 'O = „over board“.' },
    { z: 'P', name: 'Papa', morse: '.--.', form: 'rechteck', malen: rect(0, 0, 90, 60, B) + rect(30, 20, 30, 20, W),
      bedeutung: 'Im Hafen: Alle Mann an Bord, das Fahrzeug will auslaufen.',
      zusatz: [{ a: 'Fischerei', t: 'Auf See: Meine Netze haben sich festgefahren.' },
        { a: 'Regatta', t: 'Vorbereitungssignal: 4 Minuten bis zum Start, wenn oben – 1 Minute, wenn gesenkt.' }],
      merk: 'P wie „Blauer Peter“ – wir laufen aus.' },
    { z: 'Q', name: 'Quebec', morse: '--.-', form: 'rechteck', malen: rect(0, 0, 90, 60, G),
      bedeutung: 'An Bord ist alles gesund – ich bitte um freie Verkehrserlaubnis.',
      zusatz: [{ a: 'Praxis', t: 'Bei der Einreise in ein Land gesetzt, bis die Behörden das Schiff abgefertigt haben.' }],
      merk: 'Q = Quarantäne – ganz gelb.' },
    { z: 'R', name: 'Romeo', morse: '.-.', form: 'rechteck', malen: kreuz(R, G, 14),
      bedeutung: 'Ich habe Ihr letztes Signal verstanden.',
      zusatz: [{ a: 'Marine', t: 'Reserven werden aufgefüllt.' }], merk: 'R = „received“.' },
    { z: 'S', name: 'Sierra', morse: '...', form: 'rechteck', malen: rect(0, 0, 90, 60, W) + rect(27, 18, 36, 24, B),
      bedeutung: 'Meine Maschine geht rückwärts.',
      zusatz: [{ a: 'Regatta', t: 'Bahnabkürzung; zwei Schallsignale, wenn oben.' },
        { a: 'Merkhilfe', t: 'Drei Punkte – drei kurze Töne: „Meine Maschine geht rückwärts“.' }],
      merk: 'S = drei Töne, rückwärts.' },
    { z: 'T', name: 'Tango', morse: '-', form: 'rechteck', malen: streifenV([R, W, B]),
      bedeutung: 'Halten Sie sich von mir frei – ich fische mit einem Gespann.',
      zusatz: [{ a: 'Marine', t: 'Nicht an mir vorbeifahren.' }], merk: 'T wie „Trawler im Team“.' },
    { z: 'U', name: 'Uniform', morse: '..-', form: 'rechteck', malen: rect(0, 0, 45, 30, R) + rect(45, 0, 45, 30, W) + rect(0, 30, 45, 30, W) + rect(45, 30, 45, 30, R),
      bedeutung: 'Sie laufen in Gefahr.',
      zusatz: [], merk: 'U = „you are running into danger“.' },
    { z: 'V', name: 'Victor', morse: '...-', form: 'rechteck', malen: andreas(W, R, 11),
      bedeutung: 'Ich brauche Hilfe.',
      zusatz: [], merk: 'V = „victory“ – ich brauche Hilfe, aber keine Lebensgefahr.' },
    { z: 'W', name: 'Whiskey', morse: '.--', form: 'rechteck', malen: rect(0, 0, 90, 60, B) + rect(15, 10, 60, 40, W) + rect(27, 19, 36, 22, R),
      bedeutung: 'Ich brauche ärztliche Hilfe.',
      zusatz: [{ a: 'Praxis', t: 'Auf See: funkärztliche Beratung über die Küstenfunkstelle, bei Lebensgefahr MAYDAY.' }],
      merk: 'W = „wounded“.' },
    { z: 'X', name: 'X-Ray', morse: '-..-', form: 'rechteck', malen: kreuz(W, B, 14),
      bedeutung: 'Brechen Sie Ihr Vorhaben ab und achten Sie auf meine Signale.',
      zusatz: [{ a: 'Regatta', t: 'Individueller Rückruf; ein Schallsignal, wenn oben.' }],
      merk: 'X = „abbrechen“.' },
    { z: 'Y', name: 'Yankee', morse: '-.--', form: 'rechteck',
      malen: rect(0, 0, 90, 60, G) + '<g>' + (function () { var s = ''; for (var i = -4; i < 10; i++) s += '<path d="M' + (i * 14) + ' 0 L' + (i * 14 + 28) + ' 60" stroke="' + R + '" stroke-width="7"/>'; return s; })() + '</g>',
      bedeutung: 'Ich treibe vor Anker – mein Anker hält nicht.',
      zusatz: [{ a: 'Regatta', t: 'Schwimmwesten anlegen; ein Schallsignal, wenn oben.' },
        { a: 'Marine', t: 'Das Schiff sendet visuelle Signale.' }],
      merk: 'Y wie „Yankee treibt“.' },
    { z: 'Z', name: 'Zulu', morse: '--..', form: 'rechteck',
      malen: poly('0,0 90,0 45,30', S) + poly('90,0 90,60 45,30', B) + poly('0,60 90,60 45,30', R) + poly('0,0 0,60 45,30', G),
      bedeutung: 'Ich benötige einen Schlepper.',
      zusatz: [{ a: 'Fischerei', t: 'Beim Fischen: Ich setze meine Netze aus.' },
        { a: 'Regatta', t: '20 % Punktstrafe; ein Schallsignal, wenn gesenkt.' }],
      merk: 'Z = „Zugmaschine“ – Schlepper her.' }
  ];

  /* ---------- Zahlenwimpel 0–9 ---------- */
  var ZAHLEN = [
    { z: '0', name: 'Nadazero', morse: '-----', form: 'wimpel', malen: streifenV([G, R, G]) },
    { z: '1', name: 'Unaone', morse: '.----', form: 'wimpel', malen: rect(0, 0, 90, 60, W) + kreis(26, 30, 13, R) },
    { z: '2', name: 'Bissotwo', morse: '..---', form: 'wimpel', malen: rect(0, 0, 90, 60, B) + kreis(26, 30, 13, W) },
    { z: '3', name: 'Terrathree', morse: '...--', form: 'wimpel', malen: streifenV([R, W, B]) },
    { z: '4', name: 'Kartefour', morse: '....-', form: 'wimpel', malen: rect(0, 0, 90, 60, R) + rect(0, 24, 90, 12, W) + rect(24, 0, 12, 60, W) },
    { z: '5', name: 'Pantafive', morse: '.....', form: 'wimpel', malen: streifenV([G, B]) },
    { z: '6', name: 'Soxisix', morse: '-....', form: 'wimpel', malen: rect(0, 0, 90, 30, S) + rect(0, 30, 90, 30, W) },
    { z: '7', name: 'Setteseven', morse: '--...', form: 'wimpel', malen: rect(0, 0, 90, 30, G) + rect(0, 30, 90, 30, R) },
    { z: '8', name: 'Oktoeight', morse: '---..', form: 'wimpel', malen: rect(0, 0, 90, 60, W) + rect(0, 24, 90, 12, R) + rect(24, 0, 12, 60, R) },
    { z: '9', name: 'Novenine', morse: '----.', form: 'wimpel', malen: rect(0, 0, 45, 30, W) + rect(45, 0, 45, 30, S) + rect(0, 30, 45, 30, R) + rect(45, 30, 45, 30, G) }
  ];

  /* ---------- Sonderwimpel ---------- */
  var SONDER = [
    { z: 'AW', name: 'Antwortwimpel', kurz: 'Code- oder Antwortwimpel', form: 'wimpel', malen: streifenV([R, W, R, W, R]),
      bedeutung: 'Meldung verstanden. Vorgeheißt bedeutet er außerdem: Das folgende Signal stammt aus dem Internationalen Signalbuch. In Zahlengruppen steht er für das Komma.',
      zusatz: [{ a: 'Praxis', t: 'Auf halber Höhe: „Signal gesehen, noch nicht verstanden“ – ganz oben: „verstanden“.' },
        { a: 'Regatta', t: 'Verschieben der Wettfahrt; zwei Schallsignale, wenn oben, eines beim Senken.' }] },
    { z: 'E1', name: 'Erster Ersatzwimpel', kurz: 'Erstes Ersatzsignal', form: 'dreieck', malen: rect(0, 0, 90, 60, B) + poly('0,0 0,60 48,30', G),
      bedeutung: 'Wiederholt die erste Flagge derselben Art, die in der Gruppe schon verwendet wurde.',
      zusatz: [{ a: 'Regatta', t: 'Allgemeiner Rückruf; zwei Schallsignale, wenn oben, eines beim Senken.' }] },
    { z: 'E2', name: 'Zweiter Ersatzwimpel', kurz: 'Zweites Ersatzsignal', form: 'dreieck', malen: rect(0, 0, 54, 60, B) + rect(54, 0, 36, 60, W),
      bedeutung: 'Wiederholt die zweite Flagge derselben Art, die in der Gruppe schon verwendet wurde.',
      zusatz: [{ a: 'Marine', t: 'Stabschef abwesend.' }] },
    { z: 'E3', name: 'Dritter Ersatzwimpel', kurz: 'Drittes Ersatzsignal', form: 'dreieck', malen: rect(0, 0, 90, 60, W) + rect(0, 18, 90, 24, S),
      bedeutung: 'Wiederholt die dritte Flagge derselben Art, die in der Gruppe schon verwendet wurde.',
      zusatz: [{ a: 'Marine', t: 'Befehlshabender Offizier abwesend.' }] }
  ];

  /* ---------- Wörter zum Buchstabieren ---------- */
  var WOERTER = [
    { wort: 'LUNA', hinweis: 'Hier wiederholt sich kein Buchstabe – vier Flaggen genügen.' },
    { wort: 'SOS', hinweis: 'Das S kommt zweimal vor.' },
    { wort: 'ANNA', hinweis: 'Gleich zwei Buchstaben wiederholen sich – achte auf die Reihenfolge.' },
    { wort: 'OTTO', hinweis: 'Zwei Wiederholungen: Welcher Ersatzwimpel steht für welche Position?' },
    { wort: 'ADRIA', hinweis: 'Das A steht am Anfang und am Ende.' },
    { wort: 'ISTRIEN', hinweis: 'Ein Buchstabe kommt zweimal vor.' },
    { wort: 'MAYDAY', hinweis: 'Zwei Buchstaben wiederholen sich – A und Y.' },
    { wort: '2026', hinweis: 'Zahlenwimpel: Auch hier gilt die Ersatzwimpel-Regel.' }
  ];

  /* ---------- Szenarien für die Prüfung ---------- */
  var SZENARIEN = [
    { z: 'A', frage: 'Zwei aus deiner Crew tauchen vom Boot aus. Welche Flagge setzt du?' },
    { z: 'Q', frage: 'Du kommst aus Italien und läufst in Kroatien ein, einklariert ist noch nicht. Welche Flagge gehört an die Saling?' },
    { z: 'O', frage: 'Eine Person ist über Bord gegangen. Welche Flagge gehört zum Manöver?' },
    { z: 'F', frage: 'Ruderbruch: Du bist manövrierunfähig und möchtest, dass ein anderes Fahrzeug Verbindung aufnimmt.' },
    { z: 'Z', frage: 'Dein Motor läuft nicht mehr und du brauchst einen Schlepper.' },
    { z: 'G', frage: 'Du läufst einen Hafen mit Lotsenpflicht an und brauchst einen Lotsen.' },
    { z: 'Y', frage: 'Nachts in der Bucht: Der Anker hält nicht, du treibst.' },
    { z: 'W', frage: 'Ein Crewmitglied ist ernsthaft erkrankt – du brauchst ärztliche Hilfe.' },
    { z: 'K', frage: 'Du möchtest mit einem anderen Fahrzeug Verbindung aufnehmen.' },
    { z: 'B', frage: 'Welche Flagge führt ein Tanker, der gerade Ladung löscht?' },
    { z: 'M', frage: 'Du willst zeigen: Meine Maschine ist gestoppt, ich mache keine Fahrt durchs Wasser.' },
    { z: 'U', frage: 'Du siehst, dass ein anderes Fahrzeug auf eine Untiefe zuhält, und willst es warnen.' },
    { z: 'V', frage: 'Du brauchst Hilfe, aber es besteht keine unmittelbare Gefahr für Schiff und Crew.' },
    { z: 'D', frage: 'Du bist beim Schleppen eines anderen Bootes manövrierbehindert und willst, dass man sich frei hält.' }
  ];

  /* ---------- Theorie ---------- */
  var THEORIE = [
    { id: 'was', icon: '🚩', titel: 'Wozu Signalflaggen?',
      kurz: 'Sichtbar über Entfernungen, ohne Funk, ohne Sprache.',
      bloecke: [{ ul: [
        'Das <b>Internationale Signalbuch</b> gilt weltweit: 26 Buchstabenflaggen, 10 Zahlenwimpel, der <b>Antwortwimpel</b> und drei <b>Ersatzwimpel</b>.',
        'Jede Flagge hat als <b>Einzelflagge</b> eine feste, dringende Bedeutung – die musst du kennen, der Rest steht im Signalbuch.',
        'Die Flaggen verständigen <b>ohne gemeinsame Sprache</b> und <b>ohne Funk</b> – und sie gelten weiter, wenn die Elektronik ausfällt.',
        'Wo gesetzt wird: an der <b>Steuerbordsaling</b> (Signalfall), gut sichtbar und frei vom Segel. Mehrere Flaggen einer Gruppe hängen <b>übereinander am selben Fall</b>, von oben nach unten gelesen.'
      ] }] },
    { id: 'einzeln', icon: '1️⃣', titel: 'Einzelflaggen – die wichtigsten',
      kurz: 'Diese sechs siehst du im Revier am häufigsten.',
      bloecke: [{ tabelle: [
        ['A', 'Taucher unten – mit langsamer Fahrt gut frei halten.'],
        ['B', 'Gefährliche Güter an Bord – kein Feuer, kein Rauchen.'],
        ['O', 'Mann über Bord.'],
        ['Q', 'Alles gesund an Bord – ich bitte um freie Verkehrserlaubnis (Einreise).'],
        ['U', 'Sie laufen in Gefahr.'],
        ['V', 'Ich brauche Hilfe.']
      ] }, { ul: [
        '<b>N über C</b> übereinander gesetzt heißt: <b>Ich bin in Not und brauche sofortige Hilfe</b> – eines der anerkannten Notzeichen.',
        'Einzelne Manöverflaggen haben ein Gegenstück bei den <b>Schallsignalen</b>: E = ein kurzer Ton (Kursänderung nach Steuerbord), I = zwei kurze Töne (nach Backbord), S = drei kurze Töne (Maschine rückwärts).'
      ] }] },
    { id: 'gruppen', icon: '🔠', titel: 'Flaggengruppen und Ersatzwimpel',
      kurz: 'Wie aus Flaggen Wörter und Zahlen werden.',
      bloecke: [{ ul: [
        'Mit mehreren Flaggen lassen sich <b>Namen buchstabieren</b> (z. B. das Rufzeichen) oder Signalgruppen aus dem Signalbuch zeigen.',
        'Eine Flagge gibt es an Bord nur <b>einmal</b>. Kommt ein Buchstabe in einer Gruppe zweimal vor, steht an seiner Stelle ein <b>Ersatzwimpel</b>: der erste wiederholt die erste Flagge der Gruppe, der zweite die zweite, der dritte die dritte.',
        'Beispiel <b>ANNA</b>: A – N – 2. Ersatzwimpel (für das zweite N) – 1. Ersatzwimpel (für das erste A).',
        'Der <b>Antwortwimpel</b> zeigt: „verstanden“. Auf halber Höhe heißt er „gesehen, aber noch nicht verstanden“, ganz oben „verstanden“.',
        'Zahlen werden mit <b>Zahlenwimpeln</b> gezeigt; der Antwortwimpel steht dabei für das <b>Komma</b>.'
      ] }] },
    { id: 'praxis', icon: '⚓', titel: 'Flaggen an Bord einer Yacht',
      kurz: 'Was auf dem Törn wirklich gesetzt wird.',
      bloecke: [{ ul: [
        '<b>Q</b> beim Einlaufen in ein neues Land, bis die Behörden abgefertigt haben.',
        '<b>A</b>, sobald jemand von Bord aus taucht – auch beim Schnorcheln am Anker ein gutes Zeichen.',
        '<b>O</b> beim Mann-über-Bord-Manöver, zusätzlich zu Funk und DSC.',
        '<b>Gastlandflagge</b> an der Steuerbordsaling, die Heimatflagge am Heck – das ist zwar kein Signalbuch, gehört aber zum guten Ton und ist in vielen Ländern Vorschrift.',
        'Flaggen werden <b>bei Sonnenaufgang gesetzt</b> und <b>bei Sonnenuntergang eingeholt</b>; im Hafen bleibt die Heckflagge über Nacht unten.'
      ] }] },
    { id: 'morse', icon: '🔊', titel: 'Morse – dasselbe Zeichen, anderer Kanal',
      kurz: 'Jede Flagge hat ein Morsezeichen.',
      bloecke: [{ ul: [
        'Zu jedem Buchstaben gehört ein <b>Morsezeichen</b> – mit Lampe, Horn oder Funk übertragbar.',
        'Ein <b>Punkt</b> ist kurz, ein <b>Strich</b> dreimal so lang; zwischen den Zeichen eines Buchstabens liegt eine kurze Pause, zwischen Buchstaben eine lange.',
        'Das wichtigste Morsesignal bleibt <b>SOS</b> ( ··· – – – ··· ) – ohne Pause als ein Zeichen gegeben.',
        'In der Tafel kannst du jedes Zeichen <b>anhören</b>; in der Übung „Morse hören“ trainierst du es.'
      ] }] }
  ];

  return { BUCHSTABEN: BUCHSTABEN, ZAHLEN: ZAHLEN, SONDER: SONDER, THEORIE: THEORIE, WOERTER: WOERTER, SZENARIEN: SZENARIEN };
})();
