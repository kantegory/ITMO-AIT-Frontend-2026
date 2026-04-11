const jsonServer = require('json-server');
const server     = jsonServer.create();
const router     = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({ static: '.' });

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

function getToken(req) {
  var auth = req.headers['authorization'] || '';
  return auth.replace('Bearer ', '').trim();
}

function checkAuth(req, res) {
  var token = getToken(req);
  if (!token) {
    res.status(401).json({ error: 'Необходима авторизация' });
    return null;
  }
  var db = router.db.getState();
  var session = db.sessions.find(function(s) { return s.token === token; });
  if (!session) {
    res.status(401).json({ error: 'Токен недействителен или истёк' });
    return null;
  }
  var user = db.users.find(function(u) { return u.id === session.userId; });
  if (!user) {
    res.status(401).json({ error: 'Пользователь не найден' });
    return null;
  }
  return user;
}

server.post('/auth/login', function (req, res) {
  var email    = (req.body.email    || '').trim();
  var password = (req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  var db   = router.db.getState();
  var user = db.users.find(function(u) {
    return u.email === email && u.password === password;
  });

  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  var token = 'mlp_' + Math.random().toString(36).slice(2) + Date.now().toString(36);

  var sessions = db.sessions || [];
  var filtered = sessions.filter(function(s) { return s.userId !== user.id; });
  filtered.push({ token: token, userId: user.id, createdAt: new Date().toISOString() });
  router.db.set('sessions', filtered).write();

  return res.status(200).json({
    token: token,
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role
    }
  });
});

server.post('/auth/register', function (req, res) {
  var name     = (req.body.name     || '').trim();
  var email    = (req.body.email    || '').trim();
  var password = (req.body.password || '');
  var role     = req.body.role === 'admin' ? 'Admin' : 'ML Engineer';

  if (!name || !email || password.length < 6) {
    return res.status(400).json({ error: 'Заполните все поля. Пароль минимум 6 символов.' });
  }

  var db = router.db.getState();
  var exists = db.users.find(function(u) { return u.email === email; });
  if (exists) {
    return res.status(409).json({ error: 'Email уже зарегистрирован' });
  }

  var newId = db.users.length ? Math.max.apply(null, db.users.map(function(u){return u.id;})) + 1 : 1;
  var newUser = { id: newId, email: email, password: password, name: name, role: role };
  router.db.get('users').push(newUser).write();

  var token = 'mlp_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  var sessions = db.sessions || [];
  sessions.push({ token: token, userId: newId, createdAt: new Date().toISOString() });
  router.db.set('sessions', sessions).write();

  return res.status(201).json({
    token: token,
    user: { id: newId, name: name, email: email, role: role }
  });
});

server.post('/auth/logout', function (req, res) {
  var token = getToken(req);
  var db = router.db.getState();
  var filtered = (db.sessions || []).filter(function(s) { return s.token !== token; });
  router.db.set('sessions', filtered).write();
  return res.status(200).json({ message: 'Выход выполнен' });
});

server.get('/auth/me', function (req, res) {
  var user = checkAuth(req, res);
  if (!user) return;
  return res.status(200).json({
    id: user.id, name: user.name, email: user.email, role: user.role
  });
});

var PROTECTED = ['/experiments', '/models', '/artifacts'];

server.use(function (req, res, next) {
  var isProtected = PROTECTED.some(function(path) {
    return req.path.startsWith(path);
  });
  if (!isProtected) return next();

  var user = checkAuth(req, res);
  if (!user) return;

  req.currentUser = user;
  next();
});

server.use(router);

server.listen(3001, function () {
  console.log('');
  console.log('  MLPipe Mock API запущен');
  console.log('  http://localhost:3001');
  console.log('');
  console.log('  Эндпоинты:');
  console.log('  POST /auth/login');
  console.log('  POST /auth/register');
  console.log('  POST /auth/logout');
  console.log('  GET  /auth/me');
  console.log('  GET  /experiments   (требует токен)');
  console.log('  GET  /models        (требует токен)');
  console.log('  GET  /artifacts     (требует токен)');
  console.log('');
});