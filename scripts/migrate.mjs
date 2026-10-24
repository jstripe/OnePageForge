// Usage: node scripts/migrate.mjs --name "NewName" --domain newdomain.com [--dry]
// Renames the brand, slug and domain everywhere, then lists anything that still mentions the old values.
import fs from "node:fs";
import path from "node:path";

const arg = (k) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : undefined; };
const name = arg("name"), domain = arg("domain"), dry = process.argv.includes("--dry");
const oldName = arg("old-name") || "SiteForge", oldDomain = arg("old-domain") || "siteforge.com";
if (!name || !domain) { console.error('Usage: node scripts/migrate.mjs --name "NewName" --domain newdomain.com [--dry]'); process.exit(1); }
const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
const oldSlug = oldName.toLowerCase().replace(/[^a-z0-9]+/g, "");

const SKIP = new Set(["node_modules", ".next", "out", ".git", "media-source", ".wrangler", ".claude"]);
const TEXT = /\.(ts|tsx|js|mjs|json|jsonc|md|css|html|txt|webmanifest|svg|example)$/;
const rules = [
  [oldDomain, domain],
  [oldName, name],
  [oldSlug, slug],
  [oldName.toUpperCase(), name.toUpperCase()],
];

let changed = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!TEXT.test(e.name) && e.name !== ".dev.vars.example" && e.name !== ".gitignore") continue;
    if (e.name === "package-lock.json" || e.name === "migrate.mjs") continue;
    const before = fs.readFileSync(p, "utf8");
    let after = before;
    for (const [a, b] of rules) after = after.split(a).join(b);
    if (after !== before) { changed++; console.log((dry ? "would change " : "changed ") + p); if (!dry) fs.writeFileSync(p, after); }
  }
}
walk(".");

if (!dry && fs.existsSync("package-lock.json")) {
  const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
  lock.name = slug; if (lock.packages?.[""]) lock.packages[""].name = slug;
  fs.writeFileSync("package-lock.json", JSON.stringify(lock, null, 2) + "\n");
}

console.log(`\n${changed} files ${dry ? "would change" : "changed"}. Now regenerate brand images: python3 scripts/brand-assets.py "${name}"`);

const left = [];
(function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name) || e.name === "package-lock.json" || e.name === "migrate.mjs") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { scan(p); continue; }
    if (!TEXT.test(e.name)) continue;
    const t = fs.readFileSync(p, "utf8");
    if (new RegExp(oldName + "|" + oldSlug + "|" + oldDomain.replace(".", "\\."), "i").test(t)) left.push(p);
  }
})(".");
console.log(left.length ? "Still mentions the old name:\n" + left.join("\n") : "Nothing left of the old name in text files.");
