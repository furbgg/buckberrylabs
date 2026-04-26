/**
 * pricing-reposition.mjs
 * Bulk find-replace for EN + TR preise.html + API route
 * Run: node scripts/pricing-reposition.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');

// ── GENERIC REPLACEMENTS (apply to both EN and TR) ──
const SHARED = [
  // Calculator data values
  ['data-base="9000"', 'data-base="990"'],
  ['data-base="18000"', 'data-base="1490"'],
  ['data-base="24000"', 'data-base="1990"'],
  ['data-base="32000"', 'data-base="2990"'],
  ['data-mult="0.8"', null], // will remove scope group entirely
  ['data-mult="1.0"', null],
  ['data-mult="1.35"', null],
  ['data-mult="1.8"', null],
  ['data-add="1800"', 'data-add="250"'],
  ['data-add="3400"', 'data-add="400"'],
  ['data-add="5200"', 'data-add="700"'],
  ['data-add="1200"', 'data-add="300"'],
  ['data-add="2400"', 'data-add="500"'],
  ['data-add="3600"', 'data-add="800"'],
  ['data-maint="120"', 'data-maint="79"'],
  ['data-maint="280"', 'data-maint="129"'],
  ['data-maint="480"', 'data-maint="175"'],
  // Prices in text
  ['€9.000', '€990'],
  ['€18.000', '€1.490'],
  ['€30.000', '€1.990'],
  ['€120</span><span class="per">', '€79</span><span class="per">'],
  ['€280</span><span class="per">', '€129</span><span class="per">'],
  ['€480</span><span class="per">', '€175</span><span class="per">'],
  // Addon prices
  ['€1.200 <s>', '€300 <s>'],
  ['€2.400 <s>', '€150 <s>'],
  ['€3.500 <s>', '€120 <s>'],
  ['€1.800 <s>', '€60 <s>'],
  ['€12.000 <s>', '€390 <s>'],
  ['€600 <s>', '€150 <s>'],
  ['€2.800 <s>', '€790 <s>'],
  ['€1.400 <s>', '€290 <s>'],
  // Calculator JS state
  ['type:9000, size:1.0, int:0, lang:0, maint:120', 'type:990, int:0, lang:0, maint:79'],
  ['state.type * state.size + state.int', 'state.type + state.int'],
  ['total * 0.85 / 100) * 100', 'total * 0.85 / 10) * 10'],
  ['total * 1.15 / 100) * 100', 'total * 1.15 / 10) * 10'],
  // Tier names
  ['>Kompakt<', '>Start<'],
  ['>Standard<', '>Pro<'],
  ['>Custom<', '>Signature<'],
  // Maintenance names
  ['>Basis<', '>Care Basic<'],
  // Guarantees
  ['99,9 %', '99,5 %'],
  ['±15 %', '10 Jahre'],
  // Remove size references in JS
  ["const brkSize = document.getElementById('brkSize');", ''],
  ["brkSize.textContent = '×' + state.size.toFixed(2);", ''],
];

// ── EN-SPECIFIC ──
function patchEN(html) {
  let h = html;
  // Promises
  h = h.replace('1⁄3</span>\n        <h4>Zahlung in 3 Raten</h4>\n        <p>33% at kickoff, 33% at UAT, 34% at launch. No 100% upfront payment.</p>',
    '½</span>\n        <h4>Payment 50 / 50</h4>\n        <p>50% at project start, 50% at launch. Payment term 14 days net.</p>');
  h = h.replace('Full Git repository, CI/CD, infrastructure as code. No vendor lock-in.',
    'Full Git repository. No vendor lock-in, no small print.');
  // Tier section head
  h = h.replace('From a lean online presence to a custom B2B application. Every number here is a realistic starting price for a real scope — not a marketing teaser with a footnote.',
    'From a simple online presence to a trilingual complete package. All prices are fixed — not "from", but "exactly that".');
  // Tier card content - Start
  h = h.replace('>Straightforward and online fast.<', '>Straightforward &amp; online fast.<');
  h = h.replace('For smaller businesses that need a solid online presence — no fluff, but measurably better than a builder.',
    'For small businesses that finally want a solid online presence — cleanly built, mobile optimised, no template look.');
  h = h.replace('>netto</span></div>\n        <span class="hint">from · 4–6 weeks to launch</span>\n        <ul>\n          <li>Up to 8 static pages (DE + EN)</li>\n          <li>Responsive design aligned to your brand</li>\n          <li>Contact form + GDPR consent</li>\n          <li>Lighthouse &gt; 95 auf allen Achsen</li>\n          <li>AT hosting + SSL + backups</li>\n          <li>3 months of bug-fix cover</li>\n          <li class="mute">Shop features · login · more than 2 languages</li>',
    '>Fixed price</span></div>\n        <span class="hint">was €1,290 · Launch in 4–5 weeks</span>\n        <ul>\n          <li>Up to 3 custom pages</li>\n          <li>Responsive design aligned to your brand</li>\n          <li>Contact form + GDPR consent</li>\n          <li>Imprint, privacy policy, T&amp;C templates</li>\n          <li>Basic SEO (meta, sitemap, robots.txt)</li>\n          <li>AT hosting setup + SSL certificate</li>\n          <li>1 revision round · 30 min discovery call</li>\n          <li class="mute">Multi-language · Blog · Analytics</li>');
  // Pro card
  h = h.replace('>Shop, booking or portal — ready to run.<',
    '>The complete package for growing businesses.<');
  h = h.replace('For businesses that earn money online: ecommerce, booking systems, client portals. Includes admin, payments and operational setup.',
    'For businesses that want to be truly visible online: multi-language, with analytics and clear audience targeting.');
  h = h.replace('>netto</span></div>\n        <span class="hint">from · 8–12 weeks to launch</span>\n        <ul>\n          <li>Everything in Compact, plus:</li>\n          <li>Backend + Admin-Panel (Rollen, Audit)</li>\n          <li>Stripe / SEPA / Klarna-Integration</li>\n          <li>Email automation (order confirmation, invoice)</li>\n          <li>Custom CMS — kein WordPress</li>\n          <li>Monitoring + Sentry + Uptime-Alerts</li>\n          <li>6 months of bug-fix cover</li>\n          <li class="mute">Custom B2B workflows · ERP integration</li>',
    '>Fixed price</span></div>\n        <span class="hint">was €1,890 · Launch in 5–6 weeks</span>\n        <ul>\n          <li>Everything in Start, plus:</li>\n          <li>Up to 6 pages · Individual design</li>\n          <li>Bilingual (DE + EN or DE + TR)</li>\n          <li>Cookieless analytics (Plausible)</li>\n          <li>Google Business + Maps setup</li>\n          <li>3 revision rounds · 60 min discovery call</li>\n          <li class="mute">Third language · Blog · On-site shooting</li>');
  // Signature card  
  h = h.replace('>B2B applications, integrations, edge cases.<',
    '>Complete online presence, fully managed.<');
  h = h.replace('For everything that does not fit a template: internal tools, dashboards, ERP integrations, data pipelines, apps.',
    'For businesses that want to do it right: trilingual, blog, own photo set on-site in Upper Austria.');
  h = h.replace('>+ netto</span></div>\n        <span class="hint">from · 10–20 weeks depending on scope</span>\n        <ul>\n          <li>Everything in Standard, plus:</li>\n          <li>Custom data model & API design</li>\n          <li>ERP / CRM / inventory integration</li>\n          <li>Roles, permissions & audit system</li>\n          <li>Native app (iOS / Android) optional</li>\n          <li>Dedicated project channel & weekly sync</li>\n          <li>12 months of bug-fix cover</li>\n          <li>SLA mit Reaktionszeiten</li>',
    '>Fixed price</span></div>\n        <span class="hint">was €2,490 · Launch in 6–8 weeks</span>\n        <ul>\n          <li>Everything in Pro, plus:</li>\n          <li>Up to 10 pages</li>\n          <li>Trilingual (DE + EN + TR or custom)</li>\n          <li>Blog / news section with CMS</li>\n          <li>On-site photo shoot (Linz area)</li>\n          <li>Unlimited revision rounds</li>\n          <li>90 days post-launch support included</li>');
  h = h.replace('Discuss scope', 'Send enquiry');
  h = h.replace('Möbel Weinberger', 'Reitsportzentrum Traunsee');
  // Feature table - replace header names
  h = h.replace('>Kompakt</th>', '>Start</th>');
  h = h.replace('>Standard</th>', '>Pro</th>');
  h = h.replace('>Custom</th>', '>Signature</th>');
  // Maintenance titles
  h = h.replace('>Everything stays running.<', '>Runs &amp; secure.<');
  h = h.replace('>Plus continued development.<', '>Grows with you.<');
  h = h.replace('>SLA + dedicated point of contact.<', '>Peace of mind.<');
  // Maintenance content - Basic
  h = h.replace('Security-Patches &amp; Framework-Updates</li>\n          <li>Daily backup + quarterly restore drill</li>\n          <li>Uptime-Monitoring 24/7</li>\n          <li>Email support · response &lt; 48h on working days</li>\n          <li>1 hour of content edits per month</li>',
    'Hosting + domain + SSL (all included)</li>\n          <li>Daily backups + monthly restore check</li>\n          <li>Monthly security patches</li>\n          <li>Uptime monitoring 24/7</li>\n          <li>Email support · response &lt; 24h on working days</li>\n          <li style="color:rgba(255,255,255,.45);">Content changes: +€60/h</li>');
  // Maintenance content - Standard/Plus  
  h = h.replace('Everything in Basic</li>\n          <li>4 hours of development time per month</li>\n          <li>Response &lt; 8h on working days, &lt; 24h at weekends</li>\n          <li>Monthly reporting (uptime, performance, security)</li>\n          <li>Phone support during office hours</li>',
    'Everything in Care Basic</li>\n          <li>Weekly security patches</li>\n          <li>1 hour of content changes per month</li>\n          <li>Monthly performance report</li>\n          <li>Response &lt; 8h on working days</li>');
  // Maintenance content - Premium
  h = h.replace('Everything in Standard</li>\n          <li>10 hours of development time per month (carry-over for 3 months)</li>\n          <li>SLA · response &lt; 2h, bug-fix window &lt; 8h</li>\n          <li>Dedicated project channel (Slack / Teams)</li>\n          <li>Quarterly roadmap call</li>',
    'Everything in Care Plus</li>\n          <li>Weekly security patches</li>\n          <li>3 hours of content changes per month</li>\n          <li>Quarterly SEO fine-tuning</li>\n          <li>Priority support · response &lt; 2h</li>');
  // Maintenance names in type spans
  h = h.replace('>Care Basic</span>\n        <h3>Runs', '>Care Basic</span>\n        <h3>Runs');
  // Calculator labels
  h = h.replace('Five inputs, live-calculated range. Not binding, but based on the last 24 projects.',
    'Four inputs, live-calculated range. Not binding, but a realistic orientation.');
  h = h.replace('>Online-Shop<', '>Multi-Language<');
  h = h.replace('>Web-App / Portal<', '>Complete Package<');
  h = h.replace('>Custom-B2B<', '>Custom / B2B<');
  // Scope group removal
  const scopeRe = /\s*<div class="grp">\s*<span class="lab">Scope<\/span>.*?<\/div>\s*<\/div>/s;
  h = h.replace(scopeRe, '');
  // Calculator result defaults
  h = h.replace('>9.000</span>', '>990</span>');
  h = h.replace('€7.700 – €10.400', '€840 – €1,140');
  h = h.replace('>€9.000</b>', '>€990</b>');
  h = h.replace('>×1.00</b>', '');
  h = h.replace('<div class="row"><span>Scope</span><b id="brkSize">×1.00</b></div>', '');
  h = h.replace('<div class="row"><span>Scope</span><b id="brkSize"></b></div>', '');
  h = h.replace('>€120</b></div>', '>€79</b></div>');
  // Maint button labels
  h = h.replace('Basic · €120/mo', 'Care Basic · €79/mo');
  h = h.replace('Standard · €280/Mo', 'Care Plus · €129/mo');
  h = h.replace('Premium · €480/Mo', 'Care Premium · €175/mo');
  // Integration labels  
  h = h.replace('>1 System</button>', '>Analytics</button>');
  h = h.replace('>2 systems</button>', '>Online booking</button>');
  h = h.replace('>3+ (ERP, CRM…)</button>', '>Payments / Shop</button>');
  // Myths
  h = h.replace('Budget-Korridor', 'Source code access');
  h = h.replace('bei SLA-Kunden', 'for Care Premium clients');
  // Addons section
  h = h.replace('Eight frequently requested extensions — ready to commission, clearly priced. Anything not listed here is quoted on request.',
    'Seven frequently requested extensions — ready to commission, clearly priced.');
  // Remove enterprise addons (Product configurator, ERP, Editorial, Native App, Technical audit)
  // We'll handle these with regex
  const addonRe = /<div class="addon reveal">\s*<span class="tag">Shop<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe, '');
  const addonRe2 = /<div class="addon reveal">\s*<span class="tag">Integration<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe2, '');
  const addonRe3 = /<div class="addon reveal">\s*<span class="tag">Content<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe3, '');
  const addonRe4 = /<div class="addon reveal">\s*<span class="tag">Mobile<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe4, '');
  const addonRe5 = /<div class="addon reveal">\s*<span class="tag">Beratung<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe5, '');
  // Feature table simplify - replace entire tbody
  const tbodyRe = /<tbody>[\s\S]*?<\/tbody>/;
  h = h.replace(tbodyRe, `<tbody>
            <tr><td>Custom design (aligned to your brand)</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Responsive (mobile, tablet, desktop)</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Contact form + GDPR consent</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Imprint / privacy / T&C templates</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Basic SEO (meta, sitemap, robots.txt)</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>AT hosting setup + SSL</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Number of pages</td><td>up to 3</td><td class="mark">up to 6</td><td>up to 10</td></tr>
            <tr><td>Languages</td><td>1</td><td class="mark">2</td><td>3</td></tr>
            <tr><td>Cookieless analytics (Plausible)</td><td><span class="n">—</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Google Business + Maps setup</td><td><span class="n">—</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Blog / news section</td><td><span class="n">—</span></td><td class="mark"><span class="n">—</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>On-site photo shoot</td><td><span class="n">—</span></td><td class="mark"><span class="n">—</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Revision rounds</td><td>1</td><td class="mark">3</td><td>Unlimited</td></tr>
            <tr><td>Launch time</td><td>4–5 weeks</td><td class="mark">5–6 weeks</td><td>6–8 weeks</td></tr>
          </tbody>`);
  h = h.replace('Full transparency: 16 services across 4 groups. Line by line, you can see what is included in each tier — and what is not.',
    'Full transparency. Line by line, you can see what is included in each package — and what is not.');
  // FAQ updates
  h = h.replace(/Kompakt/g, 'Start');
  // Remove scope row from calc breakdown
  const scopeRowRe = /\s*<div class="row"><span>Scope<\/span><b id="brkSize">.*?<\/b><\/div>/g;
  h = h.replace(scopeRowRe, '');
  // Remove Umfang/Scope calc group
  const scopeCalcRe = /\s*<div class="grp">\s*<span class="lab">Kapsam<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(scopeCalcRe, '');
  return h;
}

// ── TR-SPECIFIC ──
function patchTR(html) {
  let h = html;
  // Promises
  h = h.replace('1⁄3</span>\n        <h4>3 taksitte ödeme</h4>\n        <p>33 % bei Start, 33 % bei UAT, 34 % bei Livegang. Keine Vorkasse zu 100 %.</p>',
    '½</span>\n        <h4>%50 / %50 ödeme</h4>\n        <p>Proje başlangıcında %50, canlıya alınma anında %50. Ödeme vadesi 14 gün net.</p>');
  h = h.replace('Komplettes Git-Repo, CI/CD, Infrastruktur-as-Code. Kein Vendor-Lock-in.',
    'Eksiksiz Git deposu. Vendor lock-in yok, küçük yazı yok.');
  h = h.replace('30 Tage Geld-zurück', '30 gün para iade');
  h = h.replace('Nach Livegang unzufrieden? 30 Tage Rückabwicklungs­klausel im Vertrag.',
    'Canlı sonrası memnun kalmadınız mı? Sözleşmede 30 gün iade şartı var.');
  // Tier section head
  h = h.replace('Von der einseitigen Online-Präsenz bis zur individuellen B2B-Anwendung. Alle Zahlen sind Ab-Preise für einen realen Scope — nicht „Marketingpreise mit Sternchen\".',
    'Basit bir online varlıktan üç dilli komple pakete kadar. Tüm fiyatlar sabittir — "başlangıç" değil, "tam olarak bu".');
  // Start card
  h = h.replace('Gradlinig &amp; schnell online.', 'Düz &amp; hızlı online.');
  h = h.replace('>netto</span></div>\n        <span class="hint">ab · 4–6 Wochen bis Livegang</span>\n        <ul>\n          <li>Bis zu 8 statische Seiten (DE + EN)</li>',
    '>Sabit fiyat</span></div>\n        <span class="hint">normalde €1.290 · 4–5 haftada canlı</span>\n        <ul>\n          <li>3 özel sayfaya kadar</li>');
  h = h.replace('Lighthouse &gt; 95 auf allen Achsen</li>\n          <li>AT hosting + SSL + yedekler</li>\n          <li>3 Monate Bugfix-Garantie</li>\n          <li class="mute">Shop-Funktion · Login · Multilingual &gt; 2</li>',
    'Künye, gizlilik, GŞK şablonları</li>\n          <li>Temel SEO (meta, sitemap, robots.txt)</li>\n          <li>AT hosting kurulumu + SSL sertifikası</li>\n          <li>1 revizyon turu · 30 dk tanışma görüşmesi</li>\n          <li class="mute">Çok dilli · Blog · Analytics</li>');
  // Pro card
  h = h.replace('Mağaza, rezervasyon ya da portal — çalışır halde teslim.',
    'Büyüyen işletmeler için tam donanımlı.');
  h = h.replace('Online gelir üreten işletmeler için: e-ticaret, rezervasyon sistemleri, müşteri portalları. Admin, ödeme ve operasyon dahil.',
    'Online olarak gerçekten görünür olmak isteyen işletmeler için: çok dilli, analytics ve net hedef kitle yaklaşımı.');
  h = h.replace('Meistgewählt', 'En çok tercih edilen');
  h = h.replace('>netto</span></div>\n        <span class="hint">ab · 8–12 Wochen bis Livegang</span>\n        <ul>\n          <li>Alles aus Kompakt, plus:</li>\n          <li>Arka uç + admin paneli (roller, audit)</li>\n          <li>Stripe / SEPA / Klarna-Integration</li>\n          <li>E-posta otomasyonu (sipariş onayı, fatura)</li>\n          <li>Custom CMS — kein WordPress</li>\n          <li>Monitoring + Sentry + uptime uyarıları</li>\n          <li>6 Monate Bugfix-Garantie</li>\n          <li class="mute">Individuelle B2B-Workflows · ERP-Anbindung</li>',
    '>Sabit fiyat</span></div>\n        <span class="hint">normalde €1.890 · 5–6 haftada canlı</span>\n        <ul>\n          <li>Start\'taki her şey, artı:</li>\n          <li>6 sayfaya kadar · Bireysel tasarım</li>\n          <li>İki dilli (DE + EN veya DE + TR)</li>\n          <li>Cookieless analytics (Plausible)</li>\n          <li>Google Business + Maps kurulumu</li>\n          <li>3 revizyon turu · 60 dk tanışma görüşmesi</li>\n          <li class="mute">Üçüncü dil · Blog · Yerinde çekim</li>');
  // Signature card
  h = h.replace('B2B-Anwendungen, Integrationen, Sonderfälle.',
    'Eksiksiz online varlık, tam bakım.');
  h = h.replace('Für alles, was keine Schablone verträgt: interne Tools, Dashboards, ERP-Anbindungen, Datenpipelines, Apps.',
    'Doğru yapmak isteyen işletmeler için: üç dilli, blog, Yukarı Avusturya\'da yerinde fotoğraf çekimi.');
  h = h.replace('>+ netto</span></div>\n        <span class="hint">ab · 10–20 Wochen je nach Scope</span>\n        <ul>\n          <li>Alles aus Standard, plus:</li>\n          <li>Individuelles Datenmodell &amp; API-Design</li>\n          <li>ERP- / CRM- / WaWi-Integration</li>\n          <li>Rollen-, Rechte- &amp; Audit-System</li>\n          <li>Native App (iOS / Android) optional</li>\n          <li>Özel proje kanalı &amp; haftalık sync</li>\n          <li>12 Monate Bugfix-Garantie</li>\n          <li>SLA mit Reaktionszeiten</li>',
    '>Sabit fiyat</span></div>\n        <span class="hint">normalde €2.490 · 6–8 haftada canlı</span>\n        <ul>\n          <li>Pro\'daki her şey, artı:</li>\n          <li>10 sayfaya kadar</li>\n          <li>Üç dilli (DE + EN + TR veya tercih)</li>\n          <li>Blog / haber bölümü (CMS)</li>\n          <li>Yerinde fotoğraf çekimi (Linz bölgesi)</li>\n          <li>Sınırsız revizyon turu</li>\n          <li>90 gün lansman sonrası destek dahil</li>');
  h = h.replace('Scope besprechen', 'Talep gönder');
  h = h.replace('Möbel Weinberger', 'Reitsportzentrum Traunsee');
  // Feature table
  h = h.replace('>Kompakt</th>', '>Start</th>');
  h = h.replace('>Standard</th>', '>Pro</th>');
  h = h.replace('>Custom</th>', '>Signature</th>');
  // Feature table simplify
  const tbodyRe = /<tbody>[\s\S]*?<\/tbody>/;
  h = h.replace(tbodyRe, `<tbody>
            <tr><td>Özel tasarım (CI'nize göre)</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Responsive (mobil, tablet, masaüstü)</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>İletişim formu + GDPR onayı</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Künye / gizlilik / GŞK şablonu</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Temel SEO (meta, sitemap, robots.txt)</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>AT hosting kurulumu + SSL</td><td><span class="y">✓</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Sayfa sayısı</td><td>3'e kadar</td><td class="mark">6'ya kadar</td><td>10'a kadar</td></tr>
            <tr><td>Diller</td><td>1</td><td class="mark">2</td><td>3</td></tr>
            <tr><td>Cookieless analytics (Plausible)</td><td><span class="n">—</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Google Business + Maps kurulumu</td><td><span class="n">—</span></td><td class="mark"><span class="y">✓</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Blog / haber bölümü</td><td><span class="n">—</span></td><td class="mark"><span class="n">—</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Yerinde fotoğraf çekimi</td><td><span class="n">—</span></td><td class="mark"><span class="n">—</span></td><td><span class="y">✓</span></td></tr>
            <tr><td>Revizyon turları</td><td>1</td><td class="mark">3</td><td>Sınırsız</td></tr>
            <tr><td>Lansman süresi</td><td>4–5 hafta</td><td class="mark">5–6 hafta</td><td>6–8 hafta</td></tr>
          </tbody>`);
  h = h.replace('Volle Transparenz: 16 Leistungen über 4 Gruppen. Sie sehen Zeile für Zeile, was in welchem Tier drin ist — und was nicht.',
    'Tam şeffaflık. Satır satır, hangi pakette ne var, ne yok görebilirsiniz.');
  h = h.replace('>Was ist enthalten<', '>Neler dahil<');
  h = h.replace('>Leistungen im Vergleich.<', '>Hizmetler karşılaştırması.<');
  h = h.replace('>Leistung</th>', '>Hizmet</th>');
  // Maintenance
  h = h.replace('>Her şey akmaya devam eder.<', '>Çalışır &amp; güvenli.<');
  h = h.replace('>Geliştirme de dahil.<', '>Sizinle büyür.<');
  h = h.replace('>SLA + sabit muhatap.<', '>Tam huzur.<');
  h = h.replace('>Basis<', '>Care Basic<');
  h = h.replace('Security-Patches &amp; Framework-Updates</li>\n          <li>Günlük backup + çeyreklik restore provası</li>\n          <li>Uptime-Monitoring 24/7</li>\n          <li>E-posta desteği · iş günlerinde &lt; 48 sa yanıt</li>\n          <li>Ayda 1 saat içerik düzenleme</li>',
    'Hosting + domain + SSL (hepsi dahil)</li>\n          <li>Günlük yedekleme + aylık geri yükleme kontrolü</li>\n          <li>Aylık güvenlik yamaları</li>\n          <li>Uptime izleme 24/7</li>\n          <li>E-posta desteği · iş günlerinde &lt; 24 sa yanıt</li>\n          <li style="color:rgba(255,255,255,.45);">İçerik değişiklikleri: +€60/sa</li>');
  h = h.replace('>Standard<', '>Care Plus<');
  h = h.replace('Baz paketteki her şey</li>\n          <li>Ayda 4 saat geliştirme zamanı</li>\n          <li>İş günlerinde &lt; 8 sa, hafta sonunda &lt; 24 sa yanıt</li>\n          <li>Aylık raporlama (uptime, performans, güvenlik)</li>\n          <li>Mesai saatlerinde telefon desteği</li>',
    'Care Basic\'teki her şey</li>\n          <li>Haftalık güvenlik yamaları</li>\n          <li>Ayda 1 saat içerik değişikliği</li>\n          <li>Aylık performans raporu</li>\n          <li>İş günlerinde &lt; 8 sa yanıt</li>');
  h = h.replace('>Premium<', '>Care Premium<');
  h = h.replace('Standart paketteki her şey</li>\n          <li>Ayda 10 saat geliştirme zamanı (3 ay devreder)</li>\n          <li>SLA · &lt; 2 sa yanıt, &lt; 8 sa bugfix penceresi</li>\n          <li>Özel proje kanalı (Slack / Teams)</li>\n          <li>Çeyreklik roadmap görüşmesi</li>',
    'Care Plus\'taki her şey</li>\n          <li>Haftalık güvenlik yamaları</li>\n          <li>Ayda 3 saat içerik değişikliği</li>\n          <li>Çeyreklik SEO ince ayar</li>\n          <li>Öncelikli destek · &lt; 2 sa yanıt</li>');
  // Calculator
  h = h.replace('Beş girdi, canlı hesaplanan bir aralık. Bağlayıcı değil ama son 24 projedeki gerçek tecrübeye dayanıyor.',
    'Dört girdi, canlı hesaplanan aralık. Bağlayıcı değil ama gerçekçi bir yönlendirme.');
  h = h.replace('>Online mağaza<', '>Çok Dilli<');
  h = h.replace('>Web-App / Portal<', '>Komple Paket<');
  h = h.replace('>Custom-B2B<', '>Özel / B2B<');
  // Scope group removal
  const scopeRe = /\s*<div class="grp">\s*<span class="lab">Kapsam<\/span>.*?<\/div>\s*<\/div>/s;
  h = h.replace(scopeRe, '');
  // Calc result defaults
  h = h.replace('>9.000</span>', '>990</span>');
  h = h.replace('>€9.000</b>', '>€990</b>');
  h = h.replace('>€120</b></div>', '>€79</b></div>');
  // Calc maint buttons  
  h = h.replace('Baz · €120/ay', 'Care Basic · €79/ay');
  h = h.replace('Standart · €280/ay', 'Care Plus · €129/ay');
  h = h.replace('Premium · €480/ay', 'Care Premium · €175/ay');
  // Integration labels
  h = h.replace('>1 System</button>', '>Analytics</button>');
  h = h.replace('>2 sistem</button>', '>Online rezervasyon</button>');
  h = h.replace('>3+ (ERP, CRM…)</button>', '>Ödemeler / Mağaza</button>');
  // Addons
  h = h.replace('Sık istenen sekiz ek hizmet — net fiyatlı, hemen eklenebilir. Burada olmayan her şey ayrıca tekliflenir.',
    'Sık istenen yedi ek hizmet — net fiyatlı, hemen eklenebilir.');
  // Remove enterprise addons
  const addonRe = /<div class="addon reveal">\s*<span class="tag">Shop<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe, '');
  const addonRe2 = /<div class="addon reveal">\s*<span class="tag">Integration<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe2, '');
  const addonRe3 = /<div class="addon reveal">\s*<span class="tag">Content<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe3, '');
  const addonRe4 = /<div class="addon reveal">\s*<span class="tag">Mobile<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe4, '');
  const addonRe5 = /<div class="addon reveal">\s*<span class="tag">Beratung<\/span>[\s\S]*?<\/div>\s*<\/div>/;
  h = h.replace(addonRe5, '');
  // Guarantees
  h = h.replace('bei SLA-Kunden', 'Care Premium müşterilerinde');
  h = h.replace('Budget-Korridor', 'Kaynak kod erişimi');
  // Scope row removal from breakdown  
  const scopeRowRe = /\s*<div class="row"><span>Kapsam<\/span><b id="brkSize">.*?<\/b><\/div>/g;
  h = h.replace(scopeRowRe, '');
  const scopeRowRe2 = /\s*<div class="row"><span>Scope<\/span><b id="brkSize">.*?<\/b><\/div>/g;
  h = h.replace(scopeRowRe2, '');
  // Umfang-Faktor row
  const umfangRe = /\s*<div class="row"><span>Umfang-Faktor<\/span><b id="brkSize">.*?<\/b><\/div>/g;
  h = h.replace(umfangRe, '');
  return h;
}

// ── PROCESS FILES ──
function processFile(path, langPatch) {
  let html = readFileSync(path, 'utf8');
  // Apply shared replacements
  for (const [from, to] of SHARED) {
    if (to === null) continue; // skip; handled by lang-specific
    html = html.replaceAll(from, to);
  }
  html = langPatch(html);
  writeFileSync(path, html, 'utf8');
  console.log(`✅ ${path}`);
}

processFile(join(ROOT, 'public/designed/en/preise.html'), patchEN);
processFile(join(ROOT, 'public/designed/tr/preise.html'), patchTR);

// ── UPDATE API ROUTE ──
const apiPath = join(ROOT, 'src/app/api/contact/route.ts');
let api = readFileSync(apiPath, 'utf8');
// Update LAB type mappings
api = api.replace('"9000": "Website"', '"990": "Website"');
api = api.replace('"18000": "Online-Shop"', '"1490": "Multi-Language"');
api = api.replace('"24000": "Web-App / Portal"', '"1990": "Komplett-Paket"');
api = api.replace('"32000": "Custom-B2B"', '"2990": "Custom / B2B"');
api = api.replace('"9000": "Website"', '"990": "Website"');
api = api.replace('"18000": "Online shop"', '"1490": "Multi-Language"');
api = api.replace('"24000": "Web app / portal"', '"1990": "Complete Package"');
api = api.replace('"32000": "Custom B2B"', '"2990": "Custom / B2B"');
api = api.replace('"9000": "Website"', '"990": "Web sitesi"');
api = api.replace('"18000": "Online mağaza"', '"1490": "Çok Dilli"');
api = api.replace('"24000": "Web uygulaması / portal"', '"1990": "Komple Paket"');
api = api.replace('"32000": "Özel B2B"', '"2990": "Özel / B2B"');
// Remove size mappings entirely by replacing the size objects with empty
api = api.replace(/size: \{[^}]+\},/g, 'size: {},');
// Update int mappings
api = api.replaceAll('"1800":', '"250":');
api = api.replaceAll('"3400":', '"400":');
api = api.replaceAll('"5200":', '"700":');
api = api.replace('"250": "1 System"', '"250": "Analytics"');
api = api.replace('"400": "2 Systeme"', '"400": "Online-Buchung"');
api = api.replace('"700": "3+ (ERP, CRM…)"', '"700": "Zahlungen / Shop"');
api = api.replace('"250": "1 system"', '"250": "Analytics"');
api = api.replace('"400": "2 systems"', '"400": "Online booking"');
api = api.replace('"700": "3+ (ERP, CRM…)"', '"700": "Payments / Shop"');
api = api.replace('"250": "1 sistem"', '"250": "Analytics"');
api = api.replace('"400": "2 sistem"', '"400": "Online rezervasyon"');
api = api.replace('"700": "3+ (ERP, CRM…)"', '"700": "Ödemeler / Mağaza"');
// Update lang mappings
api = api.replaceAll('"1200":', '"300":');
api = api.replaceAll('"2400":', '"500":');
api = api.replaceAll('"3600":', '"800":');
// Update maint mappings
api = api.replace('"120": "Basis · €120/Monat"', '"79": "Care Basic · €79/Monat"');
api = api.replace('"280": "Standard · €280/Monat"', '"129": "Care Plus · €129/Monat"');
api = api.replace('"480": "Premium · €480/Monat"', '"175": "Care Premium · €175/Monat"');
api = api.replace('"120": "Basic · €120/month"', '"79": "Care Basic · €79/month"');
api = api.replace('"280": "Standard · €280/month"', '"129": "Care Plus · €129/month"');
api = api.replace('"480": "Premium · €480/month"', '"175": "Care Premium · €175/month"');
api = api.replace('"120": "Temel · €120/ay"', '"79": "Care Basic · €79/ay"');
api = api.replace('"280": "Standart · €280/ay"', '"129": "Care Plus · €129/ay"');
api = api.replace('"480": "Premium · €480/ay"', '"175": "Care Premium · €175/ay"');
// Update hasConfig to not require size
api = api.replace('const hasConfig = Boolean(lab.type[cfgType] && lab.size[cfgSize]);',
  'const hasConfig = Boolean(lab.type[cfgType]);');

writeFileSync(apiPath, api, 'utf8');
console.log(`✅ ${apiPath}`);
console.log('\n🎉 Pricing repositioning complete for EN + TR + API route');
