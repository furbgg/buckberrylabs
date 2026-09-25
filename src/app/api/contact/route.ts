import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Locale = "de" | "en" | "tr";

/* --- Simple in-memory rate limiter (per IP) --- */
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQS = 3;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQS) return false;
  entry.count += 1;
  return true;
}

const MAIL_COPY: Record<
  Locale,
  {
    numberLocale: string;
    dateLocale: string;
    errors: Record<string, string>;
    subjectPrefix: string;
    introKicker: string;
    introTitleSuffix: string;
    sections: Record<string, string>;
    plain: Record<string, string>;
    labels: Record<string, string>;
    fallback: Record<string, string>;
  }
> = {
  de: {
    numberLocale: "de-AT",
    dateLocale: "de-AT",
    errors: {
      rateLimit: "Zu viele Anfragen. Bitte in einer Stunde erneut versuchen.",
      invalidRequest: "Ungültige Anfrage.",
      invalidName: "Name ungültig.",
      invalidEmail: "E-Mail ungültig.",
      invalidMessage: "Nachricht zu kurz.",
      missingConsent: "Einverständnis fehlt.",
      mailNotConfigured: "Mail-Service nicht konfiguriert.",
      deliveryFailed: "Versand fehlgeschlagen.",
    },
    subjectPrefix: "Neue Anfrage",
    introKicker: "— Neue Anfrage",
    introTitleSuffix: "möchte reden",
    sections: {
      contact: "Kontakt",
      config: "Konfiguration — aus Preisrechner",
      reference: "Referenz",
      message: "Nachricht",
    },
    plain: {
      contact: "KONTAKT",
      config: "KONFIGURATION (via Preisrechner)",
      reference: "REFERENZ",
      message: "NACHRICHT",
    },
    labels: {
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      company: "Firma",
      projectType: "Projekt-Typ",
      scope: "Umfang",
      integrations: "Integrationen",
      languages: "Sprachen",
      adminPanel: "Admin-Panel",
      maintenance: "Wartung",
      estimate: "Richtpreis",
      range: "Spanne",
      referenceInterest: "Interesse an ähnlichem Projekt wie",
      sent: "Gesendet",
      ip: "IP",
      anonymizedIp: "IP (anonymisiert)",
    },
    fallback: {
      integrations: "Keine",
      languages: "1 Sprache",
      maintenance: "Keine",
    },
  },
  en: {
    numberLocale: "en-GB",
    dateLocale: "en-GB",
    errors: {
      rateLimit: "Too many enquiries. Please try again in an hour.",
      invalidRequest: "Invalid request.",
      invalidName: "Invalid name.",
      invalidEmail: "Invalid email.",
      invalidMessage: "Message is too short.",
      missingConsent: "Consent is required.",
      mailNotConfigured: "Mail service is not configured.",
      deliveryFailed: "Sending failed.",
    },
    subjectPrefix: "New enquiry",
    introKicker: "— New enquiry",
    introTitleSuffix: "wants to talk",
    sections: {
      contact: "Contact",
      config: "Configuration — from pricing calculator",
      reference: "Reference",
      message: "Message",
    },
    plain: {
      contact: "CONTACT",
      config: "CONFIGURATION (via pricing calculator)",
      reference: "REFERENCE",
      message: "MESSAGE",
    },
    labels: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      projectType: "Project type",
      scope: "Scope",
      integrations: "Integrations",
      languages: "Languages",
      adminPanel: "Admin panel",
      maintenance: "Maintenance",
      estimate: "Budgetary estimate",
      range: "Range",
      referenceInterest: "Interested in a similar project to",
      sent: "Sent",
      ip: "IP",
      anonymizedIp: "IP (anonymised)",
    },
    fallback: {
      integrations: "None",
      languages: "1 language",
      maintenance: "None",
    },
  },
  tr: {
    numberLocale: "tr-TR",
    dateLocale: "tr-TR",
    errors: {
      rateLimit: "Çok fazla talep gönderildi. Lütfen bir saat sonra tekrar deneyin.",
      invalidRequest: "Geçersiz istek.",
      invalidName: "Geçersiz isim.",
      invalidEmail: "Geçersiz e-posta.",
      invalidMessage: "Mesaj çok kısa.",
      missingConsent: "Onay gerekli.",
      mailNotConfigured: "Mail servisi yapılandırılmamış.",
      deliveryFailed: "Gönderim başarısız oldu.",
    },
    subjectPrefix: "Yeni talep",
    introKicker: "— Yeni talep",
    introTitleSuffix: "görüşmek istiyor",
    sections: {
      contact: "İletişim",
      config: "Yapılandırma — fiyat hesaplayıcıdan",
      reference: "Referans",
      message: "Mesaj",
    },
    plain: {
      contact: "İLETİŞİM",
      config: "YAPILANDIRMA (fiyat hesaplayıcıdan)",
      reference: "REFERANS",
      message: "MESAJ",
    },
    labels: {
      name: "İsim",
      email: "E-posta",
      phone: "Telefon",
      company: "Firma",
      projectType: "Proje tipi",
      scope: "Kapsam",
      integrations: "Entegrasyonlar",
      languages: "Diller",
      adminPanel: "Admin paneli",
      maintenance: "Bakım",
      estimate: "Tahmini bütçe",
      range: "Aralık",
      referenceInterest: "Şu projeye benzer bir proje ilgisi",
      sent: "Gönderildi",
      ip: "IP",
      anonymizedIp: "IP (anonimleştirilmiş)",
    },
    fallback: {
      integrations: "Yok",
      languages: "1 dil",
      maintenance: "Yok",
    },
  },
};

