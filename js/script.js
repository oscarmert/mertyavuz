/* ==========================================================================
   Mert Yavuz — Portfolyo — genel site davranışları
   (dil değişimi, mobil menü, proje kartlarının çizilmesi)
   ========================================================================== */

(function () {
  "use strict";

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
          '<article class="project-card">' +
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
})();
