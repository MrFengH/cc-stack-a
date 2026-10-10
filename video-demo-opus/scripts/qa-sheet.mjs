// QA contact sheets, composed in a browser (the bundled ffmpeg has no select/tile filters).
//   node scripts/qa-sheet.mjs [clipName ...]      start/middle/end source frame of captured clips
//   node scripts/qa-sheet.mjs --dir <folder>      every image in a folder (e.g. rendered frames), 3 per row
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const dataUrl = (file) => `data:image/${file.endsWith(".png") ? "png" : "jpeg"};base64,${fs.readFileSync(file).toString("base64")}`;
const sheets = [];
if (args[0] === "--dir") {
  const dir = path.resolve(args[1]);
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/.test(f)).sort();
  for (let i = 0; i < files.length; i += 9) {
    sheets.push({ out: `scratch/qa/${path.basename(dir)}-${String(i / 9).padStart(2, "0")}.jpg`, files: files.slice(i, i + 9).map((f) => path.join(dir, f)) });
  }
} else {
  const root = path.resolve("scratch/frames");
  for (const name of args.length ? args : fs.readdirSync(root)) {
    const frames = fs.readdirSync(path.join(root, name)).sort();
    sheets.push({ out: `scratch/qa/${name}.jpg`, files: [0, Math.floor(frames.length / 2), frames.length - 1].map((i) => path.join(root, name, frames[i])) });
  }
}

fs.mkdirSync("scratch/qa", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 360 } });
for (const s of sheets) {
  const rows = Math.ceil(s.files.length / 3);
  await page.setViewportSize({ width: 1920, height: rows * 360 });
  const cells = s.files.map((f) => `<figure style="margin:0;position:relative"><img src="${dataUrl(f)}" style="width:640px;height:360px;display:block"><figcaption style="position:absolute;left:6px;top:4px;font:600 18px sans-serif;color:#f0f;text-shadow:0 0 3px #000">${path.basename(f)}</figcaption></figure>`);
  await page.setContent(`<body style="margin:0;display:flex;flex-wrap:wrap;background:#000">${cells.join("")}</body>`);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete));
  await page.screenshot({ path: s.out, type: "jpeg", quality: 72 });
  console.log(s.out);
}
await browser.close();
