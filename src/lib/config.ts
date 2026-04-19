export const brand = {
  name: "Buckberry Labs",
  legalName: "Buckberry Labs",
  tagline: "Software, handverlesen. Aus Österreich.",
  location: {
    city: "Linz",
    postalCode: "4020",
    country: "AT",
    region: "Oberösterreich",
  },
  contact: {
    email: "info@buckberrylabs.com",
    emailOwner: "owner@buckberrylabs.com",
  },
  urls: {
    site: process.env.NEXT_PUBLIC_SITE_URL ?? "https://buckberrylabs.com",
    cal: process.env.CAL_USERNAME
      ? `https://cal.com/${process.env.CAL_USERNAME}`
      : null,
  },
  locale: "de-AT",
  areaServed: ["AT", "DE", "CH"] as const,
} as const;

export type Brand = typeof brand;
