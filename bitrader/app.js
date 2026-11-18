
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


/* Source-style hover on desktop; accessible tap-and-keyboard dropdowns on mobile. */
(function(){
 function initializeGlobalNavigation(){
  var header=document.querySelector('.mgl-site-header');
  if(!header)return;
  var toggle=header.querySelector('.mgl-nav-toggle');
  var groups=Array.from(header.querySelectorAll('.mgl-nav-group'));
  var media=typeof window.matchMedia==='function'?window.matchMedia('(min-width:971px) and (hover:hover) and (pointer:fine)'):null;
  var isHover=function(){return !!(media&&media.matches)};
  function closeAll(except){groups.forEach(function(g){if(g!==except)g.open=false})}
  function hideMobile(){header.classList.remove('mgl-nav-open');if(toggle)toggle.setAttribute('aria-expanded','false')}
  if(toggle)toggle.addEventListener('click',function(){
   var next=!header.classList.contains('mgl-nav-open');
   header.classList.toggle('mgl-nav-open',next);
   toggle.setAttribute('aria-expanded',String(next));
   if(!next)closeAll();
  });
  groups.forEach(function(g){
   g.addEventListener('pointerenter',function(e){if(isHover()&&e.pointerType!=='touch'){closeAll(g);g.open=true}});
   g.addEventListener('pointerleave',function(e){if(isHover()&&e.pointerType!=='touch')g.open=false});
   g.addEventListener('focusin',function(){if(isHover()){closeAll(g);g.open=true}});
   g.addEventListener('focusout',function(e){if(isHover()&&!g.contains(e.relatedTarget))g.open=false});
   g.addEventListener('toggle',function(){if(g.open)closeAll(g)});
  });
  document.addEventListener('click',function(e){if(!header.contains(e.target)){closeAll();hideMobile()}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll();hideMobile();if(toggle&&window.innerWidth<=970)toggle.focus()}});
  window.addEventListener('resize',function(){if(window.innerWidth>970&&header.classList.contains('mgl-nav-open'))hideMobile()},{passive:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeGlobalNavigation,{once:true});
 else initializeGlobalNavigation();
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
