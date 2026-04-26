import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const designedDir = path.join(root, "public", "designed");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buckberrylabs.com";

const pageFiles = {
  homepage: "homepage.html",
  loesungen: "loesungen.html",
  referenzen: "referenzen.html",
  preise: "preise.html",
  fallstudie: "fallstudie.html",
  kontakt: "kontakt.html",
};

const routes = {
  de: {
    homepage: "/de/",
    loesungen: "/de/loesungen",
    referenzen: "/de/referenzen",
    preise: "/de/preise",
    fallstudie: "/de/fallstudie",
    kontakt: "/de/kontakt",
  },
  en: {
    homepage: "/en/",
    loesungen: "/en/solutions",
    referenzen: "/en/references",
    preise: "/en/pricing",
    fallstudie: "/en/case-study",
    kontakt: "/en/contact",
  },
  tr: {
    homepage: "/tr/",
    loesungen: "/tr/cozumler",
    referenzen: "/tr/referanslar",
    preise: "/tr/fiyatlar",
    fallstudie: "/tr/vaka-calismasi",
    kontakt: "/tr/iletisim",
  },
};

const deKeys = {
  homepage: "de/",
  loesungen: "de/loesungen",
  referenzen: "de/referenzen",
  preise: "de/preise",
  fallstudie: "de/fallstudie",
  kontakt: "de/kontakt",
};

const localeMeta = {
  homepage: {
    de: {
      title: "Buckberry Labs — Software, handverlesen aus Linz.",
      description:
        "Individuelle Plattformen für KMUs in Österreich und im DACH-Raum. Kein Baukasten, kein Template, kein Agentur-Lock-in.",
    },
    en: {
      title: "Buckberry Labs — Software, carefully built in Linz.",
      description:
        "Custom platforms for SMEs in Austria and the DACH region. No builder, no template, no agency lock-in.",
    },
    tr: {
      title: "Buckberry Labs — Linz çıkışlı, özenle geliştirilen yazılım.",
      description:
        "Avusturya ve DACH bölgesindeki KOBİ'ler için özel platformlar. Hazır kalıp yok, template yok, ajans kilidi yok.",
    },
  },
  loesungen: {
    de: {
      title: "Lösungen — Buckberry Labs",
      description:
        "Fünf konkrete Software-Lösungen für E-Commerce, Vereine, Gastronomie, Logistik und individuelle B2B-Prozesse.",
    },
    en: {
      title: "Solutions — Buckberry Labs",
      description:
        "Five concrete software solutions for ecommerce, clubs, hospitality, logistics, and custom B2B workflows.",
    },
    tr: {
      title: "Çözümler — Buckberry Labs",
      description:
        "E-ticaret, kulüpler, gastronomi, lojistik ve özel B2B süreçleri için beş somut yazılım çözümü.",
    },
  },
  referenzen: {
    de: {
      title: "Referenzen — Buckberry Labs",
      description:
        "Sechs reale Systeme, die heute live sind: Shops, Buchungssysteme, Portale und operative Software im täglichen Einsatz.",
    },
    en: {
      title: "References — Buckberry Labs",
      description:
        "Six real systems that are live today: shops, booking systems, portals, and operational software in daily use.",
    },
    tr: {
      title: "Referanslar — Buckberry Labs",
      description:
        "Bugün canlıda çalışan altı gerçek sistem: mağazalar, rezervasyon sistemleri, portallar ve günlük operasyonda kullanılan yazılımlar.",
    },
  },
  preise: {
    de: {
      title: "Preise — Buckberry Labs",
      description:
        "Drei klare Pakete, transparente Leistungen und ein Preisrechner mit unverändertem Anfrage-Übergang.",
    },
    en: {
      title: "Pricing — Buckberry Labs",
      description:
        "Three clear packages, transparent scope, and a pricing calculator that hands its state to the contact page unchanged.",
    },
    tr: {
      title: "Fiyatlar — Buckberry Labs",
      description:
        "Üç net paket, şeffaf kapsam ve durumunu iletişim sayfasına aynen aktaran bir fiyat hesaplayıcı.",
    },
  },
  fallstudie: {
    de: {
      title: "Fallstudie — Buckberry Labs",
      description:
        "Wie Yilmaz Souvenirs vom stationären Laden zum skalierenden Online-Shop wurde — mit Zahlen, Screenshots und Lessons Learned.",
    },
    en: {
      title: "Case Study — Buckberry Labs",
      description:
        "How Yilmaz Souvenirs moved from a physical shop to a scaling online store — with numbers, screenshots, and lessons learned.",
    },
    tr: {
      title: "Vaka Çalışması — Buckberry Labs",
      description:
        "Yilmaz Souvenirs fiziksel mağazadan ölçeklenen online mağazaya nasıl geçti — rakamlar, ekran görüntüleri ve çıkarımlarla.",
    },
  },
  kontakt: {
    de: {
      title: "Kontakt — Buckberry Labs",
      description:
        "Kostenloses 30-Minuten-Gespräch. Ehrliche Antwort innerhalb von 24 Stunden.",
    },
    en: {
      title: "Contact — Buckberry Labs",
      description:
        "Free 30-minute call. Straight answer within 24 hours.",
    },
    tr: {
      title: "İletişim — Buckberry Labs",
      description:
        "Ücretsiz 30 dakikalık görüşme. 24 saat içinde net bir yanıt.",
    },
  },
};

