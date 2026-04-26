'use client';

import { useEffect, useRef } from 'react';

export default function NotFound() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2,
      cx = mx,
      cy = my;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    let raf: number;
    const loop = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const hoverEls = document.querySelectorAll('a, button');
    const enter = () => cursor.classList.add('big');
    const leave = () => cursor.classList.remove('big');
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    // Reveal animation (simple, no GSAP dependency)
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, i) => {
      setTimeout(() => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, 150 + i * 120);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      hoverEls.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

:root{
  --primary-dark:#0F1E2E;
  --surface-dark:#0A1520;
  --mint:#3DD9C4;
  --deep-mint:#14B8A6;
  --cream:#F4F2ED;
  --light:#FAFAFA;
  --border:#E5E7EB;
  --muted:#6B7280;
}

*{margin:0;padding:0;box-sizing:border-box;}
html,body{background:var(--light);color:var(--primary-dark);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.5;min-height:100vh;}
a{color:inherit;text-decoration:none;}
button{font:inherit;background:none;border:0;cursor:pointer;color:inherit;}

.cursor{position:fixed;width:14px;height:14px;border-radius:50%;background:var(--mint);mix-blend-mode:difference;pointer-events:none;z-index:9999;left:0;top:0;transform:translate(-50%,-50%);transition:width .2s ease,height .2s ease;}
.cursor.big{width:44px;height:44px;background:var(--deep-mint);}
@media(hover:none){.cursor{display:none !important;}body{cursor:auto !important;}}
body{cursor:none;}
a,button{cursor:none;}

.nav{position:fixed;top:0;left:0;right:0;height:72px;background:rgba(255,255,255,0.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);z-index:100;display:flex;align-items:center;}
.nav-inner{max-width:1240px;width:100%;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;}
.nav-brand{font-family:'Geist',sans-serif;font-weight:600;font-size:18px;letter-spacing:-0.02em;display:flex;align-items:center;gap:10px;}
.nav-brand .dot{width:8px;height:8px;border-radius:50%;background:var(--mint);box-shadow:0 0 16px var(--mint);}
.nav-links{display:flex;gap:32px;}
.nav-links a{font-family:'Geist',sans-serif;font-weight:500;font-size:14px;color:var(--primary-dark);opacity:0.75;transition:opacity .2s;}
.nav-links a:hover,.nav-links a.active{opacity:1;color:var(--deep-mint);}
.nav-right{display:flex;gap:16px;align-items:center;}
.hamburger{display:none;width:32px;height:24px;position:relative;z-index:120;}
.hamburger span{position:absolute;left:0;right:0;height:2px;background:var(--primary-dark);transition:transform .3s,opacity .2s,top .3s;}
.hamburger span:nth-child(1){top:4px;}.hamburger span:nth-child(2){top:11px;}.hamburger span:nth-child(3){top:18px;}
@media(max-width:900px){
  .nav-links,.nav-right > a{display:none;}
  .hamburger{display:block;}
}

.mobile-panel{position:fixed;inset:0;background:var(--primary-dark);color:#fff;z-index:110;transform:translateX(100%);transition:transform .4s cubic-bezier(0.2,0.8,0.2,1);padding:100px 32px 40px;overflow-y:auto;}
.mobile-panel.open{transform:translateX(0);}
.mobile-panel a{display:block;font-family:'Geist',sans-serif;font-size:28px;font-weight:500;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.1);}

.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;font-family:'Geist',sans-serif;font-weight:500;font-size:14px;border-radius:999px;transition:all .3s cubic-bezier(0.2,0.8,0.2,1);white-space:nowrap;}
.btn-primary{background:var(--primary-dark);color:#fff;}
.btn-primary:hover{background:var(--deep-mint);transform:translateY(-2px);}
.btn-ghost-light{background:transparent;color:var(--primary-dark);border:1px solid var(--border);}
.btn-ghost-light:hover{border-color:var(--primary-dark);background:var(--primary-dark);color:#fff;}
.arrow{font-size:16px;transition:transform .3s cubic-bezier(0.2,0.8,0.2,1);}
.btn:hover .arrow{transform:translateX(4px);}

.reveal{opacity:0;transform:translateY(20px);transition:opacity .7s cubic-bezier(0.2,0.8,0.2,1),transform .7s cubic-bezier(0.2,0.8,0.2,1);}

.container{max-width:1240px;margin:0 auto;padding:0 32px;}
.mono{font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:var(--deep-mint);}

.error-main{padding-top:180px;padding-bottom:120px;min-height:calc(100vh - 72px);display:flex;align-items:flex-start;}
.error-content{max-width:720px;}
.error-content h1{font-family:'Geist',sans-serif;font-size:clamp(36px,5.5vw,56px);font-weight:600;letter-spacing:-0.03em;line-height:1.08;margin:18px 0 24px;}
.error-content h1 .accent{color:var(--deep-mint);font-style:italic;}
.error-content .lead{font-size:18px;max-width:600px;color:var(--muted);line-height:1.6;margin-bottom:36px;}
.error-actions{display:flex;gap:14px;flex-wrap:wrap;}

.footer{background:var(--primary-dark);color:#fff;padding:80px 0 40px;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:60px;}
@media(max-width:800px){.footer-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:500px){.footer-grid{grid-template-columns:1fr;}}
.footer-brand h3{font-family:'Geist',sans-serif;font-size:22px;font-weight:600;letter-spacing:-0.02em;margin-bottom:12px;}
.footer-brand p{color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;max-width:320px;}
.footer-col h5{font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--mint);margin-bottom:16px;}
.footer-col ul{list-style:none;}
.footer-col li{margin-bottom:10px;}
.footer-col a{color:rgba(255,255,255,0.7);font-size:14px;transition:color .2s;}
.footer-col a:hover{color:var(--mint);}
.footer-bottom{border-top:1px solid rgba(255,255,255,0.08);padding-top:32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
.footer-bottom p{color:rgba(255,255,255,0.5);font-size:13px;}
.footer-legal{display:flex;gap:20px;align-items:center;}

@media(prefers-reduced-motion:reduce){
  .cursor{display:none !important;}
  body{cursor:auto !important;}
  .reveal{opacity:1 !important;transform:none !important;transition:none !important;}
}
`,
        }}
      />

      <div className="cursor" ref={cursorRef} />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="/de/" className="nav-brand">
            <span className="dot" />
            Buckberry Labs
          </a>
          <div className="nav-links">
            <a href="/de/loesungen">Lösungen</a>
            <a href="/de/referenzen">Referenzen</a>
            <a href="/de/preise">Preise</a>
            <a href="/de/kontakt" className="active">Kontakt</a>
          </div>
          <div className="nav-right">
            <a href="/de/kontakt" className="btn btn-primary">
              Projekt starten <span className="arrow">→</span>
            </a>
            <button
              className="hamburger"
              id="hamburger"
              aria-label="Menü"
              aria-expanded="false"
              onClick={(e) => {
                const btn = e.currentTarget;
                const panel = document.getElementById('mobilePanel');
                btn.classList.toggle('open');
                panel?.classList.toggle('open');
                btn.setAttribute(
                  'aria-expanded',
                  String(btn.classList.contains('open'))
                );
              }}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE PANEL */}
      <div className="mobile-panel" id="mobilePanel">
        <a href="/de/loesungen">Lösungen</a>
        <a href="/de/referenzen">Referenzen</a>
        <a href="/de/preise">Preise</a>
        <a href="/de/kontakt">Kontakt</a>
      </div>

      {/* MAIN */}
      <section className="error-main">
        <div className="container">
          <div className="error-content">
            <span className="mono reveal">— 404 · Seite nicht gefunden</span>
            <h1 className="reveal">
              Das <span className="accent">gibt es hier</span> nicht.
            </h1>
            <p className="lead reveal">
              Die Seite wurde verschoben, gelöscht oder existierte nie. Kein
              Drama — hier geht&apos;s weiter:
            </p>
            <div className="error-actions reveal">
              <a href="/de/" className="btn btn-primary">
                Zur Startseite <span className="arrow">→</span>
              </a>
              <a href="/de/referenzen" className="btn btn-ghost-light">
                Referenzen ansehen
              </a>
              <a href="/de/kontakt" className="btn btn-ghost-light">
                Kontakt
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Buckberry Labs</h3>
              <p>
                Softwarestudio aus Linz. Wir bauen Shops, Portale und Tools, die
                nach Livegang ohne uns laufen.
              </p>
            </div>
            <div className="footer-col">
              <h5>Produkt</h5>
              <ul>
                <li><a href="/de/loesungen">Lösungen</a></li>
                <li><a href="/de/referenzen">Referenzen</a></li>
                <li><a href="/de/preise">Preise</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Firma</h5>
              <ul>
                <li><a href="/de/kontakt">Kontakt</a></li>
                <li><a href="/de/referenzen">Referenzen</a></li>
                <li><a href="/de/preise">Preise</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Direkt</h5>
              <ul>
                <li><a href="mailto:info@buckberrylabs.com">info@buckberrylabs.com</a></li>
                <li><a href="tel:+436601234567">+43 660 1234567</a></li>
                <li>Linz, Österreich</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Buckberry Labs. Alle Rechte vorbehalten.</p>
            <div className="footer-legal">
              <span
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: "'Geist Mono',monospace",
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                entwickelt in Linz · AT
              </span>
              <a
                href="/de/hinweis"
                style={{
                  fontFamily: "'Geist Mono',monospace",
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color .2s',
                }}
                onMouseOver={(e) =>
                  ((e.target as HTMLElement).style.color = '#3DD9C4')
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLElement).style.color =
                    'rgba(255,255,255,0.5)')
                }
              >
                — Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
