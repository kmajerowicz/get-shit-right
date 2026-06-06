# Contributing to GSR

This repo has one rule that drives everything else: **the commit message decides
whether a change is announced or stays quiet.** Get that right and the changelog,
release notes, version numbers, and git tags take care of themselves.

## Commit messages — the one discipline

Every commit follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional-scope): <description>
```

| Type | Goes in release notes? | Use for |
|------|------------------------|---------|
| `feat` | **yes — Added** | new capability, new command, new flag |
| `fix` | **yes — Fixed** | bug fix, wrong behavior corrected |
| `perf` | **yes — Changed** | performance improvement |
| `revert` | **yes — Changed** | reverting a previous change |
| `docs` | no | README, docs, comments |
| `style` | no | formatting, whitespace |
| `refactor` | no | code change with no behavior change |
| `test` | no | tests only |
| `chore` | no | tooling, deps, housekeeping |
| `ci` | no | CI/workflow config |
| `build` | no | build scripts |
| `i18n` | no | translations |

**This is how you "ship small changes quietly":** type them `docs`/`chore`/`style`/`refactor`.
Anything that changes what the product *does* must be `feat`/`fix`/`perf` — and it
will be presented automatically. There is no third option where a real change
slips out unannounced.

Mark a breaking change with a `!` (`feat(build)!: drop legacy mode`) or a
`BREAKING CHANGE:` footer — it gets its own section.

The commit-msg hook and CI both reject anything that doesn't match. Enable the
local hook once per clone:

```sh
npm run hooks:install
```

## Checks

```sh
npm run check          # js syntax, json, doc links, version sync
npm run changelog      # preview the unreleased section (what's queued to ship)
```

`npm run changelog` answers "what's gone in since the last release?" at any time.

## Releasing

One command does the whole thing — bumps the version in all three manifests,
writes the CHANGELOG section from commits, commits, tags, and (optionally)
publishes the GitHub Release:

```sh
npm run release                 # version derived from commits since last tag
npm run release minor           # or force major | minor | patch
npm run release 0.3.0           # or an explicit version
npm run release -- --dry-run    # preview everything, change nothing
npm run release -- --publish    # also push + create the GitHub Release
```

How "what's new" stays visible in three places, always in sync:

- **`CHANGELOG.md`** — full history in the repo (generated section + curated past).
- **GitHub Releases** — the same notes, published per tag (with `--publish`).
- **git tags** — every release is `vX.Y.Z`, so `git tag` is an honest record.

`version-sync` (part of `npm run check`) fails the build if `package.json`,
`plugin.json`, `marketplace.json`, and the latest CHANGELOG entry ever disagree —
so the drift that used to happen can't come back.

### What the generator manages vs. what's hand-written

`scripts/release.js` inserts each new section right below the `<!-- GSR:RELEASES -->`
marker in `CHANGELOG.md`. Everything **below** the older entries (0.1.0–0.2.9) is
hand-curated history and is never touched by the tool. Don't hand-edit generated
sections — fix the commit message and regenerate instead.
