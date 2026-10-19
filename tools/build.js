// Builds evidence-graph.html: src/index.html with its styles, d3, the script
// and the data inlined, so the page opens from a downloaded file, offline and
// with no server. Run it after any change to src/ or data/:
//   npm run build
//
// recon-graph.js goes in unchanged (it is a copy of the site's): the data rides
// in the page as JSON and the script fetches it from a blob URL.
const fs = require("fs"),
  path = require("path");

const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const script = (p) => {
  const s = read(p);
  if (/<\/script/i.test(s)) throw new Error(`${p} contains "</script", which would end the inline script`);
  return s;
};
let html = read("src/index.html");
// A function as the replacement, since d3's source is full of "$&"-like text.
const swap = (tag, body) => {
  if (!html.includes(tag)) throw new Error(`src/index.html no longer has ${tag}`);
  html = html.replace(tag, () => body);
};

swap('<link rel="stylesheet" href="styles.css" />', `<style>\n${read("src/styles.css")}</style>`);
swap('<script src="../vendor/d3.min.js"></script>', `<script>\n${script("vendor/d3.min.js")}</script>`);
swap(
  '<script src="recon-graph.js"></script>',
  `<script type="application/json" id="graph-data">${read("data/mri_recon_graph.json").replace(/<\//g, "<\\/")}</script>
    <script>
      document.querySelector("[data-graph]").dataset.src = URL.createObjectURL(
        new Blob([document.getElementById("graph-data").textContent], { type: "application/json" })
      );
    </script>
    <script>
${script("src/recon-graph.js")}</script>`
);
fs.writeFileSync(path.join(root, "evidence-graph.html"), html);
console.log(`wrote evidence-graph.html (${(html.length / 1e6).toFixed(1)} MB)`);
