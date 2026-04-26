import { readFileSync, writeFileSync } from 'fs';

// Fix TR loesungen - regex handles any apostrophe variant
let h = readFileSync('public/designed/tr/loesungen.html', 'utf8');
h = h.replace(/€18\.000.luk.*beklenmedik change request.*yok/,
  'Yarı yolda sürpriz ek maliyet yok');
writeFileSync('public/designed/tr/loesungen.html', h, 'utf8');
console.log('✅ loesungen fixed');

// Fix TR kontakt
let k = readFileSync('public/designed/tr/kontakt.html', 'utf8');
k = k.replace(/Yaklaşık €9\.000.dan başlıyoruz.*?yönlendiriyoruz\./s,
  "Paketlerimiz €990'dan başlıyor (Start). Kısa bir görüşmeyle hangi paketin size uygun olduğunu birlikte belirleriz.");
writeFileSync('public/designed/tr/kontakt.html', k, 'utf8');
console.log('✅ kontakt fixed');

// Also update TR kontakt LAB config
k = readFileSync('public/designed/tr/kontakt.html', 'utf8');
k = k.replace("'9000':'Web sitesi'", "'990':'Web sitesi'");
k = k.replace("'18000':'Online mağaza'", "'1490':'Çok Dilli'");
k = k.replace("'24000':'Web uygulaması / portal'", "'1990':'Komple Paket'");
k = k.replace("'32000':'Özel B2B'", "'2990':'Özel / B2B'");
k = k.replace("'1800':'1 sistem'", "'250':'Analytics'");
k = k.replace("'3400':'2 sistem'", "'400':'Online rezervasyon'");
k = k.replace("'5200':'3+ (ERP, CRM...)'", "'700':'Ödemeler / Mağaza'");
k = k.replace("'1200':'2 dil'", "'300':'2 dil'");
k = k.replace("'2400':'3 dil'", "'500':'3 dil'");
k = k.replace("'3600':'4+ dil'", "'800':'4+ dil'");
k = k.replace("'120':'Baz · €120/ay'", "'79':'Care Basic · €79/ay'");
k = k.replace("'280':'Standart · €280/ay'", "'129':'Care Plus · €129/ay'");
k = k.replace("'480':'Premium · €480/ay'", "'175':'Care Premium · €175/ay'");
writeFileSync('public/designed/tr/kontakt.html', k, 'utf8');
console.log('✅ kontakt LAB config updated');

// Also fix loesungen price cards that still have legacy labels
h = readFileSync('public/designed/tr/loesungen.html', 'utf8');
h = h.replace('>Kompakt<', '>Start<');
h = h.replace('Bakım €120/ay', 'Bakım €79/ay');
h = h.replace('Bakım €280/ay', 'Bakım €129/ay');
h = h.replace('Bakım €480/ay', 'Bakım €175/ay');
h = h.replace('>Standart · en çok seçilen<', '>Pro · en çok seçilen<');
h = h.replace('>Custom<', '>Signature<');
writeFileSync('public/designed/tr/loesungen.html', h, 'utf8');
console.log('✅ loesungen labels updated');
