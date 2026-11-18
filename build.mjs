import fs from 'node:fs';

import path from 'node:path';

const ROOT=process.cwd();const DIST=path.join(ROOT,"dist");const SITE_URL="https://mt5-gl.pages.dev";const CONTENT_FILE=path.join(ROOT,'content.xml');

const ROUTES=[["Home","/"],["About Us","/about-us/"],["Why Choose Us","/about-us/why-choose-us/"],["Client Testimonials","/about-us/testimonials/"],["Forex White Label","/forex-white-label/"],["MT4 White Label","/forex-white-label/mt4-white-label/"],["MT5 White Label","/forex-white-label/mt5-white-label/"],["White Label Pricing","/forex-white-label/pricing/"],["White Label vs Grey Label","/forex-white-label/vs-grey-label/"],["Forex Grey Label","/forex-grey-label/"],["MT4 Grey Label","/forex-grey-label/mt4-grey-label/"],["MT5 Grey Label","/forex-grey-label/mt5-grey-label/"],["Grey Label Pricing","/forex-grey-label/pricing/"],["Upgrade Grey Label to Admin License","/forex-grey-label/upgrade-to-admin/"],["MT4 / MT5 Admin License","/mt-admin-license/"],["MT4 Admin License","/mt-admin-license/mt4-admin/"],["MT5 Admin License","/mt-admin-license/mt5-admin/"],["Forex Broker Turnkey","/forex-broker-turnkey/"],["Launch in 2 Days (Process)","/forex-broker-turnkey/how-it-works/"],["Forex Liquidity","/forex-liquidity/"],["A-Book / B-Book / Hybrid","/forex-liquidity/a-book-b-book/"],["Liquidity Bridge","/forex-liquidity/liquidity-bridge/"],["Prime of Prime (PoP)","/forex-liquidity/prime-of-prime/"],["Fx CRM | TradeRoom","/forex-crm/"],["Trader's Room (Client Portal)","/forex-crm/traders-room/"],["IB / Affiliate Portal","/forex-crm/ib-portal/"],["Back Office & Admin Panel","/forex-crm/back-office/"],["KYC & Compliance Module","/forex-crm/kyc/"],["Deposit / Withdrawal Automation","/forex-crm/payments-automation/"],["Trading Platforms (Main Room)","/trading-platforms/"],["Web Trader","/trading-platforms/web-trader/"],["Mobile Trading App (iOS / Android)","/trading-platforms/mobile-app/"],["Desktop Platform","/trading-platforms/desktop/"],["Fx Company & License","/forex-company-license/"],["Offshore Company Formation","/forex-company-license/company-formation/"],["Contact","/contact/"],["Privacy Policy","/privacy-policy/"],["Terms of Service","/terms-of-service/"]];

const ROUTE_BY_TITLE=Object.fromEntries(ROUTES);const TITLE_BY_ROUTE=Object.fromEntries(ROUTES.map(([t,r])=>[r,t]));

const NAV_GROUPS=[["Solutions",[["White label",["Forex White Label","MT4 White Label","MT5 White Label","White Label Pricing","White Label vs Grey Label"]],["Grey label",["Forex Grey Label","MT4 Grey Label","MT5 Grey Label","Grey Label Pricing","Upgrade Grey Label to Admin License"]],["Admin licensing",["MT4 / MT5 Admin License","MT4 Admin License","MT5 Admin License"]],["Turnkey",["Forex Broker Turnkey","Launch in 2 Days (Process)"]]]],["Technology",[["Liquidity",["Forex Liquidity","A-Book / B-Book / Hybrid","Liquidity Bridge","Prime of Prime (PoP)"]],["CRM & client operations",["Fx CRM | TradeRoom","Trader's Room (Client Portal)","IB / Affiliate Portal","Back Office & Admin Panel","KYC & Compliance Module","Deposit / Withdrawal Automation"]],["Trading platforms",["Trading Platforms (Main Room)","Web Trader","Mobile Trading App (iOS / Android)","Desktop Platform"]]]],["Company",[["Company",["About Us","Why Choose Us","Client Testimonials"]],["Company formation",["Fx Company & License","Offshore Company Formation"]],["Information",["Contact","Privacy Policy","Terms of Service"]]]]];

