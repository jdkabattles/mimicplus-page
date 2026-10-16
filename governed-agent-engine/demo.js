/* Governed Agent Engine — doctrine gate demo. Vanilla, zero-dependency, no tracking.
   Fixed local cases only. No fetched content, no user input read into HTML.
   Cases are illustrative plans built from the gate rules in docs/doctrine.md,
   labelled illustrative. Nothing here is live output from the engine. */
(function () {
  'use strict';
  var CASES = {
    valid: {
      title: 'Plan A — PASS',
      stamp: 'PASS',
      stampClass: 'stamp-pass',
      body: [
        ['Result', 'Passes the doctrine gate. Enters the backlog.'],
        ['Steps', 'gather (evidence_required) → analyze → execute (evidence_required, failure_modes) → verify (evidence_required) → improve (after verify).'],
        ['Rule fired', 'None. Typed kinds, evidence flags, failure modes, and improve-after-verify all present.']
      ]
    },
    noImprove: {
      title: 'Plan B — FAIL · no improve step',
      stamp: 'FAIL',
      stampClass: 'stamp-fail',
      body: [
        ['Result', 'Rejected. Rejection written as evidence; model takes the laziness penalty; next model in the fallback chain is tried (up to 4 models).'],
        ['Steps', 'gather → analyze → execute → verify. No improve step.'],
        ['Rule fired', 'improvement_loop: a kind: improve step must come after a kind: verify step.']
      ]
    },
    substring: {
      title: 'Plan C — FAIL · the substring trick',
      stamp: 'FAIL',
      stampClass: 'stamp-fail',
      body: [
        ['Result', 'Rejected. The word “improve” in the text does not count.'],
        ['Steps', 'gather → analyze → execute → verify (“verify, then improve nothing”). No step with kind: improve.'],
        ['Rule fired', 'Typed kind, not substring matching. The gate checks kind == “improve” placed after a verify step. A test proves adding the word “improve” to the text does not pass (test_substring_improve_is_not_enough).']
      ]
    },
    noEvidence: {
      title: 'Plan D — FAIL at reconciliation · done without evidence',
      stamp: 'FAIL',
      stampClass: 'stamp-fail',
      body: [
        ['Result', 'Plan passed the gate, but the run reported done without the required evidence. Reconciled as FAILED. An evidence_check.json records why. The agent takes the routing penalty.'],
        ['Steps', 'Plan was valid. Execution result: outputs.evidence missing the evidence_required step.'],
        ['Rule fired', 'Evidence of truth: every evidence_required step needs outputs.evidence[“step index”] naming a non-empty file under artifacts/. A done result without it is reconciled as FAILED.']
      ]
    }
  };
  function render(key) {
    var detail = document.getElementById('demo-detail');
    if (!detail) { return; }
    var c = CASES[key];
    var html = '<h3>' + c.title + '</h3>' +
      '<p><span class="stamp ' + c.stampClass + '">' + c.stamp + '</span></p>';
    c.body.forEach(function (row) {
      html += '<p><strong>' + row[0] + ':</strong> ' + row[1] + '</p>';
    });
    detail.innerHTML = html;
    document.querySelectorAll('.demo-claim').forEach(function (btn) {
      var active = btn.getAttribute('data-demo') === key;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }
  function init() {
    document.querySelectorAll('.demo-claim').forEach(function (btn) {
      btn.addEventListener('click', function () {
        render(btn.getAttribute('data-demo'));
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
