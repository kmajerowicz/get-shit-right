# GSR implementation audit — 2026-10-09

Research appendix for the GSR improvement strategy. All fixes below are proposals; no implementation or test files were changed.

Reproduction rechecked **2026-10-10**: the compact harness below returned the expected installed-script syntax failure, command-text and masked-failure gate bypasses, missed mutation, session/project isolation gaps, alternate-root detection gap, and wording-only completion behavior. These remain isolated tests, not live Claude Code sessions.

## Scope and verification boundary

Audited checkout: `fa92074c5044dfd0de9dda577ef5c53cf5bc2307` (package/plugin version `0.5.0`). Inspected JavaScript hooks, registration, installer, release/check scripts, CI, command wrappers, agent definitions, workflow skills and persistence templates. Executed existing checks and isolated probes on macOS with Node `v26.0.0`.

**Hook probes invoke Node scripts directly with injected JSON fixtures. They are not end-to-end Claude Code runtime tests.** The installer and selected shell commands were actually executed against temporary fixtures. No installation into the user's Claude configuration, live project mutation, actual Git commit or network-dependent installation was performed. Fixtures set `CLAUDE_CONFIG_DIR` and `TMPDIR`; they never change `HOME`. Temporary fixtures were removed after each probe. The unrelated CV PDF was not opened.

Observed initial repository state had one unrelated untracked CV PDF. The audit adds only this documentation file. Existing `npm run check` completed successfully before any documentation addition.

## Summary

The current workflow has valuable structure: bounded implementers, separate spec and quality reviewers, requirement pins, deferred decisions, persistent plans, explicit evidence and browser verification guidance. Its runtime enforcement is materially weaker than these instructions. The highest-value technical change is a small evidence and state layer that makes completion claims revision-specific and inspectable, with measured workflow evaluations before increasing autonomy.

| ID | Severity | Finding | Confidence |
|---|---|---|---|
| I1 | High | Auto-installed statusline is invalid JavaScript | Installer actually executed; syntax failure reproduced |
| I2 | High | Gate state clears on command-text matches without validated gate results | Injected hook fixtures reproduced; echo and masked failure shell behavior verified |
| I3 | High | Bash mutations do not invalidate a successful gate | Injected hook sequence reproduced |
| I4 | High | Gate state is session-only, defaults clean, and is shared across projects within a session | Injected multi-session/project sequences reproduced |
| I5 | Medium | Completion guard checks wording and evidence-shaped text, not actual proof | Injected transcript fixtures reproduced |
| I6 | Medium | Alternate documentation roots supported by learn are ignored by runtime hooks | Alternate-root fixture reproduced |
| I7 | Medium | Retaining a custom statusline removes the context monitor's data source | Source-confirmed dependency; no live host test |
| I8 | Medium | CI omits installed-artifact and workflow failure checks | Source inspection plus existing checks passing alongside failures |

Severity here describes workflow reliability and user impact, not a security vulnerability rating.

## I1 — automatic installation breaks the statusline