const localeUi = {
  de: {
    htmlLang: "de",
    switchAria: "Sprache wechseln",
    menuAria: "Menü",
  },
  en: {
    htmlLang: "en",
    switchAria: "Switch language",
    menuAria: "Menu",
  },
  tr: {
    htmlLang: "tr",
    switchAria: "Dili değiştir",
    menuAria: "Menü",
  },
};

const commonStyle = `
  .lang-switch{display:flex;align-items:center;gap:10px;font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;}
  .lang-switch a{display:inline;color:inherit;text-decoration:none;opacity:.55;transition:opacity .2s,color .2s;font-size:12px;padding:0;border:0;}
  .lang-switch a:hover{opacity:1;}
  .lang-switch a.active{opacity:1;color:var(--deep-mint);font-weight:700;}
  .lang-switch .sep{opacity:.28;}
  .mobile-panel .lang-switch{margin-top:24px;padding-top:24px;border-top:1px solid rgba(255,255,255,.08);}
  .mobile-panel .lang-switch a{color:#fff;}
  .mobile-panel .lang-switch a.active{color:var(--mint);}
  @media(max-width:900px){ .nav-right .lang-switch{display:none;} }
  @media(min-width:901px){ .mobile-panel .lang-switch{display:none;} }
`;

const commonVisible = {
  en: [
    ['aria-label="Buckberry Labs Startseite"', 'aria-label="Buckberry Labs homepage"'],
    ['aria-label="Buckberry Labs"', 'aria-label="Buckberry Labs"'],
    ['aria-label="Menü"', 'aria-label="Menu"'],
    ['>Lösungen<', '>Solutions<'],
    ['>Referenzen<', '>References<'],
    ['>Preise<', '>Pricing<'],
    ['>Kontakt<', '>Contact<'],
    ['>Start</a>', '>Home</a>'],
    ['>Über uns<', '>About<'],
    ['>Projekt starten <', '>Start project <'],
    ['>Anfrage senden <', '>Send enquiry <'],
    ['>Termin buchen <', '>Book a call <'],
    ['>Software, handverlesen.<', '>Software, carefully chosen.<'],
    ['Linz, Österreich', 'Linz, Austria'],
    ['entwickelt in Linz, AT · hosted on Vercel', 'built in Linz, AT · hosted on Vercel'],
    ['oder schreiben Sie uns:', 'or email us:'],
  ],
  tr: [
    ['aria-label="Buckberry Labs Startseite"', 'aria-label="Buckberry Labs ana sayfa"'],
    ['aria-label="Buckberry Labs"', 'aria-label="Buckberry Labs"'],
    ['aria-label="Menü"', 'aria-label="Menü"'],
    ['>Lösungen<', '>Çözümler<'],
    ['>Referenzen<', '>Referanslar<'],
    ['>Preise<', '>Fiyatlar<'],
    ['>Kontakt<', '>İletişim<'],
    ['>Start</a>', '>Ana sayfa</a>'],
    ['>Über uns<', '>Hakkımızda<'],
    ['>Projekt starten <', '>Projeyi başlat <'],
    ['>Anfrage senden <', '>Talep gönder <'],
    ['>Termin buchen <', '>Görüşme ayarla <'],
    ['>Software, handverlesen.<', '>Yazılım, özenle seçilmiş.<'],
    ['Linz, Österreich', 'Linz, Avusturya'],
    ['entwickelt in Linz, AT · hosted on Vercel', "Linz, AT'de geliştirildi · Vercel üzerinde barındırılıyor"],
    ['oder schreiben Sie uns:', 'veya bize yazın:'],
  ],
};

