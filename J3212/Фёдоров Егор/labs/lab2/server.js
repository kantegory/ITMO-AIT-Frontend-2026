const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({ static: __dirname });

const db = router.db;
const PORT = 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function parseToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function getCurrentUser(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const payload = parseToken(auth.slice(7));
  if (!payload) return null;
  return db.get('users').find({ id: payload.id }).value() || null;
}

function requireAuth(req, res, next) {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ error: 'Требуется авторизация.' });
  req.currentUser = user;
  next();
}

function addActivity(userId, text) {
  db.get('activity').unshift({
    id: Date.now(),
    userId,
    text,
    createdAt: new Date().toISOString(),
  }).write();
}

server.get('/', (_req, res) => res.redirect('/search.html'));

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Укажите email и пароль.' });
  }

  const user = db.get('users').find({ email: email.trim(), password }).value();
  if (!user) return res.status(401).json({ error: 'Неверный email или пароль.' });

  res.json({ token: createToken(user), user: sanitizeUser(user) });
});

server.post('/auth/register', (req, res) => {
  const { firstName, lastName, username, email, password } = req.body || {};
  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ error: 'Заполните все обязательные поля.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов.' });
  }
  if (db.get('users').find({ email: email.trim() }).value()) {
    return res.status(400).json({ error: 'Пользователь с таким email уже существует.' });
  }
  if (db.get('users').find({ username: username.trim() }).value()) {
    return res.status(400).json({ error: 'Такой логин уже занят.' });
  }

  const user = {
    id: Date.now(),
    name: `${firstName.trim()} ${lastName.trim()}`,
    username: username.trim().replace(/^@/, ''),
    email: email.trim(),
    password,
    bio: 'Новый участник ModelHub.',
    following: 0,
    followers: 0,
    joinedAt: new Date().toISOString().slice(0, 10),
  };
  db.get('users').push(user).write();
  res.status(201).json({ token: createToken(user), user: sanitizeUser(user) });
});

server.get('/auth/me', requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req.currentUser) });
});

server.get('/profile/summary', requireAuth, (req, res) => {
  const userId = req.currentUser.id;
  const publications = db.get('publications').filter({ userId }).value();
  const favorites = db.get('favorites').filter({ userId }).value();
  const subscriptions = db.get('subscriptions').filter({ userId }).value();
  const activity = db.get('activity').filter({ userId }).take(10).value();
  const commentsCount = db.get('comments').filter({ authorId: userId }).size().value();

  res.json({
    user: sanitizeUser(req.currentUser),
    stats: {
      favorites: favorites.length,
      publications: publications.length,
      subscriptions: subscriptions.length,
      comments: commentsCount,
    },
    publications,
    favorites,
    subscriptions,
    activity,
  });
});

server.get('/comments', (req, res) => {
  const { resourceType, resourceKey } = req.query;
  let items = db.get('comments');
  if (resourceType) items = items.filter({ resourceType });
  if (resourceKey) items = items.filter({ resourceKey });
  res.json(items.sortBy('createdAt').reverse().value());
});

server.post('/comments', requireAuth, (req, res) => {
  const { resourceType, resourceKey, text } = req.body || {};
  if (!resourceType || !resourceKey || !text?.trim()) {
    return res.status(400).json({ error: 'Недостаточно данных для комментария.' });
  }
  const comment = {
    id: Date.now(),
    resourceType,
    resourceKey,
    authorId: req.currentUser.id,
    author: `@${req.currentUser.username}`,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  db.get('comments').push(comment).write();
  addActivity(req.currentUser.id, `Вы оставили комментарий к ${resourceKey}.`);
  res.status(201).json(comment);
});

server.get('/favorites', requireAuth, (req, res) => {
  res.json(db.get('favorites').filter({ userId: req.currentUser.id }).value());
});

server.post('/favorites/toggle', requireAuth, (req, res) => {
  const { resourceType, resourceKey, title, author = '', subtitle = '', source = 'huggingface' } = req.body || {};
  if (!resourceType || !resourceKey || !title) {
    return res.status(400).json({ error: 'Не удалось определить элемент для избранного.' });
  }
  const existing = db.get('favorites').find({ userId: req.currentUser.id, resourceType, resourceKey }).value();
  if (existing) {
    db.get('favorites').remove({ id: existing.id }).write();
    addActivity(req.currentUser.id, `Вы удалили ${title} из избранного.`);
    return res.json({ active: false });
  }

  db.get('favorites').push({
    id: Date.now(),
    userId: req.currentUser.id,
    resourceType,
    resourceKey,
    title,
    author,
    subtitle,
    source,
  }).write();
  addActivity(req.currentUser.id, `Вы добавили ${title} в избранное.`);
  res.status(201).json({ active: true });
});

server.get('/favorites/check', requireAuth, (req, res) => {
  const { resourceType, resourceKey } = req.query;
  const existing = db.get('favorites').find({ userId: req.currentUser.id, resourceType, resourceKey }).value();
  res.json({ active: Boolean(existing) });
});

server.get('/subscriptions', requireAuth, (req, res) => {
  res.json(db.get('subscriptions').filter({ userId: req.currentUser.id }).value());
});

server.post('/publications', requireAuth, (req, res) => {
  const { title, type = 'Подборка', status = 'draft', resourceType = 'model', resourceKey = '' } = req.body || {};
  if (!title?.trim()) return res.status(400).json({ error: 'Введите название публикации.' });
  const item = {
    id: Date.now(),
    userId: req.currentUser.id,
    title: title.trim(),
    type,
    status,
    resourceType,
    resourceKey,
  };
  db.get('publications').push(item).write();
  addActivity(req.currentUser.id, `Вы создали публикацию «${item.title}».`);
  res.status(201).json(item);
});

server.get('/publications', requireAuth, (req, res) => {
  res.json(db.get('publications').filter({ userId: req.currentUser.id }).value());
});

server.use(router);

server.listen(PORT, () => {
  console.log(`ModelHub запущен на http://localhost:${PORT}`);
});
