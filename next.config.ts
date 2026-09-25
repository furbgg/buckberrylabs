import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: "/", destination: "/de/", permanent: true },
      { source: "/loesungen", destination: "/de/loesungen", permanent: true },
      { source: "/referenzen", destination: "/de/referenzen", permanent: true },
      { source: "/preise", destination: "/de/preise", permanent: true },
      // the old case-study page now lives as the Yilmaz section on the references page
      { source: "/fallstudie", destination: "/de/referenzen#yilmaz", permanent: true },
      { source: "/de/fallstudie", destination: "/de/referenzen#yilmaz", permanent: true },
      { source: "/en/case-study", destination: "/en/references#yilmaz", permanent: true },
      { source: "/tr/vaka-calismasi", destination: "/tr/referanslar#yilmaz", permanent: true },
      { source: "/admin-panel", destination: "/de/admin-panel", permanent: true },
      { source: "/kontakt", destination: "/de/kontakt", permanent: true },
      { source: "/hinweis", destination: "/de/hinweis", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/de/", destination: "/designed/de/homepage.html" },
        { source: "/de/loesungen", destination: "/designed/de/loesungen.html" },
        { source: "/de/referenzen", destination: "/designed/de/referenzen.html" },
        { source: "/de/preise", destination: "/designed/de/preise.html" },
        { source: "/de/admin-panel", destination: "/designed/de/admin-panel.html" },
        { source: "/de/kontakt", destination: "/designed/de/kontakt.html" },
        { source: "/de/hinweis", destination: "/designed/de/hinweis.html" },
        { source: "/en/", destination: "/designed/en/homepage.html" },
        { source: "/en/solutions", destination: "/designed/en/loesungen.html" },
        { source: "/en/references", destination: "/designed/en/referenzen.html" },
        { source: "/en/pricing", destination: "/designed/en/preise.html" },
        { source: "/en/admin-panel", destination: "/designed/en/admin-panel.html" },
        { source: "/en/contact", destination: "/designed/en/kontakt.html" },
        { source: "/tr/", destination: "/designed/tr/homepage.html" },
        { source: "/tr/cozumler", destination: "/designed/tr/loesungen.html" },
        { source: "/tr/referanslar", destination: "/designed/tr/referenzen.html" },
        { source: "/tr/fiyatlar", destination: "/designed/tr/preise.html" },
        { source: "/tr/yonetim-paneli", destination: "/designed/tr/admin-panel.html" },
        { source: "/tr/iletisim", destination: "/designed/tr/kontakt.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
