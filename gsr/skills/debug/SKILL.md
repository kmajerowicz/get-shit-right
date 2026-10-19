---
name: gsr-debug
description: Run or resume a persistent, systematic debug investigation (OBSERVE/HYPOTHESIZE/TEST/CONCLUDE) that survives /clear and session crashes. Use when something in a GSR project is broken and needs a tracked investigation.
---

# /gsr:debug — Debug Skill

You are executing the `/gsr:debug` command. Your job is to run a persistent, systematic debug investigation that survives `/clear` and session crashes.

---

## Fresh-context stage handoff

At a major stage or long-build increment, follow
`${CLAUDE_PLUGIN_ROOT}/docs/patterns/stage-handoff.md`. Save objective/constraints,
original authorization/latest cadence, actual completed/remaining work, open choices,
current evidence/run limits, stage/checkpoint, exact next step/action and minimal read
references in the existing Active Task. Keep requirements in covered source documents.
Recommend `/clear` then **dalej** after saving. The next context loads coordinate and
the selected current guidance/refs only after the user's continuation; no automatic
hook execution, context reset or new session. Direct commands remain scoped optional
controls. A completed task or tiny correction needs no new-stage/reset instruction.
Planning-only completion records no authorized implementation next step. Partial/checked
build increments preserve actual overall in-progress state, limits and requested review.

## Collaboration contract

Explicit task authorization and constraints override generic workflow defaults within host permissions. Read settled answers from the conversation and project files; never ask for them again. A planning-only request does not authorize implementation. Prepare plans, research material uncertainties, load installed skills, record state and run proportionate checks without separate approval. Weight controls rigor, not authority or review cadence. Honor explicitly requested per-chunk review and later instructions narrowing autonomy; otherwise continue reversible work in scope. Ask only for an unresolved consequential product choice or a real installation, spending, publishing, destructive-action or host permission boundary. Continue independent authorized work while a decision is pending. Completion reports give the outcome, brief verification and unresolved limits; detailed evidence stays accessible.

Discover the canonical project and DOC_ROOT using `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`; below, `docs/` means that resolved DOC_ROOT, not an assumed folder. Invalid discovery/configuration is a diagnostic to reconcile, never permission to silently switch projects.

### Task continuation and completion

When authorized work updates STATE, add/update one optional `## Active Task` section
without rewriting unrelated sections. Record objective, constraints, authorized scope,
source/date of authorization in prose, explicit review cadence, current plan/task relative
to DOC_ROOT, last verified run reference and next action. The template is
`${CLAUDE_PLUGIN_ROOT}/templates/state-md.md`; legacy files remain valid.

On resume read this section by heading (not the first 20 lines), read the referenced
current task/plan, inspect actual repository state and observe current evidence freshness.
Reconcile missing references and conflicting recorded progress with files; a done box is
not proof and stale tests do not reset implemented work. Resume remaining authorized work
without re-asking settled decisions. Preserve explicitly requested review boundaries;
later instructions narrowing autonomy override STATE. No session record expands authority.

At completion recheck evidence freshness. Report outcome, brief actual verification/run
reference and unresolved limitations or necessary decision. Keep detailed gate output in
records, not duplicate STATE assertions. Browser/manual observations and unavailable
coverage remain explicit; machine checks never establish human acceptance. Do not demand
user acceptance for each successful automated check.

## Iron Laws

1. **One hypothesis at a time.** Current Focus holds exactly one falsifiable hypothesis. Never two. If a hypothesis branches into a sub-investigation, create a sibling file referencing the parent — don't cram two hypotheses into one section.
2. **Write before you proceed.** Every phase transition writes the file. Never advance to the next phase without updating the on-disk record first.
3. **Append only.** Evidence and Eliminated sections grow; they never shrink. A deleted entry is a lost data point.
4. **Understand the fix.** "It works now, not sure why" is not CONCLUDE — it's still TEST. Root cause must be named.

---

## Entry: No active session

1. Read the supplied symptom/error and current failing evidence first. Ask only for missing reproduction information that cannot be obtained from files or observation.
2. Derive a slug from the symptom (kebab-case, max 5 words). Example: `auth-token-undefined-on-reload`.
3. Create `docs/debug/<YYYY-MM-DD>-<slug>.md` from `${CLAUDE_PLUGIN_ROOT}/templates/debug-md.md`. Fill in:
   - `status: active`
   - `feature`: the feature currently being built, or "general" if unknown
   - `created` and `updated`: today's date
   - **Symptom** section: user's description, cleaned up to one paragraph
   - **Reproduction** section: derive steps from available evidence; ask only for inaccessible missing context
   - **Next Step**: "Enter OBSERVE phase — gather facts before forming any hypothesis."
   - **Timeline**: `[<date>] Session created — OBSERVE`
4. Tell the user: "Here's your debug session file: `docs/debug/<slug>.md` — it'll survive a `/clear` or session crash. Starting OBSERVE phase."

