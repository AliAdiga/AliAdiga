// Anime-flavoured hero and ID cards. The portrait is hand-drawn vector art (src/portrait.mjs).
import { animate, animateTransform, cardChrome, EASE, esc, f, hairlineGradient, svgDoc } from "./lib.mjs";
import { rv, wrap, lines, eyebrow } from "./cards.mjs";
import { portrait } from "./portrait.mjs";

/** Drifting petals: base state is mid-flight, so a non-animating viewer still sees a scattered few. */
function petals(t, w, h, n = 9) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const x0 = ((i * 97) % w) | 0;
    const dur = 8 + (i % 4) * 2.1;
    const drift = 70 + (i % 3) * 25;
    const col = i % 2 ? t.bronze : t.plum;
    const s = 0.7 + (i % 3) * 0.25;
    out += `<g opacity="0.55"><path d="M0 0 C 5 -6 12 -2 10 5 C 8 10 1 9 0 0 Z" fill="${col}" transform="scale(${s})"/>
      <animateTransform attributeName="transform" type="translate" values="${x0} -20;${x0 + drift} ${h + 20}" dur="${dur}s" begin="-${f((i * 1.7) % dur)}s" repeatCount="indefinite"/></g>`;
  }
  return out;
}

export async function heroAnime(t) {
  const W = 900,
    H = 400;
  const defs =
    hairlineGradient(t, "hero") +
    `<radialGradient id="glow" cx="0.78" cy="0.5" r="0.55"><stop offset="0" stop-color="${t.glow}"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/></radialGradient>
     <clipPath id="clipcard"><rect width="${W}" height="${H}" rx="26"/></clipPath>`;
  const px = 590,
    py = 44,
    sc = 0.7;
  const swing = animateTransform("rotate", "-1.6 200 240;1.6 200 240;-1.6 200 240", { dur: "7s", repeat: "indefinite", calc: "spline", keyTimes: [0, 0.5, 1], splines: "0.45 0 0.55 1;0.45 0 0.55 1" });
  const burst = animateTransform("rotate", "0 740 190;360 740 190", { dur: "90s", repeat: "indefinite" });
  const lines24 = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const r1 = 150,
      r2 = 420 + (i % 3) * 40;
    return `<line x1="${f(740 + Math.cos(a) * r1)}" y1="${f(190 + Math.sin(a) * r1)}" x2="${f(740 + Math.cos(a) * r2)}" y2="${f(190 + Math.sin(a) * r2)}"/>`;
  }).join("");

  const body = `
  ${cardChrome(t, 0, 0, W, H, 26, "hero")}
  <g clip-path="url(#clipcard)">
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <g stroke="${t.plum}" stroke-opacity="0.12" stroke-width="2.5" stroke-linecap="round">${lines24}${burst}</g>
    ${petals(t, W, H)}
  </g>
  ${rv(eyebrow(t, 48, 66, "Scroll & Serif  ·  Studio of Ali Tsai"), 0.1, { dy: 8 })}
  ${rv(`<text class="serif" x="46" y="150" font-size="54" font-weight="400" letter-spacing="-1" fill="${t.text}">Distinctive websites,</text>`, 0.25, { dy: 22 })}
  ${rv(`<text class="serif" x="46" y="214" font-size="54" font-style="italic" font-weight="400" letter-spacing="-1" fill="${t.plum}">thoughtfully built.</text>`, 0.45, { dy: 22 })}
  <path d="M50 234 C 150 226, 270 240, 440 230" fill="none" stroke="${t.bronze}" stroke-width="2" stroke-linecap="round" stroke-dasharray="300" stroke-dashoffset="0">${animate("stroke-dashoffset", "300;0", { dur: "1.4s", begin: "1.2s", fill: "freeze", calc: "spline", keyTimes: [0, 1], splines: EASE })}</path>
  ${rv(lines(["A designer and developer in Amman, Jordan,", "making expressive sites for businesses and brands,", "in English, Arabic or both."], 48, 272, 24, `font-size="15.5" fill="${t.soft}"`), 0.8, { dy: 12 })}
  ${rv(
    `<g>
      <rect x="48" y="334" width="176" height="34" rx="17" fill="${t.plum}"/>
      <text x="136" y="355.5" font-size="13" font-weight="600" text-anchor="middle" fill="${t.onPlum}">Visit the portfolio ↗</text>
      <circle cx="252" cy="351" r="3.5" fill="${t.bronze}"><animate attributeName="opacity" values="1;0.25;1" dur="2.4s" begin="1.6s" repeatCount="indefinite"/></circle>
      <text x="264" y="355.5" font-size="12.5" fill="${t.soft}">Chapter one: Amman, Jordan</text>
    </g>`,
    1.0,
    { dy: 10 },
  )}
  ${rv(`<g transform="translate(${px} ${py}) scale(${sc})"><g>${portrait(t, "hp")}${swing}</g></g>`, 0.4, { dy: 30, dx: 30, dur: 1.2 })}
  ${rv(
    `<g>
      <g transform="translate(500 96)"><rect width="104" height="30" rx="15" fill="${t.card}" stroke="${t.bronze}"/><text x="52" y="20" font-size="12" font-weight="600" text-anchor="middle" fill="${t.text}">DESIGNER</text></g>
      <g transform="translate(762 338)"><rect width="104" height="30" rx="15" fill="${t.card}" stroke="${t.bronze}"/><text x="52" y="20" font-size="12" font-weight="600" text-anchor="middle" fill="${t.text}">DEVELOPER</text></g>
    </g>`,
    1.3,
    { dy: 10 },
  )}`;
  return svgDoc({ w: W, h: H, t, defs, body, title: "Ali Tsai, Scroll & Serif", desc: "Distinctive websites, thoughtfully built. Ali Tsai is a designer and developer in Amman, Jordan, shown as an anime-style illustration with drifting petals." });
}

