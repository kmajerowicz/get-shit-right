---
description: Index an existing codebase, populate CLAUDE.md, and get told what to do next
---

You are running the `/gsr:learn` command.

**Project discovery:** Resolve canonical project/DOC_ROOT using `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`. A stale `.gsr-session.json` is navigation only; never `cd` to its project automatically. Ask only if the intended project is genuinely unclear. Preserve useful existing docs and use the resolved DOC_ROOT.

**Operation boundary:** Direct learn indexes and updates relevant documentation only; it never implements the contextual feature, provisions services or enters a full pipeline. Internally a broader authorized task may reuse its bounded assessment for focused feature preparation. No whole-PRD requirement or compulsory weight confirmation.

If maintaining a session manifest, reconcile it against the canonical intended project; update stale project identity rather than preserving an incorrect path.

Load and execute the learn skill: read `${CLAUDE_PLUGIN_ROOT}/skills/learn/SKILL.md` in full, then follow its instructions exactly.

When indexing is complete, return the bounded assessment and concrete next action. Existing-product features use focused scope/spec preparation without a full PRD. For a broader authorized task save the compact stage handoff, recommend `/clear` then **"dalej"**; direct commands remain optional. Standalone indexing ends here, without implementation.
