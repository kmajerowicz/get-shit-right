'use strict';
const crypto = require('crypto');
const fs = require('fs');
function validate(config, root) {
  const { resolveWithin } = require('./project');
  const bad = message => { throw new Error(`Invalid .gsr.json: ${message}`); };
  if (!config || typeof config !== 'object' || Array.isArray(config) || config.schemaVersion !== 1) bad('schemaVersion must be 1');
  if (config.docRoot !== undefined) resolveWithin(root, config.docRoot, 'docRoot');
  if (config.checks !== undefined && !Array.isArray(config.checks)) bad('checks must be an array');
  if (Buffer.byteLength(JSON.stringify(config)) > 262144) bad('configuration exceeds 256 KiB');
  if ((config.checks || []).length > 128) bad('at most 128 checks supported');
  const ids = new Set();
  for (const check of config.checks || []) {
    if (!check || typeof check.id !== 'string' || !/^[\w.-]+$/.test(check.id) || ids.has(check.id)) bad('unique check id required');
    ids.add(check.id);
    if (!Array.isArray(check.argv) || !check.argv.length || check.argv.length > 128 || check.argv.some(a => typeof a !== 'string' || !a || Buffer.byteLength(a) > 8192 || a.includes('\0'))) bad(`${check.id}: nonempty argv strings required`);
    if (check.argv.some(a => /^(\|\|?|&&|;|>|>>|<|&)$/ .test(a)) || /^(ba|z|da|k)?sh$|^cmd(\.exe)?$|^powershell(\.exe)?$/i.test(require('path').basename(check.argv[0]))) bad(`${check.id}: shell commands/operators are unsupported; use a reviewed script`);
    if (check.cwd !== undefined) resolveWithin(root, check.cwd, `${check.id} cwd`);
    if (check.required !== undefined && typeof check.required !== 'boolean') bad(`${check.id}: required must be boolean`);
    if (check.timeoutMs !== undefined && (!Number.isSafeInteger(check.timeoutMs) || check.timeoutMs < 1 || check.timeoutMs > 2147483647)) bad(`${check.id}: invalid timeoutMs`);
    if (!['static', 'test', 'runtime'].includes(check.kind)) bad(`${check.id}: kind must be static, test or runtime`);
  }
  if (config.profiles !== undefined) {
    if (!config.profiles || typeof config.profiles !== 'object' || Array.isArray(config.profiles)) bad('profiles must be an object');
    for (const [name, list] of Object.entries(config.profiles)) {
      if (!/^[\w.-]+$/.test(name) || !Array.isArray(list) || new Set(list).size !== list.length || list.some(id => !ids.has(id))) bad(`invalid profile ${name}`);
      if (/docs?[-_]?only/i.test(name) && (typeof config.profileApplicability?.[name] !== 'string' || !config.profileApplicability[name].trim())) bad(`${name}: bounded applicability must be documented`);
    }
  }
  return config;
}
function select(project, profile = 'default') {
  if (!project.config) throw new Error('Missing .gsr.json; configure project checks before verification');
  const config = validate(project.config, project.root);
  const all = (config.checks || []).map(c => ({ ...c, cwd: c.cwd || '.', required: c.required !== false, timeoutMs: c.timeoutMs || 120000 }));
  const explicit = config.profiles?.[profile];
  const ids = profile === 'default'
    ? [...new Set([...(explicit || []), ...all.filter(c => c.required).map(c => c.id)])]
    : explicit;
  if (!ids) throw new Error(`Unknown profile: ${profile}`);
  return { profile, checks: ids.map(id => all.find(c => c.id === id)), configFingerprint: crypto.createHash('sha256').update(fs.readFileSync(project.configPath)).digest('hex') };
}
module.exports = { validate, select };
