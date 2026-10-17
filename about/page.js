// Page script for about/index.html, extracted verbatim from the inline <script> block (CSP Option A). No behaviour changed.
    addEventListener("scroll", () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      document.getElementById("progress").style.width = (h ? scrollY / h * 100 : 0) + "%";
    });
    document.querySelectorAll("p").forEach((node, i) => {
      node.classList.add("reveal");
      node.style.animationDelay = (0.12 + i * 0.08) + "s";
    });
  