---

## Entry: Resume existing session

1. Read `docs/debug/<slug>.md`.
2. Announce current state: "Picking up `docs/debug/<slug>.md`. Current Focus: `<hypothesis>`. Next Step: `<next step>`."
3. Reconcile the recorded Next Step with actual files and fresh evidence, then resume remaining authorized work. Reobserve invalidated facts without erasing established progress; preserve explicit review cadence.

---

## Phase 1: OBSERVE

Reproduce the bug and gather facts. No hypotheses yet.

- Reproduce the bug using exact steps from the Reproduction section. If you can't reproduce it, write that as an Evidence entry and ask the user for more context.
- Read the FULL error message — stack trace, line numbers, error codes.
- Check: what changed recently? Relevant commits, dependency updates, config changes.
- Gather relevant code, related files, dependency versions.

**After OBSERVE:** Update the file:
- Add dated Evidence entries for every fact gathered.
- Update **Next Step**: "Enter HYPOTHESIZE — form one falsifiable hypothesis."
- Append to Timeline: `[<date>] OBSERVE complete — <one-line summary of key finding>`
- Update `updated` in frontmatter.

Write the file. Then proceed to HYPOTHESIZE.

---

## Phase 2: HYPOTHESIZE

Form exactly one hypothesis from the evidence gathered.

- State it as falsifiable: "The error occurs because X, which means if I do Y, I should see Z."
- Vague hypotheses fail this test: "Something is wrong with the config" → rejected. "The API base URL is missing `/v2`, which means requests hit a 404" → valid.
- If you can't form a hypothesis, you haven't observed enough — return to OBSERVE.

**After HYPOTHESIZE:** Update the file:
- Write the hypothesis into **Current Focus** (replace any previous entry — this section always holds the active hypothesis, not history).
- Update **Next Step**: "Enter TEST — design minimal experiment to prove or disprove hypothesis."
- Append to Timeline: `[<date>] HYPOTHESIZE — <hypothesis, one line>`
- Update `updated` in frontmatter.

Write the file. Then proceed to TEST.

---

## Phase 3: TEST

Design a minimal experiment. Run it.

- Binary search: narrow the problem space by half with each test.
- One change at a time. Never change multiple things simultaneously.
- Revert if it doesn't help. Don't leave speculative changes in the code.
- Never shotgun debug: changing 5 things and checking if the problem goes away is gambling, not testing.

**After TEST:** Update the file:
- Add a dated Evidence entry with the test result (what you ran, what you observed).
- If hypothesis **confirmed**: update **Next Step** to "Enter CONCLUDE — fix root cause."
- If hypothesis **disproved**: move the hypothesis from Current Focus to **Eliminated** with the disproving evidence. Update **Next Step** to "Return to OBSERVE — failed test is new data."
- Append to Timeline: `[<date>] TEST — <result in one line>`
- Update `updated` in frontmatter.

Write the file. Then proceed to CONCLUDE or return to OBSERVE.

---

## Phase 4: CONCLUDE

Evaluate the test result. Fix the root cause.

- Fix the ROOT CAUSE, not the symptom. If a null check fixes the crash but the value should never be null, find out why it's null.
- After fix: verify the original bug is gone AND no new bugs were introduced. Run relevant tests. Check related functionality.
- Run the gate per `${CLAUDE_PLUGIN_ROOT}/skills/gate/SKILL.md` (single source of truth).
- "It works now, not sure why" is not CONCLUDE. Name the root cause.

**After CONCLUDE with verified fix:** Update the file:
- Set `status: resolved` in frontmatter.
- Update `updated` in frontmatter.
- Append to Timeline: `[<date>] CONCLUDE — <root cause named, fix described>`
- Clear **Next Step**: "Resolved. Root cause: <one line>."

Write the file.

Report the root cause, verified fix and remaining limits. Record relevant Learned Rules within authorized work without a confirmation pause.

Then: return to build flow. The controller (Mode A or Mode B) resumes from where it left off.

---

## Red Flags

Stop and course-correct if you reach for any of these:

| Thought | Reality |
|---------|---------|
| "Let me try changing this and see if it helps" | That's shotgun debugging. Go back to OBSERVE. |
| "I think the problem might be..." without evidence | You're guessing. Collect facts first. |
| "Let me change A, B, and C together" | One change at a time. You won't know which one fixed it. |
| "It works now, not sure why" | Understand the root cause. A fix you don't understand is a bug you'll see again. |
| "I have two possible hypotheses" | Pick one. Write the other in a sibling file. Current Focus = one hypothesis only. |

---

## After 3 failed hypothesis cycles

If three hypotheses have been disproved: step back. Re-read all Evidence entries from scratch. Look for a pattern you missed. If still stuck after re-observing, escalate to the user with: "Three hypotheses eliminated. Here's what I know so far: [evidence summary]. I need your help — do you have domain knowledge about [area]?"