export async function idAnime(t) {
  const W = 900,
    H = 400;
  const defs = hairlineGradient(t, "id") + `<linearGradient id="badge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.card2}"/><stop offset="1" stop-color="${t.card}"/></linearGradient>`;
  const bx = 48,
    by = 44,
    bw = 236,
    bh = 330;
  const sway = animateTransform("rotate", `-1.4 ${bx + bw / 2} 20;1.4 ${bx + bw / 2} 20;-1.4 ${bx + bw / 2} 20`, { dur: "7s", repeat: "indefinite", calc: "spline", keyTimes: [0, 0.5, 1], splines: "0.45 0 0.55 1;0.45 0 0.55 1" });
  const badge = `
  <g>
    <path d="M${bx + bw / 2 - 18} 0 L${bx + bw / 2 - 6} ${by + 8} M${bx + bw / 2 + 18} 0 L${bx + bw / 2 + 6} ${by + 8}" stroke="${t.bronze}" stroke-width="2.5" fill="none"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="20" fill="url(#badge)" stroke="${t.lineStrong}"/>
    <rect x="${bx + bw / 2 - 26}" y="${by + 10}" width="52" height="9" rx="4.5" fill="${t.plum}" fill-opacity="0.85"/>
    <g transform="translate(${bx + 28} ${by + 32}) scale(0.45)">${portrait(t, "ip")}</g>
    <text class="serif" x="${bx + 28}" y="${by + 278}" font-size="26" fill="${t.text}">Ali Tsai</text>
    <text x="${bx + 28}" y="${by + 298}" font-size="12.5" fill="${t.soft}">Designer and developer</text>
    <rect x="${bx + 28}" y="${by + 312}" width="${bw - 56}" height="3" rx="1.5" fill="${t.bronze}"/>
    ${sway}
  </g>`;

  const kpis = [
    ["7", "live sites"],
    ["4", "featured case studies"],
    ["3", "site languages: EN, FR, AR"],
  ];
  const kx = 332,
    kw = 166,
    kg = 14;
  let kpiSvg = "";
  kpis.forEach(([n, label], i) => {
    const x = kx + i * (kw + kg);
    kpiSvg += rv(
      `<g>
        <rect x="${x}" y="44" width="${kw}" height="112" rx="16" fill="${t.card2}" stroke="${t.line}"/>
        <text class="serif" x="${x + 20}" y="106" font-size="54" fill="${t.text}">${n}</text>
        ${lines(wrap(label, 12.5, kw - 36), x + 20, 132, 16, `font-size="12.5" fill="${t.soft}"`)}
      </g>`,
      0.3 + i * 0.15,
      { dy: 14 },
    );
  });
  const rows = [
    ["Next.js", 5],
    ["Vite", 1],
    ["Static HTML, CSS, JS", 1],
  ];
  const trackW = 250,
    unit = trackW / 5;
  let bars = "";
  rows.forEach(([name, n], i) => {
    const y = 250 + i * 38;
    const w = n * unit;
    const grow = animate("width", `0;0;${f(w)}`, { dur: `${1.3 + i * 0.2}s`, keyTimes: [0, 0.35, 1], fill: "freeze", calc: "spline", splines: `0 0 1 1;${EASE}` });
    bars += `<g>
      <text x="${kx}" y="${y + 12}" font-size="12.5" fill="${t.soft}">${esc(name)}</text>
      <rect x="${kx + 150}" y="${y}" width="${trackW}" height="14" rx="7" fill="${t.card2}"/>
      <rect x="${kx + 150}" y="${y}" width="${f(w)}" height="14" rx="7" fill="${i === 0 ? t.plum : t.bronze}">${grow}</rect>
      <text x="${kx + 150 + trackW + 14}" y="${y + 12}" font-size="12.5" font-weight="600" fill="${t.text}">${n}</text>
    </g>`;
  });
  const body = `
  ${cardChrome(t, 0, 0, W, H, 26, "id")}
  ${badge}
  ${rv(eyebrow(t, kx, 28, "Stats from the field"), 0.1, { dy: 6 })}
  ${kpiSvg}
  ${rv(eyebrow(t, kx, 212, "Live sites by build"), 0.7, { dy: 6 })}
  ${rv(bars, 0.75, { dy: 6 })}`;
  return svgDoc({ w: W, h: H, t, defs, body, title: "ID card and stats", desc: "An anime-style ID badge for Ali Tsai, designer and developer, plus counts from the portfolio: 7 live sites, 4 featured case studies, 3 site languages, and a chart of how the sites are built." });
}