const LAB: Record<
  Locale,
  {
    type: Record<string, string>;
    size: Record<string, string>;
    int: Record<string, string>;
    lang: Record<string, string>;
    maint: Record<string, string>;
    panel: Record<string, string>;
  }
> = {
  de: {
    type: {
      "990": "Start",
      "1790": "Pro",
      "2690": "Signature",
      "3490": "Custom / B2B",
    },
    size: {},
    int: {
      "0": "Keine",
      "250": "Analytics",
      "400": "Online-Buchung",
      "700": "Zahlungen / Shop",
    },
    lang: {
      "1": "1 Sprache",
      "2": "2 Sprachen",
      "3": "3 Sprachen",
      "4": "4+ Sprachen",
    },
    panel: { "0": "Nein", "1": "Ja" },
    maint: {
      "0": "Keine",
      "39": "Care Basic · €39/Monat",
      "79": "Care Plus · €79/Monat",
      "149": "Care Premium · €149/Monat",
    },
  },
  en: {
    type: {
      "990": "Start",
      "1790": "Pro",
      "2690": "Signature",
      "3490": "Custom / B2B",
    },
    size: {},
    int: {
      "0": "None",
      "250": "Analytics",
      "400": "Online booking",
      "700": "Payments / Shop",
    },
    lang: {
      "1": "1 language",
      "2": "2 languages",
      "3": "3 languages",
      "4": "4+ languages",
    },
    panel: { "0": "No", "1": "Yes" },
    maint: {
      "0": "None",
      "39": "Care Basic · €39/month",
      "79": "Care Plus · €79/month",
      "149": "Care Premium · €149/month",
    },
  },
  tr: {
    type: {
      "990": "Start",
      "1790": "Pro",
      "2690": "Signature",
      "3490": "Custom / B2B",
    },
    size: {},
    int: {
      "0": "Yok",
      "250": "Analytics",
      "400": "Online rezervasyon",
      "700": "Ödemeler / Mağaza",
    },
    lang: {
      "1": "1 dil",
      "2": "2 dil",
      "3": "3 dil",
      "4": "4+ dil",
    },
    panel: { "0": "Hayır", "1": "Evet" },
    maint: {
      "0": "Yok",
      "39": "Care Basic · €39/ay",
      "79": "Care Plus · €79/ay",
      "149": "Care Premium · €149/ay",
    },
  },
};

