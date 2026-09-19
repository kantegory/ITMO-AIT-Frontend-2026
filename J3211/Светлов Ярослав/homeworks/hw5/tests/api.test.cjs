const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createApp } = require('../server.cjs');
test('список, валидация, создание и сохранение заметки', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hw5-test-'));
  const db = path.join(dir, 'db.json');
  fs.writeFileSync(db, JSON.stringify({ notes: [] }));
  const server = createApp(db).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = 'http://127.0.0.1:' + server.address().port;
  const post = body => fetch(url+'/notes', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  try {
    assert.deepEqual(await fetch(url+'/notes').then(r=>r.json()), []);
    assert.equal((await post({title:' ',text:'text'})).status, 400);
    const response = await post({title:'  Test  ',text:'Line 1\nLine 2',id:999});
    assert.equal(response.status, 201);
    const note = await response.json();
    assert.equal(note.title, 'Test'); assert.notEqual(note.id, 999);
    assert.equal(JSON.parse(fs.readFileSync(db)).notes[0].text, 'Line 1\nLine 2');
    assert.equal((await fetch(url+'/db')).status, 404);
  } finally { await new Promise(resolve=>server.close(resolve)); fs.rmSync(dir, {recursive:true}); }
});
