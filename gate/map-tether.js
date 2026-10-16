// Contract Gate — Directory Maps Tether (map-tether.js).
// Adapted from the mimicplus tether. Contract is its OWN website at /gate/
// (real live path), not a child of mimicplus. Host page look unchanged;
// this adds only the tab + drawer.
// Lightweight, drop-in bridge between individual websites that share one domain.
// Each product is its own website, only tethered by the one domain.
// This component does NOT change the host page's look. It adds ONE small
// "Directory Maps" tab (inline where the host places <span data-tether-mount></span>)
// and ONE directory drawer that opens only when the visitor asks.
// - Zero dependencies. Vanilla JS. No external fetches. No tracking.
// - No sticky bar. No floaty bar. No auto-open. No fake live.
// - Tab label is "Directory Maps". Drawer has an X in the TOP RIGHT corner
//   (aria-label "Close Directory Maps") that closes the drawer. Escape also closes.
// - Fallback corner tab (no mount point) is dismissible for the session
//   via sessionStorage and never reappears after dismissal in that session.
// - Respects prefers-reduced-motion (no transitions; drawer appears at once).
// - Keyboard: Escape closes, focus returns to the button that opened it.
//
// Install (host page adds only these lines):
//   <link rel="stylesheet" href="map-tether.css">   (or ../map-tether.css one level down)
//   <span data-tether-mount></span>   (inside host header or top of article)
//   <script src="map-tether.js"></script>   (or ../map-tether.js one level down)
// All directory URLs are absolute, so no data-tether-base is needed.

