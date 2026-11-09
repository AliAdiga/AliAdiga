const { chromium } = require("D:/Projects/DAR/node_modules/playwright");
const fs = require("fs");
(async () => {
  const [src, out, w, h, scheme] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
  await p.setContent(`<body style="margin:0;background:#ccc">${fs.readFileSync(src, "utf8")}</body>`);
  await p.waitForTimeout(400);
  await p.screenshot({ path: out });
  await b.close();
})();