const FALLBACKS={"Trader's Room (Client Portal)":{"h1":"Trader's Room and Client Portal for Forex Brokers","paragraphs":["Give clients one branded place to open accounts, submit KYC documents, fund trading accounts, request withdrawals and manage their profile.","The trader’s room is designed to sit between your CRM, payment providers and MetaTrader environment so routine client actions do not depend on manual back-office work."],"sections":[["Account management","Clients can view and manage trading accounts, balances and profile details from a branded portal."],["Funding workflow","Deposits and withdrawal requests can be connected to your payment and back-office approval workflow."],["KYC visibility","Document status and onboarding progress stay visible to both clients and authorized staff."]]},"Contact":{"h1":"Talk to MetaGreyLabel About Your Brokerage Setup","paragraphs":["Tell us which markets you plan to serve, whether you need MT4, MT5 or both, and which parts of the brokerage stack you already have in place.","We will use that information to shape the right platform, CRM, liquidity and launch path. No form submission endpoint is published until a verified receiving address or CRM endpoint is configured."],"sections":[["What to include","Your target markets, expected launch window, preferred platform, licensing status and any existing liquidity or payment relationships."]]},"Privacy Policy":{"h1":"Privacy Policy","paragraphs":["This website is designed to minimize unnecessary data collection. Static pages can be viewed without creating an account.","If contact or analytics services are enabled later, their data handling details should be added here before production use. This page intentionally avoids claiming collection practices or third-party processors that have not been configured."],"sections":[["Contact data","Information you choose to send through a future contact channel should only be used to respond to your enquiry and provide requested brokerage-technology information."]]},"Terms of Service":{"h1":"Terms of Service","paragraphs":["The website provides general information about brokerage technology and infrastructure. Availability, pricing and implementation depend on technical, commercial, licensing and jurisdictional requirements.","Nothing on this website should be treated as legal, regulatory, investment or financial advice. Final commercial terms should be documented in the applicable service agreement."],"sections":[["Service information","Website descriptions are informational and may be refined during technical scoping, due diligence and onboarding."]]}};

function decodeEntities(input=""){const named={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return input.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&([a-z]+);/gi,(all,name)=>named[name.toLowerCase()]??all);}

function esc(input=""){return String(input).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}

