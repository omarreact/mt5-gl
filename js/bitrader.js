
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

document.querySelectorAll('form').forEach(form => form.addEventListener('submit', event => event.preventDefault()));


/* Theme-aware hero carousel: no extra dependencies */
(function(){
 function init(){
  var html=document.documentElement,buttons=Array.from(document.querySelectorAll('[data-mgl-theme-toggle]'));
  var saved='light';
  try{if(localStorage.getItem('mgl-theme')==='dark')saved='dark'}catch(_){}
  function theme(value,persist){
   var dark=value==='dark';
   html.setAttribute('data-bs-theme',dark?'dark':'light');
   buttons.forEach(function(b){b.setAttribute('aria-pressed',String(dark));b.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');b.title=b.getAttribute('aria-label');b.textContent=dark?'☀':'☾'});
   var meta=document.querySelector('meta[name="theme-color"]');
   if(meta)meta.content=dark?'#091b1a':'#f4fffb';
   if(persist){try{localStorage.setItem('mgl-theme',dark?'dark':'light')}catch(_){}}
  }
  theme(saved,false);
  buttons.forEach(function(b){b.addEventListener('click',function(){theme(html.getAttribute('data-bs-theme')==='dark'?'light':'dark',true)})});
  var root=document.querySelector('[data-mgl-slider]');
  if(!root)return;
  var slides=Array.from(root.querySelectorAll('[data-mgl-slide]')),dots=Array.from(root.querySelectorAll('[data-mgl-dot]'));
  var prev=root.querySelector('[data-mgl-prev]'),next=root.querySelector('[data-mgl-next]'),pause=root.querySelector('[data-mgl-pause]'),count=root.querySelector('[data-mgl-count]');
  var motion=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stopped=motion,index=0,timer=null,touch=null;
  if(slides.length<2)return;
  function refreshPause(){if(!pause)return;pause.setAttribute('aria-pressed',String(stopped));pause.setAttribute('aria-label',stopped?'Resume automatic rotation':'Pause automatic rotation');pause.innerHTML=stopped?'▶ <span>Play</span>':'Ⅱ <span>Pause</span>'}
  function schedule(){if(timer!==null){clearTimeout(timer);timer=null}if(stopped||document.hidden||root.matches(':hover')||root.matches(':focus-within'))return;timer=setTimeout(function(){show(index+1)},6500)}
  function show(target){
   index=(target+slides.length)%slides.length;
   slides.forEach(function(slide,i){var active=i===index;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active));if(active)slide.removeAttribute('inert');else slide.setAttribute('inert','')});
   dots.forEach(function(dot,i){var active=i===index;dot.classList.toggle('is-active',active);dot.setAttribute('aria-current',String(active))});
   if(count)count.textContent=String(index+1).padStart(2,'0');
   schedule();
  }
  if(prev)prev.addEventListener('click',function(){show(index-1)});
  if(next)next.addEventListener('click',function(){show(index+1)});
  dots.forEach(function(dot,i){dot.addEventListener('click',function(){show(i)})});
  if(pause)pause.addEventListener('click',function(){stopped=!stopped;refreshPause();schedule()});
  root.addEventListener('keydown',function(e){if(e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'){e.preventDefault();show(index+1)}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1)}});
  root.addEventListener('touchstart',function(e){if(e.touches&&e.touches.length===1)touch=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
  root.addEventListener('touchend',function(e){if(!touch||!e.changedTouches?.length)return;var dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];touch=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)show(index+(dx<0?1:-1))},{passive:true});
  root.addEventListener('mouseenter',schedule);root.addEventListener('mouseleave',schedule);root.addEventListener('focusin',schedule);root.addEventListener('focusout',function(){setTimeout(schedule,0)});
  document.addEventListener('visibilitychange',schedule);
  refreshPause();show(0);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