const pageReplacements = {
  homepage: {
    en: [
      ["Software-Labor · Linz, AT", "Software lab · Linz, AT"],
      ["Wir entwickeln Software,", "We build software,"],
      ["die Unternehmen wirklich brauchen.", "that businesses actually need."],
      [
        "Kein Baukasten. Kein Template. Individuelle Plattformen für KMUs in Österreich und DACH.",
        "No builder. No template. Custom platforms for SMEs in Austria and the DACH region.",
      ],
      ["Referenzen ansehen", "See references"],
      [">Scrollen<", ">Scroll<"],
      ["— 01 · Lösungen", "— 01 · Solutions"],
      ["Drei Plattformen, ein Handwerk.", "Three platforms, one craft."],
      [
        "Fertige Produkte für klare Probleme. Individuelle Systeme für alles dazwischen.",
        "Productised where the problem is clear. Custom where it is not.",
      ],
      ["Für den stationären Handel, der online wachsen will. Mehrsprachig, Stripe-ready, DSGVO-konform.", "For retail businesses that want to grow online. Multilingual, Stripe-ready, GDPR-compliant."],
      ["Platzbuchung & Vereine", "Court booking & clubs"],
      ["Online-Buchung, Mitgliederverwaltung, Trainerplanung. Für Hallen, Vereine und Sportanlagen.", "Online booking, member management, coach planning. For halls, clubs, and sports facilities."],
      ["Individuelle SaaS", "Custom SaaS"],
      ["Wenn Standardsoftware nicht mehr reicht. Wir bauen genau das, was Ihr Unternehmen braucht.", "When off-the-shelf software stops working. We build exactly what your business needs."],
      [">Mehr erfahren <", ">Learn more <"],
      ["— 02 · Prozess", "— 02 · Process"],
      ["Kein Baukasten.<br/>\n        Kein Boilerplate.", "No builder.<br/>\n        No boilerplate."],
      ["Gespräch", "Conversation"],
      ["Wir verstehen, bevor wir bauen.", "We understand first, then build."],
      ["Konzept", "Plan"],
      ["Scope, Stack, Milestones — schriftlich.", "Scope, stack, milestones — in writing."],
      ["Entwicklung", "Build"],
      ["Wöchentliche Check-ins. Keine Blackbox.", "Weekly check-ins. No black box."],
      ["Betrieb", "Operation"],
      ["Launch ist nicht das Ende.", "Launch is not the end."],
      ["Übersicht", "Overview"],
      ["Bestellungen", "Orders"],
      ["Produkte", "Products"],
      ["Kunden", "Customers"],
      ["Einstellungen", "Settings"],
      ["Übersicht · April 2026", "Overview · April 2026"],
      ["Umsatz", "Revenue"],
      ["Bezahlt", "Paid"],
      ["Offen", "Open"],
      ["Lagerbestand · Live", "Inventory · live"],
      ["— 03 · Referenz", "— 03 · Reference"],
      ["Komplette E-Commerce-Plattform für einen Souvenir-Händler in Österreich.", "Complete ecommerce platform for a souvenir retailer in Austria."],
      ["Yilmaz Souvenirs wollte den stationären Handel online ausweiten. Wir bauten ihnen eine vollständige Plattform — vom Admin-Dashboard bis zum DSGVO-konformen Checkout.", "Yilmaz Souvenirs wanted to extend its physical retail business online. We built the full platform — from admin dashboard to GDPR-compliant checkout."],
      ["Admin-Dashboard mit Kundenverwaltung", "Admin dashboard with customer management"],
      ["Multi-Language-Storefront (DE/EN/TR)", "Multi-language storefront (DE/EN/TR)"],
      ["Stripe-Checkout mit Echtzeit-Lagerbestand", "Stripe checkout with live inventory"],
      ["DSGVO-konforme Auftragsabwicklung", "GDPR-compliant order flow"],
      ["Fallstudie lesen", "Read case study"],
      ["— 04 · Warum wir", "— 04 · Why us"],
      ["Software, die nicht wie Software aussieht.", "Software that does not feel like software."],
      ["Handgemacht in Österreich.", "Built in Austria."],
      ["Kein Outsourcing nach Osteuropa oder Indien. Jede Zeile Code entsteht in Linz.", "No outsourcing to Eastern Europe or India. Every line of code is built in Linz."],
      ["Komplette Ownership.", "Full ownership."],
      ["Der Code gehört Ihnen. Kein Vendor-Lock-in, kein Lizenzzwang.", "The code is yours. No vendor lock-in, no licence trap."],
      ["Direkter Kontakt.", "Direct contact."],
      ["Kein Account-Manager zwischen uns. Sie sprechen mit den Leuten, die bauen.", "No account manager in the middle. You speak to the people who build it."],
      ["Wöchentliche Updates.", "Weekly updates."],
      ["Sie sehen Fortschritt, nicht Tickets. Echte Builds, keine PDFs.", "You see progress, not tickets. Real builds, not PDFs."],
      ["— 05 · Preise", "— 05 · Pricing"],
      ["Faire Preise. Transparente Pakete.", "Fair pricing. Transparent packages."],
      ["Keine versteckten Kosten. Keine „ab“-Preise ohne Ende.", "No hidden costs. No endless 'starting from' pricing."],
      ["Einmalige Einrichtung", "One-off setup"],
      ["Einmalig", "One-off"],
      ["Projekt-Setup", "Project setup"],
      ["Brand-Integration", "Brand integration"],
      ["Deployment", "Deployment"],
      ["Training", "Training"],
      ["Empfohlen", "Recommended"],
      ["Hosting & Support", "Hosting & support"],
      ["/Monat", "/month"],
      ["Wiederkehrend", "Recurring"],
      ["Hosting inkludiert", "Hosting included"],
      ["Updates & Wartung", "Updates & maintenance"],
      ["E-Mail-Support 24h", "Email support within 24h"],
      ["Monatliches Reporting", "Monthly reporting"],
      ["Paket wählen", "Choose package"],
      ["Individuelle Projekte", "Custom projects"],
      ["ab Anfrage", "on request"],
      ["Maßgeschneidert", "Tailored"],
      ["Komplett maßgeschneidert", "Fully tailored"],
      ["Multi-Modul-Systeme", "Multi-module systems"],
      ["Integration in bestehende IT", "Integration into existing IT"],
      ["Langfristige Partnerschaft", "Long-term partnership"],
      ["Gespräch vereinbaren", "Book a conversation"],
      ["Alle Details und Pakete", "All package details"],
      ['aria-label="Bereit, etwas Echtes zu bauen?"', 'aria-label="Ready to build something real?"'],
      [">Bereit,<", ">Ready,<"],
      [">etwas<", ">to build<"],
      [">Echtes<", ">something<"],
      [">zu<", ">for<"],
      [">bauen?<", ">real?<"],
      ["30 Minuten Gespräch. Kein Verkaufspitch. Nur ehrliche Fragen und konkrete Antworten.", "30 minutes. No sales pitch. Just honest questions and concrete answers."],
      ["oder schreiben Sie uns: info@buckberrylabs.com", "or email us: info@buckberrylabs.com"],
      [">Shop<", ">Shop<"],
      [">Sport<", ">Sport<"],
      [">Custom<", ">Custom<"],
      [">About<", ">About<"],
    ],
    tr: [
      ["Software-Labor · Linz, AT", "Yazılım laboratuvarı · Linz, AT"],
      ["Wir entwickeln Software,", "İşlerin gerçekten ihtiyaç duyduğu"],
      ["die Unternehmen wirklich brauchen.", "yazılımı geliştiriyoruz."],
      ["Kein Baukasten. Kein Template. Individuelle Plattformen für KMUs in Österreich und DACH.", "Hazır site yok. Template yok. Avusturya ve DACH bölgesindeki KOBİ'ler için özel platformlar."],
      ["Referenzen ansehen", "Referanslara bak"],
      [">Scrollen<", ">Kaydır<"],
      ["— 01 · Lösungen", "— 01 · Çözümler"],
      ["Drei Plattformen, ein Handwerk.", "Üç platform. Tek işçilik standardı."],
      ["Fertige Produkte für klare Probleme. Individuelle Systeme für alles dazwischen.", "Problem netse ürünleşiriz. Geri kalan her şeyi özel kurarız."],
      ["Für den stationären Handel, der online wachsen will. Mehrsprachig, Stripe-ready, DSGVO-konform.", "Online büyümek isteyen perakende işletmeler için. Çok dilli, Stripe hazır, GDPR uyumlu."],
      ["Platzbuchung & Vereine", "Saha rezervasyonu ve kulüpler"],
      ["Online-Buchung, Mitgliederverwaltung, Trainerplanung. Für Hallen, Vereine und Sportanlagen.", "Online rezervasyon, üye yönetimi, antrenör planlaması. Salonlar, kulüpler ve tesisler için."],
      ["Individuelle SaaS", "Özel SaaS"],
      ["Wenn Standardsoftware nicht mehr reicht. Wir bauen genau das, was Ihr Unternehmen braucht.", "Standart yazılım yetmediğinde, işletmenizin gerçekten ihtiyacı olanı kurarız."],
      [">Mehr erfahren <", ">Detayı gör <"],
      ["— 02 · Prozess", "— 02 · Süreç"],
      ["Kein Baukasten.<br/>\n        Kein Boilerplate.", "Hazır site yok.<br/>\n        Boilerplate yok."],
      ["Gespräch", "Görüşme"],
      ["Wir verstehen, bevor wir bauen.", "Önce anlarız, sonra kurarız."],
      ["Konzept", "Çerçeve"],
      ["Scope, Stack, Milestones — schriftlich.", "Kapsam, stack, kilometre taşları — yazılı."],
      ["Entwicklung", "Geliştirme"],
      ["Wöchentliche Check-ins. Keine Blackbox.", "Haftalık check-in. Kara kutu yok."],
      ["Betrieb", "İşletim"],
      ["Launch ist nicht das Ende.", "Launch son değil."],
      ["Übersicht", "Genel bakış"],
      ["Bestellungen", "Siparişler"],
      ["Produkte", "Ürünler"],
      ["Kunden", "Müşteriler"],
      ["Einstellungen", "Ayarlar"],
      ["Übersicht · April 2026", "Genel bakış · Nisan 2026"],
      ["Umsatz", "Ciro"],
      ["Bezahlt", "Ödendi"],
      ["Offen", "Açık"],
      ["Lagerbestand · Live", "Stok · canlı"],
      ["— 03 · Referenz", "— 03 · Referans"],
      ["Komplette E-Commerce-Plattform für einen Souvenir-Händler in Österreich.", "Avusturyalı bir hediyelik eşya satıcısı için uçtan uca e-ticaret platformu."],
      ["Yilmaz Souvenirs wollte den stationären Handel online ausweiten. Wir bauten ihnen eine vollständige Plattform — vom Admin-Dashboard bis zum DSGVO-konformen Checkout.", "Yilmaz Souvenirs fiziksel mağazasını online'a taşımak istiyordu. Biz de admin panelinden GDPR uyumlu checkout'a kadar tüm platformu kurduk."],
      ["Admin-Dashboard mit Kundenverwaltung", "Müşteri yönetimli admin paneli"],
      ["Multi-Language-Storefront (DE/EN/TR)", "Çok dilli storefront (DE/EN/TR)"],
      ["Stripe-Checkout mit Echtzeit-Lagerbestand", "Canlı stoklu Stripe checkout"],
      ["DSGVO-konforme Auftragsabwicklung", "GDPR uyumlu sipariş akışı"],
      ["Fallstudie lesen", "Vaka çalışmasını oku"],
      ["— 04 · Warum wir", "— 04 · Neden biz"],
      ["Software, die nicht wie Software aussieht.", "Yazılım gibi görünmeyen yazılım."],
      ["Handgemacht in Österreich.", "Avusturya'da üretilir."],
      ["Kein Outsourcing nach Osteuropa oder Indien. Jede Zeile Code entsteht in Linz.", "Doğu Avrupa'ya ya da Hindistan'a outsource yok. Her satır kod Linz'de çıkar."],
      ["Komplette Ownership.", "Tam sahiplik."],
      ["Der Code gehört Ihnen. Kein Vendor-Lock-in, kein Lizenzzwang.", "Kod sizin. Vendor lock-in yok, lisans kıskacı yok."],
      ["Direkter Kontakt.", "Doğrudan temas."],
      ["Kein Account-Manager zwischen uns. Sie sprechen mit den Leuten, die bauen.", "Arada account manager yok. Ürünü yapanlarla konuşursunuz."],
      ["Wöchentliche Updates.", "Haftalık güncelleme."],
      ["Sie sehen Fortschritt, nicht Tickets. Echte Builds, keine PDFs.", "Ticket değil, ilerleme görürsünüz. PDF değil, gerçek build."],
      ["— 05 · Preise", "— 05 · Fiyatlar"],
      ["Faire Preise. Transparente Pakete.", "Net fiyat. Şeffaf paketler."],
      ["Keine versteckten Kosten. Keine „ab“-Preise ohne Ende.", "Gizli maliyet yok. Ucu açık 'başlangıç' fiyatı yok."],
      ["Einmalige Einrichtung", "Tek seferlik kurulum"],
      ["Einmalig", "Tek seferlik"],
      ["Projekt-Setup", "Proje kurulumu"],
      ["Brand-Integration", "Marka entegrasyonu"],
      ["Deployment", "Deployment"],
      ["Training", "Eğitim"],
      ["Empfohlen", "Önerilen"],
      ["Hosting & Support", "Hosting ve destek"],
      ["/Monat", "/ay"],
      ["Wiederkehrend", "Aylık"],
      ["Hosting inkludiert", "Hosting dahil"],
      ["Updates & Wartung", "Güncelleme ve bakım"],
      ["E-Mail-Support 24h", "24 saat içinde e-posta desteği"],
      ["Monatliches Reporting", "Aylık raporlama"],
      ["Paket wählen", "Paketi seç"],
      ["Individuelle Projekte", "Özel projeler"],
      ["ab Anfrage", "talep üzerine"],
      ["Maßgeschneidert", "Özel kapsam"],
      ["Komplett maßgeschneidert", "Tamamen özel"],
      ["Multi-Modul-Systeme", "Çok modüllü sistemler"],
      ["Integration in bestehende IT", "Mevcut BT yapısına entegrasyon"],
      ["Langfristige Partnerschaft", "Uzun vadeli ortaklık"],
      ["Gespräch vereinbaren", "Görüşme planla"],
      ["Alle Details und Pakete", "Tüm paket detayları"],
      ['aria-label="Bereit, etwas Echtes zu bauen?"', 'aria-label="Gerçek bir şey kurmaya hazır mısınız?"'],
      [">Bereit,<", ">Hazır<"],
      [">etwas<", ">mısınız<"],
      [">Echtes<", ">gerçek bir şey<"],
      [">zu<", ">kurmaya<"],
      [">bauen?<", ">?<"],
      ["30 Minuten Gespräch. Kein Verkaufspitch. Nur ehrliche Fragen und konkrete Antworten.", "30 dakikalık görüşme. Satış konuşması yok. Sadece net sorular ve somut cevaplar."],
      ["oder schreiben Sie uns: info@buckberrylabs.com", "veya bize yazın: info@buckberrylabs.com"],
      [">Shop<", ">Shop<"],
      [">Sport<", ">Spor<"],
      [">Custom<", ">Custom<"],
      [">About<", ">Hakkımızda<"],
    ],
  },
};

