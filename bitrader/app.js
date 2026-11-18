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


})();

document.querySelectorAll('form').forEach(form => form.addEventListener('submit', event => event.preventDefault()));