[install.js:64–66](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/install.js#L64-L66) prepends `// gsr-hook-version: 0.5.0` to the unchanged source. That source begins with a shebang at [gsr-statusline.js:1](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/gsr-statusline.js#L1). A shebang is valid at the beginning of a Node script, not its second line.

Actual isolated installation succeeded. Running `node --check` on the installed copy returned exit 1:

```text
.../hooks/gsr-statusline.js:2
#!/usr/bin/env node
^
SyntaxError: Invalid or unexpected token
Node.js v26.0.0
```

The normal session-start path invokes that installer automatically, [session-start:40–46](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/session-start#L40-L46). The installed statusline cannot execute, so it also cannot write the context bridge used by the context monitor. The installer nevertheless prints a success message. The first-line version marker can then cause later starts to regard the broken copy as current.

**Proposed repair:** preserve the shebang position or remove it from copied scripts invoked through Node; syntax-check and execute the installed artifact; expose installation failures. Add clean-install and refresh fixtures, including custom statusline preservation.

## I2 and I3 — command recognition is not verified gate execution

[gsr-gate-tracker.js:17–23](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/gsr-gate-tracker.js#L17-L23) recognizes a regular expression in the Bash command and clears a single dirty boolean. It never inspects `tool_response`. It marks only `Edit`, `Write` and `NotebookEdit` as mutations.

Reproduced hook sequences, starting from an injected Edit:

| Subsequent event sequence | Resulting state | Guard output for `git commit -m fixture` |
|---|---|---|
| Bash `echo "npm run build"` | `{"dirty":false}` | Empty stdout; no ask |
| Bash `npm run build || true` | `{"dirty":false}` | Empty stdout; no ask |
| Bash `npm run build`, then Bash `echo broken > src.js` | `{"dirty":false}` | Empty stdout; no ask |

For the masked failure experiment, an actual temporary package defined build as `node -e "process.exit(1)"`. Running `npm run build` returned exit 1. Running `/bin/sh -c 'npm run build || true'` returned exit 0. Injecting the latter successful shell event into the tracker cleared dirty state. This proves the tracker does not establish whether the build inside a successful shell command succeeded. It does not establish a live host exploit or event-delivery trace.

An initial synthetic probe also supplied a failed build result in a `PostToolUse`-style fixture; it cleared dirty state. **That demonstrates absence of result validation only. It must not be described as the ordinary live failed-build path.** Official [Claude Code hook documentation](https://code.claude.com/docs/en/hooks#posttoolusefailure) documents failures through a separate `PostToolUseFailure` event, including a failed `npm test` example. GSR registers no listener for that event in [hooks.json](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/hooks.json). A successful gate followed by a failed rerun with no tracked mutation therefore has no explicit failure invalidation path; this is a source-level inference, not a live host reproduction.

The same boolean also cannot prove all required checks ran: a matching test command clears it even if build, type checking, lint or critical-path smoke checks were never executed. Conversely, any model Edit to bookkeeping documents can dirty it after code verification, potentially producing unnecessary commit questions. That friction is inferred from the implementation.

**Proposed repair:** explicitly execute configured gates and record results instead of parsing free-form shell text. Bind evidence to code/spec inputs; invalidate on relevant filesystem changes and failed verification; track each configured gate independently. Include shell generators and external edits in revision detection. Do not broaden the regex and call that a complete repair.

## I4 — gate evidence is not persistent project state

[gsr-gate-tracker.js:16–20](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/gsr-gate-tracker.js#L16-L20) stores only a dirty boolean in a temporary file keyed by session ID. [gsr-gate-guard.js:18–21](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/gsr-gate-guard.js#L18-L21) treats absent/unreadable evidence as clean.

Reproduced fixtures:

- Edit project A in session `s1`: guard returns `permissionDecision: "ask"`.
- Guard the same project under new session `s2`: empty stdout.
- Edit project A under session `shared`; execute a recognized gate event in project B under `shared`; guard project A: empty stdout.

This is narrower than demonstrating a real user's working-directory or subagent behavior, but conclusively establishes the state keying semantics.

**Proposed repair:** project/worktree identity plus content revision, persistent gate records, and an explicit `unverified` state. Missing evidence should not mean verified. Preserve the deliberate human override, but distinguish it from a passing gate.

## I5 — completion evidence is checked cosmetically

The stop hook looks for seven phrases and a loose evidence regex at [gsr-redflag-guard.js:6–7](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/gsr-redflag-guard.js#L6-L7). It bypasses a repeated stop hook to prevent loops.

Injected final assistant transcript results:

```text
"Done! It works."                           => empty stdout
"Looks good. ✅ made-up command → passed"   => empty stdout
"This should work."                        => decision: block
```

The skill also lists confident completions such as Done and It works among statements requiring evidence, [gate/SKILL.md:45–52](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/gate/SKILL.md#L45-L52). The hook is useful as a wording reminder but cannot establish whether any cited evidence exists or is current.

**Proposed repair:** completion should reference recorded checks and artifact revisions. Keep language guidance as secondary coaching, not the main correctness control. Tests should target unjustified success rather than specific banned wording.

## I6 and I7 — project detection and monitor coupling

The learn skill supports `.ai`, `.cursor`, `ai`, `docs`, `doc` and `documentation` at [learn/SKILL.md:35–61](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/learn/SKILL.md#L35-L61). Hooks hardcode `docs/STATE.md`, for example [gsr-gate-guard.js:17](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/gsr-gate-guard.js#L17).

A fixture with `.ai/STATE.md` was ignored by the tracker and guard. Session-start printed the generic new-project/existing-project banner. The discrepancy also exists in skills that continue to name `docs/` directly. One shared project configuration/root resolver would remove a class of inconsistent behavior.

The installer correctly retains foreign custom statuslines, [install.js:92–97](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/install.js#L92-L97). However, the context monitor requires a bridge written by the GSR statusline and exits if absent, [gsr-context-monitor.js:42–43](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/gsr-context-monitor.js#L42-L43). Thus preserving a custom statusline can silently remove monitoring. This is confirmed by source dependency, not by executing a live host with a custom statusline.

**Proposed repair:** separate context telemetry from user-facing rendering; advertise which runtime capabilities are active. Respect existing customization without hidden loss of unrelated behavior.

## Existing checks and their limits

Executed `npm run check`, exit 0:

```text
check:js       all seven declared hook sources pass node --check
check:json     three JSON files parse; plugin/marketplace version 0.5.0
check:docs     All local markdown links resolve
check:version  version-sync OK — all sources at 0.5.0
check:hooks    tests 10; pass 10; fail 0; skipped 0
```

The ten fixtures cover GSR/generic startup banners, a source grep against a former environment variable regression, three gate cases and four redflag cases. The installation side effect inside [test-hooks.js:40–50](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/scripts/test-hooks.js#L40-L50) is never validated by executing the installed copy. The successful gate test at [test-hooks.js:89–105](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/scripts/test-hooks.js#L89-L105) supplies no command result.

[CI](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/.github/workflows/ci.yml) runs on Ubuntu with Node 22. There is no OS matrix, installation integration test or benchmark of actual idea-to-product workflows. JSON checking is parsing/version comparison, not schema validation. Documentation-link checking scans only `gsr/docs`, so its success message does not cover all skill/command references.

## Compact reproduction harness

Run from the audited repository root. This intentionally invokes hooks directly with fixtures. It does not invoke Claude Code or execute a Git commit. It creates temporary package/config/project files, executes failing and masked npm scripts that need no dependencies, then removes its own temporary directory. The only environment overrides are `CLAUDE_CONFIG_DIR` and `TMPDIR`.

```bash
node <<'NODE'
const fs = require('fs'), os = require('os'), path = require('path');
const cp = require('child_process');
const root = process.cwd();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-audit-'));
const env = { ...process.env, CLAUDE_CONFIG_DIR: tmp, TMPDIR: tmp };
const hook = (name, data) => cp.spawnSync(process.execPath,
  [path.join(root, 'gsr/hooks', name)],
  { input: JSON.stringify(data), encoding: 'utf8', env });
const report = (probe, result) => console.log(JSON.stringify({ probe, ...result }));
const project = (name, docs = 'docs') => {
  const cwd = path.join(tmp, name);
  fs.mkdirSync(path.join(cwd, docs), { recursive: true });
  fs.writeFileSync(path.join(cwd, docs, 'STATE.md'), '# Fixture');
  return cwd;
};
const edit = (cwd, session_id) => hook('gsr-gate-tracker.js',
  { cwd, session_id, tool_name: 'Edit', tool_input: {} });
const bash = (cwd, session_id, command, tool_response = {}) =>
  hook('gsr-gate-tracker.js', { cwd, session_id,
    hook_event_name: 'PostToolUse', tool_name: 'Bash',
    tool_input: { command }, tool_response });
const guard = (cwd, session_id) => hook('gsr-gate-guard.js',
  { cwd, session_id, tool_name: 'Bash',
    tool_input: { command: 'git commit -m fixture' } }).stdout;
try {
  const install = cp.spawnSync(process.execPath,
    [path.join(root, 'gsr/hooks/install.js')], { env, encoding: 'utf8' });
  const syntax = cp.spawnSync(process.execPath,
    ['--check', path.join(tmp, 'hooks/gsr-statusline.js')], { encoding: 'utf8' });
  report('installed syntax', { installerExit: install.status,
    syntaxExit: syntax.status, stderr: syntax.stderr });
  const a = project('a'), b = project('b'), alt = project('alt', '.ai');
  edit(a, 'echo');
  const command = 'echo "npm run build"';
  const echo = cp.spawnSync('/bin/sh', ['-c', command], { cwd: a, env, encoding: 'utf8' });
  bash(a, 'echo', command, { stdout: echo.stdout, exit_code: echo.status });
  report('echo command', { shellExit: echo.status, guard: guard(a, 'echo') });
  fs.writeFileSync(path.join(a, 'package.json'), JSON.stringify({
    name: 'gsr-audit-fixture', version: '1.0.0',
    scripts: { build: 'node -e "process.exit(1)"' }
  }));
  const failed = cp.spawnSync('npm', ['run', 'build'], { cwd: a, env, encoding: 'utf8' });
  edit(a, 'masked');
  const maskedCommand = 'npm run build || true';
  const masked = cp.spawnSync('/bin/sh', ['-c', maskedCommand], { cwd: a, env, encoding: 'utf8' });
  bash(a, 'masked', maskedCommand, { stdout: masked.stdout,
    stderr: masked.stderr, exit_code: masked.status });
  report('masked failure', { buildExit: failed.status,
    shellExit: masked.status, guard: guard(a, 'masked') });
  edit(a, 'shell');
  bash(a, 'shell', 'npm run build', { exit_code: 0 }); // synthetic successful gate
  bash(a, 'shell', 'echo broken > src.js', { exit_code: 0 }); // injected mutation event
  report('shell mutation', { guard: guard(a, 'shell') });
  edit(a, 's1');
  report('new session', { original: guard(a, 's1'), fresh: guard(a, 's2') });
  edit(a, 'shared'); bash(b, 'shared', 'npm test');
  report('other project', { guard: guard(a, 'shared') });
  edit(alt, 'alt');
  report('alternate docs', { guard: guard(alt, 'alt'),
    banner: hook('session-start', { cwd: alt }).stdout });
  for (const text of ['Done! It works.',
    'Looks good. ✅ made-up command → passed', 'This should work.']) {
    const transcript_path = path.join(tmp, 'transcript.jsonl');
    fs.writeFileSync(transcript_path, JSON.stringify({ type: 'assistant',
      message: { content: [{ type: 'text', text }] } }));
    report('completion wording', { text,
      output: hook('gsr-redflag-guard.js', { cwd: a, transcript_path }).stdout });
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
NODE
```

Expected essential outputs: installer 0 / syntax 1; echo shell 0 / empty guard; masked build 1 / shell 0 / empty guard; shell mutation empty guard; original session ask / fresh session empty; other project empty; alternate docs generic banner; first two completion strings empty / final string block.

## Persistence, portability and model routing

Plans are durable Markdown with task status and free-text evidence/commit SHA, [plan-md.md:19](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/templates/plan-md.md#L19). Session-start detects unfinished plans and age, which is useful for continuity. It does not reconcile claimed progress with Git content or current test results. Pin coverage records status and date without requirement revision or code hash, [state-md.md:37](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/templates/state-md.md#L37).

Most invariants remain model instructions: human product decisions, correct review staging, isolated worktrees, atomic commits and actual runtime behavior. The gate guard is an intentional human-overridable ask, not a deny. The distinction should be reflected accurately in documentation and capability displays.

Native packaging is Claude Code-specific: `.claude-plugin`, `CLAUDE_PLUGIN_ROOT`, tool names and [update CLI commands](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/commands/update.md#L11-L15). Migrated skills being available in Codex does not prove the same native runtime controls execute there.

Update detection reads a hardcoded marketplace checkout path and treats unequal version strings as an available update, [gsr-statusline.js:127–165](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/hooks/gsr-statusline.js#L127-L165). Alternate caches or development versions can therefore be misreported; this was not network-tested. Minor packaging drift: the package-lock root version is `0.2.11`, whereas release sources checked by CI are `0.5.0`.

Model assignments are static: [researcher uses opus](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/agents/researcher.md#L4); implementer and both reviewers use sonnet. There is no configurable budget/capability policy or measured escalation logic. Model aliases should be evaluated by actual task performance rather than assuming an agent count or newer model automatically improves the workflow.

The claimed single gate source also drifts: [gate skill](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/gate/SKILL.md#L13-L17) reads project-specific commands, but [implementer](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/agents/implementer.md#L29-L35) and [verification](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L142-L147) repeat npm/TypeScript defaults.

## Proposed technical sequence

1. **Reliability release:** repair installation and add installed-artifact smoke tests, shared project-root/gate configuration, clear runtime health, and regression fixtures for the cases above.
2. **Evidence records beneath existing skills:** store project/worktree, requirement revision, code-input hash, gate identifier/command, result, output artifact and time. Keep Markdown readable. Separate verified, outdated, unverified and human-accepted states.
3. **Workflow evaluations:** small reference projects plus failed gates, interrupted sessions, stale evidence, shell changes, alternate docs roots, missing browser tools and concurrent edits. Measure false success, recovery success, time/cost, user interruptions and completed user journeys.
4. **Model routing based on measured outcomes:** stronger models for uncertain product reasoning, decomposition, difficult debugging or independent verification when they improve results; cheaper execution for routine tasks. Evaluate single-agent and multi-agent variants instead of assuming one wins.
5. **Explicit provider adapters:** retain portable requirements/state/evidence, adapt host tools/hooks/permissions, and report unsupported capabilities. Expand to additional hosts once the supported path is dependable.

For a nontechnical user, these foundations should appear as fewer unexplained interruptions, a clear next action, a working demo, and a trustworthy distinction between what was built, what was actually checked, and what still needs their judgment.