function ensureDescription(html, description) {
  if (/<meta name="description"/.test(html)) {
    return html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);
  }
  return html.replace("</title>", `</title>\n<meta name="description" content="${description}" />`);
}

function withHead(html, locale, pageKey) {
  const meta = localeMeta[pageKey][locale];
  html = html.replace(/<html lang="[^"]+">/, `<html lang="${localeUi[locale].htmlLang}">`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  html = ensureDescription(html, meta.description);
  const canonical = `${siteUrl}${routes[locale][pageKey]}`;
  const alternates = ["de", "en", "tr"]
    .map(
      (code) =>
        `<link rel="alternate" hreflang="${code}" href="${siteUrl}${routes[code][pageKey]}" />`
    )
    .join("\n");
  const xDefault = `<link rel="alternate" hreflang="x-default" href="${siteUrl}${routes.de[pageKey]}" />`;
  const canonicalTag = `<link rel="canonical" href="${canonical}" />`;
  const headBlock = `${canonicalTag}\n${alternates}\n${xDefault}`;
  if (!html.includes(canonicalTag)) {
    html = html.replace("</head>", `${headBlock}\n</head>`);
  }
  return html;
}

function desktopSwitcher(locale, pageKey) {
  return `<div class="lang-switch" aria-label="${localeUi[locale].switchAria}">
      <a href="${routes.de[pageKey]}" data-lang-switch="de" class="${locale === "de" ? "active" : ""}">DE</a>
      <span class="sep">·</span>
      <a href="${routes.en[pageKey]}" data-lang-switch="en" class="${locale === "en" ? "active" : ""}">EN</a>
      <span class="sep">·</span>
      <a href="${routes.tr[pageKey]}" data-lang-switch="tr" class="${locale === "tr" ? "active" : ""}">TR</a>
    </div>`;
}

