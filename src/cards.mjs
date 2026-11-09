// Card generators. Each returns a complete SVG string for one theme.
// Rule: static attributes are the finished state; SMIL only plays the entrance and slow ambient loops.
import { animate, animateTransform, brandIcon, cardChrome, cover, EASE, esc, f, hairlineGradient, phosphor, svgDoc, textWidth } from "./lib.mjs";

/** Entrance: holds hidden until `delay`, then eases in. Before `delay` the element is invisible, afterwards it freezes visible. */
export function rv(inner, delay, { dy = 14, dx = 0, dur = 0.9 } = {}) {
  const total = delay + dur;
  const k = delay / total;
  const opts = { dur: `${f(total)}s`, keyTimes: [0, k, 1], fill: "freeze", calc: "spline", splines: `0 0 1 1;${EASE}` };
  return `<g>${inner}${animate("opacity", "0;0;1", opts)}${animateTransform("translate", `${dx} ${dy};${dx} ${dy};0 0`, opts)}</g>`;
}

/** Greedy word wrap by approximate pixel width. */
export function wrap(text, size, maxW) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (textWidth(next, size) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

export const lines = (arr, x, y, lh, attrs) => arr.map((l, i) => `<text x="${x}" y="${y + i * lh}" ${attrs}>${esc(l)}</text>`).join("");

/** Tiny label in tracked caps. */
export const eyebrow = (t, x, y, s) => `<text x="${x}" y="${y}" font-size="11" font-weight="600" letter-spacing="2.2" fill="${t.bronze}">${esc(s.toUpperCase())}</text>`;

/* ---------------------------------------------------------------- HERO */
export async function hero(t) {
  const W = 900,
    H = 392;
  const covers = [
    ["dar", 560, 40, -3],
    ["aurelle", 560, 188, 2],
    ["zaytoun", 716, 78, 3],
    ["caucasus", 716, 226, -2],
  ];
  const imgW = 160,
    imgH = 107;
  let defs = hairlineGradient(t, "hero");
  let imgs = "";
  for (let i = 0; i < covers.length; i++) {
    const [name, x, y, rot] = covers[i];
    const src = await cover(name, 320, 66);
    defs += `<clipPath id="cl${i}"><rect x="0" y="0" width="${imgW}" height="${imgH}" rx="10"/></clipPath>`;
    const cx = x + imgW / 2,
      cy = y + imgH / 2;
    const card = `
      <g transform="rotate(${rot} ${cx} ${cy})">
        <g transform="translate(${x} ${y})">
          <rect x="-4" y="-4" width="${imgW + 8}" height="${imgH + 8}" rx="13" fill="${t.card}" stroke="${t.line}"/>
          <image href="${src}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid slice" clip-path="url(#cl${i})"/>
        </g>
      </g>`;
    const bob = animateTransform("translate", `0 0;0 ${i % 2 ? -5 : 5};0 0`, { dur: `${6 + i}s`, repeat: "indefinite", calc: "spline", keyTimes: [0, 0.5, 1], splines: "0.45 0 0.55 1;0.45 0 0.55 1", begin: "1.8s" });
    imgs += rv(`<g>${card}${bob}</g>`, 0.5 + i * 0.18, { dy: 26, dx: 18, dur: 1.1 });
  }

  const glow = `<radialGradient id="glow" cx="0.82" cy="0.5" r="0.55"><stop offset="0" stop-color="${t.glow}"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/></radialGradient>`;
  defs += glow;

  // Underline that draws itself under the italic words.
  const draw = animate("stroke-dashoffset", "300;0", { dur: "1.4s", begin: "1.2s", fill: "freeze", calc: "spline", keyTimes: [0, 1], splines: EASE });

  const body = `
  ${cardChrome(t, 0, 0, W, H, 26, "hero")}
  <rect width="${W}" height="${H}" rx="26" fill="url(#glow)"/>
  ${rv(eyebrow(t, 48, 66, "Scroll & Serif  ·  Studio of Ali Tsai"), 0.1, { dy: 8 })}
  ${rv(`<text class="serif" x="46" y="146" font-size="52" font-weight="400" letter-spacing="-1" fill="${t.text}">Distinctive websites,</text>`, 0.25, { dy: 22 })}
  ${rv(`<text class="serif" x="46" y="208" font-size="52" font-style="italic" font-weight="400" letter-spacing="-1" fill="${t.plum}">thoughtfully built.</text>`, 0.45, { dy: 22 })}
  <path d="M50 226 C 150 218, 270 232, 440 222" fill="none" stroke="${t.bronze}" stroke-width="2" stroke-linecap="round" stroke-dasharray="300" stroke-dashoffset="0">${draw}</path>
  ${rv(lines(["A designer and developer in Amman, Jordan,", "making expressive sites for businesses and brands,", "in English, Arabic or both."], 48, 262, 24, `font-size="15.5" fill="${t.soft}"`), 0.8, { dy: 12 })}
  ${rv(
    `<g>
      <rect x="48" y="336" width="176" height="34" rx="17" fill="${t.plum}"/>
      <text x="136" y="357.5" font-size="13" font-weight="600" text-anchor="middle" fill="${t.onPlum}">Visit the portfolio ↗</text>
      <circle cx="252" cy="353" r="3.5" fill="${t.bronze}"><animate attributeName="opacity" values="1;0.25;1" dur="2.4s" begin="1.6s" repeatCount="indefinite"/></circle>
      <text x="264" y="357.5" font-size="12.5" fill="${t.soft}">Amman, Jordan</text>
    </g>`,
    1.0,
    { dy: 10 },
  )}
  ${imgs}`;

  return svgDoc({ w: W, h: H, t, defs, body, title: "Ali Tsai, Scroll & Serif", desc: "Distinctive websites, thoughtfully built. Ali Tsai is a designer and developer in Amman, Jordan. Four project covers float to the right." });
}

/* --------------------------------------------------------------- ABOUT */
export async function about(t) {
  const W = 900,
    H = 318;
  const strengths = [
    ["01", "Visual design", "Type, colour and composition shaped around the business, not a template."],
    ["02", "Interactive development", "Motion and interaction that explain the work, and still work with a keyboard."],
    ["03", "Technical problem solving", "Integrations and edge cases handled with the habits of a support engineer."],
  ];
  let cols = "";
  strengths.forEach(([n, title, body], i) => {
    const x = 48 + i * 282;
    const wrapped = wrap(body, 13, 236);
    cols += rv(
      `<g>
        <line x1="${x}" y1="150" x2="${x + 236}" y2="150" stroke="${t.line}"/>
        <text class="serif" x="${x}" y="184" font-size="15" font-style="italic" fill="${t.bronze}">${n}</text>
        <text class="serif" x="${x + 30}" y="184" font-size="21" fill="${t.text}">${esc(title)}</text>
        ${lines(wrapped, x, 212, 20, `font-size="13" fill="${t.soft}"`)}
      </g>`,
      0.35 + i * 0.18,
      { dy: 16 },
    );
  });
  const body = `
  ${cardChrome(t, 0, 0, W, H, 26, "about")}
  ${rv(eyebrow(t, 48, 58, "About"), 0.05, { dy: 8 })}
  ${rv(
    `<text class="serif" x="46" y="108" font-size="29" fill="${t.text}">I build sites that look like <tspan font-style="italic" fill="${t.plum}">the business</tspan>,</text>
     <text class="serif" x="46" y="140" font-size="29" fill="${t.text}">and work well on a phone.</text>`,
    0.15,
    { dy: 18 },
  )}
  ${cols}
  ${rv(`<text x="48" y="292" font-size="12" fill="${t.soft}">The projects below are independent concept and personal builds, not client commissions.</text>`, 0.95, { dy: 8 })}`;
  return svgDoc({ w: W, h: H, t, defs: hairlineGradient(t, "about"), body, title: "About", desc: "Ali Tsai builds websites shaped around the business. Strengths: visual design, interactive development and technical problem solving." });
}

/* --------------------------------------------------------------- STACK */
export async function stack(t) {
  const W = 900,
    H = 340;
  const cx = 230,
    cy = 176;
  const inner = [
    ["siNextdotjs", "Next.js"],
    ["siReact", "React"],
    ["siTypescript", "TypeScript"],
    ["siTailwindcss", "Tailwind"],
  ];
  const outer = [
    ["siVite", "Vite"],
    ["siFramer", "Motion"],
    ["siHtml5", "HTML5"],
    ["siCss", "CSS"],
    ["siJavascript", "JavaScript"],
  ];
  const ring = (items, r, dur, dir) => {
    const parts = items
      .map(([slug], i) => {
        const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(a) * r,
          y = Math.sin(a) * r;
        const spin = animateTransform("rotate", dir > 0 ? "360 0 0;0 0 0" : "-360 0 0;0 0 0", { dur: `${dur}s`, repeat: "indefinite" });
        return `<g transform="translate(${f(x)} ${f(y)})"><g>
          <circle r="22" fill="${t.card2}" stroke="${t.line}"/>
          ${brandIcon(slug, -12, -12, 24, t.text)}
          ${spin}</g></g>`;
      })
      .join("");
    const rot = animateTransform("rotate", dir > 0 ? "0;360" : "0;-360", { dur: `${dur}s`, repeat: "indefinite" });
    return `<g>${parts}${rot}</g>`;
  };
  const defs = hairlineGradient(t, "stack") + `<radialGradient id="core" cx="0.35" cy="0.3" r="0.9"><stop offset="0" stop-color="${t.plum}"/><stop offset="1" stop-color="${t.plumDeep}"/></radialGradient>`;

  const groups = [
    ["Frameworks", ["Next.js · React · Vite"], 146],
    ["Languages and styling", ["TypeScript · JavaScript", "HTML5 · CSS · Tailwind CSS"], 208],
    ["Motion", ["Motion for React, CSS and SVG"], 292],
  ];
  let list = "";
  groups.forEach(([k, v, y], i) => {
    list += rv(
      `<g><text x="500" y="${y}" font-size="11" font-weight="600" letter-spacing="1.8" fill="${t.bronze}">${esc(k.toUpperCase())}</text>
       ${lines(v, 500, y + 26, 22, `class="serif" font-size="17" fill="${t.text}"`)}</g>`,
      0.4 + i * 0.18,
      { dy: 12 },
    );
  });

  const animated = `
  <g transform="translate(${cx} ${cy})">${ring(outer, 128, 60, 1)}${ring(inner, 70, 44, -1)}</g>
  <g transform="translate(${cx} ${cy})">
    <circle r="34" fill="url(#core)"/>
    <text class="serif" y="9" font-size="27" font-style="italic" text-anchor="middle" fill="${t.onPlum}">A</text>
    <circle r="40" fill="none" stroke="${t.bronze}" stroke-opacity="0.6"><animate attributeName="r" values="40;48;40" dur="4s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite"/></circle>
  </g>`;
  const full = `
  ${cardChrome(t, 0, 0, W, H, 26, "stack")}
  <circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="${t.line}" stroke-dasharray="3 7"/>
  <circle cx="${cx}" cy="${cy}" r="128" fill="none" stroke="${t.line}" stroke-dasharray="3 9"/>
  ${animated}
  ${rv(eyebrow(t, 500, 66, "Arsenal"), 0.05, { dy: 8 })}
  ${rv(`<text class="serif" x="498" y="104" font-size="28" fill="${t.text}">Tools I <tspan font-style="italic" fill="${t.plum}">fight with</tspan></text>`, 0.15, { dy: 14 })}
  ${list}
`;
  return svgDoc({ w: W, h: H, t, defs, body: full, title: "Stack", desc: "Next.js, React, Vite, TypeScript, JavaScript, HTML5, CSS, Tailwind CSS and Motion, shown as two rotating rings around a monogram." });
}

/* ----------------------------------------------------- ID + DASHBOARD */
export async function idDash(t) {
  const W = 900,
    H = 340;
  const defs =
    hairlineGradient(t, "id") +
    `<linearGradient id="badge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.plum}"/><stop offset="1" stop-color="${t.plumDeep}"/></linearGradient>` +
    `<clipPath id="barclip"><rect x="0" y="0" width="300" height="100"/></clipPath>`;

  // Badge, hangs from a fixed point and sways gently.
  const bx = 48,
    by = 40,
    bw = 236,
    bh = 262;
  const sway = animateTransform("rotate", `-1.6 ${bx + bw / 2} 20;1.6 ${bx + bw / 2} 20;-1.6 ${bx + bw / 2} 20`, { dur: "7s", repeat: "indefinite", calc: "spline", keyTimes: [0, 0.5, 1], splines: "0.45 0 0.55 1;0.45 0 0.55 1" });
  const badge = `
  <g>
    <path d="M${bx + bw / 2 - 18} 0 L${bx + bw / 2 - 6} ${by + 8} M${bx + bw / 2 + 18} 0 L${bx + bw / 2 + 6} ${by + 8}" stroke="${t.bronze}" stroke-width="2.5" fill="none"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="20" fill="url(#badge)"/>
    <rect x="${bx + bw / 2 - 26}" y="${by + 12}" width="52" height="9" rx="4.5" fill="${t.card}" fill-opacity="0.85"/>
    <text class="serif" x="${bx + bw / 2}" y="${by + 108}" font-size="68" font-style="italic" text-anchor="middle" fill="${t.onPlum}" fill-opacity="0.95">AT</text>
    <line x1="${bx + 28}" y1="${by + 130}" x2="${bx + bw - 28}" y2="${by + 130}" stroke="${t.onPlum}" stroke-opacity="0.3"/>
    <text class="serif" x="${bx + 28}" y="${by + 166}" font-size="26" fill="${t.onPlum}">Ali Tsai</text>
    <text x="${bx + 28}" y="${by + 190}" font-size="12.5" fill="${t.onPlum}" fill-opacity="0.82">Designer and developer</text>
    <text x="${bx + 28}" y="${by + 216}" font-size="10.5" font-weight="600" letter-spacing="1.8" fill="${t.onPlum}" fill-opacity="0.75">SCROLL &amp; SERIF</text>
    <text x="${bx + 28}" y="${by + 232}" font-size="10.5" font-weight="600" letter-spacing="1.8" fill="${t.onPlum}" fill-opacity="0.75">AMMAN, JORDAN</text>
    <rect x="${bx + 28}" y="${by + 244}" width="${bw - 56}" height="3" rx="1.5" fill="${t.bronze}"/>
    ${sway}
  </g>`;

  // KPI tiles (all counts come from the portfolio itself).
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
        <rect x="${x}" y="40" width="${kw}" height="104" rx="16" fill="${t.card2}" stroke="${t.line}"/>
        <text class="serif" x="${x + 20}" y="98" font-size="52" fill="${t.text}">${n}</text>
        ${lines(wrap(label, 12.5, kw - 36), x + 20, 122, 16, `font-size="12.5" fill="${t.soft}"`)}
      </g>`,
      0.3 + i * 0.15,
      { dy: 14 },
    );
  });

  // Bar chart: sites by build approach.
  const rows = [
    ["Next.js", 5],
    ["Vite", 1],
    ["Static HTML, CSS, JS", 1],
  ];
  const trackW = 250,
    unit = trackW / 5;
  let bars = "";
  rows.forEach(([name, n], i) => {
    const y = 214 + i * 34;
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
  ${kpiSvg}
  ${rv(eyebrow(t, kx, 184, "Live sites by build"), 0.7, { dy: 6 })}
  ${rv(bars, 0.75, { dy: 6 })}`;
  return svgDoc({ w: W, h: H, t, defs, body, title: "ID and dashboard", desc: "An ID badge for Ali Tsai, designer and developer at Scroll & Serif in Amman, plus counts from the portfolio: 7 live sites, 4 featured case studies, 3 site languages, and a chart of how the sites are built." });
}

/* ------------------------------------------------------------- CONNECT */
export async function connect(t) {
  const W = 900,
    H = 150;
  const body = `
  ${cardChrome(t, 0, 0, W, H, 26, "connect")}
  ${rv(eyebrow(t, 48, 50, "Send a message"), 0.05, { dy: 8 })}
  ${rv(`<text class="serif" x="46" y="98" font-size="36" fill="${t.text}">Next mission: <tspan font-style="italic" fill="${t.plum}">your website.</tspan></text>`, 0.15, { dy: 16 })}
  ${rv(`<text x="48" y="126" font-size="13.5" fill="${t.soft}">Based in Amman, Jordan. The quickest route is email or the portfolio's contact form.</text>`, 0.4, { dy: 8 })}
  <g transform="translate(790 76)">
    <circle r="30" fill="none" stroke="${t.bronze}" stroke-opacity="0.5" stroke-dasharray="2 6"><animateTransform attributeName="transform" type="rotate" values="0;360" dur="24s" repeatCount="indefinite"/></circle>
    <circle r="22" fill="${t.plum}"/>
    <path d="M-8 6 L8 -6 M8 -6 H-2 M8 -6 V4" stroke="${t.onPlum}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
  return svgDoc({ w: W, h: H, t, defs: hairlineGradient(t, "connect"), body, title: "Connect", desc: "Have a website in mind? Say hello. Based in Amman, Jordan." });
}

/** Small clickable link tile (one SVG per link, wrapped in an anchor in the README). */
export async function linkTile(t, { label, sub, icon }) {
  const W = 210,
    H = 78;
  const body = `
  ${cardChrome(t, 0, 0, W, H, 18, "lt")}
  <circle cx="40" cy="39" r="20" fill="${t.card2}" stroke="${t.line}"/>
  ${phosphor(icon, 28, 27, 24, t.plum)}
  <text class="serif" x="72" y="37" font-size="19" fill="${t.text}">${esc(label)}</text>
  <text x="72" y="57" font-size="11.5" fill="${t.soft}">${esc(sub)}</text>
  <text x="${W - 26}" y="44" font-size="15" fill="${t.bronze}">↗<animateTransform attributeName="transform" type="translate" values="0 0;2 -2;0 0" dur="3.2s" repeatCount="indefinite"/></text>`;
  return svgDoc({ w: W, h: H, t, defs: hairlineGradient(t, "lt"), body, title: label, desc: `${label}: ${sub}` });
}

/** Project cover card: slow push-in on the cover, name, one honest line, and a concept tag. */
export async function projectCard(t, { cover: name, title, line, tag, mission }) {
  const W = 436,
    H = 336;
  const imgH = 192;
  const src = await cover(name, 760, 68);
  const pad = 12;
  const iw = W - pad * 2;
  const grow = (a, from, to) => animate(a, `${from};${to};${from}`, { dur: "16s", repeat: "indefinite", calc: "spline", keyTimes: [0, 0.5, 1], splines: "0.45 0 0.55 1;0.45 0 0.55 1" });
  const zoom = 1.07;
  const defs = hairlineGradient(t, "pc") + `<clipPath id="ci"><rect x="${pad}" y="${pad}" width="${iw}" height="${imgH}" rx="14"/></clipPath>`;
  const ix = pad,
    iy = pad,
    ih = iw * (2 / 3);
  const body = `
  ${cardChrome(t, 0, 0, W, H, 22, "pc")}
  <g clip-path="url(#ci)">
    <image href="${src}" x="${ix}" y="${f(iy - (ih - imgH) / 2)}" width="${iw}" height="${f(ih)}" preserveAspectRatio="xMidYMid slice">
      ${grow("width", iw, f(iw * zoom))}
      ${grow("x", ix, f(ix - (iw * (zoom - 1)) / 2))}
      ${grow("height", f(ih), f(ih * zoom))}
      ${grow("y", f(iy - (ih - imgH) / 2), f(iy - (ih - imgH) / 2 - (ih * (zoom - 1)) / 2))}
    </image>
  </g>
  <g transform="translate(${pad + 14} ${pad + 14})"><rect width="${textWidth(mission, 11) + 26}" height="26" rx="13" fill="${t.card}" fill-opacity="0.92"/><text x="13" y="17.5" font-size="11" font-weight="700" letter-spacing="1.6" fill="${t.plum}">${esc(mission.toUpperCase())}</text></g>
  <text class="serif" x="${pad + 6}" y="${imgH + pad + 40}" font-size="26" fill="${t.text}">${esc(title)}</text>
  <text x="${W - pad - 6}" y="${imgH + pad + 38}" font-size="16" text-anchor="end" fill="${t.bronze}">↗</text>
  ${lines(wrap(line, 13.5, iw - 12), pad + 6, imgH + pad + 64, 19, `font-size="13.5" fill="${t.soft}"`)}
  <g transform="translate(${pad + 6} ${H - 44})">
    <rect width="${textWidth(tag, 11) + 22}" height="24" rx="12" fill="none" stroke="${t.lineStrong}"/>
    <text x="11" y="16" font-size="11" font-weight="600" letter-spacing="0.6" fill="${t.plum}">${esc(tag)}</text>
  </g>`;
  return svgDoc({ w: W, h: H, t, defs, body, title: title, desc: `${title}. ${line} ${tag}.` });
}
