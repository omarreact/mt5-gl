(() => {
  document.querySelector('.preloader')?.remove();
  const root = document.documentElement;
  const saved = localStorage.getItem("mgl-theme");
  root.dataset.bsTheme = saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const theme = document.createElement("button");
  theme.className = "mgl-theme-toggle";
  theme.type = "button";
  theme.setAttribute("aria-label", "Toggle dark and light theme");
  const sync = () => { theme.textContent = root.dataset.bsTheme === "dark" ? "☀" : "☾"; };
  sync();
  theme.addEventListener("click", () => {
    root.dataset.bsTheme = root.dataset.bsTheme === "dark" ? "light" : "dark";
    localStorage.setItem("mgl-theme", root.dataset.bsTheme);
    sync();
  });
  document.body.append(theme);

  const switcher = document.createElement("nav");
  switcher.className = "mgl-design-switch";
  const current = location.pathname.split("/").pop() || "index.html";
  [["1","index.html"],["2","index-2.html"],["3","index-3.html"]].forEach(([label, href]) => {
    const link = document.createElement("a"); link.href = href; link.textContent = label;
    if (current === href) link.setAttribute("aria-current", "page");
    switcher.append(link);
  });
  document.body.append(switcher);

  const bar = document.querySelector(".header-bar");
  const menu = document.querySelector(".menu-area > .menu");
  if (bar && menu) bar.addEventListener("click", () => menu.classList.toggle("mgl-open"));
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", () => menu?.classList.remove("mgl-open")));
})();

document.querySelectorAll('form').forEach(form => form.addEventListener('submit', event => event.preventDefault()));
