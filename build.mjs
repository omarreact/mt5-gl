import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const CONTENT_FILE = path.join(ROOT, "content.xml");
const SITE_URL = (process.env.SITE_URL || "https://mt5-gl.pages.dev").replace(/\/+$/, "");
const BASE_PATH = normalizeBasePath(process.env.BASE_PATH || "/");

const LEGACY_ROUTE_BY_TITLE = new Map([
  ["Home", "/"],
  ["About Us", "/about-us/"],
  ["Why Choose Us", "/about-us/why-choose-us/"],
  ["Client Testimonials", "/about-us/testimonials/"],
  ["Forex White Label", "/forex-white-label/"],
  ["MT4 White Label", "/forex-white-label/mt4-white-label/"],
  ["MT5 White Label", "/forex-white-label/mt5-white-label/"],
  ["White Label Pricing", "/forex-white-label/pricing/"],
  ["White Label vs Grey Label", "/forex-white-label/vs-grey-label/"],
  ["Forex Grey Label", "/forex-grey-label/"],
  ["MT4 Grey Label", "/forex-grey-label/mt4-grey-label/"],
  ["MT5 Grey Label", "/forex-grey-label/mt5-grey-label/"],
  ["Grey Label Pricing", "/forex-grey-label/pricing/"],
  ["Upgrade Grey Label to Admin License", "/forex-grey-label/upgrade-to-admin/"],
  ["MT4 / MT5 Admin License", "/mt-admin-license/"],
  ["MT4 Admin License", "/mt-admin-license/mt4-admin/"],
  ["MT5 Admin License", "/mt-admin-license/mt5-admin/"],
  ["Forex Broker Turnkey", "/forex-broker-turnkey/"],
  ["Launch in 2 Days (Process)", "/forex-broker-turnkey/how-it-works/"],
  ["Forex Liquidity", "/forex-liquidity/"],
  ["A-Book / B-Book / Hybrid", "/forex-liquidity/a-book-b-book/"],
  ["Liquidity Bridge", "/forex-liquidity/liquidity-bridge/"],
  ["Prime of Prime (PoP)", "/forex-liquidity/prime-of-prime/"],
  ["Fx CRM | TradeRoom", "/forex-crm/"],
  ["Trader's Room (Client Portal)", "/forex-crm/traders-room/"],
  ["IB / Affiliate Portal", "/forex-crm/ib-portal/"],
  ["Back Office & Admin Panel", "/forex-crm/back-office/"],
  ["KYC & Compliance Module", "/forex-crm/kyc/"],
  ["Deposit / Withdrawal Automation", "/forex-crm/payments-automation/"],
  ["Trading Platforms (Main Room)", "/trading-platforms/"],
  ["Web Trader", "/trading-platforms/web-trader/"],
  ["Mobile Trading App (iOS / Android)", "/trading-platforms/mobile-app/"],
  ["Desktop Platform", "/trading-platforms/desktop/"],
  ["Fx Company & License", "/forex-company-license/"],
  ["Offshore Company Formation", "/forex-company-license/company-formation/"],
  ["Contact", "/contact/"],
  ["Privacy Policy", "/privacy-policy/"],
  ["Terms of Service", "/terms-of-service/"]
]);

const APPROVED_FALLBACKS = {
  "Trader's Room (Client Portal)": {
    h1: "Trader's Room and Client Portal for Forex Brokers",
    paragraphs: [
      "Give clients one branded place to open accounts, submit KYC documents, fund trading accounts, request withdrawals and manage their profile.",
      "The trader’s room is designed to sit between your CRM, payment providers and MetaTrader environment so routine client actions do not depend on manual back-office work."
    ],
    sections: [
      ["Account management", "Clients can view and manage trading accounts, balances and profile details from a branded portal."],
      ["Funding workflow", "Deposits and withdrawal requests can be connected to your payment and back-office approval workflow."],
      ["KYC visibility", "Document status and onboarding progress stay visible to both clients and authorized staff."]
    ]
  },
  Contact: {
    h1: "Talk to MetaGreyLabel About Your Brokerage Setup",
    paragraphs: [
      "Tell us which markets you plan to serve, whether you need MT4, MT5 or both, and which parts of the brokerage stack you already have in place.",
      "We will use that information to shape the right platform, CRM, liquidity and launch path. No form submission endpoint is published until a verified receiving address or CRM endpoint is configured."
    ],
    sections: [
      ["What to include", "Your target markets, expected launch window, preferred platform, licensing status and any existing liquidity or payment relationships."]
    ]
  },
  "Privacy Policy": {
    h1: "Privacy Policy",
    paragraphs: [
      "This website is designed to minimize unnecessary data collection. Static pages can be viewed without creating an account.",
      "If contact or analytics services are enabled later, their data handling details should be added here before production use. This page intentionally avoids claiming collection practices or third-party processors that have not been configured."
    ],
    sections: [
      ["Contact data", "Information you choose to send through a future contact channel should only be used to respond to your enquiry and provide requested brokerage-technology information."]
    ]
  },
  "Terms of Service": {
    h1: "Terms of Service",
    paragraphs: [
      "The website provides general information about brokerage technology and infrastructure. Availability, pricing and implementation depend on technical, commercial, licensing and jurisdictional requirements.",
      "Nothing on this website should be treated as legal, regulatory, investment or financial advice. Final commercial terms should be documented in the applicable service agreement."
    ],
    sections: [
      ["Service information", "Website descriptions are informational and may be refined during technical scoping, due diligence and onboarding."]
    ]
  }
};