const LAB_REF: Record<string, string> = {
  "yilmaz-souvenirs": "Yilmaz Souvenirs",
  "tennishalle-urfahr": "Salamanda Arena",
  "baeckerei-sommerhuber": "Alyagraphy",
  "haberl-logistik": "Haberl Logistik",
  "reitsportzentrum-traunsee": "Reitsportzentrum Traunsee",
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function anonIp(ip: string): string {
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.x`;
  }
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.slice(0, 3).join(":") + ":…";
  }
  return "x.x.x.x";
}

function resolveLocale(value: unknown): Locale {
  return value === "en" || value === "tr" ? value : "de";
}

export async function POST(req: NextRequest) {
  /* Rate limit */
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: MAIL_COPY.de.errors.rateLimit },
      { status: 429 }
    );
  }

  /* Parse body */
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: MAIL_COPY.de.errors.invalidRequest },
      { status: 400 }
    );
  }

  const locale = resolveLocale(body.locale);
  const copy = MAIL_COPY[locale];
  const lab = LAB[locale];

  /* Honeypot: real users leave this empty. Silently accept bots. */
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  /* Validation */
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const company = String(body.company || "").trim();
  const message = String(body.message || "").trim();
  const consent = body.consent === "true" || body.consent === true;

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, error: copy.errors.invalidName }, { status: 400 });
  }
  if (!email || !emailRx.test(email) || email.length > 160) {
    return NextResponse.json({ ok: false, error: copy.errors.invalidEmail }, { status: 400 });
  }
  if (!message || message.length < 20 || message.length > 4000) {
    return NextResponse.json(
      { ok: false, error: copy.errors.invalidMessage },
      { status: 400 }
    );
  }
  if (!consent) {
    return NextResponse.json(
      { ok: false, error: copy.errors.missingConsent },
      { status: 400 }
    );
  }

  /* Configuration summary (if came from Preisrechner) */
  const cfgType = String(body.type || "");
  const cfgInt = String(body.int || "");
  const cfgLang = String(body.lang || "");
  const cfgPanel = String(body.panel || "");
  const cfgMaint = String(body.maint || "");
  const cfgEst = String(body.est || "");
  const refSlug = String(body.ref || "");

  const hasConfig = Boolean(lab.type[cfgType]);
  const hasRef = Boolean(LAB_REF[refSlug]);

  /* Build email */
  const subjectParts = [copy.subjectPrefix];
  if (hasRef) subjectParts.push(LAB_REF[refSlug]);
  if (hasConfig) subjectParts.push(lab.type[cfgType]);
  subjectParts.push(name);
  const subject = subjectParts.join(" · ");

  const estNum = cfgEst ? Number(cfgEst) : 0;
  const estLow = Math.round((estNum * 0.85) / 100) * 100;
  const estHigh = Math.round((estNum * 1.15) / 100) * 100;
  const fmt = (n: number) => "€" + n.toLocaleString(copy.numberLocale);
  const ts = new Date().toLocaleString(copy.dateLocale, { timeZone: "Europe/Vienna" });

  /* Plain text body */
  const lines: string[] = [];
  lines.push(`${copy.subjectPrefix.toUpperCase()} — Buckberry Labs`);
  lines.push("─".repeat(50));
  lines.push("");
  lines.push(copy.plain.contact);
  lines.push(`  ${copy.labels.name}: ${name}`);
  lines.push(`  ${copy.labels.email}: ${email}`);
  if (phone) lines.push(`  ${copy.labels.phone}: ${phone}`);
  if (company) lines.push(`  ${copy.labels.company}: ${company}`);
  lines.push("");
  if (hasConfig) {
    lines.push(copy.plain.config);
    lines.push(`  ${copy.labels.projectType}: ${lab.type[cfgType]}`);
    lines.push(`  ${copy.labels.integrations}: ${lab.int[cfgInt] || copy.fallback.integrations}`);
    lines.push(`  ${copy.labels.languages}: ${lab.lang[cfgLang] || copy.fallback.languages}`);
    if (lab.panel[cfgPanel]) lines.push(`  ${copy.labels.adminPanel}: ${lab.panel[cfgPanel]}`);
    lines.push(`  ${copy.labels.maintenance}: ${lab.maint[cfgMaint] || copy.fallback.maintenance}`);
    if (estNum > 0) {
      lines.push(
        `  ${copy.labels.estimate}: ${fmt(estNum)} (${copy.labels.range} ${fmt(estLow)} – ${fmt(estHigh)})`
      );
    }
    lines.push("");
  }
  if (hasRef) {
    lines.push(copy.plain.reference);
    lines.push(`  ${copy.labels.referenceInterest}: ${LAB_REF[refSlug]}`);
    lines.push("");
  }
  lines.push(copy.plain.message);
  message.split("\n").forEach((line) => lines.push(`  ${line}`));
  lines.push("");
  lines.push("─".repeat(50));
  lines.push(`${copy.labels.sent}: ${ts} (Europe/Vienna)`);
  lines.push(`${copy.labels.anonymizedIp}: ${anonIp(ip)}`);
  const text = lines.join("\n");

  /* HTML body */
  const rowStyle = "padding:6px 0; border-bottom:1px solid #e5e7eb;";
  const keyStyle =
    "font-family:monospace; font-size:11px; color:#6b7280; letter-spacing:0.08em; text-transform:uppercase; padding-right:16px; vertical-align:top; white-space:nowrap;";
  const valStyle = "font-family:system-ui,sans-serif; font-size:14px; color:#0f1e2e;";

  let html = `<div style="font-family:system-ui,sans-serif; max-width:620px; margin:0 auto; background:#fafafa; padding:32px; color:#0f1e2e;">`;
  html += `<div style="background:#fff; border-radius:16px; padding:32px; border:1px solid #e5e7eb;">`;
  html += `<div style="font-family:monospace; font-size:11px; color:#14b8a6; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:8px;">${esc(copy.introKicker)}</div>`;
  html += `<h2 style="margin:0 0 24px 0; font-size:22px; letter-spacing:-0.02em;">${esc(name)} ${esc(copy.introTitleSuffix)}</h2>`;

  html += `<h3 style="font-size:12px; font-family:monospace; color:#14b8a6; letter-spacing:0.1em; text-transform:uppercase; margin:24px 0 12px;">${esc(copy.sections.contact)}</h3>`;
  html += `<table style="width:100%; border-collapse:collapse;"><tbody>`;
  html += `<tr><td style="${keyStyle}${rowStyle}">${esc(copy.labels.name)}</td><td style="${valStyle}${rowStyle}"><b>${esc(name)}</b></td></tr>`;
  html += `<tr><td style="${keyStyle}${rowStyle}">${esc(copy.labels.email)}</td><td style="${valStyle}${rowStyle}"><a href="mailto:${esc(email)}" style="color:#14b8a6;">${esc(email)}</a></td></tr>`;
  if (phone) {
    html += `<tr><td style="${keyStyle}${rowStyle}">${esc(copy.labels.phone)}</td><td style="${valStyle}${rowStyle}"><a href="tel:${esc(phone)}" style="color:#14b8a6;">${esc(phone)}</a></td></tr>`;
  }
  if (company) {
    html += `<tr><td style="${keyStyle}${rowStyle}">${esc(copy.labels.company)}</td><td style="${valStyle}${rowStyle}">${esc(company)}</td></tr>`;
  }
  html += `</tbody></table>`;

  if (hasConfig) {
    html += `<h3 style="font-size:12px; font-family:monospace; color:#14b8a6; letter-spacing:0.1em; text-transform:uppercase; margin:28px 0 12px;">${esc(copy.sections.config)}</h3>`;
    html += `<table style="width:100%; border-collapse:collapse;"><tbody>`;
    html += `<tr><td style="${keyStyle}${rowStyle}">${esc(copy.labels.projectType)}</td><td style="${valStyle}${rowStyle}">${esc(lab.type[cfgType])}</td></tr>`;
    html += `<tr><td style="${keyStyle}${rowStyle}">${esc(copy.labels.integrations)}</td><td style="${valStyle}${rowStyle}">${esc(lab.int[cfgInt] || copy.fallback.integrations)}</td></tr>`;
    html += `<tr><td style="${keyStyle}${rowStyle}">${esc(copy.labels.languages)}</td><td style="${valStyle}${rowStyle}">${esc(lab.lang[cfgLang] || copy.fallback.languages)}</td></tr>`;
    if (lab.panel[cfgPanel]) html += `<tr><td style="${keyStyle}${rowStyle}">${esc(copy.labels.adminPanel)}</td><td style="${valStyle}${rowStyle}">${esc(lab.panel[cfgPanel])}</td></tr>`;
    html += `<tr><td style="${keyStyle}${rowStyle}">${esc(copy.labels.maintenance)}</td><td style="${valStyle}${rowStyle}">${esc(lab.maint[cfgMaint] || copy.fallback.maintenance)}</td></tr>`;
    html += `</tbody></table>`;
    if (estNum > 0) {
      html += `<div style="margin-top:16px; padding:16px 20px; background:#0f1e2e; border-radius:12px; color:#fff; display:flex; align-items:baseline; justify-content:space-between;">`;
      html += `<div><div style="font-family:monospace; font-size:10px; color:#3dd9c4; letter-spacing:0.12em; text-transform:uppercase;">${esc(copy.labels.estimate)}</div><div style="font-size:24px; font-weight:600; margin-top:2px;">${fmt(estNum)}</div></div>`;
      html += `<div style="font-family:monospace; font-size:11px; color:#9ca3af;">${esc(copy.labels.range)} ${fmt(estLow)} – ${fmt(estHigh)}</div>`;
      html += `</div>`;
    }
  }

  if (hasRef) {
    html += `<div style="margin-top:20px; padding:14px 18px; background:rgba(61,217,196,0.12); border:1px solid rgba(20,184,166,0.3); border-radius:10px; font-family:monospace; font-size:12px; color:#14b8a6; letter-spacing:0.08em; text-transform:uppercase;">${esc(copy.labels.referenceInterest)}: <b>${esc(LAB_REF[refSlug])}</b></div>`;
  }

  html += `<h3 style="font-size:12px; font-family:monospace; color:#14b8a6; letter-spacing:0.1em; text-transform:uppercase; margin:28px 0 12px;">${esc(copy.sections.message)}</h3>`;
  html += `<div style="background:#f4f2ed; border-radius:12px; padding:18px 20px; font-size:15px; line-height:1.6; white-space:pre-wrap;">${esc(message)}</div>`;

  html += `<hr style="margin:28px 0 16px; border:0; border-top:1px solid #e5e7eb;" />`;
  html += `<div style="font-family:monospace; font-size:11px; color:#9ca3af; letter-spacing:0.05em;">${esc(copy.labels.sent)}: ${esc(ts)} · ${esc(copy.labels.ip)}: ${esc(anonIp(ip))}</div>`;
  html += `</div></div>`;

  /* Send via Resend */
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddr =
    process.env.CONTACT_EMAIL_FROM ||
    "Buckberry Labs <info@send.buckberrylabs.com>";
  const toAddr = process.env.CONTACT_EMAIL_TO || "info@buckberrylabs.com";

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY not set");
    return NextResponse.json(
      { ok: false, error: copy.errors.mailNotConfigured },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromAddr,
      to: [toAddr],
      replyTo: email,
      subject,
      text,
      html,
    });
    if (result.error) {
      console.error("[contact] Resend error:", result.error);
      return NextResponse.json(
        { ok: false, error: copy.errors.deliveryFailed },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Send exception:", err);
    return NextResponse.json(
      { ok: false, error: copy.errors.deliveryFailed },
      { status: 502 }
    );
  }
}
