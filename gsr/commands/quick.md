You are running the `/gsr:quick` command.

The user's task is the command argument (everything after `/gsr:quick`). If no
argument was given, ask in one line: "What's the task?"

No working-directory ceremony beyond: if `.gsr-session.json` exists and its
`project_dir` differs from `pwd`, `cd` there first.

Load and execute the quick skill: read `${CLAUDE_PLUGIN_ROOT}/skills/quick/SKILL.md`
in full, then follow its instructions exactly.
