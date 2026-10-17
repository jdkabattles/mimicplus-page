// Page script for blog/index.html, extracted verbatim from the inline <script> block (CSP Option A). No behaviour changed.
    addEventListener("scroll", () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      document.getElementById("progress").style.width = (h ? scrollY / h * 100 : 0) + "%";
    });
    document.querySelectorAll("h2, p, li").forEach((node, i) => {
      node.classList.add("reveal");
      node.style.animationDelay = (0.12 + i * 0.04) + "s";
    });
  