const MEDIA_BY_FAMILY = {
  "service": [
    "b-banner-home1-1.png",
    "b-about-1.png",
    "b-about-home3-1.png",
    "b-banner-home1-3.png",
    "b-banner-home1-4.png",
    "b-feature-home3-5.png",
    "b-about-home3-5.png"
  ],
  "technology": [
    "b-banner-home2-1.png",
    "b-banner-home3-1.png",
    "b-banner-home3-2.png",
    "b-about-home3-2.png",
    "b-feature-home3-5.png",
    "b-about-3.png",
    "b-about-home3-5.png"
  ],
  "comparison": [
    "b-pricing-bg.png",
    "b-about-1.png",
    "b-banner-home1-4.png",
    "b-about-home3-2.png",
    "b-feature-home3-5.png"
  ],
  "company": [
    "b-about-1.png",
    "b-about-3.png",
    "b-blog-4.png",
    "b-banner-home1-3.png",
    "b-about-home3-5.png"
  ],
  "article": [
    "b-blog-4.png",
    "b-blog-5.png",
    "b-about-3.png",
    "b-about-home3-2.png",
    "b-banner-home3-2.png",
    "b-feature-home3-5.png"
  ],
  "legal": [
    "b-cta-3.png",
    "b-about-home3-5.png"
  ],
  "contact": [
    "b-cta-3.png",
    "b-banner-home3-2.png"
  ],
  "process": [
    "b-about-home3-1.png",
    "b-banner-home1-1.png",
    "b-about-home3-2.png",
    "b-banner-home2-1.png"
  ]
};

function normalizeBasePath(value) {
  const text = `/${String(value || "").trim().replace(/^\/+|\/+$/g, "")}/`;
  return text === "//" ? "/" : text;
}

function decodeEntities(input = "") {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return input
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (all, name) => named[name.toLowerCase()] ?? all);
}

function escapeHtml(input = "") {
  return String(input).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}

function attrMap(raw = "") {
  const output = {};
  for (const match of raw.matchAll(/([\w:-]+)="([^"]*)"/g)) output[match[1]] = decodeEntities(match[2]);
  return output;
}

function stripTags(input = "") {
  return decodeEntities(input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseDocuments(xml) {
  const documents = [];
  const pattern = /<document\b([^>]*?)(?:\/>|>([\s\S]*?)<\/document>)/gi;
  let match;
  while ((match = pattern.exec(xml))) {
    const attrs = attrMap(match[1]);
    if (!attrs.id || !attrs.title || !attrs.status) throw new Error(`Invalid document metadata near XML offset ${match.index}.`);
    documents.push({ ...attrs, body: match[2] || "", sourceIndex: documents.length });
  }
  if (!documents.length) throw new Error("content.xml does not contain any <document> entries.");
  const ids = new Set(), titles = new Set();
  for (const doc of documents) {
    if (ids.has(doc.id)) throw new Error(`Duplicate XML document id: ${doc.id}`);
    if (titles.has(doc.title)) throw new Error(`Duplicate XML document title: ${doc.title}`);
    ids.add(doc.id); titles.add(doc.title);
  }
  return documents;
}

function extractNodes(body = "") {
  const nodes = [];
  const pattern = /<(heading)\b([^>]*)>([\s\S]*?)<\/heading>|<(p)\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pattern.exec(body))) {
    if (match[1] === "heading") {
      const attrs = attrMap(match[2]);
      nodes.push({ type: "heading", level: Math.min(6, Math.max(1, Number(attrs.level || 2))), text: stripTags(match[3]) });
    } else nodes.push({ type: "p", text: stripTags(match[5]) });
  }
  return nodes;
}

function fallbackNodes(title) {
  const f = APPROVED_FALLBACKS[title];
  if (!f) return [];
  const nodes = [{ type: "heading", level: 1, text: f.h1 }];
  f.paragraphs.forEach((text) => nodes.push({ type: "p", text }));
  f.sections.forEach(([heading, text]) => {
    nodes.push({ type: "heading", level: 2, text: heading });
    nodes.push({ type: "p", text });
  });
  return nodes;
}

