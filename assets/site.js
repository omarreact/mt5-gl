import * as THREE from './vendor/three.module.min.js';

const designs = {
  1:{name:'Institutional Grid',tag:'Institutional fintech',hero:'Infrastructure for modern forex brokerages.',sub:'A premium technology stack for launching, operating and scaling a brokerage.',image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80'},
  2:{name:'Broker Operating System',tag:'Interactive brokerage OS',hero:'Build your brokerage stack.',sub:'Configure the platform, operations and market infrastructure around the business you want to run.',image:'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1600&q=80'},
  3:{name:'Trading Terminal',tag:'Execution control',hero:'Your brokerage. Your infrastructure. Your control.',sub:'A terminal-inspired operating surface for MetaTrader, liquidity, CRM and risk.',image:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80'},
  4:{name:'Editorial Technology',tag:'Swiss editorial system',hero:'Everything required to operate a brokerage.',sub:'A precise, typography-led presentation of the technology and operational stack.',image:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80'},
  5:{name:'Launch Journey',tag:'Two-day launch story',hero:'From idea to live forex brokerage.',sub:'A cinematic journey through configuration, testing, infrastructure and growth.',image:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'},
  6:{name:'Infrastructure Network',tag:'Connected broker infrastructure',hero:'One connected stack. Fewer failure points.',sub:'Platform, CRM, payments, liquidity and risk connected as one infrastructure layer.',image:'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80'},
  7:{name:'Editorial Brokerage',tag:'Broker technology magazine',hero:'Build a brokerage people can actually operate.',sub:'A bold editorial homepage that separates the business model, technology and growth path.',image:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80'},
  8:{name:'Broker Terminal',tag:'Operations terminal',hero:'Launch. Route. Monitor. Scale.',sub:'A high-density technical interface for brokerage operations and execution infrastructure.',image:'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1600&q=80'},
  9:{name:'Orbital Ecosystem',tag:'Broker ecosystem',hero:'Your brokerage at the center of the stack.',sub:'An orbital product story connecting trading, operations, market infrastructure and growth.',image:'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80'},
  10:{name:'Infrastructure Blueprint',tag:'Brokerage architecture',hero:'Design the brokerage before you deploy it.',sub:'A blueprint-style homepage for planning the platform, client operations and execution layer.',image:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80'}
};

const content = {
  h1:'MetaTrader Grey Label Solutions to Launch Your Forex Brokerage in 2 Days',
  intro:[
    'Most people who want to start a brokerage don’t get stuck on the idea. They get stuck on the plumbing. Servers, platform licences, a back office that actually talks to the trading side, liquidity that holds up when the market moves. It adds up quickly, and it eats months you probably don’t have.',
    'That’s the part we take off your plate. MetaGreyLabel gives you a ready MetaTrader grey label setup, configured and branded, so your time goes into clients and compliance instead of chasing server engineers late at night.'
  ],
  sections:[
    {
      key:'provider',eyebrow:'01 / Foundation',title:'A Forex Technology Provider That Gets You Live Fast',
      paragraphs:[
        'Let’s be honest about the options. You can build the whole stack yourself, and some firms do. But a full MT5 server licence is a serious expense, and the setup can drag on for the better part of a year once hosting, integrations and testing are in the mix.',
        'A grey label sits in between. You run your own brand on a MetaTrader server that’s already set up and maintained, with your own manager access, your own groups and your own spreads. You aren’t borrowing someone else’s environment the way you would with a basic white label, and you aren’t carrying the full cost of a primary licence either.',
        'As a forex technology provider, our job is to make that middle path simple. We look after the server side. You run the business.'
      ]
    },
    {
      key:'meaning',eyebrow:'02 / Control',title:'What Grey Label Actually Means for You',
      paragraphs:['You get an MT4 or MT5 environment under your company name, plus manager and admin terminals so your dealing team stays in control. Trading conditions, symbols, leverage and client groups are yours to set. And the upfront cost is a fraction of what a full licence would ask.']
    },
    {
      key:'fit',eyebrow:'03 / Fit',title:'Who It Suits',
      paragraphs:['New brokers testing a market. Introducing brokers who’ve outgrown rebates and want their own book. Established firms opening a second brand in a new region. If you want real control but don’t want to spend a year building, it’s probably a good fit.']
    },
    {
      key:'launch',eyebrow:'04 / Timeline',title:'Launch Your Forex Brokerage in 2 Days',
      paragraphs:[
        'Yes, two days. People raise an eyebrow at that, so here’s where the time actually goes.',
        'Day one is paperwork and configuration. We collect your company details, confirm the platform (MT4, MT5 or both), then set up your server instance, groups and branding. Day two is testing and handover. Your team logs in, places test trades, checks the reports, and anything that looks off gets fixed before you go live.',
        'That timeline assumes your documents are ready and you know which markets you’re targeting. If you’re still sorting out a licence or a payment provider, things will take longer, and we’ll say so at the start rather than overpromise.',
        'The point is simple. Technology shouldn’t be the slow part. Being able to launch your forex brokerage in 2 days really comes down to having the infrastructure already built, already tested, just waiting for your logo.'
      ]
    },
    {
      key:'models',eyebrow:'05 / Model',title:'Forex White Label, Grey Label or Turnkey: Picking the Right Model',
      paragraphs:['Not every broker needs the same thing. We’d rather you pick the right model than the most expensive one.'],
      cards:[
        ['White Label','The lightest option. You operate under a larger broker’s server with your branding on top. It’s affordable and quick, but you get limited say over spreads, groups and risk settings. Good for testing the waters.'],
        ['Grey Label','More control and more independence. You get your own manager access and can shape trading conditions the way you want. This is where most growing brokers land, and it’s our core offer.'],
        ['Turnkey','Everything in one package. Platform, CRM, client portal, liquidity connections, payment integrations, website, the lot. If you’re starting from zero and want a single partner, a forex white label grey label turnkey setup saves you from juggling five vendors who all blame each other when something breaks.']
      ]
    },
    {
      key:'setup',eyebrow:'06 / Stack',title:'What Comes With Your Setup',
      paragraphs:[
        'The trading platform is only one piece. A brokerage also has to onboard clients, take deposits, manage risk and keep records for regulators. Depending on your package, your setup can include:',
        'All of it is configured to work together from the start, which matters more than most people expect. A CRM that doesn’t sync properly with your MetaTrader server will quietly cost you hours every week in manual fixes.'
      ],
      bullets:[
        'A forex CRM with KYC checks, a client portal and an IB module',
        'A liquidity bridge connected to your chosen providers',
        'Payment gateway integrations for cards, wires and crypto',
        'Risk management and reporting tools',
        'A branded website and trader’s room',
        'Plugins for copy trading and PAMM or MAM accounts'
      ]
    },
    {
      key:'partner',eyebrow:'07 / Partner',title:'Why Brokers Choose a MetaTrader Grey Label Partner Like Us',
      paragraphs:['We don’t claim to be the biggest name in this space. What we are is focused. MetaTrader infrastructure is what we do, every day, so when something goes wrong during a busy session you’re talking to people who know the platform properly.']
    },
    {
      key:'pricing',eyebrow:'08 / Commercial',title:'Clear Pricing From Day One',
      paragraphs:['We explain what each part of your setup costs and why. You’ll know what you’re paying for before you sign anything, and there’s no surprise invoice three months in.']
    },
    {
      key:'growth',eyebrow:'09 / Scale',title:'Room to Grow',
      paragraphs:['Start with a MetaTrader grey label, add a CRM when your client base grows, add liquidity options as volumes pick up. When the numbers justify a full licence, we’ll help you plan that move too.']
    },
    {
      key:'faq',eyebrow:'10 / FAQ',title:'Frequently Asked Questions',
      cards:[
        ['MT4 or MT5, Which Should I Choose?','MT5 is newer, supports more asset classes and is where most new brokers are heading. MT4 still has a loyal trader base. Many brokers offer both, and we can set up either or both.'],
        ['Can I Switch to a Different Model Later?','Yes. Moving from white label to grey label, or from grey label to a full forex white label grey label turnkey package, is something we handle regularly.']
      ]
    },
    {
      key:'cta',eyebrow:'11 / Start',title:'Ready to Build Your Brokerage?',
      paragraphs:[
        'You’ve got the plan. We’ve got the infrastructure. Tell us what you’re building, which markets you’re after and when you’d like to go live, and we’ll come back with a setup and a timeline that actually fits.',
        'Working with a forex technology provider that has done this before makes the whole thing far less stressful. And if you’re ready to launch your forex brokerage in 2 days, the first step is a quick conversation. Get in touch today.'
      ]
    }
  ]
};

const escapeHtml=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const design=Number(document.body.dataset.design||1);
const cfg=designs[design]||designs[1];
document.title=`MetaGreyLabel — ${cfg.name}`;
document.body.classList.add(`design-${design}`);

function nav(){
  return `<header class="site-nav"><a class="brand" href="../index.html">META<b>GREY</b>LABEL</a><nav><a href="#models">Models</a><a href="#setup">Stack</a><a href="#launch">Launch</a><a href="#faq">FAQ</a></nav><a class="nav-cta" href="https://www.metagreylabel.io/get-quote/">Get a Quote</a></header>`;
}
function hero(){
  const orbit = [6,9,10].includes(design) ? '<div class="orbit-rings"><i></i><i></i><i></i></div>' : '';
  const terminal = [3,8].includes(design) ? '<div class="terminal-strip"><span>MT5 SERVER · ONLINE</span><span>BRIDGE · ACTIVE</span><span>CRM · READY</span></div>' : '';
  return `<section class="hero section" id="top"><div class="hero-copy"><span class="eyebrow">${escapeHtml(cfg.tag)} · Concept ${String(design).padStart(2,'0')}</span><h1>${escapeHtml(content.h1)}</h1><h2 class="hero-alt">${escapeHtml(cfg.hero)}</h2><p class="hero-sub">${escapeHtml(cfg.sub)}</p><div class="source-intro">${content.intro.map(p=>`<p>${escapeHtml(p)}</p>`).join('')}</div><div class="actions"><a class="button primary" href="https://www.metagreylabel.io/get-quote/">Build Your Brokerage</a><a class="button ghost" href="#models">Explore the Stack</a></div><div class="metrics"><div><b>2 Days</b><span>Technology launch target</span></div><div><b>MT4 / MT5</b><span>Platform choice</span></div><div><b>One Stack</b><span>Platform to liquidity</span></div></div></div><div class="hero-media" style="--hero-image:url('${cfg.image}')"><canvas class="three-canvas" aria-hidden="true"></canvas>${orbit}<div class="media-card"><span>Broker Infrastructure</span><b>Platform → CRM → Bridge → Liquidity</b></div>${terminal}</div></section>`;
}
function cards(items=[]){ return items.length ? `<div class="cards">${items.map(([t,p],i)=>`<article class="card"><span>0${i+1}</span><h3>${escapeHtml(t)}</h3><p>${escapeHtml(p)}</p></article>`).join('')}</div>` : ''; }
function bullets(items=[]){ return items.length ? `<ul class="feature-list">${items.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>` : ''; }
function section(s,i){
  const visual = ['provider','launch','setup','growth'].includes(s.key) ? `<div class="section-visual visual-${s.key}"><span>${escapeHtml(cfg.name)}</span><b>${escapeHtml(s.key==='launch'?'DAY 01 → DAY 02':s.key==='setup'?'MT4/5 → CRM → KYC → BRIDGE':s.key==='growth'?'START → OPERATE → SCALE':'INFRASTRUCTURE / READY')}</b></div>` : '';
  const body=`<div class="section-copy"><span class="eyebrow">${escapeHtml(s.eyebrow)}</span><h2>${escapeHtml(s.title)}</h2>${(s.paragraphs||[]).map(p=>`<p>${escapeHtml(p)}</p>`).join('')}${bullets(s.bullets)}${cards(s.cards)}</div>`;
  if(design===4||design===7) return `<section class="section editorial ${s.key}" id="${s.key}"><div class="section-index">${String(i+1).padStart(2,'0')}</div>${body}${visual}</section>`;
  if(design===5) return `<section class="section journey ${s.key}" id="${s.key}"><div class="journey-rail"><span>${String(i+1).padStart(2,'0')}</span><i></i></div>${body}${visual}</section>`;
  if(design===2) return `<section class="section os-panel ${s.key}" id="${s.key}"><div class="os-label">${String(i+1).padStart(2,'0')} / MODULE</div>${visual}${body}</section>`;
  if(design===3||design===8) return `<section class="section terminal-panel ${s.key}" id="${s.key}"><div class="terminal-head"><span>SYS_${s.key.toUpperCase()}</span><span>STATUS: ACTIVE</span></div>${body}${visual}</section>`;
  if(design===9) return `<section class="section orbit-panel ${s.key}" id="${s.key}"><div class="orbit-dot">${String(i+1).padStart(2,'0')}</div>${body}${visual}</section>`;
  if(design===10) return `<section class="section blueprint-panel ${s.key}" id="${s.key}"><aside>${String(i+1).padStart(2,'0')}<small>${escapeHtml(s.key)}</small></aside>${body}${visual}</section>`;
  return `<section class="section grid-panel ${s.key}" id="${s.key}">${body}${visual}</section>`;
}
function brokerBuilder(){
  if(design!==2) return '';
  return `<section class="section builder" id="builder"><div class="section-copy"><span class="eyebrow">Interactive / Configuration</span><h2>Brokerage Stack Builder</h2><p>Choose a launch model and infrastructure modules to preview a recommended stack.</p></div><div class="builder-ui"><div class="builder-options"><button data-model="White Label">White Label</button><button class="active" data-model="Grey Label">Grey Label</button><button data-model="Turnkey">Turnkey</button></div><div class="builder-result"><span>Recommended configuration</span><b id="builder-title">Grey Label / MT5 / CRM / Hybrid Bridge</b><div class="builder-chips"><i>MT5</i><i>Manager Access</i><i>CRM + KYC</i><i>Liquidity Bridge</i></div></div></div></section>`;
}
function footer(){
  return `<footer><div><a class="brand" href="../index.html">META<b>GREY</b>LABEL</a><p>MetaTrader infrastructure, brokerage operations and launch support.</p></div><div><a href="#top">Back to top ↑</a><a href="https://www.metagreylabel.io/contact/">Contact</a><a href="https://www.metagreylabel.io/get-quote/">Get a Quote</a></div></footer><a class="all-concepts" href="../index.html">← All 10 concepts</a>`;
}
document.getElementById('app').innerHTML = nav()+hero()+brokerBuilder()+content.sections.map(section).join('')+footer();

const gsap=window.gsap, ScrollTrigger=window.ScrollTrigger, Lenis=window.Lenis;
if(gsap&&ScrollTrigger&&Lenis){
  gsap.registerPlugin(ScrollTrigger);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis=new Lenis({autoRaf:false,smoothWheel:!reduced,lerp:.09});
  lenis.on('scroll',ScrollTrigger.update);
  gsap.ticker.add(t=>lenis.raf(t*1000));
  gsap.ticker.lagSmoothing(0);

  if(!reduced){
    gsap.from('.hero-copy>*',{y:34,opacity:0,duration:.8,stagger:.07,ease:'power3.out'});
    gsap.from('.hero-media',{scale:1.06,opacity:0,duration:1.25,ease:'power3.out'});
    document.querySelectorAll('.section').forEach((el,i)=>{
      const targets=el.querySelectorAll('.section-copy>*:not(.cards),.card,.feature-list li,.section-visual');
      gsap.from(targets,{y:i%2?34:46,opacity:0,duration:.75,stagger:.055,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 78%',once:true}});
    });
    document.querySelectorAll('.section-visual').forEach(el=>gsap.fromTo(el,{yPercent:-5},{yPercent:6,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.7}}));
    gsap.to('.orbit-rings i',{rotation:360,duration:18,repeat:-1,ease:'none',stagger:2});
  }
}

document.querySelectorAll('.builder-options button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.builder-options button').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const map={
    'White Label':'White Label / MT5 / Client Portal',
    'Grey Label':'Grey Label / MT5 / CRM / Hybrid Bridge',
    'Turnkey':'Turnkey / MT5 / CRM / Liquidity / Payments / Website'
  };
  document.getElementById('builder-title').textContent=map[btn.dataset.model];
}));

function initThree(){
  const canvas=document.querySelector('.three-canvas');
  if(!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try{
    const host=canvas.parentElement, renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.4));
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(50,1,.1,100);
    camera.position.z=5.2;
    const group=new THREE.Group(); scene.add(group);
    const count=[3,6,9,10].includes(design)?150:90;
    const positions=new Float32Array(count*3);
    for(let i=0;i<count;i++){const a=i*.71+design,r=1.3+(i%13)*.055,b=((i%19)/19-.5)*Math.PI;positions[i*3]=Math.cos(a)*Math.cos(b)*r;positions[i*3+1]=Math.sin(b)*r;positions[i*3+2]=Math.sin(a)*Math.cos(b)*r;}
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const palette=['#7af7ff','#ff7a45','#c6ff45','#111111','#f0c36c','#40e8ff','#ff5540','#8cff42','#ad8cff','#c56d3f'];
    const points=new THREE.Points(geo,new THREE.PointsMaterial({color:palette[design-1],size:.045,transparent:true,opacity:.9,sizeAttenuation:true}));
    group.add(points);
    const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.08,1),new THREE.MeshBasicMaterial({color:palette[design-1],wireframe:true,transparent:true,opacity:.16}));
    group.add(wire);
    const resize=()=>{const r=host.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();}; resize(); addEventListener('resize',resize,{passive:true});
    if(gsap){gsap.ticker.add(t=>{group.rotation.y=t*.06+design*.12;group.rotation.x=Math.sin(t*.08+design)*.11;wire.rotation.z=-t*.04;renderer.render(scene,camera);});}
  }catch(err){console.warn('Three.js scene disabled',err);}
}
initThree();
