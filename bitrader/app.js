
/* Standalone, dependency-free site navigation. */
(function(){
 function mglInit(){
  var header=document.querySelector('.mgl-site-header');
  if(!header)return;
  var toggle=header.querySelector('.mgl-nav-toggle'),panels=Array.prototype.slice.call(header.querySelectorAll('.mgl-nav-group'));
  if(toggle){toggle.addEventListener('click',function(){var next=!header.classList.contains('mgl-nav-open');header.classList.toggle('mgl-nav-open',next);toggle.setAttribute('aria-expanded',String(next));});}
  panels.forEach(function(panel){panel.addEventListener('toggle',function(){if(panel.open){panels.forEach(function(other){if(other!==panel)other.open=false;});}});});
  document.addEventListener('click',function(e){if(!header.contains(e.target)){panels.forEach(function(p){p.open=false;});header.classList.remove('mgl-nav-open');if(toggle)toggle.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){panels.forEach(function(p){p.open=false;});header.classList.remove('mgl-nav-open');if(toggle)toggle.setAttribute('aria-expanded','false');}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mglInit);else mglInit();
})();

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
