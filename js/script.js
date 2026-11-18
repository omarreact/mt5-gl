/* MetaGreyLabel browser runtime
   Theme, responsive navigation, accessible carousel and non-blocking reveal effects. */

(function bootstrapTheme() {
  var root = document.documentElement;
  var theme = "light";

  try {
    var stored = localStorage.getItem("mgl-theme");
    if (stored === "dark" || stored === "light") {
      theme = stored;
    }
  } catch (_) {}

  root.setAttribute("data-bs-theme", theme);
})();

(function initializeMetaGreyLabel() {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  ready(function () {
    initializeTheme();
    initializeNavigation();
    initializeCarousel();
    initializeReveals();
  });

  function initializeTheme() {
    var root = document.documentElement;
    var buttons = Array.from(document.querySelectorAll("[data-mgl-theme-toggle]"));

    function applyTheme(nextTheme, persist) {
      var dark = nextTheme === "dark";
      root.setAttribute("data-bs-theme", dark ? "dark" : "light");

      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(dark));
        button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        button.title = button.getAttribute("aria-label");

        var icon = button.querySelector("[data-mgl-theme-icon]");
        if (icon) icon.textContent = dark ? "☀" : "☾";
      });

      var themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.content = dark ? "#061310" : "#f7faf9";

      if (persist) {
        try {
          localStorage.setItem("mgl-theme", dark ? "dark" : "light");
        } catch (_) {}
      }
    }

    applyTheme(root.getAttribute("data-bs-theme") === "dark" ? "dark" : "light", false);

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        applyTheme(next, true);
      });
    });
  }

  function initializeNavigation() {
    var header = document.querySelector(".mgl-global-header");
    if (!header) return;

    var nav = header.querySelector("[data-mgl-nav]");
    var toggle = header.querySelector("[data-mgl-nav-toggle]");
    var items = Array.from(header.querySelectorAll(".mgl-nav-item"));
    var desktopQuery = typeof matchMedia === "function"
      ? matchMedia("(min-width: 901px)")
      : null;

    function isDesktop() {
      return desktopQuery ? desktopQuery.matches : window.innerWidth >= 901;
    }

    function closeItem(item) {
      if (!item) return;
      item.classList.remove("is-open");
      var trigger = item.querySelector(":scope > [data-mgl-nav-trigger]");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    }

    function closeItems(except) {
      items.forEach(function (item) {
        if (item !== except) closeItem(item);
      });
    }

    function closeNav(restoreFocus) {
      if (nav) nav.classList.remove("is-open");
      document.body.classList.remove("mgl-nav-locked");

      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
      }

      closeItems();

      if (restoreFocus && toggle && !isDesktop()) {
        toggle.focus();
      }
    }

    function openNav() {
      if (!nav || !toggle) return;
      nav.classList.add("is-open");
      document.body.classList.add("mgl-nav-locked");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation");
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        if (nav && nav.classList.contains("is-open")) closeNav(false);
        else openNav();
      });
    }

    items.forEach(function (item) {
      var trigger = item.querySelector(":scope > [data-mgl-nav-trigger]");
      if (!trigger) return;

      trigger.addEventListener("click", function () {
        var opening = !item.classList.contains("is-open");
        closeItems(item);
        item.classList.toggle("is-open", opening);
        trigger.setAttribute("aria-expanded", String(opening));
      });

      item.addEventListener("pointerenter", function (event) {
        if (!isDesktop() || event.pointerType === "touch") return;
        closeItems(item);
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      });

      item.addEventListener("pointerleave", function (event) {
        if (!isDesktop() || event.pointerType === "touch") return;
        closeItem(item);
      });

      item.addEventListener("focusin", function () {
        if (!isDesktop()) return;
        closeItems(item);
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      });

      item.addEventListener("focusout", function (event) {
        if (isDesktop() && !item.contains(event.relatedTarget)) {
          closeItem(item);
        }
      });
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) closeNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav(true);
    });

    if (desktopQuery && typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", function () {
        closeNav(false);
      });
    } else {
      window.addEventListener("resize", function () {
        if (window.innerWidth >= 901) closeNav(false);
      }, { passive: true });
    }
  }

  function initializeCarousel() {
    var root = document.querySelector("[data-mgl-slider]");
    if (!root) return;

    var slides = Array.from(root.querySelectorAll("[data-mgl-slide]"));
    var dots = Array.from(root.querySelectorAll("[data-mgl-dot]"));
    var previous = root.querySelector("[data-mgl-prev]");
    var next = root.querySelector("[data-mgl-next]");
    var pause = root.querySelector("[data-mgl-pause]");
    var count = root.querySelector("[data-mgl-count]");
    var reducedMotion = typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (slides.length < 2) return;

    var index = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    }));
    var paused = reducedMotion;
    var timer = null;
    var touchStart = null;

    function updatePause() {
      if (!pause) return;
      pause.setAttribute("aria-pressed", String(paused));
      pause.setAttribute("aria-label", paused ? "Resume automatic rotation" : "Pause automatic rotation");
      pause.innerHTML = paused
        ? '▶ <span>Play</span>'
        : 'Ⅱ <span>Pause</span>';
    }

    function shouldHold() {
      return paused || document.hidden || root.matches(":hover") || root.matches(":focus-within");
    }

    function schedule() {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }

      if (shouldHold()) return;

      timer = window.setTimeout(function () {
        show(index + 1);
      }, 6500);
    }

    function show(target) {
      index = (target + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));

        if (active) slide.removeAttribute("inert");
        else slide.setAttribute("inert", "");
      });

      dots.forEach(function (dot, dotIndex) {
        var active = dotIndex === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });

      if (count) count.textContent = String(index + 1).padStart(2, "0");
      schedule();
    }

    if (previous) previous.addEventListener("click", function () { show(index - 1); });
    if (next) next.addEventListener("click", function () { show(index + 1); });

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () { show(dotIndex); });
    });

    if (pause) {
      pause.addEventListener("click", function () {
        paused = !paused;
        updatePause();
        schedule();
      });
    }

    root.addEventListener("keydown", function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(index + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(index - 1);
      }
    });

    root.addEventListener("touchstart", function (event) {
      if (!event.touches || event.touches.length !== 1) return;
      touchStart = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }, { passive: true });

    root.addEventListener("touchend", function (event) {
      if (!touchStart || !event.changedTouches || !event.changedTouches.length) return;

      var dx = event.changedTouches[0].clientX - touchStart.x;
      var dy = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;

      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        show(index + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });

    root.addEventListener("mouseenter", schedule);
    root.addEventListener("mouseleave", schedule);
    root.addEventListener("focusin", schedule);
    root.addEventListener("focusout", function () {
      window.setTimeout(schedule, 0);
    });
    document.addEventListener("visibilitychange", schedule);

    updatePause();
    show(index);
  }

  function initializeReveals() {
    var nodes = Array.from(document.querySelectorAll("[data-aos]"));
    if (!nodes.length) return;

    var reducedMotion = typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("mgl-reveal");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -4% 0px",
      threshold: 0.08
    });

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }
})();
