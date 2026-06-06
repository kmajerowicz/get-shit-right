# Release & changelog process

Internal maintainer notes — how versioning, the changelog, and releases work in
this repo. Not user-facing.

The whole point: one disciplined input — the **commit message** — drives the
changelog, release notes, version bump, and git tag together, so progress on GSR
is always legible from the repo without manual bookkeeping.

## Commit messages decide what gets shown

Every commit follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional-scope): <description>
```

| Type | In release notes? | Use for |
|------|-------------------|---------|
| `feat` | **yes — Added** | new capability, command, flag |
| `fix` | **yes — Fixed** | bug fix, wrong behavior corrected |
| `perf` | **yes — Changed** | performance improvement |
| `revert` | **yes — Changed** | reverting a previous change |
| `docs` | no | README, docs, comments |
| `style` | no | formatting, whitespace |
| `refactor` | no | code change, no behavior change |
| `test` | no | tests only |
| `chore` | no | tooling, deps, housekeeping |
| `ci` | no | CI/workflow config |
| `build` | no | build scripts |
| `i18n` | no | translations |

**Ship small things quietly:** type them `docs`/`chore`/`style`/`refactor`.
Anything that changes what GSR *does* is `feat`/`fix`/`perf` and gets presented
automatically — there's no third path where a real change slips out unannounced.

Breaking change: add `!` (`feat(build)!: drop legacy mode`) or a
`BREAKING CHANGE:` footer — it gets its own section.

The commit-msg hook and CI reject anything that doesn't match. Enable the local
hook once per clone:

```sh
npm run hooks:install
```

## Checks

```sh
npm run check          # js syntax, json, doc links, version sync
npm run changelog      # preview the unreleased section (what's queued to ship)
```

`version-sync` (part of `npm run check`) fails if `package.json`, `plugin.json`,
`marketplace.json`, and the latest CHANGELOG entry ever disagree — so the drift
that used to happen can't come back.

## Cutting a release

One command bumps all three manifests, writes the CHANGELOG section from commits,
commits, tags, and optionally publishes the GitHub Release:

```sh
npm run release                 # version derived from commits since last tag
npm run release minor           # or force major | minor | patch
npm run release 0.3.0           # or an explicit version
npm run release -- --dry-run    # preview everything, change nothing
npm run release -- --publish    # also push + create the GitHub Release
```

Three always-in-sync surfaces show progress:

- **`CHANGELOG.md`** — full history in the repo (generated sections + curated past).
- **GitHub Releases** — the same notes, published per tag (with `--publish`).
- **git tags** — every release is `vX.Y.Z`, so `git tag` is an honest record.

### Generated vs. hand-written

`scripts/release.js` inserts each new section right below the
`<!-- GSR:RELEASES -->` marker in `CHANGELOG.md`. The older entries (0.1.0–0.2.9)
below it are hand-curated history and are never touched. Don't hand-edit a
generated section — fix the commit message and regenerate.