function slugify(input) {
  return String(input).normalize("NFKD").replace(/[’']/g, "").replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-").toLowerCase();
}

function normalizeRoute(route) {
  const clean = `/${String(route || "").trim().replace(/^\/+|\/+$/g, "")}/`;
  return clean === "//" ? "/" : clean;
}

function inferRoute(doc) {
  if (doc.route) return normalizeRoute(doc.route);
  if (doc.slug) return normalizeRoute(`/${doc.type === "article" ? "insights/" : ""}${slugify(doc.slug)}/`);
  if (LEGACY_ROUTE_BY_TITLE.has(doc.title)) return LEGACY_ROUTE_BY_TITLE.get(doc.title);
  return normalizeRoute(`/insights/${slugify(doc.title)}/`);
}

function inferFamily(doc, route) {
  if (doc.template) return doc.template;
  if (doc.type) return doc.type;
  if (route.startsWith("/insights/")) return "article";
  if (/privacy|terms/i.test(doc.title)) return "legal";
  if (/contact/i.test(doc.title)) return "contact";
  if (/vs|comparison|compare|pricing|price/i.test(doc.title)) return "comparison";
  if (/how it works|process|step-by-step/i.test(doc.title)) return "process";
  if (/about|choose us|testimonial|company formation/i.test(doc.title)) return "company";
  if (/liquidity|crm|trader|portal|back office|kyc|deposit|withdrawal|platform|web trader|mobile trading|desktop/i.test(doc.title)) return "technology";
  return "service";
}

function inferNavGroup(doc, route) {
  if (doc["nav-group"]) return doc["nav-group"];
  if (route.startsWith("/insights/")) return "Resources";
  if (route.startsWith("/about-us/") || route.startsWith("/forex-company-license/") || ["/contact/", "/privacy-policy/", "/terms-of-service/"].includes(route)) return "Company";
  if (route.startsWith("/forex-liquidity/") || route.startsWith("/forex-crm/") || route.startsWith("/trading-platforms/")) return "Technology";
  return "Solutions";
}

function inferNavSection(doc, route) {
  if (doc["nav-section"]) return doc["nav-section"];
  if (route.startsWith("/forex-white-label/")) return "White label";
  if (route.startsWith("/forex-grey-label/")) return "Grey label";
  if (route.startsWith("/mt-admin-license/")) return "Admin licensing";
  if (route.startsWith("/forex-broker-turnkey/")) return "Turnkey";
  if (route.startsWith("/forex-liquidity/")) return "Liquidity";
  if (route.startsWith("/forex-crm/")) return "CRM & client operations";
  if (route.startsWith("/trading-platforms/")) return "Trading platforms";
  if (route.startsWith("/forex-company-license/")) return "Company formation";
  if (route.startsWith("/about-us/")) return "Company";
  if (["/contact/", "/privacy-policy/", "/terms-of-service/"].includes(route)) return "Information";
  return route.startsWith("/insights/") ? "Insights" : "General";
}

function buildModel(documents) {
  const pages = documents.map((doc) => {
    const route = inferRoute(doc);
    const nodes = doc.status === "unavailable" ? fallbackNodes(doc.title) : extractNodes(doc.body);
    if (!nodes.length) throw new Error(`No publishable content for ${doc.id} (${doc.title}).`);
    const h1s = nodes.filter((n) => n.type === "heading" && n.level === 1);
    if (h1s.length !== 1) throw new Error(`${doc.id} (${doc.title}) must resolve to exactly one H1; found ${h1s.length}.`);
    return {
      ...doc, route, nodes,
      family: inferFamily(doc, route),
      navGroup: inferNavGroup(doc, route),
      navSection: inferNavSection(doc, route),
      navVisible: doc["nav-visible"] ? doc["nav-visible"] !== "false" : !route.startsWith("/insights/") && route !== "/",
      navOrder: Number.isFinite(Number(doc["nav-order"])) ? Number(doc["nav-order"]) : doc.sourceIndex
    };
  });
  const routes = new Map();
  for (const page of pages) {
    if (routes.has(page.route)) throw new Error(`Duplicate generated route ${page.route}: ${routes.get(page.route).title} and ${page.title}`);
    routes.set(page.route, page);
  }
  if (!routes.has("/")) throw new Error('content.xml must include a document that resolves to route "/".');
  return { pages, routes };
}

function routeDepth(route) { return route.split("/").filter(Boolean).length; }
function rootPrefix(route) { return route === "/" ? "./" : "../".repeat(routeDepth(route)); }
function routeHref(currentRoute, targetRoute) {
  const prefix = rootPrefix(currentRoute);
  return targetRoute === "/" ? prefix : `${prefix}${targetRoute.replace(/^\//, "")}`;
}
function canonicalFor(route) { return `${SITE_URL}${route === "/" ? "/" : route}`; }
function basePathUrl(pathname) { return `${BASE_PATH}${String(pathname).replace(/^\/+/, "")}`.replace(/\/{2,}/g, "/"); }

function descriptionFrom(nodes, title) {
  const first = nodes.find((n) => n.type === "p" && n.text.length > 60)?.text || `MetaGreyLabel — ${title}.`;
  return first.length <= 158 ? first : `${first.slice(0, 155).replace(/\s+\S*$/, "")}…`;
}

function breadcrumbs(model, page) {
  const parts = page.route.split("/").filter(Boolean), crumbs = [{ name: "Home", path: "/", href: routeHref(page.route, "/") }];
  let current = "";
  for (let i = 0; i < parts.length; i += 1) {
    current += `/${parts[i]}/`;
    const known = model.routes.get(current);
    crumbs.push({ name: i === parts.length - 1 ? page.title : (known?.title || parts[i].replace(/-/g, " ")), path: current, href: routeHref(page.route, current) });
  }
  return crumbs;
}

function stableHash(input = "") {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mediaFor(page, index = 0) {
  if (page["featured-image"]) return page["featured-image"].replace(/^\/?media\//, "");
  const list = MEDIA_BY_FAMILY[page.family] || MEDIA_BY_FAMILY.service;
  const seed = stableHash(`${page.route}:${page.title}`);
  return list[(seed + (index * 3)) % list.length];
}

function mediaAlt(page, label = "") {
  const subject = label || page.title;
  return `${subject} — MetaGreyLabel illustration`;
}

function headerHtml(model, currentRoute, prefix = rootPrefix(currentRoute)) {
  const groups = new Map();

  for (const page of model.pages.filter((p) => p.navVisible).sort((a, b) => a.navOrder - b.navOrder)) {
    if (!groups.has(page.navGroup)) groups.set(page.navGroup, new Map());
    const sections = groups.get(page.navGroup);
    if (!sections.has(page.navSection)) sections.set(page.navSection, []);
    sections.get(page.navSection).push(page);
  }

  const groupHtml = [...groups.entries()].map(([groupName, sections]) => {
    const columns = [...sections.entries()].map(([sectionName, pages]) =>
      `<section class="mgl-mega__group"><h3>${escapeHtml(sectionName)}</h3>${pages.map((p) =>
        `<a href="${escapeHtml(routeHref(currentRoute, p.route))}"${p.route === currentRoute ? ' aria-current="page"' : ""}>${escapeHtml(p.title)}</a>`).join("")}</section>`).join("");

    return `<div class="mgl-nav-item"><button class="mgl-nav-trigger" type="button" data-mgl-nav-trigger aria-haspopup="true" aria-expanded="false">${escapeHtml(groupName)} <svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="mgl-mega"><div class="mgl-mega__grid">${columns}</div></div></div>`;
  }).join("");

  const contact = model.routes.get("/contact/");
  const insightsHref = routeHref(currentRoute, "/insights/");
  const contactHref = contact ? routeHref(currentRoute, contact.route) : null;

  return `<header class="mgl-global-header" id="top"><div class="mgl-header__inner">
    <a class="mgl-brand-link" href="${escapeHtml(prefix)}" aria-label="MetaGreyLabel home">
      <img class="mgl-logo mgl-logo--light" src="${escapeHtml(prefix)}media/branding/logo-light.svg" alt="MetaGreyLabel">
      <img class="mgl-logo mgl-logo--dark" src="${escapeHtml(prefix)}media/branding/logo-dark.svg" alt="" aria-hidden="true">
    </a>
    <nav class="mgl-nav" id="mgl-main-nav" data-mgl-nav aria-label="Main navigation">
      <a class="mgl-nav__home" href="${escapeHtml(prefix)}"${currentRoute === "/" ? ' aria-current="page"' : ""}>Home</a>
      ${groupHtml}
      <a class="mgl-nav__link" href="${escapeHtml(insightsHref)}"${currentRoute.startsWith("/insights/") ? ' aria-current="page"' : ""}>Insights</a>
      ${contactHref ? `<a class="mgl-nav__link" href="${escapeHtml(contactHref)}"${currentRoute === "/contact/" ? ' aria-current="page"' : ""}>Contact</a>` : ""}
    </nav>
    <div class="mgl-header__actions">
      <button class="mgl-theme-toggle" type="button" data-mgl-theme-toggle aria-pressed="false" aria-label="Switch to dark theme" title="Switch to dark theme"><span data-mgl-theme-icon aria-hidden="true">☾</span></button>
      ${contactHref ? `<a class="mgl-btn mgl-header-cta" href="${escapeHtml(contactHref)}">Plan your brokerage</a>` : ""}
      <button class="mgl-nav-toggle" type="button" data-mgl-nav-toggle aria-controls="mgl-main-nav" aria-expanded="false" aria-label="Open navigation"><span class="mgl-nav-toggle__bars" aria-hidden="true"><span></span></span><span class="mgl-nav-toggle__label">Menu</span></button>
    </div>
  </div></header>`;
}

function footerHtml(model, currentRoute, prefix = rootPrefix(currentRoute)) {
  const find = (route) => model.routes.get(route);
  const columns = [
    ["Solutions", [find("/forex-grey-label/"), find("/forex-white-label/"), find("/forex-broker-turnkey/"), find("/mt-admin-license/")]],
    ["Technology", [find("/forex-liquidity/"), find("/forex-crm/"), find("/trading-platforms/")]],
    ["Company", [find("/about-us/"), find("/forex-company-license/"), find("/contact/"), find("/privacy-policy/"), find("/terms-of-service/")]]
  ];

  const links = columns.map(([label, pages]) =>
    `<section class="mgl-footer__col"><h3>${escapeHtml(label)}</h3>${pages.filter(Boolean).map((p) =>
      `<a href="${escapeHtml(routeHref(currentRoute, p.route))}">${escapeHtml(p.title)}</a>`).join("")}</section>`
  ).join("");

  return `<footer class="mgl-global-footer"><div class="mgl-footer__inner">
    <div class="mgl-footer__grid">
      <div class="mgl-footer__brand">
        <a class="mgl-brand-link" href="${escapeHtml(prefix)}" aria-label="MetaGreyLabel home"><img class="mgl-footer__logo" src="${escapeHtml(prefix)}media/branding/logo-dark.svg" alt="MetaGreyLabel"></a>
        <p>MetaTrader brokerage infrastructure, liquidity and connected operations — configured around your brand and built for your next launch.</p>
      </div>
      ${links}
    </div>
    <div class="mgl-footer__bottom"><span>© 2026 MetaGreyLabel. All rights reserved.</span><a href="#top">Back to top ↑</a></div>
  </div></footer>`;
}

function renderSectionContent(nodes) {
  return nodes.map((n) => n.type === "heading" ? `<h${n.level}>${escapeHtml(n.text)}</h${n.level}>` : `<p>${escapeHtml(n.text)}</p>`).join("");
}

function splitIntoSections(nodes) {
  const h1Index = nodes.findIndex((n) => n.type === "heading" && n.level === 1);
  const body = nodes.filter((_, i) => i !== h1Index), sections = [];
  let current = { heading: null, nodes: [] };
  for (const node of body) {
    if (node.type === "heading" && node.level === 2) {
      if (current.heading || current.nodes.length) sections.push(current);
      current = { heading: node, nodes: [] };
    } else current.nodes.push(node);
  }
  if (current.heading || current.nodes.length) sections.push(current);
  return sections;
}

function subsectionGroups(nodes) {
  const groups = [];
  let current = { heading: null, nodes: [] };

  for (const node of nodes) {
    if (node.type === "heading" && node.level === 3) {
      if (current.heading || current.nodes.length) groups.push(current);
      current = { heading: node, nodes: [] };
    } else {
      current.nodes.push(node);
    }
  }

  if (current.heading || current.nodes.length) groups.push(current);
  return groups;
}

function inferSectionKind(page, section) {
  const sectionText = [
    page.title,
    section.heading?.text || "",
    ...section.nodes.map((node) => node.text || "")
  ].join(" ").toLowerCase();

  const groups = subsectionGroups(section.nodes);

  if (page.family === "comparison") return groups.length > 1 ? "comparison" : "callout";
  if (page.family === "process") return groups.length > 1 ? "process" : "split";
  if (/\b(step|process|timeline|day one|day two|how it works|setup process|launch process)\b/.test(sectionText) && groups.length > 1) return "process";
  if (/\b(vs|versus|compare|comparison|difference|pricing|price|cost|control|white label|grey label)\b/.test(sectionText) && groups.length > 1) return "comparison";
  if (/\b(feature|benefit|include|capabilit|tool|module|option|what you get|what is included)\b/.test(sectionText) && groups.length > 1) return "cards";
  if (/\b(conclusion|summary|which one|who it suits|who is it for|why choose|decision)\b/.test(sectionText)) return "callout";
  if (page.family === "company" && groups.length <= 1) return "editorial";
  if (/\b(liquidity|bridge|execution|crm|platform|server|integration|risk|technology|technical)\b/.test(sectionText)) return "split";
  if (groups.length > 1) return "cards";

  return stableHash(`${page.route}:${section.heading?.text || "overview"}`) % 2 === 0 ? "split" : "editorial";
}

function renderGroupCards(groups, className) {
  return groups.map((group) => {
    const title = group.heading ? `<h3>${escapeHtml(group.heading.text)}</h3>` : "";
    return `<article class="${className}">${title}${renderSectionContent(group.nodes)}</article>`;
  }).join("");
}

function renderStandardSections(page) {
  return splitIntoSections(page.nodes).map((section, index) => {
    const headingText = section.heading?.text || "";
    const heading = headingText ? `<h2>${escapeHtml(headingText)}</h2>` : "";
    const content = renderSectionContent(section.nodes);
    const groups = subsectionGroups(section.nodes);
    const kind = inferSectionKind(page, section);
    const imageName = mediaFor(page, index + 1);
    const imageHtml = `<figure class="mgl-content-visual"><img src="${escapeHtml(rootPrefix(page.route))}media/${escapeHtml(imageName)}" alt="${escapeHtml(mediaAlt(page, headingText || page.title))}" loading="lazy" decoding="async"></figure>`;

    if (kind === "process" && groups.length > 1) {
      return `<section class="mgl-inner-section mgl-inner-section--soft" data-aos="fade-up"><div class="mgl-inner-shell"><div class="mgl-inner-section-head"><span class="mgl-inner-kicker">Process</span>${heading}</div><div class="mgl-process-grid">${groups.map((group, groupIndex) => `<article class="mgl-process-card"><span class="mgl-process-card__num">${String(groupIndex + 1).padStart(2, "0")}</span><div>${group.heading ? `<h3>${escapeHtml(group.heading.text)}</h3>` : ""}${renderSectionContent(group.nodes)}</div></article>`).join("")}</div></div></section>`;
    }

    if (kind === "comparison") {
      const facts = section.nodes
        .filter((node) => node.type === "p" && /^[^:]{2,48}:\s+.+/.test(node.text))
        .map((node) => {
          const splitAt = node.text.indexOf(":");
          return { label: node.text.slice(0, splitAt).trim(), value: node.text.slice(splitAt + 1).trim() };
        });

      if (facts.length >= 2) {
        const factTexts = new Set(facts.map((fact) => `${fact.label}: ${fact.value}`));
        const remaining = section.nodes.filter((node) => !(node.type === "p" && factTexts.has(node.text)));
        return `<section class="mgl-inner-section" data-aos="fade-up"><div class="mgl-inner-shell"><div class="mgl-inner-section-head"><span class="mgl-inner-kicker">Compare</span>${heading}${renderSectionContent(remaining)}</div><dl class="mgl-comparison-facts">${facts.map((fact) => `<div class="mgl-comparison-facts__row"><dt>${escapeHtml(fact.label)}</dt><dd>${escapeHtml(fact.value)}</dd></div>`).join("")}</dl></div></section>`;
      }

      if (groups.length > 1) {
        return `<section class="mgl-inner-section" data-aos="fade-up"><div class="mgl-inner-shell"><div class="mgl-inner-section-head"><span class="mgl-inner-kicker">Compare</span>${heading}</div><div class="mgl-comparison-grid">${renderGroupCards(groups, "mgl-comparison-card")}</div></div></section>`;
      }
    }

    if (kind === "cards" && groups.length > 1) {
      return `<section class="mgl-inner-section mgl-inner-section--soft" data-aos="fade-up"><div class="mgl-inner-shell"><div class="mgl-inner-section-head"><span class="mgl-inner-kicker">Capabilities</span>${heading}</div><div class="mgl-subsection-grid">${renderGroupCards(groups, "mgl-subsection-card")}</div></div></section>`;
    }

    if (kind === "callout") {
      return `<section class="mgl-inner-section mgl-inner-section--accent" data-aos="fade-up"><div class="mgl-inner-shell"><div class="mgl-editorial-callout">${heading}${content}</div></div></section>`;
    }

    if (kind === "editorial") {
      return `<section class="mgl-inner-section mgl-inner-section--soft" data-aos="fade-up"><div class="mgl-inner-shell"><div class="mgl-inner-copy">${heading}${content}</div></div></section>`;
    }

    const reverse = stableHash(`${page.route}:${headingText}`) % 2 === 1;
    return `<section class="mgl-inner-section" data-aos="fade-up"><div class="mgl-inner-shell mgl-inner-split${reverse ? " mgl-inner-split--reverse" : ""}">${reverse ? imageHtml : ""}<div class="mgl-inner-copy">${heading}${content}</div>${reverse ? "" : imageHtml}</div></section>`;
  }).join("");
}

function renderArticle(page) {
  const h1Index = page.nodes.findIndex((n) => n.type === "heading" && n.level === 1);
  const body = page.nodes.filter((_, i) => i !== h1Index);
  const h2s = body.filter((n) => n.type === "heading" && n.level === 2);
  const toc = h2s.length ? `<aside class="mgl-article-toc" aria-label="Table of contents"><strong>On this page</strong><ol>${h2s.map((h) => `<li><a href="#${escapeHtml(slugify(h.text))}">${escapeHtml(h.text)}</a></li>`).join("")}</ol></aside>` : "";
  const content = body.map((n) => {
    if (n.type === "p") return `<p>${escapeHtml(n.text)}</p>`;
    const id = n.level === 2 ? ` id="${escapeHtml(slugify(n.text))}"` : "";
    return `<h${n.level}${id}>${escapeHtml(n.text)}</h${n.level}>`;
  }).join("");
  return `<section class="mgl-article-body"><div class="mgl-inner-shell mgl-article-layout">${toc}<article class="mgl-article-prose">${content}</article></div></section>`;
}

function renderLegal(page) {
  const h1Index = page.nodes.findIndex((n) => n.type === "heading" && n.level === 1);
  return `<section class="mgl-legal-body"><div class="mgl-inner-shell"><article class="mgl-legal-prose">${renderSectionContent(page.nodes.filter((_, i) => i !== h1Index))}</article></div></section>`;
}

function renderContact(page) {
  const h1Index = page.nodes.findIndex((node) => node.type === "heading" && node.level === 1);
  const body = page.nodes.filter((_, index) => index !== h1Index);

  return `<section class="mgl-inner-section mgl-inner-section--soft" id="contact-brief"><div class="mgl-inner-shell mgl-contact-brief">
    <article class="mgl-inner-copy">
      <span class="mgl-inner-kicker">Project brief</span>
      ${renderSectionContent(body)}
      <div class="mgl-contact-checklist" aria-label="Useful brokerage brief information">
        <div>Target markets</div>
        <div>Expected launch window</div>
        <div>Preferred platform: MT4, MT5 or both</div>
        <div>Licensing status</div>
        <div>Existing liquidity or payment relationships</div>
      </div>
    </article>
    <aside class="mgl-contact-status">
      <span class="mgl-inner-kicker">Contact status</span>
      <h3>No simulated submission</h3>
      <p>A verified receiving address or CRM submission endpoint is not published in the current source, so this site intentionally does not pretend that a form was submitted successfully.</p>
      <div class="mgl-contact-actions">
        <a class="mgl-btn mgl-btn--outline" href="${escapeHtml(routeHref(page.route, "/insights/"))}">Explore insights</a>
        <a class="mgl-btn mgl-btn--outline" href="${escapeHtml(routeHref(page.route, "/about-us/"))}">About MetaGreyLabel</a>
      </div>
    </aside>
  </div></section>`;
}

function relatedHtml(model, page) {
  const pool = model.pages.filter((p) => p.route !== page.route && p.route !== "/" && p.status !== "unavailable");
  const items = [...pool.filter((p) => p.family === page.family), ...pool.filter((p) => p.family !== page.family)].slice(0, 3);
  if (!items.length) return "";
  return `<section class="mgl-related-section"><div class="mgl-inner-shell"><div class="mgl-inner-section-head"><span class="mgl-inner-kicker">Continue exploring</span><h2>Related MetaGreyLabel resources</h2></div><div class="mgl-related-grid">${items.map((p) => `<article class="mgl-related-card"><span>${escapeHtml(p.navGroup)}</span><h3><a href="${escapeHtml(routeHref(page.route, p.route))}">${escapeHtml(p.title)}</a></h3><p>${escapeHtml(descriptionFrom(p.nodes, p.title))}</p></article>`).join("")}</div></div></section>`;
}

function pageHtml(model, page) {
  const h1 = page.nodes.find((node) => node.type === "heading" && node.level === 1)?.text || page.title;
  const description = descriptionFrom(page.nodes, page.title);
  const prefix = rootPrefix(page.route);
  const crumbs = breadcrumbs(model, page);
  const crumbHtml = crumbs.map((crumb, index) =>
    index === crumbs.length - 1
      ? `<span aria-current="page">${escapeHtml(crumb.name)}</span>`
      : `<a href="${escapeHtml(crumb.href)}">${escapeHtml(crumb.name)}</a>`
  ).join('<span aria-hidden="true">/</span>');

  const body = page.family === "article"
    ? renderArticle(page)
    : page.family === "legal"
      ? renderLegal(page)
      : page.family === "contact"
        ? renderContact(page)
        : renderStandardSections(page);

  const contact = model.routes.get("/contact/");
  const heroActions = page.family === "legal"
    ? ""
    : page.family === "contact"
      ? `<div class="mgl-inner-actions"><a class="mgl-btn" href="#contact-brief">Review what to include</a><a class="mgl-btn mgl-btn--outline" href="${escapeHtml(routeHref(page.route, "/insights/"))}">Explore insights</a></div>`
      : `<div class="mgl-inner-actions">${contact ? `<a class="mgl-btn" href="${escapeHtml(routeHref(page.route, contact.route))}">Plan your brokerage</a>` : ""}<a class="mgl-btn mgl-btn--outline" href="${escapeHtml(routeHref(page.route, "/insights/"))}">Explore insights</a></div>`;

  const finalCta = (page.family === "legal" || page.family === "contact" || !contact)
    ? ""
    : `<section class="mgl-final-cta"><div class="mgl-inner-shell mgl-final-cta__inner"><div><span class="mgl-inner-kicker">Next step</span><h2>Build the brokerage stack around your launch plan.</h2><p>Organise your target markets, platform preference, licensing status and launch window before the implementation discussion.</p></div><a class="mgl-btn" href="${escapeHtml(routeHref(page.route, contact.route))}">Plan your brokerage</a></div></section>`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: canonicalFor(crumb.path)
    }))
  };

  const schemaType = page.family === "article"
    ? "Article"
    : page.family === "legal"
      ? "WebPage"
      : page.family === "contact"
        ? "ContactPage"
        : page.family === "company"
          ? "AboutPage"
          : page.family === "process"
            ? "HowTo"
            : "Service";

  const pageLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: h1,
    description,
    url: canonicalFor(page.route),
    publisher: {
      "@type": "Organization",
      name: "MetaGreyLabel",
      url: `${SITE_URL}/`
    }
  };

  const heroImage = mediaFor(page);

  return `<!DOCTYPE html><html lang="en" data-bs-theme="light"><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${escapeHtml(h1)} | MetaGreyLabel</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="MetaGreyLabel">
    <meta name="theme-color" content="#f7faf9">
    <link rel="canonical" href="${escapeHtml(canonicalFor(page.route))}">
    <meta property="og:title" content="${escapeHtml(h1)} | MetaGreyLabel">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="${page.family === "article" ? "article" : "website"}">
    <meta property="og:url" content="${escapeHtml(canonicalFor(page.route))}">
    <meta property="og:image" content="${SITE_URL}/media/og-brand.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${SITE_URL}/media/og-brand.png">
    <link rel="icon" href="${prefix}media/branding/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="${prefix}media/branding/favicon-32.png" sizes="32x32" type="image/png">
    <link rel="apple-touch-icon" href="${prefix}media/branding/apple-touch-icon.png">
    <link rel="manifest" href="${prefix}site.webmanifest">
    <script src="${prefix}js/script.js"></script>
    <link rel="stylesheet" href="${prefix}css/style.css">
    <script type="application/ld+json">${JSON.stringify(pageLd).replace(/</g, "\\u003c")}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c")}</script>
  </head><body>
    ${headerHtml(model, page.route)}
    <main class="mgl-inner-page mgl-layout-${escapeHtml(page.family)}">
      <section class="mgl-inner-hero">
        <div class="mgl-inner-shell mgl-inner-hero-grid">
          <div class="mgl-inner-hero-copy">
            <nav class="mgl-breadcrumb" aria-label="Breadcrumb">${crumbHtml}</nav>
            <span class="mgl-inner-eyebrow">${escapeHtml(page.family)}</span>
            <h1>${escapeHtml(h1)}</h1>
            <p>${escapeHtml(description)}</p>
            ${heroActions}
          </div>
          <div class="mgl-inner-hero-media">
            <div class="mgl-inner-hero-media-frame"><img src="${prefix}media/${escapeHtml(heroImage)}" alt="${escapeHtml(mediaAlt(page, h1))}" loading="eager" decoding="async" fetchpriority="high"></div>
          </div>
        </div>
      </section>
      ${body}
      ${relatedHtml(model, page)}
      ${finalCta}
    </main>
    ${footerHtml(model, page.route)}
  </body></html>`;
}

