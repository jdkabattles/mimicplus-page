/* Directory Maps tether for this stub page. Vanilla, zero-dependency, no tracking, no external fetches.
   HONESTY RULE: a 'built' entry must link to a URL that actually serves that site today.
   Staged / planned / not-yet-live targets are 'coming_soon', never 'built' with a dead link.
   The content that was here was removed; this page states only that.
   Each product is its own website, only tethered by the one domain.    FRESHNESS RULE: any product launch, removal, price, or status change updates
   this data in the same gate that makes the change.
   Directory data synced to the canonical root directory 2026-10-21 (Batch 43):
   hub + removed entries deleted (a directory lists what exists); Gold Is The
   Receipt is coming_soon at /gold/ with its live verify child.
*/
(function () {
  'use strict';
  var DIRECTORY = [
    // NOTE — mimicplus adaptation.
    // All URLs are absolute https://forgingstack.com/ (apex, matching this
    // site's existing links) or the real live Algorithmic Gold URL on
    // GitHub Pages. No staged forgingstack.com targets are used for sites
    // that already have a real live URL. Contract lives at /gate/ today
    // (real, in this repo); its planned home is /mimicplus/contract/.
    // HONESTY RULE (2026-10-16 fix): a 'built' entry must link to a URL that
    // actually serves that site today. Staged / planned / not-yet-live
    // targets are 'coming_soon', never 'built' with a dead link.
    // Gold Is The Receipt hub was live at /hub/; removed 2026-10-18.
    // The hub entry and the removed Algorithmic Gold entry were deleted
    // from this data 2026-10-21 (Batch 12): a directory lists what
    // exists. Gold Is The Receipt itself is 'coming_soon' at /gold/:
    // its verify page (/gold/verify/) is live and the Verification Run
    // sells on /products/, but no /gold/ home page serves yet, so the
    // entry carries no link until it does.
    // FRESHNESS RULE: any product launch, removal, price, or status
    // change updates this data in the same gate that makes the change.
    // Verity is coming_soon: its site exists as code in its repo, but is
    // not yet live on this domain. EvidenceForge is built: live at
    // /evidenceforge/ since 2026-10-16. Avcal-Agent is built: live at
    // /avcal-agent/ since 2026-10-16.
    { group: 'standard', name: 'Gold Is The Receipt', url: 'https://forgingstack.com/gold/', status: 'coming_soon', desc: 'The trust standard. GOLD Verification Run ($49 once) sells on the Products page; receipt verification is live at /gold/verify/. This home page is not yet live on the domain. Coming Soon.', children: [
      { name: 'Verify a receipt', url: 'https://forgingstack.com/gold/verify/', status: 'built', desc: 'Check a GOLD receipt against its gates.' }
    ] },
    { group: 'products', name: 'mimicplus', url: 'https://forgingstack.com/', status: 'built', desc: 'HAR to OpenAPI, typed Python client, and breaking-change check. $199 once. This site.', children: [
      { name: 'What goes in', url: 'https://forgingstack.com/what-it-does/', status: 'built', desc: 'What you feed mimicplus, and what comes out.' },
      { name: 'The missing spec', url: 'https://forgingstack.com/blog/', status: 'built', desc: 'A partner screen can change overnight.' },
      { name: 'About', url: 'https://forgingstack.com/about/', status: 'built', desc: 'About mimicplus, the HAR to OpenAPI client.' },
      { name: 'Contact', url: 'https://forgingstack.com/contact/', status: 'built', desc: 'Contact mimicplus about a delivery.' },
      { name: 'HAR to OpenAPI', url: 'https://forgingstack.com/har-to-openapi/', status: 'built', desc: 'Convert a HAR to OpenAPI.' },
      { name: 'Breaking-change check', url: 'https://forgingstack.com/api-diff/', status: 'built', desc: 'API breaking-change check from a HAR.' },
      { name: 'How to use it', url: 'https://forgingstack.com/how-to/', status: 'built', desc: 'How to use mimicplus, in plain English.' },
      { name: 'For the programmer', url: 'https://forgingstack.com/technical/', status: 'built', desc: 'What the programmer gets.' }
    ] },
    { group: 'products', name: 'Contract', url: 'https://forgingstack.com/gate/', status: 'built', desc: 'Contract Gate, its own website. Prominent link from mimicplus. Lives at /gate/ today.', children: [
      { name: 'What goes in', url: 'https://forgingstack.com/gate/what-it-does/', status: 'built', desc: 'What Contract Gate takes, and what it returns.' },
      { name: 'How to use it', url: 'https://forgingstack.com/gate/how-to/', status: 'built', desc: 'How to use Contract Gate, in plain English.' },
      { name: 'For the programmer', url: 'https://forgingstack.com/gate/technical/', status: 'built', desc: 'Approved spec, later HAR, one waiver.' }
    ] },
    { group: 'products', name: 'Avcal-Agent', url: 'https://forgingstack.com/avcal-agent/', status: 'built', desc: 'Sandboxed hidden-suite verification for agent-written code. Live at /avcal-agent/.' },
    { group: 'products', name: 'harwatch', url: 'https://forgingstack.com/harwatch/', status: 'built', desc: 'Freeze an API, fail when a field is removed. Hosted watch planned at $29 a month — waitlist only today. Live at /harwatch/.' },
    { group: 'products', name: 'EvidenceForge', url: 'https://forgingstack.com/evidenceforge/', status: 'built', desc: 'EvidenceForge, its own website. Auditable, evidence-citing AI agents. Live at /evidenceforge/.' },
    { group: 'products', name: 'Products', url: 'https://forgingstack.com/products/', status: 'built', desc: 'Actual products only. Overture $29, Jobs $19, SEC $49, GOLD Verification Run $49, ForgePack Pro $49.' },
    { group: 'products', name: 'Verity', url: 'https://forgingstack.com/verity/', status: 'coming_soon', desc: 'Verity, evidence ledger for agent runs. Site exists in its repo (docs/index.html) and needs work; not yet live on this domain. Coming Soon.' },
    { group: 'products', name: 'Governed Agent Engine', url: 'https://forgingstack.com/governed-agent-engine/', status: 'built', desc: 'Governed Agent Engine, its own website. Live at /governed-agent-engine/.' }
  ];
  var GROUPS = [
    { key: 'standard', label: 'Standard' },
    { key: 'learn', label: 'Learn' },
    { key: 'products', label: 'Products' }
  ];

  function buildDrawer() {
    var scrim = document.createElement('div');
    scrim.className = 'gt-tether-scrim';
    scrim.setAttribute('data-tether-scrim', '');
    scrim.hidden = true;
    var drawer = document.createElement('aside');
    drawer.className = 'gt-tether-drawer';
    drawer.setAttribute('aria-label', 'Directory Maps');
    drawer.hidden = true;
    var head = document.createElement('div');
    head.className = 'gt-tether-head';
    var title = document.createElement('h2');
    title.textContent = 'Directory Maps';
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'gt-tether-close-x';
    close.setAttribute('aria-label', 'Close Directory Maps');
    close.textContent = 'X';
    head.appendChild(title);
    head.appendChild(close);
    var intro = document.createElement('p');
    intro.textContent = 'Every site. Built entries link to their page. Unbuilt entries say Coming Soon.';
    var label = document.createElement('label');
    label.className = 'gt-tether-search-label';
    label.setAttribute('for', 'gt-tether-search');
    label.textContent = 'Search sites';
    var search = document.createElement('input');
    search.id = 'gt-tether-search';
    search.className = 'gt-tether-search';
    search.type = 'search';
    search.placeholder = 'Search sites, e.g. Contract, Verity';
    search.autocomplete = 'off';
    drawer.appendChild(head);
    drawer.appendChild(intro);
    drawer.appendChild(label);
    drawer.appendChild(search);
    var groupsEl = document.createElement('div');
    groupsEl.className = 'gt-tether-groups';
    GROUPS.forEach(function (g) {
      var sec = document.createElement('section');
      sec.className = 'gt-tether-group';
      sec.setAttribute('data-group', g.key);
      var h = document.createElement('h3');
      h.textContent = g.label;
      sec.appendChild(h);
      var ul = document.createElement('ul');
      var items = DIRECTORY.filter(function (d) { return d.group === g.key; });
      if (!items.length) { return; }
      items.forEach(function (d) {
        var li = document.createElement('li');
        if (d.status === 'built') {
          var a = document.createElement('a');
          a.href = d.url;
          a.textContent = d.name;
          li.appendChild(a);
        } else if (d.status === 'removed') {
          var rstrong = document.createElement('strong');
          rstrong.className = 'gt-tether-coming-title';
          rstrong.textContent = d.name;
          var rmark = document.createElement('span');
          rmark.className = 'gt-tether-coming-soon';
          rmark.textContent = 'Removed';
          li.appendChild(rstrong);
          li.appendChild(rmark);
        } else {
          var strong = document.createElement('strong');
          strong.className = 'gt-tether-coming-title';
          strong.textContent = d.name;
          var soon = document.createElement('span');
          soon.className = 'gt-tether-coming-soon';
          soon.textContent = 'Coming Soon';
          li.appendChild(strong);
          li.appendChild(soon);
        }
        var span = document.createElement('span');
        span.textContent = d.desc;
        li.appendChild(span);

        if (d.status === 'built' && d.children && d.children.length) {
          var sub = document.createElement('ul');
          sub.className = 'gt-tether-subpages';
          d.children.forEach(function (c) {
            var cli = document.createElement('li');
            cli.className = 'gt-tether-subpage';
            if (c.status === 'built') {
              var ca = document.createElement('a');
              ca.href = c.url;
              ca.textContent = c.name;
              cli.appendChild(ca);
            } else {
              var cstrong = document.createElement('strong');
              cstrong.className = 'gt-tether-coming-title';
              cstrong.textContent = c.name;
              var cmark = document.createElement('span');
              cmark.className = 'gt-tether-coming-soon';
              cmark.textContent = c.status === 'removed' ? 'Removed' : 'Coming Soon';
              cli.appendChild(cstrong);
              cli.appendChild(cmark);
            }
            var cspan = document.createElement('span');
            cspan.textContent = c.desc;
            cli.appendChild(cspan);
            sub.appendChild(cli);
          });
          li.appendChild(sub);
        }
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      groupsEl.appendChild(sec);
    });
    drawer.appendChild(groupsEl);
    var empty = document.createElement('p');
    empty.className = 'gt-tether-empty';
    empty.hidden = true;
    empty.textContent = 'No sites match that search.';
    drawer.appendChild(empty);
    document.body.appendChild(scrim);
    document.body.appendChild(drawer);
    function filter() {
      var q = search.value.trim().toLowerCase();
      var any = false;
      drawer.querySelectorAll('.gt-tether-group').forEach(function (sec) {
        var secAny = false;
        sec.querySelectorAll('li').forEach(function (li) {
          var show = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
          li.hidden = !show;
          if (show) { secAny = true; any = true; }
        });
        sec.hidden = !secAny;
      });
      empty.hidden = any;
    }
    search.addEventListener('input', filter);
    return { scrim: scrim, drawer: drawer, close: close };
  }

  function init() {
    var ui = buildDrawer();
    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      ui.scrim.hidden = false;
      ui.drawer.hidden = false;
      document.body.classList.add('gt-tether-open');
      ui.close.focus();
    }
    function closeDrawer() {
      ui.scrim.hidden = true;
      ui.drawer.hidden = true;
      document.body.classList.remove('gt-tether-open');
      if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
    }
    document.querySelectorAll('[data-open-map]').forEach(function (btn) {
      btn.addEventListener('click', open);
    });
    ui.close.addEventListener('click', closeDrawer);
    ui.scrim.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !ui.drawer.hidden) { closeDrawer(); }
    });
    // Inline mount: host places <span data-tether-mount></span> where the tab goes.
    document.querySelectorAll('[data-tether-mount]').forEach(function (mount) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'gt-tether-tab';
      tab.setAttribute('data-open-map', '');
      tab.setAttribute('aria-label', 'Open Directory Maps');
      tab.textContent = 'Open Directory Maps';
      tab.addEventListener('click', open);
      mount.replaceWith(tab);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
