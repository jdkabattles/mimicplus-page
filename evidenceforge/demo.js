/* Evidence demo: visitor-driven only. No fake live, no auto-jitter, no timers.
   c1 is the real repo example. c2/c3 are illustrative validator-rule cases. */
(function () {
  'use strict';
  var DETAILS = {
    real: {
      title: 'Claim c1 — PASS',
      html: '<p><strong>Evidence:</strong> <code>system-prompt:guidelines</code></p>' +
        '<p><strong>Resolves to:</strong> <a href="https://docs.x.ai/grok/overview">https://docs.x.ai/grok/overview</a> (from the repo registry).</p>' +
        '<p><strong>Self-check:</strong> all_claims_have_evidence: true · missing_evidence_for: [] · rule_violations: [].</p>' +
        '<p class="demo-source">Source: <code>checks/outputs.example.jsonl</code> + <code>.evidenceforge/registry.json</code> in the repo.</p>'
    },
    missing: {
      title: 'Claim c2 — FAIL',
      html: '<p><strong>Evidence:</strong> none cited.</p>' +
        '<p><strong>Validator:</strong> this claim id is listed in <code>missing_evidence_for</code>. Status <code>fail</code>. Exit code non-zero.</p>' +
        '<p class="demo-source">Illustrative case built from the <code>validate_record</code> rules in <code>cli.py</code> — not a repo output record.</p>'
    },
    unknown: {
      title: 'Claim c3 — FAIL',
      html: '<p><strong>Evidence cited:</strong> <code>not-in-registry:xyz</code> — an ID that is not in the registry.</p>' +
        '<p><strong>Validator:</strong> <code>unknown_evidence:not-in-registry:xyz</code> violation. Status <code>fail</code>. Exit code non-zero.</p>' +
        '<p class="demo-source">Illustrative case built from the <code>validate_record</code> rules in <code>cli.py</code> — not a repo output record.</p>'
    }
  };
  function init() {
    var detail = document.getElementById('demo-detail');
    if (!detail) { return; }
    document.querySelectorAll('[data-demo]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-demo');
        var d = DETAILS[key];
        if (!d) { return; }
        document.querySelectorAll('[data-demo]').forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        detail.innerHTML = '<h3>' + d.title + '</h3>' + d.html;
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
