const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { createApp } = require('../server.cjs');
const seed = require('../db.json');

let server, base, token, otherToken, createdId;
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-api-test-'));
const database = path.join(directory, 'db.json');

async function request(url, method = 'GET', body, authToken = token) {
  const response = await fetch(base + url, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: response.status, data: await response.json() };
}

before(async () => {
  fs.copyFileSync(path.join(__dirname, '../db.json'), database);
  server = createApp(database).listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
  const first = await request('/login', 'POST', { email: 'admin@nexus.ai', password: 'password' }, null);
  assert.equal(first.status, 200);
  token = first.data.accessToken;
  const second = await request('/login', 'POST', { email: 'vision@nexus.ai', password: 'cv12345' }, null);
  assert.equal(second.status, 200);
  otherToken = second.data.accessToken;
});

after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  fs.rmSync(directory, { recursive: true });
});

test('данные согласованы: владельцы и связанные эксперименты существуют', () => {
  for (const experiment of seed.experiments) assert.ok(seed.users.some(user => user.id === experiment.userId));
  for (const model of seed.models) assert.ok(seed.experiments.some(exp => exp.id === model.linkedExperimentId && exp.userId === model.userId));
});

test('неверный пароль, неизвестный пользователь, неверный токен', async () => {
  assert.equal((await request('/login', 'POST', { email: 'admin@nexus.ai', password: 'incorrect' })).status, 400);
  assert.equal((await request('/login', 'POST', { email: 'missing@example.test', password: 'password' })).status, 400);
  assert.equal((await request('/experiments', 'GET', undefined, 'broken')).status, 401);
  for (const url of ['/experiments', '/experiments/exp-1337', '/models', '/users/1']) {
    assert.equal((await request(url, 'GET', undefined, null)).status, 401);
  }
});

test('регистрация, повторный email и повторный вход', async () => {
  const credentials = { name: 'Новый пользователь', email: ' NEW@example.test ', password: 'secret123' };
  const result = await request('/register', 'POST', credentials, null);
  assert.equal(result.status, 201);
  assert.ok(result.data.accessToken);
  assert.equal(result.data.user.email, 'new@example.test');
  assert.equal(result.data.user.password, undefined);
  assert.equal((await request('/register', 'POST', credentials, null)).status, 400);
  const login = await request('/login', 'POST', { email: 'new@example.test', password: 'secret123' }, null);
  assert.equal(login.status, 200);
  const profile = await request(`/users/${result.data.user.id}`, 'GET', undefined, login.data.accessToken);
  assert.equal(profile.data.name, credentials.name);
  assert.equal((await request(`/experiments?userId=${profile.data.id}`, 'GET', undefined, login.data.accessToken)).data.length, 0);
});

test('свой профиль без пароля; чужой профиль и обходы закрыты', async () => {
  const profile = await request('/users/1');
  assert.equal(profile.status, 200);
  assert.equal(profile.data.password, undefined);
  assert.equal((await request('/users/2')).status, 403);
  for (const url of ['/db', '/db.json', '/db.local.json', '/users', '/666/models', '/444/users']) {
    assert.equal((await fetch(base + url)).status, 404);
  }
  assert.equal((await request('/models?_expand=user')).status, 400);
  assert.equal((await request('/models/3', 'PUT', { userId: 1 })).status, 404);
});

test('фильтры по отдельности, вместе, пустая выдача и сброс', async () => {
  for (const [query, expected] of [
    ['date=2026-04-02', ['exp-1337']],
    ['accuracy_gte=0.92', ['exp-1337']],
    ['latencyMs_lte=60', ['exp-1285', 'exp-1212']],
    ['q=computer-vision', ['exp-1308']],
    ['q=BERT', ['exp-1337']],
    ['date=2026-04-02&accuracy_gte=0.9&latencyMs_lte=70&q=production', ['exp-1337']],
    ['accuracy_gte=1', []]
  ]) {
    const result = await request(`/experiments?${query}`);
    assert.equal(result.status, 200);
    assert.deepEqual(result.data.map(item => item.id), expected, query);
  }
  assert.equal((await request('/experiments')).data.length, seed.experiments.length);
  const own = (await request('/experiments?userId=1')).data;
  assert.ok(own.length && own.every(item => item.userId === 1));
});

test('детали разных экспериментов и скачивание настоящих артефактов', async () => {
  for (const experiment of seed.experiments) {
    const details = await request(`/experiments/${experiment.id}`);
    assert.equal(details.status, 200);
    assert.equal(details.data.name, experiment.name);
    assert.ok(details.data.logs.length);
    assert.equal(details.data.metrics.labels.length, details.data.metrics.accuracy.length);
    for (const artifact of details.data.artifacts) {
      const response = await fetch(base + artifact.url);
      assert.equal(response.status, 200);
      assert.equal((await response.arrayBuffer()).byteLength, artifact.size);
    }
  }
  assert.equal((await request('/experiments/not-found')).status, 404);
  assert.equal((await request('/models/99999', 'PATCH', { stage: 'Production' })).status, 404);
});

test('добавление версии, дубликат, статус и сохранение в базе', async () => {
  const model = { name: 'NLP-Transformer', version: '1.6.0', userId: 1, linkedExperimentId: 'exp-1337' };
  const created = await request('/models', 'POST', model);
  assert.equal(created.status, 201);
  createdId = created.data.id;
  assert.equal(created.data.stage, 'Staging');
  assert.equal((await request('/models', 'POST', model)).status, 409);
  assert.equal((await request(`/models/${createdId}`, 'PATCH', { stage: 'Production' })).status, 200);
  assert.equal((await request(`/models/${createdId}`)).data.stage, 'Production');
  const saved = JSON.parse(fs.readFileSync(database, 'utf8'));
  assert.equal(saved.models.find(item => item.id === createdId).stage, 'Production');
});

test('владелец модели проверяется сервером', async () => {
  assert.equal((await request('/models/1', 'PATCH', { stage: 'Archived' }, otherToken)).status, 403);
  assert.equal((await request('/models/1', 'PATCH', { userId: 2 })).status, 400);
  assert.equal((await request('/models/1', 'PATCH', { stage: 'invalid' })).status, 400);
  assert.equal((await request('/models', 'POST', { name: 'Other', version: '1.0.0', userId: 1, linkedExperimentId: 'exp-1337' }, otherToken)).status, 403);
  assert.equal((await request('/models', 'POST', { name: 'Other', version: '1.0.0', userId: 2, linkedExperimentId: 'exp-1337' }, otherToken)).status, 400);
});

test('статические артефакты и SVG-спрайт отдаются локально', async () => {
  for (const url of ['/sprite.svg', '/theme.js', '/artifacts/exp-1337-logs.txt']) {
    assert.equal((await fetch(base + url)).status, 200, url);
  }
});