function mobileSwitcher(locale, pageKey) {
  return `<div class="lang-switch" aria-label="${localeUi[locale].switchAria}">
    <a href="${routes.de[pageKey]}" data-lang-switch="de" class="${locale === "de" ? "active" : ""}">DE</a>
    <span class="sep">·</span>
    <a href="${routes.en[pageKey]}" data-lang-switch="en" class="${locale === "en" ? "active" : ""}">EN</a>
    <span class="sep">·</span>
    <a href="${routes.tr[pageKey]}" data-lang-switch="tr" class="${locale === "tr" ? "active" : ""}">TR</a>
  </div>`;
}

function withSwitcher(html, locale, pageKey) {
  if (!html.includes(".lang-switch{")) {
    html = html.replace("</style>", `${commonStyle}\n</style>`);
  }
  html = html.replace('<div class="nav-right">', `<div class="nav-right">\n    ${desktopSwitcher(locale, pageKey)}`);
  html = html.replace(
    /(<div class="mobile-panel" id="mobilePanel">[\s\S]*?)(<\/div>)/,
    (_, start, end) => `${start}\n  ${mobileSwitcher(locale, pageKey)}\n${end}`
  );
  const langMap = Object.fromEntries(
    Object.keys(pageFiles).map((key) => [deKeys[key], { de: routes.de[key], en: routes.en[key], tr: routes.tr[key] }])
  );
  const switchScript = `<script>
const LANG_SWITCH_MAP = ${JSON.stringify(langMap, null, 2)};
const LANG_SWITCH_KEY = ${JSON.stringify(deKeys[pageKey])};
(() => {
  const current = LANG_SWITCH_MAP[LANG_SWITCH_KEY];
  if (!current) return;
  const suffix = location.search + location.hash;
  document.querySelectorAll('[data-lang-switch]').forEach((link) => {
    const target = current[link.getAttribute('data-lang-switch')];
    if (target) link.href = target + suffix;
  });
})();
</script>`;
  if (!html.includes("LANG_SWITCH_MAP")) {
    html = html.replace("</body>", `${switchScript}\n</body>`);
  }
  return html;
}

