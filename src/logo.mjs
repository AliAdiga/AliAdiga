// Scroll & Serif logo: S&S monogram (the portfolio's own footer mark) as a square avatar, plus a wordmark lockup.
// Writes logo/*.svg; scripts/logo-png.cjs renders PNGs. Content stays inside the central circle so GitHub's round crop is safe.
import fs from "node:fs";
import path from "node:path";
import { fontCss, root } from "./lib.mjs";

const variants = {
  plum: { bg: "#3a2230", bg2: "#674350", ink: "#f4efe7", amp: "#c8a26f", ring: "#c8a26f" },
  ivory: { bg: "#f4efe7", bg2: "#efe7da", ink: "#3a2230", amp: "#a37d4f", ring: "#a37d4f" },
};

const css = await fontCss("S&Scrollif ", { serif: true, italic: true });

function avatar(v) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" aria-label="Scroll &amp; Serif">
<defs><style>${css}.s{font-family:'SS Serif',Georgia,serif}</style>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${v.bg2}"/><stop offset="1" stop-color="${v.bg}"/></linearGradient></defs>
<rect width="1024" height="1024" fill="url(#g)"/>
<circle cx="512" cy="512" r="372" fill="none" stroke="${v.ring}" stroke-opacity="0.55" stroke-width="3"/>
<circle cx="512" cy="512" r="352" fill="none" stroke="${v.ring}" stroke-opacity="0.25" stroke-width="1.5" stroke-dasharray="2 12"/>
<g class="s" text-anchor="middle" font-size="300" letter-spacing="-6">
<text x="512" y="598" fill="${v.ink}">S<tspan font-style="italic" fill="${v.amp}" dx="6" dy="-4">&amp;</tspan><tspan dx="6" dy="4">S</tspan></text>
</g>
<path d="M392 668 H632" stroke="${v.amp}" stroke-width="4" stroke-linecap="round"/>
</svg>
`;
}

function wordmark(v, transparent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="320" viewBox="0 0 1200 320" role="img" aria-label="Scroll &amp; Serif">
<defs><style>${css}.s{font-family:'SS Serif',Georgia,serif}</style></defs>
${transparent ? "" : `<rect width="1200" height="320" rx="28" fill="${v.bg}"/>`}
<text class="s" x="600" y="200" font-size="140" text-anchor="middle" letter-spacing="-3" fill="${v.ink}">Scroll <tspan font-style="italic" fill="${v.amp}">&amp;</tspan> Serif</text>
<path d="M440 236 H760" stroke="${v.amp}" stroke-width="3" stroke-linecap="round"/>
</svg>
`;
}

const dir = path.join(root, "logo");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "avatar-plum.svg"), avatar(variants.plum));
fs.writeFileSync(path.join(dir, "avatar-ivory.svg"), avatar(variants.ivory));
fs.writeFileSync(path.join(dir, "wordmark-plum.svg"), wordmark(variants.plum, false));
fs.writeFileSync(path.join(dir, "wordmark-ivory.svg"), wordmark(variants.ivory, false));
console.log("logo svgs written");
