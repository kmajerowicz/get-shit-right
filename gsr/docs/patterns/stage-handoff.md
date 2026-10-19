# Stage handoff → /clear → dalej

At a major stage or bounded long-build checkpoint, save a compact packet in the
existing `## Active Task` section. Preserve unrelated STATE content, one current task,
original authorization and latest cadence/constraints. Requirements remain in the
covered feature/research/plan documents; STATE is administrative navigation only.
No new task database, transcript copy, runtime router or session lifecycle.

## Packet fields

Keep the Phase 1 objective, constraints, authorized scope, authorization source/date,
review cadence, Plan/task, Last verified run and Next action. Add these optional fields
only when handing off a major stage/checkpoint:

```markdown
**Context handoff:** Prepared for fresh context; read the referenced contract.
**Stage:** focused feature scope
**Checkpoint:** completed
**Next step:** build
**Completed work:** Export requirements and integration points recorded; no code implemented.
**Remaining work:** Implement export, then run configured/behavioral checks.
**Open questions:** None; or actual unresolved choices/valid deferrals with refs.
**Read next:** `features/csv-export.md#Task Context`, `@project/src/orders.py`
**Guidance next:** gsr:build; additional relevant host-catalog skills by name.
```

`Checkpoint`: completed (this stage, not automatically the whole feature),
checked-increment (tested build slice, overall build still in progress), partial
(unfinished/unverified as applicable). `Next step`: scope, prd, build, verify, debug,
learn, quick, status, or none only for genuinely complete tasks. Next action is the
specific bounded work, not just the generic stage name. Invalid/missing/ambiguous
metadata requires reconciliation, never guessed ready/accepted/authorized state.

Read next is up to six initial backticked DOC_ROOT-relative file/section references
or explicit `@project/path` inputs. Bullet continuation lines also work. Reject
traversal/absolute/escaping symlink paths and missing refs. Resolve skill sources through
the host catalog, not arbitrary external packet paths. Reference relevant documents/
code areas without replaying all project docs/research. Expand only for an actual gap.
A section reference tells the agent what to read; structural existence does not prove
that the section content is sufficient or the behavior correct. Legacy Active Task
without packet fields remains valid: inspect saved task/Next action and current files.

## Save, reset, resume

1. Record actual completed versus remaining work, decisions/constraints/source refs,
   latest cadence, current run/reference and coverage limitations. Prepare covered
   requirement/research/plan inputs before final checks; administrative progress alone
   is not proof. Do not hide source/requirements in STATE's fingerprint exclusion.
2. Briefly report stage outcome/limits, recommend `/clear` then **dalej**. Do not
   reset/create/respawn the session yourself. No unnecessary reset for a typo/completed task.
3. SessionStart injects a bounded pointer/packet and current evidence observation,
   not file contents or a new user prompt. After the user's continuation, load coordinate
   guidance, announce task/step, read the minimal refs/current installed guidance and
   reconcile actual files/evidence before further work. Cleared chat is not assumed.
4. Preserve original scope and later narrowing. `dalej` is continuation, not automatic
   product decisions, feature acceptance, publication or installation. Requested review
   pauses survive; ambiguous competing tasks require one genuine target question.

Long builds split into meaningful increments with appropriate checks. A partial
checkpoint does not mark all tasks done or clear stale/failing observations. The next
context resumes the exact unfinished step; a checked increment still leaves the overall
build in progress. Stage context boundaries and human review boundaries are separate.

## Evidence limits

`lib/stage-packet.js` inspects/render records; it never executes a stage or authorizes
work. Its status `recorded-handoff` is a structural observation. `lib/task-context.js`
reads heading-based context, preserving legacy STATE and diagnostics. Hook/packet tests
establish parsing/path/bounding/evidence behavior; only actual host/model trials establish
bare-message resume, cadence adherence and minimal reading. Missing host support uses
`/gsr:start continue` fallback with an explicit gap; fallback does not prove **dalej**.
