This is a Typescript based server-side rendering setup, using React, Emotion, hydration and as little extra software or
magic as possible.

The goal is a Bokito-proof solution that is easy to hack, upgrade and maintain.

#### Scripts

-   `npm run build` Builds the thing, really fast
-   `npm run watch` Watches for changes to Typescript files, and rebuilds the thing
-   `npm run deploy` Deploys whatever was built last to GitHub Pages.

#### Stack

Uses Typescript, `esbuild`, `react`, `react-dom`, and some `@emotion` libs. For development, uses `chokidar-cli` and
`gh-pages`. Graciously hosted using GitHub Actions and GitHub Pages.

Uses `esbuild`'s out-of-the-box `dataurl` loaders for `*.png`, `*.gif` and `*.jpg`.

Does not use any routing software. Instead, when React is hydrated it will intercept clicks on `<a>` and fetch the
precompiled `data.json` instead, then pass that to the component responsible for rendering your app.
