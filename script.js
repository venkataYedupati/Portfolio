/* Progressive enhancement only — the page is fully readable without this file.
   - reveal-on-scroll
   - sticky topbar state
   - active nav link
   - pointer glow on cards
   - count-up for the metrics band
   - current year in the footer */

(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- current year ---- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---- reveal on scroll ---- */
  (function setupReveal() {
    var targets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    targets.forEach(function (el) {
      el.classList.add("reveal");
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* ---- sticky topbar state ---- */
  (function setupTopbar() {
    var topbar = document.querySelector(".topbar");
    if (!topbar) return;

    var update = function () {
      topbar.classList.toggle("is-scrolled", window.scrollY > 16);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  })();

  /* ---- active nav link ---- */
  (function setupActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
    var sections = links
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    if (!sections.length) return;

    var update = function () {
      var currentId = "";
      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentId = section.id;
        }
      });
      links.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  })();

  /* ---- pointer glow ---- */
  (function setupGlow() {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    var selector = ".project-card, .skill-card, .timeline-content, .contact-panel, .metric-card";
    document.addEventListener("pointermove", function (event) {
      var card = event.target instanceof Element ? event.target.closest(selector) : null;
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", event.clientX - rect.left + "px");
      card.style.setProperty("--my", event.clientY - rect.top + "px");
    });
  })();

  /* ---- count-up for the metrics band ---- */
  (function setupStats() {
    var values = Array.prototype.slice.call(document.querySelectorAll(".stat-value"));
    if (!values.length) return;

    var parse = function (raw) {
      var match = String(raw).match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return null;
      return {
        number: Number(match[1]),
        decimals: match[1].indexOf(".") > -1 ? match[1].split(".")[1].length : 0,
        suffix: match[2] || ""
      };
    };

    var format = function (value, suffix, decimals) {
      var text = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
      return text + suffix;
    };

    var animate = function (el) {
      var finalValue = el.getAttribute("data-final-value") || el.textContent || "";
      var parsed = parse(finalValue);

      if (!parsed || prefersReducedMotion) {
        el.textContent = finalValue;
        return;
      }

      var duration = 900;
      var start = performance.now();

      var tick = function (now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(parsed.number * eased, parsed.suffix, parsed.decimals);
        if (progress < 1) {
          window.requestAnimationFrame(tick);
        } else {
          el.textContent = finalValue;
        }
      };

      el.textContent = format(0, parsed.suffix, parsed.decimals);
      window.requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      values.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );

    values.forEach(function (el) {
      observer.observe(el);
    });
  })();
})();
