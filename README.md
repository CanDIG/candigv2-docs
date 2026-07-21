# CanDIGv2 Documentation website

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Currently being deployed to https://candig.github.io/candigv2-docs/ via github actions.

Website is deployed from the Stable branch and should be up to date with changes being made on the stable branch of [CanDIGv2](https://github.com/CanDIG/CanDIGv2).

We try to update docs inline with current development on the `develop` branch. They can be viewed in the `src/content/docs/` folder in markdown format, but not all nice ux features are properly displayed.
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

# Release process: merging `develop` into `stable`

This describes how to merge documentation changes from `develop` into
`stable` at release time without losing content from either branch.

## Why this needs a process

`stable` and `develop` are both long-lived branches that get edited
independently. If they go too long without syncing, the same files drift
apart with no shared history, and a normal merge can't tell you what
changed — it just shows two unrelated-looking versions of a file and asks
you to pick. The steps below exist to catch that before it happens and to
make each individual release merge small and reviewable instead of a
once-a-year ordeal.

## Ongoing discipline (the part that prevents future pain)

1. **Never let the same restructuring happen twice.** If you're changing
   the site framework, config, build tooling, or moving/renaming files,
   do it once on one branch and merge it over right away. Don't let both
   branches independently redo the same change — that's what produces
   unmergeable "add/add" conflicts (see below).
2. **Merge in both directions, every cycle.** After each release:
   `develop` → `stable` (the release), then immediately `stable` → `develop`
   so develop absorbs the release commit as a shared ancestor. Skipping the
   back-merge is what lets divergence compound release over release.
3. **Tag every stable release** (e.g. `docs-v1.5.0`, or match it to the
   stack's release tag). Tags give you a clear, findable sync point and
   make `git merge-base` meaningful next time. As of writing, this repo has
   no tags — start with the current release.
4. **Do the merge in a `release/x.y` branch off `stable`**, not directly
   on `stable`. Resolve conflicts there, build and preview the site, get it
   reviewed, then PR that branch into `stable`.

## Step-by-step for each release

1. `git fetch origin stable develop`
2. `git checkout -b release/x.y origin/stable`
3. Run the pre-merge report before touching anything:

   ```
   ./scripts/docs-merge-report.sh origin/stable origin/develop
   ```

   This tells you, before you're staring at conflict markers:
   - which files changed on **both** sides since they last shared history
     (real conflict risk — read both versions, don't just pick one)
   - which files exist in `stable` but are **missing** from `develop`
     (silent-deletion risk — a plain merge drops these with no warning;
     confirm on purpose before they vanish)
   - which files are **new in `develop`** (informational, low risk)

   If this PR is opened as `develop` → `stable`, a GitHub Action
   (`.github/workflows/docs-merge-report.yml`) posts this same report as a
   PR comment automatically.

4. `git merge --no-ff origin/develop`
5. Resolve conflicts. For each conflicted file, don't just take one side —
   open both versions and combine:
   ```
   git show origin/stable:path/to/file    # stable's version
   git show origin/develop:path/to/file   # develop's version
   ```
   For files with no shared history, git's conflict markers dump both
   full files with no diff to guide you, so do this comparison _before_
   resolving, not while staring at the markers.
6. For every file flagged "missing from develop" in the report, decide
   deliberately: carry it forward into the merge, or confirm with whoever
   owns that content that it's genuinely obsolete. Don't let it disappear
   by default.
7. Build and preview the site locally (`npm run build` / `npm run dev`)
   and click through nav — merges routinely break sidebar links even when
   the text content is fine.
8. Get a second reviewer to diff the merge result against `stable`
   specifically for deletions:
   ```
   git diff --diff-filter=D origin/stable release/x.y
   ```
   Anything listed here should be an intentional removal.
9. PR `release/x.y` into `stable`, merge, tag it (`docs-vX.Y.Z`).
10. Immediately merge `stable` → `develop` to close the loop:
    ```
    git checkout develop
    git merge --no-ff stable
    git push
    ```

## Tooling

- `scripts/docs-merge-report.sh` — pre-merge diff report (see above).
- `.github/workflows/docs-merge-report.yml` — runs the script automatically
  on any PR from `develop` into `stable` and comments the result.

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
