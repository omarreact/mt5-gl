
/* Original Bitrader scroll reveals, implemented without Next.js/AOS dependencies.
   In non-JS and reduced-motion modes, CSS keeps the complete page readable. */
(function(){
 function initializeSourceReveals(){
   const nodes=Array.from(document.querySelectorAll('[data-aos]'));
   if(!nodes.length)return;
   const reveal=el=>el.classList.add('aos-animate');
   const revealAll=()=>nodes.forEach(reveal);
   try{
     if(!('IntersectionObserver' in window) ||
        (typeof matchMedia==='function' && matchMedia('(prefers-reduced-motion: reduce)').matches)){
       revealAll();return;
     }
     const visible=el=>{
       const rect=el.getBoundingClientRect();
       return rect.top < window.innerHeight*0.96 && rect.bottom > 0;
     };
     const observer=new IntersectionObserver(entries=>{
       entries.forEach(entry=>{
         if(entry.isIntersecting){reveal(entry.target);observer.unobserve(entry.target);}
       });
     },{rootMargin:'0px 0px 10% 0px',threshold:0.01});
     nodes.forEach(el=>{if(visible(el))reveal(el);else observer.observe(el);});
     document.documentElement.classList.add('mgl-aos-active');
   }catch(error){
     document.documentElement.classList.remove('mgl-aos-active');
     revealAll();
   }
 }
 if(document.readyState==='loading'){
   document.addEventListener('DOMContentLoaded',initializeSourceReveals,{once:true});
 }else initializeSourceReveals();
})();


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
  let saved = null; try { saved = localStorage.getItem("mgl-theme"); } catch (error) {}
  root.dataset.bsTheme = saved === "dark" ? "dark" : "light";
  const theme = document.createElement("button");
  theme.className = "mgl-theme-toggle";
  theme.type = "button";
  theme.setAttribute("aria-label", "Toggle dark and light theme");
  const sync = () => { theme.textContent = root.dataset.bsTheme === "dark" ? "☀" : "☾"; };
  sync();
  theme.addEventListener("click", () => {
    root.dataset.bsTheme = root.dataset.bsTheme === "dark" ? "light" : "dark";
    try { localStorage.setItem("mgl-theme", root.dataset.bsTheme); } catch (error) {}
    sync();
  });
  document.body.append(theme);


})();

document.querySelectorAll('form').forEach(form => form.addEventListener('submit', event => event.preventDefault()));
