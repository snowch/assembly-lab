// Copyright © 2026 Christopher Snow
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
const root = "style-preview-results",
  all = [];
async function visit(folder) {
  for (const e of await readdir(folder, { withFileTypes: true })) {
    const p = join(folder, e.name);
    if (e.isDirectory()) await visit(p);
    else if (e.name === "screenshots.json")
      for (const shot of JSON.parse(await readFile(p, "utf8")))
        all.push({ ...shot, file: join(relative(root, folder), shot.file) });
  }
}
await visit(root);
await writeFile(join(root, "comparisons.json"), JSON.stringify(all, null, 2));
const data = JSON.stringify(all).replaceAll("<", "\\u003c");
await writeFile(
  join(root, "index.html"),
  `<!doctype html><!-- Copyright © 2026 Christopher Snow --><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Assembly Lab style comparisons</title><style>body{font:16px/1.5 system-ui;margin:24px;color:#193130;background:#f7faf8}header{position:sticky;top:0;background:#f7faf8;padding:12px 0}select{font:inherit;padding:8px;max-width:100%;margin:4px}main{display:grid;grid-template-columns:1fr 1fr;gap:20px}img{width:100%;border:1px solid #cdded6}h2{font-size:18px}a{color:#076956}@media(max-width:600px){main{display:block}}</style><header><h1>Assembly Lab style comparisons</h1><label>Lesson <select id="lesson"></select></label><label>Width <select id="width"><option>375</option><option>834</option><option>1280</option></select></label><label>Theme <select id="theme"><option>light</option><option>dark</option></select></label><p>${all.length} captures. The comparison controls are omitted from these screenshots.</p></header><main><section><h2>Current</h2><a id="currentLink"><img id="current" alt="Current course appearance"></a></section><section><h2>New</h2><a id="newLink"><img id="new" alt="New course appearance"></a></section></main><script>const data=${data};const lesson=document.querySelector('#lesson'),width=document.querySelector('#width'),theme=document.querySelector('#theme');for(const[id,title]of new Map(data.map(x=>[x.lesson,x.title]))){const o=document.createElement('option');o.value=id;o.textContent=title;lesson.append(o)}function show(){for(const mode of['current','new']){const row=data.find(x=>x.lesson===lesson.value&&String(x.width)===width.value&&x.theme===theme.value&&x.mode===mode),img=document.getElementById(mode),a=document.getElementById(mode+'Link');if(row){img.src=row.file;a.href=row.file}else{img.removeAttribute('src');a.removeAttribute('href')}}}for(const el of[lesson,width,theme])el.onchange=show;show();</script></html>`,
);
console.log(`Comparison index: ${root}/index.html (${all.length} captures)`);
