// Shared helpers for the profile SVG generator.
// Everything is self-contained: fonts and images are embedded as base64, nothing loads from the network,
// and only SMIL animation is used (GitHub strips JavaScript). Every element's static attributes are its FINAL
// state, so a viewer that ignores animation still shows the finished card.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import subsetFont from "subset-font";
import * as si from "simple-icons";

export const root = path.resolve(import.meta.dirname, "..");

/** Scroll & Serif palette: ivory, charcoal, deep plum, muted bronze. */
export const themes = {
  light: {
    name: "light",
    bg: "#f4efe7",
    card: "#fbf7f0",
    card2: "#efe7da",
    line: "rgba(36,33,31,0.16)",
    lineStrong: "rgba(36,33,31,0.34)",
    text: "#24211f",
    soft: "#5b544d",
    plum: "#674350",
    plumDeep: "#3a2230",
    bronze: "#a37d4f",
    onPlum: "#f7f1e8",
    dots: "rgba(36,33,31,0.07)",
    glow: "rgba(103,67,80,0.22)",
  },
  dark: {
    name: "dark",
    bg: "#17120f",
    card: "#201915",
    card2: "#2a211c",
    line: "rgba(241,235,226,0.18)",
    lineStrong: "rgba(241,235,226,0.38)",
    text: "#f1ebe2",
    soft: "#bdb4aa",
    plum: "#dba9bb",
    plumDeep: "#a8788b",
    bronze: "#c8a26f",
    onPlum: "#2a1620",
    dots: "rgba(241,235,226,0.07)",
    glow: "rgba(219,169,187,0.16)",
  },
};

const fontCache = new Map();
/** Base64 woff2 @font-face rules, subset to exactly the characters a card uses (keeps each SVG small). */
export async function fontCss(chars, { serif, italic }) {
  const set = [...new Set(chars)].sort().join("");
  const faces = [["SS Sans", "normal", "hanken.woff2", true]];
  if (serif) faces.push(["SS Serif", "normal", "newsreader.woff2", true]);
  if (italic) faces.push(["SS Serif", "italic", "newsreader-italic.woff2", true]);
  const parts = [];
  for (const [family, style, file] of faces) {
    const key = `${file}|${set}`;
    if (!fontCache.has(key)) {
      const out = await subsetFont(fs.readFileSync(path.join(root, "src/fonts", file)), set, { targetFormat: "woff2" });
      fontCache.set(key, out.toString("base64"));
    }
    parts.push(`@font-face{font-family:'${family}';font-style:${style};font-weight:200 800;src:url(data:font/woff2;base64,${fontCache.get(key)}) format('woff2')}`);
  }
  return parts.join("");
}

const imgCache = new Map();
/** A project cover as a base64 JPEG data URI at the given pixel width. */
export async function cover(name, width = 624, quality = 70) {
  const key = `${name}-${width}-${quality}`;
  if (!imgCache.has(key)) {
    const buf = await sharp(path.join(root, "src/covers", `${name}.webp`)).resize({ width }).jpeg({ quality, mozjpeg: true }).toBuffer();
    imgCache.set(key, `data:image/jpeg;base64,${buf.toString("base64")}`);
  }
  return imgCache.get(key);
}

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const f = (n) => +n.toFixed(2);

/** Simple Icons brand glyph (24x24 box), drawn at x,y with the given size and fill. */
export function brandIcon(slug, x, y, size, fill) {
  const icon = si[slug];
  if (!icon) throw new Error(`Missing Simple Icons glyph: ${slug}`);
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(size / 24)})" fill="${fill}"><path d="${icon.path}"/></g>`;
}

/** Phosphor glyph (256x256 box), drawn at x,y with the given size and fill. */
export function phosphor(name, x, y, size, fill, weight = "regular") {
  const file = path.join(root, "node_modules/@phosphor-icons/core/assets", weight, weight === "regular" ? `${name}.svg` : `${name}-${weight}.svg`);
  const inner = fs.readFileSync(file, "utf8").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>[\s\S]*$/, "");
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(size / 256)})" fill="${fill}">${inner}</g>`;
}

/** Joins keyTimes/values for a SMIL <animate>. Values and keyTimes may be arrays. */
export function animate(attr, values, { dur, begin = "0s", keyTimes, repeat, fill, calc, splines, extra = "" } = {}) {
  const v = Array.isArray(values) ? values.join(";") : values;
  const kt = keyTimes ? ` keyTimes="${keyTimes.map(f).join(";")}"` : "";
  const rc = repeat ? ` repeatCount="${repeat}"` : "";
  const fl = fill ? ` fill="${fill}"` : "";
  const cm = calc ? ` calcMode="${calc}"` : "";
  const ks = splines ? ` keySplines="${splines}"` : "";
  return `<animate attributeName="${attr}" values="${v}" dur="${dur}" begin="${begin}"${kt}${rc}${fl}${cm}${ks} ${extra}/>`;
}

export function animateTransform(type, values, { dur, begin = "0s", keyTimes, repeat, fill, calc, splines, additive } = {}) {
  const v = Array.isArray(values) ? values.join(";") : values;
  const kt = keyTimes ? ` keyTimes="${keyTimes.map(f).join(";")}"` : "";
  const rc = repeat ? ` repeatCount="${repeat}"` : "";
  const fl = fill ? ` fill="${fill}"` : "";
  const cm = calc ? ` calcMode="${calc}"` : "";
  const ks = splines ? ` keySplines="${splines}"` : "";
  const ad = additive ? ` additive="${additive}"` : "";
  return `<animateTransform attributeName="transform" type="${type}" values="${v}" dur="${dur}" begin="${begin}"${kt}${rc}${fl}${cm}${ks}${ad}/>`;
}

export const EASE = "0.2 0.7 0.2 1";

/** Standard card chrome: rounded surface, dot texture and a gradient hairline border. */
export function cardChrome(t, x, y, w, h, r = 22, id = "c") {
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${t.card}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#dots)"/>
    <rect x="${x + 0.75}" y="${y + 0.75}" width="${w - 1.5}" height="${h - 1.5}" rx="${r - 0.75}" fill="none" stroke="url(#hair-${id})" stroke-width="1.5"/>
  </g>`;
}

export function hairlineGradient(t, id = "c", x2 = "1", y2 = "1") {
  return `<linearGradient id="hair-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${t.plum}" stop-opacity="0.7"/><stop offset="0.55" stop-color="${t.line}"/><stop offset="1" stop-color="${t.bronze}" stop-opacity="0.7"/></linearGradient>`;
}

/** Wraps card body into a complete SVG document. */
export async function svgDoc({ w, h, t, title, desc, defs = "", body }) {
  const text = [...body.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map((m) => m[1].replace(/<[^>]+>/g, "")).join("");
  const chars = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") + " ";
  const css = await fontCss(chars, { serif: body.includes('class="serif"'), italic: body.includes('font-style="italic"') });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title>
<desc id="desc">${esc(desc)}</desc>
<defs>
<style>${css}
text{font-family:'SS Sans',system-ui,sans-serif}
.serif{font-family:'SS Serif',Georgia,serif}
</style>
<pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${t.dots}"/></pattern>
${defs}
</defs>
${body}
</svg>
`;
}

/** Approximate text width in px for chip layout (Hanken Grotesk, around 0.56em per character). */
export const textWidth = (s, size) => Math.ceil(s.length * size * 0.56);
