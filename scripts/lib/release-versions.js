'use strict';
const fs = require('node:fs');
const path = require('node:path');

// Prepare every edit before writing; dependency resolutions/integrity are untouched.
function versionEdits(root, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('Expected a release version');
  return [
    ['package.json', data => { data.version = version; }],
    ['gsr/.claude-plugin/plugin.json', data => { data.version = version; }],
    ['.claude-plugin/marketplace.json', data => {
      const plugin = data.plugins.find(item => item.name === 'gsr');
      if (!plugin) throw new Error('GSR marketplace entry missing');
      plugin.version = version;
    }],
    ['package-lock.json', data => {
      if (!data.packages?.['']) throw new Error('Root package-lock metadata missing');
      data.version = version;
      data.packages[''].version = version;
    }],
  ].map(([file, edit]) => {
    const before = fs.readFileSync(path.join(root, file), 'utf8');
    const data = JSON.parse(before);
    edit(data);
    return { file, before, after: JSON.stringify(data, null, 2) + '\n' };
  });
}
module.exports = { versionEdits };