function withInternalPaths(html, locale) {
  const route = routes[locale];
  const replacements = [
    ['href="/#ueber"', `href="${route.homepage}#ueber"`],
    ['href="/#preise"', `href="${route.homepage}#preise"`],
    ['href="/loesungen#shop"', `href="${route.loesungen}#shop"`],
    ['href="/loesungen#sport"', `href="${route.loesungen}#sport"`],
    ['href="/loesungen#gastro"', `href="${route.loesungen}#gastro"`],
    ['href="/loesungen#log"', `href="${route.loesungen}#log"`],
    ['href="/loesungen#custom"', `href="${route.loesungen}#custom"`],
    ['href="/kontakt?ref=', `href="${route.kontakt}?ref=`],
    ["'/kontakt?'", `'${route.kontakt}?'`],
    ['"/kontakt?"', `"${route.kontakt}?"`],
    ["'/preise?'", `'${route.preise}?'`],
    ['"/preise?"', `"${route.preise}?"`],
    ['href="/fallstudie"', `href="${route.fallstudie}"`],
    ['href="/kontakt"', `href="${route.kontakt}"`],
    ['href="/preise"', `href="${route.preise}"`],
    ['href="/referenzen"', `href="${route.referenzen}"`],
    ['href="/loesungen"', `href="${route.loesungen}"`],
    ['href="/"', `href="${route.homepage}"`],
  ];
  return replaceMany(html, replacements);
}