function insightsIndexHtml(model) {
  const route = "/insights/";
  const articles = model.pages.filter((page) => page.family === "article").sort((a, b) => a.sourceIndex - b.sourceIndex);
  const desc = "MetaGreyLabel articles on grey label, white label, liquidity, CRM, KYC, broker operations and brokerage technology.";

  return `<!DOCTYPE html><html lang="en" data-bs-theme="light"><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Broker Insights | MetaGreyLabel</title>
    <meta name="description" content="${escapeHtml(desc)}">
    <meta name="theme-color" content="#f7faf9">
    <link rel="canonical" href="${SITE_URL}${route}">
    <meta property="og:title" content="Broker Insights | MetaGreyLabel">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}${route}">
    <meta property="og:image" content="${SITE_URL}/media/og-brand.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${SITE_URL}/media/og-brand.png">
    <link rel="icon" href="../media/branding/favicon.svg" type="image/svg+xml">
    <script src="../js/script.js"></script>
    <link rel="stylesheet" href="../css/style.css">
  </head><body>
    ${headerHtml(model, route)}
    <main class="mgl-insights-index">
      <section class="mgl-inner-hero mgl-insights-hero"><div class="mgl-inner-shell"><span class="mgl-inner-eyebrow">Resources</span><h1>Broker Insights</h1><p>${escapeHtml(desc)}</p></div></section>
      <section class="mgl-insights-list"><div class="mgl-inner-shell mgl-insights-grid">${articles.map((page) =>
        `<article class="mgl-insight-card"><img src="../media/${escapeHtml(mediaFor(page))}" alt="${escapeHtml(mediaAlt(page, page.title))}" loading="lazy" decoding="async"><div><span>Insight</span><h2><a href="${escapeHtml(routeHref(route, page.route))}">${escapeHtml(page.title)}</a></h2><p>${escapeHtml(descriptionFrom(page.nodes, page.title))}</p></div></article>`
      ).join("")}</div></section>
    </main>
    ${footerHtml(model, route)}
  </body></html>`;
}

