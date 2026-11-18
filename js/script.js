/* MetaGreyLabel global browser JavaScript.
   One readable file for theme, navigation, slider and progressive reveal behavior. */

(function bootstrapTheme() {
  var root = document.documentElement;
  var theme = "light";

  try {
    if (localStorage.getItem("mgl-theme") === "dark") theme = "dark";
  } catch (_) {}

  root.setAttribute("data-bs-theme", theme);
})();

(function initializeThemeControls() {
  function init() {
    var root = document.documentElement;
    var buttons = Array.from(document.querySelectorAll("[data-mgl-theme-toggle]"));

    function applyTheme(value, persist) {
      var dark = value === "dark";
      root.setAttribute("data-bs-theme", dark ? "dark" : "light");

      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(dark));
        button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        button.title = button.getAttribute("aria-label");

        var icon = button.querySelector("[aria-hidden='true']");
        if (icon) icon.textContent = dark ? "☀" : "☾";
      });

      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = dark ? "#091b1a" : "#f4fffb";

      if (persist) {
        try {
          localStorage.setItem("mgl-theme", dark ? "dark" : "light");
        } catch (_) {}
      }
    }

    applyTheme(root.getAttribute("data-bs-theme") === "dark" ? "dark" : "light", false);

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyTheme(root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark", true);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

(function initializeScrollReveals() {
  function init() {
    var nodes = Array.from(document.querySelectorAll("[data-aos]"));
    if (!nodes.length) return;

    function reveal(node) {
      node.classList.add("aos-animate");
    }

    function revealAll() {
      nodes.forEach(reveal);
    }

    try {
      var reducedMotion = typeof matchMedia === "function" &&
        matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!("IntersectionObserver" in window) || reducedMotion) {
        revealAll();
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      }, {
        rootMargin: "0px 0px 10% 0px",
        threshold: 0.01
      });

      nodes.forEach(function (node) {
        var rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) reveal(node);
        else observer.observe(node);
      });

      document.documentElement.classList.add("mgl-aos-active");
    } catch (_) {
      document.documentElement.classList.remove("mgl-aos-active");
      revealAll();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

(function initializeGlobalNavigation() {
  function init() {
    var header = document.querySelector(".header-section");
    if (!header) return;

    var menu = header.querySelector("#menu");
    var toggle = header.querySelector(".header-bar");
    var parents = Array.from(header.querySelectorAll(".menu-item-has-children"));
    var desktopHover = typeof matchMedia === "function"
      ? matchMedia("(min-width: 992px) and (hover: hover) and (pointer: fine)")
      : null;

    function isMobile() {
      return !desktopHover || !desktopHover.matches;
    }

    function closeSubmenus(except) {
      parents.forEach(function (item) {
        if (item === except) return;

        item.classList.remove("open");
        var trigger = item.querySelector(":scope > a, :scope > button");
        var submenu = item.querySelector(":scope > .submenu");

        if (trigger) trigger.setAttribute("aria-expanded", "false");
        if (submenu) submenu.style.display = "";
      });
    }

    function closeMenu() {
      if (menu) menu.classList.remove("active", "mgl-open");

      if (toggle) {
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
      }

      closeSubmenus();
    }

    function syncStickyHeader() {
      var sticky = window.scrollY >= 120;
      header.classList.toggle("header-fixed", sticky);
      header.classList.toggle("fadeInUp", sticky);
    }

    syncStickyHeader();
    window.addEventListener("scroll", syncStickyHeader, { passive: true });

    if (toggle) {
      toggle.addEventListener("click", function () {
        var opening = !(menu && menu.classList.contains("active"));

        if (menu) {
          menu.classList.toggle("active", opening);
          menu.classList.toggle("mgl-open", opening);
        }

        toggle.classList.toggle("active", opening);
        toggle.setAttribute("aria-expanded", String(opening));
        toggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");

        if (!opening) closeSubmenus();
      });
    }

    parents.forEach(function (item) {
      var trigger = item.querySelector(":scope > a, :scope > button");
      var submenu = item.querySelector(":scope > .submenu");
      if (!trigger || !submenu) return;

      item.addEventListener("pointerenter", function (event) {
        if (!isMobile() && event.pointerType !== "touch") {
          closeSubmenus(item);
          item.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });

      item.addEventListener("pointerleave", function (event) {
        if (!isMobile() && event.pointerType !== "touch") {
          item.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
        }
      });

      item.addEventListener("focusin", function () {
        if (!isMobile()) {
          closeSubmenus(item);
          item.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });

      item.addEventListener("focusout", function (event) {
        if (!isMobile() && !item.contains(event.relatedTarget)) {
          item.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
        }
      });

      trigger.addEventListener("click", function (event) {
        if (!isMobile()) return;

        event.preventDefault();
        var opening = !item.classList.contains("open");
        closeSubmenus(item);
        item.classList.toggle("open", opening);
        trigger.setAttribute("aria-expanded", String(opening));
        submenu.style.display = opening ? "block" : "";
      });
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      closeMenu();
      if (toggle && isMobile()) toggle.focus();
    });

    window.addEventListener("resize", function () {
      if (!isMobile()) closeMenu();
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

(function initializeHeroCarousel() {
  function init() {
    var root = document.querySelector("[data-mgl-slider]");
    if (!root) return;

    var slides = Array.from(root.querySelectorAll("[data-mgl-slide]"));
    var dots = Array.from(root.querySelectorAll("[data-mgl-dot]"));
    var previous = root.querySelector("[data-mgl-prev]");
    var next = root.querySelector("[data-mgl-next]");
    var pause = root.querySelector("[data-mgl-pause]");
    var count = root.querySelector("[data-mgl-count]");

    if (slides.length < 2) return;

    var reducedMotion = typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    var paused = reducedMotion;
    var index = 0;
    var timer = null;
    var touchStart = null;

    function updatePauseControl() {
      if (!pause) return;

      pause.setAttribute("aria-pressed", String(paused));
      pause.setAttribute("aria-label", paused ? "Resume automatic rotation" : "Pause automatic rotation");
      pause.innerHTML = paused ? "▶ <span>Play</span>" : "Ⅱ <span>Pause</span>";
    }

    function shouldHold() {
      return paused || document.hidden || root.matches(":hover") || root.matches(":focus-within");
    }

    function schedule() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }

      if (shouldHold()) return;
      timer = window.setTimeout(function () {
        show(index + 1);
      }, 6500);
    }

    function setFocusableState(slide, active) {
      slide.setAttribute("aria-hidden", String(!active));

      if (active) {
        slide.removeAttribute("inert");
      } else {
        slide.setAttribute("inert", "");
      }
    }

    function show(target) {
      index = (target + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === index;
        slide.classList.toggle("is-active", active);
        setFocusableState(slide, active);
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
        updatePauseControl();
        schedule();
      });
    }

    root.addEventListener("keydown", function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(index + 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(index - 1);
      }
    });

    root.addEventListener("touchstart", function (event) {
      if (event.touches && event.touches.length === 1) {
        touchStart = [event.touches[0].clientX, event.touches[0].clientY];
      }
    }, { passive: true });

    root.addEventListener("touchend", function (event) {
      if (!touchStart || !event.changedTouches || !event.changedTouches.length) return;

      var deltaX = event.changedTouches[0].clientX - touchStart[0];
      var deltaY = event.changedTouches[0].clientY - touchStart[1];
      touchStart = null;

      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        show(index + (deltaX < 0 ? 1 : -1));
      }
    }, { passive: true });

    root.addEventListener("mouseenter", schedule);
    root.addEventListener("mouseleave", schedule);
    root.addEventListener("focusin", schedule);
    root.addEventListener("focusout", function () { window.setTimeout(schedule, 0); });
    document.addEventListener("visibilitychange", schedule);

    updatePauseControl();
    show(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
