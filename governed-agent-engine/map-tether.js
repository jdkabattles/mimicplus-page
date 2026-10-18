/* Directory Maps tether for Governed Agent Engine. Vanilla, zero-dependency, no tracking, no external fetches.
   HONESTY RULE: a 'built' entry must link to a URL that actually serves that site today.
   'built_here' means the site exists as files in this build but is NOT yet live — no live link.
   Staged / planned / not-yet-live targets are 'coming_soon', never 'built' with a dead link.
   Governed Agent Engine is its own website, only tethered by the one domain. */
(function () {
  'use strict';
  var DIRECTORY = [
    { group: 'hub', name: 'Gold Is The Receipt hub', url: null, status: 'removed', desc: 'Removed.' },
    { group: 'standard', name: 'Algorithmic Gold', url: null, status: 'removed', desc: 'Removed — claims unverified.' },
    { group: 'learn', name: 'Blog', url: null, status: 'removed', desc: 'Removed — claims unverified.' },
    { group: 'learn', name: 'Pattern Atlas', url: null, status: 'removed', desc: 'Removed — claims unverified.' },
    { group: 'products', name: 'Products', url: null, status: 'removed', desc: 'Removed — claims unverified.' },
    { group: 'products', name: 'Mimicplus', url: 'https://www.forgingstack.com/', status: 'built', desc: 'Live at forgingstack.com (its home). Client-side HAR sanitizer that never uploads data.' },
    { group: 'products', name: 'Contract Gate', url: 'https://www.forgingstack.com/gate/', status: 'built', desc: 'Live at /gate/. Its own website, separate from Mimicplus.' },
    { group: 'products', name: 'harwatch', url: 'https://www.forgingstack.com/harwatch/', status: 'built', desc: 'Live at /harwatch/ on this domain (hosted in the Mimicplus site repo).' },
    { group: 'products', name: 'EvidenceForge', url: 'https://www.forgingstack.com/evidenceforge/', status: 'built', desc: 'Auditable, evidence-citing AI agents. Free core, MIT.' },
    { group: 'products', name: 'Avcal-Agent', url: 'https://www.forgingstack.com/avcal-agent/', status: 'built', desc: 'Sandboxed hidden-suite verification for agent-written code.' },
    { group: 'products', name: 'Governed Agent Engine', url: 'https://www.forgingstack.com/governed-agent-engine/', status: 'built', desc: 'This site. A governed multi-agent engine that runs at $0. Live at /governed-agent-engine/.' },
    { group: 'products', name: 'Products', url: 'https://forgingstack.com/products/', status: 'built', desc: 'Actual products only. Overture $29, Jobs $19, SEC $49. CSV plus delivery receipt.' },
    { group: 'products', name: 'Verity', url: 'https://www.forgingstack.com/verity/', status: 'coming_soon', desc: 'Not yet live on this domain. Coming Soon.' }
  ];
  var GROUPS = [
    { key: 'hub', label: 'Hub' },
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
      DIRECTORY.filter(function (d) { return d.group === g.key; }).forEach(function (d) {
        var li = document.createElement('li');
        if (d.status === 'built') {
          var a = document.createElement('a');
          a.href = d.url;
          a.textContent = d.name;
          li.appendChild(a);
        } else if (d.status === 'built_here') {
          var here = document.createElement('strong');
          here.className = 'gt-tether-coming-title';
          here.textContent = d.name;
          var badge = document.createElement('span');
          badge.className = 'gt-tether-coming-soon';
          badge.textContent = 'Built here, not yet live';
          li.appendChild(here);
          li.appendChild(badge);
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
      tab.textContent = 'Directory Maps';
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
