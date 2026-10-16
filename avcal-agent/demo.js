/* Avcal-Agent preflight illustration. Visitor-driven only. No live run, no timers, no tracking.
   Verdicts illustrate the preflight rule from the README: reference must pass, mutants must fail. */
(function () {
  'use strict';
  var VERDICTS = {
    reference: { text: 'Reference solution: ACCEPTED. Preflight passes this candidate — the suite accepts correct code.', cls: 'pass' },
    hardcoder: { text: 'Hard-coder mutant: KILLED. Preflight rejects it — it only memorized the public examples.', cls: 'fail' },
    broken: { text: 'Broken mutant: KILLED. Preflight rejects it — the suite discriminates, so the pass will mean something.', cls: 'fail' }
  };
  function init() {
    var out = document.getElementById('demo-result');
    if (!out) { return; }
    document.querySelectorAll('[data-demo]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = VERDICTS[btn.getAttribute('data-demo')];
        if (!v) { return; }
        out.textContent = v.text;
        out.classList.remove('pass', 'fail');
        out.classList.add(v.cls);
      });
    });
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
