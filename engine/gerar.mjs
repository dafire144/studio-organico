// studio-organico — gerador. Lê brand.json + conteudo.json e escreve os HTML dos posts.
// Suporta CARROSSEL (vários slides com dots/ARRASTE) e ESTÁTICO (1 slide, sem nav).
//
// Uso:  node gerar.mjs <brand.json> <conteudo.json> <outDir>
//   default: brand.json=./brand.json  conteudo=./conteudo.json  outDir=./out
//   HTML saem em <outDir>/html/ ; rode depois o render (render.ps1 / render.sh).
//
// conteudo.json:
// { "posts": [
//   { "id":"P01", "tipo":"carrossel", "dark":true, "slides":[ {"t":"coverFull","photo":{"img":"jobs"},"title":"..."}, {"t":"cards",...}, {"t":"cta",...} ] },
//   { "id":"S01", "tipo":"estatico", "slide":{ "t":"bignum","num":"89%","label":"...","ctx":"..." } }
// ] }
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const brandPath = resolve(argv[0] || "./brand.json");
const contentPath = resolve(argv[1] || "./conteudo.json");
const outDir = resolve(argv[2] || "./out");

const brand = JSON.parse(readFileSync(brandPath, "utf8"));
const content = JSON.parse(readFileSync(contentPath, "utf8"));
const { createEngine } = await import(pathToFileURL(resolve(HERE, "templates.mjs")).href);
const { T } = createEngine(brand);

const htmlDir = resolve(outDir, "html");
mkdirSync(htmlDir, { recursive: true });

function render(slide, ctx){
  const t = slide.t;
  if (typeof T[t] !== "function") throw new Error(`template desconhecido: "${t}" (post ${ctx})`);
  return T[t]({ ...slide });
}

const files = [];
for (const post of (content.posts || [])){
  const id = post.id || `post-${files.length+1}`;
  if (post.tipo === "estatico"){
    const slide = { ...post.slide, dark: post.dark ?? post.slide.dark };
    const f = `${id}.html`;
    writeFileSync(resolve(htmlDir, f), render(slide, id), "utf8");
    files.push(f);
  } else { // carrossel
    const slides = post.slides || [];
    slides.forEach((s, i) => {
      const slide = { ...s, dark: post.dark ?? s.dark, nav: { idx: i, total: slides.length } };
      const f = `${id}-${String(i+1).padStart(2,"0")}.html`;
      writeFileSync(resolve(htmlDir, f), render(slide, id), "utf8");
      files.push(f);
    });
  }
}
writeFileSync(resolve(outDir, "manifest.json"), JSON.stringify(files, null, 2), "utf8");
console.log(`OK — ${files.length} slide(s) em ${htmlDir}`);
console.log(files.join("\n"));