function renderHomepageXmlContent(page) {
  const sourceTitle = page.nodes.find((node) => node.type === "heading" && node.level === 1)?.text || page.title;
  const body = page.nodes.filter((node) => !(node.type === "heading" && node.level === 1));
  const groups = [];
  let current = { title: "Overview", nodes: [] };

  for (const node of body) {
    if (node.type === "heading" && node.level === 2) {
      if (current.nodes.length) groups.push(current);
      current = { title: node.text, nodes: [] };
    } else {
      current.nodes.push(node);
    }
  }
  if (current.nodes.length) groups.push(current);

  const items = groups.map((group, index) => {
    const content = group.nodes.map((node) => {
      if (node.type === "p") return `<p>${escapeHtml(node.text)}</p>`;
      const level = Math.min(6, Math.max(4, node.level + 1));
      return `<h${level}>${escapeHtml(node.text)}</h${level}>`;
    }).join("");
    return `<details class="mgl-home-editorial__item"${index === 0 ? " open" : ""}><summary><h3>${escapeHtml(group.title)}</h3><span aria-hidden="true">+</span></summary><div class="mgl-home-editorial__content">${content}</div></details>`;
  }).join("");

  return `<section class="mgl-home-editorial" aria-labelledby="mgl-home-editorial-title"><div class="container"><div class="mgl-home-editorial__head"><span class="mgl-inner-kicker">Complete source content</span><h2 id="mgl-home-editorial-title">${escapeHtml(sourceTitle)}</h2></div><div class="mgl-home-editorial__grid">${items}</div></div></section>`;
}

