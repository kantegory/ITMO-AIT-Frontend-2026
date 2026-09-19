const { copyFileSync } = require('node:fs');
const path = require('node:path');

copyFileSync(path.join(__dirname, 'seed.json'), path.join(__dirname, 'db.json'));
console.log('Local mock database reset from seed.json.');