(function () {
  'use strict';

  // ---- Single source of truth: the directory. ----
  // Same titles, groups, descriptions as DIRECTORY_MAPS.md. Update here once.
  // "children" are subpages of that site. Every child has a real link.
  // Contract is its OWN site (not a child of mimicplus).
  // Status: 'built' = listed with a link. 'coming_soon' = listed with the
  // page name + "Coming Soon" underneath, NO live link, not clickable.
  // A coming_soon entry keeps its planned `url` in the data so flipping
  // it to built is a one-field change — the renderer never turns it
  // into an <a> while status is 'coming_soon'.
  //
  // HONESTY RULE (AG fix, 2026-10-16): a 'built' entry must link to a URL
  // that actually serves that site today. Staged / planned / not-yet-live
  // targets are 'coming_soon', never 'built' with a dead link.
  // Avcal-Agent / EvidenceForge / Verity are therefore 'coming_soon' here
  // (they are NOT live on this domain), even though the older mimicplus
  // tether still lists them as built staged targets. Contract follows the
  // honest rule. Gold Is The Receipt hub is coming_soon: its page is not
  // yet live as its own page, and its planned URL collides with the
  // mimicplus home (forgingstack.com).
  var DIRECTORY = [
    { group: 'hub', title: 'Gold Is The Receipt', url: 'https://forgingstack.com/', status: 'coming_soon', desc: 'The hub. Done is a claim. GOLD is a receipt. Not yet live as its own page — this domain currently serves mimicplus.' },
    { group: 'standard', title: 'Algorithmic Gold', url: 'https://jdkabattles.github.io/algorithmic-gold/', status: 'built', desc: 'The verification standard. Six gates. Real outcomes.', children: [
      { title: 'Blog', url: 'https://jdkabattles.github.io/algorithmic-gold/blog/index.html', status: 'built', desc: 'Essays behind the standard.' },
      { title: 'Why Single Runs Lie', url: 'https://jdkabattles.github.io/algorithmic-gold/blog/why-single-run-lies.html', status: 'built', desc: 'One run is not a result.' },
      { title: 'The Goodhart Gate', url: 'https://jdkabattles.github.io/algorithmic-gold/blog/goodhart-gate.html', status: 'built', desc: 'When the scoreboard gets gamed.' },
      { title: 'Specification Gaming Catalog', url: 'https://jdkabattles.github.io/algorithmic-gold/blog/specification-gaming-catalog.html', status: 'built', desc: 'Ways a spec can be gamed.' },
      { title: 'Contamination and Holdout', url: 'https://jdkabattles.github.io/algorithmic-gold/blog/contamination-holdout.html', status: 'built', desc: 'Why the holdout stays frozen.' },
      { title: 'Receipt, Not Claim', url: 'https://jdkabattles.github.io/algorithmic-gold/blog/receipt-not-claim.html', status: 'built', desc: 'A claim without a receipt is not done.' },
      { title: 'Pattern Atlas', url: 'https://jdkabattles.github.io/algorithmic-gold/patterns/index.html', status: 'built', desc: '49 cited patterns behind the gates.' },
      { title: 'Products', url: 'https://jdkabattles.github.io/algorithmic-gold/products/index.html', status: 'built', desc: 'Products under the standard.' }
    ] },
    { group: 'products', title: 'mimicplus', url: 'https://forgingstack.com/', status: 'built', desc: 'HAR to OpenAPI, typed Python client, and breaking-change check. $199 once.', children: [
      { title: 'What goes in', url: 'https://forgingstack.com/what-it-does/', status: 'built', desc: 'What you feed mimicplus, and what comes out.' },
      { title: 'The missing spec', url: 'https://forgingstack.com/blog/', status: 'built', desc: 'A partner screen can change overnight.' },
      { title: 'About', url: 'https://forgingstack.com/about/', status: 'built', desc: 'About mimicplus, the HAR to OpenAPI client.' },
      { title: 'Contact', url: 'https://forgingstack.com/contact/', status: 'built', desc: 'Contact mimicplus about a delivery.' },
      { title: 'HAR to OpenAPI', url: 'https://forgingstack.com/har-to-openapi/', status: 'built', desc: 'Convert a HAR to OpenAPI.' },
      { title: 'Breaking-change check', url: 'https://forgingstack.com/api-diff/', status: 'built', desc: 'API breaking-change check from a HAR.' },
      { title: 'How to use it', url: 'https://forgingstack.com/how-to/', status: 'built', desc: 'How to use mimicplus, in plain English.' },
      { title: 'For the programmer', url: 'https://forgingstack.com/technical/', status: 'built', desc: 'What the programmer gets.' }
    ] },
    { group: 'products', title: 'Contract', url: 'https://forgingstack.com/gate/', status: 'built', desc: 'Contract Gate, its own website. Lives at /gate/. This site.', children: [
      { title: 'What goes in', url: 'https://forgingstack.com/gate/what-it-does/', status: 'built', desc: 'What Contract Gate takes, and what it returns.' },
      { title: 'How to use it', url: 'https://forgingstack.com/gate/how-to/', status: 'built', desc: 'How to use Contract Gate, in plain English.' },
      { title: 'For the programmer', url: 'https://forgingstack.com/gate/technical/', status: 'built', desc: 'Approved spec, later HAR, one waiver.' }
    ] },
    { group: 'products', title: 'Avcal-Agent', url: 'https://forgingstack.com/avcal-agent/', status: 'coming_soon', desc: 'Sandboxed hidden-suite verification for agent-written code. Site exists as code in its repo; not yet live on this domain.' },
    { group: 'products', title: 'harwatch', url: 'https://forgingstack.com/harwatch/', status: 'built', desc: 'Freeze an API, fail when a field is removed. $29 a month. Live in the mimicplus site repo.' },
    { group: 'products', title: 'EvidenceForge', url: 'https://forgingstack.com/evidenceforge/', status: 'coming_soon', desc: 'EvidenceForge, its own website. Not yet live on this domain.' },
    { group: 'products', title: 'Verity', url: 'https://forgingstack.com/verity/', status: 'coming_soon', desc: 'Verity, evidence ledger for agent runs. Site exists in its repo and needs work; not yet live on this domain.' },
    { group: 'products', title: 'Governed Agent Engine', url: 'https://forgingstack.com/governed-agent-engine/', status: 'coming_soon', desc: 'Governed Agent Engine, its own website. Not yet built.' }
  ]

  var GROUPS = [
    { id: 'hub', label: 'Hub' },
    { id: 'standard', label: 'Standard' },
    { id: 'learn', label: 'Learn' },
    { id: 'products', label: 'Products' }
  ];

  var lastFocused = null;
  var drawer = null;
  var scrim = null;
  var searchInput = null;
  var emptyNote = null;

  function baseOf(mount) {
    if (mount && mount.getAttribute('data-tether-base')) {
      var b = mount.getAttribute('data-tether-base');
      return b.charAt(b.length - 1) === '/' ? b : b + '/';
    }
    return '/';
  }

  function resolveUrl(base, url) {
    // Absolute https URLs pass through unchanged.
    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) return url;
    if (base === '/' || base === '') return url;
    if (url.charAt(0) === '/') return base + url.slice(1);
    return base + url;
  }

  function buildDirectory(base) {
    scrim = document.createElement('div');
    scrim.className = 'gt-tether-scrim';
    scrim.setAttribute('data-gt-tether-scrim', '');
    scrim.hidden = true;

    drawer = document.createElement('aside');
    drawer.className = 'gt-tether-drawer';
    drawer.setAttribute('aria-label', 'Directory Maps');
    drawer.hidden = true;

    var head = document.createElement('div');
    head.className = 'gt-tether-head';

    // X in the TOP RIGHT corner. This is the close control.
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'gt-tether-close';
    closeBtn.setAttribute('data-gt-tether-close', '');
    closeBtn.setAttribute('aria-label', 'Close Directory Maps');
    closeBtn.textContent = '\u00d7';
    head.appendChild(closeBtn);

    var h2 = document.createElement('h2');
    h2.className = 'gt-tether-title';
    h2.textContent = 'Directory Maps';
    head.appendChild(h2);

    var p = document.createElement('p');
    p.className = 'gt-tether-sub';
    p.textContent = 'Every website on this domain, and every subpage. Built entries link to their page. Unbuilt entries say Coming Soon.';
    head.appendChild(p);

    var label = document.createElement('label');
    label.className = 'gt-tether-search-label';
    label.setAttribute('for', 'gt-tether-search');
    label.textContent = 'Search pages';
    head.appendChild(label);

    searchInput = document.createElement('input');
    searchInput.id = 'gt-tether-search';
    searchInput.className = 'gt-tether-search';
    searchInput.type = 'search';
    searchInput.placeholder = 'Search pages, e.g. Atlas, Contract, Verity';
    searchInput.autocomplete = 'off';
    head.appendChild(searchInput);

    drawer.appendChild(head);

    var groupsWrap = document.createElement('div');
    groupsWrap.className = 'gt-tether-groups';

    GROUPS.forEach(function (g) {
      var entries = DIRECTORY.filter(function (s) { return s.group === g.id; });
      if (!entries.length) return;
      var section = document.createElement('section');
      section.className = 'gt-tether-group';
      section.setAttribute('data-group', g.id);

      var h3 = document.createElement('h3');
      h3.textContent = g.label;
      section.appendChild(h3);

      var ul = document.createElement('ul');
      entries.forEach(function (s) {
        var li = document.createElement('li');
        // Coming Soon: plain text + "Coming Soon" underneath. NO <a>,
        // not clickable, aria-disabled so assistive tech says it is not a link.
        if (s.status === 'coming_soon') {
          li.className = 'gt-tether-coming';
          var title = document.createElement('strong');
          title.className = 'gt-tether-coming-title';
          title.textContent = s.title;
          var coming = document.createElement('span');
          coming.className = 'gt-tether-coming-soon';
          coming.textContent = 'Coming Soon';
          var cdesc = document.createElement('span');
          cdesc.textContent = s.desc;
          li.setAttribute('aria-disabled', 'true');
          li.appendChild(title);
          li.appendChild(coming);
          li.appendChild(cdesc);
          ul.appendChild(li);
          return;
        }
        var a = document.createElement('a');
        a.href = resolveUrl(base, s.url);
        a.textContent = s.title;
        var span = document.createElement('span');
        span.textContent = s.desc;
        li.appendChild(a);
        li.appendChild(span);
        if (s.children && s.children.length) {
          var sub = document.createElement('ul');
          sub.className = 'gt-tether-subpages';
          s.children.forEach(function (c) {
            var cli = document.createElement('li');
            if (c.status === 'coming_soon') {
              cli.className = 'gt-tether-subpage gt-tether-coming';
              var ctitle = document.createElement('strong');
              ctitle.className = 'gt-tether-coming-title';
              ctitle.textContent = c.title;
              var ccoming = document.createElement('span');
              ccoming.className = 'gt-tether-coming-soon';
              ccoming.textContent = 'Coming Soon';
              var ccdesc = document.createElement('span');
              ccdesc.textContent = c.desc;
              cli.setAttribute('aria-disabled', 'true');
              cli.appendChild(ctitle);
              cli.appendChild(ccoming);
              cli.appendChild(ccdesc);
              sub.appendChild(cli);
              return;
            }
            cli.className = 'gt-tether-subpage';
            var ca = document.createElement('a');
            ca.href = resolveUrl(base, c.url);
            ca.textContent = c.title;
            var cspan = document.createElement('span');
            cspan.textContent = c.desc;
            cli.appendChild(ca);
            cli.appendChild(cspan);
            sub.appendChild(cli);
          });
          li.appendChild(sub);
        }
        ul.appendChild(li);
      });
      section.appendChild(ul);
      groupsWrap.appendChild(section);
    });

    drawer.appendChild(groupsWrap);

    emptyNote = document.createElement('p');
    emptyNote.className = 'gt-tether-empty';
    emptyNote.hidden = true;
    emptyNote.textContent = 'No pages match that search. Try Atlas, Contract, or Verity.';
    drawer.appendChild(emptyNote);

    document.body.appendChild(scrim);
    document.body.appendChild(drawer);

    scrim.addEventListener('click', closeDirectory);
    closeBtn.addEventListener('click', closeDirectory);
    searchInput.addEventListener('input', function () {
      filterDirectory(searchInput.value);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawer && !drawer.hidden) closeDirectory();
    });
  }

  function filterDirectory(query) {
    if (!drawer) return;
    var q = (query || '').trim().toLowerCase();
    var anyVisible = false;
    var sections = drawer.querySelectorAll('.gt-tether-group');
    sections.forEach(function (section) {
      var sectionVisible = false;
      var items = section.querySelectorAll(':scope > ul > li');
      items.forEach(function (item) {
        var ownText = '';
        var link = item.querySelector(':scope > a');
        var comingTitle = item.querySelector(':scope > .gt-tether-coming-title');
        var desc = item.querySelector(':scope > span');
        if (link) ownText += link.textContent + ' ';
        if (comingTitle) ownText += comingTitle.textContent + ' ';
        if (desc) ownText += desc.textContent;
        var ownMatch = (q === '' || ownText.toLowerCase().indexOf(q) !== -1);
        var subList = item.querySelector(':scope > .gt-tether-subpages');
        var anyChildMatch = false;
        if (subList) {
          var subs = subList.querySelectorAll('.gt-tether-subpage');
          subs.forEach(function (sub) {
            var subMatch = (q === '' || sub.textContent.toLowerCase().indexOf(q) !== -1);
            sub.hidden = !subMatch;
            if (subMatch) anyChildMatch = true;
          });
          subList.hidden = (q !== '' && !anyChildMatch && !ownMatch);
        }
        var show = ownMatch || anyChildMatch;
        item.hidden = !show;
        if (show) { sectionVisible = true; anyVisible = true; }
      });
      section.hidden = !sectionVisible;
    });
    if (emptyNote) emptyNote.hidden = anyVisible;
  }

  function openDirectory() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.hidden = false;
    if (scrim) scrim.hidden = false;
    // Lock scroll only while the drawer is open. Restore on close.
    document.body.style.overflow = 'hidden';
    if (searchInput) {
      searchInput.value = '';
      filterDirectory('');
      searchInput.focus();
    }
  }

  function closeDirectory() {
    if (!drawer) return;
    drawer.hidden = true;
    if (scrim) scrim.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function isDismissed() {
    try {
      return window.sessionStorage.getItem('gt-tether-dismissed') === '1';
    } catch (e) {
      return false;
    }
  }

  function markDismissed() {
    try {
      window.sessionStorage.setItem('gt-tether-dismissed', '1');
    } catch (e) { /* sessionStorage unavailable: dismissal lasts for this page view */ }
  }

  function makeTabButton() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gt-tether-btn';
    btn.setAttribute('aria-label', 'Open Directory Maps');
    // Full text on desktop, compact text on phones (CSS switches spans).
    var full = document.createElement('span');
    full.className = 'gt-tether-btn-full';
    full.textContent = 'Directory Maps';
    var short = document.createElement('span');
    short.className = 'gt-tether-btn-short';
    short.textContent = 'Directory';
    btn.appendChild(full);
    btn.appendChild(short);
    btn.addEventListener('click', openDirectory);
    return btn;
  }

  function mountFallbackTab(base) {
    // Last resort only: host page provided no mount point.
    // Small corner tab with its own dismiss button. Dismiss hides it for
    // the session and it does not reappear. It never auto-opens the drawer.
    if (isDismissed()) return;
    var wrap = document.createElement('div');
    wrap.className = 'gt-tether-fallback';

    wrap.appendChild(makeTabButton());

    var dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'gt-tether-dismiss';
    dismiss.textContent = '\u00d7';
    dismiss.setAttribute('aria-label', 'Dismiss Directory Maps button for this session');
    dismiss.addEventListener('click', function () {
      markDismissed();
      wrap.remove();
    });
    wrap.appendChild(dismiss);

    document.body.appendChild(wrap);
  }

  function init() {
    var mounts = document.querySelectorAll('[data-tether-mount]');
    var base = '/';
    if (mounts.length) base = baseOf(mounts[0]);

    buildDirectory(base);

    if (mounts.length) {
      mounts.forEach(function (mount) {
        mount.appendChild(makeTabButton());
      });
    } else {
      mountFallbackTab(base);
    }

    // Any host-page element with [data-open-map] also opens Directory Maps.
    // This lets a host page wire its own button without adding a mount.
    document.querySelectorAll('[data-open-map]').forEach(function (el) {
      el.addEventListener('click', openDirectory);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
