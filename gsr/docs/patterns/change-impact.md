# Change impact from current sources

For an authorized change to an existing product, inspect the affected requirements,
actual entry/data/integration code, dependencies and check configuration first. Reuse
current research and installed guidance within their applicability; do not rediscover
the whole product or infer behavior from an ID in code. A clear typo needs no map/queue.

The internal `lib/change-impact.js` accepts a model-prepared definition: schemaVersion 1,
objective, scope, exclusions, coverage (`reviewed` or `partial`), gaps and entries.
Each entry has a unique requirement ID, requirement source descriptor, implementation
descriptors, configured check IDs, dependsOn entry IDs and the rationale for these links.
Reviewed means the mapping has been inspected, not proven complete/correct by a hash.
Unknown gaps/missing links require expansion, not a claim that nothing else is affected.

A source descriptor is `{ "ref": "features/booking.md#Requirements" }` or
`{ "ref": "@project/src/booking.js", "lines": [10, 30] }`. Lines are one-based,
inclusive and cannot combine with a heading. Existing reference validation rejects
traversal, absolute paths, missing/ambiguous headings and escaping/dangling symlinks.
STATE is administrative and cannot own requirement/package source content.

Only explicit sources are read: no automatic project sweep for context. Source files
must be UTF-8 text <=1 MiB; excerpts <=16 KiB. Select a populated specific child heading
or line range for a large/empty parent section. No silent truncation. Source snapshots
include current whole-file content identity, mode and canonical location; excerpt
content is checked too. Same ID with new wording, deleted input, changed code/config
or changed source location makes the map stale/diagnostic. Hash currency never proves
semantic dependencies, external state or authorization.

`prepareImpact(project, definition)` returns a derived map bound to the canonical
project. `inspectImpact(project, map)` returns current/incomplete/stale/diagnostic,
issues and `verificationProfile: default`. It never executes checks or reduces them.
Default still includes every required check. A genuinely bounded named profile must
satisfy the existing verification contract independently of this map.

Task packages use `lib/task-package.js`: inherit all global constraints/exclusions,
source/date/scope of actual authorization, review cadence, decision-owner refs,
dependencies and check needs. Add task constraints; do not replace global ones.
Use current referenced research/observations without claiming that reading equals use.
Default initial set <=6 unique references; an explicit reason may expand it to <=16,
with <=96 KiB combined excerpts. Otherwise split the task. Missing context, source
drift or an incomplete map needs inspection. An explicit gapPlan can prepare independent
work while the affected unresolved integration waits; it does not resolve the choice.

The persisted `DOC_ROOT/work/<slug>/context.json` contains the queue definition,
**one embedded derived map**, tasks and shared policy. No second editable impact copy
is needed. Requirements/decisions retain their original owners. This definition and its
sources remain fingerprint inputs, including when work is ignored by Git. Before each
step reconcile current wording, decisions and user limits; a package is not a grant.
