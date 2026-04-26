/**
 * pricing-cleanup.mjs — Fix remaining legacy prices across ALL pages
 * Run: node scripts/pricing-cleanup.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
const ROOT = join(import.meta.dirname, '..');
const D = (p) => join(ROOT, 'public/designed', p);

function patch(path, replacements) {
  if (!existsSync(path)) { console.log(`⏭ ${path} not found`); return; }
  let html = readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    if (html.includes(from)) {
      html = html.replaceAll(from, to);
    }
  }
  writeFileSync(path, html, 'utf8');
  console.log(`✅ ${path}`);
}

// ── LOESUNGEN pages: replace "Ab €X" pricing in solution cards ──
const LOES_DE = [
  ['€12.000</div>', '€1.490</div>'],
  ['€9.000</div></div>', '€990</div></div>'],
  ['€18.000</div></div>', '€1.490</div></div>'],
  ['€9.000 <s>einmalig</s>', '€990 <s>Festpreis</s>'],
  ['€18.000 <s>einmalig</s>', '€1.490 <s>Festpreis</s>'],
  ['€30.000+ <s>projektbezogen</s>', '€1.990 <s>Festpreis</s>'],
  ['€18.000\'luk', '€1.490\'luk'],
  ['Yolun yarısında çıkan €18.000', 'Yolun yarısında çıkan €1.490'],
  ['halfway through — just a quote', 'halfway through — just a quote'],
  ['"unexpected change requests" for €18,000', '"unexpected change requests" for €1,490'],
  ['Hesabı proje bitince değil, başında yaparız. Yolun yarısında çıkan €1.490\'luk "beklenmedik change request" yok',
   'Hesabı proje bitince değil, başında yaparız. Yarı yolda sürpriz ek maliyet yok'],
];
const LOES_EN = [
  ['€12.000</div>', '€1.490</div>'],
  ['€9.000</div></div>', '€990</div></div>'],
  ['€18.000</div></div>', '€1.490</div></div>'],
  ['€9.000 <s>one-off</s>', '€990 <s>fixed price</s>'],
  ['€18.000 <s>one-off</s>', '€1.490 <s>fixed price</s>'],
  ['€30.000+ <s>project-based</s>', '€1.990 <s>fixed price</s>'],
  ['"unexpected change requests" for €18,000 halfway', '"unexpected change requests" for €1,490 halfway'],
];
const LOES_TR = [
  ['€12.000</div>', '€1.490</div>'],
  ['€9.000</div></div>', '€990</div></div>'],
  ['€18.000</div></div>', '€1.490</div></div>'],
  ['€9.000 <s>tek seferlik</s>', '€990 <s>sabit fiyat</s>'],
  ['€18.000 <s>tek seferlik</s>', '€1.490 <s>sabit fiyat</s>'],
  ['€30.000+ <s>projeye özel</s>', '€1.990 <s>sabit fiyat</s>'],
  ["€18.000'luk", "€1.490'luk"],
];

patch(D('de/loesungen.html'), LOES_DE);
patch(D('en/loesungen.html'), LOES_EN);
patch(D('tr/loesungen.html'), LOES_TR);
patch(D('loesungen.html'), LOES_DE); // root = DE copy

// ── KONTAKT pages: update "Ab ca. €9.000" FAQ ──
const KONT_DE = [
  ['Ab ca. €9.000 (Website). Darunter verweisen wir auf Kollegen — weil wir sonst beiden Seiten keinen Gefallen tun.',
   'Unsere Pakete starten bei €990 (Start). Wir finden in einem kurzen Gespräch heraus, welches Paket am besten passt.'],
];
const KONT_EN = [
  ['From roughly €9,000 upwards (website). Below that we refer you to trusted peers — otherwise it does neither side any favours.',
   'Our packages start at €990 (Start). A quick call will help us find the right package for you.'],
];
const KONT_TR = [
  ['Yaklaşık €9.000\'dan başlıyoruz (web sitesi). Bunun altındaki işler için güvendiğimiz ekiplere yönlendiriyoruz.',
   'Paketlerimiz €990\'dan başlıyor (Start). Kısa bir görüşmeyle hangi paketin size uygun olduğunu birlikte belirleriz.'],
];
patch(D('de/kontakt.html'), KONT_DE);
patch(D('en/kontakt.html'), KONT_EN);
patch(D('tr/kontakt.html'), KONT_TR);
patch(D('kontakt.html'), KONT_DE); // root = DE copy

// ── HOMEPAGE pages: update competitor price range ──
const HOME_ALL = [
  ['€2.500 – €3.500', '€990 – €1.990'],
];
patch(D('de/homepage.html'), HOME_ALL);
patch(D('en/homepage.html'), HOME_ALL);
patch(D('tr/homepage.html'), HOME_ALL);
patch(D('homepage.html'), HOME_ALL); // root = DE copy

// ── EN/TR PREISE: fix remaining SLA/enterprise terms in myths/guarantees/FAQ ──
const EN_PREISE_FIX = [
  // Myths
  ['The <b>template</b> costs €2,000. A website that matches your brand and runs for three years after launch without grief starts at about €9,000 — otherwise you pay the difference later in agency-switch hours.',
   'That\'s not wrong — simple templates run €500–€2,000. Our <b>Start package (€990)</b> sits right in that range, but: custom design instead of template, GDPR setup included, source code is yours, no vendor lock-in.'],
  // Guarantees  
  ['99.9 %', '99.5 %'],
  ['Every minute above the SLA outage threshold is refunded proportionally.',
   'Every minute of downtime above target is transparently communicated.'],
  ['Budget corridor', 'Source code access'],
  ['The quote binds us up to +15%. Any overrun beyond that is on us, not on you.',
   'The Git repo is yours. Lifetime access, no vendor lock-in. You can switch any time.'],
  ['for SLA clients', 'for Care Premium clients'],
  // FAQ
  ['Three instalments: 33% at kickoff (after signing), 33% after the completed user acceptance test (your sign-off), 34% on launch day. Payment term 14 days net each, SEPA or bank transfer. No 100% upfront, no final invoice three months later.',
   '50% at project start, 50% at launch. Payment term 14 days net, SEPA or bank transfer. No 100% upfront, no final invoice three months later.'],
  ['Once the final invoice is paid, the source code transfers fully into your ownership (buyout clause in the contract). You receive the Git repository, CI/CD pipelines, all design files (Figma) and the infrastructure definition. We only keep the right to show the project as a reference — if you want us to.',
   'Once the final invoice is paid, the source code transfers fully into your ownership (buyout clause in the contract). You receive the Git repository, all design files and the infrastructure definition. No vendor lock-in.'],
  ['Yes, after a technical audit first (€1,400, credited if we continue). We review architecture, security and maintainability, produce a 30-page report and then quote the takeover. No audit, no takeover — otherwise we would be promising blind.',
   'Yes, we\'re happy to discuss. Get in touch and we\'ll assess the situation together in a free initial consultation.'],
  ['Three documents: (1) project contract with scope, milestones and price, (2) terms with liability, warranty and guarantee clauses, (3) optional maintenance agreement with SLA. You receive all documents as PDF drafts before accepting the quote. No small-print traps.',
   'Two documents: (1) project contract with scope, milestones and price, (2) optional maintenance agreement. You receive all documents as PDF drafts before accepting the quote. No small-print traps.'],
  ['Können Sie auch bestehende Software übernehmen?', 'Can you take over existing software?'],
];
patch(D('en/preise.html'), EN_PREISE_FIX);

const TR_PREISE_FIX = [
  // Myths - Mythos 01
  ['Şablon</b> 2.000 €\'ya mal olur. Canlıya alındıktan sonra üç yıl sorunsuz çalışan ve CI\'nize uyan bir web sitesi en az €9.000\'dan başlar — ya da aradaki farkı daha sonra ajans değişikliği saatlerinde ödersiniz.',
   'Bu yanlış değil — basit şablonlar €500–€2.000 arasında. Bizim <b>Start paketimiz (€990)</b> tam bu aralıkta, ama: şablon yerine özel tasarım, GDPR kurulumu dahil, kaynak kod size ait, vendor lock-in yok.'],
  // Guarantees
  ['99,9 %', '99,5 %'],
  ['SLA üstü her kesinti dakikası oransal olarak iade edilir.',
   'Hedef üstü her kesinti dakikası şeffaf olarak raporlanır.'],
  ['Bütçe koridoru', 'Kaynak kod erişimi'],
  ['Teklif bizi +%15\'e kadar bağlar. Üstündeki ek çalışma bize aittir, size değil.',
   'Git deposu size aittir. Ömür boyu erişim, vendor lock-in yok. İstediğiniz zaman geçiş yapabilirsiniz.'],
  ['SLA müşterilerinde', 'Care Premium müşterilerinde'],
  // FAQ  
  ['Üç taksit: sözleşme imzasında %33, kullanıcı kabul testinden (sizin onayınız) sonra %33, canlıya alındığı gün %34. Her biri 14 gün net vade, SEPA veya banka havalesi. %100 ön ödeme yok, 3 ay sonra sürpriz fatura yok.',
   'Proje başlangıcında %50, canlıya alınma anında %50. Ödeme vadesi 14 gün net, SEPA veya banka havalesi. %100 ön ödeme yok, sürpriz fatura yok.'],
  ['Kaynak kod son faturayla birlikte tamamen sizin mülkiyetinize geçer (sözleşmede buyout maddesi var). Git repo, CI/CD pipeline\'ları, tüm tasarım dosyaları (Figma) ve altyapı tanımı size teslim edilir. Biz sadece, isterseniz projeyi referans olarak göstermeyi sürdürürüz.',
   'Kaynak kod son faturayla birlikte tamamen sizin mülkiyetinize geçer (sözleşmede buyout maddesi var). Git repo, tüm tasarım dosyaları ve altyapı tanımı size teslim edilir. Vendor lock-in yok.'],
  ['Evet, ama önce teknik audit ile (€1.400, iş alınırsa mahsup edilir). Mimarinin, güvenliğin ve bakım yapılabilirliğin durumuna bakar; 30 sayfalık rapor ve devralma teklifi çıkarırız. Audit olmadan devralma yok — neyi vaat ettiğimizi bilmeden söz vermeyiz.',
   'Evet, memnuniyetle konuşalım. Bize ulaşın, ilk ücretsiz görüşmede durumu birlikte değerlendirelim.'],
  ['Üç doküman: (1) kapsam, kilometre taşları ve fiyatı içeren iş sözleşmesi, (2) sorumluluk, garanti ve teminat maddeleriyle genel şartlar, (3) opsiyonel SLA\'lı bakım sözleşmesi. Tüm belgeler teklif kabulünden önce PDF taslak olarak gelir. Küçük yazı oyunu yok.',
   'İki doküman: (1) kapsam, kilometre taşları ve fiyatı içeren iş sözleşmesi, (2) opsiyonel bakım sözleşmesi. Tüm belgeler teklif kabulünden önce PDF taslak olarak gelir. Küçük yazı oyunu yok.'],
];
patch(D('tr/preise.html'), TR_PREISE_FIX);

// ── ROOT PREISE (legacy, not served but still present) ──
// Just do the same price replacements to keep files consistent
const ROOT_PREISE = [
  ['€9.000</span><span class="cur">netto', '€990</span><span class="cur">Festpreis'],
  ['€18.000</span><span class="cur">netto', '€1.490</span><span class="cur">Festpreis'],
  ['€30.000</span><span class="cur">+ netto', '€1.990</span><span class="cur">Festpreis'],
  ['€120</span><span class="per">/Monat', '€79</span><span class="per">/Monat'],
  ['€280</span><span class="per">/Monat', '€129</span><span class="per">/Monat'],
  ['€480</span><span class="per">/Monat', '€175</span><span class="per">/Monat'],
  ['€2.400 <s>einmalig', '€150 <s>Setup'],
  ['€3.500 <s>ab', '€120 <s>einmalig'],
  ['€1.800 <s>Paket', '€60 <s>/Stunde'],
  ['€12.000 <s>ab', '€390 <s>Paket'],
  ['€1.400 <s>Bericht', '€290 <s>Paket'],
  ['data-maint="120"', 'data-maint="79"'],
  ['data-maint="280"', 'data-maint="129"'],
  ['data-maint="480"', 'data-maint="175"'],
  ['data-base="9000"', 'data-base="990"'],
  ['data-base="18000"', 'data-base="1490"'],
  ['data-base="24000"', 'data-base="1990"'],
  ['data-base="32000"', 'data-base="2990"'],
  ['>€9.000</b>', '>€990</b>'],
  ['type:9000', 'type:990'],
  ['maint:120', 'maint:79'],
  ['Basis · €120/Mo', 'Care Basic · €79/Mo'],
  ['Standard · €280/Mo', 'Care Plus · €129/Mo'],
  ['Premium · €480/Mo', 'Care Premium · €175/Mo'],
];
patch(D('preise.html'), ROOT_PREISE);

console.log('\n🎉 Cleanup complete — all pages updated');