function patchHomepage(model, html) {
  let out = html
    .replace(/<header\b[\s\S]*?<\/header>/i, headerHtml(model, "/", "./"))
    .replace(/<footer\b[\s\S]*?<\/footer>/i, footerHtml(model, "/", "./"))
    .replace(/<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${SITE_URL}/">`)
    .replace(/(["'(])\.\.\/(media|fonts)\//g, "$1$2/")
    .replace(/(["'])\.\.\/site\.webmanifest/g, "$1site.webmanifest")
    .replace(/href="\.\.\/"/g, 'href="./"')
    .replace(/href="\.\.\/([^"]+)"/g, 'href="$1"')
    .replace(/src="\.\.\/([^"]+)"/g, 'src="$1"');

  const homePage = model.routes.get("/");
  if (homePage) {
    const sourceContent = renderHomepageXmlContent(homePage);
    out = out.replace(/<\/main>/i, `${sourceContent}</main>`);
  }

  if (!/js\/script\.js/.test(out)) {
    out = out.replace("</head>", '  <script src="js/script.js"></script>\n</head>');
  }

  return out;
}

function writeRoute(route, html){const p=route==="/"?path.join(DIST,"index.html"):path.join(DIST,route.replace(/^\/|\/$/g,""),"index.html");fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,html);}
function copyStaticAssets(){for(const d of ["css","js","fonts","media"]){const s=path.join(ROOT,d);if(!fs.existsSync(s))throw new Error(`Missing required asset directory: ${d}/`);fs.cpSync(s,path.join(DIST,d),{recursive:true});}const m=path.join(ROOT,"site.webmanifest");if(!fs.existsSync(m))throw new Error("Missing site.webmanifest");fs.copyFileSync(m,path.join(DIST,"site.webmanifest"));}
function generatedRoutes(model){return [...model.pages.map((p)=>p.route),"/insights/"];}
function outputPathForRoute(route){return route==="/"?path.join(DIST,"index.html"):path.join(DIST,route.replace(/^\/|\/$/g,""),"index.html");}

function verifyGeneratedOutput(model) {
  const routes = new Set(generatedRoutes(model));
  const missing = [...routes].filter((route) => !fs.existsSync(outputPathForRoute(route)));
  if (missing.length) throw new Error(`Generated output missing routes: ${missing.join(", ")}`);

  const htmlFiles = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      entry.isDirectory() ? walk(absolute) : entry.name.endsWith(".html") && htmlFiles.push(absolute);
    }
  };
  walk(DIST);

  const unresolved = [];
  const placeholders = [];
  const assetErrors = [];

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");

    if ((html.match(/css\/style\.css/g) || []).length !== 1) assetErrors.push(`${path.relative(DIST, file)} must reference css/style.css exactly once`);
    if ((html.match(/js\/script\.js/g) || []).length !== 1) assetErrors.push(`${path.relative(DIST, file)} must reference js/script.js exactly once`);

    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];

      if (href === "#") {
        placeholders.push(`${path.relative(DIST, file)} -> href="#"`);
        continue;
      }

      if (!href || href.startsWith("#") || /^(https?:|mailto:|tel:)/.test(href) || /\.(css|js|svg|png|webmanifest)(#.*)?$/.test(href)) continue;

      const clean = href.split("#")[0];
      const baseRelative = BASE_PATH !== "/" && clean.startsWith(BASE_PATH) ? clean.slice(BASE_PATH.length) : null;
      const resolved = baseRelative !== null
        ? path.join(DIST, baseRelative)
        : clean.startsWith("/")
          ? path.join(DIST, clean.replace(/^\/+/, ""))
          : path.resolve(path.dirname(file), clean);
      const candidate = (clean === "/" || clean === BASE_PATH)
        ? path.join(DIST, "index.html")
        : (clean.endsWith("/") || !path.extname(clean) ? path.join(resolved, "index.html") : resolved);

      if (!fs.existsSync(candidate)) unresolved.push(`${path.relative(DIST, file)} -> ${href}`);
    }
  }

  if (placeholders.length) throw new Error(`Placeholder links remain:\n${placeholders.slice(0, 30).join("\n")}`);
  if (unresolved.length) throw new Error(`Unresolved generated internal links:\n${unresolved.slice(0, 30).join("\n")}`);
  if (assetErrors.length) throw new Error(`Invalid front-end asset references:\n${assetErrors.slice(0, 30).join("\n")}`);
}

function writeSeoFiles(model){const routes=generatedRoutes(model),urls=routes.map((r)=>`  <url><loc>${escapeHtml(canonicalFor(r))}</loc></url>`).join("\n");fs.writeFileSync(path.join(DIST,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);fs.writeFileSync(path.join(DIST,"robots.txt"),`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);}
function write404(model){fs.writeFileSync(path.join(DIST,"404.html"),`<!doctype html><html lang="en" data-bs-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | MetaGreyLabel</title><meta name="theme-color" content="#f7faf9"><link rel="icon" href="${basePathUrl("media/branding/favicon.svg")}" type="image/svg+xml"><link rel="stylesheet" href="${basePathUrl("css/style.css")}"><script src="${basePathUrl("js/script.js")}"></script></head><body>${headerHtml(model,"/",BASE_PATH)}<main class="mgl-error-page"><div><span>404</span><h1>Page not found</h1><p>The page you requested is not available.</p><a class="trk-btn trk-btn--primary" href="${BASE_PATH}">Return home</a></div></main>${footerHtml(model,"/",BASE_PATH)}</body></html>`);}

function main(){
  if(!fs.existsSync(CONTENT_FILE))throw new Error("Missing content.xml");
  const documents=parseDocuments(fs.readFileSync(CONTENT_FILE,"utf8")),model=buildModel(documents);
  fs.rmSync(DIST,{recursive:true,force:true});fs.mkdirSync(DIST,{recursive:true});copyStaticAssets();
  for(const page of model.pages){if(page.route!=="/")writeRoute(page.route,pageHtml(model,page));}
  writeRoute("/insights/",insightsIndexHtml(model));
  const homepage=path.join(ROOT,"templates","bitrader-1.html");if(!fs.existsSync(homepage))throw new Error("Missing templates/bitrader-1.html");writeRoute("/",patchHomepage(model,fs.readFileSync(homepage,"utf8")));
  writeSeoFiles(model);write404(model);verifyGeneratedOutput(model);
  console.log(JSON.stringify({xmlDocuments:documents.length,generatedPages:generatedRoutes(model).length,generatedContentPages:model.pages.length,articlePages:model.pages.filter((p)=>p.family==="article").length,sitemapUrls:generatedRoutes(model).length,basePath:BASE_PATH,canonicalOrigin:SITE_URL},null,2));
}
main();
