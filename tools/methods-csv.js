// Writes methods.csv, one row per method, which GitHub shows as a searchable
// table. θ and its standard error are against U-Net (fastMRI) in the all-years
// graph, PSNR in dB and SSIM in logit; "first year" is the method's first year
// in the corpus. Run it whenever data/mri_recon_graph.json changes:
//   npm run csv
const fs = require("fs"),
  path = require("path");

const root = path.resolve(__dirname, "..");
const D = JSON.parse(fs.readFileSync(path.join(root, "data/mri_recon_graph.json"), "utf8"));
const byId = (m) => new Map(D.networks[m].all.nodes.map((n) => [n[0], n]));
const psnr = byId("psnr"),
  ssim = byId("ssim");
const cell = (v) => (v == null ? "" : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const fit = (n) => (n ? [n[1], n[2], n[4]] : ["", "", ""]); // θ, SE, studies

const rows = D.methods
  .map((m, i) => ({ m, p: psnr.get(i), s: ssim.get(i) }))
  .filter((r) => r.p || r.s)
  .sort((a, b) => a.m.name.localeCompare(b.m.name, "en", { sensitivity: "base" }))
  .map(({ m, p, s }) => [m.name, m.family, m.year, m.proposed ? "yes" : "no", ...fit(p), ...fit(s)]);
const head = ["method", "family", "first year", "proposed", "PSNR θ (dB)", "PSNR SE", "PSNR studies", "SSIM θ (logit)", "SSIM SE", "SSIM studies"];
fs.writeFileSync(path.join(root, "methods.csv"), [head, ...rows].map((r) => r.map(cell).join(",")).join("\n") + "\n");
console.log(`wrote methods.csv (${rows.length} methods)`);
