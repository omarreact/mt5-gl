import { rm, mkdir, copyFile, cp, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
await rm(dist,{recursive:true,force:true});
await mkdir(path.join(dist,'assets','vendor'),{recursive:true});
await copyFile(path.join(root,'index.html'),path.join(dist,'index.html'));
await cp(path.join(root,'pages'),path.join(dist,'pages'),{recursive:true});
await copyFile(path.join(root,'assets','site.css'),path.join(dist,'assets','site.css'));
await copyFile(path.join(root,'assets','site.js'),path.join(dist,'assets','site.js'));
for(const [src,dst] of [
 ['node_modules/gsap/dist/gsap.min.js','gsap.min.js'],
 ['node_modules/gsap/dist/ScrollTrigger.min.js','ScrollTrigger.min.js'],
 ['node_modules/lenis/dist/lenis.min.js','lenis.min.js'],
 ['node_modules/three/build/three.module.min.js','three.module.min.js'],
 ['node_modules/three/build/three.core.js','three.core.js']
]) await copyFile(path.join(root,src),path.join(dist,'assets','vendor',dst));
await writeFile(path.join(dist,'.nojekyll'),'');
console.log('Built dist/ for GitHub Pages');
