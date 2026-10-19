# Internal autopilot preparation request

Illustrative schema; replace with inspected project sources/check IDs and actual owner
instruction. It is not an existing artifact, permission, passing map or user choice form.
Use internal `scripts/autopilot.js prepare` with JSON through stdin. Project paths are
DOC_ROOT-relative unless prefixed @project/. No shell code is executed from this JSON.

```json
{
  "id": "guest-booking",
  "current": { "operation": "implement", "source": "Actual current user instruction/date" },
  "impact": {
    "schemaVersion": 1,
    "objective": "Requested outcome",
    "scope": "Inspected affected behavior",
    "exclusions": ["Preserve existing appearance"],
    "coverage": "partial",
    "gaps": ["Inspect actual persistence integration"],
    "entries": [{
      "id": "booking.T1",
      "requirement": { "ref": "features/booking.md#Requirements" },
      "implementation": [{ "ref": "@project/src/booking.js", "lines": [1, 12] }],
      "checks": ["booking"],
      "dependsOn": [],
      "rationale": "Observed entry validates input before repository write"
    }]
  },
  "policy": {
    "constraints": ["Actual global restrictions"],
    "exclusions": ["No publication"],
    "authorization": { "source": "Actual owner instruction", "date": "Actual date", "scope": "Actual authorized scope" },
    "reviewCadence": "Actual requested cadence",
    "reviewAfterEachTask": false,
    "decisionRefs": [{ "ref": "features/booking.md#Open-Decisions" }],
    "contextRefs": [],
    "limits": { "maxAttempts": 3, "maxSteps": 3 }
  },
  "tasks": [{
    "id": "guest",
    "objective": "Concrete bounded result",
    "doneWhen": "Observable criterion",
    "requirements": ["booking.T1"],
    "dependsOn": [],
    "constraints": ["Additional task boundary"],
    "extraRefs": [],
    "gapPlan": "Inspect persistence before its affected write; only independent work can proceed"
  }]
}
```

An emitted package contains task/shared policy, inherited constraints/exclusions, bounded
source excerpts/identities and default verification needs. It is refreshed from actual
sources, not copied blindly from a prior conversation. Missing optional research/decisions
is recorded accurately; do not create fake files or decisions to satisfy this example.
