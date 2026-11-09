// Renders the README-like preview in both colour schemes at two moments in the animation.
const path = require("path");
const fs = require("fs");
const { chromium } = require("D:/Projects/DAR/node_modules/playwright");
const root = path.resolve(__dirname, "..");
const out = process.argv[2];
const dir = path.join(root, "assets").replace(/\\/g, "/");

const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
// crude README->HTML: only the raw HTML parts matter; convert the heading.
const html = `<!doctype html><meta charset="utf-8"><base href="file:///${root.replace(/\\/g, "/")}/">
<style>body{margin:0;padding:24px;max-width:830px;margin:0 auto;font-family:system-ui;background:var(--bg);color:var(--fg)}
:root{--bg:#fff;--fg:#1f2328}@media(prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#e6edf3}}
img{display:block;max-width:100%}table{border-collapse:collapse;width:100%}td{padding:4px;vertical-align:top}h2{border-bottom:1px solid #8883;padding-bottom:6px}</style>
${readme.replace(/^## (.*)$/m, "<h2>$1</h2>")}`;
fs.writeFileSync(path.join(root, "scripts", "preview.html"), html);

(async () => {
  const b = await chromium.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await b.newContext({ colorScheme: scheme, viewport: { width: 880, height: 3200 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto("file:///" + path.join(root, "scripts", "preview.html").replace(/\\/g, "/"));
    await p.waitForTimeout(350);
    await p.screenshot({ path: path.join(out, `early-${scheme}.png`), fullPage: true });
    await p.waitForTimeout(4200);
    await p.screenshot({ path: path.join(out, `final-${scheme}.png`), fullPage: true });
    await ctx.close();
  }
  await b.close();
})();
