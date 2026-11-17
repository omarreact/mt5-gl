import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const source=await readFile(path.join(root,'assets/site.js'),'utf8');
const required=[
  'MetaTrader Grey Label Solutions to Launch Your Forex Brokerage in 2 Days',
  'A Forex Technology Provider That Gets You Live Fast',
  'What Grey Label Actually Means for You',
  'Who It Suits',
  'Launch Your Forex Brokerage in 2 Days',
  'Forex White Label, Grey Label or Turnkey: Picking the Right Model',
  'What Comes With Your Setup',
  'Why Brokers Choose a MetaTrader Grey Label Partner Like Us',
  'Clear Pricing From Day One',
  'Room to Grow',
  'Frequently Asked Questions',
  'MT4 or MT5, Which Should I Choose?',
  'Can I Switch to a Different Model Later?',
  'Ready to Build Your Brokerage?'
];
let ok=true;
for(const heading of required){
  if(!source.includes(heading)){ok=false;console.error('Missing approved content:',heading)}
}
for(let i=1;i<=10;i++){
  const file=`pages/home-${String(i).padStart(2,'0')}.html`;
  const html=await readFile(path.join(root,file),'utf8');
  const expected=`data-design="${i}"`;
  const localAssets=['../assets/site.css','../assets/site.js','../assets/vendor/gsap.min.js','../assets/vendor/ScrollTrigger.min.js','../assets/vendor/lenis.min.js'];
  if(!html.includes(expected)||localAssets.some(x=>!html.includes(x))){
    ok=false; console.error(file,'design or local asset reference missing');
  } else console.log(file,'OK');
}
for(const file of ['index.html','assets/site.css','assets/site.js','build.mjs','.github/workflows/pages.yml']){
  try{await stat(path.join(root,file))}catch{ok=false;console.error('Missing',file)}
}
for(const file of ['index.html','assets/site.css','assets/site.js',...Array.from({length:10},(_,i)=>`pages/home-${String(i+1).padStart(2,'0')}.html`)]){
  const s=await readFile(path.join(root,file),'utf8');
  if(/cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com/i.test(s)){ok=false;console.error('Runtime CDN reference:',file)}
}
if(!source.includes("import * as THREE from './vendor/three.module.min.js'")){ok=false;console.error('Three.js local module import missing')}
if(!source.includes("new Lenis")||!source.includes("gsap.ticker.add")||!source.includes("ScrollTrigger")){ok=false;console.error('Motion stack integration missing')}
if(!ok)process.exit(1);
console.log('Verification passed: complete approved content, 10 concepts, local GSAP/ScrollTrigger/Lenis/Three runtime assets.');
