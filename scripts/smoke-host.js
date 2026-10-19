#!/usr/bin/env node
'use strict';
// Optional native startup smoke, never a model/paid API trial. Not required in CI.
const fs = require('fs'); const path = require('path'); const os = require('os'); const { spawnSync } = require('child_process');
const plugin = path.resolve(__dirname, '../gsr');
const version = spawnSync('claude', ['--version'], { encoding: 'utf8', timeout: 10000 });
if (version.status !== 0) {
 console.log(JSON.stringify({ status: 'unavailable', diagnostic: 'Installed Claude CLI unavailable; native/model validation outstanding' })); process.exitCode = 2;
} else {
 const work = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-native-work-')), config = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-native-config-'));
 try {
  fs.mkdirSync(path.join(work, 'docs/features'), { recursive: true }); fs.mkdirSync(path.join(work, 'src'));
  fs.writeFileSync(path.join(work, 'docs/features/csv.md'), '## Purpose\nCSV\n## User Story / Flow\nExport\n## Must-Haves\nHeader for empty input');
  fs.writeFileSync(path.join(work, 'src/orders.py'), 'pass');
  fs.writeFileSync(path.join(work, 'docs/STATE.md'), `# Native startup fixture
## Active Task
**Objective:** CSV export native startup fixture
**Constraints:** local only, no publish
**Authorized scope:** local implementation and checks
**Authorization:** synthetic fixture 2026-10-13
**Review cadence:** wait after each requested chunk
**Plan/task:** \`features/csv.md\`
**Context handoff:** prepared for fresh context
**Stage:** focused feature scope
**Checkpoint:** completed
**Next step:** build
**Next action:** implement CSV
**Completed work:** spec only
**Remaining work:** implementation and verification
**Open questions:** none
**Read next:** \`features/csv.md#Must-Haves\`, \`@project/src/orders.py\`
**Guidance next:** gsr:build
`);
  const debug = path.join(work, 'debug.log');
  const result = spawnSync('claude', ['--init-only', '--plugin-dir', plugin, '--setting-sources', '', '--debug-file', debug], { cwd: work, env: { ...process.env, CLAUDE_CONFIG_DIR: config }, encoding: 'utf8', timeout: 20000 });
  const log = fs.existsSync(debug) ? fs.readFileSync(debug, 'utf8') : '';
  const sessionStart = log.includes('SessionStart'), packetDelivered = log.includes('next step build') && log.includes('Native startup fixture');
  const loaded = type => { const match = log.match(new RegExp(`Loaded (\\d+) ${type} from plugin gsr`)); return match ? Number(match[1]) : null; };
  const observed = result.status === 0 && sessionStart && packetDelivered;
  console.log(JSON.stringify({ status: observed ? 'observed-startup' : 'unvalidated-startup', host: version.stdout.trim(), exitCode: result.status, timedOut: result.error?.code === 'ETIMEDOUT', sessionStart, packetDelivered, commandsLoaded: loaded('commands'), skillsLoaded: loaded('skills'), modelInvoked: false, limitations: ['Startup only, not interactive /clear delivery', 'Bare dalej route, cadence and C1-C12 model behavior remain unobserved', 'Does not establish Codex native parity'] }));
  if (!observed) process.exitCode = 2;
 } finally { fs.rmSync(work, { recursive: true, force: true }); fs.rmSync(config, { recursive: true, force: true }); }
}
