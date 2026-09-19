/* ==========================================================================
   SailingX Academy – gemeinsame Funktionen aller Lektionen
   - Selbsttest (liest die Fragen aus window.QUIZ)
   - Vor/Zurück-Navigation (innerhalb der Kurs-App ohne Neuladen)
   - Kopfleiste, wenn die Lektion direkt geöffnet wird
   ========================================================================== */
(function(){
  'use strict';
  var body = document.body;
  var ROOT = body.getAttribute('data-root') || '';
  var PATH = body.getAttribute('data-path') || '';
  var framed = false;
  try { framed = window.self !== window.top; } catch (e) { framed = true; }

  var params = {};
  location.search.replace(/^\?/, '').split('&').forEach(function(kv){ if (kv) params[decodeURIComponent(kv.split('=')[0])] = decodeURIComponent(kv.split('=')[1] || '1'); });
  var nurRechner = 'rechner' in params;

  /* ---------- Wiederholungsstapel (falsch beantwortete Fragen) ---------- */
  var STAPEL = 'segelacademy_fehler_v1';
  function stapelLaden(){ try { return JSON.parse(localStorage.getItem(STAPEL) || '{}') || {}; } catch (e) { return {}; } }
  function stapelSpeichern(st){ try { localStorage.setItem(STAPEL, JSON.stringify(st)); } catch (e) {} }
  function stapelSetzen(qi, falsch){
    var st = stapelLaden(), k = PATH + '#' + qi;
    if (falsch) st[k] = { p: PATH, i: qi, s: 0, t: Date.now() };
    else if (st[k]) delete st[k];
    stapelSpeichern(st);
    post({ type: 'sx-stapel', n: Object.keys(st).length });
  }

  function post(msg){
    if (!framed) return;
    try { window.parent.postMessage(msg, '*'); } catch (e) {}
  }

  /* ---------- Nur-Rechner-Ansicht für den Werkzeugkasten ---------- */
  if (nurRechner) {
    body.classList.add('nur-rechner');
    Array.prototype.forEach.call(document.querySelectorAll('main > section.card'), function(s){
      if (s.querySelector('.calc')) s.classList.add('hat-rechner');
    });
    var sendH = function(){ post({ type: 'sx-height', h: document.documentElement.scrollHeight, path: PATH }); };
    if (window.ResizeObserver) new ResizeObserver(sendH).observe(document.body);
    window.addEventListener('load', sendH); setTimeout(sendH, 50);
  }

  /* ---------- Einbettung / Standalone ---------- */
  if (framed) {
    body.classList.add('im-kurs');
    // Links, die aus der Lektion herausführen, im ganzen Fenster öffnen
    Array.prototype.forEach.call(document.querySelectorAll('a[data-top]'), function(a){ a.target = '_top'; });
    // Vor/Zurück: Kurs-App übernimmt (Seitenleiste & Fortschritt bleiben synchron)
    Array.prototype.forEach.call(document.querySelectorAll('a[data-nav]'), function(a){
      a.addEventListener('click', function(ev){
        var p = a.getAttribute('data-nav');
        if (!p) return;
        ev.preventDefault();
        post({ type: 'sx-open', path: p });
      });
    });
    if (!nurRechner) post({ type: 'sx-ready', path: PATH });
  } else if (!nurRechner) {
    var top = document.createElement('div');
    top.className = 'sx-top';
    top.innerHTML =
      '<div class="sx-top-in">' +
        '<a class="sx-brand" href="' + ROOT + 'index.html"><img src="' + ROOT + 'assets/symbol.svg" alt="" width="40" height="40"><span>SailingX-Academy</span></a>' +
        '<a class="sx-open" href="' + ROOT + 'kurs.html#' + encodeURIComponent(PATH) + '">Im Kurs öffnen →</a>' +
      '</div>';
    body.insertBefore(top, body.firstChild);
  }

  /* ---------- Selbsttest ---------- */
  var QUIZ = window.QUIZ || [];
  var quizBody = document.getElementById('quizBody');
  var answered = [];

  function esc(s){ return String(s); } // Fragen enthalten bewusst einfaches HTML (<b>, <sub> …)

  function buildQuiz(){
    if (!quizBody) return;
    answered = QUIZ.map(function(){ return false; });
    var html = '';
    QUIZ.forEach(function(item, qi){
      html += '<div class="quiz-q"><div class="qnum">Frage ' + (qi + 1) + ' von ' + QUIZ.length + '</div>' +
              '<div class="qtext">' + esc(item.q) + '</div>';
      item.opts.forEach(function(opt, oi){
        html += '<button type="button" class="opt" data-q="' + qi + '" data-o="' + oi + '">' + esc(opt) + '<span class="mark" aria-hidden="true"></span></button>';
      });
      html += '<div class="expl" id="expl-' + qi + '" role="status">' + esc(item.expl || '') + '</div></div>';
    });
    quizBody.innerHTML = html;
    document.getElementById('result').classList.remove('show');
    Array.prototype.forEach.call(quizBody.querySelectorAll('.opt'), function(b){ b.addEventListener('click', onAnswer); });
  }

  function onAnswer(e){
    var btn = e.currentTarget, qi = +btn.getAttribute('data-q'), oi = +btn.getAttribute('data-o');
    if (answered[qi]) return;
    answered[qi] = true;
    var correct = QUIZ[qi].correct;
    Array.prototype.forEach.call(quizBody.querySelectorAll('.opt[data-q="' + qi + '"]'), function(b){
      b.disabled = true;
      var bo = +b.getAttribute('data-o');
      if (bo === correct) { b.classList.add('correct'); b.querySelector('.mark').textContent = '✓'; }
      if (bo === oi && oi !== correct) { b.classList.add('wrong'); b.querySelector('.mark').textContent = '✗'; }
    });
    document.getElementById('expl-' + qi).classList.add('show');
    stapelSetzen(qi, oi !== correct);
    if (answered.every(Boolean)) showResult();
  }

  function showResult(){
    var score = 0;
    QUIZ.forEach(function(item, qi){ if (!quizBody.querySelector('.opt[data-q="' + qi + '"].wrong')) score++; });
    var t = QUIZ.length, pass = Math.ceil(t * 0.6), msg;
    document.getElementById('scoreTxt').textContent = score + ' / ' + t;
    if (score === t) msg = 'Perfekt! Sitzt. ⚓';
    else if (score >= pass) msg = 'Gut gemacht – schau dir die markierten Punkte nochmal an.';
    else msg = 'Wiederhole die Lektion und versuch es erneut – du schaffst das!';
    if (framed && score >= pass) msg += ' Die Lektion wurde als erledigt markiert.';
    document.getElementById('resultMsg').textContent = msg;
    var old = document.querySelector('.stapel-hint'); if (old) old.parentNode.removeChild(old);
    if (score < t) {
      var h = document.createElement('div'); h.className = 'stapel-hint';
      h.innerHTML = 'Falsch beantwortete Fragen liegen jetzt in deinem <a href="' + ROOT + 'ueben.html#wiederholen"' + (framed ? ' target="_top"' : '') + '>Wiederholungsstapel</a>.';
      document.getElementById('result').insertBefore(h, document.getElementById('retryBtn'));
    }
    document.getElementById('result').classList.add('show');
    post({ type: 'sx-quiz', path: PATH, score: score, total: t, passed: score >= pass });
  }

  function resetQuiz(){
    buildQuiz();
    var q = document.getElementById('quiz');
    if (q && q.scrollIntoView) q.scrollIntoView({ behavior: 'smooth' });
  }

  var retry = document.getElementById('retryBtn');
  if (retry) retry.addEventListener('click', resetQuiz);
  window.resetQuiz = resetQuiz; // Abwärtskompatibilität
  buildQuiz();
})();
