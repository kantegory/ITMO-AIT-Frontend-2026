const path = require('path');
const crypto = require('crypto');
const jsonServer = require('json-server');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev_projecthub_secret';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'api', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

function base64UrlEncode(strOrBuf) {
  const buf = Buffer.isBuffer(strOrBuf) ? strOrBuf : Buffer.from(String(strOrBuf), 'utf8');
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str) {
  const normalized = String(str).replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 ? '='.repeat(4 - (normalized.length % 4)) : '';
  return Buffer.from(normalized + pad, 'base64').toString('utf8');
}

function signToken(payload) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(
    crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest()
  );
  return body + '.' + signature;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const body = parts[0];
  const signature = parts[1];

  const expectedSignature = base64UrlEncode(
    crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest()
  );

  if (signature.length !== expectedSignature.length) return null;
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(body));
  } catch {
    return null;
  }

  if (!payload || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
  return payload;
}

function getBearerToken(req) {
  const h = req.headers.authorization || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

function isProtectedRoute(req) {
  const protectedPrefixes = ['/projects', '/tasks', '/notifications', '/discussions', '/users', '/taskComments', '/taskFiles'];
  const p = req.path || '';
  return protectedPrefixes.some((prefix) => p === prefix || p.startsWith(prefix + '/'));
}

function publicUserProjection(user) {
  return user ? { id: user.id, name: user.name, email: user.email } : null;
}

server.post('/auth/login', (req, res) => {
  const db = router.db;
  const body = req.body || {};
  const email = body.email;
  const password = body.password;

  const user = db.get('users').find({ email: email }).value();
  if (!user || user.password !== password) {
    res.status(401).json({ message: 'Неверный email или пароль' });
    return;
  }

  const payload = {
    sub: user.id,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const token = signToken(payload);

  res.json({
    user: publicUserProjection(user),
    token,
  });
});

server.post('/auth/register', (req, res) => {
  const db = router.db;
  const body = req.body || {};
  const name = body.name;
  const email = body.email;
  const password = body.password;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Некорректные данные регистрации' });
    return;
  }

  const exists = db.get('users').find({ email: email }).value();
  if (exists) {
    res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    return;
  }

  const users = db.get('users').value() || [];
  const nextId = users.length ? Math.max.apply(null, users.map((u) => u.id || 0)) + 1 : 1;
  const user = { id: nextId, name, email, password };
  db.get('users').push(user).write();

  const payload = {
    sub: user.id,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const token = signToken(payload);

  res.json({
    user: publicUserProjection(user),
    token,
  });
});

server.use((req, res, next) => {
  if (!isProtectedRoute(req)) return next();

  const token = getBearerToken(req);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  req.user = { id: payload.sub };
  next();
});

server.get('/users', (req, res, next) => {
  if (!isProtectedRoute(req)) return next();
  const db = router.db;
  const users = db.get('users').value() || [];
  res.json(users.map(publicUserProjection));
});

server.use(router);

server.listen(PORT, () => {
  console.log('ProjectHub mock API running on http://localhost:' + PORT);
});