function replaceMany(html, pairs) {
  let next = html;
  for (const [from, to] of pairs) {
    next = next.split(from).join(to);
  }
  return next;
}

function fixHomepageLinks(html, locale) {
  const route = routes[locale];
  const moreLabel = locale === "en" ? "Learn more" : locale === "tr" ? "Detayı gör" : "Mehr erfahren";
  const caseLabel =
    locale === "en" ? "Read case study" : locale === "tr" ? "Vaka çalışmasını oku" : "Fallstudie lesen";
  const pricingLabel =
    locale === "en" ? "All package details" : locale === "tr" ? "Tüm paket detayları" : "Alle Details und Pakete";
  html = html.replace(
    /<a href="#" class="link-mint">[^<]*<span class="arrow">→<\/span><\/a>/,
    `<a href="${route.loesungen}#shop" class="link-mint">${moreLabel} <span class="arrow">→</span></a>`
  );
  html = html.replace(
    /<a href="#" class="link-mint">[^<]*<span class="arrow">→<\/span><\/a>/,
    `<a href="${route.loesungen}#sport" class="link-mint">${moreLabel} <span class="arrow">→</span></a>`
  );
  html = html.replace(
    /<a href="#" class="link-mint">[^<]*<span class="arrow">→<\/span><\/a>/,
    `<a href="${route.loesungen}#custom" class="link-mint">${moreLabel} <span class="arrow">→</span></a>`
  );
  html = html.replace(
    /href="#" class="link-mint" style="font-size:15px;">[^<]*/,
    `href="${route.fallstudie}" class="link-mint" style="font-size:15px;">${caseLabel}`
  );
  html = html.replace(
    /href="#" class="link-mint" style="color:#fff;">[^<]*/,
    `href="${route.preise}" class="link-mint" style="color:#fff;">${pricingLabel}`
  );
  html = html.replace(/<li><a href="#">Shop<\/a><\/li>/, `<li><a href="${route.loesungen}#shop">Shop</a></li>`);
  html = html.replace(/<li><a href="#">Sport<\/a><\/li>/, `<li><a href="${route.loesungen}#sport">${locale === "tr" ? "Spor" : "Sport"}</a></li>`);
  html = html.replace(/<li><a href="#">Spor<\/a><\/li>/, `<li><a href="${route.loesungen}#sport">Spor</a></li>`);
  html = html.replace(/<li><a href="#">Custom<\/a><\/li>/, `<li><a href="${route.loesungen}#custom">Custom</a></li>`);
  html = html.replace(/<li><a href="#">About<\/a><\/li>/, `<li><a href="${route.homepage}#ueber">About</a></li>`);
  html = html.replace(/<li><a href="#">Hakkımızda<\/a><\/li>/, `<li><a href="${route.homepage}#ueber">Hakkımızda</a></li>`);
  html = html.replace(/<li><a href="#">Über uns<\/a><\/li>/, `<li><a href="${route.homepage}#ueber">Über uns</a></li>`);
  html = html.replace(/<li><a href="#">References<\/a><\/li>/, `<li><a href="${route.referenzen}">References</a></li>`);
  html = html.replace(/<li><a href="#">Referanslar<\/a><\/li>/, `<li><a href="${route.referenzen}">Referanslar</a></li>`);
  html = html.replace(/<li><a href="#">Referenzen<\/a><\/li>/, `<li><a href="${route.referenzen}">Referenzen</a></li>`);
  html = html.replace(/<li><a href="#">Pricing<\/a><\/li>/, `<li><a href="${route.preise}">Pricing</a></li>`);
  html = html.replace(/<li><a href="#">Fiyatlar<\/a><\/li>/, `<li><a href="${route.preise}">Fiyatlar</a></li>`);
  html = html.replace(/<li><a href="#">Preise<\/a><\/li>/, `<li><a href="${route.preise}">Preise</a></li>`);
  return html;
}

