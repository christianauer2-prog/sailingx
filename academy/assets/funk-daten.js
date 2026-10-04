/* ==========================================================================
   SailingX-Academy – Funk-Trainer: Inhalte
   Theorie, Buchstabiertafel und die Übungseinheiten (deutsch + englisch).
   Reine Daten – die Logik steckt in assets/funk.js.
   ========================================================================== */
window.FUNK = (function () {
  'use strict';

  /* ---------------- Schiffsdaten für alle Übungen ---------------- */
  var SCHIFF = {
    name: 'Sailing X',
    rufzeichen: 'OEX1234',
    mmsi: '203123456',
    laenge: '12 Meter',
    personen: 'vier',
    position: { de: '43 Grad 12 Komma 4 Minuten Nord – 016 Grad 23 Komma 8 Minuten Ost', en: '43 degrees 12 decimal 4 minutes North – 016 degrees 23 decimal 8 minutes East' }
  };

  /* ---------------- Buchstabiertafel ---------------- */
  var ABC = [
    ['A', 'Alfa'], ['B', 'Bravo'], ['C', 'Charlie'], ['D', 'Delta'], ['E', 'Echo'], ['F', 'Foxtrot'],
    ['G', 'Golf'], ['H', 'Hotel'], ['I', 'India'], ['J', 'Juliett'], ['K', 'Kilo'], ['L', 'Lima'],
    ['M', 'Mike'], ['N', 'November'], ['O', 'Oscar'], ['P', 'Papa'], ['Q', 'Quebec'], ['R', 'Romeo'],
    ['S', 'Sierra'], ['T', 'Tango'], ['U', 'Uniform'], ['V', 'Victor'], ['W', 'Whiskey'], ['X', 'X-Ray'],
    ['Y', 'Yankee'], ['Z', 'Zulu']
  ];

  /* ---------------- Theorie ---------------- */
  var THEORIE = [
    {
      id: 'geraet', icon: '📻', titel: 'Gerät, Kanäle, Reichweite',
      kurz: 'Was das UKW-Gerät kann und wie weit es reicht.',
      bloecke: [
        { h: 'UKW-Seefunk', ul: [
          'UKW-Band <b>156–174 MHz</b>, 57 Kanäle. Ausbreitung <b>quasi-optisch</b> – es zählt die Antennenhöhe, nicht die Leistung.',
          'Reichweite: Schiff–Schiff etwa <b>20–30 sm</b>, zu hohen Küstenfunkstellen bis etwa <b>60 sm</b>.',
          'Sendeleistung <b>25 W</b> (Standard) und <b>1 W</b> (im Hafen und für Nahbereich – schont den Kanal für alle anderen).'
        ] },
        { h: 'Die wichtigsten Kanäle', tabelle: [
          ['16', 'Not-, Dringlichkeits- und Sicherheitsverkehr sowie <b>erster Anruf</b>. Ständige Hörwache halten.'],
          ['70', '<b>Nur DSC</b> – digitale Rufe. Auf 70 wird nie gesprochen.'],
          ['06', 'Schiff–Schiff und Verkehr mit Seenotrettungsmitteln (SAR).'],
          ['13', 'Brücke–Brücke: Absprachen zur Sicherheit der Schifffahrt.'],
          ['09, 72, 77', 'Schiff–Schiff, freie Arbeitskanäle.'],
          ['Marina', 'Je nach Revier, meist <b>71 oder 74</b> – steht im Hafenhandbuch und im Revierführer.']
        ] },
        { h: 'Bedienung', ul: [
          '<b>Dual Watch / Tri Watch</b>: Das Gerät hört neben dem Arbeitskanal weiter auf Kanal 16 mit.',
          '<b>Squelch</b> (Rauschsperre) gerade so weit zudrehen, dass das Rauschen verschwindet – sonst hörst du schwache Rufe nicht.',
          'Erst <b>hören</b>, ob der Kanal frei ist, dann die Sprechtaste drücken, kurz warten, dann sprechen.'
        ] }
      ],
      uebung: 'kanalkunde'
    },
    {
      id: 'recht', icon: '⚖️', titel: 'Zulassung, Rufzeichen, Pflichten',
      kurz: 'Wer senden darf – und wozu man verpflichtet ist.',
      bloecke: [
        { ul: [
          'Das Gerät darf frei gekauft werden; <b>Installation und Betrieb brauchen eine Zulassung</b>. Rein empfangende Geräte (Radar, GPS, EPIRB) nicht.',
          'Mit der Zulassung kommt das <b>Rufzeichen</b> – österreichische Jachten: <b>OEX + vier Ziffern</b> – und die <b>MMSI</b>, die neunstellige Kennung für DSC (Österreich beginnt mit <b>203</b>).',
          'Senden darf nur, wer ein <b>Funkzeugnis</b> hat: <b>SRC</b> für UKW/DSC in Küstennähe, <b>LRC</b> für Langstrecken, <b>UBI</b> für Binnen. <b>Im Notfall darf jeder funken.</b>',
          'Die Funkstelle untersteht dem <b>Schiffsführer</b>: Er ordnet den Notruf an und ist für den Funkverkehr an Bord verantwortlich.',
          '<b>Hörwache</b> auf Kanal 16 halten, Kanal 16 freihalten, keine Privatgespräche, kein Senden auf fremden oder reservierten Kanälen.',
          '<b>Hilfeleistung ist Pflicht</b> – außer man gefährdet damit das eigene Schiff und die eigene Crew.'
        ] }
      ],
      uebung: 'funkwoerter'
    },
    {
      id: 'sprechen', icon: '🗣️', titel: 'Sprechregeln und Funkwörter',
      kurz: 'Langsam, knapp, in fester Reihenfolge.',
      bloecke: [
        { ul: [
          'Mikrofon etwa eine Handbreit vor dem Mund, <b>langsam und deutlich</b> sprechen, normale Lautstärke – schreien verzerrt.',
          'Vor dem Sprechen den Spruch <b>im Kopf fertig haben</b>, bei Not- und Dringlichkeitsrufen besser aufschreiben.',
          'Im Ausland auf <b>Englisch</b> funken – die Standardfloskeln sind international gleich.',
          'Zahlen <b>ziffernweise</b> sprechen: 71 ist „sieben – eins“. Namen und Rufzeichen <b>buchstabieren</b>.'
        ] },
        { h: 'Diese Wörter musst du können', tabelle: [
          ['OVER', 'Ende der Durchsage – <b>ich erwarte Antwort</b>. (Taste loslassen!)'],
          ['OUT', 'Gespräch ist <b>beendet</b>. Niemals „over and out“.'],
          ['SAY AGAIN', 'Bitte wiederholen.'],
          ['I SPELL', 'Ich buchstabiere.'],
          ['ROGER', 'Verstanden.'],
          ['STAND BY', 'Bleiben Sie auf Empfang / warten Sie.'],
          ['SEELONCE MAYDAY', '<b>Funkstille</b> – es läuft Notverkehr. Nur die Notverkehrsleitung sendet.'],
          ['SEELONCE FEENEE', 'Der Notverkehr ist beendet, der Kanal ist wieder frei.']
        ] }
      ],
      uebung: 'funkwoerter'
    },
    {
      id: 'abc', icon: '🔤', titel: 'Buchstabiertafel',
      kurz: 'Alfa, Bravo, Charlie – und Zahlen ziffernweise.',
      bloecke: [
        { abc: true },
        { ul: [
          'Zahlen einzeln sprechen: MMSI 203123456 wird zu „zwei – null – drei – eins – zwei – drei – vier – fünf – sechs“.',
          'Vor dem Buchstabieren <b>I SPELL</b> ansagen, dann Buchstabe für Buchstabe.'
        ] }
      ],
      uebung: 'buchstabieren'
    },
    {
      id: 'routine', icon: '💬', titel: 'Routineanruf',
      kurz: 'Gerufener – hier ist – Anliegen – Over.',
      bloecke: [
        { h: 'Das Schema', ol: [
          '<b>Name des Gerufenen</b> (bis 3×)',
          '<b>HIER IST</b> / THIS IS',
          '<b>eigener Name</b> (bis 3×), dazu Rufzeichen',
          '<b>Anliegen oder Kanalvorschlag</b>',
          '<b>OVER</b>'
        ] },
        { h: 'So klingt das', beispiel: [
          ['Du', 'Marina Kaštela, Marina Kaštela – hier ist Sailing X, Sailing X, Sailing X, Rufzeichen OEX1234. Over.'],
          ['Marina', 'Sailing X – hier ist Marina Kaštela. Wechseln Sie bitte auf Kanal 71. Over.'],
          ['Du', 'Marina Kaštela – hier ist Sailing X. Verstanden, Kanal 71. Over.'],
          ['Du (auf 71)', 'Marina Kaštela – hier ist Sailing X. Wir sind eine 12-Meter-Segelyacht und bitten um einen Liegeplatz für eine Nacht, voraussichtliche Ankunft 17:30 Uhr. Over.']
        ] },
        { ul: [
          'Der <b>erste Anruf</b> läuft über Kanal 16, danach sofort auf einen <b>Arbeitskanal</b> wechseln.',
          'Vor dem Anruf hören, ob der Kanal frei ist. Keine Antwort? Erst nach <b>zwei Minuten</b> erneut rufen.'
        ] }
      ],
      uebung: 'marina'
    },
    {
      id: 'notfall', icon: '🆘', titel: 'Not-, Dringlichkeits- und Sicherheitsverkehr',
      kurz: 'MAYDAY, PAN PAN, SÉCURITÉ – wann was.',
      bloecke: [
        { h: 'Die drei Stufen', tabelle: [
          ['MAYDAY', '<b>Unmittelbare Gefahr</b> für Schiff oder Menschen – sinken, Feuer, Mann über Bord, lebensbedrohliche Verletzung. Vom Schiffsführer angeordnet.'],
          ['PAN PAN', '<b>Dringende Hilfe</b> nötig, aber keine akute Gefahr für das ganze Schiff – Motorschaden in Landnähe, Ruderbruch, funkärztliche Beratung.'],
          ['SÉCURITÉ', '<b>Warnung</b> für die Schifffahrt – treibender Container, losgerissene Tonne, Sturmwarnung.']
        ] },
        { h: 'MAYDAY – Reihenfolge', ol: [
          'Mit DSC-Gerät zuerst den <b>Notalarm</b> auslösen (rote Taste), dann Kanal 16, volle Leistung',
          '<b>MAYDAY – MAYDAY – MAYDAY</b>',
          '<b>HIER IST</b> Schiffsname 3×, Rufzeichen, MMSI',
          '<b>MAYDAY</b> Schiffsname',
          '<b>POSITION</b> (Breite/Länge oder Peilung und Abstand zu einer Landmarke)',
          '<b>Art des Notfalls</b>',
          '<b>Welche Hilfe</b> gebraucht wird',
          '<b>Personen an Bord</b>, Verletzte',
          '<b>Weitere Angaben</b> (Rettungsinsel, Pyrotechnik, Schiff verlassen)',
          '<b>OVER</b> – Taste loslassen und hören. Keine Antwort: in kurzen Abständen wiederholen.'
        ] },
        { ul: [
          '<b>PAN PAN</b> und <b>SÉCURITÉ</b> gehen an „alle Funkstellen“: Ansage 3×, „an alle Funkstellen“ 3×, dann eigener Name, Position, Lage.',
          'Sicherheitsmeldungen werden auf 16 <b>angekündigt</b> und auf einem Arbeitskanal <b>durchgegeben</b>.',
          '<b>MAYDAY RELAY</b>: Du gibst den Notruf eines anderen weiter, wenn dieser selbst nicht mehr senden kann oder niemand antwortet.',
          'Einen empfangenen Notruf <b>mitschreiben</b>, kurz warten (die Küstenfunkstelle hat Vorrang) und dann antworten, wenn niemand reagiert.'
        ] }
      ],
      uebung: 'mayday'
    },
    {
      id: 'dsc', icon: '🔴', titel: 'DSC – der digitale Ruf',
      kurz: 'Rote Taste, MMSI, Position – in Sekunden.',
      bloecke: [
        { ul: [
          '<b>DSC</b> (Digital Selective Calling) sendet auf <b>Kanal 70</b> einen Datensatz: MMSI, Art des Rufs und – wenn ein GPS angeschlossen ist – die <b>Position</b>.',
          '<b>Notalarm:</b> Klappe öffnen, rote Taste <b>mehrere Sekunden gedrückt halten</b>, bis das Gerät quittiert. Wenn Zeit bleibt, vorher die Art des Notfalls wählen.',
          'Nach dem Alarm schaltet das Gerät selbst auf <b>Kanal 16</b> – dort folgt der gesprochene MAYDAY.',
          'Die <b>Bestätigung</b> kommt normalerweise von einer Küstenfunkstelle. Andere Schiffe antworten per Sprechfunk, nicht mit DSC.',
          'Versehentlich ausgelöst? <b>Nicht ausschalten</b> – auf Kanal 16 melden und den Fehlalarm widerrufen.',
          'Routineanrufe gehen auch per DSC: MMSI des Gegenübers wählen, Arbeitskanal vorschlagen, senden – das Gerät der Gegenseite klingelt.'
        ] }
      ],
      uebung: 'dsc'
    }
  ];

  /* ---------------- Übungseinheiten ----------------
     typ der Schritte:
       funkspruch – Bausteine in die richtige Reihenfolge tippen
       kanal      – Kanal am Gerät einstellen
       dsc        – Klappe öffnen und die rote Taste halten
       wahl       – Entscheidungsfrage
       info       – nur Hinweis, weiter mit Knopf
  -------------------------------------------------- */
  var EINHEITEN = [

    /* ===== Grundlagen ===== */
    {
      id: 'buchstabieren', gruppe: 'Grundlagen', icon: '🔤', dauer: '2 Min.',
      titel: { de: 'Buchstabieren', en: 'Spelling' },
      lage: { de: 'Split Radio versteht deinen Schiffsnamen nicht und bittet dich, ihn zu buchstabieren. Dazu dein Rufzeichen.', en: 'Split Radio did not catch your vessel name and asks you to spell it, together with your call sign.' },
      schritte: [
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Buchstabiere „SAIL“ – mit Ansage.', en: 'Spell “SAIL” – announce it first.' },
          teile: [
            { de: 'I SPELL', en: 'I SPELL' },
            { de: 'Sierra', en: 'Sierra' }, { de: 'Alfa', en: 'Alfa' }, { de: 'India', en: 'India' }, { de: 'Lima', en: 'Lima' }
          ],
          stoerer: [{ de: 'Siegfried', en: 'Sugar' }, { de: 'Anton', en: 'Able' }, { de: 'Lima Lima', en: 'Lima Lima' }, { de: 'OUT', en: 'OUT' }],
          antwort: { de: 'Sailing X – hier ist Split Radio. Verstanden. Bitte buchstabieren Sie auch Ihr Rufzeichen. Over.', en: 'Sailing X – this is Split Radio. Roger. Please also spell your call sign. Over.' } },
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Rufzeichen OEX1234: Buchstaben buchstabieren, Zahlen einzeln sprechen.', en: 'Call sign OEX1234: spell the letters, read the figures one by one.' },
          teile: [
            { de: 'Oscar', en: 'Oscar' }, { de: 'Echo', en: 'Echo' }, { de: 'X-Ray', en: 'X-Ray' },
            { de: 'eins – zwei – drei – vier', en: 'one – two – three – four' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'eintausendzweihundertvierunddreißig', en: 'one thousand two hundred thirty four' }, { de: 'Ökonom', en: 'Oboe' }, { de: 'Xylophon', en: 'X-Ray X-Ray' }],
          antwort: { de: 'Sailing X, Rufzeichen Oscar Echo X-Ray eins zwei drei vier – hier ist Split Radio. Verstanden. Out.', en: 'Sailing X, call sign Oscar Echo X-Ray one two three four – this is Split Radio. Roger. Out.' } }
      ],
      merke: { de: 'Namen und Rufzeichen immer buchstabieren, Zahlen immer ziffernweise. „I SPELL“ kündigt das Buchstabieren an.', en: 'Always spell names and call signs, always read figures digit by digit. “I SPELL” announces spelling.' }
    },

    {
      id: 'funkwoerter', gruppe: 'Grundlagen', icon: '💬', dauer: '3 Min.',
      titel: { de: 'Funkwörter und Verhalten', en: 'Procedure words' },
      lage: { de: 'Sechs kurze Fragen zu den Wörtern, die im Funkverkehr festgelegt sind – und dazu, wie man sich auf Kanal 16 verhält.', en: 'Six quick questions on the standard procedure words and on conduct on channel 16.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Du hast deine Durchsage beendet und erwartest eine Antwort. Was sagst du?', en: 'You finished your transmission and expect a reply. What do you say?' },
          optionen: [{ de: 'OVER', en: 'OVER', ok: true }, { de: 'OUT', en: 'OUT' }, { de: 'OVER AND OUT', en: 'OVER AND OUT' }, { de: 'ROGER', en: 'ROGER' }],
          erklaerung: { de: 'OVER heißt: Ich bin fertig und warte auf Antwort. OUT beendet das Gespräch – beides zusammen gibt es nicht.', en: 'OVER means: I have finished and expect a reply. OUT ends the exchange – never use both together.' } },
        { typ: 'wahl', frage: { de: 'Du hast eine Durchsage nicht verstanden. Was sagst du?', en: 'You did not understand a message. What do you say?' },
          optionen: [{ de: 'SAY AGAIN', en: 'SAY AGAIN', ok: true }, { de: 'REPEAT', en: 'REPEAT' }, { de: 'WHAT', en: 'WHAT' }, { de: 'STAND BY', en: 'STAND BY' }],
          erklaerung: { de: 'SAY AGAIN ist die festgelegte Floskel. „Repeat“ bedeutet im militärischen Sprachgebrauch etwas anderes.', en: 'SAY AGAIN is the standard phrase; “repeat” has a different meaning in military usage.' } },
        { typ: 'wahl', frage: { de: 'Auf welchem Kanal läuft der DSC-Verkehr?', en: 'Which channel carries DSC traffic?' },
          optionen: [{ de: 'Kanal 70', en: 'Channel 70', ok: true }, { de: 'Kanal 16', en: 'Channel 16' }, { de: 'Kanal 06', en: 'Channel 06' }, { de: 'Kanal 13', en: 'Channel 13' }],
          erklaerung: { de: 'Kanal 70 ist reiner Datenkanal – dort wird nie gesprochen. Gesprochen wird danach auf Kanal 16.', en: 'Channel 70 is data only – never speak on it. The voice call follows on channel 16.' } },
        { typ: 'wahl', frage: { de: 'Du hörst „SEELONCE MAYDAY“. Was bedeutet das für dich?', en: 'You hear “SEELONCE MAYDAY”. What does that mean for you?' },
          optionen: [{ de: 'Funkstille halten – es läuft Notverkehr', en: 'Keep radio silence – distress traffic in progress', ok: true },
            { de: 'Auf einen Arbeitskanal wechseln', en: 'Switch to a working channel' },
            { de: 'Den Notruf weitergeben', en: 'Relay the distress call' },
            { de: 'Das Gerät ausschalten', en: 'Switch off the radio' }],
          erklaerung: { de: 'Funkstille auf dem Kanal, bis „SEELONCE FEENEE“ den Notverkehr für beendet erklärt.', en: 'Radio silence on that channel until “SEELONCE FEENEE” declares distress traffic ended.' } },
        { typ: 'wahl', frage: { de: 'Du rufst die Marina auf Kanal 16 – keine Antwort. Wann rufst du erneut?', en: 'You call the marina on channel 16 – no reply. When do you call again?' },
          optionen: [{ de: 'Nach etwa zwei Minuten', en: 'After about two minutes', ok: true },
            { de: 'Sofort noch einmal', en: 'Immediately again' },
            { de: 'Nach zehn Sekunden', en: 'After ten seconds' },
            { de: 'Gar nicht mehr', en: 'Not at all' }],
          erklaerung: { de: 'Kanal 16 muss frei bleiben. Zwei Minuten Pause, danach noch einmal – und dann eine andere Quelle versuchen (Telefon, Revierführer).', en: 'Channel 16 must stay clear. Wait two minutes, then try again – and otherwise use another way (phone, pilot book).' } },
        { typ: 'wahl', frage: { de: 'Wer ordnet an Bord den Notruf an?', en: 'Who orders a distress call on board?' },
          optionen: [{ de: 'Der Schiffsführer', en: 'The skipper', ok: true },
            { de: 'Wer das Funkzeugnis hat', en: 'Whoever holds the radio certificate' },
            { de: 'Die Küstenfunkstelle', en: 'The coast radio station' },
            { de: 'Jedes Crewmitglied jederzeit', en: 'Any crew member at any time' }],
          erklaerung: { de: 'Die Funkstelle untersteht dem Schiffsführer. Im Notfall darf allerdings jeder funken – auch ohne Funkzeugnis.', en: 'The radio station is under the skipper’s command. In distress, however, anyone may transmit – even without a certificate.' } }
      ],
      merke: { de: 'OVER erwartet Antwort, OUT beendet. SAY AGAIN statt „repeat“. Kanal 16 freihalten, Kanal 70 ist nur für Daten.', en: 'OVER expects a reply, OUT ends it. Say “SAY AGAIN”. Keep 16 clear, 70 is data only.' }
    },

    {
      id: 'kanalkunde', gruppe: 'Grundlagen', icon: '🎚️', dauer: '2 Min.',
      titel: { de: 'Kanäle und Gerät', en: 'Channels and set' },
      lage: { de: 'Vier Lagen, vier Kanäle – stelle jeweils den richtigen ein.', en: 'Four situations, four channels – set the right one each time.' },
      schritte: [
        { typ: 'kanal', ziel: 16, start: 72,
          hinweis: { de: 'Du willst die Marina zum ersten Mal rufen. Welcher Kanal?', en: 'You want to call the marina for the first time. Which channel?' },
          erklaerung: { de: 'Der erste Anruf läuft über Kanal 16 – danach auf den Arbeitskanal wechseln.', en: 'The initial call goes out on channel 16 – then move to a working channel.' } },
        { typ: 'kanal', ziel: 6,
          hinweis: { de: 'Ein Frachter schlägt für die Absprache Schiff–Schiff den üblichen Kanal vor. Welcher ist das?', en: 'A freighter suggests the usual ship-to-ship channel. Which one?' },
          erklaerung: { de: 'Kanal 06 ist der Schiff–Schiff-Kanal, auch für den Verkehr mit Seenotrettungsmitteln.', en: 'Channel 06 is ship-to-ship, also used with search and rescue units.' } },
        { typ: 'kanal', ziel: 70,
          hinweis: { de: 'Auf welchem Kanal sendet dein Gerät den DSC-Notalarm?', en: 'On which channel does your set send the DSC distress alert?' },
          erklaerung: { de: 'Kanal 70 – reiner Datenkanal. Gesprochen wird dort nie.', en: 'Channel 70 – data only. Never speak on it.' } },
        { typ: 'kanal', ziel: 13,
          hinweis: { de: 'Brücke–Brücke, Absprache zur Sicherheit der Schifffahrt – welcher Kanal?', en: 'Bridge-to-bridge, navigational safety – which channel?' },
          erklaerung: { de: 'Kanal 13 ist international für Brücke–Brücke vorgesehen.', en: 'Channel 13 is the international bridge-to-bridge channel.' } }
      ],
      merke: { de: '16 rufen und Not – 70 DSC – 06 Schiff–Schiff – 13 Brücke–Brücke – Marina meist 71 oder 74.', en: '16 calling and distress – 70 DSC – 06 ship-to-ship – 13 bridge-to-bridge – marinas usually 71 or 74.' }
    },

    /* ===== Routine ===== */
    {
      id: 'marina', gruppe: 'Routineverkehr', icon: '⚓', dauer: '4 Min.',
      titel: { de: 'Liegeplatz in der Marina', en: 'Asking for a berth' },
      lage: { de: 'Du näherst dich der Marina Kaštela und möchtest für eine Nacht einen Liegeplatz. Ankunft voraussichtlich 17:30 Uhr.', en: 'You are approaching Marina Kaštela and want a berth for one night, ETA 17:30.' },
      schritte: [
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Rufe die Marina auf Kanal 16 – Gerufener zuerst, dann du.', en: 'Call the marina on channel 16 – the station called first, then yourself.' },
          teile: [
            { de: 'Marina Kaštela, Marina Kaštela', en: 'Marina Kaštela, Marina Kaštela' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'Rufzeichen Oscar Echo X-Ray eins zwei drei vier', en: 'call sign Oscar Echo X-Ray one two three four' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [
            { de: 'Wir brauchen einen Liegeplatz für eine Nacht', en: 'We need a berth for one night', warum: { de: 'Das Anliegen kommt erst auf dem Arbeitskanal – Kanal 16 bleibt frei.', en: 'The request belongs on the working channel – keep 16 clear.' } },
            { de: 'OUT', en: 'OUT', warum: { de: 'OUT beendet das Gespräch. Du erwartest aber eine Antwort: OVER.', en: 'OUT ends the exchange. You expect a reply, so: OVER.' } },
            { de: 'MAYDAY', en: 'MAYDAY', warum: { de: 'MAYDAY ist ausschließlich für unmittelbare Gefahr.', en: 'MAYDAY is only for immediate danger.' } }
          ],
          antwort: { de: 'Sailing X – hier ist Marina Kaštela. Wechseln Sie bitte auf Kanal 71. Over.', en: 'Sailing X – this is Marina Kaštela. Please switch to channel 71. Over.' } },
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Bestätige den Kanalwechsel – kurz.', en: 'Confirm the channel change – keep it short.' },
          teile: [
            { de: 'Marina Kaštela – hier ist Sailing X', en: 'Marina Kaštela – this is Sailing X' },
            { de: 'verstanden, Kanal sieben – eins', en: 'roger, channel seven – one' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'verstanden, Kanal einundsiebzig', en: 'roger, channel seventy-one', warum: { de: 'Zahlen werden ziffernweise gesprochen: sieben – eins.', en: 'Figures are spoken digit by digit: seven – one.' } }] },
        { typ: 'kanal', ziel: 71,
          hinweis: { de: 'Stelle den vereinbarten Arbeitskanal ein.', en: 'Set the agreed working channel.' },
          erklaerung: { de: 'Erst wechseln, dann weitersprechen – Kanal 16 ist wieder frei.', en: 'Switch first, then continue – channel 16 is clear again.' } },
        { typ: 'funkspruch', kanal: 71,
          hinweis: { de: 'Jetzt das Anliegen: wer du bist, was du brauchst, wann du da bist.', en: 'Now the request: who you are, what you need, when you arrive.' },
          teile: [
            { de: 'Marina Kaštela – hier ist Sailing X', en: 'Marina Kaštela – this is Sailing X' },
            { de: 'wir sind eine Segelyacht von 12 Metern Länge', en: 'we are a sailing yacht of 12 metres' },
            { de: 'wir bitten um einen Liegeplatz für eine Nacht', en: 'we request a berth for one night' },
            { de: 'voraussichtliche Ankunft 17:30 Uhr', en: 'our ETA is 17:30' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'Rufzeichen Oscar Echo X-Ray eins zwei drei vier', en: 'call sign Oscar Echo X-Ray one two three four', warum: { de: 'Auf dem Arbeitskanal kennt ihr euch schon – der Name genügt.', en: 'On the working channel you are already identified – the name is enough.' } }],
          antwort: { de: 'Sailing X – hier ist Marina Kaštela. Liegeplatz D 14, Backbord längsseits. Melden Sie sich bei der Einfahrt. Over.', en: 'Sailing X – this is Marina Kaštela. Berth D 14, port side alongside. Call us at the entrance. Over.' } },
        { typ: 'funkspruch', kanal: 71,
          hinweis: { de: 'Wiederhole das Wesentliche und beende das Gespräch.', en: 'Read back the essentials and end the exchange.' },
          teile: [
            { de: 'Marina Kaštela – hier ist Sailing X', en: 'Marina Kaštela – this is Sailing X' },
            { de: 'verstanden, Liegeplatz Delta eins – vier', en: 'roger, berth Delta one – four' },
            { de: 'vielen Dank', en: 'thank you' },
            { de: 'OUT', en: 'OUT' }
          ],
          stoerer: [{ de: 'OVER', en: 'OVER', warum: { de: 'Hier ist alles geklärt – das Gespräch endet mit OUT.', en: 'Everything is settled – end with OUT.' } }] }
      ],
      merke: { de: 'Erst auf 16 rufen, Kanal vereinbaren, wechseln, dann das Anliegen. Wichtige Angaben zurücklesen. Schluss mit OUT.', en: 'Call on 16, agree a channel, switch, then state your business. Read back what matters. Finish with OUT.' }
    },

    {
      id: 'schiff', gruppe: 'Routineverkehr', icon: '🚢', dauer: '3 Min.',
      titel: { de: 'Absprache mit einem Frachter', en: 'Agreeing with a freighter' },
      lage: { de: 'Ein Frachter kommt von Steuerbord, die Peilung steht. Du siehst seinen Namen „Adriatic Star“ im AIS und willst das Passieren absprechen.', en: 'A freighter is approaching from starboard on a steady bearing. AIS shows her name “Adriatic Star”. You want to agree on how to pass.' },
      schritte: [
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Rufe den Frachter auf Kanal 16 und schlage gleich den Arbeitskanal vor.', en: 'Call the freighter on 16 and propose the working channel right away.' },
          teile: [
            { de: 'Adriatic Star, Adriatic Star', en: 'Adriatic Star, Adriatic Star' },
            { de: 'hier ist Segelyacht Sailing X', en: 'this is sailing yacht Sailing X' },
            { de: 'zwei Seemeilen an Ihrer Backbordseite', en: 'two miles on your port side' },
            { de: 'bitte Kanal null – sechs', en: 'please channel zero – six' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'bitte Kanal sechzehn', en: 'please channel sixteen', warum: { de: 'Auf 16 wird nur gerufen – das Gespräch läuft auf einem Arbeitskanal.', en: 'Channel 16 is for calling only – the exchange moves to a working channel.' } },
            { de: 'PAN PAN', en: 'PAN PAN', warum: { de: 'Es ist kein Dringlichkeitsfall – noch ist alles unter Kontrolle.', en: 'This is no urgency case – everything is still under control.' } }],
          antwort: { de: 'Segelyacht an meiner Backbordseite – hier ist Adriatic Star. Wechsle auf Kanal null sechs. Over.', en: 'Sailing yacht on my port side – this is Adriatic Star. Switching to channel zero six. Over.' } },
        { typ: 'kanal', ziel: 6, hinweis: { de: 'Wechsle auf den vereinbarten Kanal.', en: 'Switch to the agreed channel.' } },
        { typ: 'funkspruch', kanal: 6,
          hinweis: { de: 'Sag, wer du bist, was du vorhast und was du vorschlägst.', en: 'State who you are, what you intend and what you propose.' },
          teile: [
            { de: 'Adriatic Star – hier ist Sailing X', en: 'Adriatic Star – this is Sailing X' },
            { de: 'ich bin die Segelyacht zwei Seemeilen an Ihrer Backbordseite', en: 'I am the sailing yacht two miles on your port side' },
            { de: 'ich drehe nach Steuerbord und passiere hinter Ihrem Heck', en: 'I am altering to starboard and will pass astern of you' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'ich halte meinen Kurs, bitte weichen Sie aus', en: 'I keep my course, please give way', warum: { de: 'Gegenüber einem Maschinenfahrzeug in einem engen Fahrwasser oder bei Kreuzkursen hilft eine klare eigene Ansage mehr als ein Vorrangstreit über Funk.', en: 'A clear statement of your own manoeuvre helps more than arguing about right of way over the radio.' } }],
          antwort: { de: 'Sailing X – hier ist Adriatic Star. Verstanden, Sie passieren hinter meinem Heck. Ich halte Kurs und Geschwindigkeit. Out.', en: 'Sailing X – this is Adriatic Star. Roger, you will pass astern. I maintain course and speed. Out.' } }
      ],
      merke: { de: 'Beschreibe dich so, dass der andere dich findet: Richtung, Abstand, Fahrzeugart. Und sag, was du tust – nicht, was er tun soll.', en: 'Describe yourself so the other ship can find you: bearing, distance, type. And say what you will do – not what he should do.' }
    },

    /* ===== Notfall ===== */
    {
      id: 'mayday', gruppe: 'Notverkehr', icon: '🆘', dauer: '5 Min.',
      titel: { de: 'MAYDAY absetzen', en: 'Sending a MAYDAY' },
      lage: { de: 'Nach einer Grundberührung dringt Wasser ein, die Bilgepumpe kommt nicht nach. Vier Personen an Bord, eine Person ist verletzt. Der Schiffsführer ordnet den Notruf an.', en: 'After going aground you are taking water and the bilge pump cannot cope. Four people on board, one injured. The skipper orders a distress call.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Welcher Ruf ist richtig?', en: 'Which call is correct?' },
          optionen: [{ de: 'MAYDAY', en: 'MAYDAY', ok: true }, { de: 'PAN PAN', en: 'PAN PAN' }, { de: 'SÉCURITÉ', en: 'SÉCURITÉ' }, { de: 'Routineanruf an die Marina', en: 'Routine call to the marina' }],
          erklaerung: { de: 'Wassereinbruch mit Sinkgefahr und eine verletzte Person: unmittelbare Gefahr – MAYDAY.', en: 'Flooding with risk of sinking and an injured person: immediate danger – MAYDAY.' } },
        { typ: 'kanal', ziel: 16, start: 71, hinweis: { de: 'Stelle Kanal 16 ein und schalte auf volle Leistung.', en: 'Set channel 16 and full power.' } },
        { typ: 'funkspruch', kanal: 16, lang: true,
          hinweis: { de: 'Setze den MAYDAY ab – in der festgelegten Reihenfolge.', en: 'Send the MAYDAY – in the set order.' },
          teile: [
            { de: 'MAYDAY – MAYDAY – MAYDAY', en: 'MAYDAY – MAYDAY – MAYDAY' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'Rufzeichen Oscar Echo X-Ray eins zwei drei vier, MMSI zwei null drei eins zwei drei vier fünf sechs', en: 'call sign Oscar Echo X-Ray one two three four, MMSI two zero three one two three four five six' },
            { de: 'MAYDAY Sailing X', en: 'MAYDAY Sailing X' },
            { de: 'Position 43 Grad 12 Komma 4 Minuten Nord – 016 Grad 23 Komma 8 Minuten Ost', en: 'position 43 degrees 12 decimal 4 minutes North – 016 degrees 23 decimal 8 minutes East' },
            { de: 'wir haben nach Grundberührung Wassereinbruch und sinken', en: 'we have struck a rock, we are taking water and sinking' },
            { de: 'wir brauchen sofort Hilfe', en: 'we require immediate assistance' },
            { de: 'vier Personen an Bord, eine Person verletzt', en: 'four persons on board, one person injured' },
            { de: 'wir machen die Rettungsinsel klar', en: 'we are preparing the liferaft' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [
            { de: 'OUT', en: 'OUT', warum: { de: 'Nach einem Notruf wartest du auf Antwort – also OVER.', en: 'After a distress call you wait for a reply – so OVER.' } },
            { de: 'bitte rufen Sie uns zurück', en: 'please call us back', warum: { de: 'Keine Floskeln im Notruf – nur die festgelegten Angaben.', en: 'No small talk in a distress call – only the set items.' } },
            { de: 'wir sind eine Segelyacht von 12 Metern', en: 'we are a sailing yacht of 12 metres', warum: { de: 'Nett zu wissen, aber im Notruf zählt zuerst: Wer – wo – was – welche Hilfe – wie viele Personen.', en: 'Useful later, but a distress call needs: who – where – what – what help – how many persons.' } }
          ],
          antwort: { de: 'MAYDAY Sailing X – hier ist Split Radio, Split Radio. Ihr MAYDAY ist empfangen. Rettungseinheiten sind alarmiert. Bleiben Sie auf Kanal 16. Over.', en: 'MAYDAY Sailing X – this is Split Radio, Split Radio. Your MAYDAY is received. Rescue units are alerted. Remain on channel 16. Over.' } },
        { typ: 'wahl', frage: { de: 'Niemand hätte geantwortet – was tust du?', en: 'Suppose nobody had answered – what do you do?' },
          optionen: [{ de: 'Den MAYDAY in kurzen Abständen wiederholen', en: 'Repeat the MAYDAY at short intervals', ok: true },
            { de: 'Auf einen anderen Kanal wechseln', en: 'Change to another channel' },
            { de: 'Das Gerät neu starten', en: 'Restart the set' },
            { de: 'Eine Stunde warten', en: 'Wait for an hour' }],
          erklaerung: { de: 'Wiederholen, bis jemand antwortet – parallel DSC-Alarm, Seenotsignale und, wenn vorhanden, EPIRB.', en: 'Repeat until someone answers – and in parallel use DSC, distress signals and, if fitted, the EPIRB.' } }
      ],
      merke: { de: 'MAYDAY 3× – hier ist Name 3× – MAYDAY Name – Position – was ist passiert – welche Hilfe – Personen – Weiteres – OVER.', en: 'MAYDAY ×3 – this is name ×3 – MAYDAY name – position – nature – assistance – persons – further info – OVER.' }
    },

    {
      id: 'dsc', gruppe: 'Notverkehr', icon: '🔴', dauer: '3 Min.',
      titel: { de: 'DSC-Notalarm', en: 'DSC distress alert' },
      lage: { de: 'Feuer im Motorraum. Dein Gerät hat DSC und ist mit dem GPS verbunden. Jede Sekunde zählt.', en: 'Fire in the engine room. Your set has DSC and is connected to the GPS. Every second counts.' },
      schritte: [
        { typ: 'dsc', hinweis: { de: 'Klappe öffnen und die rote Taste halten, bis das Gerät quittiert.', en: 'Open the cover and hold the red key until the set confirms.' },
          erklaerung: { de: 'Das Gerät sendet auf Kanal 70 MMSI, Art des Notfalls und Position – und schaltet danach selbst auf Kanal 16.', en: 'The set transmits MMSI, nature of distress and position on channel 70 – and then switches itself to channel 16.' } },
        { typ: 'info', text: { de: 'Der Alarm ist raus. Das Gerät steht jetzt auf Kanal 16.', en: 'The alert has gone out. The set is now on channel 16.' }, kanal: 16 },
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Jetzt der gesprochene MAYDAY – kurz und vollständig.', en: 'Now the spoken MAYDAY – short and complete.' },
          teile: [
            { de: 'MAYDAY – MAYDAY – MAYDAY', en: 'MAYDAY – MAYDAY – MAYDAY' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'MMSI zwei null drei eins zwei drei vier fünf sechs', en: 'MMSI two zero three one two three four five six' },
            { de: 'MAYDAY Sailing X', en: 'MAYDAY Sailing X' },
            { de: 'Position 43 Grad 12 Komma 4 Minuten Nord – 016 Grad 23 Komma 8 Minuten Ost', en: 'position 43 degrees 12 decimal 4 minutes North – 016 degrees 23 decimal 8 minutes East' },
            { de: 'Feuer im Motorraum, wir bekommen es nicht unter Kontrolle', en: 'fire in the engine room, we cannot bring it under control' },
            { de: 'wir brauchen sofort Hilfe', en: 'we require immediate assistance' },
            { de: 'vier Personen an Bord', en: 'four persons on board' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'wir haben den DSC-Alarm ausgelöst', en: 'we have sent a DSC alert', warum: { de: 'Das weiß die Gegenstelle bereits – im MAYDAY zählt die Lage.', en: 'The other station already knows – the distress call states the situation.' } }],
          antwort: { de: 'MAYDAY Sailing X – hier ist Split Radio. Ihr DSC-Alarm und Ihr MAYDAY sind empfangen. Hubschrauber und Rettungsboot laufen aus. Over.', en: 'MAYDAY Sailing X – this is Split Radio. Your DSC alert and your MAYDAY are received. Helicopter and lifeboat are on the way. Over.' } },
        { typ: 'wahl', frage: { de: 'Du hast den DSC-Alarm versehentlich ausgelöst. Was tust du?', en: 'You triggered the DSC alert by mistake. What do you do?' },
          optionen: [{ de: 'Auf Kanal 16 melden und den Fehlalarm widerrufen', en: 'Announce on channel 16 and cancel the false alert', ok: true },
            { de: 'Das Gerät ausschalten', en: 'Switch the set off' },
            { de: 'Abwarten, ob sich jemand meldet', en: 'Wait and see whether anyone calls' },
            { de: 'Den Alarm noch einmal auslösen', en: 'Trigger the alert again' }],
          erklaerung: { de: 'Niemals ausschalten: Auf Kanal 16 melden, Schiffsname, MMSI und „Fehlalarm, bitte streichen“ – sonst läuft ein Sucheinsatz an.', en: 'Never switch off: call on 16 with vessel name, MMSI and cancel the false alert – otherwise a search will be launched.' } }
      ],
      merke: { de: 'DSC zuerst, Sprechfunk danach. Das Gerät schickt MMSI und Position – der MAYDAY auf 16 sagt, was los ist.', en: 'DSC first, voice second. The set sends MMSI and position – the MAYDAY on 16 explains the situation.' }
    },

    {
      id: 'panpan', gruppe: 'Notverkehr', icon: '🟠', dauer: '4 Min.',
      titel: { de: 'PAN PAN – Motorschaden', en: 'PAN PAN – engine failure' },
      lage: { de: 'Der Motor ist ausgefallen, der Wind steht mit 5 Beaufort auf die Küste, zwei Seemeilen Luvabstand. Noch ist niemand in Gefahr – aber es wird eng.', en: 'Your engine has failed, the wind is force 5 onto the shore, two miles to leeward. Nobody is in danger yet – but it is getting tight.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Welcher Ruf passt?', en: 'Which call fits?' },
          optionen: [{ de: 'PAN PAN', en: 'PAN PAN', ok: true }, { de: 'MAYDAY', en: 'MAYDAY' }, { de: 'SÉCURITÉ', en: 'SÉCURITÉ' }, { de: 'Routineanruf', en: 'Routine call' }],
          erklaerung: { de: 'Dringend, aber noch keine unmittelbare Gefahr für Schiff und Crew: PAN PAN. Wird die Lage schlechter, folgt MAYDAY.', en: 'Urgent, but no immediate danger yet: PAN PAN. If it gets worse, upgrade to MAYDAY.' } },
        { typ: 'funkspruch', kanal: 16, lang: true,
          hinweis: { de: 'Dringlichkeitsruf an alle Funkstellen.', en: 'Urgency call to all stations.' },
          teile: [
            { de: 'PAN PAN – PAN PAN – PAN PAN', en: 'PAN PAN – PAN PAN – PAN PAN' },
            { de: 'an alle Funkstellen, an alle Funkstellen, an alle Funkstellen', en: 'all stations, all stations, all stations' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'Rufzeichen Oscar Echo X-Ray eins zwei drei vier', en: 'call sign Oscar Echo X-Ray one two three four' },
            { de: 'Position zwei Seemeilen südwestlich von Kap Ploča', en: 'position two miles south-west of Cape Ploča' },
            { de: 'unser Motor ist ausgefallen, wir treiben auf eine Leeküste zu', en: 'our engine has failed and we are drifting towards a lee shore' },
            { de: 'wir bitten um Schleppunterstützung', en: 'we request a tow' },
            { de: 'vier Personen an Bord, niemand verletzt', en: 'four persons on board, nobody injured' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'MAYDAY Sailing X', en: 'MAYDAY Sailing X', warum: { de: 'Der MAYDAY-Aufbau gehört zum Notruf. Beim Dringlichkeitsruf heißt es „an alle Funkstellen“.', en: 'That belongs to a distress call. An urgency call addresses “all stations”.' } },
            { de: 'wir verlassen das Schiff', en: 'we are abandoning ship', warum: { de: 'Das stimmt nicht – und würde die Lage falsch darstellen.', en: 'That is not true – and would misrepresent the situation.' } }],
          antwort: { de: 'Sailing X – hier ist Split Radio. Ihr PAN PAN ist empfangen. Ein Boot der Küstenwache ist unterwegs, voraussichtlich 40 Minuten. Bleiben Sie auf Kanal 16. Over.', en: 'Sailing X – this is Split Radio. Your PAN PAN is received. A coastguard boat is on the way, about 40 minutes. Remain on channel 16. Over.' } },
        { typ: 'wahl', frage: { de: 'Der Anker hält nicht, die Brandung ist nah. Was jetzt?', en: 'The anchor drags and the surf is close. What now?' },
          optionen: [{ de: 'Auf MAYDAY hochstufen', en: 'Upgrade to MAYDAY', ok: true },
            { de: 'Den PAN PAN wiederholen', en: 'Repeat the PAN PAN' },
            { de: 'Auf das Boot der Küstenwache warten', en: 'Wait for the coastguard boat' },
            { de: 'Auf einen Arbeitskanal wechseln', en: 'Switch to a working channel' }],
          erklaerung: { de: 'Sobald unmittelbare Gefahr besteht, wird aus der Dringlichkeit ein Notfall – MAYDAY, und zwar früh genug.', en: 'As soon as there is immediate danger, urgency becomes distress – send MAYDAY, and send it early enough.' } }
      ],
      merke: { de: 'PAN PAN 3× – an alle Funkstellen 3× – wer – wo – was – welche Hilfe – Personen – OVER. Und: rechtzeitig hochstufen.', en: 'PAN PAN ×3 – all stations ×3 – who – where – what – what help – persons – OVER. And upgrade in good time.' }
    },

    {
      id: 'securite', gruppe: 'Notverkehr', icon: '🔵', dauer: '3 Min.',
      titel: { de: 'SÉCURITÉ – Warnung', en: 'SÉCURITÉ – safety message' },
      lage: { de: 'Eine Seemeile vor dir treibt ein halb untergetauchter Container in der Fahrrinne. Für dich ungefährlich – für andere nicht.', en: 'A half-submerged container is drifting in the fairway a mile ahead. No danger to you – but to others.' },
      schritte: [
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Kündige die Sicherheitsmeldung auf Kanal 16 an und nenne den Kanal für die Durchsage.', en: 'Announce the safety message on 16 and name the channel for the message itself.' },
          teile: [
            { de: 'SÉCURITÉ – SÉCURITÉ – SÉCURITÉ', en: 'SÉCURITÉ – SÉCURITÉ – SÉCURITÉ' },
            { de: 'an alle Funkstellen, an alle Funkstellen, an alle Funkstellen', en: 'all stations, all stations, all stations' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'Sicherheitsmeldung folgt auf Kanal null – sechs', en: 'safety message follows on channel zero – six' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'wir haben einen Container gesichtet', en: 'we have sighted a container', warum: { de: 'Die Meldung selbst kommt auf dem Arbeitskanal – Kanal 16 bleibt frei.', en: 'The message itself goes on the working channel – keep 16 clear.' } }] },
        { typ: 'kanal', ziel: 6, hinweis: { de: 'Wechsle auf den angekündigten Kanal.', en: 'Switch to the announced channel.' } },
        { typ: 'funkspruch', kanal: 6,
          hinweis: { de: 'Jetzt die Meldung: was, wo, seit wann.', en: 'Now the message: what, where, since when.' },
          teile: [
            { de: 'SÉCURITÉ', en: 'SÉCURITÉ' },
            { de: 'hier ist Sailing X', en: 'this is Sailing X' },
            { de: 'treibender Container, halb untergetaucht', en: 'drifting container, half submerged' },
            { de: 'Position 43 Grad 12 Komma 4 Minuten Nord – 016 Grad 23 Komma 8 Minuten Ost', en: 'position 43 degrees 12 decimal 4 minutes North – 016 degrees 23 decimal 8 minutes East' },
            { de: 'gesichtet um 14:20 Uhr', en: 'sighted at 14:20' },
            { de: 'OUT', en: 'OUT' }
          ],
          stoerer: [{ de: 'wir brauchen Hilfe', en: 'we require assistance', warum: { de: 'Eine Sicherheitsmeldung warnt andere – sie fordert nichts an.', en: 'A safety message warns others – it does not request anything.' } }],
          antwort: { de: 'Sailing X – hier ist Split Radio. Sicherheitsmeldung empfangen und weitergeleitet. Out.', en: 'Sailing X – this is Split Radio. Safety message received and relayed. Out.' } }
      ],
      merke: { de: 'SÉCURITÉ wird auf 16 angekündigt und auf dem Arbeitskanal durchgegeben – mit Position und Uhrzeit.', en: 'SÉCURITÉ is announced on 16 and transmitted on a working channel – with position and time.' }
    },

    {
      id: 'relay', gruppe: 'Notverkehr', icon: '🔁', dauer: '4 Min.',
      titel: { de: 'Notruf empfangen und weitergeben', en: 'Receiving and relaying a distress call' },
      lage: { de: 'Auf Kanal 16 hörst du schwach einen MAYDAY: Motorboot „Delfin“, Mann über Bord, Position drei Seemeilen nordwestlich von dir. Niemand antwortet.', en: 'On channel 16 you faintly hear a MAYDAY: motorboat “Delfin”, man overboard, three miles north-west of you. Nobody answers.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Was tust du zuerst?', en: 'What do you do first?' },
          optionen: [{ de: 'Mitschreiben und kurz abwarten, ob eine Küstenfunkstelle antwortet', en: 'Write it down and wait briefly for a coast station to answer', ok: true },
            { de: 'Sofort selbst MAYDAY senden', en: 'Immediately send a MAYDAY yourself' },
            { de: 'Den Kanal wechseln', en: 'Change channel' },
            { de: 'Weiterfahren, das ist Sache der Küstenwache', en: 'Carry on, that is the coastguard’s job' }],
          erklaerung: { de: 'Erst mitschreiben: Name, Position, Art des Notfalls. Küstenfunkstellen haben Vorrang – meldet sich niemand, antwortest du.', en: 'Write it down first: name, position, nature. Coast stations have priority – if nobody answers, you do.' } },
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Niemand hat geantwortet. Antworte dem Havaristen.', en: 'Nobody answered. Reply to the vessel in distress.' },
          teile: [
            { de: 'MAYDAY Delfin', en: 'MAYDAY Delfin' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'Ihr MAYDAY ist empfangen', en: 'received your MAYDAY' },
            { de: 'wir sind drei Seemeilen südöstlich von Ihnen und laufen auf Sie zu', en: 'we are three miles south-east of you and proceeding to your position' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'MAYDAY RELAY', en: 'MAYDAY RELAY', warum: { de: 'Das Relay kommt erst, wenn du den Notruf an andere weitergibst – zuerst antwortest du dem Havaristen.', en: 'The relay comes when you pass the call on to others – first answer the vessel in distress.' } }] },
        { typ: 'funkspruch', kanal: 16, lang: true,
          hinweis: { de: 'Gib den Notruf als MAYDAY RELAY weiter – die Küstenfunkstelle hört ihn offenbar nicht.', en: 'Pass the call on as a MAYDAY RELAY – the coast station obviously cannot hear it.' },
          teile: [
            { de: 'MAYDAY RELAY – MAYDAY RELAY – MAYDAY RELAY', en: 'MAYDAY RELAY – MAYDAY RELAY – MAYDAY RELAY' },
            { de: 'an alle Funkstellen, an alle Funkstellen, an alle Funkstellen', en: 'all stations, all stations, all stations' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'folgender Notruf wurde um 14:20 Uhr von Motorboot Delfin empfangen', en: 'the following distress call was received at 14:20 from motor vessel Delfin' },
            { de: 'Position drei Seemeilen nordwestlich von Kap Ploča', en: 'position three miles north-west of Cape Ploča' },
            { de: 'Mann über Bord, sofortige Hilfe erforderlich', en: 'man overboard, immediate assistance required' },
            { de: 'wir laufen auf die Position zu, Ankunft in etwa 20 Minuten', en: 'we are proceeding to the position, arriving in about 20 minutes' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'MAYDAY Sailing X', en: 'MAYDAY Sailing X', warum: { de: 'Du bist nicht in Not – du gibst den Notruf eines anderen weiter.', en: 'You are not in distress – you are relaying someone else’s call.' } }],
          antwort: { de: 'MAYDAY RELAY Sailing X – hier ist Split Radio. Verstanden, wir übernehmen die Leitung des Notverkehrs. SEELONCE MAYDAY. Over.', en: 'MAYDAY RELAY Sailing X – this is Split Radio. Roger, we take over control of distress traffic. SEELONCE MAYDAY. Over.' } },
        { typ: 'wahl', frage: { de: 'Was bedeutet das für deinen weiteren Funkverkehr?', en: 'What does that mean for your further radio traffic?' },
          optionen: [{ de: 'Nur noch senden, was den Notfall betrifft', en: 'Transmit only what concerns the distress', ok: true },
            { de: 'Kanal 16 ganz verlassen', en: 'Leave channel 16 altogether' },
            { de: 'Weiter wie bisher funken', en: 'Carry on as before' },
            { de: 'Den Notruf erneut wiederholen', en: 'Repeat the distress call again' }],
          erklaerung: { de: 'SEELONCE MAYDAY heißt Funkstille für alle, die nichts zum Notfall beizutragen haben. Du bleibst beteiligt – aber knapp.', en: 'SEELONCE MAYDAY means radio silence for everyone with nothing to add. You stay involved – but keep it short.' } }
      ],
      merke: { de: 'Mitschreiben, antworten, weitergeben: MAYDAY RELAY nennt zuerst dich, dann den fremden Notruf mit Zeit, Position und Lage.', en: 'Write it down, answer, relay: a MAYDAY RELAY names you first, then the other vessel’s call with time, position and situation.' }
    }
  ];

  return { SCHIFF: SCHIFF, ABC: ABC, THEORIE: THEORIE, EINHEITEN: EINHEITEN };
})();
