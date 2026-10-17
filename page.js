// Mimicplus home page script, extracted from index.html (CSP Option A).
// Fail-closed: no client-side key verification, no hashes, no verifier.
// Key verification is server-side and pending backend. This script never
// unhides the finished-delivery sample (#finished stays hidden).
// The LINES playback below is a transcript of a past delivery run, not a live check.
const SCREEN = document.getElementById("screen");
const LINES = [
  ["$", " paste key"],
  ["vip", " mp1.paid-••••••••.••••••••••••••••••••••••"],
  ["", " VIP recognized. Paid key accepted."],
  ["$", " mimicplus learn session.har -o spec.json"],
  ["", " 127.0.0.1  mode=auth  base=http://127.0.0.1:8765"],
  ["", " 17 flows -> 15 API calls (2 noise: html-document=1, static=1)"],
  ["", " auth headers (names only, values never stored): authorization"],
  ["", " POST   /api/auth/login            -> login(username, password)"],
  ["", " GET    /api/me                    -> get_me()"],
  ["", " GET    /api/products              -> list_products(page, per_page)"],
  ["", " GET    /api/products/{product_id} -> get_product(product_id)"],
  ["", " POST   /api/cart/items            -> create_item(product_id, qty)"],
  ["", " POST   /graphql                   -> search_products(q, first)"],
  ["", " POST   /graphql                   -> get_order(id)"],
  ["", " POST   /graphql                   -> add_review(productId, rating, text)"],
  ["", " POST   /api/auth/refresh          -> refresh(refresh_token)"],
  ["", " wrote spec.json"],
  ["$", " mimicplus gen spec.json -o acme_client.py --flavor both --tests --mcp --openapi openapi.json"],
  ["", " wrote acme_client.py"],
  ["", " wrote acme_client_async.py"],
  ["", " wrote openapi.json"],
  ["", " wrote test_acme_client.py"],
  ["", " wrote acme_client_mcp.py"],
  ["$", " mimicplus diff acme_v1.har acme_v2.har --fail-on-breaking"],
  ["bad", " 4 breaking, 3 non-breaking (9 -> 8 endpoints)"],
  ["bad", " endpoint-removed  GET /api/me"],
  ["bad", " response-removed  items[].price"],
  ["bad", " response-removed  product.price"],
  ["bad", " response-removed  order.total"],
  ["ok", " response-added    items[].price_cents"],
  ["ok", " response-added    order.grandTotal"],
  ["", " exit 1 — the gate stops the build"]
];
let timer;
function play() {
  clearInterval(timer);
  SCREEN.textContent = "";
  let i = 0;
  timer = setInterval(() => {
    if (i >= LINES.length) {
      clearInterval(timer);
      SCREEN.insertAdjacentHTML("beforeend", '<span class="caret"></span>');
      return;
    }
    const [kind, text] = LINES[i++];
    const row = document.createElement("div");
    if (kind === "$") row.innerHTML = '<span class="dim">$</span>' + text;
    else if (kind === "vip") row.innerHTML = '<span class="dim">vip</span>' + text;
    else if (kind === "bad") row.innerHTML = '<span class="bad">' + text + "</span>";
    else if (kind === "ok") row.innerHTML = '<span class="ok">' + text + "</span>";
    else row.textContent = text;
    SCREEN.appendChild(row);
    SCREEN.parentElement.scrollTop = SCREEN.parentElement.scrollHeight;
  }, 280);
}
play();
document.getElementById("replay").addEventListener("click", play);
addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  document.getElementById("progress").style.width = (h ? scrollY / h * 100 : 0) + "%";
});
const form = document.querySelector(".buyer");
const status = document.getElementById("vipStatus");
if (form) {
  form.addEventListener("submit", (event) => {
    const key = document.getElementById("vip").value.trim();
    // Shape check only: this grants nothing and unlocks nothing. Key
    // verification is server-side and pending backend; this page never
    // unhides the finished-delivery sample (#finished stays hidden).
    if (!/^mp1\.[A-Za-z0-9_-]+\.[a-f0-9]{24}$/.test(key)) {
      event.preventDefault();
      if (status) status.textContent = "That key does not look like a paid key (mp1.\u2026). Check the key from the receipt email.";
      return;
    }
    if (status) status.textContent = "Sending the delivery request by email. Verification is server-side and pending backend; this page does not unlock delivery links.";
  });
}
