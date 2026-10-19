---
description: 'Start or continue a bounded GSR task; preserve fresh-context stage handoffs and requested review cadence'
argument-hint: '[outcome | continue]'
---

You are running `/gsr:start`. The request is `$ARGUMENTS` plus the conversation's
latest instructions. `continue`/`dalej` means resolve the saved task, not expand
its authority. With no argument use the supplied task; ask for the objective only
if neither the conversation nor a current unambiguous task identifies it.

Discover the intended canonical project/DOC_ROOT with
`${CLAUDE_PLUGIN_ROOT}/lib/project.js`; reject invalid/escaping configuration and
never follow a stale session manifest silently. Do not scaffold for read-only or
quick requests. Load `${CLAUDE_PLUGIN_ROOT}/skills/coordinate/SKILL.md` and follow
its bounded-stage routing. This command does not reset/create sessions, publish,
install tools or turn planning/review into implementation.
