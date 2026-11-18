
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


/* Global Bitrader header behavior from the supplied reference: sticky header,
   mobile menu toggle, and collapsible mobile submenus. */
(function(){
 function initializeBitraderHeader(){
  var header=document.querySelector('.header-section');
  if(!header)return;
  var menu=header.querySelector('#menu');
  var bar=header.querySelector('.header-bar');
  var parents=Array.from(header.querySelectorAll('.menu-item-has-children'));
  function isMobile(){return window.innerWidth<992}
  function closeSubmenus(except){
   parents.forEach(function(item){
    if(item===except)return;
    item.classList.remove('open');
    var trigger=item.querySelector(':scope > a');
    var submenu=item.querySelector(':scope > .submenu');
    if(trigger)trigger.setAttribute('aria-expanded','false');
    if(submenu)submenu.style.display='';
   });
  }
  function closeMenu(){
   if(menu)menu.classList.remove('active','mgl-open');
   if(bar){bar.classList.remove('active');bar.setAttribute('aria-expanded','false');bar.setAttribute('aria-label','Open navigation')}
   closeSubmenus();
  }
  function syncSticky(){header.classList.toggle('header-fixed',window.scrollY>=250);header.classList.toggle('fadeInUp',window.scrollY>=250)}
  syncSticky();
  window.addEventListener('scroll',syncSticky,{passive:true});
  if(bar)bar.addEventListener('click',function(){
   var opening=!(menu&&menu.classList.contains('active'));
   if(menu)menu.classList.toggle('active',opening);
   if(menu)menu.classList.toggle('mgl-open',opening);
   bar.classList.toggle('active',opening);
   bar.setAttribute('aria-expanded',String(opening));
   bar.setAttribute('aria-label',opening?'Close navigation':'Open navigation');
   if(!opening)closeSubmenus();
  });
  if(bar)bar.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();bar.click()}});
  parents.forEach(function(item){
   var trigger=item.querySelector(':scope > a');
   var submenu=item.querySelector(':scope > .submenu');
   if(!trigger||!submenu)return;
   trigger.addEventListener('click',function(event){
    if(!isMobile())return;
    event.preventDefault();
    var opening=!item.classList.contains('open');
    closeSubmenus(item);
    item.classList.toggle('open',opening);
    trigger.setAttribute('aria-expanded',String(opening));
    submenu.style.display=opening?'block':'';
   });
  });
  document.addEventListener('click',function(event){if(isMobile()&&!header.contains(event.target))closeMenu()});
  document.addEventListener('keydown',function(event){if(event.key==='Escape'){closeMenu();if(bar)bar.focus()}});
  window.addEventListener('resize',function(){if(!isMobile())closeMenu()},{passive:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeBitraderHeader,{once:true});
 else initializeBitraderHeader();
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


/* Full-width source visual hero slider. */
(function(){
  function initializeHeroSlider(){
    var slider=document.querySelector('.mgl-hero-slider');
    if(!slider)return;
    var slides=Array.from(slider.querySelectorAll('[data-mgl-slide]'));
    var dots=Array.from(slider.querySelectorAll('[data-mgl-slider-dot]'));
    var prev=slider.querySelector('[data-mgl-slider-prev]');
    var next=slider.querySelector('[data-mgl-slider-next]');
    var progress=slider.querySelector('.mgl-hero-slider__progress span');
    if(slides.length<2)return;
    var current=0,timer=null,delay=6500,startX=null;
    var reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    function restartProgress(){
      if(!progress||reduced)return;
      progress.classList.remove('is-running');
      void progress.offsetWidth;
      progress.classList.add('is-running');
    }
    function schedule(){
      if(timer)clearTimeout(timer);
      if(reduced||document.hidden)return;
      timer=setTimeout(function(){show(current+1,false)},delay);
      restartProgress();
    }
    function show(index,userInitiated){
      current=(index+slides.length)%slides.length;
      slides.forEach(function(slide,i){
        var active=i===current;
        slide.classList.toggle('is-active',active);
        slide.setAttribute('aria-hidden',String(!active));
      });
      dots.forEach(function(dot,i){
        var active=i===current;
        dot.classList.toggle('is-active',active);
        dot.setAttribute('aria-selected',String(active));
        dot.tabIndex=active?0:-1;
      });
      schedule();
      if(userInitiated&&typeof slider.focus==='function')slider.focus({preventScroll:true});
    }
    if(prev)prev.addEventListener('click',function(){show(current-1,true)});
    if(next)next.addEventListener('click',function(){show(current+1,true)});
    dots.forEach(function(dot){dot.addEventListener('click',function(){show(Number(dot.getAttribute('data-mgl-slider-dot'))||0,true)})});
    slider.addEventListener('keydown',function(event){
      if(event.key==='ArrowLeft'){event.preventDefault();show(current-1,true)}
      if(event.key==='ArrowRight'){event.preventDefault();show(current+1,true)}
    });
    slider.addEventListener('pointerdown',function(event){if(event.isPrimary)startX=event.clientX});
    slider.addEventListener('pointerup',function(event){
      if(startX===null||!event.isPrimary)return;
      var delta=event.clientX-startX;startX=null;
      if(Math.abs(delta)>48)show(current+(delta<0?1:-1),true);
    });
    slider.addEventListener('pointercancel',function(){startX=null});
    slider.addEventListener('mouseenter',function(){if(timer)clearTimeout(timer);if(progress)progress.classList.remove('is-running')});
    slider.addEventListener('mouseleave',schedule);
    slider.addEventListener('focusin',function(){if(timer)clearTimeout(timer);if(progress)progress.classList.remove('is-running')});
    slider.addEventListener('focusout',function(event){if(!slider.contains(event.relatedTarget))schedule()});
    document.addEventListener('visibilitychange',function(){if(document.hidden){if(timer)clearTimeout(timer)}else schedule()});
    show(0,false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeHeroSlider,{once:true});
  else initializeHeroSlider();
})();
