const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, readFileSync, rmSync, rmdirSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

test('mock API contracts on a disposable database', { timeout: 30000 }, async (t) => {
  const mockPath = path.resolve(__dirname, '..');
  const workingPath = path.join(mockPath, 'db.json');
  const readWorkingDatabase = () => {
    try {
      return readFileSync(workingPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }

      throw error;
    }
  };
  const original = readWorkingDatabase();
  const directory = mkdtempSync(path.join(tmpdir(), 'axon-api-'));
  const databasePath = path.resolve(directory, 'db.json');
  assert.equal(path.dirname(databasePath), directory);
  assert.notEqual(databasePath, workingPath);

  const server = spawn(process.execPath, [path.join(mockPath, 'server.cjs')], {
    cwd: mockPath,
    windowsHide: true,
    env: { ...process.env, AXON_DB_PATH: databasePath, AXON_PORT: '3002' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const closed = new Promise((resolve) => server.once('close', resolve));

  t.after(async () => {
    try {
      if (server.exitCode === null && server.signalCode === null) {
        server.kill();
      }

      await closed;
    } finally {
      assert.equal(path.dirname(databasePath), directory);
      rmSync(databasePath, { force: true });

      rmdirSync(directory);
      assert.deepEqual(readWorkingDatabase(), original, 'working database must not change');
    }
  });
  await new Promise((resolve, reject) => {
    let output = '';
    let errors = '';
    const timer = setTimeout(() => reject(new Error('Mock startup timed out')), 5000);
    server.stderr.on('data', (chunk) => {
      errors += chunk;
    });
    server.stdout.on('data', (chunk) => {
      output += chunk;

      if (output.includes('AxonHub mock: http://127.0.0.1:3002/resources')) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.once('exit', () => {
      clearTimeout(timer);
      reject(new Error(`Mock exited before tests: ${errors}`));
    });
  });

  async function request(url, status, { method = 'GET', body, token } = {}) {
    const response = await fetch(`http://127.0.0.1:3002${url}`, {
      method,
      signal: AbortSignal.timeout(3000),
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
    assert.equal(response.status, status, `${method} ${url}`);

    return response.json();
  }

  let owner;
  let other;
  let source;
  await t.test('public reads and endpoint/query allowlist', async () => {
    const resources = await request('/resources', 200);
    assert.ok(resources.length > 0);
    source = await request(`/resources/${resources[0].id}`, 200);
    await request('/resources/999999', 404);

    for (const url of ['/db', '/users', '/users/1', '/666/resources', '/644/resources']) {
      await request(url, 403);
    }

    for (const url of [
      '/resources?_expand=user',
      '/resources?_embed=stars',
      '/resources?userId=1&userId=2',
      '/resources?userId=invalid',
    ]) {
      await request(url, 400);
    }

    await request(`/resources/${source.id}`, 403, { method: 'PATCH', body: { name: 'Changed' } });
  });
  await t.test('registration and login return safe users', async () => {
    const account = {
      email: 'api-owner@example.test',
      password: 'ApiDemo2026!',
      displayName: 'API Owner',
    };
    owner = await request('/register', 201, { method: 'POST', body: account });
    other = await request('/register', 201, {
      method: 'POST',
      body: { ...account, email: 'api-other@example.test', displayName: 'API Other' },
    });

    const login = await request('/login', 200, {
      method: 'POST',
      body: { email: account.email, password: account.password },
    });

    for (const result of [owner, other, login]) {
      assert.equal(typeof result.accessToken, 'string');
      assert.ok(result.accessToken.length > 0);
      assert.deepEqual(Object.keys(result.user).sort(), ['displayName', 'email', 'id']);
    }

    assert.equal(login.user.id, owner.user.id);
    await request('/register', 409, { method: 'POST', body: account });
    await request('/register', 400, { method: 'POST', body: { ...account, id: 100 } });
    await request('/login', 400, {
      method: 'POST',
      body: { email: account.email, password: 'Incorrect123!' },
    });
  });

  const createdAt = new Date().toISOString();
  await t.test('relations enforce ownership and resource existence', async () => {
    for (const collection of ['stars', 'subscriptions']) {
      const url = `/${collection}`;
      const body = { userId: owner.user.id, resourceId: source.id, createdAt };
      await request(url, 401, { method: 'POST', body });
      await request(url, 403, { method: 'POST', body, token: other.accessToken });
      await request(url, 400, {
        method: 'POST',
        body: { ...body, id: 100 },
        token: owner.accessToken,
      });
      await request(url, 404, {
        method: 'POST',
        body: { ...body, resourceId: 999999 },
        token: owner.accessToken,
      });

      const relation = await request(url, 201, { method: 'POST', body, token: owner.accessToken });
      assert.ok(
        (await request(`${url}?resourceId=${source.id}`, 200)).some(
          (item) => item.id === relation.id,
        ),
      );
      await request(`${url}/${relation.id}`, 403, { method: 'DELETE', token: other.accessToken });
      await request(`${url}/${relation.id}`, 200, { method: 'DELETE', token: owner.accessToken });
      await request(`${url}/${relation.id}`, 404, { method: 'DELETE', token: owner.accessToken });
    }
  });
  await t.test('discussion updates and deletion belong to the author', async () => {
    const body = {
      userId: owner.user.id,
      resourceId: source.id,
      authorName: owner.user.displayName,
      body: 'Original comment',
      createdAt,
      updatedAt: createdAt,
    };
    await request('/discussions', 401, { method: 'POST', body });

    const comment = await request('/discussions', 201, {
      method: 'POST',
      body,
      token: owner.accessToken,
    });
    const url = `/discussions/${comment.id}`;
    const update = { body: 'Edited comment', updatedAt: createdAt };
    await request(url, 403, { method: 'PATCH', body: update, token: other.accessToken });
    await request(url, 403, { method: 'DELETE', token: other.accessToken });
    await request(url, 400, {
      method: 'PATCH',
      body: { ...update, userId: other.user.id },
      token: owner.accessToken,
    });

    const edited = await request(url, 200, {
      method: 'PATCH',
      body: update,
      token: owner.accessToken,
    });
    assert.equal(edited.body, update.body);
    assert.equal(edited.userId, owner.user.id);

    const comments = await request(
      `/discussions?resourceId=${source.id}&_sort=createdAt&_order=asc`,
      200,
    );
    assert.ok(comments.some((item) => item.id === comment.id && item.body === update.body));
    await request(url, 200, { method: 'DELETE', token: owner.accessToken });
    await request(url, 404, { method: 'PATCH', body: update, token: owner.accessToken });
  });
  await t.test('forks retain source metadata with a new owner and zero downloads', async () => {
    const { id, ...metadata } = source;
    const body = {
      ...metadata,
      name: `${source.name.slice(0, 73)} (fork)`,
      userId: owner.user.id,
      authorName: owner.user.displayName,
      sourceResourceId: id,
      downloadCount: 0,
    };
    await request('/resources', 401, { method: 'POST', body });
    await request('/resources', 403, { method: 'POST', body, token: other.accessToken });
    await request('/resources', 400, {
      method: 'POST',
      body: { ...body, description: 'Changed' },
      token: owner.accessToken,
    });

    const fork = await request('/resources', 201, {
      method: 'POST',
      body,
      token: owner.accessToken,
    });
    assert.notEqual(fork.id, id);
    assert.deepEqual(fork, { ...body, id: fork.id });
    assert.deepEqual(
      await request(`/resources?userId=${owner.user.id}&sourceResourceId=${id}`, 200),
      [fork],
    );

    for (const url of [
      `/stars?resourceId=${fork.id}`,
      `/subscriptions?resourceId=${fork.id}`,
      `/discussions?resourceId=${fork.id}&_sort=createdAt&_order=asc`,
    ]) {
      assert.deepEqual(await request(url, 200), []);
    }
  });
});
