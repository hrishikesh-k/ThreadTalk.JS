## ThreadTalk.JS

This is a monorepo consisting of the npm module, the Netlify build-plugin and the documentation website. The file structure is as follows:

1. The npm module exists independently in its folder: `src`.
1. The Netlify build-plugin exists independently in its folder `plugin`. However, it needs `threadtalkjs` (contents of `src` folder) as a dependency.
1. The documentation exists in the `docs` folder and needs many files from the root of the repository.

ThreadTalk.JS is a complete system to enable you to add comments on a static website. It's written in pure JavaScript and styled with CSS (powered by SCSS). It integrates Netlify Functions and FaunaDB to allow you to store and retrive comments without boating your frontend.

The primary features are:
  - Customisability
  - Lightweight
  - Secure

Installation, customisation and all other important details are documented on the website: https://www.threadtalkjs.ml/