'use strict';
// Synthetic technical experiment, not a production import/export service.
const fs = require('fs');
try {
  const rows = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  if (!Array.isArray(rows) || rows.some(r => !r || typeof r.name !== 'string' || !Number.isSafeInteger(r.id))) throw new Error('Expected rows with integer id and string name');
  const cell = value => '"' + String(value).replace(/"/g, '""') + '"';
  process.stdout.write('id,name\n' + rows.map(r => [r.id, r.name].map(cell).join(',') + '\n').join(''));
} catch (e) { process.stderr.write(e.message + '\n'); process.exitCode = 1; }
