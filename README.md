# MRI reconstruction comparison graph

Reconstruction methods from the studies behind Fig. 2 of the paper (in
preparation), linked when two were measured side by side in the same study.
Each method's θ is its difference from U-Net (fastMRI), fitted on differences
within one study and protocol only, so methods never compared directly still
land on one scale through the methods they share. A method's distance from
U-Net shows how firmly the comparisons tie it there (its standard error).

## Open it

**<https://icon-lab.github.io/mri-recon-comparison-graph/>**

Or download [comparison-graph.html](comparison-graph.html) ("Download raw file")
and open it in a browser: everything is inside the file, so it works offline,
with no server.

- **2D** is the network. Click a method for its θ, its studies, what it was
  compared with and a link to its paper (or, for a method with no paper of its
  own, to the study that reported it; basic operations such as zero-filling get
  a line saying what they are); search, filter by family, window or number of
  studies.
- **3D** lifts every method to its θ, so height is the difference from U-Net and
  distance from the centre is still the standard error. Drag down to tilt into
  it, drag to turn, let go near the top view to come back to 2D.

## Methods table

[methods.csv](methods.csv) has one row per method: family, first year in the
corpus, whether a study proposed it, θ ± SE with the number of studies, for
PSNR (dB) and SSIM (logit), and the online address (DOI, else arXiv) of its
paper, or of the first study that reported it when it has no paper of its own
(empty for basic operations such as zero-filling). GitHub shows it as a
searchable table.

## Updating

1. In the umram project, `python3 scripts/site_graf_verisi.py` writes
   `rapor/site/mri_recon_graph.json`. Copy it to `data/`.
2. `npm install` (once), then `npm run layout`, `npm run csv` and
   `npm run build`.
3. Commit `data/`, `methods.csv` and `comparison-graph.html` together; a push to
   `main` republishes the page.

To work on the page itself, `npm run serve` and open
<http://localhost:8000/src/>; `npm run build` folds it into the single file.

## Files

- `src/`: the page (`index.html`, `styles.css`) and `recon-graph.js`, which draws it.
- `data/mri_recon_graph.json`: the networks, with the layout `npm run layout` adds.
- `tools/`: the layout, the table and the single-file build.
- `vendor/d3.min.js`: d3 7.9.0 (ISC licence, `vendor/LICENSE-d3`).

## Licence

The code is under the MIT licence ([LICENSE](LICENSE)); the data in `data/` and
`methods.csv` under CC BY 4.0 ([LICENSE-DATA](LICENSE-DATA)); d3 under its own
ISC licence ([vendor/LICENSE-d3](vendor/LICENSE-d3)).