function fixReferenceLinks(html) {
  const externals = [
    ["href=\"#\" class=\"url\" target=\"_blank\" rel=\"noopener\">shop.yilmaz-souvenirs.at", "href=\"https://shop.yilmaz-souvenirs.at\" class=\"url\" target=\"_blank\" rel=\"noopener\">shop.yilmaz-souvenirs.at"],
    ["href=\"#\" class=\"url\" target=\"_blank\" rel=\"noopener\">buchen.th-urfahr.at", "href=\"https://buchen.th-urfahr.at\" class=\"url\" target=\"_blank\" rel=\"noopener\">buchen.th-urfahr.at"],
    ["href=\"#\" class=\"url\" target=\"_blank\" rel=\"noopener\">sommerhuber-baeckerei.at", "href=\"https://sommerhuber-baeckerei.at\" class=\"url\" target=\"_blank\" rel=\"noopener\">sommerhuber-baeckerei.at"],
    ["href=\"#\" class=\"url\" target=\"_blank\" rel=\"noopener\">disposition.haberl-logistik.at", "href=\"https://disposition.haberl-logistik.at\" class=\"url\" target=\"_blank\" rel=\"noopener\">disposition.haberl-logistik.at"],
    ["href=\"#\" class=\"url\" target=\"_blank\" rel=\"noopener\">app.rz-traunsee.at", "href=\"https://app.rz-traunsee.at\" class=\"url\" target=\"_blank\" rel=\"noopener\">app.rz-traunsee.at"],
  ];
  return replaceMany(html, externals);
}

function withContactLocale(html, locale) {
  html = html.replace(
    '<input type="hidden" name="ref" id="hRef" />',
    `<input type="hidden" name="ref" id="hRef" />\n            <input type="hidden" name="locale" value="${locale}" />`
  );
  return html;
}

function translatePage(html, locale, pageKey) {
  if (locale === "de") return html;
  html = replaceMany(html, commonVisible[locale]);
  if (pageReplacements[pageKey]?.[locale]) {
    html = replaceMany(html, pageReplacements[pageKey][locale]);
  }
  return html;
}

for (const locale of ["de", "en", "tr"]) {
  const outDir = path.join(designedDir, locale);
  fs.mkdirSync(outDir, { recursive: true });
  for (const [pageKey, fileName] of Object.entries(pageFiles)) {
    let html = fs.readFileSync(path.join(designedDir, fileName), "utf8");
    html = withHead(html, locale, pageKey);
    html = withInternalPaths(html, locale);
    html = withSwitcher(html, locale, pageKey);
    html = translatePage(html, locale, pageKey);
    if (pageKey === "homepage") html = fixHomepageLinks(html, locale);
    if (pageKey === "referenzen") html = fixReferenceLinks(html);
    if (pageKey === "kontakt") html = withContactLocale(html, locale);
    html = html.replace(/href="#"/g, "href=\"#\"");
    fs.writeFileSync(path.join(outDir, fileName), html, "utf8");
  }
}
