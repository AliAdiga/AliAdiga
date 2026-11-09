const path = require("path");
const fs = require("fs");
const { chromium } = require("D:/Projects/DAR/node_modules/playwright");
const dir = path.resolve(__dirname, "..", "logo");
(async () => {
  const b = await chromium.launch();
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".svg"))) {
    const svg = fs.readFileSync(path.join(dir, f), "utf8");
    const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/);
    const p = await b.newPage({ viewport: { width: +w, height: +h } });
    await p.setContent(`<body style="margin:0;background:transparent">${svg}</body>`);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(dir, f.replace(".svg", ".png")), omitBackground: true });
    await p.close();
  }
  await b.close();
})();