function attrMap(raw=""){const out={};for(const m of raw.matchAll(/([\w:-]+)="([^"]*)"/g))out[m[1]]=decodeEntities(m[2]);return out;}

function stripTags(input=""){return decodeEntities(input.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim());}

function parseDocuments(xml){const docs=new Map();const re=/<document\b([^>]*?)(?:\/>|>([\s\S]*?)<\/document>)/gi;let m;while((m=re.exec(xml))){const attrs=attrMap(m[1]);docs.set(attrs.title,{...attrs,body:m[2]||""});}return docs;}

function extractNodes(body=""){const nodes=[];const re=/<(heading)\b([^>]*)>([\s\S]*?)<\/heading>|<(p)\b[^>]*>([\s\S]*?)<\/p>/gi;let m;while((m=re.exec(body))){if(m[1]==="heading"){const attrs=attrMap(m[2]);nodes.push({type:"heading",level:Number(attrs.level||2),text:stripTags(m[3])});}else nodes.push({type:"p",text:stripTags(m[5])});}return nodes;}

function nodesFromFallback(title){const f=FALLBACKS[title];if(!f)return[];const nodes=[{type:"heading",level:1,text:f.h1}];f.paragraphs.forEach(text=>nodes.push({type:"p",text}));f.sections.forEach(([heading,text])=>{nodes.push({type:"heading",level:2,text:heading});nodes.push({type:"p",text});});return nodes;}

function descriptionFrom(nodes,title){const first=nodes.find(n=>n.type==="p"&&n.text.length>60)?.text||`MetaGreyLabel — ${title}.`;return first.length>158?`${first.slice(0,155).replace(/\s+\S*$/,"")}…`:first;}

function routeDepth(route){return route.split("/").filter(Boolean).length;}

function rootPrefix(route){return route==="/"?"./":"../".repeat(routeDepth(route));}

function routeHref(route,target){const p=rootPrefix(route);if(target==="/")return p;return p+target.replace(/^\//,"");}

function headerHtml(route){const home=routeHref(route,"/");let groups="";for(const [groupName,columns] of NAV_GROUPS){let cols="";for(const [columnName,titles] of columns){cols+=`<section class="mgl-link-group"><h3>${esc(columnName)}</h3>`;for(const title of titles)cols+=`<a href="${esc(routeHref(route,ROUTE_BY_TITLE[title]))}">${esc(title)}</a>`;cols+="</section>";}groups+=`<details class="mgl-nav-group"><summary>${esc(groupName)} <span aria-hidden="true">⌄</span></summary><div class="mgl-nav-mega"><div class="mgl-mega-title"><strong>${esc(groupName)}</strong><small>MetaGreyLabel solutions</small></div><div class="mgl-mega-grid">${cols}</div></div></details>`;}return `<header class="mgl-site-header" data-family="bitrader" id="top"><div class="mgl-header-inner"><a class="mgl-brand" href="${home}" aria-label="MetaGreyLabel home"><img class="mgl-brand-logo mgl-brand-logo--header" src="${rootPrefix(route)}media/logo-header.svg" alt="MetaGreyLabel"></a><button class="mgl-nav-toggle" type="button" aria-controls="mgl-nav-main" aria-expanded="false">☰ Menu</button><nav class="mgl-main-nav" id="mgl-nav-main" aria-label="Main navigation"><a class="mgl-nav-home" href="${home}"${route==="/"?' aria-current="page"':""}>Home</a>${groups}<a class="mgl-theme-link" href="${esc(routeHref(route,"/digitrader/"))}">DigiTrader ↗</a></nav></div></header>`;}

function footerHtml(route){return `<footer class="mgl-site-footer" data-family="bitrader"><div class="mgl-footer-inner"><div class="mgl-footer-main"><div class="mgl-footer-brand"><a class="mgl-brand" href="${esc(routeHref(route,"/"))}" aria-label="MetaGreyLabel home"><img class="mgl-brand-logo mgl-brand-logo--footer" src="${rootPrefix(route)}media/logo-footer.svg" alt="MetaGreyLabel"></a><p>MetaTrader brokerage infrastructure, liquidity and connected operations — built for your next launch.</p><a class="mgl-footer-cta" href="${esc(routeHref(route,"/contact/"))}">Let's talk <span aria-hidden="true">↗</span></a></div><nav class="mgl-footer-links" aria-label="Footer navigation"><section class="mgl-footer-col"><h3>Solutions</h3><a href="${esc(routeHref(route,"/forex-grey-label/"))}">Grey Label</a><a href="${esc(routeHref(route,"/forex-white-label/"))}">White Label</a><a href="${esc(routeHref(route,"/forex-liquidity/"))}">Liquidity</a><a href="${esc(routeHref(route,"/forex-crm/"))}">CRM &amp; TradeRoom</a></section><section class="mgl-footer-col"><h3>Company</h3><a href="${esc(routeHref(route,"/about-us/"))}">About</a><a href="${esc(routeHref(route,"/contact/"))}">Contact</a><a href="${esc(routeHref(route,"/privacy-policy/"))}">Privacy</a><a href="${esc(routeHref(route,"/terms-of-service/"))}">Terms</a></section></nav></div><div class="mgl-footer-bottom"><span>© 2026 MetaGreyLabel. All rights reserved.</span><span class="mgl-footer-bottom-tag">MT4 &amp; MT5 brokerage technology</span><a href="#top">Back to top ↑</a></div></div></footer>`;}

function breadcrumbs(route,title){const parts=route.split("/").filter(Boolean);const crumbs=[{name:"Home",href:routeHref(route,"/"),path:"/"}];let current="";for(let i=0;i<parts.length;i++){current+=`/${parts[i]}/`;crumbs.push({name:i===parts.length-1?title:(TITLE_BY_ROUTE[current]||parts[i].replace(/-/g," ")),href:routeHref(route,current),path:current});}return crumbs;}

function categoryFor(title){if(/Liquidity|A-Book|Prime of Prime/i.test(title))return"liquidity";if(/CRM|Trader|IB|Back Office|KYC|Deposit/i.test(title))return"crm";if(/Platform|Web Trader|Mobile Trading|Desktop/i.test(title))return"platforms";if(/About|Testimonials|Choose Us|Company|Formation/i.test(title))return"company";if(/Price|Pricing|vs/i.test(title))return"pricing";if(/Contact|Privacy|Terms/i.test(title))return"information";return"solutions";}

function heroImage(route,title){const prefix=rootPrefix(route)+"media/";const category=categoryFor(title);const choices={"liquidity":"b-about-home3-1.png","crm":"b-about-3.png","platforms":"b-banner-home3-1.png","company":"b-about-1.png","pricing":"b-pricing-bg.png","information":"b-cta-3.png","solutions":"b-banner-home1-1.png"};return prefix+choices[category];}

function renderBody(nodes){const h1=nodes.find(n=>n.type==="heading"&&n.level===1)?.text||"MetaGreyLabel";const firstH1Index=nodes.findIndex(n=>n.type==="heading"&&n.level===1);const body=nodes.filter((_,i)=>i!==firstH1Index);let html="",open=false,sectionIndex=0;const close=()=>{if(open){html+="</div></section>";open=false;}};for(const node of body){if(node.type==="heading"&&node.level===2){close();sectionIndex++;const alt=sectionIndex%2===0?" mgl-inner-section--alt":"";html+=`<section class="mgl-inner-section${alt}" data-aos="fade-up" data-aos-duration="700"><div class="mgl-inner-shell"><div class="mgl-inner-section-head"><span class="mgl-inner-kicker">${String(sectionIndex).padStart(2,"0")}</span><h2>${esc(node.text)}</h2></div><div class="mgl-inner-copy">`;open=true;}else if(node.type==="heading"&&node.level>=3){if(!open){html+='<section class="mgl-inner-section"><div class="mgl-inner-shell"><div class="mgl-inner-copy">';open=true;}html+=`<h3>${esc(node.text)}</h3>`;}else if(node.type==="p"){if(!open){html+='<section class="mgl-inner-section"><div class="mgl-inner-shell"><div class="mgl-inner-copy">';open=true;}html+=`<p>${esc(node.text)}</p>`;}}close();return{h1,html};}

function pageHtml(route,title,nodes){const {h1,html}=renderBody(nodes),description=descriptionFrom(nodes,title),canonical=SITE_URL+(route==="/"?"/":route),prefix=rootPrefix(route),crumbs=breadcrumbs(route,title);const crumbHtml=crumbs.map((c,i)=>i===crumbs.length-1?`<span aria-current="page">${esc(c.name)}</span>`:`<a href="${esc(c.href)}">${esc(c.name)}</a>`).join('<span aria-hidden="true">/</span>');const breadcrumbLd=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:crumbs.map((c,i)=>({"@type":"ListItem",position:i+1,name:c.name,item:SITE_URL+c.path}))});return `<!DOCTYPE html><html lang="en" data-bs-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>${esc(h1)} | MetaGreyLabel</title><meta name="description" content="${esc(description)}"><meta name="author" content="MetaGreyLabel"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(h1)} | MetaGreyLabel"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary_large_image"><meta property="og:image" content="https://mt5-gl.pages.dev/media/og-brand.png"><meta name="twitter:image" content="https://mt5-gl.pages.dev/media/og-brand.png"><link rel="icon" href="${prefix}media/favicon.svg" type="image/svg+xml"><link rel="icon" href="${prefix}media/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="${prefix}media/apple-touch-icon.png"><link rel="manifest" href="${prefix}site.webmanifest"><meta name="theme-color" content="#07161F"><link rel="stylesheet" href="${prefix}css/bitrader.css"><script type="application/ld+json">${breadcrumbLd.replace(/</g,"\\u003c")}</script></head><body><div id="__next">${headerHtml(route)}<main class="mgl-inner-page"><section class="mgl-inner-hero"><div class="mgl-inner-hero-bg" aria-hidden="true"></div><div class="mgl-inner-shell mgl-inner-hero-grid"><div class="mgl-inner-hero-copy" data-aos="fade-right" data-aos-duration="900"><nav class="mgl-breadcrumb" aria-label="Breadcrumb">${crumbHtml}</nav><span class="mgl-inner-eyebrow">${esc(categoryFor(title))}</span><h1>${esc(h1)}</h1><p>${esc(description)}</p><div class="mgl-inner-actions"><a class="trk-btn trk-btn--primary trk-btn--arrow" href="${esc(routeHref(route,"/contact/"))}">Talk to MetaGreyLabel <span aria-hidden="true">↗</span></a><a class="trk-btn trk-btn--outline22" href="${esc(routeHref(route,"/forex-grey-label/"))}">Explore Grey Label</a></div></div><div class="mgl-inner-hero-media" data-aos="fade-left" data-aos-duration="900"><div class="mgl-inner-hero-media-frame"><img src="${esc(heroImage(route,title))}" alt="${esc(title)} visual" loading="eager" decoding="async"></div></div></div></section>${html}<section class="cta cta--style1"><div class="container"><div class="cta__wrapper"><div class="cta__newsletter justify-content-center"><div class="cta__newsletter-inner" data-aos="fade-up" data-aos-duration="900"><div class="cta__thumb"><img src="${prefix}media/b-cta-3.png" alt="MetaGreyLabel consultation"></div><div class="cta__subscribe"><h2>Ready to Build Your Brokerage?</h2><p>Tell us what you want to launch and we’ll shape the right MetaTrader, CRM, liquidity and operations stack around it.</p><a class="trk-btn trk-btn--border trk-btn--primary" href="${esc(routeHref(route,"/contact/"))}">Contact MetaGreyLabel</a></div></div></div></div></div></section></main>${footerHtml(route)}</div><script src="${prefix}js/bitrader.js" defer></script></body></html>`;}

function patchHomepage(html,prefix){const ctaRoutes={"Contact MetaGreyLabel":"/contact/","Get Started":"/contact/","Get a Quote":"/contact/","Start Now":"/contact/"};return html.replace(/<small>Pages coming soon<\/small>/g,'<small>Explore MetaGreyLabel</small>').replace(/<a([^>]*?)href="#"([^>]*)>([\s\S]*?)<\/a>/g,(full,before,after,inner)=>{const text=stripTags(inner),route=ROUTE_BY_TITLE[text]||ctaRoutes[text]||null;return route?`<a${before}href="${prefix}${route.replace(/^\//,"")}"${after}>${inner}</a>`:full;});}

function rootHeroSlider(){return `
<section class="mgl-hero-slider" id="home" aria-label="MetaGreyLabel brokerage solutions" aria-roledescription="carousel" tabindex="0">
  <div class="mgl-hero-slider__track">
    <article class="mgl-hero-slide mgl-hero-slide--launch is-active" data-mgl-slide="0" aria-hidden="false">
      <div class="mgl-hero-slide__backdrop" aria-hidden="true"></div>
      <div class="mgl-hero-slide__inner">
        <div class="mgl-hero-slide__copy">
          <span class="mgl-hero-slide__eyebrow">MetaTrader Grey Label</span>
          <h1>Launch Your Forex Brokerage <span>in 2 Days</span></h1>
          <p>Ready MT4/MT5 infrastructure, configured around your brand.</p>
          <div class="mgl-hero-slide__actions">
            <a class="trk-btn trk-btn--primary trk-btn--arrow" href="forex-grey-label/">Explore Grey Label <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="mgl-hero-slide__media">
          <div class="mgl-hero-visual mgl-hero-visual--launch">
            <img class="mgl-hero-visual__main" src="media/b-banner-home1-1.png" alt="MetaTrader brokerage launch visual" loading="eager" decoding="async">
            <img class="mgl-hero-visual__float mgl-hero-visual__float--one" src="media/b-banner-home1-3.png" alt="" aria-hidden="true">
            <img class="mgl-hero-visual__float mgl-hero-visual__float--two" src="media/b-banner-home1-4.png" alt="" aria-hidden="true">
          </div>
        </div>
      </div>
    </article>

    <article class="mgl-hero-slide mgl-hero-slide--control" data-mgl-slide="1" aria-hidden="true">
      <div class="mgl-hero-slide__backdrop" aria-hidden="true"></div>
      <div class="mgl-hero-slide__inner mgl-hero-slide__inner--reverse">
        <div class="mgl-hero-slide__copy">
          <span class="mgl-hero-slide__eyebrow">Infrastructure + Control</span>
          <h2>Run Your Brand With <span>More Control</span></h2>
          <p>Broker operations without carrying the full server overhead.</p>
          <div class="mgl-hero-slide__actions">
            <a class="trk-btn trk-btn--primary" href="forex-white-label/vs-grey-label/">Compare Launch Models</a>
          </div>
        </div>
        <div class="mgl-hero-slide__media">
          <div class="mgl-hero-visual mgl-hero-visual--control">
            <img class="mgl-hero-visual__main" src="media/b-banner-home2-1.png" alt="Brokerage infrastructure control visual" loading="lazy" decoding="async">
          </div>
        </div>
      </div>
    </article>

    <article class="mgl-hero-slide mgl-hero-slide--stack" data-mgl-slide="2" aria-hidden="true">
      <div class="mgl-hero-slide__backdrop" aria-hidden="true"></div>
      <div class="mgl-hero-slide__inner">
        <div class="mgl-hero-slide__copy">
          <span class="mgl-hero-slide__eyebrow">Connected Brokerage Stack</span>
          <h2>MT4, MT5, Liquidity &amp; CRM <span>Working Together</span></h2>
          <p>One connected launch path from platform to client operations.</p>
          <div class="mgl-hero-slide__actions">
            <a class="trk-btn trk-btn--primary" href="forex-broker-turnkey/">Explore Turnkey Brokerage</a>
          </div>
        </div>
        <div class="mgl-hero-slide__media">
          <div class="mgl-hero-visual mgl-hero-visual--stack">
            <img class="mgl-hero-visual__main" src="media/b-banner-home3-1.png" alt="Connected MT4 MT5 liquidity and CRM visual" loading="lazy" decoding="async">
            <img class="mgl-hero-visual__float mgl-hero-visual__float--three" src="media/b-banner-home3-2.png" alt="" aria-hidden="true">
          </div>
        </div>
      </div>
    </article>
  </div>

  <div class="mgl-hero-slider__controls">
    <button class="mgl-hero-slider__arrow mgl-hero-slider__arrow--prev" type="button" data-mgl-slider-prev aria-label="Previous banner slide">←</button>
    <div class="mgl-hero-slider__dots" role="tablist" aria-label="Choose banner slide">
      <button type="button" class="is-active" data-mgl-slider-dot="0" role="tab" aria-selected="true" aria-label="Slide 1"></button>
      <button type="button" data-mgl-slider-dot="1" role="tab" aria-selected="false" aria-label="Slide 2"></button>
      <button type="button" data-mgl-slider-dot="2" role="tab" aria-selected="false" aria-label="Slide 3"></button>
    </div>
    <button class="mgl-hero-slider__arrow mgl-hero-slider__arrow--next" type="button" data-mgl-slider-next aria-label="Next banner slide">→</button>
  </div>
  <div class="mgl-hero-slider__progress" aria-hidden="true"><span></span></div>
</section>

<section class="mgl-banner-intro" aria-labelledby="mgl-banner-intro-title">
  <div class="mgl-banner-intro__shell">
    <div class="mgl-banner-intro__lead" data-aos="fade-up" data-aos-duration="750">
      <span class="mgl-banner-intro__eyebrow">A complete brokerage stack</span>
      <h2 id="mgl-banner-intro-title">Launch fast. Keep control. <span>Connect everything.</span></h2>
      <p>MetaGreyLabel brings the detailed infrastructure behind the banner into one structured launch model—so your platform, execution, client operations and growth tools work together from day one.</p>
    </div>

    <div class="mgl-banner-intro__grid">
      <article class="mgl-banner-intro__card" data-aos="fade-up" data-aos-duration="700">
        <span class="mgl-banner-intro__number">01</span>
        <h3>Launch your branded platform</h3>
        <p>Start with ready MT4/MT5 infrastructure, manager access and the core setup configured around your brokerage instead of building server infrastructure from scratch.</p>
        <a href="forex-grey-label/">Grey Label setup <span aria-hidden="true">↗</span></a>
      </article>

      <article class="mgl-banner-intro__card" data-aos="fade-up" data-aos-delay="80" data-aos-duration="700">
        <span class="mgl-banner-intro__number">02</span>
        <h3>Operate with broker-level control</h3>
        <p>Manage groups, spreads, symbols, leverage and dealing operations while the underlying server environment remains professionally maintained.</p>
        <a href="forex-white-label/vs-grey-label/">Compare launch models <span aria-hidden="true">↗</span></a>
      </article>

      <article class="mgl-banner-intro__card" data-aos="fade-up" data-aos-delay="160" data-aos-duration="700">
        <span class="mgl-banner-intro__number">03</span>
        <h3>Connect the full brokerage stack</h3>
        <p>Bring platform, liquidity, CRM, KYC, payments and partner operations into one launch path designed to remove integration gaps before you go live.</p>
        <a href="forex-broker-turnkey/">Explore turnkey brokerage <span aria-hidden="true">↗</span></a>
      </article>
    </div>

    <div class="mgl-banner-intro__stack" aria-label="Connected brokerage technology">
      <span>MT4</span><span>MT5</span><span>Liquidity</span><span>CRM</span><span>KYC</span><span>Payments</span><span>IB / Partners</span>
    </div>
  </div>
</section>`;}

function replaceRootBanner(html,markup){const start=html.indexOf('<section class="banner');if(start<0)return html;const end=html.indexOf('</section>',start);if(end<0)return html;return html.slice(0,start)+markup+html.slice(end+'</section>'.length);}

function makeRootHomepage(source){let html=patchHomepage(source,"./");html=html.replace(/<link rel="canonical" href="[^"]*">/i,`<link rel="canonical" href="${SITE_URL}/">`).replace(/href="style\.css"/g,'href="css/bitrader.css"').replace(/src="app\.js"/g,'src="js/bitrader.js"').replace(/(["'])images\//g,'$1bitrader/images/').replace(/href="\.\.\/"/g,'href="./"').replace(/href="\.\.\/digitrader\//g,'href="digitrader/').replace(/href="\.\.\/([^"]+)"/g,'href="$1"').replace(/href="index\.html" aria-label="View layout 1"/g,'href="bitrader/index.html" aria-label="View layout 1"').replace(/href="index-2\.html" aria-label="View layout 2"/g,'href="bitrader/index-2.html" aria-label="View layout 2"').replace(/href="index-3\.html" aria-label="View layout 3"/g,'href="bitrader/index-3.html" aria-label="View layout 3"');return replaceRootBanner(html,rootHeroSlider());}


fs.rmSync(DIST,{recursive:true,force:true});fs.mkdirSync(DIST,{recursive:true});
for(const dir of ["css","js","fonts","media"])fs.cpSync(path.join(ROOT,dir),path.join(DIST,dir),{recursive:true});
const xml=fs.readFileSync(CONTENT_FILE,'utf8');const docs=parseDocuments(xml);
for(const [title,route] of ROUTES){if(route==='/')continue;const doc=docs.get(title);const nodes=doc&&doc.status!=='unavailable'?extractNodes(doc.body):nodesFromFallback(title);if(!nodes.length)throw new Error(`No content available for ${title}`);const outDir=path.join(DIST,route.replace(/^\//,''));fs.mkdirSync(outDir,{recursive:true});fs.writeFileSync(path.join(outDir,'index.html'),pageHtml(route,title,nodes));}
const homepageTemplates=[["templates/bitrader-1.html","bitrader/index.html"],["templates/bitrader-2.html","bitrader/index-2.html"],["templates/bitrader-3.html","bitrader/index-3.html"],["templates/digitrader-1.html","digitrader/index.html"],["templates/digitrader-2.html","digitrader/index-demo2.html"],["templates/digitrader-3.html","digitrader/index-demo3.html"]];
for(const [src,out] of homepageTemplates){const source=fs.readFileSync(path.join(ROOT,src),'utf8');const output=patchHomepage(source,'../');const target=path.join(DIST,out);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,output);}
fs.writeFileSync(path.join(DIST,'digitrader','index-demo1.html'),'<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./"><link rel="canonical" href="./"><title>DigiTrader layout 1</title>');
const bitraderSource=fs.readFileSync(path.join(ROOT,'templates','bitrader-1.html'),'utf8');fs.writeFileSync(path.join(DIST,'index.html'),makeRootHomepage(bitraderSource));
const sitemap=ROUTES.map(([,route])=>`<url><loc>${SITE_URL}${route}</loc></url>`).join('');fs.writeFileSync(path.join(DIST,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}</urlset>`);
fs.writeFileSync(path.join(DIST,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(DIST,'404.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | MetaGreyLabel</title><link rel="icon" href="media/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#07161F"><link rel="stylesheet" href="css/bitrader.css"></head><body><main class="mgl-error-page"><div><span>404</span><h1>Page not found</h1><p>The page you requested is not available.</p><a class="trk-btn trk-btn--primary" href="./">Return home</a></div></main></body></html>`);
console.log(`Generated ${ROUTES.length} public routes into dist/ from content.xml`);
