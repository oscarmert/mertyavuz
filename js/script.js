/* ==========================================================================
   Mert Yavuz — Portfolyo — genel site davranışları
   (dil değişimi, mobil menü, proje kartlarının çizilmesi)
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Kullanıcı hareket azaltmayı tercih ediyor mu? --------------------- */

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---- Hero terminal — daktilo efekti --------------------------------- */

  var TERMINAL_LINES = {
    tr: [
      { type: "prompt", text: "$ whoami" },
      { type: "output", text: "mert_yavuz — network & yazılım" },
      { type: "prompt", text: "$ cat ilgi_alanlarim.txt" },
      { type: "output", text: "> yapay zekâ & LLM'ler" },
      { type: "output", text: "> otomasyon & IoT" },
      { type: "output", text: "> oyun geliştirme (Unity)" },
      { type: "output", text: "> ağ güvenliği" },
      { type: "prompt", text: "$ status" },
      { type: "output", text: "yeni fikirlere açık ✓" }
    ],
    en: [
      { type: "prompt", text: "$ whoami" },
      { type: "output", text: "mert_yavuz — network & software" },
      { type: "prompt", text: "$ cat interests.txt" },
      { type: "output", text: "> AI & LLMs" },
      { type: "output", text: "> automation & IoT" },
      { type: "output", text: "> game dev (Unity)" },
      { type: "output", text: "> network security" },
      { type: "prompt", text: "$ status" },
      { type: "output", text: "open to new ideas ✓" }
    ]
  };

  var terminalTimer = null;
  var terminalRunId = 0;

  function typeTerminal(lang) {
    var el = document.getElementById("terminal-body");
    if (!el) return;
    var lines = TERMINAL_LINES[lang] || TERMINAL_LINES.tr;

    clearTimeout(terminalTimer);
    terminalRunId++;
    var runId = terminalRunId;
    el.innerHTML = "";

    if (prefersReducedMotion()) {
      lines.forEach(function (line) {
        var div = document.createElement("div");
        div.className = "term-line term-" + line.type;
        div.textContent = line.text;
        el.appendChild(div);
      });
      return;
    }

    var lineIndex = 0;
    var charIndex = 0;
    var currentLine = null;

    function typeChar() {
      if (runId !== terminalRunId) return; // dil değişti, bu çalıştırma iptal
      if (lineIndex >= lines.length) {
        var cursor = document.createElement("span");
        cursor.className = "terminal-cursor";
        el.appendChild(cursor);
        return;
      }
      var line = lines[lineIndex];
      if (charIndex === 0) {
        currentLine = document.createElement("div");
        currentLine.className = "term-line term-" + line.type;
        el.appendChild(currentLine);
      }
      charIndex++;
      currentLine.textContent = line.text.slice(0, charIndex);

      if (charIndex >= line.text.length) {
        lineIndex++;
        charIndex = 0;
        terminalTimer = setTimeout(typeChar, line.type === "prompt" ? 320 : 260);
      } else {
        terminalTimer = setTimeout(typeChar, line.type === "prompt" ? 34 : 16);
      }
    }

    typeChar();
  }

  /* ---- Dil (TR / EN) --------------------------------------------------- */

  var body = document.body;
  var langToggle = document.getElementById("lang-toggle");
  var STORAGE_KEY = "mertyavuz-lang";

  function applyLang(lang) {
    if (lang === "en") {
      body.classList.add("lang-mode-en");
      document.documentElement.setAttribute("lang", "en");
    } else {
      body.classList.remove("lang-mode-en");
      document.documentElement.setAttribute("lang", "tr");
    }
    renderProjects(lang);
    typeTerminal(lang);
  }

  function getSavedLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage kullanılamıyorsa sessizce yoksay */
    }
  }

  var initialLang = getSavedLang() || "tr";
  applyLang(initialLang);

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var next = body.classList.contains("lang-mode-en") ? "tr" : "en";
      applyLang(next);
      saveLang(next);
    });
  }

  /* ---- Mobil menü --------------------------------------------------- */

  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Footer yılı --------------------------------------------------- */

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Projeler --------------------------------------------------- */

  function renderProjects(lang) {
    var grid = document.getElementById("projects-grid");
    var empty = document.getElementById("projects-empty");
    if (!grid || !empty) return;

    var list = typeof projects !== "undefined" ? projects : [];

    if (!list.length) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    grid.innerHTML = list
      .map(function (p) {
        var title = lang === "en" ? (p.title_en || p.title_tr || "") : (p.title_tr || p.title_en || "");
        var desc = lang === "en" ? (p.description_en || p.description_tr || "") : (p.description_tr || p.description_en || "");
        var tags = (p.tags || [])
          .map(function (t) { return '<span class="tag">' + escapeHtml(t) + "</span>"; })
          .join("");
        var media = p.image
          ? '<div class="project-card-media"><img src="' + escapeAttr(p.image) + '" alt="' + escapeAttr(title) + '" loading="lazy"></div>'
          : "";
        var links = "";
        if (p.link) {
          links += '<a href="' + escapeAttr(p.link) + '" target="_blank" rel="noopener">' + (lang === "en" ? "Live ↗" : "Canlı ↗") + "</a>";
        }
        if (p.github) {
          links += '<a href="' + escapeAttr(p.github) + '" target="_blank" rel="noopener">GitHub ↗</a>';
        }

        return (
          '<article class="project-card reveal">' +
            media +
            '<div class="project-card-body">' +
              '<div class="project-card-head">' +
                "<h3>" + escapeHtml(title) + "</h3>" +
                (p.date ? '<span class="project-card-date">' + escapeHtml(p.date) + "</span>" : "") +
              "</div>" +
              '<p class="project-desc">' + escapeHtml(desc) + "</p>" +
              (tags ? '<div class="tags">' + tags + "</div>" : "") +
              (links ? '<div class="project-card-links">' + links + "</div>" : "") +
            "</div>" +
          "</article>"
        );
      })
      .join("");

    observeReveals();
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }

  // İlk yükleme (applyLang zaten çağırıyor, ama projects-data.js script'i
  // index.html'de script.js'den ÖNCE yüklendiği için burada tekrar güvence altına alalım)
  renderProjects(body.classList.contains("lang-mode-en") ? "en" : "tr");

  /* ---- Hero canvas — ağ (network) animasyonu --------------------------- */

  function initHeroCanvas() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || !canvas.getContext || prefersReducedMotion()) return;

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, nodes = [], raf = null;
    var MAX_DIST = 140;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNodes() {
      var count = w < 720 ? 22 : 46;
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.strokeStyle = "rgba(0, 255, 106, " + (0.18 * (1 - dist / MAX_DIST)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
          }
        }
      }

      for (var j = 0; j < nodes.length; j++) {
        ctx.fillStyle = "rgba(0, 255, 106, 0.65)";
        ctx.beginPath();
        ctx.arc(nodes[j].x, nodes[j].y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    resize();
    makeNodes();
    raf = requestAnimationFrame(step);

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        makeNodes();
      }, 200);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        raf = requestAnimationFrame(step);
      }
    });
  }

  /* ---- Scroll'da belirme (reveal) --------------------------------- */

  var revealObserver = null;

  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("in-view");
      });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }
    document.querySelectorAll(".reveal:not(.in-view)").forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---- Nav scrollspy --------------------------------- */

  function initScrollspy() {
    var links = document.querySelectorAll("[data-nav-link]");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (a) {
      var id = (a.getAttribute("href") || "").replace("#", "");
      var sec = id && document.getElementById(id);
      if (sec) map[id] = a;
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = map[entry.target.id];
          if (link && entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("active"); });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    Object.keys(map).forEach(function (id) {
      io.observe(document.getElementById(id));
    });
  }

  /* ---- Yukarı çık butonu --------------------------------- */

  function initScrollTop() {
    var btn = document.getElementById("scroll-top-btn");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > window.innerHeight * 0.6) btn.classList.add("visible");
        else btn.classList.remove("visible");
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
  }

  initHeroCanvas();
  observeReveals();
  initScrollspy();
  initScrollTop();
})();
