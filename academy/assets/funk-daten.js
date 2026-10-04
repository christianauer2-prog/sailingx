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
    ['A', 'Alfa', 'AL-fah'], ['B', 'Bravo', 'BRAH-wo'], ['C', 'Charlie', 'TSCHAR-lie'],
    ['D', 'Delta', 'DELL-tah'], ['E', 'Echo', 'ECK-oh'], ['F', 'Foxtrot', 'FOX-trott'],
    ['G', 'Golf', 'GOLF'], ['H', 'Hotel', 'ho-TELL'], ['I', 'India', 'IN-dia'],
    ['J', 'Juliett', 'DSCHU-li-ett'], ['K', 'Kilo', 'KI-loh'], ['L', 'Lima', 'LI-mah'],
    ['M', 'Mike', 'MAIK'], ['N', 'November', 'no-WEM-ber'], ['O', 'Oscar', 'OSS-kah'],
    ['P', 'Papa', 'pa-PA'], ['Q', 'Quebec', 'ke-BECK'], ['R', 'Romeo', 'ROH-mi-oh'],
    ['S', 'Sierra', 'si-ERR-ah'], ['T', 'Tango', 'TANG-go'], ['U', 'Uniform', 'JU-ni-form'],
    ['V', 'Victor', 'WIK-tah'], ['W', 'Whiskey', 'WISS-ki'], ['X', 'X-Ray', 'EXS-rei'],
    ['Y', 'Yankee', 'JANG-ki'], ['Z', 'Zulu', 'SU-lu']
  ];

  /* ---------------- Theorie ---------------- */
  var THEORIE = [
    {
      id: 'geraet', icon: '📻', titel: 'Gerät, Kanäle, Reichweite',
      kurz: 'Was das UKW-Gerät kann und wie weit es reicht.',
      bloecke: [
        { h: 'UKW-Seefunk', ul: [
          'UKW-Band <b>156–174 MHz</b>, 57 internationale Kanäle. Die Ausbreitung ist <b>quasi-optisch</b> – es zählt die <b>Antennenhöhe</b>, nicht die Leistung.',
          'Reichweite: Schiff–Schiff etwa <b>20–30 sm</b>, zu einer hoch gelegenen Küstenfunkstelle bis etwa <b>60 sm</b>.',
          'Festeinbau <b>25 W</b> mit Masttoppantenne, Handfunke <b>5–6 W</b> mit kurzer Antenne auf Augenhöhe – deshalb kommt die Handfunke selbst mit voller Leistung kaum über ein paar Seemeilen.',
          'Im Hafen und auf kurze Distanz auf <b>1 W</b> herunterschalten: Das hält den Kanal für alle anderen frei.'
        ] },
        { grafik: 'reichweite', legende: 'Nicht die Watt entscheiden, sondern die Höhe der Antenne über dem Wasser. Wer den Mast nutzt, hört und wird gehört.' },
        { h: 'Die Bedienelemente', tabelle: [
          ['Kanalwahl', 'Drehknopf oder ▲▼. Dazu eine eigene <b>Taste 16</b>, die aus jeder Lage sofort auf den Not- und Anrufkanal springt.'],
          ['Squelch', 'Rauschsperre. Nur so weit zudrehen, dass das Rauschen gerade verschwindet – zu weit zugedreht, und schwache Rufe bleiben unhörbar.'],
          ['Hi/Lo', 'Umschaltung <b>25 W / 1 W</b>. Im Hafen und für die Nachbaryacht reicht 1 W.'],
          ['INT / US / CAN', 'Kanalraster. In Europa steht das Gerät auf <b>INT</b>.'],
          ['Dual / Tri Watch', 'Das Gerät hört neben dem Arbeitskanal <b>Kanal 16</b> mit – Tri Watch zusätzlich einen dritten Kanal.'],
          ['Sprechtaste (PTT)', 'Solange sie gedrückt ist, sendest du und hörst nichts. Zum Antworten <b>loslassen</b>.']
        ] },
        { h: 'Simplex und Duplex', ul: [
          '<b>Simplex</b>: eine Frequenz, abwechselnd senden und hören. So laufen Kanal 16, die Schiff–Schiff-Kanäle <b>06, 08, 72, 77</b>, Brücke–Brücke <b>13</b>, Hafenkanäle und der Kleinfahrzeug-Sicherheitskanal <b>67</b>.',
          '<b>Duplex</b>: zwei Frequenzen gleichzeitig – gedacht für Küstenfunkstellen, Gesprächsvermittlung und Marinas (z. B. Kanal <b>80</b>). <b>Zwei Yachten können auf einem Duplexkanal nicht miteinander sprechen</b>, weil sie beide auf derselben Seite senden.'
        ] },
        { grafik: 'simplex', legende: 'Simplex: eine Frequenz für beide Richtungen – abwechselnd. Duplex: getrennte Frequenzen für Hin- und Rückweg.' },
        { h: 'Die wichtigsten Kanäle', tabelle: [
          ['16', 'Not-, Dringlichkeits- und Sicherheitsverkehr sowie <b>erster Anruf</b>. Ständige Hörwache halten, Kanal freihalten.'],
          ['70', '<b>Nur DSC</b> – digitale Rufe. Auf 70 wird nie gesprochen.'],
          ['06', 'Schiff–Schiff, auch Verkehr mit Seenotrettungsmitteln und Flugzeugen (SAR).'],
          ['08, 72, 77', 'Schiff–Schiff, freie Arbeitskanäle.'],
          ['13', 'Brücke–Brücke: kurze Absprachen zur Sicherheit der Schifffahrt („Sie laufen auf uns zu – passieren wir Steuerbord-Steuerbord?“).'],
          ['15, 17', 'Bordinterner Verkehr, <b>nur 1 W</b>.'],
          ['67', 'Sicherheitskanal für Kleinfahrzeuge, in vielen Revieren der Arbeitskanal der Küstenwache.'],
          ['09, 10, 73', 'Hafen, Lotsen und Küstenwache – revierabhängig.'],
          ['11, 12, 14, 69', 'Hafenverkehr und Verkehrslenkung.'],
          ['80 / 71 / 74', 'Marinas. Welcher Kanal gilt, steht im <b>Hafenhandbuch und Revierführer</b> – nie raten.'],
          ['AIS 1 / AIS 2', 'Zwei reservierte Kanäle für <b>AIS</b>-Daten. Dort wird weder gesprochen noch gerufen.']
        ] },
        { h: 'Vor jedem Anruf', ol: [
          'Richtigen Kanal einstellen und <b>zuhören</b>, ob er frei ist.',
          'Spruch im Kopf fertig haben – bei Not- und Dringlichkeitsrufen aufschreiben.',
          'Sprechtaste drücken, einen Moment warten, dann sprechen.',
          'Mit <b>OVER</b> enden und die Taste <b>loslassen</b>.'
        ] }
      ],
      uebung: 'kanalkunde'
    },
    {
      id: 'recht', icon: '⚖️', titel: 'Zulassung, Kennungen, Pflichten',
      kurz: 'Wer senden darf – und wozu man verpflichtet ist.',
      bloecke: [
        { h: 'Zwei Papiere, zwei Kennungen', ul: [
          'Das Gerät darf frei gekauft werden; <b>Einbau und Betrieb brauchen eine Funkstellenzulassung</b> für das Schiff. Rein empfangende Geräte (Radar, GPS, AIS-Empfänger, NAVTEX) nicht.',
          'Mit der Zulassung kommt das <b>internationale Rufzeichen</b>. Es gehört zum <b>Schiff</b> und bleibt beim Eigentümerwechsel erhalten – österreichische Jachten tragen <b>OEX + vier Ziffern</b>.',
          'Eine <b>tragbare</b> Funkstelle wird dagegen auf die <b>Person</b> zugelassen und bekommt eine eigene Kennung, die mit <b>T</b> beginnt.',
          'Für DSC kommt die <b>MMSI</b> dazu: neun Ziffern, die ersten drei sind die Länderkennung (MID).',
          'Senden darf nur, wer ein <b>Funkzeugnis</b> hat: <b>SRC</b> für UKW mit DSC in Küstennähe, <b>LRC</b> für Kurz- und Grenzwelle und Satellit, <b>UBI</b> für Binnengewässer. Das Zeugnis gilt <b>lebenslang</b> – <b>im Notfall darf jeder funken</b>.'
        ] },
        { h: 'Die neun Ziffern lesen', tabelle: [
          ['<b>203</b>123456', 'Schiffsfunkstelle. Die ersten drei Ziffern sind die Nationalität.'],
          ['<b>0</b>203 12345', 'Eine <b>Gruppe</b> von Schiffen – eine führende Null.'],
          ['<b>00</b>203 1234', 'Eine <b>Küstenfunkstelle</b> – zwei führende Nullen.'],
          ['MID im Mittelmeer', 'Österreich <b>203</b>, Deutschland <b>211/218</b>, Schweiz <b>269</b>, Kroatien <b>238</b>, Italien <b>247</b>, Slowenien <b>278</b>, Griechenland <b>237/239–241</b>, Großbritannien <b>232–235</b>.'],
          ['Nachschlagen', 'Die MMSI eines Schiffes findest du in der öffentlichen ITU-Liste – oder bequem im eigenen AIS-Empfänger.']
        ] },
        { h: 'Pflichten an Bord', ul: [
          'Die Funkstelle untersteht dem <b>Schiffsführer</b>. Er ordnet den Notruf an und ist für den Funkverkehr verantwortlich – <b>ohne seine Zustimmung wird nicht gesendet</b>.',
          '<b>Hörwache</b> auf Kanal 16 halten und den Kanal freihalten.',
          'Keine <b>Falsch- oder Scherzmeldungen</b> – ein vorgetäuschter Notruf ist strafbar und bindet Rettungskräfte.',
          '<b>Nie ohne Kennung</b> senden: Jeder Spruch nennt den eigenen Schiffsnamen.',
          'Keine Privatgespräche von Schiff zu Schiff über Gebühr, keine Musik, keine unnötigen Aussendungen, keine Kraftausdrücke.',
          'Nur auf <b>zugelassenen Frequenzen</b> senden – nicht auf fremden Hafen-, Behörden- oder Duplexkanälen.',
          'Im Notfall das Gerät <b>eingeschaltet lassen</b>, auch wenn man gerade nichts sagt.',
          '<b>Hilfeleistung ist Pflicht</b> – außer man gefährdet damit das eigene Schiff und die eigene Crew.'
        ] }
      ],
      uebung: 'kennung'
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
          ['NOTHING MORE', 'Ich habe nichts weiter.'],
          ['CORRECTION', 'Ich habe mich versprochen – es gilt das Folgende.'],
          ['SEELONCE MAYDAY', '<b>Funkstille</b> – es läuft Notverkehr. Nur die Notverkehrsleitung sendet.'],
          ['SEELONCE FEENEE', 'Der Notverkehr ist beendet, der Kanal ist wieder frei.']
        ] },
        { h: 'Funkcheck und Lesbarkeit', ul: [
          'Ein <b>Funkcheck</b> („radio check“) geht an eine Marina, eine Nachbaryacht oder auf einem <b>Arbeitskanal</b> – <b>nicht auf Kanal 16</b> und nicht an eine Küstenfunkstelle, die ihn als Belegung des Notkanals sieht.',
          'Die Antwort kommt als Zahl von <b>1 bis 5</b>: 1 = unverständlich, 2 = kaum verständlich, 3 = mit Mühe verständlich, 4 = verständlich, 5 = einwandfrei („loud and clear“).',
          'Antwortet niemand, hilft meist: Squelch prüfen, Kanal prüfen, auf 25 W schalten, Antennenstecker kontrollieren.'
        ] }
      ],
      uebung: 'funkcheck'
    },
    {
      id: 'abc', icon: '🔤', titel: 'Buchstabiertafel',
      kurz: 'Alfa, Bravo, Charlie – und Zahlen ziffernweise.',
      bloecke: [
        { abc: true, legende: 'Kursiv die Betonung: Sie liegt auf der hervorgehobenen Silbe.' },
        { ul: [
          'Zahlen einzeln sprechen: MMSI 203123456 wird zu „zwei – null – drei – eins – zwei – drei – vier – fünf – sechs“.',
          'Vor dem Buchstabieren <b>I SPELL</b> ansagen, dann Buchstabe für Buchstabe.',
          'Bei Positionen hilft die Form „vier – drei Grad, eins – zwei Komma vier Minuten Nord“.'
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
          'Den Namen des Gerufenen <b>einmal</b> nennen genügt meist; dreimal nur, wenn der Empfang schlecht ist. Nach einem DSC-Ruf reicht immer einmal.',
          'Vor dem Anruf hören, ob der Kanal frei ist. Keine Antwort? Erst nach <b>zwei Minuten</b> erneut rufen.'
        ] },
        { h: 'Küstenfunkstellen', ul: [
          'Sie sind die Drehscheibe im Revier: <b>Wetterberichte</b> und Warnnachrichten, <b>Vermittlung von Gesprächen</b>, Annahme von <b>Not- und Dringlichkeitsverkehr</b>.',
          '<b>Seewetterberichte</b> werden auf Kanal 16 <b>angekündigt</b> und auf einem Arbeitskanal <b>durchgegeben</b> – mitschreiben: Gebiet, Gültigkeit, Wind mit Böen, See, Sicht.',
          'Angerufen wird auf <b>Kanal 16</b> oder per <b>DSC</b>; den Arbeitskanal weist die Station zu. Ihre MMSI beginnt mit <b>zwei Nullen</b>.',
          'Die Sendezeiten der Wetterberichte stehen im Revierführer – im Mittelmeer meist alle drei bis vier Stunden, mit einer ausführlichen Ausgabe morgens und abends.'
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
        { grafik: 'stufen', legende: 'Alle drei beginnen auf Kanal 16. MAYDAY und PAN PAN bleiben dort, eine lange Sicherheitsmeldung wandert auf einen Arbeitskanal.' },
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
        { h: 'Eine Eselsbrücke für die Reihenfolge', tabelle: [
          ['<b>M</b>ayday', 'Dreimal die Ansage, dann wer du bist.'],
          ['<b>I</b>dentität', 'Schiffsname dreimal, Rufzeichen, MMSI.'],
          ['<b>P</b>osition', 'Breite und Länge – oder Peilung und Abstand.'],
          ['<b>D</b>istress', 'Was ist passiert.'],
          ['<b>A</b>ssistance', 'Welche Hilfe du brauchst.'],
          ['<b>N</b>umbers', 'Wie viele Personen an Bord, wie viele verletzt.'],
          ['<b>I</b>nfo', 'Alles, was dem Retter hilft: Rettungsinsel, Pyrotechnik, Farbe des Rumpfs.'],
          ['<b>O</b>ver', 'Taste loslassen und hören.']
        ] },
        { h: 'Einen Notruf quittieren', ul: [
          'Zuerst <b>mitschreiben</b> und <b>kurz warten</b> – die Küstenfunkstelle hat Vorrang.',
          'Antwortet niemand, quittierst du selbst: <b>MAYDAY</b> + Name des Havaristen, „hier ist Sailing X“, <b>„Ihr MAYDAY ist empfangen“</b>, dann was du tun kannst, <b>OVER</b>.',
          'Danach hältst du Verbindung und meldest der Rettungsleitstelle, was du siehst und tust.'
        ] },
        { h: 'MAYDAY RELAY – wann sofort, wann nach fünf Minuten', ul: [
          '<b>Sofort</b>, wenn du eine Not siehst, deren Betroffene selbst nicht senden können: Person im Wasser oder am Felsen, Mensch mit wiederholt gehobenen und gesenkten Armen, Explosion an Bord, abgestürztes Flugzeug.',
          '<b>Nach etwa fünf Minuten</b>, wenn du den Notruf eines anderen Schiffes gehört hast und auf diesen <b>keine Bestätigung</b> einer Küstenfunkstelle oder eines anderen Schiffes folgt.',
          'Im Relay nennst du <b>zuerst dich</b>, dann den fremden Notruf mit <b>Zeit, Schiff, Position, Lage und Personenzahl</b>.'
        ] },
        { h: 'Fehlalarm widerrufen', ol: [
          'Das Gerät <b>nicht ausschalten</b>, aber den wiederholten DSC-Alarm beenden (Alarm quittieren bzw. Notalarm abbrechen).',
          'Auf <b>Kanal 16</b>, volle Leistung: „An alle Funkstellen“ 3×, „hier ist Sailing X“ 3×, Rufzeichen und MMSI.',
          '<b>„Ich widerrufe meinen Notalarm“</b> – „I say again: cancel my distress alert“ – mit <b>Uhrzeit</b> der Fehlauslösung.',
          '<b>OUT</b>. Danach auf 16 hörbereit bleiben; eine Küstenfunkstelle fragt oft nach.'
        ] },
        { ul: [
          '<b>PAN PAN</b> und <b>SÉCURITÉ</b> gehen an „alle Funkstellen“: Ansage 3×, „an alle Funkstellen“ 3×, dann eigener Name, Rufzeichen, MMSI, Position, Lage, <b>OVER</b>.',
          'Lange Sicherheitsmeldungen werden auf 16 <b>angekündigt</b> und auf einem Arbeitskanal <b>durchgegeben</b>.',
          'Eine <b>funkärztliche Beratung</b> ist ein PAN PAN – gerichtet an die nächste Küstenfunkstelle oder an „alle Funkstellen“.'
        ] }
      ],
      uebung: 'mayday'
    },
    {
      id: 'dsc', icon: '🔴', titel: 'DSC – der digitale Ruf',
      kurz: 'Rote Taste, MMSI, Position – in Sekunden.',
      bloecke: [
        { ul: [
          '<b>DSC</b> (Digital Selective Calling) ist ein normales UKW-Gerät mit digitalem Alarmteil und <b>GPS-Anschluss</b>. Es sendet auf <b>Kanal 70</b> einen kurzen Datensatz: MMSI, Art des Rufs und – wenn das GPS angeschlossen ist – die <b>Position</b>.',
          'Gerufen werden kann <b>an alle</b> (Notalarm, Dringlichkeit, Sicherheit), an eine <b>Gruppe</b> oder an ein <b>einzelnes Schiff</b> über seine MMSI.',
          'Ohne angeschlossenes GPS geht der Alarm <b>ohne Position</b> hinaus – dann die Position von Hand eintragen und auf jeden Fall sprechen.'
        ] },
        { h: 'Notalarm', ol: [
          'Hauptschalter und Funkgerät <b>an</b>.',
          'Rote <b>Klappe öffnen</b>, Taste einmal drücken; wenn Zeit bleibt, die <b>Art des Notfalls</b> wählen (sinken, Feuer, Mann über Bord …).',
          'Rote Taste <b>mehrere Sekunden halten</b>, bis das Gerät den Alarm abgesetzt hat.',
          'Rund <b>15 Sekunden</b> warten, dann auf <b>Kanal 16</b> – das Gerät schaltet selbst um – den gesprochenen <b>MAYDAY</b> absetzen.',
          'Keine Bestätigung? Alarm und Sprechfunkspruch <b>wiederholen</b> und auf 16 hörbereit bleiben.'
        ] },
        { grafik: 'dscablauf', legende: 'Der digitale Alarm ist nur die Alarmierung – gerettet wird nach dem gesprochenen MAYDAY auf Kanal 16.' },
        { h: 'Routineanruf per DSC', ol: [
          'Menü <b>DSC-Ruf</b> öffnen',
          '<b>Individual</b>, dann <b>Routine</b> wählen',
          '<b>MMSI</b> eintippen oder aus dem Verzeichnis holen',
          '<b>Arbeitskanal</b> vorschlagen',
          '<b>Senden</b> – am anderen Gerät schrillt es laut; dort wird der Ton abgestellt und der Ruf bestätigt, danach geht es per Sprechfunk auf dem vereinbarten Kanal weiter.'
        ] },
        { h: 'Vor- und Nachteile des DSC-Routinerufs', tabelle: [
          ['Dafür', 'Kanal 16 bleibt frei, der Alarm am Zielgerät ist unüberhörbar, und ein verpasster Ruf bleibt im Anrufspeicher stehen.'],
          ['Dagegen', 'Du brauchst die <b>MMSI</b> der Gegenstelle und musst sie eingeben. Jedes Gerätemodell führt anders durchs Menü.']
        ] },
        { ul: [
          'Die <b>Bestätigung</b> eines Notalarms kommt normalerweise von einer Küstenfunkstelle. Andere Schiffe antworten per <b>Sprechfunk</b>, nicht mit DSC – sonst verstummt der Alarm, bevor die Rettungsleitstelle ihn gehört hat.',
          'Versehentlich ausgelöst? <b>Nicht ausschalten</b> – auf Kanal 16 melden und den Fehlalarm widerrufen.',
          'Auf <b>Kanal 70 wird nie gesprochen</b>; er bleibt frei für Daten.'
        ] }
      ],
      uebung: 'dsc'
    },
    {
      id: 'gmdss', icon: '🛰️', titel: 'GMDSS – das System dahinter',
      kurz: 'Wer hört mit, wenn du Hilfe brauchst.',
      bloecke: [
        { ul: [
          '<b>GMDSS</b> heißt Weltweites Seenot- und Sicherheitsfunksystem. Die Idee: Ein Notruf soll <b>automatisch</b> und ohne dass jemand zufällig zuhört, bei einer Rettungsleitstelle ankommen.',
          'Dazu greifen mehrere Bausteine ineinander: <b>DSC</b> auf UKW, Grenz- und Kurzwelle, <b>NAVTEX</b> für Textmeldungen, <b>Satellitenfunk</b>, <b>EPIRB</b> als Notfunkbake, <b>SART</b> als Suchhilfe – und der ganz normale Sprechfunk.',
          'Koordiniert wird aus einer <b>MRCC</b> (Maritime Rescue Coordination Centre). Sie entscheidet, wer ausläuft, und leitet den Notverkehr.',
          'Welche Geräte Pflicht sind, hängt vom <b>Seegebiet</b> ab – für Sportboote in Küstennähe ist UKW mit DSC die tragende Säule.'
        ] },
        { h: 'Die vier Seegebiete', tabelle: [
          ['A1', 'In Reichweite einer <b>UKW</b>-Küstenfunkstelle mit DSC – etwa 20 bis 30 sm vor der Küste. Hier segeln wir meistens.'],
          ['A2', 'In Reichweite einer <b>Grenzwellen</b>-Küstenfunkstelle, etwa bis 150 sm.'],
          ['A3', 'Im Abdeckungsbereich der <b>geostationären Satelliten</b> – weltweit zwischen etwa 70° Nord und 70° Süd.'],
          ['A4', 'Der Rest: <b>Polargebiete</b>. Dort trägt die <b>Kurzwelle</b>.']
        ] },
        { grafik: 'gmdss', legende: 'Je weiter hinaus, desto größer muss die Reichweite der Ausrüstung sein – A1 ist das Revier des UKW-Seefunks.' },
        { h: 'NAVTEX', ul: [
          'Ein eigenes Empfangsgerät, das <b>Textmeldungen</b> ausdruckt oder anzeigt: Seewetterbericht und Sturmwarnungen, nautische Warnnachrichten, Hinweise auf laufende Notfälle.',
          'Reichweite etwa <b>300 sm</b>. Auf <b>518 kHz</b> kommen die internationalen Meldungen auf <b>Englisch</b>, auf <b>490 kHz</b> die nationalen in der Landessprache.',
          'Man muss nichts tun und nichts anfordern – das Gerät sammelt mit und filtert nach Gebiet und Meldungsart.'
        ] },
        { h: 'AIS', ul: [
          '<b>AIS</b> sendet laufend Name, MMSI, Rufzeichen, Position, Kurs und Geschwindigkeit über zwei reservierte UKW-Kanäle. Große Schiffe müssen es haben (Class A), Yachten senden freiwillig mit <b>Class B</b> oder empfangen nur.',
          'Für den Funk ist es Gold wert: Du liest den <b>Namen</b> des Frachters vom Plotter ab und rufst ihn gezielt – oder übernimmst seine <b>MMSI</b> direkt in den DSC-Ruf.',
          'AIS ersetzt kein Radar: Es zeigt nur, <b>wer selbst sendet</b> – nicht Land, Netze, Treibgut oder die Yacht ohne Transponder.'
        ] }
      ],
      uebung: 'gmdss'
    },
    {
      id: 'notgeraete', icon: '🧭', titel: 'EPIRB, SART und PLB',
      kurz: 'Die Geräte, die dich finden lassen.',
      bloecke: [
        { h: 'EPIRB – die Notfunkbake', ul: [
          'Sendet auf <b>406 MHz</b> an die <b>COSPAS-SARSAT</b>-Satelliten und wird dadurch weltweit geortet – unabhängig von Funkreichweite und Küstenfunkstelle.',
          'Sie muss <b>registriert</b> sein, und zwar im Register des <b>Flaggenstaats</b>: Nur so weiß die Leitstelle, welches Schiff da ruft und wen sie anrufen kann.',
          'Viele Baken haben zusätzlich ein <b>GPS</b> und ein <b>121,5-MHz</b>-Peilsignal für die letzten Meter.',
          '<b>Versehentlich eingeschaltet?</b> Sofort ausschalten <b>und</b> die nächste Küstenwache anrufen – sonst läuft eine Suche an.',
          'Eine <b>PLB</b> ist die persönliche Variante am Mann; sie gehört nicht zur vorgeschriebenen GMDSS-Ausrüstung, ist als Rückfallebene aber sehr beliebt.'
        ] },
        { h: 'SART – damit der Retter dich auf dem Schirm hat', tabelle: [
          ['Zwei Bauarten', 'Der <b>Radar-SART</b> arbeitet auf <b>9 GHz</b> und antwortet auf fremde Radarstrahlen. Der <b>AIS-SART</b> sendet über UKW seine eigene GPS-Position.'],
          ['Wie es arbeitet', 'Der Radar-SART <b>antwortet</b> auf den Radarstrahl eines Schiffes oder Flugzeugs. Der AIS-SART <b>sendet selbst</b> – mit eigenem GPS – seine Position.'],
          ['Was der Retter sieht', 'Radar: bis zu <b>12 Punkte</b> auf dem Radarschirm, die näher dran zu <b>Bögen</b> und ganz nah zu <b>Kreisen</b> werden. AIS: ein eigenes <b>Symbol</b> auf dem Plotter, dazu Kurs und Abstand.'],
          ['Information', 'Radar: Richtung und etwa die Entfernung. AIS: <b>genaue GPS-Position</b> samt Kennung.'],
          ['Wetter', 'Radar: kann bei Regen und hoher See im Störecho untergehen. AIS: sehr robust.'],
          ['Reichweite', 'Beide etwa <b>5–10 sm</b> von Schiff zu Schiff; der Radar-SART wird vom <b>Suchflugzeug</b> aus deutlich weiter gesehen.'],
          ['Stärke', 'Radar: funktioniert mit <b>jedem</b> X-Band-Radar. AIS: liefert eine Position, die man direkt ansteuern kann.']
        ] },
        { grafik: 'sart', legende: 'Links der Radar-SART: aus der Punktreihe werden Bögen, zuletzt Kreise. Rechts der AIS-SART als eigenes Symbol auf dem Plotter.' },
        { h: 'An der MMSI erkennen', ul: [
          'Beginnt eine AIS-Kennung mit <b>970</b>, ist es ein <b>AIS-SART</b>; <b>972</b> ist ein <b>Mann-über-Bord</b>-Sender, <b>974</b> eine AIS-EPIRB.',
          'Ein solches Symbol auf dem Plotter ist immer ein Notfall – Position notieren, Kurs darauf, Küstenwache informieren.'
        ] },
        { h: 'Und das Handy?', ul: [
          'Als <b>Rückfallebene</b> gut, als Notrufmittel schlecht: Es erreicht immer nur <b>eine</b> Stelle, nicht die Schiffe in der Nähe, hängt an Netz und Akku und liefert keine Position an die Flotte.',
          'Die Kurznummern der Rettungsleitstellen trotzdem eingespeichert haben – im Mittelmeer etwa <b>112</b>, Griechenland <b>108</b>, Italien <b>1530</b>, Kroatien <b>195</b>, Slowenien <b>080 1800</b>, Malta über <b>Malta Radio</b>. Vor dem Törn im Revierführer prüfen.'
        ] }
      ],
      uebung: 'notgeraete'
    },
    {
      id: 'vokabular', icon: '🌍', titel: 'Funkenglisch',
      kurz: 'Die Sätze, auf die es im Ernstfall ankommt.',
      bloecke: [
        { ul: [
          'Funkenglisch ist kein Smalltalk: Es sind etwa hundert feste Wendungen. Wer sie kennt, wird auch mit schwerem Akzent verstanden.',
          'Schiffe sind im Englischen <b>weiblich</b>: „she is sinking“, „I am coming to her assistance“.',
          'Im Zweifel kurze Hauptsätze – lieber „engine failure, we need a tow“ als ein verschachtelter Satz.'
        ] },
        { h: 'Was ist passiert', tabelle: [
          ['we are sinking', 'wir sinken'],
          ['we are on fire', 'wir haben Feuer an Bord'],
          ['we are making water', 'wir haben Wassereinbruch'],
          ['we have run aground', 'wir sind auf Grund gelaufen'],
          ['we have capsized', 'wir sind gekentert'],
          ['we are disabled and adrift', 'wir sind manövrierunfähig und treiben'],
          ['we have engine failure', 'wir haben Maschinenschaden'],
          ['we are dismasted', 'wir haben Mastbruch'],
          ['man overboard', 'Mann über Bord'],
          ['we are abandoning ship', 'wir verlassen das Schiff']
        ] },
        { h: 'Welche Hilfe', tabelle: [
          ['I require immediate assistance', 'ich brauche sofortige Hilfe'],
          ['we require a tow', 'wir brauchen Schlepphilfe'],
          ['we require medical assistance', 'wir brauchen ärztliche Hilfe'],
          ['we require urgent medical advice', 'wir brauchen dringend funkärztliche Beratung'],
          ['I am coming to your assistance', 'ich komme Ihnen zu Hilfe'],
          ['how many persons on board?', 'wie viele Personen an Bord?'],
          ['four persons on board, one injured', 'vier Personen an Bord, eine verletzt'],
          ['we have a liferaft', 'wir haben eine Rettungsinsel']
        ] },
        { h: 'Verstehen und verstanden werden', tabelle: [
          ['say again', 'wiederholen Sie'],
          ['I read you five / loud and clear', 'ich höre Sie einwandfrei'],
          ['I read you two, say again', 'ich höre Sie schlecht, wiederholen Sie'],
          ['switch to channel seven one', 'wechseln Sie auf Kanal 71'],
          ['stand by on channel one six', 'bleiben Sie auf Kanal 16 auf Empfang'],
          ['what is your position?', 'wie ist Ihre Position?'],
          ['my position is …', 'meine Position ist …'],
          ['received mayday, standby', 'MAYDAY empfangen, bleiben Sie auf Empfang']
        ] },
        { h: 'Wetter und Revier', tabelle: [
          ['gale warning', 'Sturmwarnung'],
          ['strong wind warning', 'Starkwindwarnung'],
          ['wind north-west, force six, gusts eight', 'Wind Nordwest, 6 Beaufort, Böen 8'],
          ['sea state rough, visibility poor', 'raue See, schlechte Sicht'],
          ['veering / backing', 'rechtdrehend / linksdrehend'],
          ['we request a berth for one night', 'wir bitten um einen Liegeplatz für eine Nacht'],
          ['our ETA is seventeen thirty local time', 'wir kommen voraussichtlich 17:30 Uhr Ortszeit an']
        ] }
      ],
      uebung: 'vokabeln'
    }
  ];

  /* ---------------- Funkenglisch: Wendungen für die Vokabel-Einheit ---------------- */
  var VOKABELN = [
    /* Notfall und Schaden */
    { de: 'wir sinken', en: 'we are sinking', gruppe: 'Notfall' },
    { de: 'wir haben Feuer an Bord', en: 'we are on fire', gruppe: 'Notfall' },
    { de: 'wir haben Wassereinbruch', en: 'we are making water', gruppe: 'Notfall' },
    { de: 'wir sind leckgeschlagen', en: 'we have sprung a leak', gruppe: 'Notfall' },
    { de: 'wir sind auf Grund gelaufen', en: 'we have run aground', gruppe: 'Notfall' },
    { de: 'wir sind gekentert', en: 'we have capsized', gruppe: 'Notfall' },
    { de: 'wir haben Schlagseite nach Backbord', en: 'we are listing to port', gruppe: 'Notfall' },
    { de: 'wir sind manövrierunfähig und treiben', en: 'we are disabled and adrift', gruppe: 'Notfall' },
    { de: 'wir haben Maschinenschaden', en: 'we have engine failure', gruppe: 'Notfall' },
    { de: 'wir haben Mastbruch', en: 'we are dismasted', gruppe: 'Notfall' },
    { de: 'wir haben Ruderschaden', en: 'we have steering failure', gruppe: 'Notfall' },
    { de: 'Mann über Bord', en: 'man overboard', gruppe: 'Notfall' },
    { de: 'wir verlassen das Schiff', en: 'we are abandoning ship', gruppe: 'Notfall' },
    { de: 'Kollision mit einem Fahrzeug', en: 'collision with a vessel', gruppe: 'Notfall' },
    { de: 'der Anker schliert', en: 'the anchor is dragging', gruppe: 'Notfall' },
    { de: 'wir haben eine Leine in der Schraube', en: 'we have a rope around the propeller', gruppe: 'Notfall' },

    /* Hilfe anfordern und leisten */
    { de: 'ich brauche sofortige Hilfe', en: 'I require immediate assistance', gruppe: 'Hilfe' },
    { de: 'wir brauchen Schlepphilfe', en: 'we require a tow', gruppe: 'Hilfe' },
    { de: 'wir brauchen ärztliche Hilfe', en: 'we require medical assistance', gruppe: 'Hilfe' },
    { de: 'wir brauchen dringend funkärztliche Beratung', en: 'we require urgent medical advice', gruppe: 'Hilfe' },
    { de: 'ich komme Ihnen zu Hilfe', en: 'I am coming to your assistance', gruppe: 'Hilfe' },
    { de: 'wie viele Personen an Bord?', en: 'how many persons on board?', gruppe: 'Hilfe' },
    { de: 'vier Personen an Bord, eine verletzt', en: 'four persons on board, one injured', gruppe: 'Hilfe' },
    { de: 'wir haben eine Rettungsinsel', en: 'we have a liferaft', gruppe: 'Hilfe' },
    { de: 'wir haben Seenotsignale an Bord', en: 'we have distress flares on board', gruppe: 'Hilfe' },
    { de: 'wir haben niemanden an Bord verloren', en: 'nobody is missing', gruppe: 'Hilfe' },
    { de: 'eine Person ist schwer verletzt', en: 'one person is seriously injured', gruppe: 'Hilfe' },
    { de: 'die Person ist bei Bewusstsein', en: 'the person is conscious', gruppe: 'Hilfe' },
    { de: 'die Person ist nicht bei Bewusstsein', en: 'the person is unconscious', gruppe: 'Hilfe' },
    { de: 'wir haben starke Blutung', en: 'we have severe bleeding', gruppe: 'Hilfe' },
    { de: 'Seenotrettung', en: 'search and rescue', gruppe: 'Hilfe' },
    { de: 'Rettungsleitstelle', en: 'rescue coordination centre', gruppe: 'Hilfe' },
    { de: 'Rettungshubschrauber', en: 'rescue helicopter', gruppe: 'Hilfe' },
    { de: 'Schlepper', en: 'tug', gruppe: 'Hilfe' },
    { de: 'Notfunkbake', en: 'EPIRB', gruppe: 'Hilfe' },

    /* Verfahren am Gerät */
    { de: 'hier ist', en: 'this is', gruppe: 'Verfahren' },
    { de: 'Ende der Durchsage, ich erwarte Antwort', en: 'over', gruppe: 'Verfahren' },
    { de: 'Gespräch beendet', en: 'out', gruppe: 'Verfahren' },
    { de: 'wiederholen Sie', en: 'say again', gruppe: 'Verfahren' },
    { de: 'ich buchstabiere', en: 'I spell', gruppe: 'Verfahren' },
    { de: 'verstanden', en: 'roger', gruppe: 'Verfahren' },
    { de: 'bleiben Sie auf Empfang', en: 'stand by', gruppe: 'Verfahren' },
    { de: 'Berichtigung', en: 'correction', gruppe: 'Verfahren' },
    { de: 'ich habe nichts weiter', en: 'nothing more', gruppe: 'Verfahren' },
    { de: 'ich höre Sie einwandfrei', en: 'I read you five, loud and clear', gruppe: 'Verfahren' },
    { de: 'ich höre Sie schlecht', en: 'I read you two', gruppe: 'Verfahren' },
    { de: 'wechseln Sie auf Kanal 71', en: 'switch to channel seven one', gruppe: 'Verfahren' },
    { de: 'bleiben Sie auf Kanal 16 auf Empfang', en: 'stand by on channel one six', gruppe: 'Verfahren' },
    { de: 'Funkprobe, bitte bestätigen', en: 'radio check, please confirm', gruppe: 'Verfahren' },
    { de: 'wie ist Ihre Position?', en: 'what is your position?', gruppe: 'Verfahren' },
    { de: 'meine Position ist', en: 'my position is', gruppe: 'Verfahren' },
    { de: 'MAYDAY empfangen, bleiben Sie auf Empfang', en: 'received mayday, standby', gruppe: 'Verfahren' },
    { de: 'Funkstille, es läuft Notverkehr', en: 'seelonce mayday', gruppe: 'Verfahren' },
    { de: 'der Notverkehr ist beendet', en: 'seelonce feenee', gruppe: 'Verfahren' },
    { de: 'ich widerrufe meinen Notalarm', en: 'cancel my distress alert', gruppe: 'Verfahren' },
    { de: 'Rufzeichen', en: 'call sign', gruppe: 'Verfahren' },
    { de: 'an alle Funkstellen', en: 'all stations', gruppe: 'Verfahren' },
    { de: 'Küstenfunkstelle', en: 'coast radio station', gruppe: 'Verfahren' },
    { de: 'Arbeitskanal', en: 'working channel', gruppe: 'Verfahren' },

    /* Wetter */
    { de: 'Sturmwarnung', en: 'gale warning', gruppe: 'Wetter' },
    { de: 'Starkwindwarnung', en: 'strong wind warning', gruppe: 'Wetter' },
    { de: 'Wind Nordwest, 6 Beaufort', en: 'wind north-west, force six', gruppe: 'Wetter' },
    { de: 'Böen bis 8 Beaufort', en: 'gusts up to force eight', gruppe: 'Wetter' },
    { de: 'rechtdrehend', en: 'veering', gruppe: 'Wetter' },
    { de: 'linksdrehend', en: 'backing', gruppe: 'Wetter' },
    { de: 'raue See', en: 'rough sea', gruppe: 'Wetter' },
    { de: 'Dünung aus Südwest', en: 'swell from south-west', gruppe: 'Wetter' },
    { de: 'schlechte Sicht', en: 'poor visibility', gruppe: 'Wetter' },
    { de: 'Nebelbänke', en: 'fog patches', gruppe: 'Wetter' },
    { de: 'Gewitter', en: 'thunderstorms', gruppe: 'Wetter' },
    { de: 'Luftdruck fallend', en: 'pressure falling', gruppe: 'Wetter' },

    /* Hafen und Revier */
    { de: 'wir bitten um einen Liegeplatz für eine Nacht', en: 'we request a berth for one night', gruppe: 'Hafen' },
    { de: 'wir sind eine 12-Meter-Segelyacht', en: 'we are a twelve metre sailing yacht', gruppe: 'Hafen' },
    { de: 'wir kommen voraussichtlich 17:30 Uhr an', en: 'our ETA is seventeen thirty', gruppe: 'Hafen' },
    { de: 'gibt es einen freien Liegeplatz?', en: 'is there a berth available?', gruppe: 'Hafen' },
    { de: 'wir liegen vor dem Hafeneingang', en: 'we are off the harbour entrance', gruppe: 'Hafen' },
    { de: 'Tiefgang 1,90 Meter', en: 'our draft is one decimal nine metres', gruppe: 'Hafen' },
    { de: 'wir passieren Steuerbord an Steuerbord', en: 'we pass starboard to starboard', gruppe: 'Hafen' },
    { de: 'wir halten uns gut frei', en: 'we keep well clear', gruppe: 'Hafen' },
    { de: 'wir ankern in der Bucht', en: 'we are anchoring in the bay', gruppe: 'Hafen' },
    { de: 'treibender Container', en: 'drifting container', gruppe: 'Hafen' },
    { de: 'eine Tonne ist losgerissen', en: 'a buoy is adrift', gruppe: 'Hafen' },
    { de: 'Verkehrstrennungsgebiet', en: 'traffic separation scheme', gruppe: 'Hafen' }
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


    {
      id: 'wetter', gruppe: 'Routineverkehr', icon: '🌦️', dauer: '4 Min.',
      titel: { de: 'Wetterbericht abrufen', en: 'Getting the forecast' },
      lage: { de: 'Für die Nacht ist Bora angesagt. Du willst den Seewetterbericht von Split Radio hören – angekündigt wird er auf Kanal 16.', en: 'Bora is forecast for the night. You want the sea area forecast from Split Radio – it is announced on channel 16.' },
      schritte: [
        { typ: 'info', kanal: 16,
          text: { de: 'Du hörst Kanal 16 ab. Da kommt die Ankündigung.', en: 'You are listening on channel 16. Here comes the announcement.' },
          durchsage: { von: { de: 'Split Radio', en: 'Split Radio' },
            text: { de: 'SÉCURITÉ, SÉCURITÉ, SÉCURITÉ – an alle Funkstellen, an alle Funkstellen. Hier ist Split Radio. Seewetterbericht für die mittlere Adria folgt auf Kanal sechs sieben.', en: 'SÉCURITÉ, SÉCURITÉ, SÉCURITÉ – all stations, all stations. This is Split Radio. Sea area forecast for the central Adriatic follows on channel six seven.' } } },
        { typ: 'kanal', ziel: 67, hinweis: { de: 'Stelle den angekündigten Kanal ein.', en: 'Set the announced channel.' },
          erklaerung: { de: 'Angekündigt wird auf 16, durchgegeben wird auf dem Arbeitskanal – so bleibt 16 frei.', en: 'Announced on 16, transmitted on a working channel – that keeps 16 clear.' } },
        { typ: 'info', kanal: 67,
          text: { de: 'Schreib mit: Gebiet, Gültigkeit, Wind, See, Sicht.', en: 'Write it down: area, validity, wind, sea, visibility.' },
          durchsage: { von: { de: 'Split Radio', en: 'Split Radio' },
            text: { de: 'Wettervorhersage für die mittlere Adria, ausgegeben um 12 Uhr UTC, gültig bis morgen 12 Uhr UTC. Wind Nordost vier bis fünf Beaufort, in der Nacht zunehmend sieben, in Böen acht. See mäßig bewegt bis grob. Sicht gut, in Schauern mäßig.', en: 'Weather forecast for the central Adriatic, issued at 12 hundred UTC, valid until tomorrow 12 hundred UTC. Wind north-east four to five, increasing seven during the night, gusts eight. Sea moderate to rough. Visibility good, moderate in showers.' } } },
        { typ: 'wahl', frage: { de: 'Was gehört davon ins Logbuch?', en: 'What goes into the logbook?' },
          optionen: [
            { de: 'Gebiet, Gültigkeit, Wind mit Böen, See und Sicht – dazu Uhrzeit und Quelle', en: 'Area, validity, wind with gusts, sea and visibility – plus time and source', ok: true },
            { de: 'Nur die Windstärke', en: 'Only the wind force' },
            { de: 'Nichts – der Bericht steht ohnehin im Internet', en: 'Nothing – it is on the internet anyway' },
            { de: 'Nur die Uhrzeit der Durchsage', en: 'Only the time of the broadcast' }],
          erklaerung: { de: 'Der Eintrag muss später nachvollziehbar machen, auf welcher Grundlage du entschieden hast – darum auch Uhrzeit und Quelle.', en: 'The entry must later show on what basis you decided – hence time and source as well.' } },
        { typ: 'wahl', frage: { de: 'Sieben Beaufort aus Nordost in der Nacht, und du liegst in einer nach Nordost offenen Bucht. Was tust du?', en: 'Force seven from north-east tonight, and you are anchored in a bay open to the north-east. What do you do?' },
          optionen: [
            { de: 'Noch bei Tageslicht in eine geschützte Bucht oder einen Hafen verholen', en: 'Move to a sheltered bay or harbour while it is still daylight', ok: true },
            { de: 'Mehr Kette stecken und abwarten', en: 'Veer more chain and wait' },
            { de: 'Einen zweiten Anker werfen und schlafen gehen', en: 'Lay a second anchor and turn in' },
            { de: 'Nichts – Bora wird meist übertrieben', en: 'Nothing – bora is usually overrated' }],
          erklaerung: { de: 'Eine auflandige Bucht bei 7 Beaufort ist kein Ankerplatz. Die Entscheidung fällt früh und bei Licht – mit mehr Kette wird aus einer falschen Bucht keine richtige.', en: 'A bay open to the wind is no anchorage in force 7. Decide early and in daylight – more chain does not turn the wrong bay into the right one.' } },
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Angenommen, du hast die Durchsage verpasst: Frage den Bericht bei Split Radio nach.', en: 'Suppose you missed the broadcast: ask Split Radio for the forecast.' },
          teile: [
            { de: 'Split Radio, Split Radio', en: 'Split Radio, Split Radio' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'Rufzeichen Oscar Echo X-Ray eins zwei drei vier', en: 'call sign Oscar Echo X-Ray one two three four' },
            { de: 'wir bitten um die aktuelle Wettervorhersage für die mittlere Adria', en: 'we request the latest forecast for the central Adriatic' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [
            { de: 'bitte Kanal sieben null', en: 'please channel seven zero', warum: { de: 'Kanal 70 ist reiner Datenkanal für DSC – dort wird nie gesprochen.', en: 'Channel 70 is DSC data only – never speak on it.' } },
            { de: 'wir brauchen sofort Hilfe', en: 'we require immediate assistance', warum: { de: 'Das wäre ein Notruf. Hier geht es um eine ganz normale Auskunft.', en: 'That would be a distress call. This is an ordinary request for information.' } }
          ],
          antwort: { de: 'Sailing X – hier ist Split Radio. Wettervorhersage folgt auf Kanal sechs sieben. Over.', en: 'Sailing X – this is Split Radio. Forecast follows on channel six seven. Over.' } }
      ],
      merke: { de: 'Seewetterberichte werden auf Kanal 16 angekündigt und auf einem Arbeitskanal durchgegeben. Mitschreiben: Gebiet, Gültigkeit, Wind mit Böen, See, Sicht – und ins Logbuch mit Uhrzeit und Quelle.', en: 'Sea area forecasts are announced on 16 and transmitted on a working channel. Note down area, validity, wind with gusts, sea and visibility – and log it with time and source.' }
    },

    {
      id: 'kuestenfunk', gruppe: 'Routineverkehr', icon: '🗼', dauer: '4 Min.',
      titel: { de: 'Verkehr über eine Küstenfunkstelle', en: 'Working a coast radio station' },
      lage: { de: 'Kein Handynetz in der Bucht. Du willst dem Charterbetrieb ausrichten, dass ihr einen Tag später zurückkommt – über Split Radio.', en: 'No mobile network in the bay. You want to let the charter base know that you will return a day later – through Split Radio.' },
      schritte: [
        { typ: 'funkspruch', kanal: 16,
          hinweis: { de: 'Rufe die Küstenfunkstelle auf Kanal 16.', en: 'Call the coast station on channel 16.' },
          teile: [
            { de: 'Split Radio, Split Radio', en: 'Split Radio, Split Radio' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'Rufzeichen Oscar Echo X-Ray eins zwei drei vier', en: 'call sign Oscar Echo X-Ray one two three four' },
            { de: 'wir bitten um die Vermittlung eines Telefongesprächs', en: 'we request a link call' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'wir möchten unserem Charterbetrieb ausrichten, dass wir später kommen', en: 'we want to tell our charter base that we will be late', warum: { de: 'Der Inhalt kommt erst auf dem zugewiesenen Kanal – Kanal 16 bleibt frei.', en: 'The content belongs on the assigned channel – keep 16 clear.' } }],
          antwort: { de: 'Sailing X – hier ist Split Radio. Wechseln Sie auf Kanal zwei vier. Over.', en: 'Sailing X – this is Split Radio. Change to channel two four. Over.' } },
        { typ: 'kanal', ziel: 24, hinweis: { de: 'Stelle den zugewiesenen Kanal der Küstenfunkstelle ein.', en: 'Set the channel assigned by the coast station.' },
          erklaerung: { de: 'Küstenfunkstellen arbeiten auf eigenen Kanälen – die Zuweisung kommt von der Station.', en: 'Coast stations use their own channels – the station assigns one.' } },
        { typ: 'funkspruch', kanal: 24,
          hinweis: { de: 'Nenne, wen du erreichen willst – und bleib knapp.', en: 'State whom you want to reach – and keep it short.' },
          teile: [
            { de: 'Split Radio – hier ist Sailing X', en: 'Split Radio – this is Sailing X' },
            { de: 'wir bitten um eine Verbindung nach Kroatien', en: 'we request a connection to Croatia' },
            { de: 'Nummer null zwei eins – drei vier fünf sechs sieben acht', en: 'number zero two one – three four five six seven eight' },
            { de: 'Teilnehmer ist unser Charterbetrieb in Kaštela', en: 'the subscriber is our charter base in Kaštela' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'MAYDAY Sailing X', en: 'MAYDAY Sailing X', warum: { de: 'Keine Notlage – das hier ist ganz normaler öffentlicher Verkehr.', en: 'No distress – this is ordinary public correspondence.' } }],
          antwort: { de: 'Sailing X – hier ist Split Radio. Verstanden. Wir stellen die Verbindung her, bleiben Sie auf Kanal zwei vier. Over.', en: 'Sailing X – this is Split Radio. Roger. We are putting you through, stand by on channel two four. Over.' } },
        { typ: 'wahl', frage: { de: 'Wofür ist eine Küstenfunkstelle sonst noch da?', en: 'What else is a coast station there for?' },
          optionen: [
            { de: 'Wetter- und Verkehrsmeldungen, Vermittlung von Gesprächen, Annahme von Not- und Dringlichkeitsverkehr', en: 'Weather and navigational warnings, link calls, handling distress and urgency traffic', ok: true },
            { de: 'Nur für Notrufe', en: 'Distress calls only' },
            { de: 'Für Gespräche zwischen Jachten', en: 'For chats between yachts' },
            { de: 'Für den Kontakt zur Marina', en: 'For contacting the marina' }],
          erklaerung: { de: 'Küstenfunkstellen sind die Drehscheibe: Sie senden Wetterberichte und Warnnachrichten, vermitteln Gespräche und leiten den Notverkehr – deshalb hören sie ständig Kanal 16 und DSC ab.', en: 'Coast stations are the hub: they broadcast forecasts and warnings, put through calls and control distress traffic – which is why they keep watch on 16 and DSC.' } },
        { typ: 'wahl', frage: { de: 'Die Küstenfunkstelle antwortet nicht. Was ist die wahrscheinlichste Ursache?', en: 'The coast station does not answer. What is the most likely reason?' },
          optionen: [
            { de: 'Du bist zu weit weg – UKW reicht quasi-optisch, zu hohen Küstenfunkstellen etwa 60 Seemeilen', en: 'You are too far away – VHF is quasi-optical, about 60 miles to high coast stations', ok: true },
            { de: 'Dein Rufzeichen ist nicht registriert', en: 'Your call sign is not registered' },
            { de: 'Kanal 16 ist für Jachten gesperrt', en: 'Channel 16 is barred for yachts' },
            { de: 'Küstenfunkstellen arbeiten nur nachts', en: 'Coast stations only work at night' }],
          erklaerung: { de: 'Hinter einer Insel oder weit draußen ist Schluss. Dann hilft: höher gelegene Position abwarten, über ein anderes Schiff weiterleiten lassen – oder DSC versuchen.', en: 'Behind an island or far offshore the signal is gone. Then: wait for a better position, ask another vessel to relay – or try DSC.' } }
      ],
      merke: { de: 'Anruf auf Kanal 16 oder per DSC, Gespräch auf dem zugewiesenen Kanal der Station. Küstenfunkstellen vermitteln, senden Wetter und Warnungen und leiten den Notverkehr.', en: 'Call on 16 or by DSC, talk on the channel the station assigns. Coast stations put calls through, broadcast weather and warnings and control distress traffic.' }
    },

    {
      id: 'dscruf', gruppe: 'Routineverkehr', icon: '📲', dauer: '4 Min.',
      titel: { de: 'DSC-Routineanruf', en: 'DSC routine call' },
      lage: { de: 'Statt blind auf Kanal 16 zu rufen, rufst du die „Adriatic Star“ direkt per DSC – ihre MMSI 238123456 steht im AIS.', en: 'Instead of calling blindly on 16 you call “Adriatic Star” directly by DSC – AIS shows her MMSI 238123456.' },
      schritte: [
        { typ: 'wahl', geraet: 'dsc', frage: { de: 'Welchen Anruftyp wählst du im DSC-Menü?', en: 'Which call type do you choose in the DSC menu?' },
          optionen: [
            { de: 'Routine', en: 'Routine', ok: true },
            { de: 'Dringlichkeit', en: 'Urgency' },
            { de: 'Sicherheit', en: 'Safety' },
            { de: 'Notfall', en: 'Distress' }],
          erklaerung: { de: 'Routine ist der normale Anruf an eine bestimmte Station. Die anderen Kategorien sind für Dringlichkeits-, Sicherheits- und Notverkehr reserviert.', en: 'Routine is the ordinary call to a particular station. The other categories are reserved for urgency, safety and distress traffic.' } },
        { typ: 'wahl', geraet: 'dsc', frage: { de: 'Welche MMSI gibst du ein?', en: 'Which MMSI do you enter?' },
          optionen: [
            { de: '238123456 – Adriatic Star, aus dem AIS', en: '238123456 – Adriatic Star, from AIS', ok: true },
            { de: '203123456 – die eigene MMSI', en: '203123456 – your own MMSI' },
            { de: '002380100 – Split Radio', en: '002380100 – Split Radio' },
            { de: '070 – der DSC-Kanal', en: '070 – the DSC channel' }],
          erklaerung: { de: 'Die MMSI des Gegenübers – neun Ziffern. Küstenfunkstellen beginnen mit zwei Nullen, Schiffe mit der Landeskennung (Kroatien 238, Österreich 203).', en: 'The other station’s MMSI – nine digits. Coast stations start with two zeros, ships with the country code (Croatia 238, Austria 203).' } },
        { typ: 'wahl', geraet: 'dsc', frage: { de: 'Welchen Arbeitskanal schlägst du vor?', en: 'Which working channel do you propose?' },
          optionen: [
            { de: 'Kanal 06', en: 'Channel 06', ok: true },
            { de: 'Kanal 16', en: 'Channel 16' },
            { de: 'Kanal 70', en: 'Channel 70' },
            { de: 'Kanal 71', en: 'Channel 71' }],
          erklaerung: { de: 'Kanal 06 ist der Schiff–Schiff-Kanal. 16 bleibt für Anruf und Not frei, 70 ist reiner DSC-Datenkanal, 71 ist in diesem Revier ein Marina-Kanal.', en: 'Channel 06 is ship-to-ship. 16 stays free for calling and distress, 70 is DSC data only, 71 is a marina channel in this area.' } },
        { typ: 'info', kanal: 6,
          text: { de: 'Das Gerät sendet den Anruf auf Kanal 70. Die Adriatic Star bestätigt – dein Gerät schaltet selbst auf Kanal 06.', en: 'The set transmits the call on channel 70. Adriatic Star acknowledges – your set switches itself to channel 06.' },
          durchsage: { von: { de: 'Adriatic Star', en: 'Adriatic Star' },
            text: { de: 'Sailing X – hier ist Adriatic Star auf Kanal null sechs. Ich höre. Over.', en: 'Sailing X – this is Adriatic Star on channel zero six. Listening. Over.' } } },
        { typ: 'funkspruch', kanal: 6,
          hinweis: { de: 'Jetzt per Sprechfunk weiter – sag, wer du bist und was du vorhast.', en: 'Now continue by voice – say who you are and what you intend.' },
          teile: [
            { de: 'Adriatic Star – hier ist Sailing X', en: 'Adriatic Star – this is Sailing X' },
            { de: 'ich bin die Segelyacht zwei Seemeilen an Ihrer Backbordseite', en: 'I am the sailing yacht two miles on your port side' },
            { de: 'ich drehe nach Steuerbord und passiere hinter Ihrem Heck', en: 'I am altering to starboard and will pass astern of you' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'bitte bestätigen Sie meinen DSC-Anruf', en: 'please acknowledge my DSC call', warum: { de: 'Die Bestätigung ist schon da – sonst wärt ihr nicht auf diesem Kanal.', en: 'The acknowledgement has already arrived – otherwise you would not be on this channel.' } }],
          antwort: { de: 'Sailing X – hier ist Adriatic Star. Verstanden, Sie passieren hinter meinem Heck. Ich halte Kurs und Geschwindigkeit. Out.', en: 'Sailing X – this is Adriatic Star. Roger, you will pass astern. I maintain course and speed. Out.' } },
        { typ: 'wahl', frage: { de: 'Wann ist der DSC-Anruf besser als der Ruf auf Kanal 16?', en: 'When is a DSC call better than calling on 16?' },
          optionen: [
            { de: 'Wenn du die MMSI kennst: Das Gerät der Gegenstelle meldet sich akustisch, auch wenn dort gerade niemand auf Kanal 16 achtet', en: 'When you know the MMSI: the other set alerts audibly, even if nobody is paying attention to 16', ok: true },
            { de: 'Immer – Sprechfunk ist veraltet', en: 'Always – voice is outdated' },
            { de: 'Nur im Hafen', en: 'Only in harbour' },
            { de: 'Nur bei Nacht', en: 'Only at night' }],
          erklaerung: { de: 'DSC ruft gezielt eine Station – auf der Brücke eines Frachters piept es dann. Ohne MMSI bleibt der Anruf auf Kanal 16.', en: 'DSC calls one station directly – on a freighter’s bridge the set beeps. Without the MMSI, call on channel 16.' } }
      ],
      merke: { de: 'DSC-Routineanruf: Anruftyp Routine, MMSI der Gegenstelle, Arbeitskanal vorschlagen, senden. Nach der Bestätigung läuft das Gespräch per Sprechfunk auf dem vereinbarten Kanal.', en: 'DSC routine call: type routine, the other station’s MMSI, propose a working channel, send. After the acknowledgement the exchange continues by voice on that channel.' }
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
    },

    {
      id: 'funkcheck', gruppe: 'Grundlagen', icon: '🎤', dauer: '4 Min.',
      titel: { de: 'Funkprobe und Lesbarkeit', en: 'Radio check and readability' },
      lage: { de: 'Das Gerät ist neu eingebaut. Du willst wissen, ob es sauber sendet – und wie man eine Funkprobe richtig macht.', en: 'The set has just been installed. You want to know whether it transmits properly – and how a radio check is done correctly.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Wohin richtest du den Funkcheck?', en: 'Where do you direct the radio check?' },
          optionen: [
            { de: 'An eine Nachbaryacht oder die Marina, auf einem Arbeitskanal', en: 'To a nearby yacht or the marina, on a working channel', ok: true },
            { de: 'An alle Funkstellen auf Kanal 16', en: 'To all stations on channel 16' },
            { de: 'An die Küstenfunkstelle auf Kanal 16', en: 'To the coast radio station on channel 16' },
            { de: 'Auf Kanal 70, da hört jedes DSC-Gerät mit', en: 'On channel 70 – every DSC set listens there' }],
          erklaerung: { de: 'Kanal 16 muss für Not- und Anrufverkehr frei bleiben, Kanal 70 ist reiner Datenkanal. Eine Funkprobe läuft auf einem Arbeitskanal mit einer Station, die dir antworten kann.', en: 'Channel 16 must stay clear for distress and calling, channel 70 carries data only. A radio check belongs on a working channel with a station that can answer you.' } },
        { typ: 'kanal', ziel: 72, start: 16,
          hinweis: { de: 'Stelle einen freien Schiff–Schiff-Kanal ein – 72 ist dafür gedacht.', en: 'Set a free ship-to-ship channel – 72 is meant for that.' },
          erklaerung: { de: '06, 08, 72 und 77 sind Schiff–Schiff-Kanäle. Vorher kurz hören, ob der Kanal frei ist.', en: '06, 08, 72 and 77 are ship-to-ship channels. Listen first to check the channel is clear.' } },
        { typ: 'funkspruch', kanal: 72,
          hinweis: { de: 'Rufe die Nachbaryacht „Alberta“ und bitte um eine Funkprobe.', en: 'Call the neighbouring yacht “Alberta” and ask for a radio check.' },
          teile: [
            { de: 'Alberta, Alberta', en: 'Alberta, Alberta' },
            { de: 'hier ist Sailing X, Rufzeichen OEX1234', en: 'this is Sailing X, call sign OEX1234' },
            { de: 'Funkprobe – wie hören Sie mich?', en: 'radio check – how do you read me?' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [
            { de: 'MAYDAY', en: 'MAYDAY', warum: { de: 'Eine Funkprobe ist Routineverkehr – Notfloskeln haben hier nichts zu suchen.', en: 'A radio check is routine traffic – distress words have no place here.' } },
            { de: 'an alle Funkstellen', en: 'all stations', warum: { de: 'Du rufst eine bestimmte Station, nicht alle.', en: 'You are calling one particular station, not everybody.' } },
            { de: 'OUT', en: 'OUT' }],
          antwort: { de: 'Sailing X – hier ist Alberta. Ich höre Sie Stärke zwei, stark verrauscht. Over.', en: 'Sailing X – this is Alberta. I read you two, very noisy. Over.' } },
        { typ: 'wahl', frage: { de: 'Stärke zwei heißt: kaum verständlich. Was prüfst du zuerst?', en: 'Readability two means barely readable. What do you check first?' },
          optionen: [
            { de: 'Sendeleistung auf 25 W, Squelch und Antennenstecker', en: 'Power set to 25 W, squelch and the aerial connector', ok: true },
            { de: 'Auf Kanal 16 wechseln, dort ist der Empfang besser', en: 'Switch to channel 16, reception is better there' },
            { de: 'Lauter stellen', en: 'Turn up the volume' },
            { de: 'Es noch einmal mit derselben Einstellung versuchen', en: 'Try again with the same settings' }],
          erklaerung: { de: 'Die Lautstärke ändert nur, was du hörst – nicht, was ankommt. Im Hafen bleibt das Gerät gern auf 1 W stehen; dazu Squelch und Antenne prüfen. Der Kanal ist nicht das Problem.', en: 'Volume only changes what you hear, not what gets out. In harbour the set is often left on 1 W; check squelch and aerial as well. The channel is not the problem.' } },
        { typ: 'funkspruch', kanal: 72,
          hinweis: { de: 'Du hast auf 25 W geschaltet. Frag noch einmal nach.', en: 'You have switched to 25 W. Ask again.' },
          teile: [
            { de: 'Alberta', en: 'Alberta' },
            { de: 'hier ist Sailing X', en: 'this is Sailing X' },
            { de: 'ich habe auf volle Leistung geschaltet – wie hören Sie mich jetzt?', en: 'I have switched to high power – how do you read me now?' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'Funkprobe', en: 'radio check' }, { de: 'Rufzeichen OEX1234', en: 'call sign OEX1234', warum: { de: 'Beim zweiten Spruch im laufenden Gespräch genügt der Schiffsname.', en: 'Once the exchange is running, the vessel name alone is enough.' } }],
          antwort: { de: 'Sailing X – hier ist Alberta. Jetzt höre ich Sie Stärke fünf, einwandfrei. Over.', en: 'Sailing X – this is Alberta. Now I read you five, loud and clear. Over.' } },
        { typ: 'funkspruch', kanal: 72,
          hinweis: { de: 'Bedanke dich und beende das Gespräch richtig.', en: 'Say thank you and close the exchange properly.' },
          teile: [
            { de: 'Alberta', en: 'Alberta' },
            { de: 'hier ist Sailing X', en: 'this is Sailing X' },
            { de: 'danke für die Funkprobe', en: 'many thanks for the radio check' },
            { de: 'OUT', en: 'OUT' }
          ],
          stoerer: [
            { de: 'OVER', en: 'OVER', warum: { de: 'OVER würde eine Antwort erwarten – du beendest das Gespräch.', en: 'OVER would expect a reply – you are ending the exchange.' } },
            { de: 'OVER AND OUT', en: 'OVER AND OUT', warum: { de: 'Das gibt es im Funkverkehr nicht. Entweder OVER oder OUT.', en: 'That does not exist in radio procedure. Either OVER or OUT.' } }] }
      ],
      merke: { de: 'Funkprobe nie auf Kanal 16: Arbeitskanal wählen, eine Station nennen, Antwort als Zahl von 1 bis 5 – 5 heißt einwandfrei. Schwacher Empfang? Leistung, Squelch, Antenne prüfen.', en: 'Never run a radio check on channel 16: pick a working channel, name one station, and the answer comes as a figure from 1 to 5 – five is loud and clear. Weak signal? Check power, squelch and aerial.' }
    },

    {
      id: 'vokabeln', gruppe: 'Grundlagen', icon: '🌍', dauer: '3 Min.',
      generator: 'vokabel', anzahl: 10,
      titel: { de: 'Funkenglisch', en: 'Radio English' },
      lage: { de: 'Zehn Wendungen aus Notfall, Hilfe, Verfahren, Wetter und Hafen – jedes Mal neu zusammengestellt. Auf Deutsch gefragt, auf Englisch geantwortet; in der englischen Fassung umgekehrt.', en: 'Ten phrases from distress, assistance, procedure, weather and harbour – shuffled anew each run. Here the English phrase is given and you pick the German meaning.' },
      schritte: [],
      merke: { de: 'Die Wendungen sind kurz und fest – wer sie kennt, wird auch mit Akzent verstanden. Schiffe sind im Englischen weiblich: „she is sinking“.', en: 'The phrases are short and fixed – know them and you will be understood whatever your accent. Vessels are feminine in English: “she is sinking”.' }
    },

    {
      id: 'kennung', gruppe: 'Grundlagen', icon: '🪪', dauer: '3 Min.',
      titel: { de: 'Rufzeichen, MMSI, Zeugnis', en: 'Call sign, MMSI, certificate' },
      lage: { de: 'Sechs Fragen zu den Kennungen des Schiffes und dazu, wer senden darf.', en: 'Six questions on the vessel’s identities and on who may transmit.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Wie viele Ziffern hat eine MMSI?', en: 'How many digits does an MMSI have?' },
          optionen: [{ de: 'Neun', en: 'Nine', ok: true }, { de: 'Sieben', en: 'Seven' }, { de: 'Zehn', en: 'Ten' }, { de: 'So viele wie das Rufzeichen', en: 'As many as the call sign' }],
          erklaerung: { de: 'Neun Ziffern, die ersten drei sind die Länderkennung – Österreich 203, Kroatien 238, Italien 247, Slowenien 278, Deutschland 211 und 218.', en: 'Nine digits; the first three identify the nationality – Austria 203, Croatia 238, Italy 247, Slovenia 278, Germany 211 and 218.' } },
        { typ: 'wahl', frage: { de: 'Du siehst auf dem Plotter die Kennung 00238 1234. Wen rufst du damit?', en: 'The plotter shows the identity 00238 1234. Whom would that call?' },
          optionen: [{ de: 'Eine Küstenfunkstelle', en: 'A coast radio station', ok: true },
            { de: 'Eine Gruppe von Schiffen', en: 'A group of vessels' },
            { de: 'Ein einzelnes Schiff', en: 'An individual vessel' },
            { de: 'Einen AIS-Notsender', en: 'An AIS distress beacon' }],
          erklaerung: { de: 'Zwei führende Nullen stehen für eine Küstenfunkstelle, eine führende Null für eine Gruppe. Ein AIS-Notsender beginnt mit 970, 972 oder 974.', en: 'Two leading zeros mean a coast station, one leading zero a group. An AIS distress beacon starts with 970, 972 or 974.' } },
        { typ: 'wahl', frage: { de: 'Das Schiff wird verkauft. Was passiert mit dem Rufzeichen?', en: 'The boat is sold. What happens to the call sign?' },
          optionen: [{ de: 'Es bleibt beim Schiff', en: 'It stays with the vessel', ok: true },
            { de: 'Es bleibt beim alten Eigentümer', en: 'It stays with the former owner' },
            { de: 'Es verfällt', en: 'It expires' },
            { de: 'Es geht an den Hafen zurück', en: 'It goes back to the harbour authority' }],
          erklaerung: { de: 'Das internationale Rufzeichen gehört zur Funkstelle des Schiffes. Nur eine tragbare Funkstelle ist auf eine Person zugelassen – ihre Kennung beginnt mit T.', en: 'The international call sign belongs to the vessel’s radio station. Only a portable set is licensed to a person – its identity starts with T.' } },
        { typ: 'wahl', frage: { de: 'Welches Zeugnis brauchst du für UKW mit DSC in Küstennähe?', en: 'Which certificate do you need for VHF with DSC near the coast?' },
          optionen: [{ de: 'SRC', en: 'SRC', ok: true }, { de: 'LRC', en: 'LRC' }, { de: 'UBI', en: 'UBI' }, { de: 'Keines, das Gerät genügt', en: 'None, owning the set is enough' }],
          erklaerung: { de: 'SRC für UKW mit DSC, LRC für Grenz- und Kurzwelle und Satellit, UBI für Binnengewässer. Das Zeugnis gilt lebenslang.', en: 'SRC for VHF with DSC, LRC for MF/HF and satellite, UBI for inland waters. The certificate is valid for life.' } },
        { typ: 'wahl', frage: { de: 'Niemand an Bord hat ein Funkzeugnis, das Schiff sinkt. Darf gefunkt werden?', en: 'Nobody on board holds a certificate and the boat is sinking. May you transmit?' },
          optionen: [{ de: 'Ja – im Notfall darf jeder funken', en: 'Yes – in distress anyone may transmit', ok: true },
            { de: 'Nein, dann nur Seenotsignale verwenden', en: 'No, use pyrotechnics only' },
            { de: 'Nur mit Erlaubnis der Küstenfunkstelle', en: 'Only with permission from the coast station' },
            { de: 'Nur über Telefon', en: 'Only by telephone' }],
          erklaerung: { de: 'Der Notruf steht über allem. Im Alltag gilt dagegen: Nur mit Zeugnis senden – und nie ohne Zustimmung des Schiffsführers.', en: 'A distress call overrides everything. In normal traffic the rule stands: transmit only with a certificate – and never without the skipper’s consent.' } },
        { typ: 'wahl', frage: { de: 'Für welches Gerät brauchst du keine Zulassung?', en: 'Which device needs no licence?' },
          optionen: [{ de: 'Den AIS-Empfänger', en: 'An AIS receiver', ok: true },
            { de: 'Das UKW-Gerät mit DSC', en: 'The VHF set with DSC' },
            { de: 'Die Handfunke', en: 'The handheld VHF' },
            { de: 'Das Satellitentelefon', en: 'The satellite phone' }],
          erklaerung: { de: 'Rein empfangende Geräte – AIS-Empfänger, NAVTEX, GPS, Radar – brauchen keine Funkstellenzulassung. Alles, was sendet, schon.', en: 'Receive-only equipment – AIS receiver, NAVTEX, GPS, radar – needs no radio licence. Anything that transmits does.' } }
      ],
      merke: { de: 'Rufzeichen gehört zum Schiff, MMSI hat neun Ziffern mit der Länderkennung vorn, zwei Nullen vorweg heißt Küstenfunkstelle. SRC für UKW, lebenslang – und im Notfall darf jeder funken.', en: 'The call sign belongs to the vessel, the MMSI has nine digits starting with the nationality, two leading zeros mean a coast station. SRC for VHF, valid for life – and in distress anyone may transmit.' }
    },

    {
      id: 'medico', gruppe: 'Notverkehr', icon: '⚕️', dauer: '4 Min.',
      titel: { de: 'Funkärztliche Beratung', en: 'Urgent medical advice' },
      lage: { de: 'Ein Crewmitglied ist beim Reffen gestürzt, der Unterarm steht schief und schwillt stark an. Das Schiff ist in Ordnung, ihr seid zwölf Seemeilen vor Split. Du brauchst ärztlichen Rat – kein MAYDAY.', en: 'A crew member fell while reefing; the forearm is badly swollen and out of line. The boat is fine and you are twelve miles off Split. You need medical advice – not a MAYDAY.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Welche Dringlichkeitsstufe wählst du?', en: 'Which priority do you use?' },
          optionen: [{ de: 'PAN PAN', en: 'PAN PAN', ok: true }, { de: 'MAYDAY', en: 'MAYDAY' }, { de: 'SÉCURITÉ', en: 'SECURITE' }, { de: 'Routineanruf', en: 'A routine call' }],
          erklaerung: { de: 'Niemand ist in unmittelbarer Lebensgefahr und das Schiff ist nicht gefährdet – das ist Dringlichkeit, also PAN PAN. Verschlechtert sich der Zustand lebensbedrohlich, wird daraus ein MAYDAY.', en: 'Nobody is in immediate danger of life and the vessel is safe – that is urgency, so PAN PAN. If the condition becomes life-threatening it turns into a MAYDAY.' } },
        { typ: 'kanal', ziel: 16, start: 72,
          hinweis: { de: 'Auf welchem Kanal setzt du den Dringlichkeitsanruf ab?', en: 'On which channel do you make the urgency call?' },
          erklaerung: { de: 'Not-, Dringlichkeits- und Sicherheitsverkehr beginnt immer auf Kanal 16, mit voller Leistung.', en: 'Distress, urgency and safety traffic always start on channel 16, at high power.' } },
        { typ: 'funkspruch', kanal: 16, lang: true,
          hinweis: { de: 'Setze den PAN PAN an die Küstenfunkstelle Split Radio ab – Lage, Position, und was du brauchst.', en: 'Make the PAN PAN call to Split Radio – situation, position and what you need.' },
          teile: [
            { de: 'PAN PAN – PAN PAN – PAN PAN', en: 'PAN PAN – PAN PAN – PAN PAN' },
            { de: 'Split Radio, Split Radio, Split Radio', en: 'Split Radio, Split Radio, Split Radio' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'Rufzeichen OEX1234, MMSI 203123456', en: 'call sign OEX1234, MMSI 203123456' },
            { de: 'Position 43 Grad 12 Komma 4 Minuten Nord, 016 Grad 23 Komma 8 Minuten Ost', en: 'position 43 degrees 12 decimal 4 minutes North, 016 degrees 23 decimal 8 minutes East' },
            { de: 'ein Crewmitglied ist gestürzt und hat eine schwere Verletzung am Unterarm', en: 'a crew member has fallen and has a serious injury to the forearm' },
            { de: 'wir brauchen dringend funkärztliche Beratung', en: 'we require urgent medical advice' },
            { de: 'vier Personen an Bord, eine verletzt', en: 'four persons on board, one injured' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [
            { de: 'an alle Funkstellen, an alle Funkstellen, an alle Funkstellen', en: 'all stations, all stations, all stations', warum: { de: 'Hier rufst du gezielt die Küstenfunkstelle – sie stellt den Arzt her. „An alle Funkstellen“ nimmst du, wenn du keine Station erreichst.', en: 'Here you address the coast station, which puts the doctor through. “All stations” is for when no station answers.' } },
            { de: 'ich brauche sofortige Hilfe', en: 'I require immediate assistance', warum: { de: 'Du brauchst Rat, nicht die Rettung – das wäre ein MAYDAY.', en: 'You need advice, not rescue – that would be a MAYDAY.' } },
            { de: 'wir verlassen das Schiff', en: 'we are abandoning ship' }],
          antwort: { de: 'PAN PAN. Sailing X – hier ist Split Radio. Verstanden, funkärztliche Beratung. Wechseln Sie auf Kanal 26, wir schalten den Arzt dazu. Over.', en: 'PAN PAN. Sailing X – this is Split Radio. Roger, urgent medical advice. Switch to channel 26, we will connect the doctor. Over.' } },
        { typ: 'kanal', ziel: 26, start: 16,
          hinweis: { de: 'Wechsle auf den zugewiesenen Arbeitskanal.', en: 'Change to the working channel you were given.' },
          erklaerung: { de: 'Das Gespräch selbst läuft auf dem Arbeitskanal – Kanal 16 bleibt frei.', en: 'The conversation itself runs on the working channel – channel 16 stays clear.' } },
        { typ: 'funkspruch', kanal: 26,
          hinweis: { de: 'Melde dich und beschreibe, was der Arzt wissen muss: Alter, Zustand, was passiert ist, was an Bord ist.', en: 'Report in and describe what the doctor needs: age, condition, what happened, what you carry on board.' },
          teile: [
            { de: 'Split Radio', en: 'Split Radio' },
            { de: 'hier ist Sailing X', en: 'this is Sailing X' },
            { de: 'Patient ist 38 Jahre alt, bei Bewusstsein, atmet normal', en: 'the patient is 38 years old, conscious and breathing normally' },
            { de: 'Sturz auf das Deck, Unterarm verformt und stark geschwollen, starke Schmerzen', en: 'fall onto the deck, forearm deformed and badly swollen, severe pain' },
            { de: 'wir haben eine Bordapotheke mit Schmerzmitteln und Schienen', en: 'we carry a first-aid kit with painkillers and splints' },
            { de: 'wir laufen Split an, Ankunft in etwa zwei Stunden', en: 'we are heading for Split, arriving in about two hours' },
            { de: 'OVER', en: 'OVER' }
          ],
          stoerer: [{ de: 'PAN PAN – PAN PAN – PAN PAN', en: 'PAN PAN – PAN PAN – PAN PAN', warum: { de: 'Die Ansage gilt dem ersten Anruf auf 16. Auf dem Arbeitskanal sprichst du normal weiter.', en: 'The announcement belongs to the first call on 16. On the working channel you simply carry on.' } }],
          antwort: { de: 'Sailing X – hier ist Split Radio mit dem Arzt. Arm ruhig stellen und schienen, nichts essen und trinken lassen, kein Schmerzmittel mit Blutverdünnung. Melden Sie sich in 30 Minuten erneut und sofort, wenn Finger kalt oder blau werden. Over.', en: 'Sailing X – this is Split Radio with the doctor. Immobilise and splint the arm, keep the patient nil by mouth, no blood-thinning painkillers. Report again in 30 minutes, and immediately if the fingers turn cold or blue. Over.' } },
        { typ: 'wahl', frage: { de: 'Der Patient wird zunehmend bewusstlos. Was tust du?', en: 'The patient becomes increasingly unconscious. What do you do?' },
          optionen: [{ de: 'Jetzt MAYDAY absetzen – es ist Lebensgefahr', en: 'Make a MAYDAY call now – there is danger to life', ok: true },
            { de: 'Weiter per PAN PAN auf Kanal 26 melden', en: 'Carry on with PAN PAN on channel 26' },
            { de: 'Auf die nächste Meldung in 30 Minuten warten', en: 'Wait for the next report in 30 minutes' },
            { de: 'Hafen anrufen und schneller fahren', en: 'Call the marina and motor faster' }],
          erklaerung: { de: 'Die Stufe richtet sich nach der Lage, nicht nach dem, was man zuerst gewählt hat. Wird es lebensbedrohlich, wird aus PAN PAN ein MAYDAY – notfalls mit DSC-Notalarm.', en: 'The priority follows the situation, not what you chose first. When life is at risk, PAN PAN becomes MAYDAY – with a DSC distress alert if needed.' } }
      ],
      merke: { de: 'Funkärztliche Beratung ist PAN PAN: Küstenfunkstelle rufen, auf den Arbeitskanal wechseln, dann Alter, Zustand, Hergang, Bordmittel und ETA nennen. Wird es lebensbedrohlich, sofort MAYDAY.', en: 'Medical advice is a PAN PAN: call the coast station, change to the working channel, then give age, condition, what happened, what you carry and your ETA. If life is at risk, go to MAYDAY at once.' }
    },

    {
      id: 'widerrufen', gruppe: 'Notverkehr', icon: '↩️', dauer: '3 Min.',
      titel: { de: 'Fehlalarm widerrufen', en: 'Cancel a false alert' },
      lage: { de: 'Beim Aufräumen hat ein Crewmitglied die rote Klappe erwischt – das Gerät hat um 12:30 Uhr einen DSC-Notalarm abgesetzt. Niemand ist in Gefahr. Jetzt zählt nur, dass die Rettungskräfte das sofort erfahren.', en: 'While tidying up, a crew member caught the red cover – the set sent a DSC distress alert at 12:30. Nobody is in danger. All that matters now is that the rescue services hear it straight away.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Was tust du als Erstes?', en: 'What do you do first?' },
          optionen: [{ de: 'Den wiederholten Alarm am Gerät beenden – das Gerät bleibt an', en: 'Stop the repeating alert on the set – and leave the set switched on', ok: true },
            { de: 'Das Funkgerät ausschalten', en: 'Switch the radio off' },
            { de: 'Abwarten, ob sich jemand meldet', en: 'Wait and see whether anybody calls' },
            { de: 'Die Marina anrufen', en: 'Call the marina' }],
          erklaerung: { de: 'Ausschalten ist der häufigste Fehler: Der Alarm ist längst unterwegs, und ohne Gerät kannst du den Widerruf nicht aussprechen und die Rückfrage der Küstenfunkstelle nicht hören.', en: 'Switching off is the classic mistake: the alert is already out, and with the set off you can neither speak the cancellation nor hear the coast station call back.' } },
        { typ: 'kanal', ziel: 16, start: 70,
          hinweis: { de: 'Auf welchem Kanal sprichst du den Widerruf?', en: 'On which channel do you speak the cancellation?' },
          erklaerung: { de: 'Der Alarm ging digital auf Kanal 70 hinaus, der Widerruf wird auf Kanal 16 gesprochen – mit voller Leistung, damit ihn alle hören, die den Alarm gesehen haben.', en: 'The alert went out digitally on channel 70; the cancellation is spoken on channel 16 – at high power, so everyone who saw the alert hears it.' } },
        { typ: 'funkspruch', kanal: 16, lang: true,
          hinweis: { de: 'Widerrufe den Notalarm – mit Kennung und der Uhrzeit der Fehlauslösung.', en: 'Cancel the distress alert – with your identity and the time of the false alert.' },
          teile: [
            { de: 'an alle Funkstellen, an alle Funkstellen, an alle Funkstellen', en: 'all stations, all stations, all stations' },
            { de: 'hier ist Sailing X, Sailing X, Sailing X', en: 'this is Sailing X, Sailing X, Sailing X' },
            { de: 'Rufzeichen OEX1234, MMSI 203123456', en: 'call sign OEX1234, MMSI 203123456' },
            { de: 'ich widerrufe meinen Notalarm', en: 'cancel my distress alert' },
            { de: 'ich wiederhole: ich widerrufe meinen Notalarm von 12:30 Uhr Ortszeit', en: 'I say again: cancel my distress alert of 12:30 local time' },
            { de: 'der Alarm wurde versehentlich ausgelöst, an Bord ist alles in Ordnung', en: 'the alert was sent in error, all is well on board' },
            { de: 'OUT', en: 'OUT' }
          ],
          stoerer: [
            { de: 'MAYDAY – MAYDAY – MAYDAY', en: 'MAYDAY – MAYDAY – MAYDAY', warum: { de: 'Es ist kein Notfall – genau das willst du ja klarstellen.', en: 'There is no distress – that is exactly what you are clearing up.' } },
            { de: 'OVER', en: 'OVER', warum: { de: 'Der Widerruf erwartet keine Antwort und endet mit OUT. Hörbereit bleibst du trotzdem.', en: 'The cancellation expects no reply and ends with OUT. You still keep listening.' } },
            { de: 'SEELONCE MAYDAY', en: 'SEELONCE MAYDAY' }],
          antwort: { de: 'Sailing X – hier ist Split Radio. Widerruf verstanden, Alarm von 12:30 Uhr gelöscht. Bitte bleiben Sie auf Kanal 16. Out.', en: 'Sailing X – this is Split Radio. Cancellation understood, alert of 12:30 cleared. Please remain on channel 16. Out.' } },
        { typ: 'wahl', frage: { de: 'Was gilt für die nächsten Minuten?', en: 'What applies for the next few minutes?' },
          optionen: [{ de: 'Auf Kanal 16 hörbereit bleiben – es kommt oft eine Rückfrage', en: 'Keep listening on channel 16 – a call back often follows', ok: true },
            { de: 'Gerät ausschalten, die Sache ist erledigt', en: 'Switch the set off, the matter is closed' },
            { de: 'Auf einen Arbeitskanal wechseln', en: 'Change to a working channel' },
            { de: 'Den Widerruf alle zwei Minuten wiederholen', en: 'Repeat the cancellation every two minutes' }],
          erklaerung: { de: 'Die Rettungsleitstelle will sich meist persönlich überzeugen und fragt nach Schiff, Position und Lage. Wer dann nicht antwortet, löst erst richtig eine Suche aus.', en: 'The rescue centre usually wants to make sure and will ask about vessel, position and situation. Not answering then is what really starts a search.' } },
        { typ: 'wahl', frage: { de: 'Und wenn versehentlich die EPIRB angegangen ist?', en: 'And if the EPIRB has been set off by accident?' },
          optionen: [{ de: 'Ausschalten und sofort die nächste Küstenwache anrufen', en: 'Switch it off and call the nearest coastguard at once', ok: true },
            { de: 'Nur ausschalten, das genügt', en: 'Just switch it off, that is enough' },
            { de: 'In eine Metalldose legen', en: 'Put it in a metal tin' },
            { de: 'Laufen lassen, sie schaltet sich selbst ab', en: 'Let it run, it stops by itself' }],
          erklaerung: { de: 'Das Signal ist über Satellit längst in einer Leitstelle angekommen. Ausschalten allein beendet die Suche nicht – es braucht den Anruf, der sagt: Fehlalarm.', en: 'The signal has long since reached a rescue centre by satellite. Switching off alone does not end the search – it takes the call that says: false alert.' } }
      ],
      merke: { de: 'Fehlalarm: Gerät an lassen, Alarm beenden, auf Kanal 16 an alle Funkstellen widerrufen – mit Kennung und Uhrzeit – und hörbereit bleiben. Dasselbe gilt für EPIRB: ausschalten und anrufen.', en: 'False alert: leave the set on, stop the alert, cancel on channel 16 to all stations – with identity and time – and keep listening. The same for an EPIRB: switch off and phone in.' }
    },

    {
      id: 'gmdss', gruppe: 'Geräte & GMDSS', icon: '🛰️', dauer: '3 Min.',
      titel: { de: 'GMDSS verstehen', en: 'Understanding GMDSS' },
      lage: { de: 'Sechs Fragen dazu, wie der Notruf vom Schiff bis zur Rettungsleitstelle kommt – und welches Gerät dabei welche Aufgabe hat.', en: 'Six questions on how a distress call travels from the boat to the rescue centre – and what each device does along the way.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Wofür steht GMDSS?', en: 'What does GMDSS stand for?' },
          optionen: [{ de: 'Weltweites Seenot- und Sicherheitsfunksystem', en: 'Global Maritime Distress and Safety System', ok: true },
            { de: 'Ein Satellitentelefonnetz', en: 'A satellite telephone network' },
            { de: 'Die Kanalliste des Seefunks', en: 'The channel list of the marine band' },
            { de: 'Eine Wetterdatenbank', en: 'A weather database' }],
          erklaerung: { de: 'Das GMDSS verbindet DSC, NAVTEX, Satellitenfunk, EPIRB, SART und Sprechfunk zu einem System, in dem ein Notruf automatisch bei einer Leitstelle landet.', en: 'GMDSS ties DSC, NAVTEX, satellite communications, EPIRB, SART and voice radio into one system in which a distress call automatically reaches a rescue centre.' } },
        { typ: 'wahl', frage: { de: 'In welchem Seegebiet segelst du mit UKW und DSC an der kroatischen Küste?', en: 'Which sea area are you in with VHF and DSC along the Croatian coast?' },
          optionen: [{ de: 'A1', en: 'A1', ok: true }, { de: 'A2', en: 'A2' }, { de: 'A3', en: 'A3' }, { de: 'A4', en: 'A4' }],
          erklaerung: { de: 'A1 ist die Reichweite einer UKW-Küstenfunkstelle mit DSC, etwa 20 bis 30 sm. A2 ist Grenzwelle, A3 Satellit, A4 die Polargebiete mit Kurzwelle.', en: 'A1 is within range of a VHF coast station with DSC, roughly 20 to 30 miles. A2 is MF, A3 satellite, A4 the polar regions on HF.' } },
        { typ: 'wahl', frage: { de: 'Was liefert NAVTEX?', en: 'What does NAVTEX provide?' },
          optionen: [{ de: 'Textmeldungen: Wetter, Warnungen, Hinweise zu Notfällen', en: 'Text messages: weather, warnings and notices of distress incidents', ok: true },
            { de: 'Sprechverbindungen mit der Küstenfunkstelle', en: 'Voice contact with the coast station' },
            { de: 'Die Positionen aller Schiffe in der Nähe', en: 'The positions of all vessels nearby' },
            { de: 'Seekarten zum Herunterladen', en: 'Charts to download' }],
          erklaerung: { de: 'NAVTEX empfängt nur – rund 300 sm weit, auf 518 kHz international auf Englisch, auf 490 kHz national in der Landessprache.', en: 'NAVTEX only receives – about 300 miles, on 518 kHz internationally in English and on 490 kHz nationally in the local language.' } },
        { typ: 'wahl', frage: { de: 'Was kann AIS nicht?', en: 'What can AIS not do?' },
          optionen: [{ de: 'Fahrzeuge zeigen, die selbst kein AIS senden', en: 'Show vessels that do not transmit AIS themselves', ok: true },
            { de: 'Namen und MMSI eines Frachters anzeigen', en: 'Show a freighter’s name and MMSI' },
            { de: 'Kurs und Geschwindigkeit anzeigen', en: 'Show course and speed' },
            { de: 'Ein Notsignal einer Rettungsinsel anzeigen', en: 'Show a distress signal from a liferaft' }],
          erklaerung: { de: 'AIS zeigt nur, wer selbst sendet. Land, Netze, Treibgut und die Yacht ohne Transponder bleiben unsichtbar – deshalb ersetzt AIS kein Radar und keinen Ausguck.', en: 'AIS shows only those who transmit. Land, nets, flotsam and the yacht without a transponder stay invisible – which is why AIS replaces neither radar nor a lookout.' } },
        { typ: 'wahl', frage: { de: 'Wer leitet im Notfall die Rettung?', en: 'Who coordinates a rescue?' },
          optionen: [{ de: 'Die MRCC – die Rettungsleitstelle', en: 'The MRCC – the rescue coordination centre', ok: true },
            { de: 'Die Marina des Zielhafens', en: 'The marina you were heading for' },
            { de: 'Das nächste Schiff', en: 'The nearest vessel' },
            { de: 'Der Charterbetrieb', en: 'The charter company' }],
          erklaerung: { de: 'Die MRCC nimmt den Notruf an, leitet den Notverkehr und entscheidet, welche Einheiten auslaufen. Das nächste Schiff hilft – geführt wird aus der Leitstelle.', en: 'The MRCC receives the call, controls distress traffic and decides which units are sent. The nearest vessel helps – but the centre is in charge.' } },
        { typ: 'wahl', frage: { de: 'Warum ist das Handy kein Notrufmittel?', en: 'Why is a mobile phone no substitute for radio?' },
          optionen: [{ de: 'Es erreicht nur eine Stelle – nicht die Schiffe in der Nähe', en: 'It reaches one place only – not the vessels nearby', ok: true },
            { de: 'Weil es verboten ist', en: 'Because it is forbidden' },
            { de: 'Weil es keine Nummern für Rettungsleitstellen gibt', en: 'Because there are no numbers for rescue centres' },
            { de: 'Weil es auf See immer Netz hat', en: 'Because it always has coverage at sea' }],
          erklaerung: { de: 'Beim Funk hören alle mit, die helfen könnten. Das Handy hängt an Netz und Akku und bleibt eine gute Rückfallebene – die Nummern der Leitstellen gehören trotzdem eingespeichert.', en: 'On radio everyone who could help is listening. A phone depends on coverage and battery and stays a good backup – the rescue centre numbers belong in it all the same.' } }
      ],
      merke: { de: 'GMDSS heißt: Der Notruf findet selbst den Weg zur Leitstelle. In Küstennähe (A1) trägt UKW mit DSC, NAVTEX liefert Text, AIS zeigt nur, wer sendet, und geleitet wird aus der MRCC.', en: 'GMDSS means the distress call finds its own way to the rescue centre. Near the coast (A1) VHF with DSC carries it, NAVTEX brings text, AIS shows only those who transmit, and the MRCC is in charge.' }
    },

    {
      id: 'notgeraete', gruppe: 'Geräte & GMDSS', icon: '🧭', dauer: '3 Min.',
      titel: { de: 'EPIRB, SART und PLB', en: 'EPIRB, SART and PLB' },
      lage: { de: 'Fünf Fragen zu den Geräten, die dafür sorgen, dass dich jemand findet.', en: 'Five questions on the devices that make sure somebody finds you.' },
      schritte: [
        { typ: 'wahl', frage: { de: 'Auf welchem Weg wird eine EPIRB geortet?', en: 'How is an EPIRB located?' },
          optionen: [{ de: 'Über Satelliten auf 406 MHz', en: 'By satellites on 406 MHz', ok: true },
            { de: 'Über Kanal 70', en: 'On channel 70' },
            { de: 'Über das Mobilfunknetz', en: 'Through the mobile network' },
            { de: 'Über das Radar der Schiffe in der Nähe', en: 'By the radar of nearby vessels' }],
          erklaerung: { de: 'Die EPIRB sendet auf 406 MHz an die COSPAS-SARSAT-Satelliten – unabhängig von Funkreichweite. Viele Baken peilen zusätzlich auf 121,5 MHz für die letzten Meter.', en: 'The EPIRB transmits on 406 MHz to the COSPAS-SARSAT satellites – independent of radio range. Many also home on 121.5 MHz for the final approach.' } },
        { typ: 'wahl', frage: { de: 'Warum muss eine EPIRB registriert sein?', en: 'Why must an EPIRB be registered?' },
          optionen: [{ de: 'Damit die Leitstelle weiß, welches Schiff ruft und wen sie erreichen kann', en: 'So the rescue centre knows which vessel is calling and whom to contact', ok: true },
            { de: 'Aus Gewährleistungsgründen', en: 'For warranty reasons' },
            { de: 'Damit sie auf Kanal 16 hörbar wird', en: 'So it can be heard on channel 16' },
            { de: 'Damit sie zollfrei bleibt', en: 'To keep it duty-free' }],
          erklaerung: { de: 'Registriert wird beim Register des Flaggenstaats. Ohne Registrierung kommt nur ein anonymes Signal an – das kostet Zeit, die im Notfall fehlt.', en: 'Registration goes to the flag state’s registry. Without it only an anonymous signal arrives – and that costs time you do not have.' } },
        { typ: 'wahl', frage: { de: 'Was sieht der Retter auf dem Radarschirm, wenn ein Radar-SART antwortet?', en: 'What does a rescuer see on the radar screen when a radar SART responds?' },
          optionen: [{ de: 'Bis zu zwölf Punkte, die näher dran zu Bögen und Kreisen werden', en: 'Up to twelve dots that turn into arcs and then circles as he closes in', ok: true },
            { de: 'Einen Kreis mit Kreuz', en: 'A circle with a cross' },
            { de: 'Die genaue GPS-Position mit Kennung', en: 'The exact GPS position with an identity' },
            { de: 'Nichts – der SART arbeitet nur über Satellit', en: 'Nothing – a SART works via satellite only' }],
          erklaerung: { de: 'Der Radar-SART antwortet auf den Radarstrahl: erst eine Punktreihe, dann Bögen, ganz nah Kreise. Der Kreis mit Kreuz auf dem Plotter dagegen ist das Symbol des AIS-SART.', en: 'A radar SART replies to the radar beam: first a line of dots, then arcs, and circles very close in. The circle with a cross on the plotter is the AIS SART symbol.' } },
        { typ: 'wahl', frage: { de: 'Welchen Vorteil hat der AIS-SART gegenüber dem Radar-SART?', en: 'What is the advantage of an AIS SART over a radar SART?' },
          optionen: [{ de: 'Er sendet die eigene GPS-Position, die man direkt ansteuern kann', en: 'It transmits its own GPS position, which can be steered to directly', ok: true },
            { de: 'Er reicht viel weiter zum Suchflugzeug', en: 'It reaches a search aircraft much further out' },
            { de: 'Er braucht keinen Empfänger beim Retter', en: 'The rescuer needs no receiver at all' },
            { de: 'Er funktioniert mit jedem Radar', en: 'It works with any radar' }],
          erklaerung: { de: 'Der AIS-SART liefert Position, Kurs und Abstand und ist bei Regen und hoher See robuster. Dafür funktioniert der Radar-SART mit jedem X-Band-Radar und wird vom Suchflugzeug weiter gesehen.', en: 'The AIS SART gives position, course and range and is more robust in rain and heavy seas. The radar SART, in turn, works with any X-band radar and is seen further out by a search aircraft.' } },
        { typ: 'wahl', frage: { de: 'Auf dem Plotter erscheint eine AIS-Kennung, die mit 972 beginnt. Was bedeutet das?', en: 'An AIS identity beginning with 972 appears on the plotter. What does it mean?' },
          optionen: [{ de: 'Ein Mann-über-Bord-Sender ist aktiv', en: 'A man-overboard beacon is active', ok: true },
            { de: 'Eine Küstenfunkstelle ruft', en: 'A coast station is calling' },
            { de: 'Ein Schiff aus Slowenien', en: 'A vessel from Slovenia' },
            { de: 'Ein virtuelles Seezeichen', en: 'A virtual navigation mark' }],
          erklaerung: { de: '970 ist ein AIS-SART, 972 ein Mann-über-Bord-Sender, 974 eine AIS-EPIRB. Jede dieser Kennungen ist ein Notfall: Position notieren, Kurs darauf, Küstenwache informieren.', en: '970 is an AIS SART, 972 a man-overboard beacon, 974 an AIS EPIRB. Every one of them is a distress case: note the position, head for it, inform the coastguard.' } }
      ],
      merke: { de: 'EPIRB ortet über Satellit und muss registriert sein; der Radar-SART malt Punkte, Bögen und Kreise auf den Radarschirm, der AIS-SART eine echte Position auf den Plotter. Kennungen mit 970, 972 oder 974 sind immer ein Notfall.', en: 'An EPIRB is located by satellite and must be registered; a radar SART paints dots, arcs and circles on the radar screen, an AIS SART a real position on the plotter. Identities starting 970, 972 or 974 always mean distress.' }
    }
  ];

  return { SCHIFF: SCHIFF, ABC: ABC, THEORIE: THEORIE, VOKABELN: VOKABELN, EINHEITEN: EINHEITEN };
})();
