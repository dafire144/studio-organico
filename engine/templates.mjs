// studio-organico — engine genérico (white-label). Base: engine da Safra 03 da Orna,
// parametrizado por MARCA (brand.json). Renderiza CARROSSEL e ESTÁTICO (1080x1350, 4:5).
// createEngine(brand) -> { T, page }. Cada T.* devolve uma PÁGINA HTML completa.
//
// brand.palette (chaves obrigatórias): marfim(bg claro), offwhite, branco(card),
//   tinta(texto escuro), ambar(accent), lum(accent vivo), tint(caixa), pinheiro(bg escuro), musgo.
// brand.fonts: { serif, sans, mono } (nomes do Google Fonts).
// brand.assets (file:// URLs): imgUrl(base p/ fotos), wordmarkDarkUrl(usa em bg claro),
//   wordmarkLightUrl(usa em bg escuro), profileUrl, logoDir(opcional, p/ logos de marcas citadas).
import { readFileSync } from "node:fs";

export function createEngine(brand){
  const A = brand.palette;
  const FS = brand.fonts || { serif:"Fraunces", sans:"Space Grotesk", mono:"JetBrains Mono" };
  const AS = brand.assets || {};
  const IMG = AS.imgUrl || "";
  const WM_DARK = AS.wordmarkDarkUrl || "";   // logo p/ fundo CLARO
  const WM_LIGHT = AS.wordmarkLightUrl || "";  // logo p/ fundo ESCURO
  const PROFILE = AS.profileUrl || "";
  const LOGODIR = AS.logoDir || "";
  const handle = brand.handle || "";
  const bordao = brand.bordao || "";
  const _lc = {};
  function logoSvg(name){
    if(!(name in _lc)){
      try{ let s=readFileSync(`${LOGODIR}/${name}.svg`,"utf8").replace(/<\?xml[^>]*\?>/g,"").trim();
        s=s.replace(/\sfill="[^"]*"/g,"").replace(/\sstyle="[^"]*"/g,"").replace(/<svg /,'<svg fill="currentColor" '); _lc[name]=s;
      }catch(e){ _lc[name]=""; } }
    return _lc[name];
  }
  const esc = (s="") => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const hl = (s="") => esc(s)
    .replace(/\{\{(.+?)\}\}/g,'<span class="hl">$1<svg class="udl" viewBox="0 0 300 16" preserveAspectRatio="none"><path d="M4 10 C 60 3, 110 15, 160 8 S 250 4, 296 9"/></svg></span>')
    .replace(/&lt;b&gt;/g,'<b>').replace(/&lt;\/b&gt;/g,'</b>');
  const GRAIN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

  const RAW = `
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1080px;height:1350px;}
:root{--marfim:${A.marfim};--offwhite:${A.offwhite};--branco:${A.branco};--tinta:${A.tinta};--ambar:${A.ambar};--lum:${A.lum};--tint:${A.tint};--pinheiro:${A.pinheiro};--musgo:${A.musgo};}
body{font-family:'Space Grotesk',sans-serif;color:var(--tinta);}
.stage{position:relative;width:1080px;height:1350px;overflow:hidden;background:var(--marfim);--ac:${A.ambar};--moodTxt:inherit;--moodLine:${A.ambar};--pgrad:linear-gradient(160deg, rgba(168,114,40,.80), rgba(13,22,18,.92));--pblend:multiply;}
.stage.off{background:var(--offwhite);}
.stage.dark{background:var(--pinheiro);color:var(--marfim);}
.stage.musgo{background:var(--musgo);color:var(--marfim);}
.stage.ac-copa{--ac:#0A7D38;--moodTxt:#0A7D38;--moodLine:#EFC100;--pgrad:linear-gradient(150deg,#00913C 0%,#EFC100 100%);--pblend:color;}
.stage.ac-red{--ac:#C53A22;--moodTxt:#BE3520;--moodLine:#C53A22;--pgrad:linear-gradient(160deg,#C53A22 0%,#3a0c05 100%);--pblend:multiply;}
.stage.dark.ac-red{--moodTxt:#F0856E;} .stage.dark.ac-copa{--moodTxt:#3ED27E;}
.blob{position:absolute;border-radius:46% 54% 60% 40%/52% 44% 56% 48%;filter:blur(8px);opacity:.5;z-index:0;}
.blob.b1{width:680px;height:640px;background:radial-gradient(circle at 40% 40%, rgba(168,114,40,.16), rgba(168,114,40,0) 68%);top:-180px;right:-200px;}
.blob.b2{width:560px;height:560px;background:radial-gradient(circle at 50% 50%, rgba(168,114,40,.10), rgba(168,114,40,0) 70%);bottom:-200px;left:-180px;}
.stage.dark .blob.b1{background:radial-gradient(circle at 40% 40%, rgba(232,178,74,.14), rgba(232,178,74,0) 68%);}
.stage.dark .blob.b2{background:radial-gradient(circle at 50% 50%, rgba(232,178,74,.08), rgba(232,178,74,0) 70%);}
.glyph{position:absolute;right:-40px;bottom:-130px;font-family:'Fraunces',serif;font-style:italic;font-weight:700;font-size:760px;line-height:.7;color:var(--ambar);opacity:.06;z-index:0;transform:rotate(-6deg);}
.stage.dark .glyph{color:var(--lum);opacity:.07;}
.grain{position:absolute;inset:0;z-index:3;background-image:url("${GRAIN}");background-size:220px 220px;opacity:.10;mix-blend-mode:multiply;pointer-events:none;}
.stage.dark .grain{mix-blend-mode:screen;opacity:.05;}
.frame{position:absolute;inset:72px;display:flex;flex-direction:column;z-index:6;height:calc(1350px - 144px);}
.fr-mid{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;min-height:0;}
.fr-bot{flex:0 0 auto;}
.hl{position:relative;font-weight:700;white-space:nowrap;color:var(--moodTxt);}
.udl{position:absolute;left:-3px;bottom:-12px;width:calc(100% + 6px);height:15px;overflow:visible;}
.udl path{stroke:var(--moodLine);stroke-width:6;fill:none;stroke-linecap:round;}
.h1{font-family:'Fraunces',serif;font-style:italic;font-weight:700;line-height:.99;letter-spacing:-.015em;font-size:84px;}
.h1.sm{font-size:66px;}.h1.lg{font-size:98px;}
.h2{font-family:'Space Grotesk',sans-serif;font-weight:700;text-transform:uppercase;font-size:40px;line-height:1.06;color:var(--ac);}
.stage.dark .h2{color:var(--lum);}
.sub{font-family:'Space Grotesk',sans-serif;font-weight:400;font-size:33px;line-height:1.3;opacity:.92;}
.body{font-family:'Space Grotesk',sans-serif;font-weight:400;font-size:30px;line-height:1.34;}
.rule{height:3px;background:var(--ac);opacity:.6;width:120px;border-radius:3px;margin:0 0 6px;}
.stage.dark .rule{background:var(--lum);}
.num{font-family:'Fraunces',serif;font-style:italic;font-weight:700;line-height:.8;letter-spacing:-.02em;color:var(--ac);font-size:430px;}
.num.lum{color:var(--lum);text-shadow:0 0 70px rgba(232,178,74,.5);}
.numlabel{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:42px;line-height:1.16;max-width:720px;margin-top:14px;}
.numctx{font-family:'Space Grotesk',sans-serif;font-weight:400;font-size:26px;line-height:1.4;opacity:.82;margin-top:30px;max-width:760px;}
.numctx b{color:var(--ac);font-weight:700;}.stage.dark .numctx b{color:var(--lum);}
.cards{display:flex;flex-direction:column;gap:22px;margin-top:34px;}
.card{background:var(--branco);border-left:9px solid var(--ac);border-radius:16px;padding:30px 34px;box-shadow:0 14px 36px rgba(13,22,18,.08);position:relative;color:var(--tinta);}
.card:nth-child(odd){transform:rotate(-.5deg);}.card:nth-child(even){transform:rotate(.5deg);}
.card .cn{font-family:'JetBrains Mono',monospace;font-size:22px;color:var(--ac);font-weight:700;}
.card .ct{font-family:'Space Grotesk',sans-serif;font-size:30px;line-height:1.28;font-weight:500;margin-top:6px;}
.card .cs{font-family:'Space Grotesk',sans-serif;font-size:25px;line-height:1.32;opacity:.72;margin-top:8px;font-style:italic;}
.steps{display:flex;flex-direction:column;gap:26px;}
.step{display:flex;gap:26px;align-items:flex-start;}
.step .sn{font-family:'Fraunces',serif;font-style:italic;font-weight:700;font-size:72px;color:var(--ac);line-height:.9;flex:none;width:96px;}
.stage.dark .step .sn{color:var(--lum);}
.step .stx .st{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:30px;text-transform:uppercase;}
.step .stx .sd{font-family:'Space Grotesk',sans-serif;font-weight:400;font-size:26px;line-height:1.3;opacity:.82;margin-top:5px;}
.anchor{background:var(--tint);border-radius:16px;padding:30px 34px;font-family:'Fraunces',serif;font-style:italic;font-weight:600;font-size:34px;line-height:1.22;color:var(--tinta);box-shadow:0 12px 30px rgba(13,22,18,.06);transform:rotate(-.6deg);}
.quotecard{background:var(--branco);border-radius:20px;padding:40px 42px;box-shadow:0 16px 44px rgba(13,22,18,.08);transform:rotate(-.7deg);color:var(--tinta);}
.quotecard .qh{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:34px;line-height:1.24;}
.quotecard .qs{font-family:'JetBrains Mono',monospace;font-size:21px;color:var(--ac);margin-top:22px;}
.manifesto{font-family:'Fraunces',serif;font-style:italic;font-weight:700;font-size:104px;line-height:1.0;letter-spacing:-.015em;position:relative;z-index:1;}
.manifesto.sm{font-size:82px;}
.bigquote{position:absolute;font-family:'Fraunces',serif;font-style:italic;font-weight:700;color:var(--ac);opacity:.22;font-size:340px;line-height:.6;z-index:0;}
.attrib{font-family:'JetBrains Mono',monospace;font-size:23px;color:var(--ac);margin-top:38px;letter-spacing:.04em;}
.mv{display:flex;flex-direction:column;gap:26px;}
.mv .box{border-radius:18px;padding:34px 38px;position:relative;}
.mv .mito{background:#F4E4DE;border:2px dashed rgba(197,58,34,.55);transform:rotate(-.8deg);}
.mv .verd{background:var(--ambar);color:var(--marfim);transform:rotate(.6deg);box-shadow:0 16px 40px rgba(168,114,40,.28);}
.mv .lbl{font-family:'JetBrains Mono',monospace;font-size:22px;letter-spacing:.08em;text-transform:uppercase;}
.mv .mito .lbl{color:#BE3520;}.mv .verd .lbl{color:var(--marfim);opacity:.9;}
.mv .txt{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:36px;line-height:1.2;margin-top:12px;}
.mv .mito .txt{color:var(--tinta);}
.mv .mito .txt .strike{text-decoration:line-through;text-decoration-color:rgba(197,58,34,.9);text-decoration-thickness:3px;}
.mapa{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.mapa .p{background:var(--branco);border-radius:18px;padding:32px;box-shadow:0 14px 36px rgba(13,22,18,.08);border-top:7px solid var(--ac);color:var(--tinta);}
.mapa .p .pl{font-family:'Fraunces',serif;font-style:italic;font-weight:700;font-size:78px;color:var(--ac);line-height:.9;}
.mapa .p .pt{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:30px;text-transform:uppercase;margin-top:8px;}
.mapa .p .pd{font-family:'Space Grotesk',sans-serif;font-size:24px;line-height:1.3;opacity:.8;margin-top:8px;}
.checklist{display:flex;flex-direction:column;gap:26px;}
.chk{display:flex;gap:24px;align-items:flex-start;}
.chk .bx{width:54px;height:54px;border-radius:12px;border:3px solid var(--ac);flex:none;display:flex;align-items:center;justify-content:center;color:var(--ac);font-size:30px;font-weight:700;font-family:'Fraunces',serif;font-style:italic;transform:rotate(-3deg);}
.chk .cx{font-family:'Space Grotesk',sans-serif;font-size:31px;line-height:1.28;font-weight:500;padding-top:4px;}
.photo-strip{position:absolute;top:0;right:0;width:392px;height:1350px;background-size:cover;background-position:center;filter:grayscale(1) contrast(1.05) brightness(.95);z-index:1;}
.photo-strip::after{content:"";position:absolute;inset:0;background:var(--pgrad);mix-blend-mode:var(--pblend);}
.photo-strip::before{content:"";position:absolute;inset:0;z-index:2;background:linear-gradient(270deg,rgba(242,236,217,0) 50%,var(--marfim) 100%);}
.photo-cap{position:absolute;inset:0;background-size:cover;background-position:center 22%;filter:grayscale(1) sepia(.22) contrast(1.08) brightness(.95);z-index:0;}
.photo-cap::after{content:"";position:absolute;inset:0;background:var(--pgrad);mix-blend-mode:var(--pblend);opacity:.5;}
.capfade{position:absolute;inset:0;z-index:2;background:linear-gradient(180deg,rgba(10,19,14,.30) 0%,rgba(10,19,14,0) 30%,rgba(10,19,14,.18) 52%,rgba(8,14,10,.86) 80%,rgba(6,11,8,.98) 100%);}
.foot{display:flex;align-items:center;justify-content:space-between;gap:20px;}
.foot .wm{height:32px;}
.foot .handle{font-family:'JetBrains Mono',monospace;font-size:19px;opacity:.5;}
.stage.dark .foot .handle{opacity:.65;}
.arraste{position:absolute;right:72px;bottom:108px;font-family:'JetBrains Mono',monospace;font-size:19px;color:var(--ac);letter-spacing:.06em;z-index:7;}
.stage.dark .arraste{color:var(--lum);}
.dots{display:flex;gap:9px;margin-bottom:18px;}
.dots i{width:9px;height:9px;border-radius:50%;background:rgba(13,22,18,.2);}
.dots i.on{background:var(--ac);width:26px;border-radius:6px;}
.stage.dark .dots i{background:rgba(242,236,217,.25);}.stage.dark .dots i.on{background:var(--lum);}
.cta-profile{width:340px;height:340px;border-radius:26px;object-fit:cover;box-shadow:0 20px 54px rgba(13,22,18,.2);border:3px solid rgba(168,114,40,.45);transform:rotate(-1.5deg);}
.btn{display:inline-block;background:var(--ambar);color:var(--marfim);border-radius:999px;padding:22px 42px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:29px;box-shadow:0 12px 28px rgba(168,114,40,.3);transform:rotate(-1deg);}
.bordao{font-family:'Fraunces',serif;font-style:italic;font-weight:600;font-size:32px;color:var(--ambar);}
.stage.dark .bordao{color:var(--lum);}
.brandbadge{display:inline-flex;align-self:flex-start;align-items:center;background:#FBFAF4;border:1px solid rgba(13,22,18,.10);border-radius:14px;padding:15px 22px;box-shadow:0 12px 30px rgba(13,22,18,.12);margin-bottom:22px;}
.brandbadge .blogo{height:48px;width:auto;display:block;}
`;
  const CSS = RAW.split("'Fraunces'").join(`'${FS.serif}'`).split("'Space Grotesk'").join(`'${FS.sans}'`).split("'JetBrains Mono'").join(`'${FS.mono}'`);

  function page(inner){
    const fam = `family=${FS.serif.replace(/ /g,"+")}:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600;1,9..144,700&family=${FS.sans.replace(/ /g,"+")}:wght@400;500;600;700&family=${FS.mono.replace(/ /g,"+")}:wght@400;500;700`;
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fam}&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>${inner}</body></html>`;
  }
  const wm = (dark) => `<img class="wm" src="${dark?WM_LIGHT:WM_DARK}" alt="${esc(brand.name||"")}">`;
  function botBar(d){
    const dots = d.nav ? `<div class="dots">${Array.from({length:d.nav.total},(_,i)=>`<i class="${i===d.nav.idx?"on":""}"></i>`).join("")}</div>` : "";
    return `${dots}<div class="foot">${wm(d.dark)}<span class="handle">${esc(handle)}</span></div>`;
  }
  function deco(d){
    const photo = d.photo && d.photo.mode==="strip" ? `<div class="photo-strip" style="background-image:url('${IMG}/${d.photo.img}.jpg')"></div>` : "";
    const glyph = (d.glyph) ? `<div class="glyph">${d.glyph}</div>` : "";
    return `<div class="blob b1"></div><div class="blob b2"></div>${glyph}${photo}`;
  }
  function shell(d, mid){
    const cls = `stage ${d.bg||""} ${d.accent?("ac-"+d.accent):""} ${d.dark?"dark":""}`.replace(/\s+/g," ").trim();
    const arr = d.nav && d.nav.idx<d.nav.total-1 ? `<div class="arraste">ARRASTE ›</div>` : "";
    return page(`<div class="${cls}">${deco(d)}<div class="grain"></div><div class="frame"><div class="fr-mid">${mid}</div><div class="fr-bot">${botBar(d)}</div></div>${arr}</div>`);
  }

  const T = {
    // CAPA full-bleed (imagem ocupa a tela toda) — naturalmente ESCURA. Para carrossel: o post inteiro deve ir dark.
    coverFull(d){
      const cls = `stage dark ${d.accent?("ac-"+d.accent):""}`.replace(/\s+/g," ").trim();
      const arr = d.nav && d.nav.idx<d.nav.total-1 ? `<div class="arraste">ARRASTE ›</div>` : "";
      return page(`<div class="${cls}">
        <div class="photo-cap" style="background-image:url('${IMG}/${d.photo.img}.jpg')"></div>
        <div class="photo-cap" style="background:var(--pgrad);mix-blend-mode:var(--pblend);opacity:.45"></div>
        <div class="capfade"></div><div class="grain"></div>
        <div class="frame" style="justify-content:flex-end">
          <div class="rule"></div>
          <div class="h1 ${d.size||""}" style="max-width:900px;margin-top:18px;color:var(--marfim);text-shadow:0 6px 34px rgba(0,0,0,.55)">${hl(d.title)}</div>
          ${d.sub?`<div class="sub" style="margin-top:28px;max-width:760px">${hl(d.sub)}</div>`:""}
          <div style="margin-top:40px">${botBar(d)}</div>
        </div>${arr}</div>`);
    },
    cover(d){
      const strip = d.photo && d.photo.mode==="strip"; const mw = strip?590:880;
      return shell({...d}, `${d.brandLogo?`<div class="brandbadge"><img class="blogo" src="${IMG}/logos/${d.brandLogo}.svg"></div>`:""}<div class="rule"></div>
        <div class="h1 ${d.size||""}" style="max-width:${mw}px;margin-top:18px">${hl(d.title)}</div>
        ${d.sub?`<div class="sub" style="margin-top:30px;max-width:${Math.min(mw,720)}px">${hl(d.sub)}</div>`:""}`);
    },
    bignum(d){
      const s=String(d.num); const numSize=s.length<=3?430:(s.length<=6?256:154);
      const strip=d.photo&&d.photo.mode==="strip"; const mw=strip?590:760;
      return shell({...d, glyph:null}, `<div class="num ${d.dark?"lum":""}" style="font-size:${numSize}px;max-width:${strip?600:1000}px">${esc(d.num)}</div>
        <div class="numlabel" style="max-width:${mw}px">${hl(d.label)}</div>
        ${d.ctx?`<div class="numctx" style="max-width:${mw}px">${hl(d.ctx)}</div>`:""}`);
    },
    prova(d){
      return shell({...d, glyph:"”"}, `<div class="rule"></div>
        <div class="quotecard" style="margin-top:20px"><div class="qh">“${hl(d.headline)}”</div><div class="qs">${esc(d.source)}</div></div>
        ${d.quote?`<div class="anchor" style="margin-top:28px">${hl(d.quote)}</div>`:""}`);
    },
    mecanismo(d){
      const steps=d.steps.map((s,i)=>`<div class="step"><div class="sn">${String(i+1).padStart(2,"0")}</div><div class="stx"><div class="st">${hl(s.t)}</div><div class="sd">${hl(s.d)}</div></div></div>`).join("");
      return shell({...d, glyph:"→"}, `<div class="h2">${hl(d.title)}</div><div class="steps" style="margin-top:34px">${steps}</div>
        ${d.anchor?`<div class="anchor" style="margin-top:38px">${hl(d.anchor)}</div>`:""}`);
    },
    cards(d){
      const cards=d.cards.map((c)=>`<div class="card">${c.n?`<div class="cn">${esc(c.n)}</div>`:""}<div class="ct">${hl(c.t)}</div>${c.s?`<div class="cs">${hl(c.s)}</div>`:""}</div>`).join("");
      return shell({...d, glyph:d.glyph||"?"}, `<div class="h2">${hl(d.title)}</div><div class="cards">${cards}</div>
        ${d.footer?`<div class="body" style="margin-top:30px;font-weight:600">${hl(d.footer)}</div>`:""}`);
    },
    quote(d){
      return shell({...d, glyph:null}, `<div style="position:relative">
        <div class="bigquote" style="top:-150px;left:-30px">“</div>
        <div class="manifesto ${d.size||""}">${hl(d.text)}</div>
        ${d.attrib?`<div class="attrib">${esc(d.attrib)}</div>`:""}</div>`);
    },
    mito(d){
      return shell({...d, glyph:"≠", accent:"red"}, `<div class="h2" style="color:#BE3520">${hl(d.title)}</div>
        <div class="mv" style="margin-top:34px">
          <div class="box mito"><div class="lbl">✕ Mito</div><div class="txt"><span class="strike">${hl(d.mito)}</span></div></div>
          <div class="box verd"><div class="lbl">✓ Na real</div><div class="txt">${hl(d.verdade)}</div></div></div>`);
    },
    mapa(d){
      const ps=d.pillars.map(p=>`<div class="p"><div class="pl">${esc(p.l)}</div><div class="pt">${hl(p.t)}</div><div class="pd">${hl(p.d)}</div></div>`).join("");
      return shell({...d, glyph:null}, `<div class="h2">${hl(d.title)}</div><div class="mapa" style="margin-top:30px">${ps}</div>
        ${d.footer?`<div class="body" style="margin-top:28px;font-weight:600">${hl(d.footer)}</div>`:""}`);
    },
    checklist(d){
      const items=d.items.map(t=>`<div class="chk"><div class="bx">✓</div><div class="cx">${hl(t)}</div></div>`).join("");
      return shell({...d, glyph:"✓"}, `<div class="h2">${hl(d.title)}</div><div class="checklist" style="margin-top:36px">${items}</div>
        ${d.footer?`<div class="body" style="margin-top:34px;font-weight:600">${hl(d.footer)}</div>`:""}`);
    },
    cta(d){
      return shell({...d, glyph:null}, `<div class="rule"></div><div class="h1 sm" style="margin-top:16px">${hl(d.title)}</div>
        <div style="display:flex;align-items:center;gap:34px;margin-top:46px">
          ${PROFILE?`<img class="cta-profile" src="${PROFILE}" alt="${esc(handle)}">`:""}
          <div><div class="body" style="font-weight:600;margin-bottom:20px">${hl(d.cta||"Toque no link da bio e fale com a gente.")}</div><span class="btn">${esc(d.btn||"Link na bio →")}</span></div>
        </div>${bordao?`<div style="margin-top:40px" class="bordao">${esc(bordao)}</div>`:""}`);
    },
  };
  return { T, page };
}
