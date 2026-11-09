// Generates every SVG, the README, the placeholder contribution city and the workflow.
// Run: npm run build
import fs from "node:fs";
import path from "node:path";
import { about, connect, linkTile, projectCard } from "./cards.mjs";
import { heroAnime as hero, idAnime as idDash, stackAnime as stack } from "./cards-anime.mjs";
import { root, themes, svgDoc, cardChrome, hairlineGradient, esc } from "./lib.mjs";

const VERSION = "1"; // bump to bust GitHub's image cache after changing an SVG
const SITE = "https://scroll-and-serif.vercel.app";
const write = (rel, data) => {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data);
  return p;
};

const projects = [
  { key: "dar", cover: "dar", title: "DAR", line: "Walk through a home room by room, then change its light and finish.", url: "https://dar-architecture.vercel.app" },
  { key: "aurelle", cover: "aurelle", title: "Aurelle", line: "Meet each fragrance as a scene, in English, French or Arabic.", url: "https://aurelle-perfume-ashen.vercel.app" },
  { key: "zaytoun", cover: "zaytoun", title: "Zaytoun", line: "Browse the menu, then move toward a table.", url: "https://zaytoun-restaurant.vercel.app" },
  { key: "caucasus", cover: "caucasus", title: "Caucasus Sweets Home", line: "An Arabic-first catalogue with an English twin, prices included.", url: "https://caucasus-sweets-home.vercel.app" },
];
const links = [
  { key: "portfolio", label: "Portfolio", sub: "scroll-and-serif.vercel.app", icon: "globe-simple", url: SITE },
  { key: "email", label: "Email", sub: "alitsai55@gmail.com", icon: "envelope-simple", url: "mailto:alitsai55@gmail.com" },
  { key: "linkedin", label: "LinkedIn", sub: "ali-tsai", icon: "linkedin-logo", url: "https://www.linkedin.com/in/ali-tsai/" },
  { key: "instagram", label: "Instagram", sub: "@scrollandserif", icon: "instagram-logo", url: "https://www.instagram.com/scrollandserif" },
];

const sizes = {};
for (const t of Object.values(themes)) {
  const jobs = [
    ["hero", await hero(t)],
    ["about", await about(t)],
    ["stack", await stack(t)],
    ["id", await idDash(t)],
    ["connect", await connect(t)],
    ...(await Promise.all(projects.map(async (p, i) => [`work-${p.key}`, await projectCard(t, { cover: p.cover, title: p.title, line: p.line, tag: "Independent concept", mission: `Mission 0${i + 1}` })]))),
    ...(await Promise.all(links.map(async (l) => [`link-${l.key}`, await linkTile(t, l)]))),
  ];
  for (const [name, svg] of jobs) {
    const rel = `assets/${name}-${t.name}.svg`;
    write(rel, svg);
    sizes[rel] = Buffer.byteLength(svg);
  }
}

/* Placeholder contribution city: replaced by the real 3D render once the workflow has run. */
for (const t of Object.values(themes)) {
  const svg = await svgDoc({
    w: 900,
    h: 200,
    t,
    defs: hairlineGradient(t, "ph"),
    title: "Contribution city",
    desc: "A 3D view of GitHub contributions. It appears here after the profile workflow has run once.",
    body: `${cardChrome(t, 0, 0, 900, 200, 26, "ph")}
    <text x="48" y="74" font-size="11" font-weight="600" letter-spacing="2.2" fill="${t.bronze}">CONTRIBUTION CITY</text>
    <text class="serif" x="46" y="118" font-size="30" fill="${t.text}">Built from real commits, <tspan font-style="italic" fill="${t.plum}">once the workflow runs.</tspan></text>
    <text x="48" y="152" font-size="13" fill="${t.soft}">Actions tab → "GitHub-Profile-3D-Contrib" → Run workflow.</text>`,
  });
  write(`assets/city-placeholder-${t.name}.svg`, svg);
}

const pic = (name, alt, width = "100%") =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg?v=${VERSION}"><img src="assets/${name}-light.svg?v=${VERSION}" alt="${esc(alt)}" width="${width}"></picture>`;

const workCells = projects.map((p) => `<td width="50%" valign="top"><a href="${p.url}">${pic(`work-${p.key}`, `${p.title}: ${p.line} Independent concept. Opens the live site.`)}</a></td>`);
const linkCells = links.map((l) => `<td width="25%" align="center"><a href="${l.url}">${pic(`link-${l.key}`, `${l.label}: ${l.sub}`)}</a></td>`);

const readme = `<div align="center">

<a href="${SITE}">${pic("hero", "Ali Tsai, Scroll & Serif. Distinctive websites, thoughtfully built. A designer and developer in Amman, Jordan.")}</a>

</div>

${pic("about", "About: visual design, interactive development and technical problem solving. The projects below are independent concept and personal builds.")}

${pic("stack", "Stack: Next.js, React, Vite, TypeScript, JavaScript, HTML5, CSS, Tailwind CSS and Motion.")}

${pic("id", "Ali Tsai, designer and developer, Scroll & Serif, Amman. 7 live sites, 4 featured case studies, 3 site languages.")}

## Missions

<table>
<tr>
${workCells.slice(0, 2).join("\n")}
</tr>
<tr>
${workCells.slice(2, 4).join("\n")}
</tr>
</table>

<sub>Each mission card opens the live site. All four are independent concept and personal projects. The portfolio also shows three more websites.</sub>

<a href="profile-3d-contrib/profile-night-view.svg"><img src="profile-3d-contrib/profile-night-view.svg" alt="A 3D city built from my GitHub contributions" width="100%"></a>

${pic("connect", "Have a website in mind? Say hello. Based in Amman, Jordan.")}

<table>
<tr>
${linkCells.join("\n")}
</tr>
</table>
`;
write("README.md", readme);

/* Placeholder is used by the README until the workflow replaces it. */
fs.mkdirSync(path.join(root, "profile-3d-contrib"), { recursive: true });
const night = path.join(root, "profile-3d-contrib/profile-night-view.svg");
if (!fs.existsSync(night)) fs.copyFileSync(path.join(root, "assets/city-placeholder-dark.svg"), night);

write(
  ".github/workflows/profile-3d-contrib.yml",
  `name: GitHub-Profile-3D-Contrib

on:
  schedule: # every day at 18:00 UTC
    - cron: "0 18 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    name: Generate the 3D contribution city
    steps:
      - uses: actions/checkout@v4
      - uses: yoshi389111/github-profile-3d-contrib@v0.9.3
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          USERNAME: \${{ github.repository_owner }}
      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add -A profile-3d-contrib
          git diff --cached --quiet || git commit -m "Update contribution city"
          git push
`,
);
write(".gitignore", "node_modules\n.DS_Store\n");

for (const [k, v] of Object.entries(sizes)) console.log(k.padEnd(34), (v / 1024).toFixed(1) + " KB");
console.log("done");
