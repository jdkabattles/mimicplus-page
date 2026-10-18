// mimicplus — Directory Maps Tether (map-tether.js).
// Adapted from the Algorithmic Gold tether: absolute forgingstack.com URLs
// for this site, real live URLs where verified (Algorithmic Gold on GitHub
// Pages, Contract at /gate/, harwatch in this repo). Host page look
// unchanged; this adds only the tab + drawer.
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
//   <link rel="stylesheet" href="/map-tether.css">
//   <span data-tether-mount></span>   (inside host header or footer)
//   <script src="/map-tether.js"></script>
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
  // Status: 'removed' = listed with the page name + "Removed" underneath, NO live link, not clickable.
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
    // Verity is coming_soon: its site exists as code in its repo, but is
    // not yet live on this domain. EvidenceForge is built: live at
    // /evidenceforge/ since 2026-10-16. Avcal-Agent is built: live at
    // /avcal-agent/ since 2026-10-16.
    { group: 'hub', title: 'Gold Is The Receipt', url: null, status: 'removed', desc: 'Removed.' },
    { group: 'standard', title: 'Algorithmic Gold', url: null, status: 'removed', desc: 'Removed — claims unverified.' },
    { group: 'products', title: 'mimicplus', url: 'https://forgingstack.com/', status: 'built', desc: 'HAR to OpenAPI, typed Python client, and breaking-change check. $199 once. This site.', children: [
      { title: 'What goes in', url: 'https://forgingstack.com/what-it-does/', status: 'built', desc: 'What you feed mimicplus, and what comes out.' },
      { title: 'The missing spec', url: 'https://forgingstack.com/blog/', status: 'built', desc: 'A partner screen can change overnight.' },
      { title: 'About', url: 'https://forgingstack.com/about/', status: 'built', desc: 'About mimicplus, the HAR to OpenAPI client.' },
      { title: 'Contact', url: 'https://forgingstack.com/contact/', status: 'built', desc: 'Contact mimicplus about a delivery.' },
      { title: 'HAR to OpenAPI', url: 'https://forgingstack.com/har-to-openapi/', status: 'built', desc: 'Convert a HAR to OpenAPI.' },
      { title: 'Breaking-change check', url: 'https://forgingstack.com/api-diff/', status: 'built', desc: 'API breaking-change check from a HAR.' },
      { title: 'How to use it', url: 'https://forgingstack.com/how-to/', status: 'built', desc: 'How to use mimicplus, in plain English.' },
      { title: 'For the programmer', url: 'https://forgingstack.com/technical/', status: 'built', desc: 'What the programmer gets.' }
    ] },
    { group: 'products', title: 'Contract', url: 'https://forgingstack.com/gate/', status: 'built', desc: 'Contract Gate, its own website. Prominent link from mimicplus. Lives at /gate/ today.', children: [
      { title: 'What goes in', url: 'https://forgingstack.com/gate/what-it-does/', status: 'built', desc: 'What Contract Gate takes, and what it returns.' },
      { title: 'How to use it', url: 'https://forgingstack.com/gate/how-to/', status: 'built', desc: 'How to use Contract Gate, in plain English.' },
      { title: 'For the programmer', url: 'https://forgingstack.com/gate/technical/', status: 'built', desc: 'Approved spec, later HAR, one waiver.' }
    ] },
    { group: 'products', title: 'Avcal-Agent', url: 'https://forgingstack.com/avcal-agent/', status: 'built', desc: 'Sandboxed hidden-suite verification for agent-written code. Live at /avcal-agent/.' },
    { group: 'products', title: 'harwatch', url: 'https://forgingstack.com/harwatch/', status: 'built', desc: 'Freeze an API, fail when a field is removed. $29 a month. Live in this repo.' },
    { group: 'products', title: 'EvidenceForge', url: 'https://forgingstack.com/evidenceforge/', status: 'built', desc: 'EvidenceForge, its own website. Auditable, evidence-citing AI agents. Live at /evidenceforge/.' },
    { group: 'products', title: 'Products', url: 'https://forgingstack.com/products/', status: 'built', desc: 'Actual products only. Overture $29, Jobs $19, SEC $49. CSV plus delivery receipt.' },
    { group: 'products', title: 'Verity', url: 'https://forgingstack.com/verity/', status: 'coming_soon', desc: 'Verity, evidence ledger for agent runs. Site exists in its repo (docs/index.html) and needs work; not yet live on this domain. Coming Soon.' },
    { group: 'products', title: 'Governed Agent Engine', url: 'https://forgingstack.com/governed-agent-engine/', status: 'built', desc: 'Governed Agent Engine, its own website. Live at /governed-agent-engine/.' }
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
    // Absolute https URLs (tethered forgingstack.com targets) pass through unchanged.
    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) return url;
    // AG-root-relative URLs ("blog/...", "index.html") resolve against the
    // per-page data-tether-base ("./" on index, "../" one level down).
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
        // Removed: plain text + "Removed" underneath. NO <a>,
        // not clickable, aria-disabled so assistive tech says it is not a link.
        if (s.status === 'removed') {
          li.className = 'gt-tether-coming';
          var title = document.createElement('strong');
          title.className = 'gt-tether-coming-title';
          title.textContent = s.title;
          var removed = document.createElement('span');
          removed.className = 'gt-tether-coming-soon';
          removed.textContent = 'Removed';
          var rdesc = document.createElement('span');
          rdesc.textContent = s.desc;
          li.setAttribute('aria-disabled', 'true');
          li.appendChild(title);
          li.appendChild(removed);
          li.appendChild(rdesc);
          ul.appendChild(li);
          return;
        }
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
            // Removed: plain text + "Removed" underneath. NO <a>.
            if (c.status === 'removed') {
              cli.className = 'gt-tether-subpage gt-tether-coming';
              var rtitle = document.createElement('strong');
              rtitle.className = 'gt-tether-coming-title';
              rtitle.textContent = c.title;
              var rmark = document.createElement('span');
              rmark.className = 'gt-tether-coming-soon';
              rmark.textContent = 'Removed';
              var rrdesc = document.createElement('span');
              rrdesc.textContent = c.desc;
              cli.setAttribute('aria-disabled', 'true');
              cli.appendChild(rtitle);
              cli.appendChild(rmark);
              cli.appendChild(rrdesc);
              sub.appendChild(cli);
              return;
            }
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

