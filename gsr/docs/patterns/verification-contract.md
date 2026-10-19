# Project verification contract (v1)

GSR uses `lib/project.js` to discover canonical Git worktree roots and documentation.
Non-Git discovery walks to the nearest `.gsr.json` or STATE marker. `.gsr.json`
(schemaVersion 1) overrides `docRoot`; otherwise recognized artifacts score `.ai`,
`.cursor`, `ai`, `docs`, `doc`, `documentation` in that tie order. No artifacts means
`docs` is proposed, not initialized. Hooks are read-only for project discovery.
Invalid config or escaping paths/symlinks produce a diagnostic, never a fallback.

Example project-root configuration (replace commands with real project checks):

```json
{
  "schemaVersion": 1,
  "docRoot": "docs",
  "checks": [
    { "id": "unit", "argv": ["python3", "-m", "unittest"], "kind": "test" }
  ],
  "profiles": { "focused": ["unit"] }
}
```

Check fields: unique `id`, nonempty string-array `argv`, `kind` (`static`, `test`,
`runtime`), `cwd` (project-relative, default `.`), `required` (default true), and
`timeoutMs` (default 120000). Configuration is limited to 256 KiB, 128 checks, 128 arguments per check and
8192 bytes per argument; oversized configs are rejected, not truncated. Output
is capped at 4096 bytes per stream per check. Commands run without a shell. Split shell operators
into independent checks or use a reviewed script that propagates errors. Legacy
techstack Gate prose is agent input; hooks never execute Markdown. Translate known
commands during authorized work, preserve prose, and reconcile conflicts. Until
reconciled, verification is unverified. Do not invent stack requirements.

Named profiles are lists of check IDs. Default unions all required checks with any explicitly listed `profiles.default` checks; an explicit default cannot omit required checks. Other named profiles retain their explicit subsets.
`profileApplicability` documents bounded docs-only profiles. Uncertainty selects
default; do not invent a reduced profile just to pass.

Internal invocation: `node "${CLAUDE_PLUGIN_ROOT}/scripts/run-checks.js" --cwd
"<project>" [--profile <name>]`. This is not a new public command. SessionStart
never runs checks. Exit 0 means all selected required checks passed with fresh
inputs; 1 means an executed required check failed; 2 means missing/invalid config,
unavailable/incomplete checks, unsupported freshness or stale inputs. Optional
failure remains visible. An empty required set is unverified.

Records use schemaVersion 1 and separate immutable run directories under
`os.tmpdir()/gsr-v1/<sha256(canonicalWorktreeRoot)>/evidence`. No session identity.
Atomic writes store timestamps, exact selected config, fingerprints, bounded output
excerpts and actual exit/signal/timeout/launch errors. No environment dumps or full
logs. Projects should keep secrets out of check output; bounded excerpts are not
secret detection. A script that swallows errors is beyond the trusted boundary.
Caller `|| true`, tool success and assistant prose cannot change recorded results.

Freshness hashes tracked and nonignored untracked files, paths, types, content,
symlink targets, executable modes and deletions. Gitignored outputs are excluded.
Configuration and applicable requirement documents (including project research records)
are included even when ignored. Only the
administrative STATE summary is excluded; never put requirements/source there.
Valid project-root `.gsr-session.json` objects normalize only `last_command` and
`timestamp`; project identity and unknown fields remain inputs. Malformed manifests
hash fully. Equivalent `docs`, `./docs`, `docs/` paths share canonical discovery.
Exact template plans normalize only frontmatter status/updated and task Status/
Evidence cells. Ambiguous plans hash fully. Records declare exclusions and
normalization. Submodules/inaccessible input and non-Git reusable freshness remain
unsupported/unverified. Fingerprint before/after checks and at resume, completion
and commit observation. Readers choose the latest started run for the profile;
newer failure/interruption/corruption cannot reveal an older green record. Future
schema records are unverified and never downgraded. Missing temp storage means
unverified, while durable task memory remains in STATE.

Freshness is bounded to declared local inputs and environment at execution time.
It does not prove remote state, external dependencies or edit-and-revert races.
Runtime/manual checks are observations, not durable universal claims. Automated
checks never imply human acceptance or deployment. Hooks inject agent context;
no GSR commit permission question or Stop wording gate. Host permissions and user
instructions remain authoritative; Claude hook tests do not establish Codex parity.
