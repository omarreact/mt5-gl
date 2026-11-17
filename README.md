# MetaGreyLabel — 10 Homepage Concepts

Ten distinct MetaGreyLabel homepage layouts using the complete approved Home copy, distributed across 10+ sections per concept.

## Animation stack
- GSAP 3.15.1
- ScrollTrigger 3.15.1
- Lenis 1.3.27
- Three.js 0.187.0

No animation library is loaded from a runtime CDN. GitHub Actions installs the pinned npm packages during the build and copies the minified browser assets into the Pages artifact.

## Local build
```bash
npm install
npm run verify
npm run build
```

## GitHub Pages
Pushes to `main` run `.github/workflows/pages.yml`, build `dist/`, and deploy it with GitHub's official Pages actions.
