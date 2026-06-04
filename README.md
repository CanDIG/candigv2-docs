# CanDIGv2 Documentation website

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Currently being deployed to https://candig.github.io/candigv2-docs/ via github actions.

Website is deployed from the Stable branch and should be up to date with changes being made on the stable branch of [CanDIGv2](https://github.com/CanDIG/CanDIGv2).

We try to update docs inline with current development on the `develop` branch. They can be viewed in the `src/content/docs/` folder in markdown format, but not all nice ux features are properly displayed. 

You can run a develop version of the docs website following the commands after checking out branch you are interested in building:

```
npm install
npm run dev
```

# How to make updates

## If the update applies to both stable and develop versions

e.g. fixing a typo, correcting a mistake, changing configurations

Please make changes on both the develop and stable branches and create two PRs and request review before merging

## If the update applies to the stable version only

Please make a pull request against the stable branch only and request review before merging

## If the update applies to the develop version only

Please make a pull request against the develop branch only and request review before merging


# Deployment info:

## 🚀 Project Structure

Inside of your Astro + Starlight project, you'll see the following folders and files:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   ├── docs/
│   │   └── config.ts
│   └── env.d.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |